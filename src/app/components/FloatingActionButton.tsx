import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center lg:hidden"
      aria-label="צור משימה חדשה"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );
};