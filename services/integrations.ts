import { Artifact, IntegrationConfig } from '../types';

// Mock data responses for different integrations
const MOCK_M365_DATA = {
    users: [
        { displayName: 'Alice Admin', userPrincipalName: 'alice@msp.com', mfaEnabled: true },
        { displayName: 'Bob Sales', userPrincipalName: 'bob@client.com', mfaEnabled: true },
    ],
    secureScore: 85,
    policies: [
        { name: 'Global MFA Policy', state: 'Enabled' },
        { name: 'Block Legacy Auth', state: 'Enabled' }
    ]
};

const MOCK_AWS_DATA = {
    buckets: [
        { name: 'cui-data-store', encryption: 'AES-256', publicAccess: 'Blocked' },
        { name: 'public-web-assets', encryption: 'None', publicAccess: 'Allowed' }
    ],
    iamPolicies: [
        { name: 'AdminAccess', mfaRequired: true }
    ]
};

export const fetchAutomatedEvidence = async (
    source: 'M365' | 'AWS' | 'Google' | 'SIEM',
    requirementId: string,
    config: IntegrationConfig
): Promise<Artifact | null> => {
    
    if (!config.enabled) {
        throw new Error(`${source} integration is not enabled.`);
    }

    console.log(`Fetching evidence from ${source} for Req ${requirementId}...`);
    
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    let content = "";
    let title = "";

    // Simple logic to map specific requirements to specific API calls
    if (source === 'M365') {
        if (requirementId === '3.5.3' || requirementId.includes('MFA') || requirementId === '3.1.1') {
            title = 'Entra ID MFA Report.json';
            content = JSON.stringify(MOCK_M365_DATA.users, null, 2);
        } else if (requirementId === '3.12.1' || requirementId === '3.11.1') {
            title = 'Microsoft Secure Score.json';
            content = JSON.stringify({ score: MOCK_M365_DATA.secureScore, date: new Date().toISOString() }, null, 2);
        } else {
            title = 'M365 Tenant Configuration.json';
            content = JSON.stringify(MOCK_M365_DATA, null, 2);
        }
    } else if (source === 'AWS') {
        if (requirementId === '3.13.1' || requirementId === '3.1.3') {
            title = 'AWS S3 Bucket Policy Audit.json';
            content = JSON.stringify(MOCK_AWS_DATA.buckets, null, 2);
        } else {
            title = 'AWS IAM Report.json';
            content = JSON.stringify(MOCK_AWS_DATA.iamPolicies, null, 2);
        }
    } else if (source === 'SIEM') {
        title = 'SIEM Log Sample.log';
        content = `[${new Date().toISOString()}] EVENT: User_Login_Success USER: alice@msp.com IP: 192.168.1.5\n[${new Date().toISOString()}] EVENT: File_Access_CUI FILE: secrets.pdf`;
    } else {
        title = `${source} Generic Export.json`;
        content = JSON.stringify({ status: "OK", timestamp: Date.now() }, null, 2);
    }

    // Create the artifact
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    return {
        id: `AUTO-${Date.now()}`,
        requirementId: requirementId,
        name: title,
        type: source === 'SIEM' ? 'document' : 'json',
        url: url,
        timestamp: Date.now(),
        source: 'API_AUTO',
        notes: `Automatically collected from ${source} API`
    };
};