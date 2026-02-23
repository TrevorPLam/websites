---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-003
title: 'Complete Supabase RLS implementation with tenant isolation'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-003-supabase-rls-implementation
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-003 · Complete Supabase RLS implementation with tenant isolation

## Objective

Implement complete Supabase Row-Level Security (RLS) following section 4.4 specification with comprehensive tenant isolation, helper functions, database schema, and policies that enforce multi-tenant data security at the database level.

---

## Context

**Codebase area:** Database migrations and RLS policies — Supabase database security

**Related files:** Existing database schema, tenant context, authentication system

**Dependencies:** Supabase database, PostgreSQL RLS, existing authentication infrastructure

**Prior work:** Basic database schema exists but lacks comprehensive RLS policies and tenant isolation

**Constraints:** Must implement complete tenant isolation following 2026 SaaS security standards

---

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Database  | Supabase with PostgreSQL RLS                      |
| Security  | Row-level security policies with tenant isolation |
| Migration | SQL migrations with RLS policies                  |
| Testing   | E2E tests for isolation verification              |

---

## Acceptance Criteria

- [ ] **[Agent]** Create complete database schema following section 4.4 specification
- [ ] **[Agent]** Implement auth.tenant_id() helper function for optimized RLS policies
- [ ] **[Agent]** Add all tables with RLS enabled and tenant_id columns
- [ ] **[Agent]** Create comprehensive RLS policies for all tables
- [ ] **[Agent]** Implement composite indexes for RLS performance optimization
- [ ] **[Agent]** Add tenant_members table for user-tenant relationships
- [ ] **[Agent]** Create audit_logs table for security event tracking
- [ ] **[Agent]** Implement database migration with proper down migrations
- [ ] **[Agent]** Test RLS policies with various tenant scenarios
- [ ] **[Human]** Verify RLS prevents all cross-tenant data access

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 4.4 specification** — Extract complete schema requirements
- [ ] **[Agent]** **Create database migration** — Implement complete schema with RLS
- [ ] **[Agent]** **Add helper functions** — Implement auth.tenant_id() and other utilities
- [ ] **[Agent]** **Create tenant isolation tables** — tenants, tenant_members, business tables
- [ ] **[Agent]** **Implement RLS policies** — Add policies for all tables following specification
- [ ] **[Agent]** **Add performance indexes** — Create composite indexes for RLS queries
- [ ] **[Agent]** **Create audit logging** — Add audit_logs table with proper RLS
- [ ] **[Agent]** **Test RLS isolation** — Verify cross-tenant access is blocked
- [ ] **[Agent]** **Create down migrations** — Ensure safe rollback capability

> ⚠️ **Agent Question**: Ask human before proceeding if any existing database data needs migration.

---

## Commands

```bash
# Run database migration
supabase db push

# Test RLS policies manually
psql $DATABASE_URL -c "SELECT auth.tenant_id();"

# Verify RLS is enabled
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE rowsecurity = true;"

# Test tenant isolation
psql $DATABASE_URL -c "SELECT * FROM leads WHERE tenant_id = 'test-tenant';"
```

---

## Code Style

```sql
-- ✅ Correct — Complete RLS implementation following section 4.4
-- Enable pgcrypto for encrypted secrets storage
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable pg_stat_statements for query governor
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- ============================================================================
-- HELPER FUNCTION: Get current user's tenant_id
-- Using a function (not inline subquery) enables Postgres to optimize/cache
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT tenant_id
  FROM public.tenant_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ============================================================================
-- TENANTS TABLE
-- ============================================================================

CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain       TEXT UNIQUE NOT NULL CHECK (subdomain ~ '^[a-z0-9-]+$'),
  custom_domain   TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'trial'
                    CHECK (status IN ('active', 'trial', 'suspended', 'cancelled')),
  billing_tier    TEXT NOT NULL DEFAULT 'starter'
                    CHECK (billing_tier IN ('starter', 'professional', 'enterprise')),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  config          JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: Tenants can only see their own row
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_select_own" ON tenants
  FOR SELECT
  USING (id = auth.tenant_id());

CREATE POLICY "tenants_update_own" ON tenants
  FOR UPDATE
  USING (id = auth.tenant_id())
  WITH CHECK (id = auth.tenant_id());

-- Service role can manage all tenants (for admin operations)
CREATE POLICY "tenants_service_role" ON tenants
  USING (auth.role() = 'service_role');

-- ============================================================================
-- TENANT_MEMBERS TABLE (User ↔ Tenant many-to-many)
-- ============================================================================

CREATE TABLE tenant_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by  UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, user_id)
);

ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

-- Users can see their own membership records
CREATE POLICY "tenant_members_select" ON tenant_members
  FOR SELECT
  USING (user_id = auth.uid() OR tenant_id = auth.tenant_id());

-- ============================================================================
-- LEADS TABLE (Example business table with tenant isolation)
-- ============================================================================

CREATE TABLE leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Users can only access leads from their own tenant
CREATE POLICY "leads_select_own" ON leads
  FOR SELECT
  USING (tenant_id = auth.tenant_id());

CREATE POLICY "leads_insert_own" ON leads
  FOR INSERT
  WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY "leads_update_own" ON leads
  FOR UPDATE
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY "leads_delete_own" ON leads
  FOR DELETE
  USING (tenant_id = auth.tenant_id());

-- Indexes for RLS performance
CREATE INDEX idx_leads_tenant_id ON leads (tenant_id);
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_created_at ON leads (created_at);
CREATE INDEX idx_leads_email ON leads (email);
```

**RLS principles:**

- Every table has tenant_id column for isolation
- RLS policies use auth.tenant_id() for consistent tenant verification
- Service role bypasses RLS for admin operations
- Composite indexes optimize RLS query performance
- All mutations are logged for audit trail

---

## Boundaries

| Tier             | Scope                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Follow section 4.4 specification; implement complete tenant isolation; add RLS to all tables; create proper indexes; include audit logging |
| ⚠️ **Ask first** | Modifying existing database structure; migrating existing data; changing RLS policy logic; updating authentication flow                    |
| 🚫 **Never**     | Skip tenant_id columns; bypass RLS policies; allow cross-tenant data access; ignore performance optimization for RLS queries               |

---

## Success Verification

- [ ] **[Agent]** Run database migration — All tables created with RLS enabled
- [ ] **[Agent]** Test helper function — `SELECT auth.tenant_id()` returns correct tenant ID
- [ ] **[Agent]** Verify RLS policies — Cross-tenant queries return empty results
- [ ] **[Agent]** Test performance indexes — RLS queries use indexes efficiently
- [ ] **[Agent]** Verify audit logging — All mutations are properly logged
- [ ] **[Agent]** Test down migration — Rollback capability works correctly
- [ ] **[Human]** Test tenant isolation — No cross-tenant data access possible
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Data migration:** Ensure existing data is properly migrated with tenant_id values
- **Performance:** Monitor query performance with RLS enabled and optimize indexes
- **Service role usage:** Ensure service role is only used for legitimate admin operations
- **Policy conflicts:** Avoid conflicting RLS policies that could cause unexpected behavior
- **Function security:** Ensure helper functions are properly secured with SECURITY DEFINER

---

## Out of Scope

- Application-level security (handled by middleware and Server Actions)
- Per-tenant secrets management (handled in separate task)
- Post-quantum cryptography (handled in separate task)
- Rate limiting and request validation (handled in middleware)

---

## References

- [Section 4.4 Complete Supabase RLS Implementation](docs/plan/domain-4/4.4-complete-supabase-rls-implementation.md)
- [Section 4.1 Philosophy](docs/plan/domain-4/4.1-philosophy.md)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowse.html)
- [2026 SaaS Security Standards](https://csrc.nist.gov/publications/final/)
