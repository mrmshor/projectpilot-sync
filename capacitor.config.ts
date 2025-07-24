import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.projectpilot.sync',
  appName: 'ProjectPilot Sync',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://b1cb2869-cf2d-4731-a631-2297f36707cb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'ProjectPilot Sync'
  }
};

export default config;