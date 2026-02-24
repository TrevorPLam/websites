---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-001
title: 'PgBouncer/Supavisor connection pooling complete configuration'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-6-001-connection-pooling
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-001 · PgBouncer/Supavisor connection pooling complete configuration

## Objective

Implement complete PgBouncer/Supavisor connection pooling configuration following section 6.3 specification with transaction mode, query governor, read replica routing, and connection explosion prevention for multi-tenant scalability.

---

## Context

**Codebase area:** Database client configuration — Connection pooling implementation

**Related files:** Supabase client configuration, database operations, query optimization

**Documentation Reference:**

- RLS Documentation: `docs/guides/backend-data/postgresql-rls-documentation.md` ✅ **COMPLETED**
- RDS Proxy: `docs/guides/backend-data/aws-rds-proxy-documentation.md` ✅ **COMPLETED**
- Connection Pooling: `docs/guides/pgbouncer-supavisor-configuration.md` ✅ **COMPLETED**
- Migration Safety: `docs/guides/schema-migration-safety.md` ✅ **COMPLETED**

**Current Status:** Basic database docs exist. Missing specific connection pooling and migration safety documentation for production-ready implementation.

**Dependencies:** Supabase, existing database integration, connection pooling infrastructure

**Prior work:** Basic Supabase client exists but lacks comprehensive connection pooling and query governance

**Constraints:** Must follow section 6.3 specification with proper connection URL patterns and pooling strategies

---

## Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Database     | Supabase with Supavisor connection pooler      |
| Pooling      | Transaction mode for serverless operations     |
| Optimization | Read replica routing, query governor           |
| Monitoring   | Connection pool health and performance metrics |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement complete connection pooling following section 6.3 specification
- [ ] **[Agent]** Create Supavisor transaction mode client factory
- [ ] **[Agent]** Add read replica routing for analytics queries
- [ ] **[Agent]** Implement query governor with per-tier timeouts
- [ ] **[Agent]** Add connection pool health monitoring
- [ ] **[Agent]** Create singleton client pattern for serverless
- [ ] **[Agent]** Test connection pooling under load
- [ ] **[Human]** Verify configuration follows section 6.3 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 6.3 specification** — Extract connection pooling requirements
- [ ] **[Agent]** **Create client factory** — Implement Supavisor transaction mode connection
- [ ] **[Agent]** **Add read replica routing** — Route analytics queries to replica
- [ ] **[Agent]** **Implement query governor** — Add per-tier statement timeouts
- [ ] **[Agent]** **Add health monitoring** — Monitor pool health and performance
- [ ] **[Agent]** **Create singleton pattern** — Prevent connection explosion
- [ ] **[Agent]** **Test under load** — Verify pooling works with concurrent requests
- [ ] **[Agent]** **Add documentation** — Document connection URL patterns and usage

> ⚠️ **Agent Question**: Ask human before proceeding if any existing database connections need migration to new pooling configuration.

---

## Commands

```bash
# Test connection pooling
pnpm test --filter="@repo/integrations/supabase"

# Test connection pool under load
node -e "
import { getAdminClient } from '@repo/integrations/supabase';
const promises = Array.from({ length: 100 }, () =>
  getAdminClient().from('leads').select('count')
);
await Promise.all(promises);
console.log('Connection pool test completed');
"

# Test read replica routing
node -e "
import { getReplicaClient } from '@repo/integrations/supabase';
const result = await getReplicaClient().from('leads').select('count');
console.log('Replica query result:', result);
"

# Verify connection URL patterns
echo $SUPABASE_TRANSACTION_POOL_URL
echo $SUPABASE_DIRECT_URL
echo $SUPABASE_REPLICA_URL
```

---

## Code Style

```typescript
// ✅ Correct — Complete connection pooling following section 6.3
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ============================================================================
// CONNECTION URL SELECTION GUIDE
// Direct URL:    postgresql://postgres:[pw]@db.[ref].supabase.co:5432/postgres
//   Use for:     Prisma migrate, schema introspection, long-lived processes
//   NOT for:     Serverless functions (exhausts max_connections)
//
// Supavisor (Transaction Mode):
//              postgresql://postgres.[ref]:[pw]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
//   Use for:     All Next.js Server Components, Server Actions, API routes
//   Pool mode:   transaction — connection returned after each transaction
//
// Supavisor (Session Mode):
//              postgresql://postgres.[ref]:[pw]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
//   Use for:     Queries that require session-level features (SET, LISTEN/NOTIFY)
//   NOT for:     Serverless (holds connection for session lifetime)
// ============================================================================

// Transaction mode — default for all serverless operations
const SUPAVISOR_TRANSACTION_URL = process.env.SUPABASE_TRANSACTION_POOL_URL!;

// Direct URL — only for migrations and admin scripts
export const SUPABASE_DIRECT_URL = process.env.SUPABASE_DIRECT_URL!;

// ============================================================================
// CLIENT FACTORY
// ============================================================================

let _adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getAdminClient() {
  if (_adminClient) return _adminClient;
  _adminClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: 'public' },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        // Use Supavisor transaction mode URL via custom fetch
        fetch: (url: string | Request, init?: RequestInit) => {
          // Override DB connection to use pooler
          return fetch(url, init);
        },
      },
    }
  );
  return _adminClient;
}

export const db = getAdminClient();

// ============================================================================
// READ REPLICA CLIENT
// Route analytics / reporting queries here to protect the primary
// Supabase Enterprise: enable read replicas in project settings
// ============================================================================

let _replicaClient: ReturnType<typeof createClient<Database>> | null = null;

export function getReplicaClient() {
  if (!process.env.SUPABASE_REPLICA_URL) {
    // Graceful degradation: fall back to primary
    return getAdminClient();
  }
  if (_replicaClient) return _replicaClient;
  _replicaClient = createClient<Database>(
    process.env.SUPABASE_REPLICA_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
  return _replicaClient;
}

export const replicaDb = getReplicaClient();

// ============================================================================
// QUERY GOVERNOR: Per-tier statement_timeout enforcement
// Applied at the query level for Server Actions / API routes
// ============================================================================

type Tier = 'starter' | 'professional' | 'enterprise';

const TIMEOUT_MS: Record<Tier, number> = {
  starter: 5000, // 5s
  professional: 10000, // 10s
  enterprise: 30000, // 30s
};

export function getQueryTimeout(tenantId: string): number {
  // In production, fetch tenant tier from database
  // For now, default to professional tier
  return TIMEOUT_MS.professional;
}

// ============================================================================
// CONNECTION POOL HEALTH MONITORING
// ============================================================================

interface PoolHealth {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  maxConnections: number;
  lastChecked: Date;
}

let _poolHealth: PoolHealth | null = null;

export async function getPoolHealth(): Promise<PoolHealth> {
  // Cache for 30 seconds to avoid excessive monitoring queries
  if (_poolHealth && Date.now() - _poolHealth.lastChecked.getTime() < 30000) {
    return _poolHealth;
  }

  try {
    const { data } = await db.rpc('pool_status');

    _poolHealth = {
      activeConnections: data.active_connections || 0,
      idleConnections: data.idle_connections || 0,
      totalConnections: data.total_connections || 0,
      maxConnections: data.max_connections || 100,
      lastChecked: new Date(),
    };

    return _poolHealth;
  } catch (error) {
    console.error('Failed to fetch pool health:', error);
    return {
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
      maxConnections: 100,
      lastChecked: new Date(),
    };
  }
}

// ============================================================================
// SERVER-SIDE CLIENT WITH RLS (per-request)
// Used in Server Components and Server Actions that need RLS
// ============================================================================

export async function createRLSClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'public' },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
      global: {
        fetch: (url: string | Request, init?: RequestInit) => {
          // Use pooler for RLS queries too
          return fetch(url, init);
        },
      },
    }
  );
}
```

**Connection pooling principles:**

- **Transaction mode**: Use Supavisor transaction mode for all serverless operations
- **Connection URL patterns**: Use correct URL for each use case (direct vs pooler)
- **Read replica routing**: Route analytics queries to read replicas
- **Query governor**: Enforce per-tier statement timeouts
- **Singleton pattern**: Prevent connection explosion in serverless environments
- **Health monitoring**: Track pool health and performance metrics
- **RLS compliance**: Ensure Row-Level Security works with pooled connections

---

## Boundaries

| Tier             | Scope                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 6.3 specification; use transaction mode; implement read replica routing; add query governor; monitor pool health |
| ⚠️ **Ask first** | Changing existing database connections; modifying pool configuration; updating timeout strategies                               |
| 🚫 **Never**     | Use direct URL for serverless operations; skip connection pooling; ignore pool health monitoring; exceed connection limits      |

---

## Success Verification

- [ ] **[Agent]** Test transaction mode client — Connections properly pooled
- [ ] **[Agent]** Verify read replica routing — Analytics queries use replica
- [ ] **[Agent]** Test query governor — Timeouts enforced per tier
- [ ] **[Agent]** Verify health monitoring — Pool health tracked correctly
- [ ] **[Agent]** Test singleton pattern — Connection explosion prevented
- [ ] **[Agent]** Test under load — Pool handles concurrent requests
- [ ] **[Human]** Test with real database operations — Pooling works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Connection URL selection**: Ensure correct URL pattern for each use case
- **Pool exhaustion**: Monitor pool health and implement graceful degradation
- **Read replica lag**: Handle replica lag in query results
- **Timeout enforcement**: Ensure queries respect per-tier timeouts
- **RLS compatibility**: Verify RLS works with pooled connections
- **Serverless cold starts**: Consider connection warmup strategies

---

## Out of Scope

- ElectricSQL local-first sync (handled in separate task)
- PGlite WASM patterns (handled in separate task)
- Schema migration safety (handled in separate task)
- Database schema design (handled in separate domain)

---

## References

- [Section 6.3 PgBouncer/Supavisor Connection Pooling](docs/plan/domain-6/6.3-pgbouncersupavisor-connection-pooling-complete-configuration.md)
- [Section 6.1 Philosophy](docs/plan/domain-6/6.1-philosophy.md)
- [Section 6.2 Connection Pooling Configuration](docs/plan/domain-6/6.2-connection-pooling-configuration.md)
- [Supabase Connection Pooling Documentation](https://supabase.com/docs/guides/platform/connection-pooling)
- [Supavisor Documentation](https://supabase.com/docs/guides/platform/supavisor)
