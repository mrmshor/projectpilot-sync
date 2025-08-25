import React from 'react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  PlusIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastSync: Date | null;
  onCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  syncStatus,
  lastSync,
  onCreateTask
}) => {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'syncing':
        return <CloudArrowUpIcon className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <CloudArrowUpIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'synced':
        return lastSync ? `סונכרן ${new Date(lastSync).toLocaleTimeString('he-IL')}` : 'מסונכרן';
      case 'syncing':
        return 'מסנכרן...';
      case 'error':
        return 'שגיאה בסנכרון';
      default:
        return 'לא מחובר';
    }
  };

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/10">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Menu */}
          <div className="flex items-center gap-md">
            <button
              onClick={onToggleSidebar}
              className="btn btn-glass btn-small lg:hidden"
              aria-label="פתח/סגור תפריט"
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-title text-white font-bold">
                  מנהל משימות
                </h1>
                <p className="text-caption text-white/70">
                  ניהול פרויקטים מתקדם
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Actions & Sync Status */}
          <div className="flex items-center gap-md">
            {/* Sync Status */}
            <div className="hidden md:flex items-center gap-sm glass rounded-lg px-3 py-2">
              {getSyncIcon()}
              <span className="text-caption text-white/80">
                {getSyncText()}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-sm">
              {/* Search */}
              <button className="btn btn-glass btn-small" aria-label="חיפוש">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="btn btn-glass btn-small relative" aria-label="התראות">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H7l4 4v-4zM12 3v12M8 7l4-4 4 4" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              {/* Profile */}
              <button className="btn btn-glass btn-small" aria-label="פרופיל">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              </button>

              {/* Create Task - Primary Action */}
              <button
                onClick={onCreateTask}
                className="btn btn-primary btn-large hidden sm:flex"
                aria-label="צור משימה חדשה"
              >
                <PlusIcon className="w-5 h-5" />
                <span>משימה חדשה</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sync Status */}
      <div className="md:hidden border-t border-white/10">
        <div className="container">
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-sm">
              {getSyncIcon()}
              <span className="text-caption text-white/80">
                {getSyncText()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};