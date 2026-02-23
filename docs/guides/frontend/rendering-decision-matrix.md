# Rendering Decision Matrix

> **Reference Documentation — February 2026**

## Overview

Next.js 16 supports four rendering modes: Static Site Generation (SSG), Incremental Static Regeneration (ISR), Server-Side Rendering (SSR), and Client-Side Rendering (CSR). Choosing the wrong mode for a page type is the most common source of performance regressions and unnecessary server load. [digitalapplied](https://www.digitalapplied.com/blog/nextjs-16-performance-server-components-guide)

---

## Decision Matrix

| Page Type          | Mode                                               | Reason                                               |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| Marketing homepage | **PPR** (SSG shell + dynamic island)               | Best LCP; only above-fold is static                  |
| Service area pages | **ISR** (`cacheLife: 24h`)                         | SEO-critical; changes infrequently                   |
| Blog posts         | **ISR** (`cacheLife: 1h`) + on-demand revalidation | CMS-driven; on-demand ISR on publish                 |
| Contact form page  | **SSG**                                            | Pure static; form is client-side                     |
| Portal dashboard   | **SSR** + `use cache` per-query                    | Always-fresh data; authenticated                     |
| Realtime lead feed | **SSR** initial + **CSR** updates                  | Server renders initial leads; Realtime adds new ones |
| Booking page       | **SSG** + CSR for Cal.com embed                    | Cal.com embeds as CSR component                      |
| Super admin panel  | **SSR**                                            | Must never cache admin data                          |
| PDF report pages   | **Streaming SSR** (`Suspense`)                     | Large data queries stream progressively              |
| A/B test variants  | **Edge Middleware + SSG**                          | Middleware selects variant at edge; no layout shift  |

---

## Mode Implementation Patterns

### SSG (Static)

```typescript
// No exports needed — Next.js defaults to static if no dynamic data
export default async function ContactPage() {
  return <ContactForm />;
}
```

### ISR (Incremental Static Regeneration)

```typescript
// Next.js 16 uses cacheLife instead of revalidate
import { unstable_cacheLife as cacheLife } from 'next/cache';

export default async function ServiceAreaPage({ params }: Props) {
  const area = await getServiceAreaData(params.slug, { cacheLife: '24h' });
  return <ServiceAreaContent area={area} />;
}
```

### PPR (Partial Pre-rendering)

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: { ppr: true },
};

// page.tsx
export default function HomePage() {
  return (
    <main>
      {/* Static shell — pre-rendered at build */}
      <HeroSection />
      <ServicesSection />

      {/* Dynamic island — streamed at request time */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <DynamicReviews />
      </Suspense>
    </main>
  );
}
```

### SSR (Server-Side Rendering)

```typescript
// Force dynamic rendering — runs on every request
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Runs fresh on every request
  const leads = await getRecentLeads();
  return <LeadDashboard leads={leads} />;
}
```

---

## `use cache` Directive (Next.js 16)

The `use cache` directive allows granular caching of individual functions without making an entire page static:

```typescript
// Cache a specific data fetch for 5 minutes
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

async function getTenantConfig(tenantId: string) {
  'use cache';
  cacheTag(`tenant:${tenantId}`);
  cacheLife('5m');

  return db.from('tenants').select('config').eq('id', tenantId).single();
}
```

---

## References

- Next.js 16 Rendering Modes — https://nextjs.org/docs/app/building-your-application/rendering
- Next.js PPR Documentation — https://nextjs.org/docs/app/api-reference/config/next-config-js/ppr
- Next.js `use cache` Directive — https://nextjs.org/docs/app/api-reference/directives/use-cache
- Next.js 16 Performance Guide — https://www.digitalapplied.com/blog/nextjs-16-performance-server-components-guide

---
