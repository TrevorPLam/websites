<!--
/**
 * @file supabase-auth-docs.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for supabase auth docs.
 * @entrypoints docs/guides/supabase-auth-docs.md
 * @exports supabase auth docs
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# Supabase Authentication & RLS Integration — Official Reference

> **Version Reference:** Supabase Auth v2 / PostgreSQL 15+ | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for Supabase authentication, JWT integration, and RLS policy patterns.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [JWT Structure & Claims](#jwt-structure--claims)
3. [Core Auth Helpers](#core-auth-helpers)
4. [Connecting Auth to RLS](#connecting-auth-to-rls)
5. [Authentication Methods](#authentication-methods)
6. [Role Hierarchy in Supabase](#role-hierarchy-in-supabase)
7. [Advanced RLS Patterns](#advanced-rls-patterns)
8. [Custom Access Token Hooks](#custom-access-token-hooks)
9. [OAuth 2.1 + RLS](#oauth-21--rls)
10. [Multi-Tenant SaaS Patterns](#multi-tenant-saas-patterns)
11. [Security Best Practices](#security-best-practices)
12. [Testing & Debugging](#testing--debugging)
13. [Common Mistakes](#common-mistakes)

---

## Architecture Overview

```
Client App
    │
    ▼
Supabase Auth (GoTrue v2)
    │  Issues signed JWT (HS256 or RS256)
    ▼
PostgREST / Realtime / Storage APIs
    │  Sets request.jwt.claims in session
    ▼
PostgreSQL
    │  RLS policies call auth.uid(), auth.jwt()
    ▼
Row-Level Security Enforcement
```

**Key insight:** Supabase Auth stores the JWT in `request.jwt.claims` session variable. All
`auth.*` helper functions read from this variable. This means RLS is enforced consistently
across PostgREST, Realtime subscriptions, Edge Functions, and direct connections.

---

## JWT Structure & Claims

Every Supabase Auth JWT contains:

```json
{
  "sub": "user-uuid",
  "aud": "authenticated",
  "role": "authenticated",
  "iss": "https://<project-ref>.supabase.co/auth/v1",
  "iat": 1735815600,
  "exp": 1735819200,
  "email": "user@example.com",
  "phone": "",
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {
    "full_name": "Jane Doe"
  },
  "session_id": "session-uuid",
  "aal": "aal1",
  "amr": [{ "method": "password", "timestamp": 1735815600 }]
}
```

**OAuth-specific additional claims:**

```json
{
  "client_id": "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d"
}
```

---

## Core Auth Helpers

These PostgreSQL functions are available within RLS policies:

```sql
-- Returns the UUID of the authenticated user (from JWT 'sub' claim)
auth.uid()              -- Returns UUID or NULL

-- Returns the full JWT payload as JSONB
auth.jwt()              -- Returns JSONB

-- Returns the user's role (e.g., 'authenticated', 'anon', 'service_role')
auth.role()             -- Returns TEXT

-- Common claim extraction patterns:
auth.uid()                                           -- User UUID
auth.jwt() ->> 'email'                               -- Email address
auth.jwt() ->> 'role'                                -- Role string
auth.jwt() -> 'user_metadata' ->> 'full_name'        -- User metadata field
auth.jwt() -> 'app_metadata' ->> 'plan'              -- App metadata field
auth.jwt() ->> 'client_id'                           -- OAuth client ID
(auth.jwt() -> 'app_metadata' ->> 'is_admin')::bool  -- Boolean claim
```

---

## Connecting Auth to RLS

### Fundamental Pattern: User Owns Row

```sql
-- Schema
CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT,
  is_public  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- SELECT: users see their own posts + all public posts
CREATE POLICY posts_select ON posts FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_public = true
  );

-- INSERT: users can only create posts as themselves
CREATE POLICY posts_insert ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: users can only update their own posts
CREATE POLICY posts_update ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: users can only delete their own posts
CREATE POLICY posts_delete ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### Ownership Column Convention

```sql
-- Minimum required for user isolation
user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE

-- For SaaS applications, include all ownership levels
CREATE TABLE resources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id),        -- Individual owner
  organization_id UUID REFERENCES organizations(id),     -- Org owner
  workspace_id    UUID REFERENCES workspaces(id),        -- Workspace scope
  created_by      UUID REFERENCES auth.users(id),        -- Audit trail
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Authentication Methods

### Email/Password

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: { full_name: 'Jane Doe' }, // Stored in user_metadata
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});
```

### Magic Link / OTP

```typescript
// Email magic link
await supabase.auth.signInWithOtp({ email: 'user@example.com' });

// Phone OTP
await supabase.auth.signInWithOtp({ phone: '+15551234567' });
```

### OAuth Providers

```typescript
// OAuth sign in (Google, GitHub, etc.)
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback',
    scopes: 'openid profile email',
  },
});
```

### Session Management

```typescript
// Get current session
const {
  data: { session },
} = await supabase.auth.getSession();

// Subscribe to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    /* handle login */
  }
  if (event === 'SIGNED_OUT') {
    /* handle logout */
  }
  if (event === 'TOKEN_REFRESHED') {
    /* token rotated */
  }
  if (event === 'USER_UPDATED') {
    /* profile changed */
  }
});

// Sign out
await supabase.auth.signOut();
```

---

## Role Hierarchy in Supabase

| Role            | Description              | Use Case                          |
| --------------- | ------------------------ | --------------------------------- |
| `anon`          | Unauthenticated visitors | Public content, sign-up forms     |
| `authenticated` | Logged-in users          | All user-facing features          |
| `service_role`  | Bypasses RLS entirely    | Server-side admin operations only |
| Custom DB roles | Named PostgreSQL roles   | Fine-grained RBAC patterns        |

```sql
-- Grant table access by role
GRANT SELECT ON public.posts TO anon;                        -- public reads
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;  -- user writes
-- service_role already has full access; never expose its key client-side

-- Restrict which operations are available per role:
REVOKE ALL ON public.admin_logs FROM anon;
REVOKE ALL ON public.admin_logs FROM authenticated;
GRANT SELECT ON public.admin_logs TO service_role;
```

---

## Advanced RLS Patterns

### Pattern 1: Organization Membership Check

```sql
-- Helper function to check org membership (use security definer for performance)
CREATE OR REPLACE FUNCTION auth.is_member_of(org_id UUID)
  RETURNS BOOLEAN
  LANGUAGE SQL
  STABLE
  SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

-- Use in policy
CREATE POLICY team_docs_select ON team_documents FOR SELECT
  USING (auth.is_member_of(organization_id));
```

### Pattern 2: Role-Based Within Organization

```sql
-- Store user role in app_metadata (set server-side via service_role)
-- app_metadata: { "org_role": "admin" }

CREATE POLICY org_admin_all ON resources FOR ALL
  USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'org_role') = 'admin'
  );

CREATE POLICY org_member_read ON resources FOR SELECT
  USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'org_role') IN ('admin', 'member', 'viewer')
  );
```

### Pattern 3: Invitation-Based Access

```sql
CREATE TABLE invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  invitee_id  UUID REFERENCES auth.users(id),
  expires_at  TIMESTAMPTZ,
  accepted    BOOLEAN DEFAULT false
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow invited users to see shared resources
CREATE POLICY invited_access ON shared_resources FOR SELECT
  USING (
    owner_id = auth.uid()  -- Owner always sees their resources
    OR EXISTS (
      SELECT 1 FROM invitations
      WHERE resource_id = shared_resources.id
        AND invitee_id = auth.uid()
        AND accepted = true
        AND (expires_at IS NULL OR expires_at > now())
    )
  );
```

### Pattern 4: Soft Delete with RLS

```sql
ALTER TABLE documents ADD COLUMN deleted_at TIMESTAMPTZ;

-- Hard boundary: no deleted rows visible to anyone via app layer
CREATE POLICY no_deleted_rows ON documents
  AS RESTRICTIVE FOR ALL
  USING (deleted_at IS NULL);

-- Soft delete helper (avoids application-layer filtering)
CREATE OR REPLACE FUNCTION soft_delete_document(doc_id UUID)
  RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  UPDATE documents SET deleted_at = now()
  WHERE id = doc_id AND user_id = auth.uid();
$$;
```

### Pattern 5: Time-Windowed Access

```sql
CREATE POLICY time_limited_access ON time_restricted_content FOR SELECT
  USING (
    auth.uid() = user_id
    AND access_start <= now()
    AND access_end >= now()
  );
```

---

## Custom Access Token Hooks

Custom hooks fire on every token issuance and allow you to inject claims from your own database.

### Add RBAC Claims

```sql
-- 1. Create the roles table
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role    TEXT NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- 2. Create the hook function in the database
CREATE OR REPLACE FUNCTION custom_access_token_hook(event JSONB)
  RETURNS JSONB
  LANGUAGE plpgsql
  STABLE
AS $$
DECLARE
  claims   JSONB;
  user_role TEXT;
BEGIN
  claims := event -> 'claims';

  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = (event ->> 'user_id')::uuid
  LIMIT 1;

  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  END IF;

  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

GRANT EXECUTE ON FUNCTION custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION custom_access_token_hook FROM authenticated, anon, public;
```

```sql
-- 3. Register the hook in Supabase Dashboard:
-- Authentication > Hooks > Custom Access Token Hook
-- Select: custom_access_token_hook

-- 4. Use the claim in RLS policies:
CREATE POLICY admin_full_access ON admin_resources FOR ALL
  USING ((auth.jwt() ->> 'user_role') = 'admin');
```

### Add Organization Context to Token

```typescript
// Edge Function hook
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { user, claims } = await req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SECRET_KEY')!
  );

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  return new Response(
    JSON.stringify({
      claims: {
        ...claims,
        org_id: membership?.organization_id,
        org_role: membership?.role,
      },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

## OAuth 2.1 + RLS

Supabase Auth issues OAuth tokens as JWTs with a `client_id` claim identifying the OAuth app.

```json
{
  "sub": "user-uuid",
  "role": "authenticated",
  "client_id": "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d"
}
```

### OAuth-Aware Policies

```sql
-- Direct user sessions (no OAuth)
CREATE POLICY direct_user_full_access ON user_data FOR ALL
  USING (
    auth.uid() = user_id AND
    (auth.jwt() ->> 'client_id') IS NULL
  );

-- Specific OAuth client: read-only
CREATE POLICY oauth_client_readonly ON user_data FOR SELECT
  USING (
    auth.uid() = user_id AND
    (auth.jwt() ->> 'client_id') = 'trusted-mobile-client-id'
  );

-- Block OAuth clients from sensitive tables entirely
CREATE POLICY no_oauth_on_payments ON payment_methods
  AS RESTRICTIVE FOR ALL
  USING ((auth.jwt() ->> 'client_id') IS NULL);
```

---

## Multi-Tenant SaaS Patterns

### Tenant Isolation via Organization

```sql
-- Users belong to organizations; data is isolated per organization
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by      UUID REFERENCES auth.users(id),
  name            TEXT NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Org membership check (relies on custom JWT claim injected by hook)
CREATE POLICY org_member_access ON projects FOR SELECT
  USING (
    organization_id = (auth.jwt() ->> 'org_id')::uuid
  );

CREATE POLICY org_member_insert ON projects FOR INSERT
  WITH CHECK (
    organization_id = (auth.jwt() ->> 'org_id')::uuid
    AND created_by = auth.uid()
  );
```

### Plan-Based Feature Gating

```sql
-- Limit access based on subscription tier stored in app_metadata
CREATE POLICY pro_feature_only ON analytics_exports FOR SELECT
  USING (
    auth.uid() = user_id AND
    (auth.jwt() -> 'app_metadata' ->> 'plan') IN ('pro', 'enterprise')
  );
```

---

## Security Best Practices

1. **Never expose `service_role` key** client-side — it bypasses all RLS
2. **Always use `anon` key** in browser/mobile clients
3. **Set `PGRST_JWT_SECRET`** to match your Supabase JWT secret for PostgREST
4. **Validate JWTs server-side** in Edge Functions — don't trust client-provided claims
5. **Use `app_metadata`** for sensitive claims (plan, role, permissions) — only writable server-side
6. **Use `user_metadata`** for non-sensitive user preferences — user-writable
7. **Rotate JWT secrets** periodically and update all services
8. **Enable Email Confirmation** in production to prevent fake signups
9. **Enable MFA** for admin/elevated privilege users
10. **Use `SECURITY DEFINER` sparingly** — always specify `SET search_path = ''` to prevent injection
11. **Audit auth.users** regularly — remove stale or suspicious accounts
12. **Set token expiry** appropriately: short (1h) for high-security, longer for convenience
13. **Never store sensitive data in JWT** — it's base64-encoded, not encrypted

---

## Testing & Debugging

```sql
-- Simulate a specific user's JWT context in SQL Editor
SELECT set_config('request.jwt.claims', '{
  "sub": "test-user-uuid",
  "role": "authenticated",
  "email": "test@example.com",
  "aud": "authenticated"
}', true);

-- Verify auth.uid() resolves correctly
SELECT auth.uid();  -- should return 'test-user-uuid'::uuid

-- Test policy behavior
SELECT * FROM documents;  -- should only show rows belonging to test-user-uuid

-- Reset context
RESET request.jwt.claims;

-- List all active policies on a table
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'documents'
ORDER BY cmd, policyname;

-- Identify tables without RLS (security audit)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```

### Using Supabase Dashboard Impersonation

In the SQL Editor → click the **Role** dropdown → select a user to run queries as that
user's authenticated JWT. Use `SELECT auth.jwt();` to inspect what the token looks like.

---

## Common Mistakes

| Mistake                              | Impact                            | Fix                                                 |
| ------------------------------------ | --------------------------------- | --------------------------------------------------- |
| Using `service_role` in browser      | Full RLS bypass                   | Always use `anon` key client-side                   |
| Missing RLS on junction tables       | Cross-tenant data leak            | Enable RLS on ALL tables including pivots           |
| Storing roles in `user_metadata`     | Users can self-elevate roles      | Use `app_metadata` for permissions                  |
| Forgetting `WITH CHECK` on INSERT    | Users insert rows they can't see  | Add explicit `WITH CHECK` clause                    |
| Single policy covering all ops       | Hard to audit                     | Separate SELECT/INSERT/UPDATE/DELETE                |
| Calling DB functions in policy       | N+1 per row performance           | Use JWT claims or `current_setting()`               |
| No `ON DELETE CASCADE` on user_id FK | Orphaned rows after user deletion | Always add `ON DELETE CASCADE`                      |
| Mixing OAuth and user policies       | Unintended access grants          | Separate policies for direct users vs OAuth clients |


--- 

## References

- [Official Documentation](https://example.com) — Replace with actual source
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns


## Overview

[Add content here]


## Implementation

[Add content here]


## Best Practices

[Add content here]
