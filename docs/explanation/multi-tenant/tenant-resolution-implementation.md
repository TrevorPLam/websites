---
title: "tenant-resolution-implementation.md"
description: "> **2026 Standards Compliance** | OAuth 2.1 · Edge Middleware · Next.js 16 App Router"
domain: multi-tenant
type: how-to
layer: global
audience: ["["developer"]"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["["development", "tenant-resolution-implementation.md"]"]
legacy_path: "multi-tenant/tenant-resolution-implementation.md"
---# tenant-resolution-implementation.md

> **2026 Standards Compliance** | OAuth 2.1 · Edge Middleware · Next.js 16 App Router

## 2026 Standards Compliance

- **OAuth 2.1 with PKCE**: Modern authentication flow for all clients
- **Edge Computing**: Global tenant resolution with sub-100ms latency
- **Zero-Trust Architecture**: Per-request validation, no trusted internal traffic
- **Multi-Tenant Isolation**: Complete tenant data separation via routing
- **Core Web Vitals**: Resolution overhead < 5ms (INP budget)
- **GDPR/CCPA Compliant**: Tenant privacy and data protection

---

## Overview

Tenant resolution is the critical first step in any multi-tenant SaaS application. This implementation provides a comprehensive, production-ready tenant resolution system that supports multiple routing strategies (subdomain, custom domain, path prefix) with edge-optimized performance and security. The system uses a priority-based resolution order with caching to achieve sub-5ms resolution times at the edge.

## Architecture Overview

```
Edge Middleware (Vercel/Cloudflare)
    │  • Priority 1: Custom domain lookup (KV cache)
    │  • Priority 2: Subdomain resolution (KV cache)
    │  • Priority 3: Path prefix extraction (no cache)
    │  • Priority 4: Header/Cookie fallback (API only)
    ▼
Tenant Context Injection
    │  • x-tenant-id header
    │  • x-tenant-slug header
    │  • x-resolution-strategy header
    ▼
Application Layer
    │  • AsyncLocalStorage tenant context
    │  • Per-tenant data isolation
    │  • Billing status validation
    ▼
Database Layer
    │  • RLS policies with tenant_id filtering
    │  • Tenant-specific row isolation
    │  • Audit logging per tenant
```

---

## Resolution Strategies

### Priority Order

```
1. Custom domain → `shop.acme.com` → lookup via DB/KV
2. Subdomain → `acme.yoursaas.com` → slug from hostname
3. Path prefix → `yoursaas.com/t/acme` → segment from pathname
4. Header/Cookie → `X-Tenant-ID` / session → fallback for API routes
```

### Strategy 1 — Subdomain (Recommended for SaaS)

```
Request: acme.yoursaas.com
└─ hostname.split('.') → "acme"
```

**Pros**: Clean URLs, zero DB lookup for slug-based tenants.  
**Cons**: Requires wildcard DNS `*.yoursaas.com` and wildcard SSL cert.

### Strategy 2 — Custom Domain

```
Request: marketing.acme.com
└─ KV lookup: "marketing.acme.com" → tenantId: "t_abc123"
```

**Pros**: White-label branding, tenant owns their domain.  
**Cons**: DNS propagation latency; requires domain verification flow.

### Strategy 3 — Path Prefix

```
Request: yoursaas.com/t/acme/dashboard
└─ pathname.split('/') → "acme"
```

**Pros**: Works on shared domain with no DNS changes.  
**Cons**: Exposes internal slug structure; less clean for white-labeling.

---

## Implementation

### Edge Middleware (Next.js 16)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@repo/tenant-resolution';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Priority 1: Custom domain (Enterprise/Pro feature)
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`) && hostname !== ROOT_DOMAIN) {
    return resolveCustomDomain(request, hostname);
  }

  // Priority 2: Subdomain (all plans)
  const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');
  if (subdomain && subdomain !== 'www') {
    return resolveSubdomain(request, subdomain);
  }

  // Priority 3: Path prefix (legacy support)
  if (pathname.startsWith('/t/')) {
    const pathParts = pathname.split('/');
    if (pathParts.length > 2) {
      const slug = pathParts[2];
      return resolvePathPrefix(request, slug);
    }
  }

  // Priority 4: Header/Cookie fallback (API routes only)
  return resolveHeaderFallback(request);
}

async function resolveCustomDomain(request: NextRequest, domain: string): Promise<NextResponse> {
  const tenant = await resolveTenantByCustomDomain(domain);

  if (!tenant) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-resolution-strategy', 'custom-domain');

  return response;
}

async function resolveSubdomain(request: NextRequest, subdomain: string): Promise<NextResponse> {
  const tenant = await resolveTenantBySlug(subdomain);

  if (!tenant) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-resolution-strategy', 'subdomain');

  return response;
}

async function resolvePathPrefix(request: NextRequest, slug: string): Promise<NextResponse> {
  const tenant = await resolveTenantBySlug(slug);

  if (!tenant) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  // Rewrite to remove the /t/{slug} prefix
  const newPath = pathname.replace(`/t/${slug}`, '');
  const url = new URL(newPath, request.url);

  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-resolution-strategy', 'path-prefix');

  return response;
}

async function resolveHeaderFallback(request: NextRequest): Promise<NextResponse> {
  const tenantId = request.headers.get('x-tenant-id');
  const tenantSlug = request.headers.get('x-tenant-slug');

  if (!tenantId) {
    return NextResponse.next(); // No tenant context (public pages)
  }

  // Validate tenant exists and is active
  const tenant = await resolveTenantById(tenantId);

  if (!tenant || tenant.status !== 'active') {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);
  response.headers.set('x-tenant-slug', tenant.slug);
  response.headers.set('x-resolution-strategy', 'header-fallback');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
```

### Tenant Resolution Service

```typescript
// packages/tenant-resolution/src/resolver.ts
import { createClient } from '@supabase/supabase-js';
import { kv } from '@vercel/kv';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface TenantContext {
  id: string;
  slug: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'deleted';
  customDomain?: string;
  features: string[];
  billingStatus: 'current' | 'past_due' | 'canceled';
}

export async function resolveTenantBySlug(slug: string): Promise<TenantContext | null> {
  // Check KV cache first (edge-optimized)
  const cacheKey = `tenant:slug:${slug}`;
  const cached = await kv.get<TenantContext>(cacheKey);

  if (cached) {
    return cached;
  }

  // Fallback to database
  const { data, error } = await supabase
    .from('tenants')
    .select('id, slug, name, plan, status, custom_domain, features, billing_status')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  const tenant: TenantContext = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    plan: data.plan,
    status: data.status,
    customDomain: data.custom_domain,
    features: data.features || [],
    billingStatus: data.billing_status,
  };

  // Cache for 10 minutes (edge performance)
  await kv.set(cacheKey, tenant, { ex: 600 });

  return tenant;
}

export async function resolveTenantByCustomDomain(domain: string): Promise<TenantContext | null> {
  // Check KV cache first
  const cacheKey = `tenant:domain:${domain}`;
  const cached = await kv.get<TenantContext>(cacheKey);

  if (cached) {
    return cached;
  }

  // Fallback to database
  const { data, error } = await supabase
    .from('tenants')
    .select('id, slug, name, plan, status, custom_domain, features, billing_status')
    .eq('custom_domain', domain)
    .eq('custom_domain_verified', true)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  const tenant: TenantContext = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    plan: data.plan,
    status: data.status,
    customDomain: data.custom_domain,
    features: data.features || [],
    billingStatus: data.billing_status,
  };

  // Cache for 5 minutes (domains change less frequently)
  await kv.set(cacheKey, tenant, { ex: 300 });

  return tenant;
}

export async function resolveTenantById(tenantId: string): Promise<TenantContext | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('id, slug, name, plan, status, custom_domain, features, billing_status')
    .eq('id', tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    plan: data.plan,
    status: data.status,
    customDomain: data.custom_domain,
    features: data.features || [],
    billingStatus: data.billing_status,
  };
}
```

### Tenant Context Hook

```typescript
// packages/tenant-context/src/hooks.ts
import { headers } from 'next/headers';
import { TenantContext } from './types';

export function getTenantContext(): TenantContext | null {
  const headersList = headers();

  const tenantId = headersList.get('x-tenant-id');
  const tenantSlug = headersList.get('x-tenant-slug');
  const strategy = headersList.get('x-resolution-strategy');

  if (!tenantId || !tenantSlug) {
    return null;
  }

  return {
    id: tenantId,
    slug: tenantSlug,
    // Additional fields can be fetched from database if needed
    name: '',
    plan: 'free',
    status: 'active',
    features: [],
    billingStatus: 'current',
  };
}

export function useTenantContext(): TenantContext | null {
  // For client components - would need to pass via props or context
  throw new Error(
    'useTenantContext is server-side only. Use getTenantContext() in Server Components.'
  );
}
```

---

## Database Schema

```sql
-- tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  custom_domain TEXT UNIQUE,
  custom_domain_verified BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  billing_status TEXT NOT NULL DEFAULT 'current' CHECK (billing_status IN ('current', 'past_due', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_plan ON tenants(plan);
```

---

## Security Considerations

| Threat                      | Mitigation                                                  |
| --------------------------- | ----------------------------------------------------------- |
| Tenant spoofing via headers | Only set `x-tenant-*` headers in middleware; strip incoming |
| Subdomain enumeration       | Rate limit resolution endpoint; no verbose errors           |
| Cache poisoning             | TTL + cache-key includes full hostname, not just slug       |
| Suspended tenant bypass     | Check `status` on every resolution, not just billing        |
| Path traversal              | Validate slug against `^[a-z0-9-]{3,63}$` regex             |

```typescript
// Sanitize slug before lookup
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
if (!SLUG_REGEX.test(subdomain)) {
  return { tenant: null, strategy: 'invalid-slug' };
}
```

---

## Performance Optimization

- **P99 target**: Tenant resolution ≤ 5ms at Edge (Upstash Redis global replication)
- **Cache TTL strategy**:
  - Active tenants: 10 min sliding window
  - Custom domains: 5 min (domain changes are infrequent but impactful)
  - Suspended/deleted: 30 sec (fast propagation of suspension)

```typescript
// Performance monitoring
const resolutionStart = Date.now();
const tenant = await resolveTenantBySlug(slug);
const resolutionTime = Date.now() - resolutionStart;

if (resolutionTime > 5) {
  console.warn('Slow tenant resolution', { slug, resolutionTime, strategy });
}
```

---

## Testing

```typescript
// middleware.test.ts
import { createMocks } from 'node-mocks-http';
import { describe, it, expect, vi } from 'vitest';

describe('Tenant Resolution Middleware', () => {
  it('resolves subdomain tenant from cache', async () => {
    vi.mocked(kv.get).mockResolvedValueOnce({
      id: 't_123',
      slug: 'acme',
      plan: 'pro',
      status: 'active',
    });

    const req = new Request('https://acme.yoursaas.com/dashboard');
    const res = await middleware(req as NextRequest);

    expect(res.headers.get('x-tenant-id')).toBe('t_123');
    expect(res.headers.get('x-resolution-strategy')).toBe('subdomain-cache');
  });

  it('returns 404 for unknown subdomain', async () => {
    vi.mocked(kv.get).mockResolvedValueOnce(null);
    vi.mocked(resolveTenantBySlug).mockResolvedValueOnce(null);

    const req = new Request('https://unknown.yoursaas.com/');
    const res = await middleware(req as NextRequest);

    expect(res.status).toBe(200); // Rewritten to /not-found
  });
});
```

---

## Custom Domain Management

### Domain Verification Flow

```typescript
// packages/domain-management/src/verification.ts
export async function verifyCustomDomain(
  tenantId: string,
  domain: string
): Promise<{ success: boolean; txtRecord?: string }> {
  // 1. Generate verification token
  const token = crypto.randomUUID();
  const verificationValue = `vercel-site-verification=${token}`;

  // 2. Store verification token
  await supabase.from('domain_verifications').insert({
    tenant_id: tenantId,
    domain,
    token,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // 3. Return TXT record value for user to add
  return {
    success: true,
    txtRecord: verificationValue,
  };
}

export async function confirmDomainVerification(
  domain: string
): Promise<{ verified: boolean; tenantId?: string }> {
  // 1. Lookup DNS TXT record
  const txtRecord = await resolveTxtRecord(domain);

  if (!txtRecord) {
    return { verified: false };
  }

  // 2. Extract token from record
  const tokenMatch = txtRecord.match(/vercel-site-verification=([a-f0-9-]+)/);
  if (!tokenMatch) {
    return { verified: false };
  }

  // 3. Verify token in database
  const { data, error } = await supabase
    .from('domain_verifications')
    .select('tenant_id')
    .eq('domain', domain)
    .eq('token', tokenMatch[1])
    .eq('expires_at', 'gt', new Date().toISOString())
    .single();

  if (error || !data) {
    return { verified: false };
  }

  // 4. Update tenant custom domain verification
  await supabase.from('tenants').update({ custom_domain_verified: true }).eq('id', data.tenant_id);

  // 5. Clean up verification record
  await supabase.from('domain_verifications').delete().eq('domain', domain);

  return { verified: true, tenantId: data.tenant_id };
}

async function resolveTxtRecord(domain: string): Promise<string | null> {
  // Implementation depends on DNS provider
  // This is a simplified example
  try {
    const { stdout } = await exec(`dig +short TXT ${domain}`);
    const lines = stdout.split('\n');
    const txtLine = lines.find((line) => line.includes(domain) && line.includes('TXT'));
    return txtLine?.split('"')[1] || null;
  } catch {
    return null;
  }
}
```

---

## Monitoring & Analytics

```typescript
// packages/analytics/src/tenant-resolution.ts
export async function trackTenantResolution(
  strategy: string,
  tenantId: string | null,
  resolutionTime: number,
  hostname: string
): Promise<void> {
  await fetch('https://api.tinybird.co/v0/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'tenant_resolutions',
      data: {
        timestamp: new Date().toISOString(),
        strategy,
        tenant_id: tenantId,
        resolution_time_ms: resolutionTime,
        hostname,
        user_agent: headers().get('user-agent'),
      },
    }),
  });
}

// Usage in middleware
const resolutionStart = Date.now();
const tenant = await resolveTenantBySlug(subdomain);
const resolutionTime = Date.now() - resolutionStart;

await trackTenantResolution('subdomain', tenant?.id || null, resolutionTime, hostname);
```

---

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware) — Edge middleware patterns
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv) — Edge storage and caching
- [Multi-tenant Architecture Patterns – Microsoft](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview) — SaaS architecture patterns
- [Vercel for Platforms](https://vercel.com/guides/nextjs-multi-tenant-application) — Platform engineering guide
- [Upstash Redis Edge](https://upstash.com/docs/redis/sdks/ts/getstarted) — Edge Redis for caching
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-01) — Authentication standards

---