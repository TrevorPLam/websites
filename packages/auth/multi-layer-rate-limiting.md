# Multi Layer Rate Limiting

```

## Overview

The platform implements a three-layer rate limiting strategy using Upstash Ratelimit: **Edge** (global IP protection in middleware), **API** (per-route, per-tenant protection in Route Handlers), and **Action** (per-server-action, per-user protection via `createServerAction()`). Each layer uses a different algorithm tuned to its traffic profile. All rate limit keys include `tenantId` per platform invariant. [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

---

## Layer Architecture

```

                     Incoming Request
                            │
              ┌─────────────▼─────────────┐
              │   LAYER 1: EDGE (Global)   │  middleware.ts
              │   Algorithm: Sliding Window │  Key: ip
              │   Limit: 10 req/sec        │  Redis prefix: rl:global
              └─────────────┬─────────────┘
                            │ pass
              ┌─────────────▼─────────────┐
              │  LAYER 2: API (Per-Route)  │  Route Handler / tRPC
              │  Algorithm: Token Bucket   │  Key: tenantId:userId:route
              │  Limit: varies by plan     │  Redis prefix: rl:api
              └─────────────┬─────────────┘
                            │ pass
              ┌─────────────▼─────────────┐
              │  LAYER 3: ACTION          │  createServerAction()
              │  Algorithm: Sliding Window │  Key: tenantId:userId:action
              │  Limit: 20 req/min        │  Redis prefix: rl:action
              └─────────────┬─────────────┘
                            │ pass
                       Route Handler

````

---

## Layer 1: Edge Global Rate Limit

Applied in `middleware.ts` (see `security-middleware-implementation.md`). Uses **sliding window** — appropriate for smoothing bursty traffic. [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)

```typescript
// packages/ratelimit/src/edge.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const edgeRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 s'),
  analytics: true,
  prefix: 'rl:global',
  ephemeralCache: new Map(), // In-process cache reduces Redis calls for blocked IPs
});
````

---

## Layer 2: API Route Rate Limit

Applied in Route Handlers using a `withRateLimit()` HOF. Uses **token bucket** — permits short bursts while enforcing sustained limits. [upstash](https://upstash.com/blog/dynamic-rate-limits)

```typescript
// packages/ratelimit/src/api.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export type PlanTier = 'free' | 'pro' | 'enterprise';

/**
 * Per-plan rate limit configurations.
 * Architecture invariant: key always includes tenantId.
 */
const PLAN_LIMITS: Record<PlanTier, { requests: number; window: string; burst: number }> = {
  free: { requests: 60, window: '1 m', burst: 10 },
  pro: { requests: 600, window: '1 m', burst: 50 },
  enterprise: { requests: 6000, window: '1 m', burst: 200 },
};

const ratelimitByPlan = Object.fromEntries(
  Object.entries(PLAN_LIMITS).map(([plan, config]) => [
    plan,
    new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(config.requests, config.window, config.burst),
      analytics: true,
      prefix: `rl:api:${plan}`,
      ephemeralCache: new Map(),
    }),
  ])
) as Record<PlanTier, Ratelimit>;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit an API request by tenantId + userId.
 * Falls back to 'free' tier if plan unknown.
 */
export async function checkApiRateLimit(params: {
  tenantId: string;
  userId: string;
  routeKey: string;
  plan?: PlanTier;
}): Promise<RateLimitResult> {
  const { tenantId, userId, routeKey, plan = 'free' } = params;
  // Architecture invariant: key includes tenantId
  const key = `${tenantId}:${userId}:${routeKey}`;
  return ratelimitByPlan[plan].limit(key);
}
```

### Usage in a Route Handler

```typescript
// app/api/leads/route.ts
import { auth } from '@clerk/nextjs/server';
import { checkApiRateLimit } from '@your-org/ratelimit/api';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const headerStore = await headers();
  const tenantId = headerStore.get('x-tenant-id');
  if (!tenantId) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

  const rl = await checkApiRateLimit({
    tenantId,
    userId,
    routeKey: 'GET:/api/leads',
    plan: 'pro', // Fetch from Stripe subscription in production
  });

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
          'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  // ... handle request
}
```

---

## Layer 3: Action Rate Limit

Built into `createServerAction()` (see `server-action-security-wrapper.md`). Sensitive actions get tighter limits:

```typescript
// Aggressive limits for auth-adjacent actions
export const requestPasswordResetAction = createServerAction({
  actionName: 'requestPasswordReset',
  schema: z.object({ email: z.string().email() }),
  allowUnauthenticated: true,
  rateLimit: { requests: 3, window: '15 m' }, // 3 per 15 minutes
  handler: async (input, ctx) => {
    /* ... */
  },
});

// Normal limits for data mutations
export const updateProfileAction = createServerAction({
  actionName: 'updateProfile',
  schema: updateProfileSchema,
  rateLimit: { requests: 30, window: '1 m' },
  handler: async (input, ctx) => {
    /* ... */
  },
});
```

---

## Dynamic Rate Limits (Upstash Jan 2026 Feature)

Upstash introduced `dynamicLimits` in January 2026, allowing runtime limit overrides without redeployment. This is useful for temporarily throttling a misbehaving tenant. [upstash](https://upstash.com/blog/dynamic-rate-limits)

```typescript
// packages/ratelimit/src/dynamic.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const dynamicRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'rl:dynamic',
  // enableDynamicLimits allows per-identifier overrides stored in Redis
  // See: https://upstash.com/blog/dynamic-rate-limits
});

/**
 * Throttle a specific tenant at runtime (e.g. from super-admin dashboard).
 * Architecture invariant: key includes tenantId.
 */
export async function throttleTenant(tenantId: string, requestsPerMin: number) {
  // Store dynamic limit override in Redis
  await redis.set(
    `rl:dynamic:override:${tenantId}`,
    JSON.stringify({ limit: requestsPerMin }),
    { ex: 3600 } // 1 hour override
  );
}
```

---

## Rate Limit Monitoring

```typescript
// packages/ratelimit/src/analytics.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

/**
 * Fetch rate limit analytics for a tenant (past 24h).
 * Used by super-admin dashboard.
 */
export async function getTenantRateLimitStats(tenantId: string) {
  const keys = await redis.keys(`rl:*:${tenantId}:*`);
  const stats = await Promise.all(
    keys.map(async (key) => ({
      key,
      count: (await redis.get<number>(key)) ?? 0,
    }))
  );
  return stats.sort((a, b) => b.count - a.count).slice(0, 20);
}
```

---

## Rate Limit Limit Reference

| Layer            | Algorithm      | Default Limit   | Key Pattern              | 429 Headers       |
| ---------------- | -------------- | --------------- | ------------------------ | ----------------- |
| Edge (global)    | Sliding Window | 10 req/s per IP | `ip`                     | `Retry-After`     |
| API (free)       | Token Bucket   | 60 req/min      | `tenantId:userId:route`  | `X-RateLimit-*`   |
| API (pro)        | Token Bucket   | 600 req/min     | `tenantId:userId:route`  | `X-RateLimit-*`   |
| API (enterprise) | Token Bucket   | 6000 req/min    | `tenantId:userId:route`  | `X-RateLimit-*`   |
| Action (default) | Sliding Window | 20 req/min      | `tenantId:userId:action` | none (JSON error) |
| Action (auth)    | Sliding Window | 3 per 15 min    | `tenantId:userId:action` | none (JSON error) |

---

## References

- [Upstash Ratelimit Overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview) [upstash](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Upstash Dynamic Rate Limits (Jan 2026)](https://upstash.com/blog/dynamic-rate-limits) [upstash](https://upstash.com/blog/dynamic-rate-limits)
- [Next.js Rate Limiting Patterns](https://github.com/vercel/next.js/discussions/79579) [github](https://github.com/vercel/next.js/discussions/79579)

---

---

# `secrets-manager.md`

> **Internal Template — customize as needed.**

```

```
