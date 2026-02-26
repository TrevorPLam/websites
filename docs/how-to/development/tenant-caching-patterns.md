---
title: "Tenant Caching Patterns"
description: "> **Reference Documentation — February 2026**"
domain: development
type: reference
layer: global
audience: ["developer"]
phase: 1
complexity: intermediate
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "tenant", "caching", "patterns"]
legacy_path: "backend-data\caching\tenant-caching-patterns.md"
---
# Tenant Caching Patterns

> **Reference Documentation — February 2026**

## Overview

Tenant-isolated caching prevents one tenant's data from ever appearing in another tenant's response. This requires every `use cache` call, ISR page, and Upstash Redis key to include the `tenantId` as a cache key component and cache tag. [vercel](https://vercel.com/docs/incremental-migration)

---

## The Isolation Invariant

```
RULE: Every cache key and cache tag that contains tenant-specific data
      MUST include tenantId as a component.

CORRECT:   cacheTag(`tenant:${tenantId}:leads`)
INCORRECT: cacheTag('leads')   ← shared across ALL tenants
```

---

## `use cache` + `cacheTag` Pattern

```typescript
// packages/db/src/queries/tenant-queries.ts
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

export async function getTenantConfig(tenantId: string) {
  'use cache';
  cacheTag(`tenant:${tenantId}`); // Bust all tenant data
  cacheTag(`tenant:${tenantId}:config`); // Bust only config
  cacheLife('1h');

  const { data } = await supabase
    .from('tenants')
    .select('config, plan, status')
    .eq('id', tenantId)
    .single();

  return data;
}

export async function getTenantLeads(tenantId: string, limit = 20) {
  'use cache';
  cacheTag(`tenant:${tenantId}`);
  cacheTag(`tenant:${tenantId}:leads`);
  cacheLife('5m');

  return supabase
    .from('leads')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(limit);
}
```

---

## Tag-Based Invalidation Map

| Tenant Action              | `revalidateTag()` Calls                              |
| -------------------------- | ---------------------------------------------------- |
| Update identity settings   | `tenant:${id}`, `tenant:${id}:config`                |
| New lead created           | `tenant:${id}:leads`                                 |
| Service area added/removed | `tenant:${id}:sitemap`, `tenant:${id}:service-areas` |
| Blog post published        | `tenant:${id}:blog`, `tenant:${id}:blog:${slug}`     |
| Plan upgrade/downgrade     | `tenant:${id}` (full bust)                           |

---

## Upstash Redis Key Namespace

```typescript
// packages/security/src/rate-limit.ts

// All Redis keys prefixed with tenant ID
export function tenantRateLimitKey(tenantId: string, action: string) {
  return `ratelimit:${tenantId}:${action}`;
}

// Cache keys
export function tenantCacheKey(tenantId: string, resource: string) {
  return `cache:v1:${tenantId}:${resource}`;
}

// Session keys (Upstash Redis)
export function tenantSessionKey(tenantId: string, userId: string) {
  return `session:${tenantId}:${userId}`;
}
```

---

## References

- Next.js `cacheTag` Documentation — https://nextjs.org/docs/app/api-reference/functions/cacheTag
- Next.js `use cache` Directive — https://nextjs.org/docs/app/api-reference/directives/use-cache
- Vercel Incremental Migration — https://vercel.com/docs/incremental-migration

---