import { Client, ClientData, Requirement } from '../types';
import { REQUIREMENTS_DATA } from '../data/standards';

const STORAGE_KEY_CLIENTS = 'cybercomply_clients';
const STORAGE_KEY_DATA_STORE = 'cybercomply_datastore';

export const storageService = {
  
  loadClients: async (): Promise<Client[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  loadDataStore: async (): Promise<Record<string, ClientData>> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA_STORE);
      let store: Record<string, ClientData> = stored ? JSON.parse(stored) : {};
      
      // INTEGRITY SYNC: Ensure 110 controls exist for every tenant
      Object.keys(store).forEach(clientId => {
          const clientData = store[clientId];
          if (!clientData.requirements) clientData.requirements = [];
          
          const currentReqMap = new Map(clientData.requirements.map(r => [r.id, r]));
          
          // Use the full official set to rebuild or expand the list
          const syncedRequirements = REQUIREMENTS_DATA.map(official => {
              const existing = currentReqMap.get(official.id);
              if (existing) {
                  // CRITICAL: Preserve implementation narrative and objectives status
                  return {
                      ...official,
                      response: existing.response || "",
                      objectives: official.objectives.map(o => {
                          const existingObj = existing.objectives?.find(eo => eo.id === o.id);
                          return existingObj ? { ...o, status: existingObj.status } : o;
                      }),
                      scopeStatus: existing.scopeStatus || 'IN_SCOPE',
                      comments: existing.comments || [],
                      poam: existing.poam
                  };
              }
              return JSON.parse(JSON.stringify(official));
          });
          
          // Re-sort numerically to maintain standards order (3.1.1 before 3.1.10)
          syncedRequirements.sort((a, b) => {
              const aP = a.id.split('.').map(Number);
              const bP = b.id.split('.').map(Number);
              for (let i = 0; i < Math.max(aP.length, bP.length); i++) {
                  if ((aP[i] || 0) < (bP[i] || 0)) return -1;
                  if ((aP[i] || 0) > (bP[i] || 0)) return 1;
              }
              return 0;
          });

          clientData.requirements = syncedRequirements;
      });

      return store;
    } catch (e) {
      console.error("Failed to load data store", e);
      return {};
    }
  },

  save: async (clients: Client[], dataStore: Record<string, ClientData>) => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
      localStorage.setItem(STORAGE_KEY_DATA_STORE, JSON.stringify(dataStore));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  },

  reset: async () => {
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_DATA_STORE);
    window.location.reload();
  }
};