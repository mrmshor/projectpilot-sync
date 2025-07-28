import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleTasks } from '@/hooks/useGoogleTasks';
import { ExternalLink, Key, User } from 'lucide-react';

export const GoogleTasksSettings: React.FC = () => {
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { 
    isAuthenticated, 
    isLoading, 
    config, 
    initializeGoogleAPI, 
    authenticate, 
    signOut 
  } = useGoogleTasks();

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !apiKey.trim()) {
      return;
    }
    await initializeGoogleAPI(clientId.trim(), apiKey.trim());
  };

  const handleAuthenticate = () => {
    authenticate();
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          הגדרות Google Tasks
        </CardTitle>
        <CardDescription>
          חבר את האפליקציה ל-Google Tasks לייצוא משימות
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!config ? (
          <form onSubmit={handleInitialize} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                type="text"
                placeholder="הזן את ה-Client ID מ-Google Cloud Console"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                placeholder="הזן את ה-API Key מ-Google Cloud Console"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !clientId.trim() || !apiKey.trim()}
            >
              <Key className="h-4 w-4 mr-2" />
              {isLoading ? 'מאתחל...' : 'אתחל API'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              ✅ API מוכן - Client ID: {config.clientId.substring(0, 20)}...
            </div>
            
            {!isAuthenticated ? (
              <Button 
                onClick={handleAuthenticate} 
                className="w-full"
                disabled={isLoading}
              >
                <User className="h-4 w-4 mr-2" />
                התחבר ל-Google
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-green-600 font-medium">
                  ✅ מחובר ל-Google Tasks
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="w-full"
                >
                  התנתק
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </div>
            <div>1. צור פרויקט חדש או בחר קיים</div>
            <div>2. הפעל את Tasks API</div>
            <div>3. צור OAuth 2.0 Client ID ו-API Key</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};