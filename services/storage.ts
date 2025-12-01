import { Client, ClientData } from '../types';
import { INITIAL_CLIENTS, createInitialClientData } from '../data/standards';

const STORAGE_KEY_CLIENTS = 'cybercomply_clients';
const STORAGE_KEY_DATA_STORE = 'cybercomply_datastore';

// Now using Promises to simulate Database Latency
export const storageService = {
  
  // Load Clients List
  loadClients: async (): Promise<Client[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
    } catch (e) {
      console.error("Failed to load clients", e);
      return INITIAL_CLIENTS;
    }
  },

  // Load All Data
  loadDataStore: async (): Promise<Record<string, ClientData>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate DB fetch

    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA_STORE);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize Default Store if nothing saved
      const initialStore: Record<string, ClientData> = {};
      INITIAL_CLIENTS.forEach((client: any) => {
          initialStore[client.id] = createInitialClientData(true);
      });
      return initialStore;

    } catch (e) {
      console.error("Failed to load data store", e);
      return {};
    }
  },

  // Save State (In real AWS, this would be individual UPDATE calls, not a full dump)
  save: async (clients: Client[], dataStore: Record<string, ClientData>) => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
      localStorage.setItem(STORAGE_KEY_DATA_STORE, JSON.stringify(dataStore));
      console.log("Data synced to local storage");
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