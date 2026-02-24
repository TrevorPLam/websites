'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      window.setTimeout(() => setJustReconnected(false), 4000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-0 right-0 top-0 z-[100] px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
        isOffline ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-white'
      }`}
    >
      {isOffline
        ? "📶 You're offline — forms will be sent when you reconnect"
        : '✓ Back online — syncing any pending submissions…'}
    </div>
  );
}
