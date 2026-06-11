import { Asset, User, IntegrationConfig, UserRole, Risk } from '../types';

/**
 * Mock automated evidence collection
 */
export const fetchAutomatedEvidence = async (
  source: 'M365' | 'AWS' | 'SIEM',
  requirementId: string,
  config: IntegrationConfig
): Promise<any> => {
    if (!config.enabled) throw new Error(`${source} integration not enabled`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        id: `AUTO-${Date.now()}`,
        requirementId,
        name: `${source}_Evidence_${requirementId.replace(/\./g, '_')}.json`,
        type: 'json',
        url: '',
        timestamp: Date.now(),
        source: 'API_AUTO'
    };
};

export const integrationService = {
  /**
   * Parses CSV string into Asset objects
   * Expected format: Name,Type,Owner,Location,Category,Criticality
   */
  parseAssetCsv: (csvText: string): Partial<Asset>[] => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const asset: any = { source: 'CSV_Import', lastSynced: Date.now() };
      
      headers.forEach((header, i) => {
        const val = values[i];
        if (!val) return;

        if (header === 'name') asset.name = val;
        if (header === 'type') asset.type = val;
        if (header === 'owner') asset.owner = val;
        if (header === 'location') asset.location = val;
        if (header === 'category') asset.cmmcCategory = val;
        if (header === 'criticality') asset.criticality = val;
      });
      
      return asset;
    });
  },

  /**
   * Parses CSV string into User objects
   * Expected format: Name,Email,Role,Department,MFA_Enabled
   */
  parseUserCsv: (csvText: string): Partial<User>[] => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const user: any = { iamSource: 'CSV_Import', lastSynced: Date.now() };
      
      headers.forEach((header, i) => {
        const val = values[i];
        if (!val) return;

        if (header === 'name') user.name = val;
        if (header === 'email') user.email = val;
        if (header === 'department') user.department = val;
        if (header === 'role') {
            // Mapping friendly names to UserRole enum
            const roleMap: Record<string, UserRole> = {
                'admin': 'CLIENT_ADMIN',
                'user': 'CLIENT_USER',
                'tech': 'MSP_TECH',
                'msp': 'MSP_ADMIN'
            };
            user.role = roleMap[val.toLowerCase()] || 'CLIENT_USER';
        }
        if (header === 'mfa_enabled') user.mfaEnabled = val.toLowerCase() === 'true' || val === '1';
      });
      
      return user;
    });
  },

  /**
   * Parses CSV string into Risk objects
   */
  parseRiskCsv: (csvText: string): Partial<Risk>[] => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      // Handle commas inside quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
      const risk: any = { status: 'Open', dateIdentified: Date.now() };
      
      headers.forEach((header, i) => {
        const val = cleanValues[i];
        if (!val) return;

        if (header.includes('tier')) risk.riskTier = val;
        if (header.includes('category')) risk.riskCategory = val;
        if (header.includes('domain')) risk.domainGrouping = val;
        if (header.includes('number')) risk.riskNumber = val;
        if (header.includes('title')) risk.riskTitle = val;
        if (header.includes('owner')) risk.riskOwner = val;
        if (header.includes('description')) risk.deficiencyDescription = val;
        if (header.includes('scenario')) risk.probableScenarios = val;
        if (header.includes('likelihood')) risk.likelihood = val;
        if (header.includes('impact')) risk.impact = val;
        if (header.includes('inherent')) risk.inherentRiskRating = val;
        if (header.includes('decision')) risk.businessDecision = val;
        if (header.includes('residual')) risk.targetResidualRiskRating = val;
        if (header.includes('comment')) risk.comments = val;
      });
      
      return risk;
    });
  },

  /**
   * Mock sync with Microsoft Entra ID
   */
  syncEntraUsers: async (config: IntegrationConfig): Promise<Partial<User>[]> => {
    if (!config.enabled) throw new Error("Entra ID integration not enabled");
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        name: 'John Cloud',
        email: 'john.c@entra.local',
        department: 'Engineering',
        role: 'CLIENT_USER',
        mfaEnabled: true,
        iamSource: 'EntraID',
        lastSynced: Date.now()
      },
      {
        name: 'Sarah Admin',
        email: 'sarah.a@entra.local',
        department: 'IT',
        role: 'CLIENT_ADMIN',
        mfaEnabled: true,
        iamSource: 'EntraID',
        lastSynced: Date.now()
      }
    ];
  },

  /**
   * Mock sync with Microsoft Intune
   */
  syncIntuneAssets: async (config: IntegrationConfig): Promise<Partial<Asset>[]> => {
    if (!config.enabled) throw new Error("Intune integration not enabled");

    await new Promise(resolve => setTimeout(resolve, 2500));

    return [
      {
        name: 'INTUNE-LP-9921',
        type: 'Workstation',
        owner: 'John Cloud',
        location: 'Remote',
        cmmcCategory: 'FCI',
        criticality: 'Medium',
        source: 'Intune',
        lastSynced: Date.now(),
        externalId: 'device-uuid-1'
      },
      {
        name: 'INTUNE-SVR-DC01',
        type: 'Server',
        owner: 'IT Infrastructure',
        location: 'Azure East US',
        cmmcCategory: 'SPA',
        criticality: 'High',
        source: 'Intune',
        lastSynced: Date.now(),
        externalId: 'device-uuid-2'
      }
    ];
  }
};