<!--
/**
 * @file service-area-pages-engine.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for service area pages engine.
 * @entrypoints docs/guides/service-area-pages-engine.md
 * @exports service area pages engine
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

# service-area-pages-engine.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

Service area pages are programmatically generated landing pages targeting hyper-local search queries: `/service-area/plano-tx`, `/service-area/frisco-tx`. Each page is unique, SEO-optimized, and auto-generated from the tenant's `serviceAreas` config array — no manual content creation required. [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)

---

## Why Programmatic Service Area Pages?

A service business competing on "plumber near me" faces hundreds of competitors. On "emergency water heater replacement Allen TX" they may face zero. Each service area page captures a unique long-tail keyword cluster with: [kreativekommit](https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo)

- **Unique `<h1>`** — `"Plumbing Services in Allen, TX"`
- **City-specific `LocalBusiness` JSON-LD** with `areaServed` override
- **Page-specific metadata** with city in title and description
- **Internal links** to neighboring area pages (distributes link equity)
- **On-page trust signals** — licensed, insured, same-day service

---

## Route Architecture

```
apps/*/src/app/service-area/
├── [slug]/
│   └── page.tsx          ← Dynamic ISR route
└── page.tsx              ← Service areas index (links to all area pages)
```

### `generateStaticParams` Strategy

```typescript
// Seed top 10 areas per tenant at build time.
// All others: on-demand ISR via dynamicParams = true + cacheLife 24h.
export const dynamicParams = true;

export async function generateStaticParams() {
  const tenants = await db.from('tenants').select('config').eq('status', 'active');

  return (tenants.data ?? []).flatMap((tenant) => {
    const areas: string[] = (tenant.config as any)?.identity?.serviceAreas ?? [];
    return areas.slice(0, 10).map((area) => ({ slug: slugifyArea(area) }));
  });
}
```

This means 500 configured cities never bloat build time — they generate on first request and serve from cache thereafter. [nextjs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

---

## Slug Utilities

```typescript
// Bidirectional slug ↔ area name conversion
export function slugifyArea(area: string): string {
  return area
    .toLowerCase()
    .replace(/,\s*/g, '-') // "Plano, TX" → "plano-tx"
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function deslugifyArea(slug: string): string {
  const parts = slug.split('-');
  const US_STATES = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI' /* ... */];
  const last = parts[parts.length - 1]?.toUpperCase();

  if (US_STATES.includes(last ?? '')) {
    const city = parts
      .slice(0, -1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `${city}, ${last}`;
  }
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
```

---

## City-Specific JSON-LD Override

Each area page emits its own `LocalBusiness` schema with `areaServed` overridden to the specific city — not the full service area list. This prevents schema dilution and gives each page a stronger geo-relevance signal:

```typescript
const localSchema = {
  ...buildLocalBusinessSchema(config), // Base schema from Domain 23
  name: `${identity.siteName} — ${city}`,
  description: `Professional ${industry} in ${city}, ${state}.`,
  areaServed: [{ '@type': 'City', name: city }], // Override to single city
};
```

---

## Cache Invalidation

When a tenant removes a service area in their portal settings, the cached page must return `notFound()` instead of stale content:

```typescript
// packages/cache/src/invalidate-tenant.ts
import { revalidateTag } from 'next/cache';

export async function invalidateTenantServiceAreas(
  tenantId: string,
  removedSlugs: string[]
): Promise<void> {
  for (const slug of removedSlugs) {
    revalidateTag(`tenant:${tenantId}:service-area:${slug}`);
  }
  revalidateTag(`tenant:${tenantId}:sitemap`); // Sitemap must also update
}
```

**Guard:** Every area page calls `notFound()` if the slug is not in the current `serviceAreas` config. Without this, a removed area would serve a cached 200 with stale content — wasting Googlebot crawl budget on thin pages.

---

## Internal Linking Strategy

Linking between area pages distributes link equity and makes the site crawlable without a sitemap: [mgphq](https://www.mgphq.com/blog/nextjs-programmatic-seo-isr-guide)

```typescript
function RelatedServiceAreas({ currentSlug, areas, siteUrl }) {
  const others = areas.filter((a) => slugifyArea(a) !== currentSlug).slice(0, 8);

  return (
    <nav aria-label="Other service areas">
      <h2>Also Serving:</h2>
      <ul>
        {others.map((area) => (
          <li key={area}>
            <a href={`${siteUrl}/service-area/${slugifyArea(area)}`}>{area}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## SEO Checklist per Page

- ✅ Unique `<title>` containing city + industry + business name
- ✅ Unique `<meta name="description">` mentioning city, state, and phone
- ✅ `<h1>` containing city name (verbatim match to search query)
- ✅ `LocalBusiness` JSON-LD with single-city `areaServed`
- ✅ `BreadcrumbList` JSON-LD: Home → Service Areas → [City]
- ✅ Canonical URL pointing to `https://domain.com/service-area/[slug]`
- ✅ Internal links to 6–8 neighboring area pages
- ✅ CTA section with phone number and contact form
- ✅ `notFound()` for any slug not in `serviceAreas` config

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Next.js `generateStaticParams` — https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Programmatic SEO with Next.js ISR — https://www.mgphq.com/blog/nextjs-programmatic-seo-isr-guide
- Multi-Tenant SEO with Next.js — https://www.buildwithmatija.com/blog/multi-tenant-seo-payload-nextjs-guide
- SSR in Next.js for Local SEO — https://kreativekommit.com/guides/2025/07/ssr-nextjs-local-seo


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
