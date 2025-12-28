
import { Artifact } from '../types';

// Configuration - Updated API Gateway Endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

/**
 * Robustly parses API response bodies which might be double-encoded or wrapped 
 * in standard AWS Lambda Proxy Integration formats.
 */
const parseResponseData = async (response: Response) => {
    let data = await response.json();
    
    // AWS Lambda Proxy Integration Robustness:
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
    }
    
    // If Lambda returns { "statusCode": 200, "body": "{...}" }
    if (data && data.body) {
        if (typeof data.body === 'string') {
            try { data = JSON.parse(data.body); } catch(e) {}
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
    if (Array.isArray(data)) return data;
    if (!data) return [];
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.organizations)) return data.organizations;
    if (Array.isArray(data.evidence)) return data.evidence;
    
    // If it's a single object with an ID, it might be the only item
    if (data.orgId || data.evidenceId) return [data];
    
    return [];
};

export const api = {
  
  /**
   * 1. GET /orgs
   * Fetches the list of organizations the authenticated user belongs to.
   */
  getOrgs: async (token: string): Promise<{ orgId: string, name: string, role: string }[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error (getOrgs):", {
            status: response.status,
            body: errorBody
        });
        throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
      }

      const data = await parseResponseData(response);
      return ensureArray(data);
    } catch (error) {
      console.error("Network or parsing error in getOrgs:", error);
      throw error;
    }
  },

  /**
   * Create Organization
   * POST /orgs
   */
  createOrg: async (token: string, name: string): Promise<{ orgId: string, name: string }> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error (createOrg):", { status: response.status, body: errorText });
        throw new Error(errorText || 'Failed to create organization');
    }

    return await parseResponseData(response);
  },

  /**
   * 2. Evidence Upload Flow (3 Steps)
   */
  uploadEvidence: async (token: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    
    // Step A: POST /orgs/{orgId}/evidence/upload-request
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

    // Step B: PUT file to uploadUrl (S3 Presigned URL)
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: requiredHeaders, 
      body: file
    });

    if (!s3Response.ok) throw new Error('Failed to upload file to storage');

    // Step C: POST /orgs/{orgId}/evidence/{evidenceId}/upload-complete
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
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return [];

    const data = await parseResponseData(response);
    const items = ensureArray(data);

    return items.map((item: any) => ({
      id: item.evidenceId,
      requirementId: item.requirementId,
      name: item.filename,
      type: item.contentType?.startsWith('image/') ? 'image' : 'document',
      url: '', 
      timestamp: new Date(item.createdAt).getTime(),
      source: 'USER_UPLOAD'
    }));
  }
};
