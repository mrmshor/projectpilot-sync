import { useState, useEffect, useCallback, useMemo } from 'react';

export interface ClientData {
  id: string;
  name: string;
  phone?: string;
  phone2?: string;
  whatsapp?: string;
  whatsapp2?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CLIENTS_STORAGE_KEY = 'task_management_clients';

export const useClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load clients from localStorage
  useEffect(() => {
    try {
      const savedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (savedClients) {
        const parsed = JSON.parse(savedClients);
        if (Array.isArray(parsed)) {
          const clientsWithDates = parsed.map((client: any) => ({
            ...client,
            createdAt: new Date(client.createdAt),
            updatedAt: new Date(client.updatedAt)
          }));
          setClients(clientsWithDates);
        }
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      localStorage.removeItem(CLIENTS_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save clients to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      } catch (error) {
        console.error('Error saving clients:', error);
      }
    }
  }, [clients, loading]);

  // Add or update client
  const saveClient = useCallback((clientData: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existingClient = clients.find(c => c.name.toLowerCase() === clientData.name.toLowerCase());
    
    if (existingClient) {
      // Update existing client
      setClients(prev => prev.map(client => 
        client.id === existingClient.id
          ? { ...client, ...clientData, updatedAt: new Date() }
          : client
      ));
      return existingClient;
    } else {
      // Create new client
      const newClient: ClientData = {
        ...clientData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setClients(prev => [newClient, ...prev]);
      return newClient;
    }
  }, [clients]);

  // Get client by name
  const getClientByName = useCallback((name: string) => {
    return clients.find(c => c.name.toLowerCase() === name.toLowerCase());
  }, [clients]);

  // Get client suggestions (fuzzy search)
  const getClientSuggestions = useCallback((query: string) => {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    return clients
      .filter(client => client.name.toLowerCase().includes(queryLower))
      .sort((a, b) => {
        // Sort by exact match first, then by name
        const aExact = a.name.toLowerCase().startsWith(queryLower);
        const bExact = b.name.toLowerCase().startsWith(queryLower);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10); // Limit to 10 suggestions
  }, [clients]);

  return {
    clients,
    loading,
    saveClient,
    getClientByName,
    getClientSuggestions
  };
};