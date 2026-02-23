---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-008
title: 'Edge A/B testing zero-CLS implementation'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-008-edge-ab-testing-zero-cls
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-008 · Edge A/B testing zero-CLS implementation

## Objective

Implement comprehensive edge A/B testing system with zero Cumulative Layout Shift (CLS) following section 8.9 specification, enabling high-performance experiments through middleware-based variant assignment and edge rewrites.

---

## Context

**Codebase area:** Analytics A/B testing — Edge experimentation

**Related files:** Middleware integration, experiment definitions, analytics tracking

**Dependencies**: Next.js middleware, Edge Config, Upstash Redis, Tinybird analytics

**Prior work**: Basic analytics exists but lacks comprehensive A/B testing infrastructure

**Constraints:** Must follow section 8.9 specification with zero-CLS edge rewrites

---

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| A/B Testing | Edge middleware with cookie-based assignment |
| Analytics   | Tinybird event streaming                     |
| Storage     | Upstash Redis for experiment state           |
| Experiments | TypeScript-based experiment definitions      |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement experiment definition system following section 8.9 specification
- [ ] **[Agent]** Create edge middleware integration with zero-CLS rewrites
- [ ] **[Agent]** Add variant assignment with cookie persistence
- [ ] **[Agent]** Implement analytics tracking for experiment assignments
- [ ] **[Agent]** Create client-side variant reading hooks
- [ ] **[Agent]** Test A/B testing workflow end-to-end
- [ ] **[Human]** Verify zero-CLS behavior and proper variant assignment

---

## Implementation Plan

- [ ] **[Agent]** **Create experiment definitions** — Implement typed experiment configuration
- [ ] **[Agent]** **Add edge middleware** — Implement variant assignment and rewrites
- [ ] **[Agent]** **Create analytics tracking** — Add Tinybird event streaming
- [ ] **[Agent]** **Implement client hooks** — Add useVariant hook for components
- [ ] **[Agent]** **Add tenant-specific experiments** — Enable per-tenant experiment targeting
- [ ] **[Agent]** **Test zero-CLS behavior** — Verify no layout shift on variant assignment
- [ ] **[Agent]** **Add experiment management** — Create enable/disable controls

> ⚠️ **Agent Question**: Ask human before proceeding if existing middleware needs modification for A/B testing integration.

---

## Commands

```bash
# Test experiment assignment
curl "http://localhost:3000/" -c cookies.txt
curl "http://localhost:3000/" -b cookies.txt -v

# Test variant assignment
curl "http://localhost:3000/" -H "Cookie: ab_homepage-cta-text=variant-a"

# Test edge middleware behavior
curl "http://localhost:3000/contact" -I

# Test analytics tracking
curl -X POST "http://localhost:3000/api/track/experiment" \
  -H "Content-Type: application/json" \
  -d '{"experimentId":"homepage-cta-text","variantId":"variant-a","tenantId":"test-tenant"}'

# Test experiment configuration
node -e "
import { EXPERIMENTS } from '@repo/analytics/ab-testing';
console.log('Available experiments:', Object.keys(EXPERIMENTS));
console.log('Homepage CTA variants:', EXPERIMENTS['homepage-cta-text'].variants);
"

# Test variant hook in component
pnpm test --filter="@repo/analytics" -- --testNamePattern="useVariant"
```

---

## Code Style

```typescript
// ✅ Correct — Edge A/B testing following section 8.9
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export type Experiment = {
  id: string;
  name: string;
  variants: Array<{ id: string; weight: number; path?: string }>;
  trafficAllocation: number; // 0–1 (1 = 100% of traffic)
  enabled: boolean;
  tenantIds?: string[]; // null = all tenants; array = specific tenants only
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'homepage-cta-text',
    name: 'Homepage CTA Button Text',
    variants: [
      { id: 'control', weight: 0.5 }, // "Schedule Service Today"
      { id: 'variant-a', weight: 0.5 }, // "Get Your Free Estimate Now"
    ],
    trafficAllocation: 1.0, // 100% of traffic
    enabled: true,
  },
  {
    id: 'contact-form-layout',
    name: 'Contact Form: Vertical vs Horizontal',
    variants: [
      { id: 'vertical', weight: 0.5, path: '/contact' },
      { id: 'horizontal', weight: 0.5, path: '/contact-v2' },
    ],
    trafficAllocation: 0.5, // 50% of traffic
    enabled: true,
  },
];

export async function applyABTests(
  request: NextRequest,
  response: NextResponse,
  tenantId: string
): Promise<NextResponse> {
  let modifiedResponse = response;

  for (const experiment of EXPERIMENTS) {
    // Skip experiments not targeting this tenant
    if (experiment.tenantIds && !experiment.tenantIds.includes(tenantId)) {
      continue;
    }

    if (!experiment.enabled) continue;

    const cookieName = `ab_${experiment.id}`;
    const existingVariant = request.cookies.get(cookieName)?.value;

    // Already assigned — use existing assignment
    const assignedVariant = existingVariant ?? pickVariant(experiment);

    // Set cookie for persistence (edge-set cookies are instant — no FOUC)
    modifiedResponse.cookies.set(cookieName, assignedVariant, {
      maxAge: 60 * 60 * 24 * 90, // 90-day assignment persistence
      httpOnly: false, // Client-readable (for analytics attribution)
      sameSite: 'lax',
      path: '/',
    });

    // Path rewrite for layout variants (zero-CLS — happens before rendering)
    const variant = experiment.variants.find((v) => v.id === assignedVariant);
    if (variant?.path && !existingVariant) {
      const url = request.nextUrl.clone();
      const currentVariantPath = experiment.variants.find(
        (v) => request.nextUrl.pathname === v.path
      );

      // Only rewrite if on the default/control path
      if (!currentVariantPath || currentVariantPath.id === 'control') {
        url.pathname = variant.path;
        modifiedResponse = NextResponse.rewrite(url);
      }
    }

    // Track assignment event to Tinybird (fire-and-forget)
    if (!existingVariant) {
      trackExperimentAssignment({
        tenantId,
        experimentId: experiment.id,
        variantId: assignedVariant,
        sessionId: request.cookies.get('session_id')?.value ?? 'unknown',
      }).catch(() => {
        // Non-blocking — never let analytics fail the request
      });
    }
  }

  return modifiedResponse;
}

// ❌ Incorrect — Client-side only assignment, causes layout shift
('use client');
import { useState, useEffect } from 'react';

export function useABTest(experimentId: string) {
  const [variant, setVariant] = useState('control');

  useEffect(() => {
    // This causes layout shift because variant is determined after render
    const assignedVariant = Math.random() > 0.5 ? 'variant-a' : 'control';
    setVariant(assignedVariant);
  }, [experimentId]);

  return variant;
}
```

**Naming conventions:**

- Types: `PascalCase` — `Experiment`, `Variant`
- Functions: `camelCase` — `applyABTests`, `pickVariant`, `trackExperimentAssignment`
- Constants: `UPPER_SNAKE_CASE` — `EXPERIMENTS`, `COOKIE_PREFIX`
- Hooks: `camelCase` — `useVariant`, `useExperiment`

---

## Boundaries

| Tier             | Scope                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Create edge middleware; implement zero-CLS rewrites; add analytics tracking; follow section 8.9 specification |
| ⚠️ **Ask first** | Modifying existing middleware; adding new analytics events; changing experiment assignment logic              |
| 🚫 **Never**     | Use client-side variant assignment; cause layout shift; bypass edge middleware; ignore tenant isolation       |

---

## Success Verification

- [ ] **[Agent]** Test experiment assignment — Variants assigned correctly with persistence
- [ ] **[Agent]** Verify zero-CLS behavior — No layout shift on variant assignment
- [ ] **[Agent]** Test edge rewrites — Path variants work before rendering
- [ ] **[Agent]** Verify analytics tracking — Assignment events sent to Tinybird
- [ ] **[Agent]** Test tenant targeting — Experiments respect tenant filters
- [ ] **[Agent]** Test client hooks — useVariant reads correct variants
- [ ] **[Agent]** Run integration tests — All A/B testing tests pass
- [ ] **[Human]** Verify experiment management — Enable/disable controls work
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Cookie persistence**: Use 90-day expiration for consistent user experience
- **Edge rewrites**: Only rewrite on first visit, not on subsequent requests
- **Traffic allocation**: Implement proper weighted random assignment
- **Tenant isolation**: Respect tenant-specific experiment targeting
- **Analytics reliability**: Use fire-and-forget pattern to never block requests
- **Variant consistency**: Ensure same user gets same variant across sessions
- **Path conflicts**: Avoid conflicting rewrite paths between experiments
- **Performance**: Keep middleware execution under 50ms for edge performance

---

## Out of Scope

- Visual A/B testing editor or UI
- Multi-armed bandit testing algorithms
- Advanced statistical analysis
- Real-time experiment results dashboard
- Feature flag management system

---

## References

- [Section 8.9 Edge A/B Testing (Zero-CLS)](docs/plan/domain-8/8.9-edge-ab-testing-zero-cls.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Zero-CLS A/B Tests with Next.js and Vercel Edge Config](https://vercel.com/blog/zero-cls-experiments-nextjs-edge-config)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Tinybird Analytics Documentation](https://www.tinybird.co/docs)
