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
    
    // Handle standard AWS Lambda Proxy Integration response format
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

export const api = {
  
  /**
   * GET /orgs - Primary bootstrap method.
   * Matches 'list_orgs' Lambda: returns { "orgs": [...] }
   * Items use: orgId, orgName, role, memberStatus, createdAt
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
        throw new Error(`Connection rejected by vault (${response.status}). Verify permissions.`);
    }
    
    const data = await parseResponseData(response);
    const rawOrgs = Array.isArray(data) ? data : (data.orgs || []);
    
    return rawOrgs.map((o: any) => ({
        orgId: o.orgId,
        name: o.orgName || o.name || 'Unnamed Organization', // Map orgName from Lambda
        role: o.role,
        createdAt: o.createdAt,
        memberStatus: o.memberStatus
    }));
  },

  /**
   * POST /orgs - Create new organization.
   * Matches 'create_org' Lambda: returns { orgId, name, storagePrefix, createdAt }
   */
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
    const data = await parseResponseData(response);
    return {
        orgId: data.orgId,
        name: data.name
    };
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
        const data = await parseResponseData(response);
        return Array.isArray(data) ? data : (data.items || data.orgs || []);
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

  /**
   * 3-Step Upload Flow
   * Matches 'upload_request' and 'upload_complete' Lambdas.
   */
  uploadEvidence: async (token: string, orgId: string, file: File, requirementId: string): Promise<Artifact> => {
    const cleanOrgId = (orgId || "").trim();
    const cleanToken = (token || "").trim();
    const sanitizedReqId = (requirementId || "GENERAL").trim();

    // 1. Handshake: POST /orgs/{id}/evidence
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
        const msg = errorBody?.error || errorBody?.message || "Handshake failed";
        throw new Error(`Vault Handshake Failed: ${msg}`);
    }
    
    const data = await parseResponseData(initResponse);
    const { uploadUrl, evidenceId, requiredHeaders } = data;

    // 2. Binary Transfer to S3 via PUT
    // Use headers required by the presigned URL signature
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

    // 3. Confirmation: POST /orgs/{id}/evidence/{evidenceId}/upload-complete
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
        console.warn("Completion signal timed out, but file was transferred.");
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

  /**
   * POST /orgs/{id}/evidence/{evId}/download-request
   * Matches 'download_request' Lambda.
   */
  getDownloadUrl: async (token: string, orgId: string, evidenceId: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence/${evidenceId}/download-request`, {
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

  /**
   * GET /orgs/{id}/evidence
   * Matches 'list_evidence' Lambda: returns { "evidence": [...] }
   * Items use: evidenceId, filename, contentType, sizeBytes, status, etc.
   */
  getEvidenceList: async (token: string, orgId: string): Promise<Artifact[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/orgs/${orgId}/evidence`, {
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token.trim()}`
          }
        });
        if (!response.ok) return [];
        const data = await parseResponseData(response);
        const items = data.evidence || [];
        
        return items.map((item: any) => ({
          id: item.evidenceId,
          requirementId: item.requirementId,
          name: item.filename, // Lambda maps filenameOriginal to 'filename'
          type: (item.contentType || '').startsWith('image/') ? 'image' : 'document',
          url: '', 
          timestamp: item.uploadedAt ? new Date(item.uploadedAt).getTime() : Date.now(),
          source: 'USER_UPLOAD'
        }));
    } catch (e) {
        return [];
    }
  }
};