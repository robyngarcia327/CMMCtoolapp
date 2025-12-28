
import { Client, ClientData, Requirement } from '../types';
// Fixed: Removed non-existent export INITIAL_CLIENTS from the import statement
import { createInitialClientData, REQUIREMENTS_DATA } from '../data/standards';

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
      
      // Upgrade logic: Ensure all "Real" requirements are present in every client
      // This prevents "Placeholder" versions from persisting if we updated standards.ts
      Object.keys(store).forEach(clientId => {
          const clientData = store[clientId];
          const existingIds = new Set(clientData.requirements.map(r => r.id));
          
          REQUIREMENTS_DATA.forEach(officialReq => {
              if (!existingIds.has(officialReq.id)) {
                  clientData.requirements.push(officialReq);
              } else {
                  // Optional: Update text if it was a placeholder but keep the user's status
                  const index = clientData.requirements.findIndex(r => r.id === officialReq.id);
                  if (index !== -1 && clientData.requirements[index].description.includes("placeholder")) {
                      const userStatus = clientData.requirements[index].objectives;
                      const userResponse = clientData.requirements[index].response;
                      clientData.requirements[index] = { 
                          ...officialReq, 
                          objectives: userStatus, 
                          response: userResponse 
                      };
                  }
              }
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