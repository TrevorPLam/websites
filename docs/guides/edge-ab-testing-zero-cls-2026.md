# Edge A/B Testing with Zero Cumulative Layout Shift (CLS) 2026 Guide

## Overview

Edge A/B testing with Zero CLS is a high-performance experimentation approach that eliminates layout shift by assigning variants at the edge before rendering. This method uses Next.js middleware and edge rewrites to ensure instant page loads with optimal user experience.

## Key Concepts

### What is Zero-CLS A/B Testing?

Zero-CLS A/B testing prevents Cumulative Layout Shift by:

- **Edge-based variant assignment** before page rendering
- **Cookie persistence** for consistent user experience
- **Path rewrites** instead of client-side variant switching
- **Instant page loads** without layout shift

### Why Edge Testing Matters

Traditional client-side A/B testing causes layout shift because:

- Variant is determined after initial page load
- Content changes cause visual reflow
- Performance metrics are negatively impacted
- User experience suffers from flickering

Edge testing solves these issues by determining variants before rendering.

## Architecture Overview

### Components

1. **Experiment Definitions** - TypeScript-based experiment configuration
2. **Edge Middleware** - Variant assignment and path rewrites
3. **Analytics Tracking** - Assignment event streaming
4. **Client Hooks** - Variant reading in components

### Data Flow

```
User Request → Edge Middleware → Variant Assignment → Cookie Set → Path Rewrite → Page Render → Analytics Track
```

## Implementation Guide

### 1. Experiment Definitions

Create typed experiment configurations:

```typescript
// packages/analytics/src/ab-testing.ts
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
```

### 2. Edge Middleware Implementation

Implement variant assignment and rewrites:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { applyABTests } from '@repo/analytics/ab-testing';

export async function middleware(request: NextRequest) {
  // Extract tenant ID from request
  const tenantId = extractTenantId(request);

  // Create base response
  let response = NextResponse.next();

  // Apply A/B tests
  response = await applyABTests(request, response, tenantId);

  return response;
}

// packages/analytics/src/ab-testing.ts
const COOKIE_PREFIX = 'ab_';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90-day assignment persistence

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

    const cookieName = `${COOKIE_PREFIX}${experiment.id}`;
    const existingVariant = request.cookies.get(cookieName)?.value;

    // Already assigned — use existing assignment
    const assignedVariant = existingVariant ?? pickVariant(experiment);

    // Set cookie for persistence (edge-set cookies are instant — no FOUC)
    modifiedResponse.cookies.set(cookieName, assignedVariant, {
      maxAge: COOKIE_MAX_AGE,
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

function pickVariant(experiment: Experiment): string {
  if (!experiment.enabled) return experiment.variants[0].id;

  // Traffic allocation gate (only enroll % of visitors)
  if (Math.random() > experiment.trafficAllocation) {
    return experiment.variants[0].id; // Control for non-enrolled
  }

  // Weighted random assignment
  const rand = Math.random();
  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (rand < cumulative) return variant.id;
  }
  return experiment.variants[0].id;
}
```

### 3. Client-Side Hook

Create a hook for reading assigned variants:

```typescript
// packages/analytics/src/ab-testing.ts
export function useVariant(experimentId: string): string {
  if (typeof document === 'undefined') return 'control';

  const cookieName = `${COOKIE_PREFIX}${experimentId}`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) return decodeURIComponent(value);
  }

  return 'control';
}

// Usage in component
'use client';
import { useVariant } from '@repo/analytics/ab-testing';

const CTA_VARIANTS: Record<string, string> = {
  control: 'Schedule Service Today',
  'variant-a': 'Get Your Free Estimate Now',
};

export function CTAButton({ href, className }: { href: string; className?: string }) {
  const variant = useVariant('homepage-cta-text');
  const text = CTA_VARIANTS[variant] ?? CTA_VARIANTS.control;

  return (
    <a
      href={href}
      className={className}
      data-experiment="homepage-cta-text"
      data-variant={variant}
    >
      {text}
    </a>
  );
}
```

### 4. Analytics Integration

Implement tracking for experiment assignments:

```typescript
// packages/analytics/src/ab-testing.ts
async function trackExperimentAssignment(event: {
  tenantId: string;
  experimentId: string;
  variantId: string;
  sessionId: string;
}): Promise<void> {
  const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN;
  if (!TINYBIRD_TOKEN) return;

  await fetch(`https://api.tinybird.co/v0/events?name=ab_assignments&token=${TINYBIRD_TOKEN}`, {
    method: 'POST',
    body: JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

## Best Practices

### 1. Experiment Design

**Variant Selection**

- Use **statistically significant sample sizes**
- Implement **proper traffic allocation**
- Consider **business impact** of each variant
- Plan for **winner selection criteria**

**Traffic Allocation**

- Start with **conservative allocation** (10-20%)
- Gradually increase based on **confidence levels**
- Use **sequential testing** for major changes
- Implement **guardrail metrics** to prevent negative impact

### 2. Performance Optimization

**Edge Performance**

- Keep **middleware execution under 50ms**
- Use **efficient cookie operations**
- Minimize **database queries** in edge functions
- Implement **proper error handling**

**Caching Strategy**

- Cache **experiment definitions** at edge
- Use **CDN-level caching** for static variants
- Implement **stale-while-revalidate** for dynamic content
- Monitor **cache hit rates**

### 3. Analytics and Measurement

**Key Metrics**

- **Conversion rate** by variant
- **Revenue impact** per experiment
- **User engagement** differences
- **Page performance** metrics

**Statistical Analysis**

- Use **proper statistical significance** testing
- Implement **confidence intervals** for results
- Consider **multiple comparison correction**
- Plan for **long-term impact assessment**

## Advanced Patterns

### 1. Multi-Variant Testing

```typescript
export const MULTI_VARIANT_EXPERIMENT: Experiment = {
  id: 'pricing-page-redesign',
  name: 'Pricing Page Multi-Variant Test',
  variants: [
    { id: 'control', weight: 0.4 },
    { id: 'variant-a', weight: 0.3 }, // New layout
    { id: 'variant-b', weight: 0.3 }, // New pricing
  ],
  trafficAllocation: 0.8, // 80% of traffic
  enabled: true,
};
```

### 2. Progressive Rollout

```typescript
function getTrafficAllocation(experimentId: string): number {
  const rolloutSchedule = {
    'homepage-cta-text': 0.2, // Start with 20%
    'contact-form-layout': 0.5, // 50% for established test
  };

  return rolloutSchedule[experimentId] ?? 1.0;
}
```

### 3. Tenant-Specific Testing

```typescript
export const TENANT_SPECIFIC_EXPERIMENT: Experiment = {
  id: 'enterprise-features',
  name: 'Enterprise Feature Display',
  variants: [
    { id: 'control', weight: 0.5 },
    { id: 'enhanced', weight: 0.5 },
  ],
  trafficAllocation: 1.0,
  enabled: true,
  tenantIds: ['tenant-123', 'tenant-456'], // Only for enterprise tenants
};
```

## Testing and Validation

### 1. Unit Testing

```typescript
// packages/analytics/src/__tests__/ab-testing.test.ts
describe('A/B Testing', () => {
  describe('pickVariant', () => {
    it('returns control when experiment disabled', () => {
      const experiment = { ...EXPERIMENTS[0], enabled: false };
      expect(pickVariant(experiment)).toBe('control');
    });

    it('respects traffic allocation', () => {
      const experiment = { ...EXPERIMENTS[0], trafficAllocation: 0.5 };
      // Mock Math.random to return 0.6 (above allocation)
      jest.spyOn(Math, 'random').mockReturnValue(0.6);
      expect(pickVariant(experiment)).toBe('control');
    });
  });

  describe('useVariant', () => {
    it('returns control when no cookie exists', () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      expect(useVariant('test-experiment')).toBe('control');
    });

    it('returns variant from cookie', () => {
      Object.defineProperty(document, 'cookie', {
        value: 'ab_test-experiment=variant-a',
        writable: true,
      });

      expect(useVariant('test-experiment')).toBe('variant-a');
    });
  });
});
```

### 2. Integration Testing

```typescript
// e2e/tests/ab-testing.spec.ts
import { test, expect } from '@playwright/test';

test('A/B testing assigns variants correctly', async ({ page }) => {
  await page.goto('/');

  // Check if variant cookie is set
  const cookies = await page.context().cookies();
  const abCookie = cookies.find((c) => c.name.startsWith('ab_'));

  expect(abCookie).toBeDefined();
  expect(['control', 'variant-a']).toContain(abCookie.value);
});

test('Zero-CLS behavior', async ({ page }) => {
  await page.goto('/');

  // Measure CLS during page load
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const clsEntry = entries.find((entry) => entry.name === 'Cumulative Layout Shift');
        resolve(clsEntry?.value || 0);
      }).observe({ entryTypes: ['layout-shift'] });
    });
  });

  expect(metrics).toBeLessThan(0.1); // CLS should be near zero
});
```

## Monitoring and Analytics

### 1. Real-Time Monitoring

```typescript
// packages/analytics/src/monitoring.ts
export function getExperimentMetrics(experimentId: string) {
  return {
    assignments: getTotalAssignments(experimentId),
    conversions: getConversionsByVariant(experimentId),
    revenue: getRevenueByVariant(experimentId),
    confidence: calculateStatisticalSignificance(experimentId),
  };
}
```

### 2. Dashboard Implementation

Create a dashboard for monitoring experiment performance:

```typescript
// components/ExperimentDashboard.tsx
export function ExperimentDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await fetch('/api/experiments/metrics').then(r => r.json());
      setMetrics(data);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Experiment Performance</h2>
      {metrics?.map(experiment => (
        <ExperimentCard key={experiment.id} experiment={experiment} />
      ))}
    </div>
  );
}
```

## Common Pitfalls

### 1. Performance Issues

**Problem**: Middleware execution too slow
**Solution**:

- Keep middleware under 50ms
- Use efficient cookie operations
- Cache experiment definitions

**Problem**: Too many experiments running simultaneously
**Solution**:

- Limit concurrent experiments (max 3-4)
- Use traffic allocation to manage load
- Monitor edge function performance

### 2. Statistical Errors

**Problem**: Insufficient sample size
**Solution**:

- Calculate required sample size upfront
- Run experiments long enough for significance
- Use proper statistical tests

**Problem**: Multiple comparison problem
**Solution**:

- Apply Bonferroni correction
- Use sequential testing methods
- Limit simultaneous experiments

### 3. User Experience Issues

**Problem**: Inconsistent variant assignment
**Solution**:

- Use proper cookie persistence
- Implement consistent hashing
- Test cross-device assignment

**Problem**: Variant flickering
**Solution**:

- Ensure edge-based assignment
- Use proper path rewrites
- Avoid client-side variant switching

## Tools and Resources

### Development Tools

- **Vercel Edge Config** - For experiment configuration
- **Tinybird** - Real-time analytics
- **Playwright** - End-to-end testing
- **Lighthouse** - Performance testing

### Analytics Platforms

- **Google Analytics** - Traditional web analytics
- **Mixpanel** - Event-based analytics
- **Amplitude** - Product analytics
- **Custom solutions** - Tailored to specific needs

### Testing Tools

- **Jest** - Unit testing
- **Playwright** - E2E testing
- **Lighthouse CI** - Performance testing
- **Custom test suites** - Domain-specific testing

## References

- [Zero-CLS A/B Tests with Next.js and Vercel Edge Config](https://vercel.com/blog/zero-cls-experiments-nextjs-edge-config)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Edge Config](https://vercel.com/docs/edge-config)
- [Tinybird Documentation](https://www.tinybird.co/docs)
- [Web Vitals Documentation](https://web.dev/vitals/)

---

_Last updated: February 2026_
