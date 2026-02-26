---
title: "enterprise-sso-integration.md"
description: "> **2026 Standards Compliance** | SAML 2.0 · OAuth 2.1 with PKCE · SCIM 2.0 ·"
domain: multi-tenant
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["multi-tenant", "enterprise-sso-integration.md"]
legacy_path: "multi-tenant\enterprise-sso-integration.md"
---
# enterprise-sso-integration.md

> **2026 Standards Compliance** | SAML 2.0 · OAuth 2.1 with PKCE · SCIM 2.0 ·
> Supabase Auth · Next.js 16 App Router

## Table of Contents

1. [Overview](#overview)
2. [Protocol Selection](#protocol-selection)
3. [Architecture](#architecture)
4. [SAML 2.0 Implementation](#saml-20-implementation)
5. [OIDC / OAuth 2.1 Implementation](#oidc--oauth-21-implementation)
6. [SCIM Provisioning](#scim-provisioning)
7. [Per-Tenant SSO Configuration](#per-tenant-sso-configuration)
8. [JIT Provisioning](#jit-provisioning)
9. [Security Considerations](#security-considerations)
10. [Testing](#testing)
11. [References](#references)

---

## Overview

Enterprise SSO allows large tenants to authenticate their users through their
organization's Identity Provider (IdP) — Okta, Microsoft Entra ID (Azure AD),
Google Workspace, Ping Identity, or any SAML 2.0 / OIDC-compatible IdP.

This is a **hard requirement** for enterprise deals: most Fortune 500 procurement
processes mandate SSO, SCIM, and audit logging before signing. Implementing it
unlocks the ability to close enterprise contracts.

### Key Concepts

| Term                 | Definition                                                        |
| -------------------- | ----------------------------------------------------------------- |
| **IdP**              | Identity Provider — the enterprise's auth system (Okta, Azure AD) |
| **SP**               | Service Provider — your SaaS application                          |
| **SAML Assertion**   | Signed XML document from IdP proving user identity                |
| **OIDC**             | OpenID Connect — OAuth 2.1 extension for identity                 |
| **JIT Provisioning** | Auto-create user account on first SSO login                       |
| **SCIM**             | Protocol for automated user/group provisioning from IdP           |

---

## Protocol Selection

```
Is the enterprise tenant's IdP SAML-only?
├── YES → Implement SAML 2.0
│ (Okta, Azure AD with legacy, Ping Identity, ADFS)
└── NO → Is OIDC supported?
├── YES → Prefer OIDC (simpler, JWT-based, no XML)
│ (Google Workspace, Okta, Azure AD modern, Auth0)
└── BOTH → Offer both; default to OIDC

For user provisioning:
├── Does enterprise need real-time user sync? → SCIM 2.0
└── JIT-only acceptable? → Skip SCIM, provision on first login
```

---

## Architecture

```
Enterprise User
│
▼
[Your Login Page] → "Sign in with SSO" button
│
▼ (tenant lookup: slug/domain → SSO config)
[SSO Config DB] ─── tenant_sso_configs table
│ ├── idp_type: 'saml' | 'oidc'
│ ├── idp_metadata_url / entity_id
│ ├── acs_url, slo_url
│ └── attribute_mappings
│
▼
[SP-Initiated Flow] → Redirect to IdP
│
▼ (IdP authenticates user)
[IdP Callback] → POST /api/auth/sso/saml/callback
→ GET /api/auth/sso/oidc/callback
│
▼
[Assertion Validation] → Verify signature, audience, conditions
│
▼
[JIT Provisioning] → Create/update user in Supabase
│
▼
[Session Creation] → Supabase Auth session → JWT
│
▼
[Redirect to App] → /dashboard
```

---

## SAML 2.0 Implementation

### Database Schema

```sql
-- supabase/migrations/20260223_sso_config.sql
CREATE TABLE tenant_sso_configs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  idp_type        TEXT NOT NULL CHECK (idp_type IN ('saml', 'oidc')),

  -- SAML fields
  idp_entity_id       TEXT,
  idp_sso_url         TEXT,
  idp_slo_url         TEXT,
  idp_x509_cert       TEXT,  -- Public cert for signature verification
  sp_entity_id        TEXT,
  acs_url             TEXT,  -- Assertion Consumer Service URL

  -- OIDC fields
  oidc_discovery_url  TEXT,  -- e.g., https://accounts.google.com/.well-known/openid-configuration
  oidc_client_id      TEXT,
  oidc_client_secret  TEXT,  -- Encrypted at rest

  -- Common
  attribute_mappings  JSONB DEFAULT '{
    "email": "email",
    "firstName": "given_name",
    "lastName": "family_name",
    "groups": "groups"
  }'::jsonb,
  domain_hints        TEXT[],  -- e.g., ['acme.com', 'acme.org']
  enabled             BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (tenant_id)
);

-- Encrypted secret storage
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Store oidc_client_secret encrypted:
-- pgp_sym_encrypt(secret, current_setting('app.encryption_key'))
```

### SAML SP-Initiated Flow

Using the battle-tested `@boxyhq/saml-jackson` library (open-source, supports
Okta, Azure AD, Google, OneLogin):

```typescript
// packages/auth/src/sso/saml-service.ts
import jackson from '@boxyhq/saml-jackson';

let samlJackson: Awaited<ReturnType<typeof jackson>>;

export async function getSamlJackson() {
  if (!samlJackson) {
    samlJackson = await jackson({
      externalUrl: process.env.APP_URL!,
      samlPath: '/api/auth/sso/saml/callback',
      db: {
        engine: 'postgres',
        url: process.env.DATABASE_URL!,
        type: 'postgres',
      },
      samlAudience: process.env.APP_URL!,
      clientSecretVerifier: process.env.SAML_CLIENT_SECRET!,
    });
  }
  return samlJackson;
}

// Register tenant's IdP metadata
export async function registerSamlConnection(
  tenantId: string,
  config: {
    idpMetadataUrl: string;
    defaultRedirectUrl: string;
    redirectUrl: string[];
  }
) {
  const { apiController } = await getSamlJackson();

  const connection = await apiController.createSAMLConnection({
    tenant: tenantId,
    product: process.env.SAML_PRODUCT_NAME!,
    defaultRedirectUrl: config.defaultRedirectUrl,
    redirectUrl: config.redirectUrl,
    idpMetadata: config.idpMetadataUrl,
  });

  // Store SP metadata in DB for display to admin
  await updateTenantSsoConfig(tenantId, {
    sp_entity_id: connection.clientID,
    acs_url: `${process.env.APP_URL}/api/auth/sso/saml/callback`,
  });

  return connection;
}
```

### SAML Callback Route Handler

```typescript
// apps/portal/src/app/api/auth/sso/saml/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSamlJackson } from '@repo/auth/sso/saml-service';
import { jitProvisionUser } from '@repo/auth/sso/jit-provisioning';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const samlResponse = body.get('SAMLResponse') as string;
  const relayState = body.get('RelayState') as string | null;

  if (!samlResponse) {
    return NextResponse.json({ error: 'Missing SAMLResponse' }, { status: 400 });
  }

  const { oauthController } = await getSamlJackson();

  // Exchange SAML assertion for profile
  let profile: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    groups?: string[];
    tenant?: string;
  };

  try {
    const result = await oauthController.samlResponse({
      SAMLResponse: samlResponse,
      RelayState: relayState ?? undefined,
    });
    profile = result.profile;
  } catch (err) {
    console.error('SAML validation failed:', err);
    return NextResponse.redirect(new URL('/login?error=sso_failed', req.url));
  }

  // JIT provision the user
  const user = await jitProvisionUser(profile);

  // Create Supabase session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: {} }
  );

  const { data: sessionData } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
    options: {
      data: {
        tenant_id: user.tenantId,
        sso_provider: 'saml',
      },
    },
  });

  // Redirect with session token
  const redirectUrl = new URL(relayState ?? '/dashboard', process.env.APP_URL);
  redirectUrl.searchParams.set('token', sessionData.properties?.hashed_token ?? '');

  return NextResponse.redirect(redirectUrl);
}
```

---

## OIDC / OAuth 2.1 Implementation

```typescript
// apps/portal/src/app/api/auth/sso/oidc/route.ts
// Initiate OIDC flow (SP-initiated)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get('tenant');
  if (!tenantSlug) {
    return NextResponse.json({ error: 'Tenant required' }, { status: 400 });
  }

  const ssoConfig = await getTenantSsoConfig(tenantSlug);
  if (!ssoConfig || ssoConfig.idp_type !== 'oidc') {
    return NextResponse.redirect(new URL('/login?error=no_sso', req.url));
  }

  // Fetch OIDC discovery document
  const discovery = await fetchOidcDiscovery(ssoConfig.oidc_discovery_url!);

  // Build authorization URL with PKCE (OAuth 2.1 requirement)
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState(tenantSlug);

  // Store PKCE verifier in encrypted cookie
  const response = NextResponse.redirect(
    buildAuthorizationUrl(discovery.authorization_endpoint, {
      client_id: ssoConfig.oidc_client_id!,
      redirect_uri: `${process.env.APP_URL}/api/auth/sso/oidc/callback`,
      scope: 'openid email profile groups',
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256', // OAuth 2.1 PKCE requirement
      state,
    })
  );

  response.cookies.set('pkce_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}

// OIDC callback
export async function GET_callback(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const codeVerifier = req.cookies.get('pkce_verifier')?.value;

  if (!code || !state || !codeVerifier) {
    return NextResponse.redirect(new URL('/login?error=invalid_callback', req.url));
  }

  const tenantSlug = parseStateForTenant(state);
  const ssoConfig = await getTenantSsoConfig(tenantSlug);

  // Exchange code for tokens (with PKCE verifier)
  const tokens = await exchangeCodeForTokens({
    tokenEndpoint: ssoConfig.oidc_discovery_url!,
    code,
    codeVerifier,
    clientId: ssoConfig.oidc_client_id!,
    clientSecret: ssoConfig.oidc_client_secret!,
    redirectUri: `${process.env.APP_URL}/api/auth/sso/oidc/callback`,
  });

  // Validate ID token
  const claims = await validateIdToken(tokens.id_token, ssoConfig);

  // JIT provision
  const user = await jitProvisionUser({
    id: claims.sub,
    email: claims.email,
    firstName: claims.given_name,
    lastName: claims.family_name,
    groups: claims.groups,
    tenant: tenantSlug,
  });

  return createSessionAndRedirect(user, '/dashboard');
}
```

---

## SCIM Provisioning

SCIM 2.0 enables the enterprise IdP to automatically create/update/delete users:

```typescript
// apps/portal/src/app/api/scim/v2/Users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyScimToken } from '@repo/auth/scim'

// POST /api/scim/v2/Users — Create user from IdP
export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const tenantId = await verifyScimToken(token)
  if (!tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const email = body.emails?.?.value ?? body.userName
  const firstName = body.name?.givenName
  const lastName = body.name?.familyName
  const active = body.active ?? true

  const user = await upsertUserFromScim(tenantId, {
    externalId: body.externalId ?? body.id,
    email,
    firstName,
    lastName,
    active,
    groups: body.groups?.map((g: { value: string }) => g.value) ?? [],
  })

  return NextResponse.json(
    {
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      id: user.id,
      userName: user.email,
      name: { givenName: firstName, familyName: lastName },
      emails: [{ value: user.email, primary: true }],
      active: user.active,
      meta: {
        resourceType: 'User',
        created: user.createdAt,
        lastModified: user.updatedAt,
      },
    },
    { status: 201 },
  )
}

// PATCH /api/scim/v2/Users/[id] — Update user (includes deactivation)
export async function PATCH(req: NextRequest) {
  // Handle SCIM PATCH operations (replace, add, remove)
  const body = await req.json()
  // operations: [{ op: 'Replace', path: 'active', value: false }]
  // ...
}
```

---

## Per-Tenant SSO Configuration

```typescript
// Admin UI: apps/portal/src/app/settings/sso/page.tsx
export default async function SsoSettingsPage() {
  const tenant = await getTenantFromHeaders()
  const ssoConfig = await getTenantSsoConfig(tenant.id)

  // SP Metadata to give to the enterprise admin
  const spMetadata = {
    entityId: `${process.env.APP_URL}/api/auth/sso/saml/metadata/${tenant.id}`,
    acsUrl: `${process.env.APP_URL}/api/auth/sso/saml/callback`,
    sloUrl: `${process.env.APP_URL}/api/auth/sso/saml/logout`,
    certificate: process.env.SP_X509_CERT,
  }

  return (
    <SsoConfigForm
      currentConfig={ssoConfig}
      spMetadata={spMetadata}
    />
  )
}
```

---

## JIT Provisioning

```typescript
// packages/auth/src/sso/jit-provisioning.ts
import { createServiceClient } from '@repo/db/supabase-server';

interface SsoProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  groups?: string[];
  tenant?: string;
}

export async function jitProvisionUser(profile: SsoProfile) {
  const supabase = createServiceClient();

  // Upsert user in auth.users
  const { data: authUser } = await supabase.auth.admin.createUser({
    email: profile.email,
    email_confirm: true,
    user_metadata: {
      first_name: profile.firstName,
      last_name: profile.lastName,
      sso_id: profile.id,
      sso_provider: 'saml',
    },
  });

  if (!authUser?.user) throw new Error('Failed to create auth user');

  // Upsert in public.users
  await supabase.from('users').upsert({
    id: authUser.user.id,
    email: profile.email,
    first_name: profile.firstName,
    last_name: profile.lastName,
    sso_external_id: profile.id,
    tenant_id: profile.tenant,
    updated_at: new Date().toISOString(),
  });

  // Sync groups if provided
  if (profile.groups?.length) {
    await syncUserGroups(authUser.user.id, profile.groups);
  }

  return {
    id: authUser.user.id,
    email: profile.email,
    tenantId: profile.tenant,
  };
}

async function syncUserGroups(userId: string, groups: string[]) {
  const supabase = createServiceClient();

  // Map groups to roles in your system
  const roleMapping = await getGroupRoleMapping();

  for (const group of groups) {
    const role = roleMapping[group];
    if (role) {
      await supabase.from('user_roles').upsert({
        user_id: userId,
        role,
        source: 'sso_group',
        group_name: group,
      });
    }
  }
}
```

---

## Security Considerations

### SAML Security

- **Signature Validation**: Always verify SAML assertion signatures
- **Certificate Rotation**: Handle IdP certificate updates gracefully
- **Replay Attacks**: Check assertion timestamps and unique IDs
- **XML Security**: Protect against XML External Entity (XXE) attacks

### OIDC Security

- **PKCE Required**: OAuth 2.1 mandates PKCE for public clients
- **Token Validation**: Verify ID token signature and claims
- **Nonce Usage**: Prevent replay attacks with nonces
- **Secure Storage**: Encrypt client secrets at rest

### SCIM Security

- **Bearer Token Authentication**: Validate SCIM bearer tokens
- **Tenant Isolation**: Ensure SCIM operations only affect tenant's users
- **Rate Limiting**: Prevent SCIM endpoint abuse
- **Audit Logging**: Track all user provisioning changes

### Database Security

```sql
-- RLS policies for SSO configs
CREATE POLICY "Tenants can view own SSO config" ON tenant_sso_configs
  FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Tenants can update own SSO config" ON tenant_sso_configs
  FOR UPDATE USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Encryption for secrets
CREATE OR REPLACE FUNCTION encrypt_secret(secret TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_encrypt(secret, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_secret(encrypted_secret TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_secret, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Testing

### SAML Testing with Mock IdP

```typescript
// packages/auth/__tests__/saml.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getSamlJackson } from '../src/sso/saml-service';

describe('SAML Integration', () => {
  beforeEach(async () => {
    // Setup test SAML connection
    const samlJackson = await getSamlJackson();
    await samlJackson.apiController.createSAMLConnection({
      tenant: 'test-tenant',
      product: 'test-product',
      defaultRedirectUrl: 'http://localhost:3000/dashboard',
      redirectUrl: ['http://localhost:3000/*'],
      idpMetadata: 'https://mock-saml-idp.com/metadata',
    });
  });

  it('should validate SAML response and create user', async () => {
    // Mock SAML response from IdP
    const mockSamlResponse = generateMockSamlResponse({
      email: 'user@enterprise.com',
      firstName: 'John',
      lastName: 'Doe',
      groups: ['Admin', 'Users'],
    });

    // Process SAML response
    const result = await processSamlResponse(mockSamlResponse);

    expect(result.user.email).toBe('user@enterprise.com');
    expect(result.user.firstName).toBe('John');
    expect(result.session).toBeDefined();
  });
});
```

### OIDC Testing Flow

```typescript
// packages/auth/__tests__/oidc.test.ts
describe('OIDC Integration', () => {
  it('should complete OAuth 2.1 PKCE flow', async () => {
    // Step 1: Initiate flow
    const authUrl = await initiateOidcFlow('test-tenant');
    expect(authUrl).toContain('code_challenge=S256');
    expect(authUrl).toContain('response_type=code');

    // Step 2: Mock callback
    const callbackResult = await handleOidcCallback({
      code: 'mock-auth-code',
      state: 'test-state',
    });

    expect(callbackResult.user).toBeDefined();
    expect(callbackResult.session).toBeDefined();
  });
});
```

### End-to-End Testing

```typescript
// e2e/tests/sso.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Enterprise SSO', () => {
  test('SAML login flow', async ({ page }) => {
    await page.goto('/login?tenant=enterprise');
    await page.click('[data-testid="sso-button"]');

    // Should redirect to IdP (mock)
    await page.fill('[name="username"]', 'test@enterprise.com');
    await page.fill('[name="password"]', 'password');
    await page.click('[type="submit"]');

    // Should redirect back to app
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-email"]')).toHaveText('test@enterprise.com');
  });

  test('SCIM user provisioning', async () => {
    const response = await fetch('/api/scim/v2/Users', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-scim-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: 'newuser@enterprise.com',
        name: { givenName: 'New', familyName: 'User' },
        emails: [{ value: 'newuser@enterprise.com', primary: true }],
        active: true,
      }),
    });

    expect(response.status).toBe(201);
    const user = await response.json();
    expect(user.userName).toBe('newuser@enterprise.com');
  });
});
```

---

## References

- [SAML 2.2 Specification](https://docs.oasis-open.org/security/saml/v2.0/) - SAML protocol standard
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/) - OAuth 2.1 draft
- [SAML Jackson Library](https://github.com/boxyhq/saml-jackson) - Open-source SAML implementation
- [SCIM 2.0 Specification](https://www.rfc-editor.org/rfc/rfc7643.html) - User provisioning protocol
- [Supabase Auth SSO](https://supabase.com/docs/guides/auth/sso) - Supabase SSO integration
- [Next.js 16 App Router](https://nextjs.org/docs/app) - Modern React framework
- [Okta Developer Guide](https://developer.okta.com/docs/) - Popular IdP implementation
- [Azure AD SSO Guide](https://docs.microsoft.com/en-us/azure/active-directory/) - Microsoft IdP

---