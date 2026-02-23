---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-004
title: 'PPR marketing page template with streaming optimization'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-004-ppr-marketing-template
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-004 · PPR marketing page template with streaming optimization

## Objective

Implement PPR marketing page template following section 5.4 specification with static shell + streaming dynamic zones, A/B testing variants, and optimal Core Web Vitals performance.

---

## Context

**Codebase area:** Marketing page components — PPR template implementation

**Related files:** Page components, A/B testing system, marketing content management

**Dependencies:** Next.js 16 PPR, React Server Components, A/B testing infrastructure

**Prior work:** Basic marketing pages exist but lack PPR optimization and streaming patterns

**Constraints:** Must follow section 5.4 specification with optimal performance patterns

---

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Rendering   | Next.js 16 PPR with cache components    |
| Performance | Streaming, Core Web Vitals optimization |
| Testing     | A/B testing, performance validation     |
| Content     | Marketing content management system     |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement PPR marketing page template following section 5.4 specification
- [ ] **[Agent]** Create static shell with cache components for instant FCP
- [ ] **[Agent]** Add streaming dynamic zones for A/B testing variants
- [ ] **[Agent]** Implement phone number tracking and attribution
- [ ] **[Agent]** Add proper loading states and skeleton screens
- [ ] **[Agent]** Optimize for Core Web Vitals (LCP, INP, CLS)
- [ ] **[Agent]** Test streaming performance and user experience
- [ ] **[Human]** Verify template follows section 5.4 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.4 specification** — Extract PPR template requirements
- [ ] **[Agent]** **Create static shell component** — Implement cached marketing shell
- [ ] **[Agent]** **Add A/B testing variants** — Implement dynamic CTA and content variants
- [ ] **[Agent]** **Implement phone tracking** — Add attribution and dynamic phone numbers
- [ ] **[Agent]** **Create loading states** — Add skeleton screens for streaming content
- [ ] **[Agent]** **Optimize Core Web Vitals** — Ensure LCP, INP, CLS targets are met
- [ ] **[Agent]** **Test streaming performance** — Validate progressive enhancement
- [ ] **[Agent]** **Add performance monitoring** — Track Core Web Vitals metrics

> ⚠️ **Agent Question**: Ask human before proceeding if any existing marketing pages need migration to PPR template.

---

## Commands

```bash
# Test PPR marketing page
pnpm build --filter="@repo/ui"
pnpm dev --filter="@repo/features"

# Test A/B testing variants
curl -H "Cookie: ab_homepage-cta=variant-a" http://localhost:3000/
curl -H "Cookie: ab_homepage-cta=variant-b" http://localhost:3000/

# Test Core Web Vitals
lighthouse http://localhost:3000/ --output=json --output-path=lighthouse-report.json

# Test streaming performance
curl -w "%{time_total}\n" -o /dev/null -s http://localhost:3000/
```

---

## Code Style

```typescript
// ✅ Correct — PPR marketing page template following section 5.4
import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { cookies } from 'next/headers';

// ============================================================================
// STATIC SHELL: Cached, pre-rendered, instant first byte
// ============================================================================

async function PageShell({ tenantId }: { tenantId: string }) {
  'use cache';
  cacheTag(`tenant:${tenantId}:homepage`);
  cacheLife('hours'); // 1h TTL, 24h stale-while-revalidate

  return (
    <div data-brand={tenantId}>
      {/* Navigation is static — always in shell */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav aria-label="Main navigation">
          <a href="/" className="text-2xl font-bold text-primary">Apex HVAC</a>
          <ul role="list" className="hidden md:flex gap-6">
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero: static content, dynamic CTA variant loads via Suspense */}
      <section aria-labelledby="hero-heading">
        <h1 id="hero-heading">Plano's Trusted HVAC & Plumbing Experts</h1>
        <p>24/7 emergency service. Licensed, bonded, insured since 2010.</p>
        {/* CTA has A/B test variant — must be dynamic */}
      </section>

      {/* Static service cards */}
      <section aria-labelledby="services-heading">
        <h2 id="services-heading">Our Services</h2>
        {/* Service cards are static — no user data needed */}
      </section>
    </div>
  );
}

// ============================================================================
// DYNAMIC: A/B test variant (depends on cookie — can't be cached)
// ============================================================================

async function CTAVariant() {
  const cookieStore = await cookies();
  const variant = cookieStore.get('ab_homepage-cta')?.value ?? 'control';

  const ctaText = variant === 'variant-a'
    ? 'Get Your Free Estimate Now'
    : 'Schedule Service Today';

  return (
    <a
      href="/contact"
      className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold"
      aria-label={ctaText}
    >
      {ctaText}
    </a>
  );
}

// ============================================================================
// DYNAMIC: Phone click tracking (depends on session — can't be cached)
// ============================================================================

async function PhoneNumber({ tenantId }: { tenantId: string }) {
  // Phone numbers can be per-tenant and depend on UTM attribution
  return (
    <a
      href="tel:+14695553000"
      className="text-2xl font-bold text-primary"
      data-track="phone_click"
      data-tenant={tenantId}
      aria-label="Call Apex HVAC at (469) 555-3000"
    >
      (469) 555-3000
    </a>
  );
}

// ============================================================================
// LOADING STATES: Skeleton screens for streaming content
// ============================================================================

function CTASkeleton() {
  return (
    <div className="animate-pulse bg-primary rounded-lg h-12 w-48" aria-label="Loading CTA button" />
  );
}

function PhoneSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded h-8 w-32" aria-label="Loading phone number" />
  );
}

// ============================================================================
// PAGE EXPORT: Shell + streaming dynamic zones
// ============================================================================

export default async function HomePage() {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? '[home-services-client]';

  return (
    <main>
      {/* Static shell — cached, instant FCP */}
      <PageShell tenantId={tenantId} />

      {/* Dynamic zones — stream in after shell load */}
      <div className="mt-8 space-y-4">
        <Suspense fallback={<CTASkeleton />}>
          <CTAVariant />
        </Suspense>

        <Suspense fallback={<PhoneSkeleton />}>
          <PhoneNumber tenantId={tenantId} />
        </Suspense>
      </div>
    </main>
  );
}

// ============================================================================
// PERFORMANCE OPTIMIZATION: Core Web Vitals
// ============================================================================

// Add to layout.tsx for LCP optimization
export function generateMetadata({ params }: { params: { tenantId: string } }) {
  return {
    title: 'Apex HVAC - Plano\'s Trusted HVAC & Plumbing Experts',
    description: '24/7 emergency service. Licensed, bonded, insured since 2010.',
    openGraph: {
      title: 'Apex HVAC',
      description: 'Professional HVAC and plumbing services in Plano, TX',
      images: ['/og-image.jpg'],
    },
  };
}
```

**PPR template principles:**

- **Static shell caching**: Cache static marketing content for instant FCP
- **Streaming dynamic zones**: Use Suspense boundaries for user-specific content
- **A/B testing**: Implement variants in dynamic zones to avoid cache conflicts
- **Loading states**: Provide skeleton screens for optimal perceived performance
- **Core Web Vitals**: Optimize for LCP, INP, CLS targets
- **Progressive enhancement**: Ensure content loads progressively without layout shifts

---

## Boundaries

| Tier             | Scope                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.4 specification; implement PPR patterns; optimize for Core Web Vitals; add proper loading states; maintain streaming performance |
| ⚠️ **Ask first** | Changing existing marketing page structure; modifying A/B testing system; updating Core Web Vitals targets                                        |
| 🚫 **Never**     | Cache user-specific content; skip loading states; ignore performance optimization; break A/B testing functionality                                |

---

## Success Verification

- [ ] **[Agent]** Test PPR shell caching — Static content loads instantly
- [ ] **[Agent]** Verify streaming performance — Dynamic zones stream in properly
- [ ] **[Agent]** Test A/B testing variants — Different variants load correctly
- [ ] **[Agent]** Verify Core Web Vitals — LCP, INP, CLS targets are met
- [ ] **[Agent]** Test loading states — Skeleton screens work properly
- [ ] **[Agent]** Measure performance — FCP < 1.8s, INP < 200ms, CLS < 0.1
- [ ] **[Human]** Test with real users — User experience is optimal
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **A/B testing conflicts**: Ensure variants don't interfere with cache keys
- **Streaming performance**: Monitor dynamic zone loading times
- **Layout shifts**: Prevent CLS by reserving space for dynamic content
- **Cookie dependencies**: Handle cases where cookies are not available
- **Cache invalidation**: Ensure content updates trigger proper revalidation
- **Mobile performance**: Optimize for mobile Core Web Vitals targets

---

## Out of Scope

- Image optimization (handled in separate task)
- Bundle size optimization (handled in separate task)
- Core Web Vitals monitoring (handled in separate task)
- Lighthouse CI configuration (handled in separate task)

---

## References

- [Section 5.4 PPR Marketing Page Template](docs/plan/domain-5/5.4-ppr-marketing-page-template.md)
- [Section 5.3 Per-Tenant use cache Patterns](docs/plan/domain-5/5.3-per-tenant-use-cache-patterns.md)
- [Section 5.2 Four-Mode Rendering Decision Matrix](docs/plan/domain-5/5.2-four-mode-rendering-decision-matrix.md)
- [Next.js PPR Documentation](https://nextjs.org/docs/app/getting-started/cache-components)
- [Core Web Vitals Documentation](https://web.dev/vitals/)
