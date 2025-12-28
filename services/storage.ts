
import { Client, ClientData, Requirement } from '../types';
import { REQUIREMENTS_DATA } from '../data/standards';

const STORAGE_KEY_CLIENTS = 'cybercomply_clients';
const STORAGE_KEY_DATA_STORE = 'cybercomply_datastore';

export const storageService = {
  
  loadClients: async (): Promise<Client[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  loadDataStore: async (): Promise<Record<string, ClientData>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA_STORE);
      let store: Record<string, ClientData> = stored ? JSON.parse(stored) : {};
      
      // Upgrade logic: Ensure all current requirements are present in every client's active dataset
      Object.keys(store).forEach(clientId => {
          const clientData = store[clientId];
          if (!clientData.requirements) clientData.requirements = [];
          
          const existingIds = new Set(clientData.requirements.map(r => r.id));
          
          REQUIREMENTS_DATA.forEach(officialReq => {
              if (!existingIds.has(officialReq.id)) {
                  // Add missing requirement from newest standards
                  clientData.requirements.push(JSON.parse(JSON.stringify(officialReq)));
              } else {
                  // Optional: Refresh labels or descriptions if they are default/empty
                  const idx = clientData.requirements.findIndex(r => r.id === officialReq.id);
                  const current = clientData.requirements[idx];
                  
                  // Force refresh if content is empty or placeholder to ensure data completeness
                  if (!current.description || current.description === "" || current.title === "Placeholder") {
                      current.title = officialReq.title;
                      current.description = officialReq.description;
                      current.discussion = officialReq.discussion;
                      current.family = officialReq.family;
                      current.cmmcLevel = officialReq.cmmcLevel;
                      // Don't overwrite objectives if they have status work, unless they are empty
                      if (!current.objectives || current.objectives.length === 0) {
                          current.objectives = JSON.parse(JSON.stringify(officialReq.objectives));
                      }
                  }
              }
          });
          
          // Re-sort requirements by ID numerically to maintain order
          clientData.requirements.sort((a, b) => {
              const parseId = (id: string) => id.split('.').map(Number);
              const aParts = parseId(a.id);
              const bParts = parseId(b.id);
              for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                  if ((aParts[i] || 0) < (bParts[i] || 0)) return -1;
                  if ((aParts[i] || 0) > (bParts[i] || 0)) return 1;
              }
              return 0;
          });
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
