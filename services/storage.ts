import { Client, ClientData } from '../types';
import { INITIAL_CLIENTS, createInitialClientData } from '../data/standards';

const STORAGE_KEY_CLIENTS = 'cybercomply_clients';
const STORAGE_KEY_DATA_STORE = 'cybercomply_datastore';

export const storageService = {
  // Load Clients List
  loadClients: (): Client[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLIENTS);
      return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
    } catch (e) {
      console.error("Failed to load clients", e);
      return INITIAL_CLIENTS;
    }
  },

  // Load All Data (Clients, Risks, Requirements, etc.)
  loadDataStore: (): Record<string, ClientData> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA_STORE);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Initialize Default Store if nothing saved
      const initialStore: Record<string, ClientData> = {};
      INITIAL_CLIENTS.forEach(client => {
          // Use Mock data for the first load so the app isn't empty
          initialStore[client.id] = createInitialClientData(true);
      });
      return initialStore;

    } catch (e) {
      console.error("Failed to load data store", e);
      return {};
    }
  },

  // Save State
  save: (clients: Client[], dataStore: Record<string, ClientData>) => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
      localStorage.setItem(STORAGE_KEY_DATA_STORE, JSON.stringify(dataStore));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  },

  // Clear Data (Factory Reset)
  reset: () => {
    localStorage.removeItem(STORAGE_KEY_CLIENTS);
    localStorage.removeItem(STORAGE_KEY_DATA_STORE);
    window.location.reload();
  }
};