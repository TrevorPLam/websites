# Multi-Tenant Package

## Overview

This package provides multi-tenant infrastructure for the marketing platform including:

- Tenant resolution (subdomain, custom domain, path-based routing)
- Billing status checking and suspension patterns
- Rate limiting with tiered system
- Vercel for Platforms domain lifecycle management
- SAML 2.0 enterprise SSO integration

## Structure

```
packages/multi-tenant/
├── src/
│   ├── index.ts                    # Main exports
│   ├── resolve-tenant.ts           # Tenant resolution (DOMAIN-7-001)
│   ├── check-billing.ts            # Billing status (DOMAIN-7-002)
│   ├── suspended-page.tsx          # Suspension page component
│   ├── rate-limit.ts               # Rate limiting (DOMAIN-7-003)
│   ├── vercel-domains.ts           # Domain lifecycle (DOMAIN-7-004)
│   └── enterprise-sso.ts           # SAML SSO (DOMAIN-7-005)
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- `@upstash/redis` - Redis caching
- `@upstash/ratelimit` - Rate limiting
- `@vercel/sdk` - Vercel API integration
- `@supabase/supabase-js` - Database and auth
- `@repo/config-schema` - Site configuration types

## Usage

```typescript
import { resolveTenant } from '@repo/multi-tenant';
import { checkBillingStatus } from '@repo/multi-tenant/check-billing';
import { rateLimiters } from '@repo/multi-tenant/rate-limit';
```
