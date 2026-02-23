---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-003
title: 'PGlite WASM pattern for on-device state management'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-6-003-pglite-wasm
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-003 · PGlite WASM pattern for on-device state management

## Objective

Implement PGlite WASM pattern for on-device state management following section 6.5 specification with session-local storage, SQL-based state management, and instant query capabilities for complex client-side operations.

---

## Context

**Documentation Reference:**

- Postgresql Rls Documentation: `docs/guides/backend-data/postgresql-rls-documentation.md` ✅ COMPLETED
- Aws Rds Proxy Documentation: `docs/guides/backend-data/aws-rds-proxy-documentation.md` ✅ COMPLETED
- Pgbouncer Supavisor Configuration: `docs/guides/backend-data/pgbouncer-supavisor-configuration.md` ❌ MISSING (P1)
- Schema Migration Safety: `docs/guides/backend-data/schema-migration-safety.md` ❌ MISSING (P1)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Client-side state management — PGlite WASM integration

**Related files:** Analytics components, dashboard filters, search functionality, session management

**Dependencies:** PGlite WASM, existing state management, analytics infrastructure

**Prior work:** Basic state management exists but lacks SQL-based local storage and instant query capabilities

**Constraints:** Must follow section 6.5 specification with session-local patterns and SQL query capabilities

---

## Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Storage     | PGlite WASM (3MB Postgres in browser) |
| Querying    | Full SQL capabilities with indexes    |
| State       | Session-local in-memory storage       |
| Performance | Instant local queries, no round-trips |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement PGlite WASM pattern following section 6.5 specification
- [ ] **[Agent]** Create session-local database with analytics tracking
- [ ] **[Agent]** Add instant SQL-based search and filtering
- [ ] **[Agent]** Implement session scoring and engagement tracking
- [ ] **[Agent]** Create dashboard filters with instant response
- [ ] **[Agent]** Add client-side lead search with full-text SQL
- [ ] **[Agent]** Test session persistence and cleanup
- [ ] **[Human]** Verify pattern follows section 6.5 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 6.5 specification** — Extract PGlite WASM requirements
- [ ] **[Agent]** **Create session database** — Implement in-memory PGlite instance
- [ ] **[Agent]** **Add analytics tracking** — Track page views and events
- [ ] **[Agent]** **Implement search functionality** — Add full-text SQL search
- [ ] **[Agent]** **Create dashboard filters** — Instant filtering with SQL
- [ ] **[Agent]** **Add session scoring** — Calculate engagement scores
- [ ] **[Agent]** **Test performance** — Verify instant query response

> ⚠️ **Agent Question**: Ask human before proceeding if any existing state management needs migration to PGlite patterns.

---

## Commands

```bash
# Test PGlite session store
pnpm test --filter="@repo/analytics"

# Test session analytics
node -e "
import { recordPageView, recordEvent, getSessionScore } from '@repo/analytics/pglite-session-store';
await recordPageView('/dashboard');
await recordEvent('phone_click');
await recordEvent('form_start');
const score = await getSessionScore();
console.log('Session score:', score);
"

# Test lead search functionality
node -e "
import { searchLeads } from '@repo/analytics/pglite-session-store';
const results = await searchLeads('plumbing', { tenantId: 'tenant-123' });
console.log('Search results:', results);
"

# Verify session cleanup
console.log('Session database cleared on page unload');
```

---

## Code Style

```typescript
// ✅ Correct — PGlite WASM pattern following section 6.5
'use client';

import { PGlite } from '@electric-sql/pglite';

// ============================================================================
// SESSION-LOCAL DATABASE (in-memory, no persistence)
// ============================================================================

let _sessionDb: PGlite | null = null;

async function getSessionDb(): Promise<PGlite> {
  if (_sessionDb) return _sessionDb;

  // 'memory://' = in-memory, no persistence between page loads
  _sessionDb = new PGlite('memory://');

  await _sessionDb.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id          SERIAL PRIMARY KEY,
      pathname    TEXT NOT NULL,
      viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS events (
      id          SERIAL PRIMARY KEY,
      type        TEXT NOT NULL,
      payload     JSONB,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id          SERIAL PRIMARY KEY,
      query       TEXT NOT NULL,
      results_count INTEGER NOT NULL,
      searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS filter_state (
      id          SERIAL PRIMARY KEY,
      filter_name TEXT NOT NULL,
      filter_value JSONB NOT NULL,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
    CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events(occurred_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
    CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
  `);

  return _sessionDb;
}

// ============================================================================
// ANALYTICS TRACKING
// ============================================================================

export async function recordPageView(pathname: string): Promise<void> {
  const db = await getSessionDb();
  await db.query('INSERT INTO page_views (pathname) VALUES ($1)', [pathname]);
}

export async function recordEvent(type: string, payload?: Record<string, unknown>): Promise<void> {
  const db = await getSessionDb();
  await db.query('INSERT INTO events (type, payload) VALUES ($1, $2)', [
    type,
    payload ? JSON.stringify(payload) : null,
  ]);
}

export async function recordSearch(query: string, resultsCount: number): Promise<void> {
  const db = await getSessionDb();
  await db.query('INSERT INTO search_history (query, results_count) VALUES ($1, $2)', [
    query,
    resultsCount,
  ]);
}

export async function updateFilterState(filterName: string, filterValue: unknown): Promise<void> {
  const db = await getSessionDb();
  await db.query(
    `
    INSERT INTO filter_state (filter_name, filter_value) 
    VALUES ($1, $2)
    ON CONFLICT (filter_name) 
    DO UPDATE SET 
      filter_value = $2, 
      updated_at = now()
  `,
    [filterName, JSON.stringify(filterValue)]
  );
}

// ============================================================================
// SESSION ANALYTICS
// ============================================================================

export async function getSessionScore(): Promise<number> {
  const db = await getSessionDb();

  const { rows: viewRows } = await db.query<{ count: string }>(
    'SELECT COUNT(*) as count FROM page_views'
  );
  const pageViews = Number(viewRows[0]?.count ?? 0);

  const { rows: eventRows } = await db.query<{ type: string; count: string }>(
    `SELECT type, COUNT(*) as count FROM events GROUP BY type`
  );

  // Score calculation using session data
  let score = 0;
  if (pageViews >= 3) score += 10;
  if (pageViews >= 5) score += 10;

  for (const row of eventRows) {
    if (row.type === 'phone_click') score += 30;
    if (row.type === 'form_start') score += 15;
    if (row.type === 'booking_click') score += 25;
    if (row.type === 'search') score += 5;
  }

  return Math.min(score, 100);
}

export async function getSessionStats() {
  const db = await getSessionDb();

  const [pageViews, events, searches, filters] = await Promise.all([
    db.query('SELECT COUNT(*) as count FROM page_views'),
    db.query('SELECT COUNT(*) as count FROM events'),
    db.query('SELECT COUNT(*) as count FROM search_history'),
    db.query('SELECT COUNT(*) as count FROM filter_state'),
  ]);

  return {
    pageViews: Number(pageViews.rows[0]?.count ?? 0),
    events: Number(events.rows[0]?.count ?? 0),
    searches: Number(searches.rows[0]?.count ?? 0),
    filters: Number(filters.rows[0]?.count ?? 0),
  };
}

// ============================================================================
// INSTANT LEAD SEARCH (full-text SQL)
// ============================================================================

interface SearchOptions {
  tenantId: string;
  limit?: number;
  filters?: {
    status?: string;
    source?: string;
    dateRange?: { start: string; end: string };
  };
}

export async function searchLeads(query: string, options: SearchOptions) {
  const db = await getSessionDb();

  // Create temporary leads table for search (populated from API)
  await db.exec(`
    CREATE TEMP TABLE IF NOT EXISTS temp_leads (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT,
      source TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      message TEXT
    );
  `);

  // Build search query with filters
  let sql = `
    SELECT * FROM temp_leads 
    WHERE tenant_id = $1 
    AND (
      name ILIKE $2 OR 
      email ILIKE $2 OR 
      phone ILIKE $2 OR 
      message ILIKE $2
    )
  `;

  const params: any[] = [options.tenantId, `%${query}%`];
  let paramIndex = 3;

  // Add filters
  if (options.filters?.status) {
    sql += ` AND status = $${paramIndex}`;
    params.push(options.filters.status);
    paramIndex++;
  }

  if (options.filters?.source) {
    sql += ` AND source = $${paramIndex}`;
    params.push(options.filters.source);
    paramIndex++;
  }

  if (options.filters?.dateRange) {
    sql += ` AND created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
    params.push(options.filters.dateRange.start, options.filters.dateRange.end);
    paramIndex += 2;
  }

  sql += ` ORDER BY created_at DESC`;

  if (options.limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(options.limit);
  }

  const { rows } = await db.query(sql, params);

  // Record search analytics
  await recordSearch(query, rows.length);

  return rows;
}

// ============================================================================
// INSTANT DASHBOARD FILTERS
// ============================================================================

export async function getFilteredLeads(filters: Record<string, unknown>) {
  const db = await getSessionDb();

  // Apply filters using SQL
  let sql = 'SELECT * FROM temp_leads WHERE tenant_id = $1';
  const params: any[] = [filters.tenantId];
  let paramIndex = 2;

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'tenantId') return;

    if (value && typeof value === 'string') {
      sql += ` AND ${key} = $${paramIndex}`;
      params.push(value);
      paramIndex++;
    } else if (Array.isArray(value) && value.length > 0) {
      sql += ` AND ${key} IN (${value.map(() => `$${paramIndex++}`).join(', ')})`;
      params.push(...value);
    }
  });

  const { rows } = await db.query(sql, params);
  return rows;
}

export async function getLeadAnalytics(tenantId: string) {
  const db = await getSessionDb();

  const [statusCounts, sourceCounts, recentLeads] = await Promise.all([
    db.query(
      `
      SELECT status, COUNT(*) as count 
      FROM temp_leads 
      WHERE tenant_id = $1 
      GROUP BY status
    `,
      [tenantId]
    ),
    db.query(
      `
      SELECT source, COUNT(*) as count 
      FROM temp_leads 
      WHERE tenant_id = $1 
      GROUP BY source
    `,
      [tenantId]
    ),
    db.query(
      `
      SELECT * FROM temp_leads 
      WHERE tenant_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `,
      [tenantId]
    ),
  ]);

  return {
    statusCounts: statusCounts.rows,
    sourceCounts: sourceCounts.rows,
    recentLeads: recentLeads.rows,
  };
}

// ============================================================================
// SESSION CLEANUP
// ============================================================================

export function cleanupSession(): void {
  _sessionDb = null;
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupSession);
}

// ============================================================================
// REACT HOOK FOR SESSION STATE
// ============================================================================

import { useEffect, useState, useCallback } from 'react';

export function useSessionState() {
  const [stats, setStats] = useState({
    pageViews: 0,
    events: 0,
    searches: 0,
    filters: 0,
  });

  useEffect(() => {
    let mounted = true;

    const updateStats = async () => {
      const currentStats = await getSessionStats();
      if (mounted) {
        setStats(currentStats);
      }
    };

    updateStats();

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const recordPage = useCallback((pathname: string) => {
    recordPageView(pathname);
  }, []);

  const record = useCallback((type: string, payload?: Record<string, unknown>) => {
    recordEvent(type, payload);
  }, []);

  const search = useCallback((query: string, resultsCount: number) => {
    recordSearch(query, resultsCount);
  }, []);

  return {
    stats,
    recordPage,
    record,
    search,
  };
}
```

**PGlite WASM principles:**

- **Session-local storage**: In-memory database for session duration only
- **Instant queries**: No round-trips for complex filtering and search
- **Full SQL capabilities**: Use complete SQL for complex operations
- **Performance optimization**: Indexes for frequently queried data
- **Automatic cleanup**: Database cleared on page unload
- **Analytics tracking**: Built-in session analytics and scoring
- **React integration**: Custom hooks for easy component usage

---

## Boundaries

| Tier             | Scope                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Follow section 6.5 specification; use session-local storage; implement instant queries; add analytics tracking; maintain performance |
| ⚠️ **Ask first** | Changing existing state management; modifying analytics patterns; updating search functionality                                      |
| 🚫 **Never**     | Persist sensitive data in session storage; skip cleanup; ignore performance optimization; exceed memory limits                       |

---

## Success Verification

- [ ] **[Agent]** Test session database — In-memory storage works correctly
- [ ] **[Agent]** Verify instant queries — Search and filtering respond instantly
- [ ] **[Agent]** Test analytics tracking — Events and page views recorded
- [ ] **[Agent]** Verify session scoring — Engagement scores calculated correctly
- [ ] **[Agent]** Test cleanup — Database cleared on page unload
- [ ] **[Agent]** Test React hook — State management works in components
- [ ] **[Human]** Test with real user interactions — Session tracking works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Memory limits**: Monitor memory usage with large datasets
- **Performance impact**: Ensure indexes for frequently queried data
- **Data consistency**: Handle temporary data population correctly
- **Session duration**: Ensure cleanup happens on all exit scenarios
- **Browser compatibility**: Verify PGlite works across target browsers
- **Query optimization**: Use proper SQL patterns for performance

---

## Out of Scope

- ElectricSQL sync patterns (handled in separate task)
- Connection pooling configuration (handled in separate task)
- Schema migration safety (handled in separate task)
- Database schema design (handled in separate domain)

---

## References

- [Section 6.5 PGlite WASM Pattern for On-Device State](docs/plan/domain-6/6.5-pglite-wasm-pattern-for-on-device-state.md)
- [Section 6.1 Philosophy](docs/plan/domain-6/6.1-philosophy.md)
- [PGlite Documentation](https://github.com/electric-sql/pglite)
- [WASM Performance Best Practices](https://web.dev/webassembly/)
- [Session Storage Patterns](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
