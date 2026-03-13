import { Artifact, Client, CognitoGroup } from '../types';

// Configuration - Your deployed API Gateway endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

/**
 * Ensures the token is formatted correctly for the Authorization header.
 * Fixes "developer error": Strictly using Access Token format.
 */
function normalizeToken(token: string) {
  const t = (token || "").trim();
  if (!t) throw new Error("Missing auth token. Please sign in again.");
  // AWS Cognito Authorizers often expect the raw JWT without "Bearer " prefix
  return t;
}

/**
 * Robust fetch utility that parses JSON and surfaces backend error messages 
 * even for non-200 responses.
 */
async function fetchJson(url: string, opts: any = {}) {
    const { token, ...fetchOpts } = opts;
    const headers = new Headers(fetchOpts.headers || {});
    
    if (token) {
        headers.set("Authorization", normalizeToken(token));
    }
    
    if (!headers.has("Content-Type") && fetchOpts.body) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, { ...fetchOpts, headers, mode: "cors" });
    const text = await response.text();

    let body;
    try {
        body = text ? JSON.parse(text) : null;
        // Handle standard AWS Lambda Proxy Integration response format
        if (body && body.body !== undefined) {
            if (typeof body.body === 'string') {
                try { body = JSON.parse(body.body); } catch(e) { body = body.body; }
            } else { body = body.body; }
        }
    } catch (e) {
        body = { raw: text };
    }

    if (!response.ok) {
        const msg = body?.message || body?.error || body?.errorMessage || body?.raw || `HTTP ${response.status}`;
        throw new Error(`${fetchOpts.method || "GET"} ${url} failed (${response.status}): ${msg}`);
    }

    return body;
}

/**
 * Normalizes different backend list response formats.
 */
const normalizeList = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
        if (Array.isArray(data.items)) return data.items;
        if (Array.isArray(data.organizations)) return data.organizations;
        if (Array.isArray(data.orgs)) return data.orgs;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data.evidence)) return data.evidence;
    }
    return [];
};

export const api = {
  
  /**
   * GET /orgs - Primary bootstrap method.
   * Expects ACCESS_TOKEN.
   */
  getOrgs: async (accessToken: string): Promise<{ orgId: string, name: string, role: string, industry?: string, domain?: string }[]> => {
    const rawData = await fetchJson(`${API_BASE_URL}/orgs`, {
      method: 'GET',
      token: accessToken
    });
    
    const rawOrgs = normalizeList(rawData);
    
    return rawOrgs.map((o: any) => ({
        orgId: o.orgId || o.id,
        name: o.orgName || o.name || 'Unnamed Organization',
        role: o.role,
        createdAt: o.createdAt,
        memberStatus: o.memberStatus
    }));
  },

  /**
   * POST /orgs - Create new organization.
   */
  createOrg: async (accessToken: string, name: string, domain?: string): Promise<{ orgId: string, name: string }> => {
    const data = await fetchJson(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ name, domain, initialRole: 'Tenant_Admin' })
    });
    return {
        orgId: data.orgId,
        name: data.name
    };
  },

  /**
   * GET /orgs/discover - Tenant discovery.
   */
  getSuggestedOrgs: async (accessToken: string, domain: string): Promise<any[]> => {
      try {
        const data = await fetchJson(`${API_BASE_URL}/orgs/discover?domain=${domain}`, {
            method: 'GET',
            token: accessToken
        });
        return normalizeList(data);
      } catch (e) {
        console.error("Discovery error:", e);
        return [];
      }
  },

  joinOrg: async (accessToken: string, orgId: string): Promise<void> => {
      await fetchJson(`${API_BASE_URL}/orgs/${orgId}/join`, {
          method: 'POST',
          token: accessToken
      });
  },

  /**
   * Multi-step upload process matching your upload_request and upload_complete Lambdas.
   */
  uploadEvidence: async (accessToken: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    const cleanOrgId = (orgId || "").trim();
    const sanitizedReqId = (requirementId || "GENERAL").trim();

    const payload = {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        requirementId: sanitizedReqId
    };

    const data = await fetchJson(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload)
    });
    
    const { uploadUrl, evidenceId, requiredHeaders } = data;

    const s3Headers: Record<string, string> = { ...requiredHeaders };
    if (!s3Headers['Content-Type']) s3Headers['Content-Type'] = file.type || 'application/octet-stream';

    const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: s3Headers,
        body: file 
    });

    if (!s3Response.ok) {
        throw new Error(`S3 Transfer Failed: ${s3Response.status}`);
    }

    try {
        await fetchJson(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence/${evidenceId}/upload-complete`, {
          method: 'POST',
          token: accessToken
        });
    } catch (e) {
        console.warn("Completion signal timed out.");
    }

    return {
      id: evidenceId,
      requirementId: sanitizedReqId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: '', 
      timestamp: Date.now(),
      source: 'USER_UPLOAD'
    };
  },

  getDownloadUrl: async (accessToken: string, orgId: string, evidenceId: string): Promise<string> => {
    const data = await fetchJson(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/download-request`, {
      method: 'POST',
      token: accessToken
    });
    return data.downloadUrl; 
  },

  getEvidenceList: async (accessToken: string, orgId: string): Promise<Artifact[]> => {
    try {
        const data = await fetchJson(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
          method: 'GET',
          token: accessToken
        });
        const items = normalizeList(data);
        
        return items.map((item: any) => ({
          id: item.evidenceId,
          requirementId: item.requirementId,
          name: item.filename || item.name || item.filenameOriginal,
          type: (item.contentType || '').startsWith('image/') ? 'image' : 'document',
          url: '', 
          timestamp: item.uploadedAt ? new Date(item.uploadedAt).getTime() : Date.now(),
          source: 'USER_UPLOAD'
        }));
    } catch (e) {
        return [];
    }
  },

  /**
   * SECURE VAULT API (To be implemented in AWS)
   * These methods currently point to the local server for demo purposes,
   * but should be migrated to the AWS API Gateway.
   */
  getVaultSharedWithMe: async (accessToken: string, email: string): Promise<any[]> => {
    // In production, this would be: await fetchJson(`${API_BASE_URL}/vault/received`, { ... })
    const response = await fetch(`/api/documents/shared-with-me?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  getVaultMyDocuments: async (accessToken: string, email: string): Promise<any[]> => {
    // In production, this would be: await fetchJson(`${API_BASE_URL}/vault/sent`, { ... })
    const response = await fetch(`/api/documents/my-documents?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  shareVaultDocument: async (accessToken: string, payload: any): Promise<any> => {
    // In production, this would involve a pre-signed URL upload to S3
    const response = await fetch('/api/documents/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  },

  updateVaultStatus: async (accessToken: string, id: string, status: string, email: string): Promise<any> => {
    const response = await fetch(`/api/documents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, userEmail: email })
    });
    return response.json();
  },

  downloadVaultDocument: async (accessToken: string, id: string, email: string): Promise<any> => {
    const response = await fetch(`/api/documents/${id}/download?email=${encodeURIComponent(email)}`);
    return response.json();
  },

  deleteVaultDocument: async (accessToken: string, id: string, email: string): Promise<void> => {
    await fetch(`/api/documents/${id}?email=${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
  }
};
