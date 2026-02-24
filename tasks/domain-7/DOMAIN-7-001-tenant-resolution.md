---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-7-001
title: 'Complete tenant resolution with routing strategies'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-7-001-tenant-resolution
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-7-001 · Complete tenant resolution with routing strategies

## Objective

Implement complete tenant resolution system following section 7.2 specification with subdomain, custom domain, and path-based routing, Redis caching, and proper tenant identifier extraction for multi-tenant architecture.

---

## Context

**Codebase area:** Multi-tenant routing and resolution — Tenant identification system

**Related files:** Middleware, tenant resolution, routing configuration, cache management

**Documentation Reference:**

- Implementation Guide: `docs/guides/multi-tenant/tenant-resolution-implementation.md` ✅ **COMPLETED**
- Related Patterns: `docs/guides/multi-tenant/routing-strategy-comparison.md` ✅ **COMPLETED**
- Sequence Diagram: `docs/guides/tenant-resolution-sequence-diagram.md` ✅ **COMPLETED**

**Current Status:** Documentation exists for implementation patterns. Missing sequence diagram for complete architectural overview.

**Dependencies:** Redis for caching, Supabase for tenant data, Next.js middleware

**Prior work:** Basic middleware exists but lacks comprehensive tenant resolution and routing strategies

**Constraints:** Must follow section 7.2 specification with proper routing priority and caching strategies

---

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Routing    | Next.js middleware with rewrite patterns  |
| Caching    | Redis for tenant resolution cache         |
| Database   | Supabase for tenant configuration         |
| Resolution | Subdomain → Custom Domain → Path priority |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement complete tenant resolution following section 7.2 specification
- [ ] **[Agent]** Create tenant identifier extraction with routing priority
- [ ] **[Agent]** Add Redis caching for tenant resolution
- [ ] **[Agent]** Implement subdomain, custom domain, and path-based routing
- [ ] **[Agent]** Add proper error handling for invalid hosts
- [ ] **[Agent]** Create tenant configuration loading
- [ ] **[Agent]** Test all routing strategies
- [ ] **[Human]** Verify resolution follows section 7.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 7.2 specification** — Extract tenant resolution requirements
- [ ] **[Agent]** **Create identifier extraction** — Implement routing priority logic
- [ ] **[Agent]** **Add Redis caching** — Implement tenant resolution cache
- [ ] **[Agent]** **Implement database lookup** — Add tenant configuration loading
- [ ] **[Agent]** **Add error handling** — Handle invalid hosts and missing tenants
- [ ] **[Agent]** **Test routing strategies** — Verify all routing modes work
- [ ] **[Agent]** **Add middleware integration** — Integrate with Next.js middleware

> ⚠️ **Agent Question**: Ask human before proceeding if any existing middleware needs migration to new resolution system.

---

## Commands

```bash
# Test tenant resolution
pnpm test --filter="@repo/multi-tenant"

# Test routing strategies
node -e "
import { resolveTenant } from '@repo/multi-tenant/resolve-tenant';
const request = new Request('https://acme-law.youragency.com/about');
const result = await resolveTenant(request);
console.log('Tenant resolution:', result);
"

# Test caching behavior
node -e "
import { resolveTenant } from '@repo/multi-tenant/resolve-tenant';
const request = new Request('https://acme-law.youragency.com/about');
// First call - cache miss
const result1 = await resolveTenant(request);
// Second call - cache hit
const result2 = await resolveTenant(request);
console.log('Cache test complete');
"

# Test custom domain resolution
node -e "
import { resolveTenant } from '@repo/multi-tenant/resolve-tenant';
const request = new Request('https://acmelaw.com/about');
const result = await resolveTenant(request);
console.log('Custom domain resolution:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Complete tenant resolution following section 7.2
import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { db } from '@repo/db';
import type { SiteConfig } from '@repo/config-schema';

const redis = Redis.fromEnv();
const CACHE_TTL_SECONDS = 300; // 5 minutes — balance freshness vs. DB load

export type TenantResolution =
  | { success: true; tenantId: string; tenantConfig: SiteConfig }
  | { success: false; reason: 'not_found' | 'invalid_host' };

// ============================================================================
// EXTRACT IDENTIFIER FROM REQUEST
// Supports: subdomain, custom domain, path prefix
// Priority: custom domain → subdomain → path prefix
// ============================================================================

function extractTenantIdentifier(
  request: NextRequest
): { type: 'subdomain' | 'custom_domain' | 'path'; value: string } | null {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // Agency platform base domains (not client domains)
  const BASE_DOMAINS = [
    'youragency.com',
    'www.youragency.com',
    'localhost:3000',
    'vercel.app', // Preview deployments
  ];

  const isBaseDomain = BASE_DOMAINS.some((base) => host === base || host.endsWith('.' + base));

  // --- Custom Domain: Not a base domain and not a subdomain of base ---
  // e.g., host = "acmelaw.com" or "www.acmelaw.com"
  if (!isBaseDomain && !host.endsWith('.youragency.com')) {
    // Strip "www." prefix for canonical lookup
    const cleanHost = host.replace(/^www\./, '');
    return { type: 'custom_domain', value: cleanHost };
  }

  // --- Subdomain: e.g., "acme-law.youragency.com" ---
  if (host.endsWith('.youragency.com')) {
    const subdomain = host.replace('.youragency.com', '');
    // Exclude reserved subdomains
    const RESERVED = ['www', 'admin', 'portal', 'api', 'mail', 'cdn'];
    if (RESERVED.includes(subdomain)) return null;
    return { type: 'subdomain', value: subdomain };
  }

  // --- Path prefix: e.g., "/sites/acme-law/..." ---
  const pathMatch = pathname.match(/^\/sites\/([a-z0-9-]+)(\/.*)?$/);
  if (pathMatch) {
    return { type: 'path', value: pathMatch[1] };
  }

  return null;
}

// ============================================================================
// RESOLVE TENANT (with Redis cache)
// ============================================================================

export async function resolveTenant(request: NextRequest): Promise<TenantResolution> {
  const identifier = extractTenantIdentifier(request);

  if (!identifier) {
    return { success: false, reason: 'invalid_host' };
  }

  // --- Cache key ---
  const cacheKey = `tenant:resolve:${identifier.type}:${identifier.value}`;

  // --- Check Redis cache first ---
  const cached = await redis.get<{ tenantId: string; tenantConfig: SiteConfig }>(cacheKey);
  if (cached) {
    return { success: true, tenantId: cached.tenantId, tenantConfig: cached.tenantConfig };
  }

  // --- Database lookup ---
  let query = db.from('tenants').select('id, config');

  if (identifier.type === 'subdomain') {
    query = query.eq('subdomain', identifier.value);
  } else if (identifier.type === 'custom_domain') {
    query = query.eq('custom_domain', identifier.value);
  } else {
    // Path-based
    query = query.eq('subdomain', identifier.value);
  }

  const { data: tenant, error } = await query.single();

  if (error || !tenant) {
    return { success: false, reason: 'not_found' };
  }

  const tenantConfig = tenant.config as SiteConfig;
  const result = {
    success: true as const,
    tenantId: tenant.id,
    tenantConfig,
  };

  // --- Cache the result ---
  await redis.set(cacheKey, result, { ex: CACHE_TTL_SECONDS });

  return result;
}

// ============================================================================
// TENANT CONFIGURATION VALIDATION
// ============================================================================

export function validateTenantConfig(config: SiteConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.identity?.siteName) {
    errors.push('Site name is required');
  }

  if (!config.identity?.contact?.email) {
    errors.push('Contact email is required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.identity?.contact?.email && !emailRegex.test(config.identity.contact.email)) {
    errors.push('Invalid contact email format');
  }

  // Theme validation
  if (config.theme?.brandColor && !/^#[0-9A-Fa-f]{6}$/.test(config.theme.brandColor)) {
    errors.push('Brand color must be a valid hex color');
  }

  // SEO validation
  if (config.seo?.title && config.seo.title.length > 60) {
    errors.push('SEO title should be 60 characters or less');
  }

  if (config.seo?.description && config.seo.description.length > 160) {
    errors.push('SEO description should be 160 characters or less');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

export async function invalidateTenantCache(identifier: {
  type: 'subdomain' | 'custom_domain' | 'path';
  value: string;
}): Promise<void> {
  const cacheKey = `tenant:resolve:${identifier.type}:${identifier.value}`;
  await redis.del(cacheKey);
}

// ============================================================================
// MIDDLEWARE INTEGRATION HELPER
// ============================================================================

export function createTenantMiddleware() {
  return async function tenantMiddleware(request: NextRequest) {
    const resolution = await resolveTenant(request);

    if (!resolution.success) {
      // Handle invalid host - could redirect to error page or return 404
      if (resolution.reason === 'invalid_host') {
        return new Response('Invalid host', { status: 400 });
      }

      if (resolution.reason === 'not_found') {
        return new Response('Tenant not found', { status: 404 });
      }
    }

    // Set tenant context headers for downstream components
    const response = NextResponse.next();
    response.headers.set('X-Tenant-Id', resolution.tenantId);
    response.headers.set('X-Tenant-Config', JSON.stringify(resolution.tenantConfig));

    return response;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTenantFromHeaders(headers: Headers): string | null {
  return headers.get('X-Tenant-Id');
}

export function getTenantConfigFromHeaders(headers: Headers): SiteConfig | null {
  const configHeader = headers.get('X-Tenant-Config');
  if (!configHeader) return null;

  try {
    return JSON.parse(configHeader) as SiteConfig;
  } catch {
    return null;
  }
}

export function buildTenantUrl(
  identifier: { type: 'subdomain' | 'custom_domain' | 'path'; value: string },
  pathname: string = '/'
): string {
  if (identifier.type === 'custom_domain') {
    return `https://${identifier.value}${pathname}`;
  }

  if (identifier.type === 'subdomain') {
    return `https://${identifier.value}.youragency.com${pathname}`;
  }

  // Path-based
  return `https://youragency.com/sites/${identifier.value}${pathname}`;
}
```

**Tenant resolution principles:**

- **Routing priority**: Custom domain → Subdomain → Path prefix
- **Redis caching**: 5-minute TTL for performance vs freshness balance
- **Error handling**: Graceful handling of invalid hosts and missing tenants
- **Configuration validation**: Ensure tenant configs meet requirements
- **Cache invalidation**: Manual cache busting when tenant config changes
- **Middleware integration**: Seamless integration with Next.js middleware
- **Utility functions**: Helper functions for common operations

---

## Boundaries

| Tier             | Scope                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 7.2 specification; implement routing priority; add Redis caching; handle errors gracefully; validate configs |
| ⚠️ **Ask first** | Changing existing middleware structure; modifying routing patterns; updating cache strategies                               |
| 🚫 **Never**     | Skip error handling; ignore routing priority; bypass cache invalidation; expose sensitive tenant data                       |

---

## Success Verification

- [ ] **[Agent]** Test identifier extraction — All routing types work correctly
- [ ] **[Agent]** Verify Redis caching — Cache hits improve performance
- [ ] **[Agent]** Test database lookup — Tenant data loaded correctly
- [ ] **[Agent]** Verify error handling — Invalid hosts handled gracefully
- [ ] **[Agent]** Test config validation — Invalid configs rejected
- [ ] **[Agent]** Test cache invalidation — Config changes reflected immediately
- [ ] **[Agent]** Test middleware integration — Headers set correctly
- [ ] **[Human]** Test with real domains — Production routing works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Reserved subdomains**: Ensure admin, api, www subdomains are excluded
- **WWW prefix handling**: Strip www. for canonical domain lookup
- **Cache invalidation**: Ensure cache is busted when tenant config changes
- **Path conflicts**: Handle path-based routing conflicts with other routes
- **Domain verification**: Ensure custom domains are properly verified
- **Performance**: Balance cache TTL with data freshness requirements

---

## Out of Scope

- Billing status checking (handled in separate task)
- Rate limiting implementation (handled in separate task)
- SAML/SSO integration (handled in separate task)
- Vercel domain management (handled in separate task)

---

## References

- [Section 7.2 Complete Tenant Resolution](docs/plan/domain-7/7.2-complete-tenant-resolution-packagesmulti-tenantsrcresolve-tenantts.md)
- [Section 7.1 Philosophy](docs/plan/domain-7/7.1-philosophy.md)
- [Section 7.8 Complete Tenant Resolution Sequence Diagram](docs/plan/domain-7/7.8-complete-tenant-resolution-sequence-diagram.md)
- [Section 7.9 Routing Comparison](docs/plan/domain-7/7.9-routing-comparison-subdomain-vs-path-vs-custom-domain.md)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/middleware)
- [Multi-tenant Architecture Patterns](https://kitemetric.com/blogs/mastering-subdomain-routing-in-next-js-for-multi-tenant-applications)
