# PostgreSQL Row Level Security (RLS) — Official Reference Documentation

> **Version Reference:** PostgreSQL 15+ | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for implementing Row Security Policies with multi-tenant data isolation.

---

## Table of Contents

1. [What is Row Level Security?](#what-is-rls)
2. [Core Concepts](#core-concepts)
3. [Enabling RLS](#enabling-rls)
4. [Policy Types & Commands](#policy-types--commands)
5. [Policy USING vs WITH CHECK](#using-vs-with-check)
6. [Multi-Tenant Patterns](#multi-tenant-patterns)
7. [Role-Based Access Control (RBAC) with RLS](#rbac-with-rls)
8. [Permissive vs Restrictive Policies](#permissive-vs-restrictive-policies)
9. [Performance Considerations](#performance-considerations)
10. [Security Definer Functions](#security-definer-functions)
11. [Common Pitfalls](#common-pitfalls)
12. [Testing RLS Policies](#testing-rls-policies)
13. [Best Practices](#best-practices)

---

## What is Row Level Security?

Row Level Security (RLS), introduced in PostgreSQL 9.5, allows database administrators to define
**security policies on tables** such that every SQL operation (SELECT, INSERT, UPDATE, DELETE) is
automatically filtered according to those policies. RLS operates at the storage layer — below the
application layer — providing a true defense-in-depth security posture.

**Key Properties:**
- Enforced on all connections (application, REST API, direct DB, replication consumers)
- Transparent to the calling application
- Survives application-layer bugs or missing WHERE clauses
- Policies are version-controlled through standard SQL migrations
- Superusers and table owners **bypass** RLS by default (use `FORCE ROW LEVEL SECURITY` to override)

---

## Core Concepts

| Concept | Description |
|---|---|
| **Policy** | A SQL expression attached to a table that filters or blocks row access |
| **USING clause** | Filters rows on SELECT, UPDATE, DELETE — determines which rows are *visible* |
| **WITH CHECK clause** | Validates rows on INSERT, UPDATE — determines which rows can be *written* |
| **Permissive Policy** | Default. Multiple permissive policies are OR'd together |
| **Restrictive Policy** | AND'd against all permissive policies — always applied |
| **Row Owner** | The application-level concept of which user "owns" a row |
| **current_setting()** | Session-local variable used to pass authenticated user context to policies |

---

## Enabling RLS

```sql
-- Step 1: Enable RLS on a table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Step 2: (Optional but critical for owners) Force RLS for table owners too
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

-- Step 3: Verify RLS status
SELECT tablename, rowsecurity, forcerowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

> ⚠️ **Critical:** A table with RLS enabled but NO policies will block ALL access for
> non-superusers. Always create at least one policy immediately after enabling RLS.

---

## Policy Types & Commands

### Syntax

```sql
CREATE POLICY policy_name
  ON table_name
  [AS { PERMISSIVE | RESTRICTIVE }]
  [FOR { ALL | SELECT | INSERT | UPDATE | DELETE }]
  [TO { role_name | PUBLIC | CURRENT_USER | SESSION_USER }]
  [USING ( using_expression )]
  [WITH CHECK ( check_expression )];
```

### Basic SELECT Policy

```sql
-- Users can only see their own rows
CREATE POLICY user_isolation
  ON documents
  FOR SELECT
  USING (owner_id = current_setting('app.current_user_id')::uuid);
```

### INSERT Policy

```sql
-- Users can only insert rows they own
CREATE POLICY user_insert
  ON documents
  FOR INSERT
  WITH CHECK (owner_id = current_setting('app.current_user_id')::uuid);
```

### UPDATE Policy

```sql
-- Users can only update rows they own; cannot change owner
CREATE POLICY user_update
  ON documents
  FOR UPDATE
  USING (owner_id = current_setting('app.current_user_id')::uuid)
  WITH CHECK (owner_id = current_setting('app.current_user_id')::uuid);
```

### DELETE Policy

```sql
-- Users can only delete their own rows
CREATE POLICY user_delete
  ON documents
  FOR DELETE
  USING (owner_id = current_setting('app.current_user_id')::uuid);
```

### ALL Policy (covers all operations)

```sql
CREATE POLICY user_all_operations
  ON documents
  FOR ALL
  USING (owner_id = current_setting('app.current_user_id')::uuid)
  WITH CHECK (owner_id = current_setting('app.current_user_id')::uuid);
```

---

## USING vs WITH CHECK

| Clause | Applies To | Controls |
|---|---|---|
| `USING` | SELECT, UPDATE, DELETE | Which rows are **visible/accessible** |
| `WITH CHECK` | INSERT, UPDATE | Which rows can be **written** |
| Both | UPDATE | Rows must be visible AND new values must pass check |

```sql
-- UPDATE example: user must own the existing row AND the new data must preserve ownership
CREATE POLICY documents_update
  ON documents FOR UPDATE
  USING (owner_id = current_setting('app.current_user_id')::uuid)      -- can they see it?
  WITH CHECK (owner_id = current_setting('app.current_user_id')::uuid); -- can the new value be saved?
```

---

## Multi-Tenant Patterns

### Pattern 1: Single-Column Tenant ID

```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON projects
  FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Pattern 2: Schema-Per-Tenant

```sql
-- Each tenant gets their own schema; RLS is applied at search_path level
-- Useful for strict compliance requirements (HIPAA, SOC2)
SET search_path = tenant_acme, public;
```

### Pattern 3: Setting Context Variables (Application Layer)

```sql
-- Before every query in your application:
SELECT set_config('app.tenant_id', $1, true);  -- true = transaction-scoped
SELECT set_config('app.current_user_id', $2, true);
```

```sql
-- In connection pool scenarios, use a transaction wrapper:
BEGIN;
  SELECT set_config('app.tenant_id', '...', true);
  SELECT set_config('app.current_user_id', '...', true);
  -- ... execute queries ...
COMMIT;
```

### Pattern 4: Organization + User Hierarchy

```sql
-- Table supports both org-level and user-level isolation
CREATE TABLE notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id         UUID NOT NULL,
  content         TEXT,
  visibility      TEXT CHECK (visibility IN ('private', 'org', 'public'))
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Org members can see org-scoped or public notes
CREATE POLICY notes_select ON notes FOR SELECT
  USING (
    organization_id = current_setting('app.org_id')::uuid
    AND (
      visibility = 'public'
      OR visibility = 'org'
      OR (visibility = 'private' AND user_id = current_setting('app.user_id')::uuid)
    )
  );
```

---

## Role-Based Access Control (RBAC) with RLS

### Setting Up Roles

```sql
-- Create application roles
CREATE ROLE app_anon;
CREATE ROLE app_user;
CREATE ROLE app_admin;

-- Grant appropriate table permissions
GRANT SELECT ON documents TO app_anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON documents TO app_user;
GRANT ALL ON documents TO app_admin;
```

### RBAC Policies

```sql
-- Admins can see all rows; users see only their own
CREATE POLICY admin_all ON documents
  AS PERMISSIVE FOR ALL TO app_admin
  USING (true);

CREATE POLICY user_own ON documents
  AS PERMISSIVE FOR ALL TO app_user
  USING (owner_id = current_setting('app.user_id')::uuid)
  WITH CHECK (owner_id = current_setting('app.user_id')::uuid);

CREATE POLICY anon_public ON documents
  AS PERMISSIVE FOR SELECT TO app_anon
  USING (is_public = true);
```

---

## Permissive vs Restrictive Policies

```sql
-- PERMISSIVE (default): policies are OR'd together
-- If ANY permissive policy passes → row is visible

-- RESTRICTIVE: policies are AND'd against all permissive policies
-- ALL restrictive policies MUST pass even if a permissive policy passes

-- Example: Always block deleted rows regardless of other policies
CREATE POLICY no_deleted_rows ON documents
  AS RESTRICTIVE FOR ALL
  USING (deleted_at IS NULL);

-- Example: Hard tenant boundary that cannot be bypassed
CREATE POLICY hard_tenant_boundary ON documents
  AS RESTRICTIVE FOR ALL
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## Performance Considerations

### Index Strategy for RLS

```sql
-- Always index columns used in USING clauses
CREATE INDEX idx_documents_owner_id ON documents(owner_id);
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);

-- Composite index for multi-column policies
CREATE INDEX idx_documents_tenant_user ON documents(tenant_id, user_id);

-- Partial index for soft-delete RLS patterns
CREATE INDEX idx_documents_active ON documents(tenant_id) WHERE deleted_at IS NULL;
```

### EXPLAIN to Verify Policy Pushdown

```sql
-- Verify RLS filter is applied as an index scan, not a seq scan
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM documents WHERE title ILIKE '%search%';
-- Look for "Filter: ((owner_id = ...))" — this should be an Index Scan, not Seq Scan
```

### Avoid Calling Functions on Every Row

```sql
-- SLOW: Function called for every row
CREATE POLICY slow_policy ON documents FOR SELECT
  USING (owner_id = get_current_user_from_db());  -- DB call per row!

-- FAST: Use session variable (set once per transaction)
CREATE POLICY fast_policy ON documents FOR SELECT
  USING (owner_id = current_setting('app.user_id')::uuid);
```

---

## Security Definer Functions

Use `SECURITY DEFINER` functions to encapsulate complex logic while keeping RLS policies simple:

```sql
-- Create a stable helper function (STABLE = can be inlined by query planner)
CREATE OR REPLACE FUNCTION auth.current_user_id()
  RETURNS UUID
  LANGUAGE SQL
  STABLE
  SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('app.current_user_id', true)
  )::uuid;
$$;

-- Now policies are readable and the function handles context resolution
CREATE POLICY user_access ON documents FOR ALL
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());
```

---

## Common Pitfalls

| Pitfall | Problem | Solution |
|---|---|---|
| No policies after enabling RLS | Blocks ALL access | Add at least one policy immediately |
| Not using `FORCE ROW LEVEL SECURITY` | Table owner bypasses all policies | Always set `FORCE ROW LEVEL SECURITY` |
| Missing `WITH CHECK` on INSERT | Users can insert rows they can't see | Add `WITH CHECK` to INSERT/UPDATE policies |
| Calling DB functions in USING | N+1 performance per row | Use `current_setting()` or session variables |
| Single `FOR ALL` without explicit ops | Hard to audit security surface | Define separate policies per operation |
| Missing indexes on policy columns | Full table scans on every query | Index all columns referenced in USING clauses |
| Superuser bypass in production | RLS policies ignored | Never use superuser role in application connections |

---

## Testing RLS Policies

```sql
-- Set context and test as a specific user
BEGIN;
  SELECT set_config('app.user_id', 'user-uuid-here', true);
  SELECT set_config('app.tenant_id', 'tenant-uuid-here', true);

  -- Should return only rows owned by this user
  SELECT * FROM documents;

  -- Should succeed (user owns the row)
  INSERT INTO documents (user_id, title) VALUES ('user-uuid-here', 'My Doc');

  -- Should fail (wrong user_id in WITH CHECK)
  INSERT INTO documents (user_id, title) VALUES ('other-user-uuid', 'Hack');
ROLLBACK;

-- Verify policy definitions
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'documents';
```

---

## Best Practices

1. **Enable RLS on every table in the public schema** — no exceptions
2. **Always use `FORCE ROW LEVEL SECURITY`** on tables where the app role is also the owner
3. **Use `RESTRICTIVE` policies** for absolute hard boundaries (tenant isolation, soft deletes)
4. **Set context variables at transaction start**, not per-query
5. **Index every column referenced in `USING` clauses** — RLS filters run on every query
6. **Use `STABLE` or `IMMUTABLE` functions** in policies to allow query planner optimization
7. **Separate policies per CRUD operation** for audibility and maintainability
8. **Never hard-code UUIDs** in policy expressions — use session variables or JWT claims
9. **Test with multiple user contexts** before deploying to production
10. **Version-control policies as migrations** — treat them as first-class schema objects
11. **Audit policies quarterly** — revoke stale policies as access requirements change
12. **Use `pg_policies` view** to document and monitor all active policies
