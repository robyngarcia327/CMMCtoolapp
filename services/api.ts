
import { Artifact, Client } from '../types';

// Configuration - API Gateway Endpoint
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
        // Not JSON, return as is (could be an error string)
        return text;
    }
    
    // AWS Lambda Proxy Integration Robustness:
    // If Lambda returns { "statusCode": 200, "body": "{...}" }
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

/**
 * Ensures a data object is transformed into an array, checking common wrappers.
 */
const ensureArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    
    // Check known wrappers returned by various backend versions
    if (data && typeof data === 'object') {
        if (Array.isArray(data.items)) return data.items;
        if (Array.isArray(data.organizations)) return data.organizations;
        if (Array.isArray(data.orgs)) return data.orgs;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data.evidence)) return data.evidence;
        
        // If it's a single object with an identifying field, wrap it
        if (data.orgId || data.OrgId || data.evidenceId || data.name || data.Name) return [data];
    }
    
    return [];
};

export const api = {
  
  /**
   * 1. GET /orgs
   * Fetches the list of organizations the authenticated user belongs to.
   */
  getOrgs: async (token: string): Promise<{ orgId: string, name: string, role: string, industry?: string, domain?: string }[]> => {
    console.debug("API Request: GET /orgs");
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error (getOrgs):", {
            status: response.status,
            body: errorBody
        });
        throw new Error(`Server returned ${response.status}: ${errorBody || response.statusText}`);
      }

      const rawData = await parseResponseData(response);
      const items = ensureArray(rawData);
      
      return items;
    } catch (error) {
      console.error("API Network/CORS failure:", error);
      throw error;
    }
  },

  /**
   * Create Organization
   * POST /orgs
   */
  createOrg: async (token: string, name: string, domain?: string): Promise<{ orgId: string, name: string }> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, domain })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error (createOrg):", { status: response.status, body: errorText });
        throw new Error(errorText || 'Failed to create organization');
    }

    return await parseResponseData(response);
  },

  /**
   * Domain Discovery (Simulated)
   * GET /orgs/suggested?domain=xyz.com
   */
  getSuggestedOrgs: async (token: string, domain: string): Promise<any[]> => {
      // In a real implementation, this would call a specialized endpoint 
      // that returns organizations matching a domain even if the user isn't a member yet.
      console.debug(`Discovering organizations for domain: ${domain}`);
      
      // For this prototype, we simulate finding a matching org if the domain matches
      // the existing established organizations in the pool.
      try {
        const allOrgs = await api.getOrgs(token);
        return allOrgs.filter(o => o.domain === domain);
      } catch (e) {
        return [];
      }
  },

  /**
   * Join Organization
   * POST /orgs/{id}/join
   */
  joinOrg: async (token: string, orgId: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/join`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });
      if (!response.ok) throw new Error("Failed to join organization");
  },

  /**
   * 2. Evidence Upload Flow (3 Steps)
   */
  uploadEvidence: async (token: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    const initResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/upload-request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        requirementId: requirementId
      })
    });

    if (!initResponse.ok) {
        const err = await initResponse.text();
        throw new Error(`Failed to initiate upload: ${err}`);
    }
    
    const initData = await parseResponseData(initResponse);
    const { uploadUrl, evidenceId, requiredHeaders } = initData;

    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: requiredHeaders, 
      body: file
    });

    if (!s3Response.ok) throw new Error('Failed to upload file to storage');

    const completeResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/upload-complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!completeResponse.ok) throw new Error('Failed to complete upload registration');

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

  /**
   * 3. Evidence Download Flow
   */
  getDownloadUrl: async (token: string, orgId: string, evidenceId: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/download-request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to get download link');

    const data = await parseResponseData(response);
    return data.downloadUrl; 
  },

  /**
   * Fetch List of Evidence for an Org
   */
  getEvidenceList: async (token: string, orgId: string): Promise<Artifact[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) return [];

        const rawData = await parseResponseData(response);
        const items = ensureArray(rawData);

        return items.map((item: any) => ({
          id: item.evidenceId || item.EvidenceId,
          requirementId: item.requirementId || item.RequirementId,
          name: item.filename || item.Filename || item.name,
          type: (item.contentType || item.ContentType || '').startsWith('image/') ? 'image' : 'document',
          url: '', 
          timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
          source: 'USER_UPLOAD'
        }));
    } catch (e) {
        console.warn("getEvidenceList failed silently", e);
        return [];
    }
  }
};
