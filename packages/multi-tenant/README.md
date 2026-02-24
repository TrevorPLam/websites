# @repo/multi-tenant

Multi-tenant infrastructure package for the marketing platform.

## Features

- **Tenant Resolution** (DOMAIN-7-001): Subdomain, custom domain, and path-based routing with Redis caching
- **Billing Status** (DOMAIN-7-002): Real-time billing checks with suspension patterns
- **Rate Limiting** (DOMAIN-7-003): Tiered rate limiting with sliding window algorithms
- **Vercel Domains** (DOMAIN-7-004): Programmatic domain lifecycle management
- **Enterprise SSO** (DOMAIN-7-005): SAML 2.0 integration for enterprise authentication

## Installation

```bash
pnpm add @repo/multi-tenant
```

## Usage

### Tenant Resolution

```typescript
import { resolveTenant, createTenantMiddleware } from '@repo/multi-tenant';

// In middleware
const middleware = createTenantMiddleware();
const response = await middleware(request);

// Direct usage
const resolution = await resolveTenant(request);
if (resolution.success) {
  console.log(resolution.tenantId, resolution.tenantConfig);
}
```

### Billing Status

```typescript
import { checkBillingStatus, createBillingMiddleware } from '@repo/multi-tenant';

const status = await checkBillingStatus('tenant-123');
// 'active' | 'trial' | 'suspended' | 'cancelled'
```

### Rate Limiting

```typescript
import { rateLimiters, createRateLimitMiddleware } from '@repo/multi-tenant';

// Middleware
const middleware = createRateLimitMiddleware();

// Direct usage
const { success, limit, remaining, reset } = await rateLimiters.starter.limit('identifier');
```

### Vercel Domains

```typescript
import { addTenantDomain, checkDomainStatus } from '@repo/multi-tenant/vercel-domains';

const status = await addTenantDomain('acmelaw.com', 'tenant-123');
```

### Enterprise SSO

```typescript
import { registerSAMLProvider, getSSOLoginUrl } from '@repo/multi-tenant/enterprise-sso';

const { providerId } = await registerSAMLProvider('tenant-123', {
  metadataUrl: 'https://login.microsoftonline.com/...',
  domains: ['acmecorp.com'],
});
```

## Environment Variables

```bash
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Vercel
VERCEL_API_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Architecture

See `docs/plan/domain-7/` for detailed specifications:

- 7.1 Philosophy
- 7.2 Complete Tenant Resolution
- 7.3 Billing Status Check
- 7.4 Tenant Suspension Pattern
- 7.5 Noisy Neighbor Prevention
- 7.6 Vercel for Platforms
- 7.7 Multi-Tenant Auth with SAML 2.0
