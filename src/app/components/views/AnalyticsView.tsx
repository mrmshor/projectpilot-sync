import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface AnalyticsViewProps {
  tasks: any[];
  projects: any[];
  stats: any;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  projects,
  stats,
  loading
}) => {
  if (loading) {
    return <div className="text-white">טוען אנליטיקה...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-title text-white font-bold">אנליטיקה ודוחות</h1>
      
      <div className="glass-card p-12 text-center">
        <ChartBarIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">אנליטיקה מתקדמת</h3>
        <p className="text-white/60">תרשימים ודוחות יגיעו בקרוב</p>
      </div>
    </div>
  );
};