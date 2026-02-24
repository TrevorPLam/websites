'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // No-op: offline support is progressive enhancement.
    });
  }, []);

  return null;
}
