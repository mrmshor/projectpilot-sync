import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b1cb2869cf2d4731a6312297f36707cb',
  appName: 'projectpilot-sync',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://b1cb2869-cf2d-4731-a631-2297f36707cb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;