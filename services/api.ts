
import { Artifact, Client, CognitoGroup } from '../types';
import { authConfig } from '../authConfig';

// Configuration - Your deployed API Gateway endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

/**
 * Robustly parses API response bodies which might be double-encoded or wrapped 
 * in standard AWS Lambda Proxy Integration formats.
 */
const parseResponseData = async (response: Response) => {
    let data;
    const text = await response.text();
    
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
  
  getOrgs: async (token: string): Promise<{ orgId: string, name: string, role: string, industry?: string, domain?: string }[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const rawData = await parseResponseData(response);
      return ensureArray(rawData);
    } catch (error) {
      console.error("API failure:", error);
      throw error;
    }
  },

  createOrg: async (token: string, name: string, domain?: string): Promise<{ orgId: string, name: string }> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
                'Authorization': `Bearer ${token.trim()}`,
                'Accept': 'application/json'
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
              'Content-Type': 'application/json',
              'Accept': 'application/json'
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
              'Content-Type': 'application/json',
              'Accept': 'application/json'
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
              'Authorization': `Bearer ${token.trim()}`,
              'Accept': 'application/json'
          }
      });
      if (!response.ok) throw new Error("Backend Admin Service failed to delete identity");
  },

  deleteTenant: async (token: string, orgId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/orgs/${orgId}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: { 
              'Authorization': `Bearer ${token.trim()}`,
              'Accept': 'application/json'
          }
      });
      if (!response.ok) throw new Error("Backend Admin Service failed to purge tenant");
  },

  uploadEvidence: async (token: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    if (!orgId) throw new Error("Organization ID is required for secure storage");
    
    // 1. Request presigned URL from Lambda
    const initResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/upload-request`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        requirementId: requirementId
      })
    });

    if (!initResponse.ok) {
        const errorData = await parseResponseData(initResponse);
        throw new Error(errorData?.message || `Failed to initiate secure upload: ${initResponse.status}`);
    }
    
    const { uploadUrl, evidenceId, requiredHeaders } = await parseResponseData(initResponse);

    // 2. DEFENSIVE HEADER FILTERING: S3 signatures fail if Host or Content-Length are manually passed
    const forbiddenHeaders = new Set(["host", "content-length", "connection", "user-agent", "expect"]);
    const safeHeaders: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(requiredHeaders || {})) {
      if (!forbiddenHeaders.has(key.toLowerCase())) {
        safeHeaders[key] = value as string;
      }
    }

    // Ensure Content-Type is set and matches what was signed
    if (!safeHeaders['Content-Type'] && !safeHeaders['content-type']) {
        safeHeaders['Content-Type'] = file.type || 'application/octet-stream';
    }

    // 3. Direct upload to S3 using the presigned URL
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: safeHeaders, 
      body: file
    });

    if (!s3Response.ok) {
        const errorText = await s3Response.text().catch(() => "Unknown S3 error");
        console.error("S3 Transfer Failure:", errorText);
        throw new Error(`Binary transfer to S3 vault failed: ${s3Response.status}`);
    }

    // 4. Confirm completion to finalize DynamoDB record
    const completeResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/upload-complete`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!completeResponse.ok) {
        console.warn("Evidence linked to S3 but metadata confirmation failed.");
    }

    return {
      id: evidenceId,
      requirementId: requirementId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: '', 
      timestamp: Date.now(),
      source: 'USER_UPLOAD'
    };
  },

  getDownloadUrl: async (token: string, orgId: string, evidenceId: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/download-request`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Access denied to artifact');
    const data = await parseResponseData(response);
    return data.downloadUrl; 
  },

  getEvidenceList: async (token: string, orgId: string): Promise<Artifact[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
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
