import { Artifact, Client } from '../types';

// Configuration - Updated API Gateway Endpoint
const API_BASE_URL = 'https://irwrdtn81b.execute-api.us-east-1.amazonaws.com/CualleeCyberEvidence'; 

export const api = {
  
  /**
   * 1. GET /orgs
   * Fetches the list of organizations the authenticated user belongs to.
   */
  getOrgs: async (accessToken: string): Promise<{ orgId: string, name: string, role: string }[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error (getOrgs):", {
            status: response.status,
            statusText: response.statusText,
            body: errorBody
        });
        throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Network or parsing error in getOrgs:", error);
      throw error;
    }
  },

  /**
   * Create Organization
   * POST /orgs
   */
  createOrg: async (accessToken: string, name: string): Promise<{ orgId: string, name: string }> => {
    const response = await fetch(`${API_BASE_URL}/orgs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error (createOrg):", { status: response.status, body: errorText });
        throw new Error(errorText || 'Failed to create organization');
    }

    return await response.json();
  },

  /**
   * 2. Evidence Upload Flow (3 Steps)
   */
  uploadEvidence: async (accessToken: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    
    // Step A: POST /orgs/{orgId}/evidence/upload-request
    // We request a presigned URL to upload the file
    const initResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/upload-request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    
    const { uploadUrl, evidenceId, requiredHeaders } = await initResponse.json();

    // Step B: PUT file to uploadUrl (S3 Presigned URL)
    // IMPORTANT: Must use the exact Content-Type returned by the backend
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: requiredHeaders, // e.g. { "Content-Type": "image/png" }
      body: file
    });

    if (!s3Response.ok) throw new Error('Failed to upload file to storage');

    // Step C: POST /orgs/{orgId}/evidence/{evidenceId}/upload-complete
    // Notify backend that upload is finished so it can be marked as 'uploaded'
    const completeResponse = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/upload-complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!completeResponse.ok) throw new Error('Failed to complete upload registration');

    // Return a constructed Artifact object for the frontend state
    return {
      id: evidenceId,
      requirementId: requirementId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: '', // URL is fetched on demand via download request
      timestamp: Date.now(),
      source: 'USER_UPLOAD'
    };
  },

  /**
   * 3. Evidence Download Flow
   */
  getDownloadUrl: async (accessToken: string, orgId: string, evidenceId: string): Promise<string> => {
    // POST /orgs/{orgId}/evidence/{evidenceId}/download-request
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/download-request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to get download link');

    const data = await response.json();
    return data.downloadUrl; // The short-lived presigned URL
  },

  /**
   * Fetch List of Evidence for an Org
   * GET /orgs/{orgId}/evidence
   */
  getEvidenceList: async (accessToken: string, orgId: string): Promise<Artifact[]> => {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    // Map backend response to frontend Artifact type
    return data.map((item: any) => ({
      id: item.evidenceId,
      requirementId: item.requirementId,
      name: item.filename,
      type: item.contentType?.startsWith('image/') ? 'image' : 'document',
      url: '', // On-demand
      timestamp: new Date(item.createdAt).getTime(),
      source: 'USER_UPLOAD'
    }));
  }
};