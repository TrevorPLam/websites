---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-002
title: 'Four-mode rendering decision matrix implementation'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-002-rendering-decision-matrix
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-002 · Four-mode rendering decision matrix implementation

## Objective

Implement four-mode rendering decision matrix following section 5.2 specification with PPR, SSR, SSG, and Edge SSR patterns for optimal performance based on page characteristics and data requirements.

---

## Context

**Codebase area:** Page components and routing — Rendering strategy implementation

**Related files:** Next.js configuration, page components, middleware, caching strategies

**Dependencies:** Next.js 16 PPR, React Server Components, existing page structure

**Prior work:** Basic page structure exists but lacks systematic rendering strategy

**Constraints:** Must follow section 5.2 specification with optimal performance patterns

---

## Tech Stack

| Layer       | Technology                                |
| ----------- | ----------------------------------------- |
| Rendering   | Next.js 16 PPR with cache components      |
| Patterns    | SSR, SSG, Edge SSR, PPR                   |
| Performance | Cache strategies, optimization techniques |
| Testing     | Rendering mode validation                 |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement four-mode rendering matrix following section 5.2 specification
- [ ] **[Agent]** Create PPR patterns for marketing homepages with static shell + dynamic content
- [ ] **[Agent]** Implement SSR patterns for user-specific pages (dashboards, portals)
- [ ] **[Agent]** Add SSG patterns for static content pages (legal, policy)
- [ ] **[Agent]** Implement Edge SSR for dynamic content with low latency requirements
- [ ] **[Agent]** Create rendering mode decision helper functions
- [ ] **[Agent]** Add cache duration strategies for each rendering mode
- [ ] **[Agent]** Test all rendering modes with performance validation
- [ ] **[Human]** Verify matrix follows section 5.2 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.2 specification** — Extract rendering mode rules and patterns
- [ ] **[Agent]** **Create rendering decision helper** — Implement logic for mode selection
- [ ] **[Agent]** **Implement PPR patterns** — Static shell + dynamic zones for marketing pages
- [ ] **[Agent]** **Add SSR patterns** — User-specific pages with no caching
- [ ] **[Agent]** **Create SSG patterns** — Static content with generateStaticParams
- [ ] **[Agent]** **Implement Edge SSR patterns** — Low latency dynamic content
- [ ] **[Agent]** **Add cache strategies** — Optimize cache durations per mode
- [ ] **[Agent]** **Create validation tests** — Ensure correct rendering mode selection

> ⚠️ **Agent Question**: Ask human before proceeding if any existing pages need migration to new rendering patterns.

---

## Commands

```bash
# Test rendering modes
pnpm build --filter="@repo/ui"
pnpm dev --filter="@repo/features"

# Test PPR functionality
curl -I http://localhost:3000/ # Check cache headers

# Test SSR pages
curl -I http://localhost:3000/dashboard

# Test SSG pages
curl -I http://localhost:3000/legal

# Test Edge SSR
curl -I http://localhost:3000/api/webhook
```

---

## Code Style

```typescript
// ✅ Correct — Rendering mode decision helper following section 5.2
import { cacheTag, cacheLife } from 'next/cache';

// ============================================================================
// RENDERING MODE DECISION MATRIX
// ============================================================================

type RenderingMode = 'ppr' | 'ssr' | 'ssg' | 'edge-ssr';

interface PageCharacteristics {
  hasUserData: boolean;
  changesFrequently: boolean;
  isInteractive: boolean;
  hasStaticContent: boolean;
  requiresLowLatency: boolean;
}

export function determineRenderingMode(characteristics: PageCharacteristics): RenderingMode {
  // Rule 1: Static content, no user data, rarely changes → SSG
  if (!characteristics.hasUserData &&
      !characteristics.changesFrequently &&
      !characteristics.isInteractive) {
    return 'ssg';
  }

  // Rule 2: Static shell + dynamic zones → PPR
  if (characteristics.hasStaticContent &&
      characteristics.isInteractive &&
      !characteristics.requiresLowLatency) {
    return 'ppr';
  }

  // Rule 3: User-specific, changes every request → SSR
  if (characteristics.hasUserData &&
      characteristics.changesFrequently) {
    return 'ssr';
  }

  // Rule 4: Low latency requirement → Edge SSR
  if (characteristics.requiresLowLatency) {
    return 'edge-ssr';
  }

  // Default: SSR for safety
  return 'ssr';
}

// ============================================================================
// PPR MARKETING PAGE TEMPLATE
// ============================================================================

export async function MarketingPage({ tenantId }: { tenantId: string }) {
  'use cache'; // Cache Component directive

  // Cache tagging for targeted revalidation
  cacheTag(`tenant:${tenantId}:homepage`);
  cacheLife('hours'); // 1h TTL, 24h stale-while-revalidate

  // Static shell content (cached)
  const content = await getMarketingContent(tenantId);

  return (
    <div>
      <HeroSection {...content.hero} />
      <ServicesSection services={content.services} />
      {/* Dynamic zone - not cached */}
      <Suspense fallback={<ContactFormSkeleton />}>
        <ContactFormWidget />
      </Suspense>
    </div>
  );
}

// ============================================================================
// SSR DASHBOARD PAGE TEMPLATE
// ============================================================================

export default async function DashboardPage() {
  // User-specific data, always fresh
  const user = await getCurrentUser();
  const data = await getDashboardData(user.id);

  return (
    <div>
      <h1>Welcome back, {user.name}!</h1>
      <DashboardContent data={data} />
    </div>
  );
}

// ============================================================================
// SSG LEGAL PAGE TEMPLATE
// ============================================================================

export async function generateStaticParams() {
  return [
    { slug: 'privacy-policy' },
    { slug: 'terms-of-service' },
    { slug: 'cookie-policy' },
  ];
}

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const content = await getLegalContent(params.slug);

  return (
    <div>
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </div>
  );
}

// ============================================================================
// EDGE SSR API HANDLER
// ============================================================================

export const config = {
  runtime: 'edge',
};

export default async function WebhookHandler(request: Request) {
  const data = await request.json();

  // Process webhook with lowest latency
  const result = await processWebhook(data);

  return Response.json(result);
}
```

**Rendering mode principles:**

- **PPR**: Static shell + dynamic zones for optimal performance
- **SSR**: User-specific content that must always be fresh
- **SSG**: Static content that never changes
- **Edge SSR**: Low latency requirements for API endpoints
- **Cache strategies**: Optimize cache duration based on content characteristics

---

## Boundaries

| Tier             | Scope                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.2 specification; implement all four rendering modes; optimize for performance; add proper caching strategies           |
| ⚠️ **Ask first** | Changing existing page rendering patterns; modifying cache strategies; updating deployment infrastructure                               |
| 🚫 **Never**     | Use inappropriate rendering mode for page characteristics; ignore performance optimization; skip caching strategies for dynamic content |

---

## Success Verification

- [ ] **[Agent]** Test PPR pages — Static shell cached, dynamic zones stream in
- [ ] **[Agent]** Test SSR pages — No caching, always fresh content
- [ ] **[Agent]** Test SSG pages — Static content, proper generation
- [ ] **[Agent]** Test Edge SSR — Low latency, proper runtime configuration
- [ ] **[Agent]** Verify cache strategies — Appropriate cache durations
- [ ] **[Agent]** Test decision matrix — Correct mode selection for all page types
- [ ] **[Human]** Test with real pages — Performance optimization verified
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **PPR cache invalidation**: Ensure proper revalidation when content changes
- **SSR performance**: Monitor server load for high-traffic user-specific pages
- **SSG build time**: Consider build time impact for large numbers of static pages
- **Edge SSR limitations**: Be aware of Edge runtime limitations and cold starts
- **Cache conflicts**: Ensure cache keys don't conflict between tenants

---

## Out of Scope

- Image optimization (handled in separate task)
- Bundle size optimization (handled in separate task)
- Core Web Vitals monitoring (handled in separate task)
- Lighthouse CI configuration (handled in separate task)

---

## References

- [Section 5.2 Four-Mode Rendering Decision Matrix](docs/plan/domain-5/5.2-four-mode-rendering-decision-matrix.md)
- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [Next.js PPR Documentation](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js Rendering Documentation](https://nextjs.org/docs/pages/building-your-application/rendering)
- [Edge Runtime Documentation](https://nextjs.org/docs/pages/api-reference/edge-runtime)
