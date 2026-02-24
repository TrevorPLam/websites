'use client';

import { useCallback, useEffect, useState } from 'react';

const DB_NAME = 'offline-form-db';
const STORE_NAME = 'pending-submissions';
const DB_VERSION = 1;

type JsonRecord = Record<string, unknown>;

interface PendingSubmission {
  id: string;
  url: string;
  body: JsonRecord;
  timestamp: number;
}

interface SubmitResult {
  success: boolean;
  queued: boolean;
  error?: string;
}

function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

async function getPendingCount(): Promise<number> {
  const db = await openOfflineDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const countRequest = store.count();

    countRequest.onsuccess = () => resolve(countRequest.result);
    countRequest.onerror = () => reject(countRequest.error ?? new Error('Failed to count pending items'));
  });
}

async function savePendingSubmission(submission: PendingSubmission): Promise<void> {
  const db = await openOfflineDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(submission);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Failed to queue submission'));
  });
}

export function useOfflineForm(apiUrl: string) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncedOfflineData, setSyncedOfflineData] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const onOnline = () => {
      setIsOnline(true);
    };

    const onOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    void getPendingCount().then(setPendingCount).catch(() => setPendingCount(0));

    if ('serviceWorker' in navigator) {
      const messageListener = (event: MessageEvent) => {
        if (event.data?.type === 'BACKGROUND_SYNC_COMPLETE') {
          setSyncedOfflineData(true);
          void getPendingCount().then(setPendingCount).catch(() => setPendingCount(0));
        }
      };

      navigator.serviceWorker.addEventListener('message', messageListener);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
        navigator.serviceWorker.removeEventListener('message', messageListener);
      };
    }

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const submit = useCallback(
    async (formData: JsonRecord): Promise<SubmitResult> => {
      if (isOnline) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            return { success: true, queued: false };
          }

          const body = (await response.json().catch(() => ({}))) as { message?: string };
          return {
            success: false,
            queued: false,
            error: body.message ?? `Server error: ${response.status}`,
          };
        } catch {
          // Fall through to offline queue path
        }
      }

      try {
        await savePendingSubmission({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: apiUrl,
          body: formData,
          timestamp: Date.now(),
        });

        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          if ('sync' in registration) {
            await registration.sync.register('contact-form-queue');
          }
        }

        setPendingCount((prev) => prev + 1);
        return { success: true, queued: true };
      } catch (error) {
        return {
          success: false,
          queued: false,
          error: error instanceof Error ? error.message : 'Unable to queue submission',
        };
      }
    },
    [apiUrl, isOnline]
  );

  return {
    isOnline,
    pendingCount,
    submit,
    syncedOfflineData,
  };
}
