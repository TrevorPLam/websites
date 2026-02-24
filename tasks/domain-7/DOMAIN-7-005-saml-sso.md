---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-7-005
title: 'Multi-tenant auth with SAML 2.0 enterprise SSO'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-7-005-saml-sso
allowed-tools: Bash(ggit:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-7-005 · Multi-tenant auth with SAML 2.0 enterprise SSO

## Objective

Implement multi-tenant SAML 2.0 enterprise SSO system following section 7.7 specification with provider registration, login URL generation, RLS policy integration, and enterprise tenant authentication for Azure AD, Okta, and Google Workspace.

---

## Context

**Documentation Reference:**

- Tenant Resolution Implementation: `docs/guides/multi-tenant/tenant-resolution-implementation.md` ✅ COMPLETED
- Billing Status Validation: `docs/guides/multi-tenant/billing-status-validation.md` ✅ COMPLETED
- Tenant Suspension Patterns: `docs/guides/multi-tenant/tenant-suspension-patterns.md` ✅ COMPLETED
- Noisy Neighbor Prevention: `docs/guides/multi-tenant/noisy-neighbor-prevention.md` ✅ COMPLETED
- Domain Lifecycle Management: `docs/guides/multi-tenant/domain-lifecycle-management.md` ✅ COMPLETED
- Enterprise Sso Integration: `docs/guides/multi-tenant/enterprise-sso-integration.md` ✅ COMPLETED
- Routing Strategy Comparison: `docs/guides/multi-tenant/routing-strategy-comparison.md` ✅ COMPLETED
- Tenant Metadata Factory: `docs/guides/multi-tenant/tenant-metadata-factory.md` ✅ COMPLETED
- Tenant Resolution Sequence Diagram: `docs/guides/multi-tenant/tenant-resolution-sequence-diagram.md` ❌ MISSING (P0)
- Tenant Data Flow Patterns: `docs/guides/multi-tenant/tenant-data-flow-patterns.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Multi-tenant authentication — Enterprise SSO integration

**Related files:** SAML provider registration, authentication flows, RLS policies

**Dependencies:** Supabase Auth SAML support, enterprise IdP providers, tenant management

**Prior work:** Basic authentication exists but lacks comprehensive SAML 2.0 enterprise SSO integration

**Constraints:** Must follow section 7.7 specification with proper provider registration and RLS integration

---

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| SSO       | SAML 2.0 with enterprise IdP providers  |
| Providers | Azure AD, Okta, Google Workspace        |
| Database  | Supabase Auth with SAML support         |
| RLS       | Row-level security with SSO provider ID |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement SAML 2.0 SSO following section 7.7 specification
- [ ] **[Agent]** Create SAML provider registration system
- [ ] **[Agent]** Add login URL generation for enterprise users
- [ ] **[Agent]** Implement RLS policies with SSO provider ID
- [ ] **[Agent]** Create tenant SSO management interface
- [ ] **[Agent]** Test SSO flows with enterprise providers
- [ ] **[Human]** Verify SSO integration follows section 7.7 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 7.7 specification** — Extract SAML SSO requirements
- [ ] **[Agent]** **Create SAML provider registration** — Implement provider setup
- [ ] **[Agent]** **Add login URL generation** — Create enterprise login flows
- [ ] **[Agent]** **Implement RLS integration** — Add SSO provider ID to policies
- [ ] **[Agent]** **Create tenant SSO management** — Add admin interface
- [ ] **[Agent]** **Test SSO authentication** — Verify enterprise login works
- [ ] **[Agent]** **Add provider management** — Handle provider lifecycle

> ⚠️ **Agent Question**: Ask human before proceeding if any existing authentication needs migration to new SSO system.

---

## Commands

```bash
# Test SAML provider registration
pnpm test --filter="@repo/auth"

# Test SAML provider registration
node -e "
import { registerSAMLProvider } from '@repo/auth/enterprise-sso';
const result = await registerSAMLProvider('tenant-123', {
  metadataUrl: 'https://login.microsoftonline.com/tenant-id/federationmetadata.xml',
  domains: ['acmecorp.com'],
  attributeMappings: {
    firstName: 'givenName',
    lastName: 'sn',
    role: 'department',
  },
});
console.log('SAML provider registered:', result);
"

# Test SSO login URL generation
node -e "
import { getSSOLoginUrl } from '@repo/auth/enterprise-sso';
const loginUrl = await getSSOLoginUrl('user@acmecorp.com', '/dashboard');
console.log('SSO login URL:', loginUrl);
"

# Test RLS policy with SSO
node -e "
import { testSSORLSPolicy } from '@repo/auth/enterprise-sso';
const result = await testSSORLSPolicy('tenant-123', 'user@acmecorp.com');
console.log('RLS SSO test result:', result);
"

# Test tenant SSO management
node -e "
import { getTenantSSOProviders } from '@repo/auth/enterprise-sso';
const providers = await getTenantSSOProviders('tenant-123');
console.log('Tenant SSO providers:', providers);
"
```

---

## Code Style

```typescript
// ✅ Correct — SAML 2.0 SSO integration following section 7.7
import { db } from '@repo/db';

// ============================================================================
// SAML 2.0 SSO REGISTRATION
// Called when enterprise tenant sets up SSO in the client portal
// ============================================================================

export async function registerSAMLProvider(
  tenantId: string,
  options: {
    metadataUrl: string; // IdP metadata URL (Azure AD / Okta format)
    domains: string[]; // Email domains (e.g., ['acmecorp.com'])
    attributeMappings?: {
      // Map IdP attributes to Supabase user fields
      firstName?: string;
      lastName?: string;
      role?: string;
    };
  }
): Promise<{ providerId: string }> {
  // Uses Supabase Management API (service role required)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/sso/providers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({
        type: 'saml',
        metadata_url: options.metadataUrl,
        domains: options.domains,
        attribute_mapping: {
          keys: {
            first_name: { name: options.attributeMappings?.firstName ?? 'firstName' },
            last_name: { name: options.attributeMappings?.lastName ?? 'lastName' },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SAML registration failed: ${JSON.stringify(error)}`);
  }

  const { id: providerId } = await response.json();

  // Store the provider association for this tenant
  await db.from('tenant_sso_providers').upsert({
    tenant_id: tenantId,
    provider_id: providerId,
    provider_type: 'saml',
    domains: options.domains,
    attribute_mappings: options.attributeMappings,
    created_at: new Date().toISOString(),
  });

  return { providerId };
}

// ============================================================================
// SSO LOGIN URL GENERATION
// Redirect enterprise users to their IdP for authentication
// ============================================================================

export async function getSSOLoginUrl(email: string, redirectTo: string): Promise<string | null> {
  const domain = email.split('@')[1];

  const { data, error } = await (await import('@supabase/supabase-js'))
    .createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    .auth.signInWithSSO({
      domain,
      options: { redirectTo },
    });

  if (error || !data?.url) return null;
  return data.url;
}

// ============================================================================
// TENANT SSO MANAGEMENT
// ============================================================================

export async function getTenantSSOProviders(tenantId: string): Promise<
  Array<{
    providerId: string;
    providerType: 'saml';
    domains: string[];
    attributeMappings: Record<string, string>;
    createdAt: string;
  }>
> {
  const { data } = await db.from('tenant_sso_providers').select('*').eq('tenant_id', tenantId);

  return data || [];
}

export async function updateSSOProvider(
  tenantId: string,
  providerId: string,
  updates: {
    domains?: string[];
    attributeMappings?: Record<string, string>;
  }
): Promise<void> {
  await db
    .from('tenant_sso_providers')
    .update({
      domains: updates.domains,
      attribute_mappings: updates.attributeMappings,
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('provider_id', providerId);
}

export async function removeSSOProvider(tenantId: string, providerId: string): Promise<void> {
  // Remove from database
  await db
    .from('tenant_sso_providers')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('provider_id', providerId);

  // Remove from Supabase Auth
  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/sso/providers/${providerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
  });
}

// ============================================================================
// SSO USER LOOKUP AND MAPPING
// ============================================================================

export async function findSSOProviderForEmail(email: string): Promise<string | null> {
  const domain = email.split('@')[1];

  const { data: providers } = await db
    .from('tenant_sso_providers')
    .select('provider_id', 'domains')
    .like('domains', `%${domain}%`);

  if (!providers || providers.length === 0) return null;

  // Return the first matching provider
  return providers[0].provider_id;
}

export async function mapSSOAttributesToUser(
  providerId: string,
  samlAttributes: Record<string, any>,
  tenantId: string
): Promise<{
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}> {
  // Get provider configuration
  const { data: provider } = await db
    .from('tenant_sso_providers')
    .select('attribute_mappings')
    .eq('provider_id', providerId)
    .single();

  const mappings = provider?.attribute_mappings || {};

  // Map SAML attributes to user fields
  const user = {
    userId: crypto.randomUUID(),
    email: samlAttributes.email || samlAttributes.emailaddress,
    firstName: samlAttributes[mappings.firstName] || samlAttributes.givenname,
    lastName: samlAttributes[mappings.lastName] || samlAttributes.sn,
    role: samlAttributes[mappings.role] || samlAttributes.department,
  };

  // Create or update user in database
  const { data: existingUser } = await db
    .from('users')
    .select('id')
    .eq('email', user.email)
    .eq('tenant_id', tenantId)
    .single();

  if (existingUser) {
    // Update existing user
    await db
      .from('users')
      .update({
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id);

    return { ...user, userId: existingUser.id };
  } else {
    // Create new user
    const { data: newUser } = await db
      .from('users')
      .insert({
        id: user.userId,
        tenant_id: tenantId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    return { ...user, userId: newUser.id };
  }
}

// ============================================================================
// SSO AUTHENTICATION FLOW
// ============================================================================

export async function authenticateWithSSO(
  email: string,
  redirectTo: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Find SSO provider for this email domain
    const providerId = await findSSOProviderForEmail(email);
    if (!providerId) {
      return { success: false, error: 'No SSO provider found for this domain' };
    }

    // Generate SSO login URL
    const loginUrl = await getSSOLoginUrl(email, redirectTo);
    if (!loginUrl) {
      return { success: false, error: 'Failed to generate SSO login URL' };
    }

    // Redirect to IdP for authentication
    // In a real implementation, this would be a redirect response
    return { success: true, loginUrl };
  } catch (error) {
    console.error('SSO authentication error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// SSO SESSION MANAGEMENT
// ============================================================================

export async function createSSOSession(
  userId: string,
  providerId: string,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  // Store SSO session in database
  await db.from('sso_sessions').insert({
    user_id: userId,
    provider_id: providerId,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    created_at: new Date().toISOString(),
  });
}

export async function validateSSOSession(
  userId: string,
  providerId: string,
  accessToken: string
): Promise<boolean> {
  const { data: session } = await db
    .from('sso_sessions')
    .select('expires_at')
    .eq('user_id', userId)
    .eq('provider_id', providerId)
    .eq('access_token', accessToken)
    .single();

  if (!session) return false;

  return new Date(session.expires_at) > new Date();
}

// ============================================================================
// SSO PROVIDER HEALTH CHECK
// ============================================================================

export async function getSSOProviderHealth(): Promise<{
  totalProviders: number;
  activeProviders: number;
  providersByType: Record<string, number>;
  recentActivity: Array<{
    providerId: string;
    tenantId: string;
    action: string;
    timestamp: string;
  }>;
}> {
  const { data: providers } = await db
    .from('tenant_sso_providers')
    .select('*')
    .order('created_at', { descending: true });

  if (!providers) {
    return {
      totalProviders: 0,
      activeProviders: 0,
      providersByType: {},
      recentActivity: [],
    };
  }

  const typeCounts = providers.reduce(
    (acc, provider) => {
      acc[provider.provider_type] = (acc[provider.provider_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalProviders: providers.length,
    activeProviders: providers.length, // All providers are considered active
    providersByType: typeCounts,
    recentActivity: providers.slice(0, 10).map((p) => ({
      providerId: p.provider_id,
      tenantId: p.tenant_id,
      action: 'provider_created',
      timestamp: p.created_at,
    })),
  };
}

// ============================================================================
// SSO PROVIDER VALIDATION
// ============================================================================

export function validateSAMLProviderConfig(config: {
  metadataUrl: string;
  domains: string[];
  attributeMappings?: Record<string, string>;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate metadata URL
  try {
    new URL(config.metadataUrl);
  } catch {
    errors.push('Invalid metadata URL format');
  }

  // Validate domains
  if (!config.domains || config.domains.length === 0) {
    errors.push('At least one domain is required');
  }

  config.domains.forEach((domain) => {
    if (!domain.includes('@')) {
      errors.push(`Invalid domain format: ${domain}`);
    }
  });

  // Validate attribute mappings
  if (config.attributeMappings) {
    const validMappings = [
      'firstName',
      'lastName',
      'role',
      'email',
      'givenname',
      'sn',
      'department',
    ];
    Object.keys(config.attributeMappings).forEach((key) => {
      if (!validMappings.includes(key)) {
        errors.push(`Invalid attribute mapping: ${key}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SSO USER INTERFACE HELPERS
// ============================================================================

export function getSSODomainForTenant(tenantId: string): string[] {
  // Get all domains associated with SSO providers for this tenant
  const { data: providers } = db
    .from('tenant_sso_providers')
    .select('domains')
    .eq('tenant_id', tenantId);

  if (!providers) return [];

  return providers.flatMap((p) => p.domains || []);
}

export function hasSSOForTenant(tenantId: string): boolean {
  const domains = getSSODomainForTenant(tenantId);
  return domains.length > 0;
}

export function isEmailManagedBySSO(email: string, tenantId: string): boolean {
  const domains = getSSODomainForTenant(tenantId);
  const domain = email.split('@')[1];
  return domains.includes(domain);
}
```

**SAML 2.0 SSO principles:**

- **Provider registration**: Register enterprise IdP providers with metadata URLs
- **Login URL generation**: Generate provider-specific login URLs for authentication
- **Domain-based routing**: Route users to correct IdP based on email domain
- **Attribute mapping**: Map IdP attributes to user fields
- **RLS integration**: Use SSO provider ID in RLS policies for tenant isolation
- **Session management**: Handle SSO session lifecycle and validation
- **Enterprise support**: Support Azure AD, Okta, Google Workspace providers
- **Health monitoring**: Track provider health and activity

---

## Boundaries

| Tier             | Scope                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 7.7 specification; implement provider registration; add login URL generation; integrate with RLS; support enterprise providers |
| ⚠️ **Ask first** | Changing existing authentication flows; modifying RLS policies; updating tenant management                                                    |
| 🚫 **Never**     | Skip provider validation; ignore attribute mapping; bypass RLS integration; expose sensitive SSO data                                         |

---

## Success Verification

- [ ] **[Agent]** Test SAML provider registration — Providers registered successfully
- [ ] **[Agent]** Verify login URL generation — Login URLs work for all providers
- [ ] **[Agent]** Test domain-based routing — Users routed to correct IdP
- [ ] **[Agent]** Verify attribute mapping — User fields populated correctly
- [ ] **[Agent]** Test RLS integration — SSO provider ID used in policies
- [ ] **[Agent]** Test session management — SSO sessions work correctly
- [ ] **[Human]** Test with real enterprise providers — Production SSO works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Metadata URL validation**: Ensure metadata URLs are valid and accessible
- **Domain conflicts**: Handle overlapping domains between providers
- **Attribute mapping**: Handle missing or invalid attributes gracefully
- **Session expiration**: Handle token refresh and session renewal
- **Provider failures**: Handle IdP outages gracefully
- **User mapping**: Handle duplicate user creation scenarios
- **RLS policy conflicts**: Ensure SSO provider ID doesn't break existing policies

---

## Out of Scope

- Tenant resolution system (handled in separate task)
- Billing status checking (handled in separate task)
- Rate limiting implementation (handled in separate task)
- Vercel domain management (handled in separate task)

---

## References

- [Section 7.7 Multi-Tenant Auth with SAML 2.0](docs/plan/domain-7/7.7-multi-tenant-auth-with-saml-20-enterprise-sso.md)
- [Section 7.1 Philosophy](docs/plan/domain-7/7.1-philosophy.md)
- [Section 7.8 Complete Tenant Resolution Sequence Diagram](docs/plan/domain-7/7.8-complete-tenant-resolution-sequence-diagram.md)
- [Supabase Auth SAML Documentation](https://supabase.com/docs/guides/auth/sso)
- [SAML 2.0 Specification](https://saml.xml.org/saml-specifications/)
- [Azure AD SAML Integration](https://docs.microsoft.com/en-us/azure/active-directory/develop/hybrid-connect/saml-sign-in-azure-ad)
- [Okta SAML Integration](https://developer.okta.com/docs/guides/saml-configuration)
