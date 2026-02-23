<!--
/**
 * @file offline-first-forms-pwa.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for offline first forms pwa.
 * @entrypoints docs/guides/offline-first-forms-pwa.md
 * @exports offline first forms pwa
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# offline-first-forms-pwa.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

Offline-first lead forms ensure that contact form submissions are never lost when a visitor has intermittent connectivity — common in industrial environments, mobile users on poor signals, or embedded installations. The architecture uses a **Service Worker** with **Workbox BackgroundSync**, an **IndexedDB queue**, and a `navigator.onLine` guard on the submission handler. [digitalapplied](https://www.digitalapplied.com/blog/progressive-web-apps-2026-pwa-performance-guide)

---

## Browser Support

| Feature             | Chrome | Firefox | Safari   | Edge |
| ------------------- | ------ | ------- | -------- | ---- |
| Service Workers     | ✅     | ✅      | ✅ 16.4+ | ✅   |
| Background Sync API | ✅     | ❌      | ❌       | ✅   |
| IndexedDB           | ✅     | ✅      | ✅       | ✅   |

**Graceful degradation:** Since Background Sync is not supported in Firefox or Safari, the implementation falls back to an IndexedDB queue that retries on the next `online` event instead of using the native SyncManager. [learn.microsoft](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/background-syncs)

---

## Service Worker Strategy

Two strategies run in parallel: [zeepalm](https://www.zeepalm.com/blog/background-sync-in-pwas-service-worker-guide)

1. **App Shell** (`CacheFirst` / `StaleWhileRevalidate`) — the contact form HTML/JS loads instantly from cache even when offline.
2. **POST Queue** (`NetworkOnly` + `BackgroundSyncPlugin`) — failed POST requests are queued in IndexedDB and replayed automatically when connectivity returns.

```javascript
// public/sw.js — compiled via Serwist or @serwist/next
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST ?? []);

// Contact form POST → queue on network failure
const bgSyncPlugin = new BackgroundSyncPlugin('contact-form-queue', {
  maxRetentionTime: 24 * 60, // 24 hours
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        // Notify open tabs that sync succeeded
        const clients = await self.clients.matchAll();
        clients.forEach((c) => c.postMessage({ type: 'BACKGROUND_SYNC_COMPLETE' }));
      } catch {
        await queue.unshiftRequest(entry);
        throw new Error('Sync failed — re-queued');
      }
    }
  },
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/contact'),
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
);

// App shell assets
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'app-shell',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 2592000 })],
  })
);
```

---

## IndexedDB Fallback Queue

For browsers without `SyncManager` (Firefox, Safari), a manual retry loop runs on the `online` event:

```typescript
// packages/ui/src/hooks/use-offline-form.ts
import { openDB } from 'idb';

const DB_NAME = 'offline-form-store';
const STORE = 'pending-submissions';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    },
  });
}

export async function queueOfflineSubmission(
  apiUrl: string,
  body: Record<string, unknown>
): Promise<string> {
  const db = await getDB();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await db.add(STORE, { id, url: apiUrl, body, timestamp: Date.now(), retryCount: 0 });

  // Register native Background Sync if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    await (reg as any).sync.register('contact-form-queue');
  }

  return id;
}

export async function replayOfflineQueue(): Promise<void> {
  const db = await getDB();
  const pending = await db.getAll(STORE);

  for (const entry of pending) {
    try {
      const res = await fetch(entry.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry.body),
      });
      if (res.ok) {
        await db.delete(STORE, entry.id);
      }
    } catch {
      // Leave in queue — will retry on next online event
    }
  }
}

// Wire to window online event (fallback path for non-SW browsers)
if (typeof window !== 'undefined') {
  window.addEventListener('online', replayOfflineQueue);
}
```

---

## Next.js PWA Integration

```typescript
// apps/*/src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Business Site',
    short_name: 'Business',
    display: 'standalone',
    start_url: '/?source=pwa',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcuts: [{ name: 'Contact Us', url: '/contact?source=pwa-shortcut' }],
  };
}
```

**next.config.ts integration** using `@serwist/next` (the maintained Serwist fork of `next-pwa`): [blog.logrocket](https://blog.logrocket.com/nextjs-16-pwa-offline-support/)

```typescript
import withSerwist from '@serwist/next';

const withPWA = withSerwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA({
  // ...rest of next config
});
```

---

## Offline UX Banner

```typescript
'use client';
import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const off = () => setOffline(true);
    const on = () => setOffline(false);
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    return () => { window.removeEventListener('offline', off); window.removeEventListener('online', on); };
  }, []);

  if (!offline) return null;

  return (
    <div role="status" aria-live="assertive"
      className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-900 text-sm
                 font-semibold text-center py-2 px-4">
      📶 You're offline — your form will be sent automatically when you reconnect.
    </div>
  );
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Next.js PWA Guide — https://nextjs.org/docs/app/guides/progressive-web-apps
- Workbox Background Sync — https://developer.chrome.com/docs/workbox/modules/workbox-background-sync
- Background Sync API (Microsoft Learn) — https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/background-syncs
- PWA Performance Guide 2026 — https://www.digitalapplied.com/blog/progressive-web-apps-2026-pwa-performance-guide
- LogRocket Next.js 16 PWA — https://blog.logrocket.com/nextjs-16-pwa-offline-support/


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
