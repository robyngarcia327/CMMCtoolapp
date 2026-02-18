import { Artifact, Client, CognitoGroup } from '../types';

// Configuration - Your deployed API Gateway endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

/**
 * Robustly parses API response bodies which might be double-encoded or wrapped 
 * in standard AWS Lambda Proxy Integration formats.
 */
const parseResponseData = async (response: Response) => {
    const text = await response.text();
    let data;
    
    try {
        data = JSON.parse(text);
    } catch (e) {
        return text;
    }
    
    if (data && data.body !== undefined) {
        if (typeof data.body === 'string') {
            try {
                data = JSON.parse(data.body);
            } catch(e) {
                data = data.body;
            }
        } else {
            data = data.body;
        }
    }

    return data;
};

const ensureArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
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
   * GET /orgs - Bootstraps the application.
   * Returns only organizations where the current user (from token sub) is a member.
   * If the list is empty [], the user is not yet associated with a tenant.
   */
  getOrgs: async (token: string): Promise<{ orgId: string, name: string, role: string, industry?: string, domain?: string }[]> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`
      }
    });
    
    if (!response.ok) {
        // Explicitly throw so the UI can distinguish between "No Orgs" (200 []) and "Network Error"
        throw new Error(`Bootstrap failed: Server returned ${response.status}`);
    }
    
    const rawData = await parseResponseData(response);
    return ensureArray(rawData);
  },

  createOrg: async (token: string, name: string, domain?: string): Promise<{ orgId: string, name: string }> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, domain, initialRole: 'Tenant_Admin' })
    });
    if (!response.ok) throw new Error('Failed to create organization');
    return await parseResponseData(response);
  },

  getSuggestedOrgs: async (token: string, domain: string): Promise<any[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/orgs/discover?domain=${domain}`, {
            mode: 'cors',
            headers: { 
                'Authorization': `Bearer ${token.trim()}`
            }
        });
        if (!response.ok) return [];
        const rawData = await parseResponseData(response);
        return ensureArray(rawData);
      } catch (e) {
        return [];
      }
  },

  joinOrg: async (token: string, orgId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/join`, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Authorization': `Bearer ${token.trim()}`,
              'Content-Type': 'application/json'
          }
      });
      if (!response.ok) throw new Error("Failed to join organization");
  },

  promoteUser: async (token: string, userId: string, group: CognitoGroup): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/users/promote`, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Authorization': `Bearer ${token.trim()}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, targetGroup: group })
      });
      if (!response.ok) throw new Error("Backend Admin Service failed to promote user");
  },

  deleteUser: async (token: string, userId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: { 
              'Authorization': `Bearer ${token.trim()}`
          }
      });
      if (!response.ok) throw new Error("Backend Admin Service failed to delete identity");
  },

  deleteTenant: async (token: string, orgId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/orgs/${orgId}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: { 
              'Authorization': `Bearer ${token.trim()}`
          }
      });
      if (!response.ok) throw new Error("Backend Admin Service failed to purge tenant");
  },

  uploadEvidence: async (token: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    const cleanOrgId = (orgId || "").trim();
    if (!cleanOrgId) throw new Error("Organization Identity is missing.");
    
    const cleanToken = (token || "").trim();
    const sanitizedReqId = (requirementId || "GENERAL").trim();

    // 1. Handshake with API Gateway for a presigned PUT URL
    const payload = {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        requirementId: sanitizedReqId
    };

    const initResponse = await fetch(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!initResponse.ok) {
        const errorBody = await parseResponseData(initResponse);
        const msg = typeof errorBody === 'string' ? errorBody : (errorBody?.message || errorBody?.errorMessage || "Handshake rejected by validator");
        throw new Error(`Vault Handshake Failed (${initResponse.status}): ${msg}`);
    }
    
    const data = await parseResponseData(initResponse);
    const { uploadUrl, evidenceId, requiredHeaders } = data;

    if (!uploadUrl || !evidenceId) {
        throw new Error("Handshake failed: Missing uploadUrl or evidenceId in response.");
    }

    // 2. Binary Transfer to S3 via PUT (Raw File Body)
    const cleanHeaders: Record<string, string> = {};
    const headersToProcess = requiredHeaders || {};
    const restricted = new Set(["host", "content-length", "connection", "user-agent", "expect"]);
    
    Object.entries(headersToProcess).forEach(([k, v]) => {
        if (!restricted.has(k.toLowerCase())) cleanHeaders[k] = v as string;
    });
    
    if (!cleanHeaders['Content-Type'] && !cleanHeaders['content-type']) {
        cleanHeaders['Content-Type'] = file.type || 'application/octet-stream';
    }

    const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: cleanHeaders,
        body: file 
    });

    if (!s3Response.ok) {
        const errorText = await s3Response.text().catch(() => "Unknown transfer error");
        console.error("S3 PUT Failure:", s3Response.status, errorText);
        throw new Error(`S3 Vault Transfer Failed: ${s3Response.status}. Verify CORS and Content-Type alignment.`);
    }

    // 3. Metadata Confirmation
    try {
        await fetch(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence/${evidenceId}/upload-complete`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          }
        });
    } catch (e) {
        console.warn("Evidence transferred to S3 but completion indexing response timed out.");
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

  getDownloadUrl: async (token: string, orgId: string, evidenceId: string): Promise<string> => {
    const cleanOrgId = (orgId || "").trim();
    const response = await fetch(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence/${evidenceId}/download-request`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Secure download request rejected.');
    const data = await parseResponseData(response);
    return data.downloadUrl; 
  },

  getEvidenceList: async (token: string, orgId: string): Promise<Artifact[]> => {
    const cleanOrgId = (orgId || "").trim();
    if (!cleanOrgId) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/orgs/${cleanOrgId}/evidence`, {
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token.trim()}`
          }
        });
        if (!response.ok) return [];
        const rawData = await parseResponseData(response);
        const items = ensureArray(rawData);
        return items.map((item: any) => ({
          id: item.evidenceId || item.id,
          requirementId: item.requirementId,
          name: item.filename || item.name,
          type: (item.contentType || '').startsWith('image/') ? 'image' : 'document',
          url: '', 
          timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
          source: 'USER_UPLOAD'
        }));
    } catch (e) {
        return [];
    }
  }
};
