# pgbouncer-supavisor-configuration.md

> **2026 Standards Compliance** | Supavisor 1.x · PgBouncer 1.22 · Supabase Pooler ·
> Serverless Edge Functions · Prisma · Drizzle ORM

## Table of Contents

1. [Overview — PgBouncer vs Supavisor](#overview--pgbouncer-vs-supavisor)
2. [The Serverless Connection Problem](#the-serverless-connection-problem)
3. [Supavisor Configuration (Supabase Hosted)](#supavisor-configuration-supabase-hosted)
4. [Connection String Selection Guide](#connection-string-selection-guide)
5. [Pool Mode Deep Dive](#pool-mode-deep-dive)
6. [Local Development Pooler](#local-development-pooler)
7. [Drizzle ORM Configuration](#drizzle-orm-configuration)
8. [Monitoring Connection Health](#monitoring-connection-health)
9. [Troubleshooting](#troubleshooting)
10. [References](#references)

---

## Overview — PgBouncer vs Supavisor

Supabase transitioned from PgBouncer to **Supavisor** — a multi-tenant, cloud-native
connection pooler built in Elixir — for all hosted projects.

| Dimension                              | PgBouncer (legacy)  | Supavisor (current)          |
| -------------------------------------- | ------------------- | ---------------------------- |
| Architecture                           | Single-process C    | Elixir OTP, distributed      |
| Multi-tenancy                          | Manual per-instance | Native, per-tenant isolation |
| Protocol                               | PostgreSQL wire     | PostgreSQL wire              |
| Prepared statements (transaction mode) | ❌ Not supported    | ✅ Supported                 |
| Named cursors in transaction mode      | ❌                  | ✅                           |
| LISTEN/NOTIFY                          | Session mode only   | Session mode only            |
| IPv6                                   | ✅                  | ✅                           |
| Self-hosted option                     | ✅                  | ✅ (open source)             |
| Supabase hosted                        | Deprecated          | **Default**                  |

---

## The Serverless Connection Problem

Every Vercel Edge Function, Next.js Server Action, and Supabase Edge Function creates
a **new process** on every invocation. Without pooling:

```

100 concurrent requests
│
▼ Without pooler: 100 new Postgres connections
▼ With pooler: ≤ 20 Postgres connections, 100 pooler connections

Postgres default max_connections = 100
Supabase Free plan max_connections = 60
Supabase Pro plan max_connections = 200

Single Next.js Server Action burst → can exhaust 60 connections instantly

```

### Connection Limits by Plan

| Supabase Plan | Direct Connections | Pooler Connections    |
| ------------- | ------------------ | --------------------- |
| Free          | 60                 | 200 (Supavisor)       |
| Pro           | 200                | Unlimited (Supavisor) |
| Team          | 200                | Unlimited             |
| Enterprise    | Custom             | Custom                |

---

## Supavisor Configuration (Supabase Hosted)

### Dashboard Configuration

Navigate to: **Project → Settings → Database → Connection Pooling**

```

Pool Mode: Transaction (recommended for serverless)
Pool Size: 15 (default; tune based on Postgres max_connections)
Max Client Conn: 200 (pro) / 100 (free)
Server Lifetime: 3600s
Client Lifetime: 3600s
Query Timeout: 0 (disabled — set at application level)

```

### Connection String Formats

```bash
# Direct connection (for migrations ONLY — bypasses pooler)
# Port: 5432
postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Supavisor — Transaction mode (for Server Actions, API routes, Edge Functions)
# Port: 6543
postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supavisor — Session mode (for long-lived connections: LISTEN/NOTIFY, cursors)
# Port: 5432 via pooler subdomain
postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Environment Variables

```bash
# .env.local / Vercel Environment Variables

# ─── Supabase Auth URLs (use anon/service role keys) ────────────
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ─── Database — DO NOT use direct URL in serverless code ────────
# Direct: migrations only (Drizzle migrate, Prisma migrate)
DATABASE_URL=postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres

# Pooler: all runtime queries (Server Actions, API routes)
DATABASE_POOL_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supavisor IPv6 (if running in IPv6-only environment)
DATABASE_POOL_URL_IPV6=postgresql://[2a05:...]:6543/postgres
```

---

## Connection String Selection Guide

```typescript
// packages/db/src/connection.ts

/**
 * Returns the correct database URL for the execution context.
 *
 * RULE: Never use DATABASE_URL in runtime code — always use DATABASE_POOL_URL
 * RULE: Always use DATABASE_URL for Drizzle/Prisma migrate commands
 */
export function getDatabaseUrl(context: 'runtime' | 'migration' | 'analytics'): string {
  switch (context) {
    case 'migration':
      // Migrations need persistent session state — use direct connection
      const migrationUrl = process.env.DATABASE_URL;
      if (!migrationUrl) throw new Error('DATABASE_URL required for migrations');
      return migrationUrl;

    case 'analytics':
      // Long-running analytical queries — use session mode pooler
      // or dedicated read replica if available
      return process.env.DATABASE_ANALYTICS_URL ?? process.env.DATABASE_POOL_URL!;

    case 'runtime':
    default:
      // All Server Actions, API routes, Edge Functions
      const poolUrl = process.env.DATABASE_POOL_URL;
      if (!poolUrl) throw new Error('DATABASE_POOL_URL required for runtime');
      return poolUrl;
  }
}
```

---

## Pool Mode Deep Dive

### Transaction Mode (Default — Recommended for Serverless)

```
Client → Pooler → Postgres Connection (for duration of 1 transaction)
                → Connection returned to pool after COMMIT/ROLLBACK

Behavior:
✅ Works for: most CRUD operations, Server Actions, API routes
✅ Supports: prepared statements (Supavisor only)
❌ Does NOT work: SET session variables, advisory locks across requests
❌ Does NOT work: LISTEN/NOTIFY (session-level)
❌ Does NOT work: server-side cursors across transactions
```

### Session Mode (For Long-lived Connections)

```
Client → Pooler → Postgres Connection (held for client's full session)
                → Connection released only when client disconnects

Use for:
✅ LISTEN/NOTIFY subscriptions
✅ Server-side cursors
✅ pg_advisory_lock across operations
✅ temp tables across requests

⚠️  Session mode provides LESS multiplexing benefit than transaction mode
```

---

## Local Development Pooler

```toml
# supabase/config.toml — enable Supavisor locally

[db.pooler]
enabled = true
port = 54329                 # Default Supavisor local port
pool_mode = "transaction"
default_pool_size = 20
max_client_conn = 100
```

```bash
# Local connection strings
# Direct (for migrations):
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Pooler (for runtime — matches production behavior):
DATABASE_POOL_URL=postgresql://postgres:postgres@localhost:54329/postgres
```

---

## Drizzle ORM Configuration

```typescript
// packages/db/src/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDatabaseUrl } from './connection';
import * as schema from './schema';

// Runtime client — transaction mode pooler
function createRuntimeClient() {
  const connectionString = getDatabaseUrl('runtime');

  const client = postgres(connectionString, {
    // Transaction mode pooler settings
    max: 1, // Supavisor handles pooling — keep driver pool at 1 per function
    idle_timeout: 20, // Release idle connections quickly in serverless
    connect_timeout: 10,
    prepare: false, // IMPORTANT: disable prepared statements for pgbouncer compat
    // (Supavisor supports them, but safer to disable for portability)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  return drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' });
}

// Migration client — direct connection, no pooler
function createMigrationClient() {
  const connectionString = getDatabaseUrl('migration');
  const client = postgres(connectionString, {
    max: 1,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  return drizzle(client, { schema });
}

// Lazy singleton for serverless — created once per Lambda cold start
let _db: ReturnType<typeof createRuntimeClient> | null = null;

export function getDb() {
  if (!_db) _db = createRuntimeClient();
  return _db;
}

export { createMigrationClient };
```

### Drizzle Package.json Scripts

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx packages/db/src/seed.ts"
  }
}
```

### Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './packages/db/src/schema/*',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // ALWAYS use direct URL for migrations — never pooler
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  // Generate Supabase-compatible migrations
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations',
    schema: 'public',
  },
} satisfies Config;
```

---

## Monitoring Connection Health

```sql
-- Check active connections per client (run in Supabase SQL editor)
SELECT
  application_name,
  state,
  COUNT(*) as connection_count,
  MAX(EXTRACT(EPOCH FROM (NOW() - state_change))) as max_idle_seconds
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name, state
ORDER BY connection_count DESC;

-- Check connection pool utilization
SELECT
  datname,
  numbackends as active_connections,
  (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
  ROUND(
    numbackends::float /
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') * 100,
    1
  ) as utilization_pct
FROM pg_stat_database
WHERE datname = current_database();
```

### Alert: Connection Exhaustion

```yaml
# monitoring/alerts.yml
- name: HighConnectionUtilization
  condition: pg_connections_utilization_pct > 80
  severity: warning
  action:
    - Alert engineering team
    - Review for connection leaks (missing await/return in async DB functions)
    - Consider reducing default_pool_size and adding read replicas

- name: ConnectionPoolExhausted
  condition: pg_connections_utilization_pct > 95
  severity: critical
  action:
    - Page on-call immediately
    - Temporarily scale down non-critical background jobs
    - Review application for synchronous connection holds
```

---

## Troubleshooting

| Symptom                                      | Likely Cause                       | Fix                                                                |
| -------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `remaining connection slots reserved`        | Exhausted `max_connections`        | Use pooler; reduce `default_pool_size`                             |
| `prepared statement "s0" already exists`     | Prepared statements with PgBouncer | Set `prepare: false` in postgres.js client                         |
| `cannot use LISTEN with transaction pooling` | LISTEN in transaction mode         | Use Supabase Realtime instead                                      |
| `SSL SYSCALL error: EOF detected`            | Connection dropped by pooler       | Set `idle_timeout: 20` in client config                            |
| Very slow first query per Lambda             | Cold start + new connection        | Use connection warmup; Supavisor handles better than raw PgBouncer |
| `pgbouncer=true` param not working           | Old config format                  | Supavisor uses port 6543 — remove pgbouncer=true param             |

---

## References

- [Supabase PgBouncer Post](https://supabase.com/blog/supabase-pgbouncer)
- [Supavisor Migration from PgBouncer](https://supabase.github.io/supavisor/migrating/pgbouncer/)
- [Supabase Connecting to Postgres](https://docs-12z0pelsj-supabase.vercel.app/docs/guides/database/connecting-to-postgres)
- [Supabase Local Pooler Config](https://github.com/orgs/supabase/discussions/21264)
- [Drizzle + Supabase Docs](https://orm.drizzle.team/docs/connect-supabase)
