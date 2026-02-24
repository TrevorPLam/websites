# feature-flags-system.md

> **2026 Standards Compliance** | PostHog Feature Flags · LaunchDarkly Edge SDK ·
> Next.js 16 Edge Middleware · Per-Tenant Flags · React 19.2 Server Components

## Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Flag Taxonomy](#flag-taxonomy)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Edge Middleware Evaluation](#edge-middleware-evaluation)
5. [Server Component Usage](#server-component-usage)
6. [Client Component Usage](#client-component-usage)
7. [Per-Tenant Feature Flags](#per-tenant-feature-flags)
8. [Flag Lifecycle & Governance](#flag-lifecycle--governance)
9. [A/B Testing Integration](#ab-testing-integration)
10. [Local Development & Testing](#local-development--testing)
11. [References](#references)

---

## Overview & Architecture

Feature flags decouple **code deployment** from **feature release**. Engineers
deploy code to production at any time, hidden behind a flag. Product and business
stakeholders control when users see that feature — no deploys required.

### The Three-Layer Evaluation Model

```

┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: Edge Middleware (PostHog / LaunchDarkly Edge SDK) │
│ ─ Evaluated at Vercel Edge (global, <1ms overhead) │
│ ─ Results injected into request headers: x-flag-[name] │
│ ─ Used for: routing, A/B redirects, market/plan gating │
└─────────────────────────────┬───────────────────────────────────┘
│ headers pass through
┌─────────────────────────────▼───────────────────────────────────┐
│ LAYER 2: Server Components (via request headers) │
│ ─ Read x-flag-\* headers — no SDK call needed │
│ ─ Zero latency: flag already evaluated at edge │
│ ─ Used for: conditional rendering, data fetching paths │
└─────────────────────────────┬───────────────────────────────────┘
│ bootstrapped to client
┌─────────────────────────────▼───────────────────────────────────┐
│ LAYER 3: Client Components (bootstrapped flags) │
│ ─ Bootstrapped from SSR — no client-side flag fetch │
│ ─ Zero flicker: client knows flag state before hydration │
│ ─ Used for: interactive UI variations, user preferences │
└─────────────────────────────────────────────────────────────────┘

```

---

## Flag Taxonomy

Establish naming conventions and types before writing code:

```typescript
// packages/flags/src/flag-registry.ts
/**
 * Flag Registry — single source of truth for all feature flags.
 * Every flag MUST be registered here with metadata.
 * Unregistered flags will throw in development.
 */
export const FLAGS = {
  // ─── Release Flags ─────────────────────────────────────────────
  // Short-lived; remove after 100% rollout
  'new-lead-pipeline': { type: 'release', defaultValue: false },
  'redesigned-dashboard': { type: 'release', defaultValue: false },
  'ai-site-generator': { type: 'release', defaultValue: false },

  // ─── Experiment Flags ──────────────────────────────────────────
  // A/B tests; remove after winner declared
  'checkout-flow-v2': { type: 'experiment', defaultValue: 'control' as 'control' | 'variant' },
  'pricing-page-layout': {
    type: 'experiment',
    defaultValue: 'control' as 'control' | 'variant-a' | 'variant-b',
  },

  // ─── Permission Flags (Plan-based) ─────────────────────────────
  // Long-lived; gated by billing plan
  'advanced-analytics': { type: 'permission', defaultValue: false },
  'custom-domain': { type: 'permission', defaultValue: false },
  'team-collaboration': { type: 'permission', defaultValue: false },
  'white-label': { type: 'permission', defaultValue: false },
  'sso-enabled': { type: 'permission', defaultValue: false },
  'api-access': { type: 'permission', defaultValue: false },

  // ─── Ops Flags ─────────────────────────────────────────────────
  // Kill switches; controlled by ops team
  'maintenance-mode': { type: 'ops', defaultValue: false },
  'ai-generation-enabled': { type: 'ops', defaultValue: true },
  'stripe-checkout-enabled': { type: 'ops', defaultValue: true },

  // ─── Infrastructure Flags ──────────────────────────────────────
  // Long-lived; infrastructure routing
  'use-edge-db': { type: 'infrastructure', defaultValue: false },
  'enable-ppr': { type: 'infrastructure', defaultValue: true },
} as const;

export type FlagKey = keyof typeof FLAGS;
export type FlagValue<K extends FlagKey> = (typeof FLAGS)[K]['defaultValue'];
```

---

## Infrastructure Setup

### PostHog Setup (Recommended — integrated analytics + flags)

```typescript
// packages/flags/src/posthog-client.ts
import { PostHog } from 'posthog-node';

// Server-side PostHog client (singleton)
let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: process.env.POSTHOG_HOST ?? 'https://app.posthog.com',
      // Don't send events from server — only flag evaluation
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

// packages/flags/src/evaluate-flags.ts
import type { FlagKey } from './flag-registry';
import { FLAGS } from './flag-registry';

export interface FlagContext {
  userId?: string;
  tenantId?: string;
  tenantPlan?: string;
  email?: string;
  properties?: Record<string, string | number | boolean>;
}

export async function evaluateFlags(
  keys: FlagKey[],
  context: FlagContext
): Promise<Record<FlagKey, unknown>> {
  const client = getPostHogClient();
  const distinctId = context.userId ?? context.tenantId ?? 'anonymous';

  const results: Record<string, unknown> = {};

  // Batch evaluate all requested flags
  await Promise.all(
    keys.map(async (key) => {
      try {
        const value = await client.getFeatureFlag(key, distinctId, {
          groups: context.tenantId ? { tenant: context.tenantId } : undefined,
          personProperties: {
            plan: context.tenantPlan ?? 'free',
            email: context.email ?? '',
            ...context.properties,
          },
        });
        results[key] = value ?? FLAGS[key].defaultValue;
      } catch {
        // Fail open: use default value if evaluation fails
        results[key] = FLAGS[key].defaultValue;
      }
    })
  );

  return results as Record<FlagKey, unknown>;
}
```

---

## Edge Middleware Evaluation

Evaluate flags once at the edge, inject into headers — downstream components read
headers without any SDK calls:

```typescript
// middleware.ts (add to existing middleware)
import { evaluateFlags } from '@repo/flags';
import type { FlagKey } from '@repo/flags';

// Flags to evaluate at edge for every request
const EDGE_FLAGS: FlagKey[] = [
  'maintenance-mode',
  'new-lead-pipeline',
  'advanced-analytics',
  'ai-generation-enabled',
];

export async function middleware(req: NextRequest) {
  // ... existing tenant resolution, rate limiting, security headers ...

  const tenantId = req.headers.get('x-tenant-id') ?? undefined;
  const tenantPlan = req.headers.get('x-tenant-plan') ?? undefined;
  const userId = req.cookies.get('user-id')?.value;

  // Evaluate feature flags at edge
  let flags: Record<string, unknown> = {};
  try {
    flags = await evaluateFlags(EDGE_FLAGS, {
      userId,
      tenantId,
      tenantPlan,
    });
  } catch {
    // Fail open — use defaults if PostHog is unreachable
    flags = Object.fromEntries(EDGE_FLAGS.map((k) => [k, false]));
  }

  // Maintenance mode: redirect ALL requests to maintenance page
  if (flags['maintenance-mode'] === true) {
    const isMaintenancePage = req.nextUrl.pathname === '/maintenance';
    const isApiRoute = req.nextUrl.pathname.startsWith('/api/');
    if (!isMaintenancePage && !isApiRoute) {
      return NextResponse.rewrite(new URL('/maintenance', req.url));
    }
  }

  const res = NextResponse.next();

  // Inject flag values as request headers for downstream consumption
  for (const [key, value] of Object.entries(flags)) {
    res.headers.set(`x-flag-${key}`, typeof value === 'boolean' ? String(value) : String(value));
  }

  return res;
}
```

---

## Server Component Usage

```typescript
// packages/flags/src/server.ts
import { headers } from 'next/headers';
import type { FlagKey, FlagValue } from './flag-registry';
import { FLAGS } from './flag-registry';

/**
 * Read a feature flag in a Server Component.
 * Reads from the x-flag-* header injected by middleware — zero latency.
 */
export async function getFlag<K extends FlagKey>(key: K): Promise<FlagValue<K>> {
  const headersList = await headers();
  const rawValue = headersList.get(`x-flag-${key}`);

  if (rawValue === null) {
    return FLAGS[key].defaultValue as FlagValue<K>;
  }

  // Parse boolean flags
  const defaultValue = FLAGS[key].defaultValue;
  if (typeof defaultValue === 'boolean') {
    return (rawValue === 'true') as FlagValue<K>;
  }

  return rawValue as FlagValue<K>;
}

/**
 * Read multiple flags at once.
 */
export async function getFlags<K extends FlagKey>(keys: K[]): Promise<{ [P in K]: FlagValue<P> }> {
  const headersList = await headers();
  return Object.fromEntries(
    keys.map((key) => {
      const rawValue = headersList.get(`x-flag-${key}`);
      const defaultValue = FLAGS[key].defaultValue;
      if (rawValue === null) return [key, defaultValue];
      if (typeof defaultValue === 'boolean') return [key, rawValue === 'true'];
      return [key, rawValue];
    })
  ) as { [P in K]: FlagValue<P> };
}
```

### Usage in Server Components

```typescript
// widgets/dashboard-analytics/ui/AnalyticsWidget.tsx
import { getFlag } from '@repo/flags/server'

export async function AnalyticsWidget({ tenantId }: { tenantId: string }) {
  const hasAdvancedAnalytics = await getFlag('advanced-analytics')
  const hasNewPipeline = await getFlag('new-lead-pipeline')

  if (!hasAdvancedAnalytics) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
        <p className="text-gray-500">Advanced analytics available on Pro plan.</p>
        <a href="/billing/upgrade" className="mt-2 text-blue-600 underline text-sm">
          Upgrade to Pro →
        </a>
      </div>
    )
  }

  const data = hasNewPipeline
    ? await fetchNewPipelineAnalytics(tenantId)
    : await fetchLegacyAnalytics(tenantId)

  return <AnalyticsChart data={data} />
}
```

---

## Client Component Usage

Bootstrap flags from SSR to avoid flicker and eliminate client-side flag fetching:

```typescript
// packages/flags/src/client-provider.tsx
'use client'
import { createContext, useContext } from 'react'
import type { FlagKey, FlagValue } from './flag-registry'

type FlagsMap = Partial<{ [K in FlagKey]: FlagValue<K> }>

const FlagsContext = createContext<FlagsMap>({})

export function FlagsProvider({
  flags,
  children,
}: {
  flags: FlagsMap
  children: React.ReactNode
}) {
  return <FlagsContext value={flags}>{children}</FlagsContext>
}

export function useFlag<K extends FlagKey>(
  key: K,
  defaultValue?: FlagValue<K>,
): FlagValue<K> {
  const flags = useContext(FlagsContext)
  return (flags[key] ?? defaultValue ?? false) as FlagValue<K]
}
```

```typescript
// app/layout.tsx — bootstrap flags from SSR into client
import { headers } from 'next/headers'
import { FlagsProvider } from '@repo/flags/client-provider'
import { FLAGS } from '@repo/flags'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()

  // Collect all flag values from headers for client bootstrap
  const flags = Object.fromEntries(
    Object.keys(FLAGS).map(key => {
      const rawValue = headersList.get(`x-flag-${key}`)
      const defaultValue = FLAGS[key as FlagKey].defaultValue
      if (rawValue === null) return [key, defaultValue]
      if (typeof defaultValue === 'boolean') return [key, rawValue === 'true']
      return [key, rawValue]
    }),
  )

  return (
    <html lang="en">
      <body>
        <FlagsProvider flags={flags}>
          {children}
        </FlagsProvider>
      </body>
    </html>
  )
}
```

```typescript
// Client component usage — zero flicker, flags already bootstrapped
'use client'
import { useFlag } from '@repo/flags/client-provider'

export function AiGenerateButton() {
  const aiEnabled = useFlag('ai-generation-enabled')

  if (!aiEnabled) return null

  return (
    <button onClick={handleGenerate}>
      Generate with AI
    </button>
  )
}
```

---

## Per-Tenant Feature Flags

Plan-based flags are computed at the DB level and injected during tenant resolution:

```typescript
// packages/flags/src/tenant-permissions.ts

const PLAN_PERMISSIONS: Record<string, Record<string, boolean>> = {
  free: {
    'advanced-analytics': false,
    'custom-domain': false,
    'team-collaboration': false,
    'white-label': false,
    'sso-enabled': false,
    'api-access': false,
  },
  pro: {
    'advanced-analytics': true,
    'custom-domain': true,
    'team-collaboration': true,
    'white-label': false,
    'sso-enabled': false,
    'api-access': true,
  },
  enterprise: {
    'advanced-analytics': true,
    'custom-domain': true,
    'team-collaboration': true,
    'white-label': true,
    'sso-enabled': true,
    'api-access': true,
  },
};

/**
 * Resolve permission flags from billing plan.
 * Called in middleware during tenant resolution.
 * Result merged with PostHog flags (PostHog overrides plan for A/B tests).
 */
export function resolvePermissionFlags(
  plan: string,
  tenantFeatureOverrides: string[] = []
): Record<string, boolean> {
  const basePlanFlags = PLAN_PERMISSIONS[plan] ?? PLAN_PERMISSIONS.free;

  // Apply per-tenant overrides (stored in DB features column)
  const overrides = Object.fromEntries(tenantFeatureOverrides.map((f) => [f, true]));

  return { ...basePlanFlags, ...overrides };
}
```

---

## Flag Lifecycle & Governance

```typescript
// packages/flags/src/flag-registry.ts — add metadata for governance
export const FLAGS = {
  'new-lead-pipeline': {
    type: 'release',
    defaultValue: false,
    // Governance metadata
    owner: 'platform-team',
    createdAt: '2026-01-15',
    rolloutTarget: '100%',
    removalDeadline: '2026-03-01', // Date by which code must be cleaned up
    jiraTicket: 'PLAT-1234',
    description: 'New lead pipeline with AI scoring — replaces legacy pipeline',
  },
  // ...
} as const;
```

### Flag Cleanup CI Check

```typescript
// scripts/flag-governance.ts — runs in CI
import { FLAGS } from '@repo/flags';

const today = new Date();
const warnings: string[] = [];
const errors: string[] = [];

for (const [key, config] of Object.entries(FLAGS)) {
  if (!('removalDeadline' in config) || !config.removalDeadline) continue;

  const deadline = new Date(config.removalDeadline as string);
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);

  if (daysRemaining < 0) {
    errors.push(`🚫 OVERDUE: Flag '${key}' removal deadline was ${config.removalDeadline}`);
  } else if (daysRemaining < 14) {
    warnings.push(`⚠️  Flag '${key}' removal deadline in ${daysRemaining} days`);
  }
}

if (warnings.length) warnings.forEach((w) => console.warn(w));
if (errors.length) {
  errors.forEach((e) => console.error(e));
  process.exit(1); // Fail CI if overdue flags exist
}
```

---

## A/B Testing Integration

```typescript
// packages/flags/src/ab-test.ts
import { evaluateFlags } from './evaluate-flags';
import { getPostHogClient } from './posthog-client';

export interface AbTestResult<V extends string> {
  variant: V;
  isControl: boolean;
  trackExposure: (metadata?: Record<string, string>) => void;
}

export async function getAbVariant<V extends string>(
  flagKey: FlagKey,
  userId: string,
  variants: V[]
): Promise<AbTestResult<V>> {
  const client = getPostHogClient();
  const rawVariant = await client.getFeatureFlag(flagKey, userId);

  const variant = (variants.includes(rawVariant as V) ? rawVariant : variants) as V;
  const isControl = variant === variants;

  return {
    variant,
    isControl,
    trackExposure: (metadata = {}) => {
      client.capture({
        distinctId: userId,
        event: '$feature_flag_called',
        properties: {
          $feature_flag: flagKey,
          $feature_flag_response: variant,
          ...metadata,
        },
      });
    },
  };
}

// Usage in Server Component:
// const { variant, trackExposure } = await getAbVariant(
//   'checkout-flow-v2',
//   userId,
//   ['control', 'variant'],
// )
// trackExposure({ page: 'checkout' })
// return variant === 'variant' ? <NewCheckout /> : <LegacyCheckout />
```

---

## Local Development & Testing

```typescript
// packages/flags/src/local-overrides.ts
// Override flags in development via .env.local
// Useful for testing specific flag combinations without PostHog

export function getLocalFlagOverrides(): Partial<Record<FlagKey, unknown>> {
  if (process.env.NODE_ENV !== 'development') return {};

  const overrides: Partial<Record<FlagKey, unknown>> = {};
  for (const key of Object.keys(FLAGS) as FlagKey[]) {
    const envKey = `NEXT_PUBLIC_FLAG_${key.toUpperCase().replace(/-/g, '_')}`;
    const envValue = process.env[envKey];
    if (envValue !== undefined) {
      const defaultValue = FLAGS[key].defaultValue;
      overrides[key] = typeof defaultValue === 'boolean' ? envValue === 'true' : envValue;
    }
  }
  return overrides;
}

// .env.local example:
// NEXT_PUBLIC_FLAG_NEW_LEAD_PIPELINE=true
// NEXT_PUBLIC_FLAG_ADVANCED_ANALYTICS=true
// NEXT_PUBLIC_FLAG_MAINTENANCE_MODE=false
```

### Vitest Testing

```typescript
// packages/flags/src/flags.test.ts
import { describe, it, expect, vi } from 'vitest';
import { resolvePermissionFlags } from './tenant-permissions';
import { getFlag } from './server';

describe('Permission Flags', () => {
  it('grants advanced analytics to pro plan', () => {
    const flags = resolvePermissionFlags('pro');
    expect(flags['advanced-analytics']).toBe(true);
  });

  it('denies SSO to free plan', () => {
    const flags = resolvePermissionFlags('free');
    expect(flags['sso-enabled']).toBe(false);
  });

  it('applies per-tenant overrides', () => {
    const flags = resolvePermissionFlags('free', ['advanced-analytics']);
    expect(flags['advanced-analytics']).toBe(true); // Override free plan
  });
});

describe('getFlag Server', () => {
  it('reads from headers', async () => {
    vi.mock('next/headers', () => ({
      headers: () => ({
        get: (key: string) => (key === 'x-flag-new-lead-pipeline' ? 'true' : null),
      }),
    }));
    const value = await getFlag('new-lead-pipeline');
    expect(value).toBe(true);
  });
});
```

---

## References

- [PostHog Next.js Feature Flags](https://posthog.com/tutorials/nextjs-analytics)
- [PostHog + Vercel + App Router](https://vercel.com/kb/guide/posthog-nextjs-vercel-feature-flags-analytics)
- [PostHog Flags Playbook — Production Scaling](https://marsala.dev/blog/posthog-feature-flags-playbook)
- [LaunchDarkly Vercel Edge SDK](https://launchdarkly.com/docs/sdk/edge/vercel)
- [Feature Flags Best Practices — LaunchDarkly](https://launchdarkly.com/feature-flags-javascript/)
