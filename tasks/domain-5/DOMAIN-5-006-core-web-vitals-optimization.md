---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-006
title: 'Core Web Vitals optimization (LCP, INP, CLS)'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-006-core-web-vitals-optimization
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-006 · Core Web Vitals optimization (LCP, INP, CLS)

## Objective

Implement Core Web Vitals optimization following section 5.6 specification with LCP (<2.5s), INP (<200ms), and CLS (<0.1) targets through font optimization, image optimization, and interaction performance improvements.

---

## Context

**Documentation Reference:**

- Nextjs 16 Documentation: `docs/guides/frontend/nextjs-16-documentation.md` ✅ COMPLETED
- React 19 Documentation: `docs/guides/frontend/react-19-documentation.md` ✅ COMPLETED
- Core Web Vitals Optimization: `docs/guides/frontend/core-web-vitals-optimization.md` ✅ COMPLETED
- Performance Budgeting: `docs/guides/frontend/performance-budgeting.md` ✅ COMPLETED
- Bundle Size Budgets: `docs/guides/frontend/bundle-size-budgets.md` ✅ COMPLETED
- Rendering Decision Matrix: `docs/guides/frontend/rendering-decision-matrix.md` ✅ COMPLETED

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Performance optimization — Core Web Vitals implementation

**Related files:** Layout components, image components, font configuration, interaction handlers

**Dependencies:** Next.js 16, React 19, image optimization libraries, font loading strategies

**Prior work:** Basic performance setup exists but lacks comprehensive Core Web Vitals optimization

**Constraints:** Must follow section 5.6 specification with 2026 Core Web Vitals targets

---

## Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| Performance  | Core Web Vitals optimization               |
| Images       | Next.js Image optimization with AVIF/WebP  |
| Fonts        | Google Fonts with preload and display swap |
| Interactions | React startTransition and Scheduler        |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement Core Web Vitals optimization following section 5.6 specification
- [ ] **[Agent]** Optimize LCP with font preloading and image priority loading
- [ ] **[Agent]** Optimize INP with startTransition and non-blocking interactions
- [ ] **[Agent]** Optimize CLS with explicit dimensions and reserve space
- [ ] **[Agent]** Add DNS prefetch and preconnect for third-party resources
- [ ] **[Agent]** Implement responsive image optimization with proper sizing
- [ ] **[Agent]** Test Core Web Vitals metrics with Lighthouse
- [ ] **[Human]** Verify optimization meets 2026 Core Web Vitals targets

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.6 specification** — Extract Core Web Vitals optimization requirements
- [ ] **[Agent]** **Optimize font loading** — Add preload, display swap, and font optimization
- [ ] **[Agent]** **Optimize image loading** — Add priority, fetchPriority, and proper dimensions
- [ ] **[Agent]** **Optimize interactions** — Implement startTransition for non-blocking updates
- [ ] **[Agent]** **Add resource hints** — DNS prefetch and preconnect for third-party resources
- [ ] **[Agent]** **Prevent layout shifts** — Add explicit dimensions and reserve space
- [ ] **[Agent]** **Test Core Web Vitals** — Validate LCP, INP, CLS targets
- [ ] **[Agent]** **Add monitoring** — Track Core Web Vitals metrics

> ⚠️ **Agent Question**: Ask human before proceeding if any existing performance optimizations need migration.

---

## Commands

```bash
# Test Core Web Vitals
lighthouse http://localhost:3000/ --output=json --output-path=lighthouse-report.json

# Test font loading
curl -I http://localhost:3000/ | grep -i font

# Test image optimization
curl -I http://localhost:3000/_next/image?url=...&w=1200&q=85

# Test interaction performance
curl -w "%{time_total}\n" -o /dev/null -s http://localhost:3000/
```

---

## Code Style

```typescript
// ✅ Correct — Core Web Vitals optimization following section 5.6
// sites/*/src/app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

// Font optimization: preload, no FOIT/FOUT
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  weight: ['400', '700'],
});

// In page component: preload LCP image
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preload LCP image (hero image) */}
        <link
          rel="preload"
          as="image"
          href="/hero.avif"
          type="image/avif"
          fetchPriority="high"
        />
        {/* DNS prefetch for third-party resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

// ============================================================================
// HERO IMAGE: Priority + explicit dimensions = no CLS, faster LCP
// ============================================================================

import Image from 'next/image';

export function HeroSection({ backgroundImage }: { backgroundImage: string }) {
  return (
    <section className="relative h-screen">
      <Image
        src={backgroundImage}
        alt="Law office interior showing professional environment"
        fill
        priority // Preloads the image (LCP element)
        fetchPriority="high"
        quality={85}
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}

// ============================================================================
// INTERACTION OPTIMIZATION: INP < 200ms
// ============================================================================

import { startTransition } from 'react';

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Wrap expensive state update in startTransition
    // This tells React it's non-urgent — keep UI responsive
    startTransition(() => {
      const filtered = allLeads.filter((lead) =>
        lead.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    });
  };

  return (
    <div>
      <input onChange={handleSearch} aria-label="Search leads" />
      <Suspense fallback={<ResultsSkeleton />}>
        {results.map((r) => <ResultCard key={r.id} result={r} />)}
      </Suspense>
    </div>
  );
}

// ============================================================================
// LAYOUT SHIFT PREVENTION: CLS < 0.1
// ============================================================================

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      {/* Reserve space for image to prevent CLS */}
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Content below image */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}

// ============================================================================
// PERFORMANCE MONITORING: Core Web Vitals tracking
// ============================================================================

'use client';

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}

export function useWebVitals() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);
}

// ============================================================================
// RESOURCE HINTS: Third-party optimization
// ============================================================================

export function ResourceHints() {
  return (
    <>
      {/* DNS prefetch for analytics */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Preconnect for fonts */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Preload critical CSS */}
      <link rel="preload" href="/styles/critical.css" as="style" />

      {/* Prefetch next page */}
      <link rel="prefetch" href="/about" />
    </>
  );
}
```

**Core Web Vitals optimization principles:**

- **LCP (<2.5s)**: Optimize largest contentful paint with font preloading and image priority
- **INP (<200ms)**: Optimize interaction to next paint with startTransition and non-blocking updates
- **CLS (<0.1)**: Prevent cumulative layout shift with explicit dimensions and reserved space
- **Resource hints**: Use DNS prefetch, preconnect, and preload for third-party resources
- **Image optimization**: Use Next.js Image with proper sizing and formats (AVIF > WebP)
- **Font optimization**: Preload fonts with display swap to prevent FOIT/FOUT

---

## Boundaries

| Tier             | Scope                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.6 specification; optimize for Core Web Vitals targets; implement resource hints; prevent layout shifts; optimize interactions |
| ⚠️ **Ask first** | Changing existing image optimization; modifying font loading strategies; updating interaction patterns                                         |
| 🚫 **Never**     | Skip Core Web Vitals optimization; ignore layout shift prevention; use blocking interactions; skip resource hints for third-party resources    |

---

## Success Verification

- [ ] **[Agent]** Test LCP optimization — LCP < 2.5s target achieved
- [ ] **[Agent]** Verify INP optimization — INP < 200ms target achieved
- [ ] **[Agent]** Test CLS prevention — CLS < 0.1 target achieved
- [ ] **[Agent]** Verify resource hints — Third-party resources load efficiently
- [ ] **[Agent]** Test image optimization — Images load with proper formats and sizing
- [ ] **[Agent]** Verify font optimization — Fonts load without FOIT/FOUT
- [ ] **[Human]** Test with Lighthouse — Core Web Vitals score > 90
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Image loading**: Ensure proper aspect ratios to prevent layout shifts
- **Font loading**: Balance preload with page load performance
- **Interaction performance**: Monitor startTransition effectiveness
- **Third-party resources**: Coordinate resource hints with actual usage
- **Mobile performance**: Ensure Core Web Vitals targets are met on mobile devices
- **Network conditions**: Test performance on slow connections

---

## Out of Scope

- Bundle size optimization (handled in separate task)
- PPR optimization (handled in separate tasks)
- React Compiler optimization (handled in separate task)
- Lighthouse CI configuration (handled in separate task)

---

## References

- [Section 5.6 LCP, INP, CLS Optimization](docs/plan/domain-5/5.6-lcp-inp-cls-optimization.md)
- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [Core Web Vitals Documentation](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
