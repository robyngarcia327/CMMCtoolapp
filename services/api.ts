import { Artifact, Client, CognitoGroup, Vendor } from '../types';

// API Gateway base URL. VITE_API_BASE_URL is injected by Amplify at build time.
// The production fallback prevents the SPA host from accidentally receiving API requests.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'
).replace(/\/$/, '');

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
    // Prevent calls with "undefined" or empty orgId in the URL
    if (url.includes('/orgs/undefined/') || url.includes('/orgs//')) {
        console.error("API call blocked: Invalid orgId in URL", url);
        throw new Error("Organization context is missing. Please select an organization.");
    }

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
        let msg = `[${response.status}] ${url}: ` + (body?.message || body?.error || body?.errorMessage || body?.raw || `HTTP ${response.status}`);
        if (typeof msg === 'object') {
            msg = (msg as any).message || JSON.stringify(msg);
        }
        if (msg.length > 500) msg = msg.substring(0, 500) + "...";
        throw new Error(msg);
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
        // Lambda returns orgId (lowercase d) — normalize both cases defensively
        orgId: data.orgId || data.orgID,
        name: data.name || data.orgName || name,
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

    // Normalize MIME type to avoid "Unsupported MIME type" errors from backend
    // Some backends have strict whitelists or length limits on Content-Type
    let contentType = file.type || 'application/octet-stream';
    if (contentType.length > 64 || contentType.includes('officedocument')) {
        contentType = 'application/octet-stream';
    }

    const payload = {
        filename: file.name,
        contentType,
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
   * VENDOR MANAGEMENT API
   */
  getVendors: async (accessToken: string, orgId: string): Promise<Vendor[]> => {
    return await fetchJson(`${API_BASE_URL}/vendors?orgId=${orgId}`, {
      method: 'GET',
      token: accessToken
    });
  },

  createVendor: async (accessToken: string, orgId: string, vendor: Omit<Vendor, 'id' | 'createdAt'>): Promise<Vendor> => {
    return await fetchJson(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ ...vendor, orgId })
    });
  },

  updateVendor: async (accessToken: string, orgId: string, id: string, updates: Partial<Vendor>): Promise<Vendor> => {
    return await fetchJson(`${API_BASE_URL}/vendors/${id}`, {
      method: 'PATCH',
      token: accessToken,
      body: JSON.stringify({ ...updates, orgId })
    });
  },

  deleteVendor: async (accessToken: string, orgId: string, id: string): Promise<void> => {
    await fetchJson(`${API_BASE_URL}/vendors/${id}?orgId=${orgId}`, {
      method: 'DELETE',
      token: accessToken
    });
  },

  /**
   * BILLING & SUBSCRIPTION API
   */
  createCheckoutSession: async (
    accessToken: string,
    orgId: string,
    planCode: 'starter' | 'professional' | 'guided' | 'msp',
    interval: 'month' | 'year' = 'month',
    managedClientCount?: number
  ): Promise<{ url: string; sessionId: string }> => {
    return await fetchJson(`${API_BASE_URL}/billing/checkout-session`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ orgId, planCode, interval, managedClientCount })
    });
  },

  getBillingStatus: async (accessToken: string, orgId: string): Promise<any> => {
    return await fetchJson(`${API_BASE_URL}/billing/status?orgId=${orgId}`, {
      method: 'GET',
      token: accessToken
    });
  },

  createPortalSession: async (accessToken: string, orgId: string): Promise<{ url: string }> => {
    return await fetchJson(`${API_BASE_URL}/billing/portal-session`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ orgId })
    });
  },

  cancelSubscription: async (accessToken: string, orgId: string): Promise<{ status: string }> => {
    return await fetchJson(`${API_BASE_URL}/billing/cancel`, {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify({ orgId })
    });
  }
};
