# nextjs-16-documentation.md

> **2026 Standards Compliance** | Next.js 16 · Stable PPR · `use cache` Directive ·
> Cache Components · Platform Adapters · DevTools MCP

## Table of Contents

1. [What's New in Next.js 16](#whats-new-in-nextjs-16)
2. [Partial Pre-Rendering (PPR) — Now Stable](#partial-pre-rendering-ppr--now-stable)
3. [`use cache` Directive & Cache Components](#use-cache-directive--cache-components)
4. [Cache Life Profiles](#cache-life-profiles)
5. [Cache Tags & Revalidation](#cache-tags--revalidation)
6. [Async Request APIs](#async-request-apis)
7. [Platform Adapters](#platform-adapters)
8. [Next.js DevTools MCP](#nextjs-devtools-mcp)
9. [Migration from Next.js 15](#migration-from-nextjs-15)
10. [Complete Rendering Decision Tree](#complete-rendering-decision-tree)
11. [References](#references)

---

## What's New in Next.js 16

| Feature                        | Status       | Impact                                             |
| ------------------------------ | ------------ | -------------------------------------------------- |
| PPR (Partial Pre-Rendering)    | **Stable**   | Static speed + dynamic personalization             |
| `use cache` directive          | **Stable**   | Component-level caching                            |
| Cache Components               | **Stable**   | Cache any async Server Component                   |
| `cacheLife()` API              | **New**      | Declarative cache lifetime profiles                |
| `cacheTag()` API               | **New**      | Fine-grained cache invalidation                    |
| Async Request APIs             | **Breaking** | `cookies()`, `headers()`, `params` now async       |
| Platform Adapters              | **New**      | Native Cloudflare Workers, OpenNext deploy targets |
| Next.js DevTools MCP           | **New**      | AI agent access to build analysis                  |
| React 19.2                     | **Bundled**  | Compiler, Activity, useEffectEvent                 |
| `cacheComponents: true` config | **New**      | Opt-in flag for Cache Components [web:29][web:32]  |

---

## Partial Pre-Rendering (PPR) — Now Stable

PPR is the core innovation of Next.js 16: a **single HTTP response** delivers a static
HTML shell instantly (cached at CDN edge), while dynamic Suspense boundaries stream in
as their data resolves. The browser renders meaningful content immediately, then
progressively hydrates dynamic sections. [web:29]

### How PPR Detects Static vs Dynamic

The static/dynamic boundary is determined **automatically** by the presence of
dynamic signals: [web:29]

```

Static signals → can be cached:

- async Server Components with no dynamic APIs
- Cached `fetch()` calls
- `use cache` directives

Dynamic signals → cannot be cached, stream in:

- `cookies()`, `headers()` calls
- `searchParams` access
- `new Date()`, `Math.random()`
- `unstable_noStore()` calls

```

### Enabling PPR

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true, // Enable stable PPR
    cacheComponents: true, // Enable cache components (use cache directive)
    reactCompiler: true, // React Compiler 1.0
  },
};

export default nextConfig;
```

### PPR Page Architecture

```typescript
// app/dashboard/page.tsx — PPR: static shell + dynamic islands
import { Suspense } from 'react'
import { DashboardShell } from '@/widgets/dashboard-shell'
import { PersonalizedGreeting } from '@/widgets/personalized-greeting'
import { AnalyticsChart } from '@/widgets/analytics-chart'
import { LiveLeadFeed } from '@/widgets/live-lead-feed'
import { Skeleton } from '@/shared/ui'

// This entire route uses PPR automatically when next.config has ppr: true
// Static shell renders at build time, dynamic parts stream in
export default async function DashboardPage() {
  return (
    <DashboardShell>
      {/* DYNAMIC — reads cookies() for user session → streams in */}
      <Suspense fallback={<Skeleton className="h-8 w-48" />}>
        <PersonalizedGreeting />
      </Suspense>

      {/* STATIC CACHED — analytics query cached for 1 hour → in static shell */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <AnalyticsChart />
      </Suspense>

      {/* DYNAMIC — real-time feed, no caching → streams in */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <LiveLeadFeed />
      </Suspense>
    </DashboardShell>
  )
}
```

---

## `use cache` Directive & Cache Components

The `use cache` directive marks any async Server Component or function as cacheable.
This is built on top of PPR — it allows **dynamic routes** to have **cached portions**,
giving granular control that route-level `revalidate` can't provide. [web:26][web:29][web:32]

### Function-Level Caching

```typescript
// Caching a data-fetch function
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function getProductCatalog(tenantId: string) {
  'use cache';
  cacheLife('hours'); // Cache for hours (built-in profile)
  cacheTag(`catalog:${tenantId}`); // Tag for on-demand revalidation

  const products = await db.products.findMany({ where: { tenantId } });
  return products;
}

// Any call to getProductCatalog('t_123') uses the cache for hours
// Manually invalidate with: revalidateTag('catalog:t_123')
```

### Component-Level Caching

```typescript
// widgets/analytics-chart/ui/AnalyticsChart.tsx
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

// The ENTIRE component output is cached — not just its data
export async function AnalyticsChart({ tenantId }: { tenantId: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`analytics:${tenantId}`)

  // This fetch runs once per hour per tenant, then the rendered HTML is cached
  const data = await fetchAnalyticsSummary(tenantId)

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-sm font-medium text-gray-500">Leads This Month</h2>
      <p className="mt-1 text-3xl font-bold">{data.leadsThisMonth}</p>
      <LineChart data={data.trend} />
    </div>
  )
}
```

### Critical Rules for `use cache`

```typescript
// ❌ BREAKS CACHE: new Date() is dynamic — causes cache miss every render
async function BadCachedComponent() {
  'use cache'
  const now = new Date()  // Dynamic value — defeats caching
  return <p>Rendered at {now.toISOString()}</p>
}

// ✅ CORRECT: move dynamic values outside the cached boundary
async function GoodCachedComponent({ staticDate }: { staticDate: string }) {
  'use cache'
  cacheLife('hours')
  return <p>Content as of {staticDate}</p>
}

// In the parent (not cached):
// <GoodCachedComponent staticDate={lastRevalidatedAt} />

// ❌ BREAKS CACHE: cookies() and headers() are request-specific
async function BadCachedPersonalized() {
  'use cache'
  const cookieStore = cookies()  // Dynamic — cannot be cached
  const userId = cookieStore.get('userId')?.value
}

// ✅ CORRECT: read dynamic values in parent, pass as props into cached component
async function PersonalizedPage() {
  // NOT cached — reads cookies
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  return (
    // Cached — receives userId as prop, makes it part of cache key
    <CachedUserProfile userId={userId} />
  )
}
```

---

## Cache Life Profiles

Built-in profiles for common caching needs: [web:26][web:29]

```typescript
// Built-in cacheLife profiles:
cacheLife('seconds'); // stale: 0s,   revalidate: 1s,    expire: 10s
cacheLife('minutes'); // stale: 60s,  revalidate: 60s,   expire: 10m
cacheLife('hours'); // stale: 1h,   revalidate: 1h,    expire: 1d
cacheLife('days'); // stale: 1d,   revalidate: 1d,    expire: 1w
cacheLife('weeks'); // stale: 1w,   revalidate: 1w,    expire: 1mo
cacheLife('max'); // stale: 1y,   revalidate: 1y,    expire: 1y (forever)
```

### Custom Cache Life Profiles

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    cacheComponents: true,
    // Define custom profiles matching your data freshness requirements
    cacheProfiles: {
      realtime: { stale: 0, revalidate: 5, expire: 30 },
      'lead-analytics': { stale: 300, revalidate: 300, expire: 86400 },
      'site-config': { stale: 3600, revalidate: 3600, expire: 604800 },
      'blog-content': { stale: 3600, revalidate: 3600, expire: 604800 },
    },
  },
};
```

```typescript
// Usage with custom profile:
async function LeadAnalyticsWidget({ tenantId }: { tenantId: string }) {
  'use cache';
  cacheLife('lead-analytics'); // 5 min freshness
  cacheTag(`leads:${tenantId}`);
  // ...
}
```

---

## Cache Tags & Revalidation

Cache tags enable on-demand, surgical revalidation from webhook handlers, Server
Actions, or API routes:

```typescript
// Tagging pattern — use hierarchical tags for flexibility
async function getTenantData(tenantId: string) {
  'use cache';
  cacheTag(
    `tenant:${tenantId}`, // Invalidate everything for a tenant
    `tenant:${tenantId}:sites` // Or just their sites data
  );
  return fetchTenantWithSites(tenantId);
}

// On-demand revalidation from Sanity webhook:
// apps/portal/src/app/api/revalidate/sanity/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-webhook-secret');
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { _type, tenantId, slug } = body;

  // Surgical invalidation based on content type
  switch (_type) {
    case 'blogPost':
      revalidateTag(`blog:${slug}`);
      revalidateTag('blog-index');
      break;
    case 'serviceArea':
      revalidateTag(`service-area:${slug}`);
      revalidateTag(`tenant:${tenantId}:service-areas`);
      break;
    case 'siteConfig':
      revalidateTag(`tenant:${tenantId}:config`);
      revalidateTag(`tenant:${tenantId}`); // Broad invalidation
      break;
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
```

---

## Async Request APIs

**Breaking change in Next.js 15/16**: `cookies()`, `headers()`, `params`, and
`searchParams` are now async. Failure to await them causes a runtime error. [web:29]

```typescript
// ❌ Next.js 14 (sync — no longer works)
import { cookies, headers } from 'next/headers';

export default function Page() {
  const token = cookies().get('token'); // Sync — THROWS in Next.js 16
  const nonce = headers().get('x-nonce');
}

// ✅ Next.js 16 (async — required)
import { cookies, headers } from 'next/headers';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>; // async params
  searchParams: Promise<{ q?: string }>; // async searchParams
}) {
  // All request APIs require await
  const cookieStore = await cookies();
  const headersList = await headers();
  const { slug } = await params;
  const { q } = await searchParams;

  const token = cookieStore.get('token');
  const nonce = headersList.get('x-nonce');
  // ...
}
```

---

## Platform Adapters

Next.js 16 ships with first-class **platform adapters** that emit platform-native
builds — not just Node.js: [web:29]

```typescript
// next.config.ts — Cloudflare Workers adapter
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  await initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  // Target Cloudflare Workers runtime
};

export default nextConfig;
```

| Adapter            | Use Case                    | Status                   |
| ------------------ | --------------------------- | ------------------------ |
| Vercel (default)   | Vercel deployment           | Built-in                 |
| Node.js            | Self-hosted / Docker        | Built-in                 |
| Cloudflare Workers | Edge-native, no cold starts | `@opennextjs/cloudflare` |
| AWS Lambda         | AWS deployments             | `@opennextjs/aws`        |
| Docker             | Containerized               | Built-in                 |

---

## Next.js DevTools MCP

Next.js 16 ships a built-in **Model Context Protocol (MCP) server** that exposes
your build analysis and route structure to AI agents: [web:29]

```json
// .mcp/config.json — already present in your repo!
{
  "mcpServers": {
    "nextjs-devtools": {
      "command": "npx",
      "args": ["@vercel/next-devtools-mcp", "--project", "."]
    }
  }
}
```

**What the MCP exposes to agents:**

- Build output (bundle sizes, route list, cache hit rates)
- Rendering mode per route (static / dynamic / PPR)
- `use cache` coverage report
- Turbopack module graph

---

## Migration from Next.js 15

### Automated Codemod

```bash
# Run the official migration codemod
npx @next/codemod@latest next-async-request-api .

# What it does:
# - Wraps cookies(), headers() in await
# - Updates params/searchParams to Promise<> types
# - Updates middleware usage of these APIs
```

### Manual Migration Checklist

```
□ Run async-request-api codemod
□ Set experimental.ppr: true in next.config.ts
□ Set experimental.cacheComponents: true
□ Install React 19.2 (ships with Next.js 16)
□ Enable React Compiler (experimental.reactCompiler: true)
□ Run React Compiler lint; fix violations
□ Audit 'use cache' placement in components
□ Replace revalidate = X with cacheLife() where granular caching is needed
□ Test all webhook revalidation flows with cacheTag()
```

---

## Complete Rendering Decision Tree

```
For each route/component, ask:

1. Does it read cookies/headers/searchParams at render time?
   └─ YES → DYNAMIC (Suspense boundary; stream in)
   └─ NO  → Continue ↓

2. Does it have time-sensitive data (stock prices, live counts)?
   └─ YES → DYNAMIC (Suspense + short revalidate)
   └─ NO  → Continue ↓

3. Does it have data that changes occasionally (hours/days)?
   └─ YES → use cache + cacheLife('hours'/'days') + cacheTag()
   └─ NO  → Continue ↓

4. Is it completely static (marketing copy, pricing)?
   └─ YES → Static (build-time, no cache directive needed)
              → generateStaticParams for parameterized routes
```

---

## References

- [Next.js 16 Master PPR Tutorial](https://www.youtube.com/watch?v=WJn1rXesTtg) [web:29]
- [Cache Components — Shahin.page Deep Dive](https://shahin.page/article/nextjs-cache-components-partial-prerendering-streaming-caching) [web:26]
- [Cache Components — YouTube](https://www.youtube.com/watch?v=Rodyt22D84A) [web:32]
- [Next.js generateMetadata Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) [web:41]
- [Next.js Sitemap Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) [web:47]
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [React 19.2 Blog](https://react.dev/blog/2025/10/01/react-19-2) [web:28]
