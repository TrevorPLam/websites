# PgBouncer/Supavisor Connection Pooling Configuration

## Purpose

This guide defines production-ready Supavisor (PgBouncer-compatible) pooling for serverless Next.js workloads.

## Connection URL strategy

- `SUPABASE_TRANSACTION_POOL_URL`: use for Server Components and Server Actions.
- `SUPABASE_DIRECT_URL`: use only for migrations/introspection and long-lived tools.
- `SUPABASE_REPLICA_URL`: optional; route analytics-heavy reads here.

## Implementation reference

Use `packages/integrations/supabase/pooling.ts` for:

- Singleton admin client to prevent connection explosion.
- Replica client fallback to admin when replica URL is unavailable.
- Per-tier query governor statement timeout profiles.
- Health checks for connection pool observability.

## Environment variables

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role>
SUPABASE_TRANSACTION_POOL_URL=postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:6543/postgres
SUPABASE_DIRECT_URL=postgresql://postgres:<pw>@db.<ref>.supabase.co:5432/postgres
SUPABASE_REPLICA_URL=postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

## QA checklist

1. Confirm transaction pool URL is used for runtime queries.
2. Verify singleton reuse across repeated calls.
3. Verify `getReplicaClient()` falls back when `SUPABASE_REPLICA_URL` is unset.
4. Run integration tests for `@repo/integrations/supabase`.
