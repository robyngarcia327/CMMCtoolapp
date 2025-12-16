import { Artifact, Client } from '../types';

// Configuration - Updated API Gateway Endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

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

      let data = await response.json();
      
      // AWS Lambda Proxy Integration Robustness:
      // Sometimes the body is double-encoded or wrapped in a "body" property
      if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch(e) { console.warn("Failed to parse string response", e); }
      }
      if (data && data.body && typeof data.body === 'string') {
          try { data = JSON.parse(data.body); } catch(e) { console.warn("Failed to parse inner body", e); }
      }

      // Handle wrapped arrays (e.g. { data: [...] } or { items: [...] })
      if (!Array.isArray(data)) {
          if (Array.isArray(data.data)) data = data.data;
          else if (Array.isArray(data.items)) data = data.items;
          else if (Array.isArray(data.organizations)) data = data.organizations;
          else {
              console.warn("getOrgs response is not an array:", data);
              // Fallback: if it's a single object, maybe wrap it?
              if (data && data.orgId) return [data];
              return [];
          }
      }

      return data;
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
        // We throw, but the frontend app will catch this and try to verify existence
        // in case the backend wrote to DB but crashed on return.
        throw new Error(errorText || 'Failed to create organization');
    }

    let data = await response.json();
    
    // Robust parsing for POST response as well
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
    }
    if (data && data.body && typeof data.body === 'string') {
        try { data = JSON.parse(data.body); } catch(e) {}
    }

    return data;
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
    
    let initData = await initResponse.json();
    if (initData.body && typeof initData.body === 'string') {
        initData = JSON.parse(initData.body);
    }
    
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

    let data = await response.json();
    if (data.body && typeof data.body === 'string') data = JSON.parse(data.body);
    
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

    let data = await response.json();
    
    // Robust parsing
    if (typeof data === 'string') { try { data = JSON.parse(data); } catch(e){} }
    if (data && data.body && typeof data.body === 'string') { try { data = JSON.parse(data.body); } catch(e){} }
    if (!Array.isArray(data)) {
        // Try common wrappers
        if (Array.isArray(data.items)) data = data.items;
        else if (Array.isArray(data.data)) data = data.data;
        else return [];
    }

    return data.map((item: any) => ({
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