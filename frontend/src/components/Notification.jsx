import React from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export const Notification = () => {
  const notification = useStore((state) => state.notification);
  const showNotification = useStore((state) => state.showNotification);

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[notification.type];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px]`}>
        <span className="flex-1">{notification.message}</span>
        <button
          onClick={() => showNotification(null)}
          className="hover:bg-white/10 p-1 rounded-full"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}; 