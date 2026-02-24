# Schema Migration Safety

## Purpose

This guide defines safe migration patterns for Supabase Postgres schema changes.

## Required migration structure

Every migration must include:

- Metadata header (name, description, date, dependency).
- `UP MIGRATION` section for forward changes.
- `DOWN MIGRATION` section for rollback.
- Idempotent DDL (`IF EXISTS` / `IF NOT EXISTS`).

## Operational workflow

```bash
supabase db push --linked
supabase gen types typescript --linked > packages/integrations/supabase/types.ts
supabase db diff --linked --schema public
```

## Safety rules

1. Always include rollback SQL in the same migration file.
2. Backfill data before adding `NOT NULL` constraints.
3. Prefer additive changes first; defer destructive drops.
4. Add indexes before heavy constraint changes.
5. Validate migration on staging before production.

## Related implementation files

- `docs/plan/domain-6/6.6-schema-migration-safety.md`
- `tasks/domain-6/DOMAIN-6-004-schema-migration-safety.md`
