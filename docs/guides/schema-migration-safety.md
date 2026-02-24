# schema-migration-safety.md

> **2026 Standards Compliance** | Zero-Downtime Migrations · pgroll · Drizzle Migrate ·
> Expand/Contract Pattern · Supabase RLS Safety

## Table of Contents

1. [Overview — Why Migrations Are Dangerous](#overview--why-migrations-are-dangerous)
2. [The Expand/Contract Pattern](#the-expandcontract-pattern)
3. [Safe vs Unsafe Operations](#safe-vs-unsafe-operations)
4. [pgroll — Zero-Downtime Reversible Migrations](#pgroll--zero-downtime-reversible-migrations)
5. [Drizzle Migrate Workflow](#drizzle-migrate-workflow)
6. [CI/CD Migration Pipeline](#cicd-migration-pipeline)
7. [RLS Policy Safety](#rls-policy-safety)
8. [Rollback Strategies](#rollback-strategies)
9. [Migration Runbook](#migration-runbook)
10. [References](#references)

---

## Overview — Why Migrations Are Dangerous

Database migrations on a running production system can cause:

- **Table locks** that block all reads/writes during migration
- **Connection exhaustion** from long-running ALTER TABLE operations
- **Data loss** from accidental DROP or constraint violations
- **Deployment failures** if new code runs against old schema (or vice versa)

The goal is **zero-downtime migrations**: the database transitions between schema
versions while the application continues serving requests without interruption.

---

## The Expand/Contract Pattern

The expand/contract (or parallel-change) pattern solves the old-code/new-code
compatibility problem by making schema changes in three phases:

```

Phase 1: EXPAND
─ Add new column/table/index alongside the old one
─ Both old and new code work simultaneously
─ Duration: deploy + backfill time

Phase 2: MIGRATE
 ─ Backfill data from old to new structure
─ Update application code to write to BOTH old + new
─ Duration: background job, days or weeks

Phase 3: CONTRACT
─ Remove old column/table after 100% traffic uses new
─ Old code is no longer deployed
─ Duration: one deploy

```

### Example: Renaming a Column

```

❌ DANGEROUS: Direct rename
ALTER TABLE leads RENAME COLUMN phone TO phone_number;
— Breaks any running code that reads 'phone'

✅ SAFE: Expand/Contract

-- Phase 1: EXPAND (backward compatible)
ALTER TABLE leads ADD COLUMN phone_number TEXT;
-- Add trigger to sync old → new
CREATE OR REPLACE FUNCTION sync_phone()
RETURNS TRIGGER AS $$
BEGIN
NEW.phone_number := NEW.phone;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;
CREATE TRIGGER sync_phone_trigger
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION sync_phone();

-- Phase 2: MIGRATE (background job)
UPDATE leads SET phone_number = phone WHERE phone_number IS NULL;

-- Phase 3: CONTRACT (after all code uses phone_number)
DROP TRIGGER sync_phone_trigger ON leads;
DROP FUNCTION sync_phone();
ALTER TABLE leads DROP COLUMN phone;
```

---

## Safe vs Unsafe Operations

### Always Safe (No Lock, Instant)

```sql
-- ✅ Adding nullable column
ALTER TABLE leads ADD COLUMN score INTEGER;

-- ✅ Adding column with constant default (PostgreSQL 11+)
ALTER TABLE leads ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- ✅ Creating index CONCURRENTLY (no table lock)
CREATE INDEX CONCURRENTLY idx_leads_tenant_id ON leads (tenant_id);

-- ✅ Adding foreign key NOT VALID (validates later, no full table scan lock)
ALTER TABLE leads
  ADD CONSTRAINT fk_leads_tenant
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  NOT VALID;

-- ✅ Validate constraint in separate migration (shares lock briefly)
ALTER TABLE leads VALIDATE CONSTRAINT fk_leads_tenant;

-- ✅ Creating new table
CREATE TABLE lead_scores (...);

-- ✅ Dropping index CONCURRENTLY
DROP INDEX CONCURRENTLY idx_old_leads;
```

### Dangerous (Long Lock or Data-Destructive)

```sql
-- ❌ Adding NOT NULL column without default — full table rewrite
ALTER TABLE leads ADD COLUMN required_field TEXT NOT NULL;
-- FIX: Add nullable, backfill, then add constraint

-- ❌ Adding column with non-constant default (PostgreSQL < 11)
ALTER TABLE leads ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
-- FIX: Use PostgreSQL 11+ (constant defaults don't rewrite table)

-- ❌ Changing column type — full table rewrite
ALTER TABLE leads ALTER COLUMN score TYPE BIGINT;
-- FIX: Add new column, backfill, drop old

-- ❌ DROP TABLE with data
DROP TABLE leads;
-- FIX: Archive to cold storage first; schedule deletion

-- ❌ Adding index WITHOUT CONCURRENTLY — locks table
CREATE INDEX idx_leads_score ON leads (score);
-- FIX: Always use CREATE INDEX CONCURRENTLY

-- ❌ Changing NOT NULL constraint — full table scan
ALTER TABLE leads ALTER COLUMN email SET NOT NULL;
-- FIX: Add CHECK constraint NOT VALID, validate separately

-- ❌ Truncate with foreign keys
TRUNCATE leads;
-- FIX: Use DELETE with batching
```

---

## pgroll — Zero-Downtime Reversible Migrations

pgroll serves **two schema versions simultaneously** — old code and new code run in
parallel during deployment. This eliminates the coordination requirement between
deploys and migrations.

### How pgroll Works

```
Before migration: views["public"] → columns: [id, name, phone]
Migration starts: pgroll creates "pgroll_new_schema_v2" view
                  with [id, name, phone_number]
                  + trigger syncs phone ↔ phone_number bidirectionally
During migration: old code reads/writes "public" (phone)
                  new code reads/writes "pgroll_new_schema_v2" (phone_number)
After completion: pgroll drops trigger, drops phone,
                  renames view to "public"
```

### pgroll Migration Format

```json
// supabase/migrations/20260223_rename_phone.json
{
  "name": "rename_phone_to_phone_number",
  "operations": [
    {
      "rename_column": {
        "table": "leads",
        "from": "phone",
        "to": "phone_number",
        "up": "phone",
        "down": "phone_number"
      }
    }
  ]
}
```

```json
// supabase/migrations/20260224_add_score_not_null.json
{
  "name": "add_lead_score_not_null",
  "operations": [
    {
      "add_column": {
        "table": "leads",
        "column": {
          "name": "score",
          "type": "integer",
          "nullable": false,
          "default": "0"
        },
        "up": "COALESCE(score, 0)", // Backfill logic for old rows
        "down": "score"
      }
    }
  ]
}
```

### pgroll CLI Workflow

```bash
# Install pgroll
brew install xataio/tap/pgroll  # macOS
# or: go install github.com/xataio/pgroll@latest

# Set connection string (use direct connection for migrations)
export PGROLL_PG_URL=$DATABASE_URL

# Start a migration (creates new schema version, old code still works)
pgroll start supabase/migrations/20260223_rename_phone.json

# Deploy new application code that uses phone_number

# Complete the migration (removes old schema, drops sync triggers)
pgroll complete

# Or roll back if issues (restores old schema fully)
pgroll rollback
```

---

## Drizzle Migrate Workflow

For simpler migrations that don't require pgroll's parallel versioning:

```typescript
// packages/db/src/scripts/migrate.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { createMigrationClient } from '../connection';

async function runMigrations() {
  console.log('Starting database migrations…');
  const db = createMigrationClient();

  await migrate(db, {
    migrationsFolder: './supabase/migrations',
  });

  console.log('✅ Migrations complete');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
```

### Pre-Migration Checklist

```typescript
// packages/db/src/scripts/pre-migration-check.ts
import postgres from 'postgres';

async function preMigrationCheck() {
  const sql = postgres(process.env.DATABASE_URL!);

  // 1. Check for long-running queries that would be blocked
  const longQueries = await sql`
    SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
    FROM pg_stat_activity
    WHERE (now() - pg_stat_activity.query_start) > INTERVAL '1 minute'
      AND state != 'idle'
  `;

  if (longQueries.length > 0) {
    console.error('⚠️  Long-running queries detected:');
    longQueries.forEach((q) =>
      console.error(`  PID ${q.pid}: ${q.duration} — ${q.query.substring(0, 100)}`)
    );
    // Don't fail — just warn. Operator makes the call.
  }

  // 2. Check connection count
  const [connInfo] = await sql`
    SELECT numbackends,
           (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max
    FROM pg_stat_database
    WHERE datname = current_database()
  `;
  const utilization = (connInfo.numbackends / connInfo.max) * 100;
  if (utilization > 70) {
    console.warn(
      `⚠️  Connection utilization at ${utilization.toFixed(0)}% — consider off-peak migration`
    );
  }

  // 3. Check disk space
  const [diskInfo] = await sql`
    SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
  `;
  console.log(`📊 Database size: ${diskInfo.db_size}`);

  await sql.end();
}
```

---

## CI/CD Migration Pipeline

```yaml
# .github/workflows/deploy.yml (migration steps)
jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4

      - name: Pre-migration health check
        run: pnpm tsx packages/db/src/scripts/pre-migration-check.ts
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Backup schema (snapshot)
        run: |
          pg_dump $DATABASE_URL --schema-only --no-owner \
            > schema-backup-$(date +%Y%m%d%H%M%S).sql
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Run migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Post-migration smoke test
        run: pnpm tsx packages/db/src/scripts/smoke-test.ts
        env:
          DATABASE_POOL_URL: ${{ secrets.DATABASE_POOL_URL }}

      # Deploy app ONLY after migration succeeds
      - name: Deploy application
        if: success()
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## RLS Policy Safety

RLS changes are **immediately effective** — unlike schema migrations, they cannot be
rolled back with a schema version. Test thoroughly in staging first.

```sql
-- SAFE: Adding a permissive policy (extends access, never reduces)
CREATE POLICY "tenants_can_read_own_data"
  ON leads FOR SELECT
  USING (tenant_id = auth.jwt() ->> 'tenant_id');

-- RISKY: Modifying existing policy — test impact
-- First: check which queries the policy affects in staging
EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM leads WHERE tenant_id = 'test-tenant';

-- Add new policy alongside old (during transition)
CREATE POLICY "leads_new_access_v2"
  ON leads FOR SELECT
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id'));

-- Only drop old policy after verifying new one works
DROP POLICY "leads_old_access" ON leads;
```

---

## Rollback Strategies

```
Strategy 1: Blue/Green Deployment
─ Run old + new database schema simultaneously (expand/contract)
─ Route traffic between old and new app versions
─ Roll back by switching traffic to old version
─ Zero data loss

Strategy 2: Schema Snapshot Rollback
─ Take pg_dump before every migration
─ Restore from snapshot if migration fails
─ Acceptable for small tables; slow for large datasets

Strategy 3: Application-Level Rollback
─ Keep old code path behind feature flag
─ Disable feature flag if migration causes issues
─ Schema remains changed; code falls back to safe path

Strategy 4: pgroll Rollback (Best)
─ pgroll maintains both schema versions
─ pgroll rollback — instant, no data loss
─ Only available when using pgroll migrations
```

---

## Migration Runbook

```
Pre-Migration:
□ Verify migration tested on staging with production data size
□ Check long-running queries (pre-migration-check.ts)
□ Check connection pool utilization < 70%
□ Schedule during low-traffic window (weekday 2–4am CST)
□ Notify team via #deployments Slack channel
□ Have rollback plan documented

During Migration:
□ Monitor pg_stat_activity for blocking locks
□ Watch connection count during migration
□ Keep migration window to < 15 minutes for non-concurrent ops
□ For CONCURRENTLY operations: expect 10–60min for large tables

Post-Migration:
□ Run smoke tests (packages/db/src/scripts/smoke-test.ts)
□ Verify RLS policies work as expected
□ Check application error rate in Sentry for 15 minutes
□ Mark migration as complete in runbook
□ Schedule Phase 3 (CONTRACT) ticket if using expand/contract
```

---

## References

- [Zero-Downtime Postgres Schema Changes](https://xata.io/blog/zero-downtime-schema-migrations-postgresql)
- [pgroll GitHub](https://github.com/xataio/pgroll)
- [How to Perform Postgres Schema Changes — Workshop](https://www.youtube.com/watch?v=-1aO6UznfI0)
- [Drizzle Migrations Docs](https://orm.drizzle.team/docs/migrations)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Safe and Unsafe Migration Operations](https://www.postgresql.org/docs/current/ddl-alter.html)
