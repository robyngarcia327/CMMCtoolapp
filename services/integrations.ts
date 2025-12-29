
import { Asset, User, IntegrationConfig } from '../types';

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
   */
  parseAssetCsv: (csvText: string): Partial<Asset>[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const asset: any = { source: 'CSV_Import', lastSynced: Date.now() };
      
      headers.forEach((header, i) => {
        if (header === 'name') asset.name = values[i];
        if (header === 'type') asset.type = values[i];
        if (header === 'owner') asset.owner = values[i];
        if (header === 'location') asset.location = values[i];
        if (header === 'category') asset.cmmcCategory = values[i];
        if (header === 'criticality') asset.criticality = values[i];
      });
      
      return asset;
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
