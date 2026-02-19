# Unified Route Registry — Architecture

**Last Updated:** 2026-02-15  
**Status:** Implemented (Task 0.25)  
**Location:** `clients/starter-template/lib/routes.ts`

---

## Overview

The route registry is the **single source of truth** for static page routes in the hair-salon template. Previously, two separate hardcoded lists existed — in `sitemap.ts` (16 pages) and `search.ts` (10 pages). When a route was added or removed, both files had to be updated independently, risking drift and bugs.

## Architecture

```
lib/routes.ts (STATIC_ROUTES[])
       │
       ├── getSitemapEntries(baseUrl) ──► app/sitemap.ts
       │
       └── getSearchEntries() ──────────► lib/search.ts ──► buildSearchIndex()
                                                              │
                                                              └── + getAllPosts() (blog)
                                                                   │
                                                                   ▼
                                                              getSearchIndex()
```

## Data Model

| Type              | Purpose                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `RouteEntry`      | Canonical route definition with path, sitemap metadata, and search metadata |
| `ChangeFrequency` | Sitemap.org values: `weekly`, `monthly`, `yearly`, etc.                     |
| `RouteSearchMeta` | Search index: id, title, description, tags                                  |

## Usage

### Sitemap Generation

```ts
// app/sitemap.ts
import { getSitemapEntries } from '@/lib/routes';

export default function sitemap() {
  const baseUrl = getPublicBaseUrl();
  const staticEntries = getSitemapEntries(baseUrl);
  const blogPages = getAllPosts().map(...);
  return [...staticEntries, ...blogPages];
}
```

### Search Index

```ts
// lib/search.ts
import { getSearchEntries } from '@/lib/routes';

const buildSearchIndex = cache(() => {
  const staticItems = getSearchEntries();
  const blogItems = getAllPosts().map(...);
  return [...staticItems, ...blogItems];
});
```

### Adding a New Route

1. Add a `RouteEntry` to `STATIC_ROUTES` in `lib/routes.ts`
2. Create the corresponding `app/<path>/page.tsx` if it doesn't exist
3. Sitemap and search index update automatically — no changes to sitemap.ts or search.ts

## Invariants

- All `path` values must match actual app directory routes
- Path format: leading slash, no trailing slash (except `/` for home)
- `changeFrequency` and `priority` follow [sitemaps.org](https://www.sitemaps.org/protocol.html)
- Routes without `search` metadata are included in sitemap but excluded from search index

## Future: Config-Driven Routing (Task 3.x)

The registry is designed as the foundation for config-driven routing. In the refactor:

- Routes may be derived from `site.config.ts` (navLinks, footer, etc.)
- Industry-specific route sets can be composed
- The same registry can feed breadcrumbs, 404 suggestions, and navigation components

## Related Files

- `clients/starter-template/lib/routes.ts` — Canonical registry
- `clients/starter-template/app/sitemap.ts` — Sitemap consumer
- `clients/starter-template/lib/search.ts` — Search index consumer
