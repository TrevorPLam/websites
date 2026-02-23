---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-002
title: 'ElectricSQL local-first sync pattern implementation'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-6-002-electricsql-sync
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-002 · ElectricSQL local-first sync pattern implementation

## Objective

Implement ElectricSQL local-first sync pattern following section 6.4 specification with PGlite WASM, offline-capable forms, real-time synchronization, and conflict resolution for multi-tenant marketing sites.

---

## Context

**Documentation Reference:**

- Postgresql Rls Documentation: `docs/guides/backend-data/postgresql-rls-documentation.md` ✅ COMPLETED
- Aws Rds Proxy Documentation: `docs/guides/backend-data/aws-rds-proxy-documentation.md` ✅ COMPLETED
- Pgbouncer Supavisor Configuration: `docs/guides/backend-data/pgbouncer-supavisor-configuration.md` ❌ MISSING (P1)
- Schema Migration Safety: `docs/guides/backend-data/schema-migration-safety.md` ❌ MISSING (P1)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Offline-capable forms and local state management — ElectricSQL integration

**Related files:** Marketing site components, database operations, sync infrastructure

**Dependencies:** ElectricSQL, PGlite WASM, existing database integration, marketing components

**Prior work:** Basic database operations exist but lack offline capability and local-first patterns

**Constraints:** Must follow section 6.4 specification with proper sync patterns and conflict resolution

---

## Tech Stack

| Layer     | Technology                               |
| --------- | ---------------------------------------- |
| Sync      | ElectricSQL with PGlite WASM             |
| Storage   | IndexedDB for local persistence          |
| Real-time | WebSocket sync with conflict resolution  |
| Offline   | Queue-based sync for connectivity issues |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement ElectricSQL sync pattern following section 6.4 specification
- [ ] **[Agent]** Create offline-capable lead capture forms with PGlite storage
- [ ] **[Agent]** Add real-time synchronization with conflict resolution
- [ ] **[Agent]** Implement sync queue for offline operations
- [ ] **[Agent]** Add per-tenant data isolation in local storage
- [ ] **[Agent]** Create sync status indicators and UI feedback
- [ ] **[Agent]** Test offline/online transition scenarios
- [ ] **[Human]** Verify pattern follows section 6.4 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 6.4 specification** — Extract sync pattern requirements
- [ ] **[Agent]** **Create PGlite singleton** — Implement local database with tenant isolation
- [ ] **[Agent]** **Add sync infrastructure** — Implement real-time sync with conflict resolution
- [ ] **[Agent]** **Create offline forms** - Build offline-capable lead capture forms
- [ ] **[Agent]** **Implement sync queue** - Add queue for offline operations
- [ ] **[Agent]** **Add sync indicators** - Create UI feedback for sync status
- [ ] **[Agent]** **Test offline scenarios** - Verify offline/online transitions

> ⚠️ **Agent Question**: Ask human before proceeding if any existing forms need migration to offline-capable patterns.

---

## Commands

```bash
# Test ElectricSQL sync
pnpm test --filter="@repo/ui"

# Test offline form functionality
node -e "
import { getPGlite, syncPendingLeads } from '@repo/ui/offline-lead-form';
const pg = await getPGlite('tenant-123');
await pg.query('INSERT INTO offline_leads (name, email) VALUES (?, ?)', ['Test', 'test@example.com']);
await syncPendingLeads(pg, 'tenant-123');
"

# Test sync conflict resolution
node -e "
import { getPGlite } from '@repo/ui/offline-lead-form';
const pg = await getPGlite('tenant-123');
// Simulate concurrent sync operations
await Promise.all([
  pg.query('INSERT INTO offline_leads (id, name, email) VALUES (?, ?, ?)', ['1', 'Alice', 'alice@example.com']),
  pg.query('INSERT INTO offline_leads (id, name, email) VALUES (?, ?, ?)', ['1', 'Bob', 'bob@example.com'])
]);
"

# Verify IndexedDB persistence
console.log('IndexedDB stores:', indexedDB.databases());
```

---

## Code Style

```typescript
// ✅ Correct — ElectricSQL sync pattern following section 6.4
'use client';

import { PGlite } from '@electric-sql/pglite';
import { electricSync } from '@electric-sql/pglite/sync';
import { live } from '@electric-sql/pglite/live';
import { useEffect, useRef, useState, useCallback } from 'react';
import { z } from 'zod';

// ============================================================================
// SCHEMA
// ============================================================================

const OfflineLeadSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  synced: z.boolean().default(false),
  created_at: z.string().datetime(),
});

type OfflineLead = z.infer<typeof OfflineLeadSchema>;

// ============================================================================
// PGlite SINGLETON (persisted to IndexedDB)
// ============================================================================

let _pg: PGlite | null = null;

async function getPGlite(tenantId: string): Promise<PGlite> {
  if (_pg) return _pg;

  _pg = await PGlite.create({
    // Persist to IndexedDB keyed by tenantId
    dataDir: `idb://offline-leads-${tenantId}`,
    extensions: {
      electric: electricSync(),
      live,
    },
  });

  // Create local leads table for offline storage
  await _pg.exec(`
    CREATE TABLE IF NOT EXISTS offline_leads (
      id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      tenant_id   TEXT NOT NULL,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT,
      message     TEXT NOT NULL,
      synced      BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  return _pg;
}

// ============================================================================
// SYNC: Upload unsynced leads to server when online
// ============================================================================

async function syncPendingLeads(pg: PGlite, tenantId: string): Promise<void> {
  const { rows } = await pg.query<OfflineLead>(
    'SELECT * FROM offline_leads WHERE synced = FALSE AND tenant_id = $1',
    [tenantId]
  );

  for (const lead of rows) {
    try {
      const res = await fetch('/api/leads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });

      if (res.ok) {
        await pg.query(
          'UPDATE offline_leads SET synced = TRUE WHERE id = $1',
          [lead.id]
        );
      }
    } catch {
      // Network failure — will retry on next online event
      console.error('Sync failed for lead:', lead.id);
    }
  }
}

// ============================================================================
// CONFLICT RESOLUTION: ElectricSQL handles this automatically
// ============================================================================

// ElectricSQL automatically handles merge conflicts using last-write-wins
// No manual conflict resolution needed for this use case

// ============================================================================
// OFFLINE LEAD FORM COMPONENT
// ============================================================================

export function OfflineLeadForm({ tenantId }: { tenantId: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [pendingCount, setPendingCount] = useState(0);

  const pgRef = useRef<PGlite | null>(null);

  // Initialize PGlite and sync status
  useEffect(() => {
    let mounted = true;

    async function initPGlite() {
      try {
        const pg = await getPGlite(tenantId);
        pgRef.current = pg;

        // Count pending leads
        const { rows } = await pg.query<{ count: string }>(
          'SELECT COUNT(*) as count FROM offline_leads WHERE synced = FALSE'
        );
        setPendingCount(Number(rows[0]?.count || 0));

        // Sync pending leads if online
        if (navigator.onLine && pendingCount > 0) {
          setSyncStatus('syncing');
          await syncPendingLeads(pg, tenantId);
          setSyncStatus('synced');
        }

        // Set up real-time sync
        pg.live.sync({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          token: process.env.SUPABASE_ANON_KEY!,
          tables: ['offline_leads'],
          onSync: (event) => {
            if (!mounted) return;

            if (event.type === 'commit') {
              console.log('Sync completed:', event);
              setSyncStatus('synced');
            } else if (event.type === 'error') {
              console.error('Sync error:', event);
              setSyncStatus('error');
            }
          },
        });

        // Listen for online/offline events
        const handleOnline = () => {
          setIsOnline(true);
          if (pendingCount > 0) {
            syncPendingLeads(pg, tenantId);
          }
        };

        const handleOffline = () => {
          setIsOnline(false);
          setSyncStatus('idle');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          mounted = false;
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      } catch (error) {
        console.error('Failed to initialize PGlite:', error);
      }
    }

    initPGlite();
  }, [tenantId]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    if (!pgRef.current) return;

    setIsSubmitting(true);

    try {
      // Store locally first (offline-first)
      const leadData = {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
        synced: false,
        created_at: new Date().toISOString(),
      };

      await pgRef.current.query(
        `INSERT INTO offline_leads (id, tenant_id, name, email, phone, message, synced, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [leadData.id, leadData.tenant_id, leadData.name, leadData.email, leadData.phone, leadData.message, leadData.synced, leadData.created_at]
      );

      setPendingCount(prev => prev + 1);

      // If online, try to sync immediately
      if (navigator.onLine) {
        setSyncStatus('syncing');
        await syncPendingLeads(pgRef.current, tenantId);
        setSyncStatus('synced');
      } else {
        setSyncStatus('idle');
      }
    } catch (error) {
      console.error('Failed to save lead locally:', error);
      setSyncStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [tenantId]);

  return (
    <div className="offline-lead-form">
      <div className="sync-status">
        {isOnline ? (
          <span className="text-green-600">🟢 Online</span>
        ) : (
          <span className="text-orange-600">📡 Offline</span>
        )}
        {pendingCount > 0 && (
          <span className="text-blue-600">
            {pendingCount} pending sync{pendingCount === 1 ? '' : 's'}
          </span>
        )}
        {syncStatus === 'syncing' && <span className="text-blue-600">🔄 Syncing...</span>}
        {syncStatus === 'synced' && <span className="text-green-600">✅ Synced</span>}
        {syncStatus === 'error' && <span className="text-red-600">❌ Sync failed</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
```

**ElectricSQL sync principles:**

- **Local-first approach**: Store data locally first, sync when online
- **Automatic conflict resolution**: ElectricSQL handles merge conflicts automatically
- **Offline capability**: Forms work without network connectivity
- **Real-time sync**: WebSocket-based synchronization when online
- **Per-tenant isolation**: Local storage isolated by tenant ID
- **Sync status feedback**: Clear UI indicators for sync state
- **Queue-based sync**: Pending operations queued when offline

---

## Boundaries

| Tier             | Scope                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 6.4 specification; implement local-first approach; add real-time sync; handle offline scenarios; maintain tenant isolation |
| ⚠️ **Ask first** | Changing existing form components; modifying sync patterns; updating database operations                                                  |
| 🚫 **Never**     | Skip offline capability; ignore sync status; break local-first approach; expose sensitive data in local storage                           |

---

## Success Verification

- [ ] **[Agent]** Test offline form submission — Forms work without connectivity
- [ ] **[Agent]** Verify real-time sync — Changes sync when online
- [ ] **[Agent]** Test conflict resolution — Concurrent sync operations handled
- [ ] **[Agent]** Verify tenant isolation — Local data separated by tenant
- [ ] **[Agent]** Test sync indicators — UI shows correct sync status
- [ ] **[Agent]** Test offline/online transitions — State preserved correctly
- [ ] **[Human]** Test with real connectivity issues — Sync works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **IndexedDB storage**: Handle storage quota limits and cleanup
- **Sync conflicts**: ElectricSQL handles automatically but monitor for performance
- **Network detection**: Handle online/offline state changes properly
- **Data consistency**: Ensure local and server data remain consistent
- **Performance impact**: Monitor sync performance with large datasets
- **Browser compatibility**: Ensure PGlite works across target browsers

---

## Out of Scope

- PgBouncer/Supavisor connection pooling (handled in separate task)
- Schema migration safety (handled in separate task)
- Database schema design (handled in separate domain)
- Connection pool health monitoring (handled in separate task)

---

## References

- [Section 6.4 ElectricSQL Local-First Sync Pattern](docs/plan/domain-6/6.4-electricsql-local-first-sync-pattern.md)
- [Section 6.1 Philosophy](docs/plan/domain-6/6.1-philosophy.md)
- [Section 6.2 Connection Pooling Configuration](docs/plan/domain-6/6.2-connection-pooling-configuration.md)
- [ElectricSQL Documentation](https://electric-sql.com/)
- [PGlite Documentation](https://github.com/electric-sql/pglite)
- [Local-First Architecture Pattern](https://blog.logrocket.com/using-electricsql-build-local-first-app/)
