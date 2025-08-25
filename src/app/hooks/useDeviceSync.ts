import { useState, useEffect } from 'react';

export const useDeviceSync = () => {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(new Date());

  // Simulate sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate sync status changes for demo
      const statuses: Array<'synced' | 'syncing' | 'error'> = ['synced', 'synced', 'synced', 'syncing'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      setSyncStatus(randomStatus);
      
      if (randomStatus === 'synced') {
        setLastSync(new Date());
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    syncStatus,
    lastSync
  };
};