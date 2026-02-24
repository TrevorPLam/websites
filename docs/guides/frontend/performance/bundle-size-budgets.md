# Bundle Size Budgets

> **Reference Documentation — February 2026**

## Overview

Bundle size budgets prevent unintentional performance regressions from landing in production. The budget system has two layers: `size-limit` (enforces hard byte limits per route) and `@next/bundle-analyzer` (visual treemap for investigation). Both run in CI. [catchmetrics](http://www.catchmetrics.io/blog/reducing-nextjs-bundle-size-with-nextjs-bundle-analyzer)

---

## `size-limit` Configuration

```typescript
// .size-limit.ts (repo root)
const config = [
  // ── Marketing site (SEO-critical — hard limits) ──────────────────────────
  {
    name: 'Marketing: Homepage first-load JS',
    path: '.next/static/chunks/pages/index.js',
    limit: '85 KB',
    gzip: true,
  },
  {
    name: 'Marketing: Service area page',
    path: '.next/static/chunks/pages/service-area/**/*.js',
    limit: '60 KB',
    gzip: true,
  },
  {
    name: 'Marketing: Contact page',
    path: '.next/static/chunks/pages/contact.js',
    limit: '50 KB',
    gzip: true,
  },

  // ── Framework chunks ─────────────────────────────────────────────────────
  {
    name: 'React + Next.js runtime',
    path: '.next/static/chunks/framework-*.js',
    limit: '50 KB',
    gzip: true,
  },

  // ── Portal (authenticated — softer limits) ────────────────────────────────
  {
    name: 'Portal: Dashboard first-load JS',
    path: '.next/static/chunks/pages/dashboard/index.js',
    limit: '120 KB',
    gzip: true,
  },
];

export default config;
```

---

## Bundle Analyzer Integration

```typescript
// packages/config/src/next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// Usage:
// ANALYZE=true pnpm --filter marketing build
// Open .next/analyze/client.html to inspect treemap
```

---

## `optimizePackageImports` — Tree-Shaking Enforcement

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react', // Without this: entire icon library ships (500+ icons)
      '@radix-ui/react-icons',
      'date-fns', // Without this: entire date-fns tree ships
      'lodash-es',
    ],
  },
};
```

**Impact:** `lucide-react` without `optimizePackageImports` adds ~180 KB gzip. With it: ~2 KB per icon used. [dev](https://dev.to/gouranga-das-khulna/how-to-reduce-bundle-size-in-next-js-5fdl)

---

## Common Bundle Size Culprits

| Package                    | Default Size | Optimized                                     |
| -------------------------- | ------------ | --------------------------------------------- |
| `lucide-react` (all icons) | ~180 KB gzip | ~2 KB/icon with `optimizePackageImports`      |
| `date-fns` (full)          | ~75 KB gzip  | ~5–15 KB with tree-shaking                    |
| `@react-pdf/renderer`      | ~200 KB      | Lazy load in report routes only               |
| Recharts                   | ~120 KB      | Lazy load behind `dynamic(() => import(...))` |
| `moment.js`                | ~72 KB       | Replace with `date-fns` or `Temporal`         |

---

## References

- `@next/bundle-analyzer` — https://www.npmjs.com/package/@next/bundle-analyzer
- Next.js Package Bundling Guide — https://nextjs.org/docs/app/guides/package-bundling
- Reducing Bundle Size in Next.js — https://dev.to/gouranga-das-khulna/how-to-reduce-bundle-size-in-next-js-5fdl
- `size-limit` npm — https://github.com/ai/size-limit

---

Now I have enough context to generate all 5 Batch B documents at production depth. Here they are:

---

# `security-middleware-implementation.md`

> **Internal Template — customize as needed.**

```

```
