# Security-2: Multi-Tenant RLS (Row-Level Security)

## Metadata

- **Task ID**: security-2-rls-multi-tenant
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Security)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Multi-tenancy, data isolation, THEGOAL security
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-1-server-action-hardening
- **Downstream Tasks**: infrastructure-4-data-residency

## Context

Multi-tenant data isolation requires Row-Level Security (RLS) policies in Supabase to enforce tenant boundaries at the database level. Current state:

- Shared DB instance across clients
- RLS may exist for user-level but not systematically for tenant-level
- Incomplete `tenant_id` coverage across tables
- No `auth.tenant_id()` helper function for JWT claims

This addresses **Research Topic #3: Multi-Tenant Data Isolation (Supabase RLS)** from perplexity research.

## Dependencies

- **Upstream Task**: `security-1-server-action-hardening` — secureAction pattern uses tenant context
- **Required Packages**: Supabase, `@repo/infra`, `@repo/database`

## Cross-Task Dependencies & Sequencing

- **Upstream**: `security-1-server-action-hardening` (provides tenant context)
- **Parallel Work**: Can work alongside `security-1` (RLS policies complement secureAction)
- **Downstream**: `infrastructure-4-data-residency` (multi-region RLS)

## Research

- **Primary topics**: [R-SECURITY-ADV](RESEARCH-INVENTORY.md#r-security-adv-security-regression-threat-modeling), [R-SECURITY-RLS](RESEARCH-INVENTORY.md#r-security-rls) (new)
- **[2026-02] Research Topic #3**: Multi-tenant RLS requirements:
  - Every tenant-scoped table has `tenant_id` (or `org_id`)
  - RLS enabled on all such tables
  - Policies match `tenant_id` from JWT or secure session setting
  - Membership table pattern for multi-org users
- **Threat Model**: Any RLS misconfig leads directly to cross-tenant data exposure
- **References**:
  - [docs/research/perplexity-security-2026.md](../docs/research/perplexity-security-2026.md) (Topic #3)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)
  - Supabase RLS documentation

## Related Files

- `supabase/migrations/XXXXX_add_tenant_id_to_tables.sql` – create – Add tenant_id columns
- `supabase/migrations/XXXXX_enable_rls_policies.sql` – create – Enable RLS and create policies
- `supabase/migrations/XXXXX_auth_tenant_id_function.sql` – create – Create auth.tenant_id() helper
- `packages/database/src/booking.ts` – modify – Ensure all queries use tenant-scoped client
- `packages/infra/src/auth/tenant-context.ts` – create – Tenant context utilities
- `docs/architecture/security/multi-tenant-rls.md` – create – Document RLS patterns

## Acceptance Criteria

- [ ] All tenant-scoped tables have `tenant_id` column:
  - `bookings` table
  - `sites` table
  - `leads` table
  - `webhooks` table
  - `ai_usage` table (if exists)
  - Other tenant-scoped tables
- [ ] RLS enabled on all tenant-scoped tables:
  - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- [ ] `auth.tenant_id()` helper function created:
  - Extracts `tenant_id` from JWT `app_metadata`
  - Returns UUID or NULL
- [ ] RLS policies created for all tenant-scoped tables:
  - SELECT policy: `tenant_id = auth.tenant_id()`
  - INSERT/UPDATE/DELETE policies: `tenant_id = auth.tenant_id()` with WITH CHECK
- [ ] Database access layer updated:
  - All queries use tenant-scoped Supabase client
  - No direct service role access for tenant data (except migrations)
- [ ] Documentation created: `docs/architecture/security/multi-tenant-rls.md`
- [ ] Migration tests verify RLS policies work correctly
- [ ] E2E tests verify cross-tenant access fails

## Technical Constraints

- Must work with Supabase RLS
- JWT must include `app_metadata.tenant_id`
- Service role client must bypass RLS for migrations/admin
- Policies must be idempotent (safe to re-run migrations)

## Implementation Plan

### Phase 1: Schema Updates

- [ ] Create migration to add `tenant_id` to all tenant-scoped tables:
  ```sql
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tenant_id UUID;
  CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id);
  -- Repeat for other tables
  ```
- [ ] Backfill `tenant_id` for existing rows:
  ```sql
  UPDATE bookings SET tenant_id = (SELECT tenant_id FROM sites WHERE sites.id = bookings.site_id);
  -- Repeat for other tables
  ```

### Phase 2: RLS Helper Function

- [ ] Create `auth.tenant_id()` function:
  ```sql
  CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
  BEGIN
    RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
  END;
  $$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
  ```

### Phase 3: RLS Policies

- [ ] Enable RLS on all tenant-scoped tables:
  ```sql
  ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  -- Repeat for other tables
  ```
- [ ] Create SELECT policies:
  ```sql
  CREATE POLICY "tenant_isolation_select"
  ON bookings
  FOR SELECT
  USING (tenant_id = auth.tenant_id());
  ```
- [ ] Create INSERT/UPDATE/DELETE policies:
  ```sql
  CREATE POLICY "tenant_isolation_mutation"
  ON bookings
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());
  ```

### Phase 4: Application Layer Updates

- [ ] Update `packages/database/src/booking.ts`:
  - Ensure all queries use tenant-scoped client
  - Remove any service role access for tenant data
- [ ] Create `packages/infra/src/auth/tenant-context.ts`:
  - Utilities for extracting tenant context from session/JWT

### Phase 5: Testing & Documentation

- [ ] Migration tests:
  - Verify RLS policies prevent cross-tenant access
  - Verify service role can bypass RLS (for migrations)
- [ ] E2E tests:
  - Cross-tenant access fails
  - Same-tenant access succeeds
- [ ] Create `docs/architecture/security/multi-tenant-rls.md`

## Sample code / examples

### Migration: Add tenant_id and RLS

```sql
-- supabase/migrations/20260219000000_add_tenant_rls.sql

-- 1. Add tenant_id to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tenant_id UUID;
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id);

-- 2. Backfill tenant_id (example: from sites table)
UPDATE bookings
SET tenant_id = (SELECT tenant_id FROM sites WHERE sites.id = bookings.site_id)
WHERE tenant_id IS NULL;

-- 3. Create auth.tenant_id() helper
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 4. Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 5. Create SELECT policy
CREATE POLICY "tenant_isolation_select"
ON bookings
FOR SELECT
USING (tenant_id = auth.tenant_id());

-- 6. Create INSERT policy
CREATE POLICY "tenant_isolation_insert"
ON bookings
FOR INSERT
WITH CHECK (tenant_id = auth.tenant_id());

-- 7. Create UPDATE policy
CREATE POLICY "tenant_isolation_update"
ON bookings
FOR UPDATE
USING (tenant_id = auth.tenant_id())
WITH CHECK (tenant_id = auth.tenant_id());

-- 8. Create DELETE policy
CREATE POLICY "tenant_isolation_delete"
ON bookings
FOR DELETE
USING (tenant_id = auth.tenant_id());
```

### Database Access Layer

```typescript
// packages/database/src/booking.ts
import { createClient } from '@supabase/supabase-js';
import { getTenantId } from '@repo/infra/auth/tenant-context';

export async function getBookingForTenant({
  bookingId,
  tenantId,
}: {
  bookingId: string;
  tenantId: string;
}) {
  // Use anon client with JWT that includes tenant_id in app_metadata
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${await getJwtWithTenant(tenantId)}`,
        },
      },
    }
  );

  const { data, error } = await supabase.from('bookings').select('*').eq('id', bookingId).single();

  if (error) throw error;
  return data;
}
```

## Testing Requirements

- **Migration Tests:**
  - RLS policies prevent cross-tenant SELECT
  - RLS policies prevent cross-tenant INSERT/UPDATE/DELETE
  - Service role can bypass RLS (for migrations)
- **Integration Tests:**
  - Tenant A cannot access Tenant B's bookings
  - Same-tenant access succeeds
- **E2E Tests:**
  - Cross-tenant booking access fails (Playwright)

## Execution notes

- **Related files — current state:**
  - Supabase migrations may exist but RLS not systematically applied
  - `packages/database/src/booking.ts` — may use service role client
- **Potential issues / considerations:**
  - Existing data backfill (ensure tenant_id populated)
  - JWT claims configuration (ensure tenant_id in app_metadata)
  - Service role usage (must bypass RLS for migrations only)
- **Verification:**
  - Migration runs successfully
  - RLS policies prevent cross-tenant access
  - Same-tenant access works

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Migrations created and tested
- [ ] RLS policies verified (cross-tenant access fails)
- [ ] Database access layer updated (tenant-scoped queries)
- [ ] Documentation created (`docs/architecture/security/multi-tenant-rls.md`)
- [ ] E2E tests verify isolation
