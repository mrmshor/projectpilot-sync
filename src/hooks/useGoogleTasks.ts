import { useState, useCallback } from 'react';
import { QuickTask } from '@/types/quickTask';
import { toast } from 'sonner';

// Google Tasks API configuration
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/tasks';

interface GoogleTasksConfig {
  clientId: string;
  apiKey: string;
}

export const useGoogleTasks = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<GoogleTasksConfig | null>(null);
  const [gapi, setGapi] = useState<any>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Initialize Google APIs
  const initializeGoogleAPI = useCallback(async (clientId: string, apiKey: string) => {
    try {
      setIsLoading(true);
      setConfig({ clientId, apiKey });

      // Load Google API
      if (!window.gapi) {
        await loadScript('https://apis.google.com/js/api.js');
      }

      // Load Google Identity Services
      if (!window.google?.accounts) {
        await loadScript('https://accounts.google.com/gsi/client');
      }

      // Initialize GAPI client
      await new Promise((resolve) => {
        window.gapi.load('client', resolve);
      });

      await window.gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: [DISCOVERY_DOC],
      });

      // Initialize OAuth2
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            toast.error('❌ שגיאה באימות Google');
            return;
          }
          setIsAuthenticated(true);
          toast.success('✅ מחובר ל-Google Tasks בהצלחה');
        },
      });

      setGapi(window.gapi);
      setTokenClient(client);
      toast.success('✅ Google Tasks API מוכן');
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
      toast.error('❌ שגיאה באתחול Google Tasks API');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Authenticate user
  const authenticate = useCallback(() => {
    if (!tokenClient) {
      toast.error('❌ יש לאתחל את API תחילה');
      return;
    }

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }, [tokenClient, gapi]);

  // Sign out
  const signOut = useCallback(() => {
    if (!gapi) return;

    const token = gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      setIsAuthenticated(false);
      toast.success('✅ התנתקת מ-Google Tasks');
    }
  }, [gapi]);

  // Create a new task list and add tasks
  const createTaskListFromQuickTasks = useCallback(async (tasks: QuickTask[]) => {
    if (!isAuthenticated || !gapi) {
      toast.error('❌ יש להתחבר ל-Google Tasks תחילה');
      return false;
    }

    try {
      setIsLoading(true);

      // Create a new task list
      const listTitle = `רשימת משימות מהירות - ${new Date().toLocaleDateString('he-IL')}`;
      
      const taskListResponse = await gapi.client.tasks.tasklists.insert({
        resource: {
          title: listTitle,
        },
      });

      const taskListId = taskListResponse.result.id;

      // Add each task to the new task list
      for (const task of tasks) {
        await gapi.client.tasks.tasks.insert({
          tasklist: taskListId,
          resource: {
            title: task.title,
            status: 'needsAction',
          },
        });
      }

      toast.success(`✅ נוצרה רשימת משימות ב-Google Tasks עם ${tasks.length} משימות`);
      return true;
    } catch (error) {
      console.error('Failed to create task list:', error);
      toast.error('❌ שגיאה ביצירת רשימת המשימות');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, gapi]);

  // Get all task lists
  const getTaskLists = useCallback(async () => {
    if (!isAuthenticated || !gapi) return [];

    try {
      const response = await gapi.client.tasks.tasklists.list();
      return response.result.items || [];
    } catch (error) {
      console.error('Failed to get task lists:', error);
      return [];
    }
  }, [isAuthenticated, gapi]);

  return {
    isAuthenticated,
    isLoading,
    config,
    initializeGoogleAPI,
    authenticate,
    signOut,
    createTaskListFromQuickTasks,
    getTaskLists,
  };
};

// Helper function to load external scripts
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}