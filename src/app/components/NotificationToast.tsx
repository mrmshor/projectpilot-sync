import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationToastProps {
  notification: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  };
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-remove notification after duration
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColorClass = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500/30';
      case 'error':
        return 'border-red-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 glass-strong rounded-lg p-4 border ${getColorClass()} animate-slide-in max-w-sm`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-white text-sm flex-1">{notification.message}</span>
        <button className="text-white/60 hover:text-white">
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};