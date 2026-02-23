---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-003
title: 'Per-tenant use cache patterns with PPR optimization'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-003-per-tenant-cache-patterns
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-003 · Per-tenant use cache patterns with PPR optimization

## Objective

Implement per-tenant `use cache` patterns following section 5.3 specification with PPR optimization, cache tagging, lifecycle management, and revalidation strategies for optimal performance.

---

## Context

**Codebase area:** Page components and caching utilities — PPR cache implementation

**Related files:** Next.js configuration, page components, content management system

**Dependencies:** Next.js 16 PPR, React Server Components, existing content APIs

**Prior work:** Basic caching may exist but lacks per-tenant PPR patterns

**Constraints:** Must follow section 5.3 specification with proper cache tagging and lifecycle management

---

## Tech Stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Caching     | Next.js 16 PPR with use cache directive  |
| Performance | Cache tagging, lifecycle management      |
| Content     | CMS integration, content APIs            |
| Testing     | Cache validation and performance testing |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement per-tenant use cache patterns following section 5.3 specification
- [ ] **[Agent]** Create cache tagging strategies for targeted revalidation
- [ ] **[Agent]** Add cache lifecycle management (hours, days, stale-while-revalidate)
- [ ] **[Agent]** Implement static shell + dynamic zone patterns for PPR
- [ ] **[Agent]** Add revalidation triggers for content updates
- [ ] **[Agent]** Create cache invalidation utilities for CMS webhooks
- [ ] **[Agent]** Test cache performance with various scenarios
- [ ] **[Human]** Verify patterns follow section 5.3 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.3 specification** — Extract PPR cache patterns and strategies
- [ ] **[Agent]** **Create cache tagging utilities** — Implement per-tenant cache tagging system
- [ ] **[Agent]** **Implement cache lifecycle management** — Add hours/days/stale-while-revalidate patterns
- [ ] **[Agent]** **Create PPR shell patterns** — Static components with use cache directive
- [ ] **[Agent]** **Add dynamic zone patterns** — Suspense boundaries for dynamic content
- [ ] **[Agent]** **Implement revalidation triggers** — CMS webhook integration
- [ ] **[Agent]** **Create cache validation utilities** — Test cache hit rates and performance
- [ ] **[Agent]** **Test with real content** — Verify cache behavior with actual CMS data

> ⚠️ **Agent Question**: Ask human before proceeding if any existing caching needs migration to PPR patterns.

---

## Commands

```bash
# Test PPR cache functionality
pnpm build --filter="@repo/ui"
pnpm dev --filter="@repo/features"

# Test cache invalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"tags": ["tenant:homepage:content"]}' \
  http://localhost:3000/api/revalidate

# Test cache performance
curl -w "%{time_total}\n" -o /dev/null -s http://localhost:3000/

# Verify cache headers
curl -I http://localhost:3000/
```

---

## Code Style

```typescript
// ✅ Correct — Per-tenant PPR cache patterns following section 5.3
import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { getHomePageContent } from '@/shared/api/content';
import { ContactFormWidget } from '@/widgets/contact-form-widget';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import config from '../../../../../../site.config'; // site.config.ts

// ============================================================================
// STATIC SHELL (Cache Component — cached indefinitely until revalidated)
// ============================================================================

async function HomePageShell({ tenantId }: { tenantId: string }) {
  'use cache'; // Marks this component as a Cache Component (Next.js 16)

  // Cache tagging: allows targeted revalidation
  cacheTag(`tenant:${tenantId}:homepage`);
  cacheTag(`tenant:${tenantId}:content`);

  // Cache lifetime: days profile = 24h TTL, 7-day stale-while-revalidate
  cacheLife('days');

  const content = await getHomePageContent(tenantId);

  return (
    <>
      <HeroSection
        headline={content.headline}
        subheadline={content.subheadline}
        ctaText={content.ctaText}
        ctaUrl={content.ctaUrl}
        backgroundImage={content.backgroundImage}
      />
      <ServicesSection services={content.services} />
    </>
  );
}

// ============================================================================
// DYNAMIC ZONE (Suspense boundary — rendered per-request)
// This prevents the contact form's CSRF token, A/B variant assignment,
// and user session from being cached.
// ============================================================================

function ContactFormZone() {
  // No 'use cache' here — this renders dynamically on every request
  return (
    <Suspense fallback={<ContactFormSkeleton />}>
      <ContactFormWidget />
    </Suspense>
  );
}

function ContactFormSkeleton() {
  return (
    <div
      className="animate-pulse bg-gray-100 rounded-lg h-96 w-full"
      aria-label="Loading contact form"
      aria-busy="true"
    />
  );
}

// ============================================================================
// PAGE COMPONENT
// The shell is cached; the dynamic zone streams in after initial load.
// Result: Lighthouse FCP = instant (cached shell), TTI = fast (dynamic form streams in)
// ============================================================================
export default async function HomePage() {
  // tenantId from headers (set by middleware — Domain 4 §4.2)
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? config.identity.tenantId;

  return (
    <main>
      <HomePageShell tenantId={tenantId} />
      <ContactFormZone />
    </main>
  );
}

// ============================================================================
// REVALIDATION TRIGGERS (CMS webhook handlers)
// ============================================================================

// packages/cms-adapter/src/sanity.ts (called by Sanity webhook)
import { revalidateTag } from 'next/cache';

export async function handleSanityWebhook(payload: SanityWebhookPayload) {
  const { _type, tenantId } = payload;

  // Revalidate specific tenant content
  revalidateTag(`tenant:${tenantId}:homepage`);
  revalidateTag(`tenant:${tenantId}:content`);

  // Revalidate all content for global changes
  if (_type === 'content') {
    revalidateTag('content');
  }
}

// packages/cms-adapter/src/content-api.ts
export async function updateContent(tenantId: string, content: ContentUpdate) {
  // Update content in database
  await updateContentInDatabase(tenantId, content);

  // Trigger cache revalidation
  revalidateTag(`tenant:${tenantId}:content`);

  return content;
}
```

**Cache patterns principles:**

- **Static shell caching**: Cache static components with `use cache` directive for instant FCP
- **Dynamic zones**: Use Suspense boundaries for user-specific or frequently changing content
- **Cache tagging**: Implement granular cache tagging for targeted revalidation
- **Lifecycle management**: Use appropriate cache lifetimes based on content change frequency
- **Revalidation**: Trigger cache invalidation when content updates occur
- **Performance optimization**: Balance cache hit rates with content freshness requirements

---

## Boundaries

| Tier             | Scope                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.3 specification; implement PPR patterns; add proper cache tagging; optimize for performance; maintain cache consistency |
| ⚠️ **Ask first** | Changing existing caching strategies; modifying content update workflows; updating cache invalidation patterns                           |
| 🚫 **Never**     | Cache user-specific data; skip cache tagging for dynamic content; ignore revalidation triggers; break cache consistency across tenants   |

---

## Success Verification

- [ ] **[Agent]** Test PPR cache hit rates — Static components cached properly
- [ ] **[Agent]** Verify dynamic zones — Dynamic content streams in after shell load
- [ ] **[Agent]** Test cache tagging — Targeted revalidation works correctly
- [ ] **[Agent]** Verify cache lifetimes — Appropriate TTL for content types
- [ ] **[Agent]** Test revalidation triggers — CMS updates trigger cache invalidation
- [ ] **[Agent]** Measure performance — FCP and TTI improvements verified
- [ ] **[Human]** Test with real CMS updates — Cache behavior works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Cache key conflicts**: Ensure cache keys are unique per tenant and content type
- **Cache invalidation timing**: Coordinate revalidation with content update workflows
- **Dynamic zone performance**: Monitor streaming performance for dynamic content
- **Memory usage**: Monitor cache memory usage with large static components
- **Cache staleness**: Balance cache freshness with performance requirements
- **Multi-tenant isolation**: Ensure cache keys don't conflict between tenants

---

## Out of Scope

- Image optimization (handled in separate task)
- Bundle size optimization (handled in separate task)
- Core Web Vitals monitoring (handled in separate task)
- Lighthouse CI configuration (handled in separate task)

---

## References

- [Section 5.3 Per-Tenant use cache Patterns](docs/plan/domain-5/5.3-per-tenant-use-cache-patterns.md)
- [Section 5.2 Four-Mode Rendering Decision Matrix](docs/plan/domain-5/5.2-four-mode-rendering-decision-matrix.md)
- [Section 5.1 Complete next.config.ts](docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [Next.js PPR Documentation](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js Cache Documentation](https://nextjs.org/docs/app/building-your-application/caching)
