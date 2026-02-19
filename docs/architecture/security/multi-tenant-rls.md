<!--
/**
 * @file docs/architecture/security/multi-tenant-rls.md
 * @role docs
 * @summary Multi-tenant Row-Level Security (RLS) architecture and patterns.
 *
 * @entrypoints
 * - Security architecture documentation for multi-tenant data isolation
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - tasks/security-2-rls-multi-tenant.md
 * - supabase/migrations/20260219000000_add_tenant_rls.sql
 *
 * @used_by
 * - Developers implementing tenant-scoped queries
 * - Security reviews
 * - Database administrators
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: JWT with tenant_id, database queries
 * - outputs: Tenant-isolated query results
 *
 * @invariants
 * - RLS policies enforce tenant boundaries at database level
 * - Service role bypasses RLS (migrations/admin only)
 * - JWT must include app_metadata.tenant_id
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Multi-Tenant Row-Level Security (RLS)

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Task security-2](../../../tasks/security-2-rls-multi-tenant.md), [RLS Migration](../../../supabase/migrations/20260219000000_add_tenant_rls.sql)

---

## Overview

Multi-tenant data isolation is enforced at the database level using Supabase Row-Level Security (RLS). This ensures that tenants can only access their own data, even if application code has bugs or vulnerabilities.

## Architecture

### Components

1. **tenant_id Column** - Every tenant-scoped table has a `tenant_id` UUID column
2. **auth.tenant_id() Function** - Extracts tenant ID from JWT `app_metadata`
3. **RLS Policies** - Database-level policies that filter queries by `tenant_id`
4. **Tenant Context Utilities** - Application-layer helpers for tenant ID extraction

### Data Flow

```
User Request → JWT (with app_metadata.tenant_id) → Supabase Query → RLS Policy → Filtered Results
```

## Database Schema

### Tenant-Scoped Tables

All tenant-scoped tables must have:

```sql
ALTER TABLE table_name ADD COLUMN tenant_id UUID;
CREATE INDEX idx_table_name_tenant_id ON table_name(tenant_id);
```

**Tables with RLS:**
- `leads` - Contact form submissions
- `bookings` - Appointment bookings
- `sites` - Site configurations (tenant root)
- `webhooks` - Webhook registrations

## RLS Policies

### Policy Pattern

All tenant-scoped tables use the same policy pattern:

```sql
-- SELECT policy
CREATE POLICY "tenant_isolation_select"
  ON table_name
  FOR SELECT
  USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL);

-- INSERT policy
CREATE POLICY "tenant_isolation_insert"
  ON table_name
  FOR INSERT
  WITH CHECK (tenant_id = auth.tenant_id());

-- UPDATE policy
CREATE POLICY "tenant_isolation_update"
  ON table_name
  FOR UPDATE
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- DELETE policy
CREATE POLICY "tenant_isolation_delete"
  ON table_name
  FOR DELETE
  USING (tenant_id = auth.tenant_id());
```

### auth.tenant_id() Function

```sql
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

## Application Layer

### Tenant Context Extraction

Use `@repo/infra/auth/tenant-context` utilities:

```typescript
import { getTenantIdFromHeaders, createTenantScopedClient } from '@repo/infra/auth/tenant-context';

// In server action or API route
const headers = await headers();
const tenantId = getTenantIdFromHeaders(headers);

// Create tenant-scoped Supabase client
const client = createTenantScopedClient(
  tenantId,
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```

### Query Pattern

**Before (Service Role - Bypasses RLS):**
```typescript
const client = createSupabaseClient(); // Uses service role
const { data } = await supabase.from('leads').select('*');
```

**After (Anon Key + JWT - Respects RLS):**
```typescript
const tenantId = getTenantIdFromHeaders(headers);
const client = createTenantScopedClient(tenantId, url, anonKey);
// JWT includes tenant_id in app_metadata
const { data } = await supabase.from('leads').select('*');
// RLS automatically filters by tenant_id
```

## JWT Configuration

### Required JWT Structure

```json
{
  "app_metadata": {
    "tenant_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Setting Tenant ID in JWT

When authenticating users or creating sessions:

```typescript
// Supabase Admin API
await supabaseAdmin.auth.admin.updateUserById(userId, {
  app_metadata: {
    tenant_id: tenantId,
  },
});
```

## Migration Strategy

### Phase 1: Add tenant_id Columns

```sql
ALTER TABLE leads ADD COLUMN tenant_id UUID;
-- Backfill existing data
UPDATE leads SET tenant_id = (SELECT tenant_id FROM sites WHERE sites.id = leads.site_id);
```

### Phase 2: Enable RLS

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation_select" ON leads FOR SELECT USING (tenant_id = auth.tenant_id() OR tenant_id IS NULL);
```

### Phase 3: Backfill Data

Ensure all existing rows have `tenant_id` populated before removing `OR tenant_id IS NULL` from policies.

### Phase 4: Migrate Application Code

Update all database queries to use anon key with JWT instead of service role key.

## Security Considerations

### Service Role Key

- **Use:** Migrations, admin operations, bulk operations
- **Never Use:** Regular application queries (bypasses RLS)

### Anon Key + JWT

- **Use:** All tenant-scoped queries
- **Requires:** JWT with `app_metadata.tenant_id`

### Testing RLS

```sql
-- Test as tenant A
SET LOCAL request.jwt.claim.app_metadata = '{"tenant_id": "tenant-a-uuid"}'::jsonb;
SELECT * FROM leads; -- Should only return tenant A's leads

-- Test as tenant B
SET LOCAL request.jwt.claim.app_metadata = '{"tenant_id": "tenant-b-uuid"}'::jsonb;
SELECT * FROM leads; -- Should only return tenant B's leads
```

## Related Documentation

- [Task security-2](../../../tasks/security-2-rls-multi-tenant.md)
- [RLS Migration](../../../supabase/migrations/20260219000000_add_tenant_rls.sql)
- [Tenant Context Source](../../../packages/infra/src/auth/tenant-context.ts)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
