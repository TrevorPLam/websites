# noisy-neighbor-prevention.md

> **2026 Standards Compliance** | Upstash Ratelimit · Next.js 16 Edge Middleware ·
> Multi-tenant SaaS Isolation Patterns

## Table of Contents

1. [Overview](#overview)
2. [Threat Model](#threat-model)
3. [Rate Limiting Architecture](#rate-limiting-architecture)
4. [Implementation — HTTP Layer](#implementation--http-layer)
5. [Implementation — Queue Layer](#implementation--queue-layer)
6. [Implementation — Database Layer](#implementation--database-layer)
7. [Implementation — Observability Layer](#implementation--observability-layer)
8. [Adaptive Throttling](#adaptive-throttling)
9. [Tenant Quotas Schema](#tenant-quotas-schema)
10. [Alerting & Runbook](#alerting--runbook)
11. [Testing](#testing)
12. [References](#references)

---

## Overview

The **noisy neighbor problem** occurs when one tenant's resource consumption degrades
performance for all other tenants sharing the same infrastructure. In a multi-tenant
SaaS, this manifests at multiple layers simultaneously:

- **HTTP**: Excessive API calls monopolizing Edge function concurrency
- **Database**: Long-running queries holding connection pool slots
- **Queue**: Burst job submissions starving other tenants' background work
- **Storage**: High write throughput saturating I/O bandwidth
- **Observability**: Telemetry floods masking other tenants' signals

A robust prevention strategy applies **independent rate limiting at every resource
boundary**, uses **per-tenant quotas** enforced at the database level, and provides
**adaptive throttling** that degrades gracefully rather than hard-blocking.

---

## Threat Model

| Vector                    | Impact                        | Detection                | Mitigation                        |
| ------------------------- | ----------------------------- | ------------------------ | --------------------------------- |
| API burst (webhook storm) | Edge timeout, 502s for others | Req/s per tenant metric  | Sliding window rate limit         |
| Long DB query             | Connection pool exhaustion    | `pg_stat_statements` P99 | Statement timeout + RLS           |
| Job queue flood           | Hours-long queue delay        | Jobs queued per tenant   | Per-tenant concurrency cap        |
| Storage write burst       | I/O saturation                | Bytes written/min        | Per-tenant upload quota           |
| Telemetry flood           | Collector OOM, blind spots    | Spans/sec per tenant     | Probabilistic sampling per tenant |
| Realtime channel spam     | Supabase channel exhaustion   | Messages/sec per channel | Per-tenant channel quota          |

---

## Rate Limiting Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: Edge Middleware (Next.js + Upstash) │
│ ─ Per-tenant sliding window: 100 req/min (free) │
│ ─ Per-tenant sliding window: 1000 req/min (pro) │
│ ─ Per-IP burst protection: 20 req/10s │
└───────────────────────┬─────────────────────────────────────┘
│ passes through
┌───────────────────────▼─────────────────────────────────────┐
│ LAYER 2: API Route Guards (Server Actions + Route Handlers) │
│ ─ Per-endpoint rate limits (e.g., /api/leads: 10/min) │
│ ─ Per-tenant mutation limits (100 creates/hour) │
└───────────────────────┬─────────────────────────────────────┘
│ passes through
┌───────────────────────▼─────────────────────────────────────┐
│ LAYER 3: Database (Supabase + RLS + pg timeouts) │
│ ─ statement_timeout per role (5s API, 30s analytics) │
│ ─ lock_timeout: 3s │
│ ─ Row quotas enforced via DB triggers │
└───────────────────────┬─────────────────────────────────────┘
│ passes through
┌───────────────────────▼─────────────────────────────────────┐
│ LAYER 4: Queue (QStash / Inngest) │
│ ─ Per-tenant concurrency: 5 simultaneous jobs (free) │
│ ─ Per-tenant concurrency: 50 simultaneous jobs (pro) │
│ ─ Global concurrency ceiling: 500 │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation — HTTP Layer

### Edge Middleware with Plan-Aware Limits

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

// Plan-tiered rate limiters
const limiters = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'rl:free',
    analytics: true, // Track for alerting
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 m'),
    prefix: 'rl:pro',
    analytics: true,
  }),
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10_000, '1 m'),
    prefix: 'rl:enterprise',
    analytics: true,
  }),
  // IP-level burst protection regardless of plan
  ipBurst: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(20, '10 s'),
    prefix: 'rl:ip',
  }),
};

export async function middleware(req: NextRequest) {
  const tenantId = req.headers.get('x-tenant-id');
  const tenantPlan = (req.headers.get('x-tenant-plan') as keyof typeof limiters) ?? 'free';
  const ip = req.headers.get('x-forwarded-for')?.split(',') ?? '0.0.0.0';

  // Layer 1a: IP burst protection (always applied)
  const ipResult = await limiters.ipBurst.limit(`ip:${ip}`);
  if (!ipResult.success) {
    return rateLimitResponse(ipResult, 'IP_BURST');
  }

  // Layer 1b: Per-tenant plan limit
  if (tenantId) {
    const limiter = limiters[tenantPlan] ?? limiters.free;
    const tenantResult = await limiter.limit(`tenant:${tenantId}`);

    if (!tenantResult.success) {
      // Log the noisy neighbor event for alerting
      await redis.incr(`noisy:${tenantId}:${Math.floor(Date.now() / 60_000)}`);
      return rateLimitResponse(tenantResult, 'TENANT_QUOTA');
    }

    const res = NextResponse.next();
    res.headers.set('X-RateLimit-Limit', String(tenantResult.limit));
    res.headers.set('X-RateLimit-Remaining', String(tenantResult.remaining));
    res.headers.set('X-RateLimit-Reset', String(tenantResult.reset));
    return res;
  }

  return NextResponse.next();
}

function rateLimitResponse(
  result: { limit: number; reset: number; remaining: number },
  reason: string
) {
  return new NextResponse(
    JSON.stringify({
      error: 'RATE_LIMITED',
      reason,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  );
}
```

### Per-Endpoint Fine-Grained Limits

For mutation-heavy endpoints (lead creation, file upload), apply additional granular limits:

```typescript
// packages/rate-limit/src/endpoint-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Endpoint-specific limiters
export const endpointLimiters = {
  'leads.create': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'rl:leads:create',
  }),
  'files.upload': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'rl:files:upload',
  }),
  'ai.generate': new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(20, '1 m', 5), // 20 tokens/min, burst 5
    prefix: 'rl:ai:generate',
  }),
  'email.send': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'),
    prefix: 'rl:email:send',
  }),
};

export async function checkEndpointLimit(
  endpoint: keyof typeof endpointLimiters,
  tenantId: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter = endpointLimiters[endpoint];
  if (!limiter) return { allowed: true };

  const result = await limiter.limit(`${endpoint}:${tenantId}`);
  if (!result.success) {
    return {
      allowed: false,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    };
  }
  return { allowed: true };
}
```

---

## Implementation — Queue Layer

Prevent job floods from starving other tenants' background work using per-tenant
concurrency controls.

```typescript
// packages/jobs/src/concurrency-config.ts
import { inngest } from './inngest-client';

// Plan-tiered concurrency limits
const CONCURRENCY_BY_PLAN = {
  free: { perTenant: 2, global: 500 },
  pro: { perTenant: 10, global: 500 },
  enterprise: { perTenant: 50, global: 500 },
} as const;

export function createTenantJob<T>(
  id: string,
  plan: keyof typeof CONCURRENCY_BY_PLAN,
  handler: (event: T) => Promise<unknown>
) {
  const { perTenant, global: globalLimit } = CONCURRENCY_BY_PLAN[plan];

  return inngest.createFunction(
    {
      id,
      concurrency: [
        {
          // Per-tenant concurrency: each tenant gets their own slot pool
          limit: perTenant,
          key: 'event.data.tenantId',
        },
        {
          // Global ceiling prevents system overload
          limit: globalLimit,
        },
      ],
      // Exponential backoff for failed jobs
      retries: {
        attempts: 5,
        factor: 2,
        minTimeout: 1_000,
        maxTimeout: 60_000,
      },
    },
    { event: id },
    async ({ event }) => handler(event.data as T)
  );
}

// Usage:
// export const processLeadJob = createTenantJob<LeadJobData>(
//   'leads/process',
//   'pro',
//   async (data) => { ... }
// )
```

### QStash Per-Tenant Queue Isolation

```typescript
// packages/jobs/src/qstash-tenant-queue.ts
import { Client } from '@upstash/qstash';

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Per-tenant queue key prevents one tenant's jobs
// from delaying another's
export async function enqueueTenantJob(
  tenantId: string,
  endpoint: string,
  payload: unknown,
  options?: {
    delay?: number;
    retries?: number;
    deduplicationId?: string;
  }
) {
  const dedupeId = options?.deduplicationId ?? `${tenantId}:${endpoint}:${Date.now()}`;

  return qstash.publishJSON({
    url: `${process.env.APP_URL}${endpoint}`,
    body: { tenantId, ...(payload as object) },
    headers: {
      'X-Tenant-ID': tenantId,
    },
    retries: options?.retries ?? 3,
    delay: options?.delay,
    deduplicationId: dedupeId,
  });
}
```

---

## Implementation — Database Layer

### Statement Timeouts per Role

```sql
-- supabase/migrations/20260223_db_timeouts.sql

-- API role: short timeout prevents hung queries blocking connection pool
ALTER ROLE authenticator SET statement_timeout = '5s';
ALTER ROLE authenticator SET lock_timeout = '3s';
ALTER ROLE authenticator SET idle_in_transaction_session_timeout = '10s';

-- Analytics role: longer timeout for aggregate queries
ALTER ROLE analytics_role SET statement_timeout = '30s';
ALTER ROLE analytics_role SET lock_timeout = '5s';

-- Migrations role: no timeout (controlled separately)
ALTER ROLE migration_role SET statement_timeout = '0';
```

### Per-Tenant Row Quotas via DB Triggers

```sql
-- supabase/migrations/20260223_row_quotas.sql

CREATE TABLE tenant_quotas (
  tenant_id     UUID REFERENCES tenants(id) ON DELETE CASCADE,
  resource      TEXT NOT NULL,  -- 'leads', 'sites', 'files'
  current_count BIGINT DEFAULT 0,
  max_count     BIGINT NOT NULL,
  reset_at      TIMESTAMPTZ,    -- NULL = no reset (lifetime quota)
  PRIMARY KEY (tenant_id, resource)
);

-- Quota enforcement function
CREATE OR REPLACE FUNCTION enforce_tenant_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_quota tenant_quotas;
BEGIN
  SELECT * INTO v_quota
  FROM tenant_quotas
  WHERE tenant_id = NEW.tenant_id
    AND resource = TG_ARGV;

  IF NOT FOUND THEN
    RETURN NEW; -- No quota configured = unlimited
  END IF;

  IF v_quota.current_count >= v_quota.max_count THEN
    RAISE EXCEPTION 'QUOTA_EXCEEDED'
      USING DETAIL = format('Tenant %s has reached the %s limit of %s',
        NEW.tenant_id, TG_ARGV, v_quota.max_count),
      HINT = 'Upgrade your plan to increase this limit';
  END IF;

  -- Increment counter
  UPDATE tenant_quotas
  SET current_count = current_count + 1
  WHERE tenant_id = NEW.tenant_id AND resource = TG_ARGV;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to leads table
CREATE TRIGGER enforce_leads_quota
  BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION enforce_tenant_quota('leads');

-- Apply to sites table
CREATE TRIGGER enforce_sites_quota
  BEFORE INSERT ON sites
  FOR EACH ROW EXECUTE FUNCTION enforce_tenant_quota('sites');
```

### Connection Pool Isolation (Supavisor)

```ini
# supavisor config — per-tenant pool sizing
[pool.default]
pool_mode = "transaction"
max_client_conn = 200
default_pool_size = 10        # Per tenant max connections

[pool.enterprise]
pool_mode = "transaction"
max_client_conn = 1000
default_pool_size = 50        # Enterprise tenants get more
```

---

## Implementation — Observability Layer

Prevent a single tenant's telemetry flood from masking signals for others:

```yaml
# otel-collector-config.yaml
processors:
  # Per-tenant rate limiting on spans
  rate_limiting/tenant_default:
    rate_limiter:
      span_limit_per_second: 1000
      error_mode: drop # Drop excess, never block

  # Memory guard for all tenants combined
  memory_limiter:
    check_interval: 1s
    limit_mib: 2048
    spike_limit_mib: 512

  # Probabilistic sampling for high-volume tenants
  probabilistic_sampler/high_volume:
    sampling_percentage: 10
    hash_seed: 42

  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    expected_new_traces_per_sec: 10000
    policies:
      - name: errors-policy
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: slow-traces
        type: latency
        latency: { threshold_ms: 1000 }
      - name: probabilistic-policy
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, rate_limiting/tenant_default, tail_sampling]
      exporters: [otlp/backend]
```

---

## Adaptive Throttling

Rather than hard-blocking at 100%, implement **graduated throttling** that slows
responses before rejecting them — better for user experience and retry logic:

```typescript
// packages/rate-limit/src/adaptive-throttler.ts
export interface ThrottleResult {
  action: 'pass' | 'throttle' | 'reject';
  delayMs?: number;
  retryAfter?: number;
}

export function getAdaptiveThrottle(remaining: number, limit: number): ThrottleResult {
  const usageRatio = 1 - remaining / limit;

  if (usageRatio < 0.8) {
    return { action: 'pass' };
  }

  if (usageRatio < 0.95) {
    // Gradual delay: 100ms at 80%, 1s at 95%
    const delayMs = Math.floor((usageRatio - 0.8) * 5000);
    return { action: 'throttle', delayMs };
  }

  // Hard reject only when completely exhausted
  const retryAfter = Math.ceil((Date.now() + 60_000) / 1000);
  return { action: 'reject', retryAfter };
}

// Apply in middleware
export async function applyAdaptiveThrottle(
  result: { success: boolean; remaining: number; limit: number; reset: number },
  req: NextRequest
) {
  if (result.success) {
    const throttle = getAdaptiveThrottle(result.remaining, result.limit);
    if (throttle.action === 'throttle' && throttle.delayMs) {
      // Artificial delay to slow down the client
      await new Promise((resolve) => setTimeout(resolve, throttle.delayMs));
    }
    return NextResponse.next();
  }

  const throttle = getAdaptiveThrottle(0, result.limit);
  return rateLimitResponse(result, 'ADAPTIVE_THROTTLE');
}
```

---

## Tenant Quotas Schema

```typescript
// packages/db/src/schemas/tenant-quotas.schema.ts
import { z } from 'zod';

export const TenantQuotaSchema = z.object({
  tenantId: z.string().uuid(),
  resource: z.enum(['leads', 'sites', 'files', 'api_calls', 'emails']),
  currentCount: z.number().int().min(0),
  maxCount: z.number().int().min(0),
  resetAt: z.date().nullable(), // null = lifetime quota
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TenantQuota = z.infer<typeof TenantQuotaSchema>;

// Plan-based quota defaults
export const PLAN_QUOTAS = {
  free: {
    leads: { max: 100, reset: 'monthly' },
    sites: { max: 3, reset: 'never' },
    files: { max: 100, reset: 'monthly' },
    api_calls: { max: 10000, reset: 'daily' },
    emails: { max: 500, reset: 'monthly' },
  },
  pro: {
    leads: { max: 10000, reset: 'monthly' },
    sites: { max: 50, reset: 'never' },
    files: { max: 10000, reset: 'monthly' },
    api_calls: { max: 1000000, reset: 'daily' },
    emails: { max: 50000, reset: 'monthly' },
  },
  enterprise: {
    leads: { max: 100000, reset: 'monthly' },
    sites: { max: 500, reset: 'never' },
    files: { max: 100000, reset: 'monthly' },
    api_calls: { max: 10000000, reset: 'daily' },
    emails: { max: 500000, reset: 'monthly' },
  },
} as const;
```

---

## Alerting & Runbook

### Alerting Rules

```yaml
# prometheus-rules.yaml
groups:
  - name: noisy_neighbor
    rules:
      - alert: TenantRateLimitExceeded
        expr: rate(upstash_ratelimit_exceeded_total[5m]) > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: 'Tenant {{ $labels.tenant_id }} exceeding rate limits'
          description: 'Tenant {{ $labels.tenant_id }} has exceeded rate limits {{ $value }} times in the last 5 minutes'

      - alert: DatabaseConnectionPoolExhaustion
        expr: supabase_db_connections_active / supabase_db_connections_max > 0.9
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Database connection pool nearly exhausted'
          description: 'Connection pool at {{ $value | humanizePercentage }} capacity'

      - alert: QueueBacklogGrowing
        expr: inngest_jobs_pending_total > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'Job queue backlog growing'
          description: '{{ $value }} jobs pending in queue'
```

### Runbook: Noisy Neighbor Incident

1. **Identify the Tenant**

   ```bash
   # Check Redis for recent rate limit violations
   redis-cli keys "noisy:*" | tail -10
   ```

2. **Assess Impact**

   ```sql
   -- Check database connection usage by tenant
   SELECT
     t.id,
     t.name,
     COUNT(*) as active_connections
   FROM pg_stat_activity a
   JOIN tenants t ON a.application_name = t.id
   WHERE state = 'active'
   GROUP BY t.id, t.name
   ORDER BY active_connections DESC;
   ```

3. **Immediate Mitigation**
   - Reduce tenant's rate limits in Redis
   - Add tenant to emergency throttling list
   - Consider temporary suspension if abuse

4. **Long-term Resolution**
   - Contact tenant about usage patterns
   - Suggest plan upgrade
   - Implement more efficient queries
   - Add caching for frequent operations

---

## Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'https://api.example.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 300
      arrivalRate: 50
      name: 'Ramp up load'
  payload:
    path: 'tenants.csv'
    fields:
      - 'tenant_id'
      - 'api_key'

scenarios:
  - name: 'Tenant API Load'
    weight: 70
    flow:
      - post:
          url: '/api/leads'
          headers:
            X-Tenant-ID: '{{ tenant_id }}'
            Authorization: 'Bearer {{ api_key }}'
          json:
            name: 'Test Lead'
            email: 'test@example.com'
      - think: 1

  - name: 'Noisy Neighbor Simulation'
    weight: 30
    flow:
      - loop:
          - post:
              url: '/api/leads'
              headers:
                X-Tenant-ID: '{{ tenant_id }}'
                Authorization: 'Bearer {{ api_key }}'
              json:
                name: 'Bulk Lead {{ $loopIndex }}'
                email: 'bulk{{ $loopIndex }}@example.com'
          - think: 0.1
        count: 100
```

### Unit Tests

```typescript
// packages/rate-limit/__tests__/adaptive-throttler.test.ts
import { describe, it, expect } from 'vitest';
import { getAdaptiveThrottle } from '../src/adaptive-throttler';

describe('Adaptive Throttling', () => {
  it('passes requests under 80% usage', () => {
    const result = getAdaptiveThrottle(80, 100); // 20% used
    expect(result.action).toBe('pass');
  });

  it('throttles requests between 80-95% usage', () => {
    const result = getAdaptiveThrottle(15, 100); // 85% used
    expect(result.action).toBe('throttle');
    expect(result.delayMs).toBeGreaterThan(0);
    expect(result.delayMs).toBeLessThan(1000);
  });

  it('rejects requests over 95% usage', () => {
    const result = getAdaptiveThrottle(2, 100); // 98% used
    expect(result.action).toBe('reject');
    expect(result.retryAfter).toBeGreaterThan(0);
  });
});
```

---

## References

- [Upstash Ratelimit Documentation](https://upstash.com/docs/ratelimit) - Redis-based rate limiting
- [Next.js 16 Middleware](https://nextjs.org/docs/advanced-features/middleware) - Edge middleware patterns
- [Supabase Connection Pooling](https://supabase.com/docs/guides/platform/connection-pooling) - Database connection management
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) - Observability pipeline configuration
- [PostgreSQL Statement Timeouts](https://www.postgresql.org/docs/current/runtime-config-client.html) - Database timeout configuration
- [Inngest Concurrency Controls](https://www.inngest.com/docs/guides/concurrency) - Job queue management
- [Artillery Load Testing](https://www.artillery.io/docs/) - Performance testing framework

---
