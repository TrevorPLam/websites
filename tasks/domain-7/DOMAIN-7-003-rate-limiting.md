---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-7-003
title: 'Noisy neighbor prevention with complete rate limiting'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-7-003-rate-limiting
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-7-003 · Noisy neighbor prevention with complete rate limiting

## Objective

Implement complete rate limiting system following section 7.5 specification with tiered rate limiters, sliding window algorithms, endpoint-specific limits, and dynamic rate limit overrides for multi-tenant noisy neighbor prevention.

---

## Context

**Documentation Reference:**

- Tenant Resolution Implementation: `docs/guides/multi-tenant/tenant-resolution-implementation.md` ✅ COMPLETED
- Billing Status Validation: `docs/guides/multi-tenant/billing-status-validation.md` ✅ COMPLETED
- Tenant Suspension Patterns: `docs/guides/multi-tenant/tenant-suspension-patterns.md` ✅ COMPLETED
- Noisy Neighbor Prevention: `docs/guides/multi-tenant/noisy-neighbor-prevention.md` ✅ COMPLETED
- Domain Lifecycle Management: `docs/guides/multi-tenant/domain-lifecycle-management.md` ✅ COMPLETED
- Enterprise Sso Integration: `docs/guides/multi-tenant/enterprise-sso-integration.md` ✅ COMPLETED
- Routing Strategy Comparison: `docs/guides/multi-tenant/routing-strategy-comparison.md` ✅ COMPLETED
- Tenant Metadata Factory: `docs/guides/multi-tenant/tenant-metadata-factory.md` ✅ COMPLETED
- Tenant Resolution Sequence Diagram: `docs/guides/multi-tenant/tenant-resolution-sequence-diagram.md` ❌ MISSING (P0)
- Tenant Data Flow Patterns: `docs/guides/multi-tenant/tenant-data-flow-patterns.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Multi-tenant rate limiting — Resource usage and abuse prevention

**Related files:** Rate limiting middleware, tier management, endpoint protection

**Dependencies:** Upstash Redis for rate limiting, tenant tier system, middleware integration

**Prior work**: Basic rate limiting awareness exists but lacks comprehensive tiered system and endpoint-specific protection

**Constraints:** Must follow section 7.5 specification with sliding window algorithms and per-tenant tier management

---

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Rate Limiting | Upstash Redis with sliding window algorithms    |
| Tiers         | Starter, Professional, Enterprise limits        |
| Endpoints     | Lead forms, auth, webhooks with specific limits |
| Analytics     | Upstash console integration for monitoring      |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement complete rate limiting following section 7.5 specification
- [ ] **[Agent]** Create tiered rate limiters with sliding window algorithms
- [ ] **[Agent]** Add endpoint-specific rate limiting for critical endpoints
- [ ] **[Agent]** Implement dynamic rate limit overrides for enterprise clients
- [ ] **[Agent]** Add middleware integration with automatic rate limiting
- [ ] **[Agent]** Create rate limiting analytics and monitoring
- [ ] **[Agent]** Test rate limiting across all tiers and endpoints
- [ ] **[Human]** Verify rate limiting follows section 7.5 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 7.5 specification** — Extract rate limiting requirements
- [ ] **[Agent]** **Create tiered rate limiters** — Implement sliding window algorithms
- [ ] **[Agent]** **Add endpoint-specific limits** — Protect critical endpoints
- [ ] **[Agent]** **Implement dynamic overrides** — Add enterprise customization
- [ ] **[Agent]** **Add middleware integration** — Automatic rate limiting enforcement
- [ ] **[Agent]** **Create analytics system** — Monitor rate limiting effectiveness
- [ ] **[Agent]** **Test rate limiting** — Verify all limits work correctly

> ⚠️ **Agent Question**: Ask human before proceeding if any existing rate limiting needs migration to new tiered system.

---

## Commands

```bash
# Test rate limiting
pnpm test --filter="@repo/multi-tenant"

# Test tiered rate limiting
node -e "
import { rateLimiters } from '@repo/multi-tenant/rate-limit';
const result = await rateLimiters.starter.limit('tenant-123:1.2.3.4');
console.log('Rate limit result:', result);
"

# Test endpoint-specific rate limiting
node -e "
import { rateLimiters } from '@repo/multi-tenant/rate-limit';
const result = await rateLimiters.leadFormSubmission.limit('tenant-123:1.2.3.4');
console.log('Lead form rate limit result:', result);
"

# Test dynamic rate limit overrides
node -e "
import { getDynamicRateLimit, setDynamicRateLimit } from '@repo/multi-tenant/rate-limit';
await setDynamicRateLimit('tenant-123', { limit: 500, window: '10 s' });
const override = await getDynamicRateLimit('tenant-123');
console.log('Dynamic rate limit:', override);
"

# Test rate limiting analytics
node -e "
import { getRateLimitAnalytics } from '@repo/multi-tenant/rate-limit';
const analytics = await getRateLimitAnalytics();
console.log('Rate limit analytics:', analytics);
"
```

---

## Code Style

```typescript
// ✅ Correct — Complete rate limiting following section 7.5
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// ============================================================================
// TIERED RATE LIMITERS (Sliding Window algorithm)
// Sliding window provides smooth rate limiting without burst spikes at window edges.
// Reference: https://upstash.com/docs/redis/sdks/ratelimit-ts/features
// ============================================================================

export const rateLimiters = {
  // Starter: 50 req / 10 seconds per tenant+IP
  starter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '10 s'),
    prefix: '@rl/starter',
    analytics: true, // Track in Upstash console
    timeout: 1000, // Don't block request more than 1s waiting for Redis
  }),

  // Professional: 200 req / 10 seconds per tenant+IP
  professional: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, '10 s'),
    prefix: '@rl/professional',
    analytics: true,
    timeout: 1000,
  }),

  // Enterprise: 1,000 req / 10 seconds per tenant+IP
  enterprise: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '10 s'),
    prefix: '@rl/enterprise',
    analytics: true,
    timeout: 1000,
  }),

  // Anonymous / bot: 10 req / 10 seconds per IP
  anonymous: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    prefix: '@rl/anon',
    analytics: true,
    timeout: 1000,
  }),

  // ============================================================================
  // SECONDARY LIMITERS — Endpoint-specific, prevent API abuse
  // ============================================================================

  // Lead form submissions: 5 per hour per IP (prevents spam)
  leadFormSubmission: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: '@rl/lead-form',
    analytics: true,
    timeout: 1000,
  }),

  // Auth login attempts: 10 per 15 minutes per IP (prevents brute force)
  authLogin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '15 m'),
    prefix: '@rl/auth-login',
    analytics: true,
    timeout: 1000,
  }),

  // Webhook ingest: 100 per minute per provider (prevents webhook floods)
  webhookIngest: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: '@rl/webhook',
    analytics: true,
    timeout: 1000,
  }),

  // API requests: 1000 per minute per tenant (general API protection)
  apiRequests: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 m'),
    prefix: '@rl/api',
    analytics: true,
    timeout: 1000,
  }),
} as const;

// ============================================================================
// DYNAMIC RATE LIMITS (Upstash 2026 feature — per-tenant overrides)
// Allows enterprise clients to negotiate custom limits
// Reference: https://upstash.com/blog/dynamic-rate-limits
// ============================================================================

export async function getDynamicRateLimit(
  tenantId: string
): Promise<{ limit: number; window: string }> {
  // Check for custom limit override in Redis
  const override = await redis.get<{ limit: number; window: string }>(
    `tenant:ratelimit:override:${tenantId}`
  );
  if (override) return override;

  // Default limits based on tenant tier
  const tier = await getTenantTier(tenantId);
  switch (tier) {
    case 'starter':
      return { limit: 50, window: '10 s' };
    case 'professional':
      return { limit: 200, window: '10 s' };
    case 'enterprise':
      return { limit: 1000, window: '10 s' };
    default:
      return { limit: 10, window: '10 s' }; // Anonymous fallback
  }
}

export async function setDynamicRateLimit(
  tenantId: string,
  config: { limit: number; window: string }
): Promise<void> {
  await redis.set(`tenant:ratelimit:override:${tenantId}`, config, {
    ex: 86400, // 24 hours
  });
}

export async function removeDynamicRateLimit(tenantId: string): Promise<void> {
  await redis.del(`tenant:ratelimit:override:${tenantId}`);
}

// ============================================================================
// TENANT TIER LOOKUP
// ============================================================================

async function getTenantTier(tenantId: string): Promise<'starter' | 'professional' | 'enterprise'> {
  // Cache tier information for 1 hour
  const cacheKey = `tenant:tier:${tenantId}`;
  const cached = await redis.get<'starter' | 'professional' | 'enterprise'>(cacheKey);
  if (cached) return cached;

  const { data: tenant } = await db.from('tenants').select('tier').eq('id', tenantId).single();

  const tier = tenant?.tier ?? 'starter';
  await redis.set(cacheKey, tier, { ex: 3600 });

  return tier;
}

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

export function createRateLimitMiddleware() {
  return async function rateLimitMiddleware(request: NextRequest) {
    const tenantId = request.headers.get('X-Tenant-Id');
    const ip = getClientIP(request);

    if (!tenantId || !ip) {
      return NextResponse.next(); // Skip rate limiting if no context
    }

    // Get appropriate rate limiter based on tenant tier
    const tier = await getTenantTier(tenantId);
    const dynamicLimit = await getDynamicRateLimit(tenantId);

    // Create custom rate limiter for this tenant
    const customLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(dynamicLimit.limit, dynamicLimit.window),
      prefix: `@rl/custom:${tenantId}`,
      analytics: true,
      timeout: 1000,
    });

    // Check rate limit
    const identifier = `${tenantId}:${ip}`;
    const { success, limit, remaining, reset } = await customLimiter.limit(identifier);

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    // Return 429 if rate limited
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      });
    }

    return response;
  };
}

// ============================================================================
// ENDPOINT-SPECIFIC RATE LIMITING
// ============================================================================

export async function checkEndpointRateLimit(
  endpoint: keyof typeof rateLimiters,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = rateLimiters[endpoint];
  return await limiter.limit(identifier);
}

// ============================================================================
// RATE LIMITING ANALYTICS
// ============================================================================

export async function getRateLimitAnalytics(): Promise<{
  totalRequests: number;
  blockedRequests: number;
  topTenants: Array<{ tenantId: string; requests: number }>;
  topEndpoints: Array<{ endpoint: string; requests: number }>;
}> {
  // This would integrate with Upstash analytics API
  // For now, return placeholder data
  return {
    totalRequests: 0,
    blockedRequests: 0,
    topTenants: [],
    topEndpoints: [],
  };
}

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = request.ip;

  return forwarded?.split(',')[0] ?? real ?? ip ?? 'unknown';
}

export function getRateLimitKey(tenantId: string, ip: string, endpoint?: string): string {
  const base = `${tenantId}:${ip}`;
  return endpoint ? `${base}:${endpoint}` : base;
}

export async function isRateLimited(
  tenantId: string,
  ip: string,
  endpoint?: keyof typeof rateLimiters
): Promise<boolean> {
  const key = getRateLimitKey(tenantId, ip, endpoint);

  if (endpoint) {
    const { success } = await checkEndpointRateLimit(endpoint, key);
    return !success;
  }

  // Check general rate limit
  const tier = await getTenantTier(tenantId);
  const limiter = rateLimiters[tier];
  const { success } = await limiter.limit(key);

  return !success;
}

// ============================================================================
// RATE LIMITING HEALTH CHECK
// ============================================================================

export async function getRateLimitHealth(): Promise<{
  redisConnected: boolean;
  activeLimiters: string[];
  errorCount: number;
}> {
  try {
    // Test Redis connection
    await redis.ping();

    const activeLimiters = Object.keys(rateLimiters);

    return {
      redisConnected: true,
      activeLimiters,
      errorCount: 0,
    };
  } catch (error) {
    return {
      redisConnected: false,
      activeLimiters: [],
      errorCount: 1,
    };
  }
}

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================

export interface RateLimitConfig {
  tier: 'starter' | 'professional' | 'enterprise';
  customLimits?: Record<string, { limit: number; window: string }>;
  enableAnalytics: boolean;
}

export async function updateRateLimitConfig(
  tenantId: string,
  config: RateLimitConfig
): Promise<void> {
  // Update tenant tier
  await db.from('tenants').update({ tier: config.tier }).eq('id', tenantId);

  // Clear tier cache
  await redis.del(`tenant:tier:${tenantId}`);

  // Set custom limits if provided
  if (config.customLimits) {
    for (const [endpoint, limitConfig] of Object.entries(config.customLimits)) {
      await redis.set(`tenant:ratelimit:${endpoint}:${tenantId}`, limitConfig, { ex: 86400 });
    }
  }
}
```

**Rate limiting principles:**

- **Sliding window algorithms**: Smooth rate limiting without burst spikes
- **Tiered limits**: Different limits for starter, professional, enterprise
- **Endpoint-specific protection**: Critical endpoints have dedicated limits
- **Dynamic overrides**: Enterprise clients can negotiate custom limits
- **Analytics integration**: Track rate limiting effectiveness in Upstash console
- **Middleware integration**: Automatic rate limiting enforcement
- **Health monitoring**: Monitor rate limiter health and performance

---

## Boundaries

| Tier             | Scope                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 7.5 specification; implement sliding window algorithms; add tiered limits; protect endpoints; enable analytics |
| ⚠️ **Ask first** | Changing existing rate limiting patterns; modifying tier definitions; updating middleware integration                         |
| 🚫 **Never**     | Skip endpoint-specific protection; ignore analytics; bypass sliding window algorithms; expose rate limit keys                 |

---

## Success Verification

- [ ] **[Agent]** Test tiered rate limiting — Different limits work per tier
- [ ] **[Agent]** Verify sliding window algorithm — Smooth rate limiting without spikes
- [ ] **[Agent]** Test endpoint-specific limits — Critical endpoints protected
- [ ] **[Agent]** Verify dynamic overrides — Enterprise custom limits work
- [ ] **[Agent]** Test middleware integration — Automatic enforcement works
- [ ] **[Agent]** Test analytics tracking — Rate limit data captured correctly
- [ ] **[Agent]** Test health monitoring — Rate limiter health tracked
- [ ] **[Human]** Test with real traffic — Production rate limiting works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Redis connectivity**: Handle Redis failures gracefully with fallback behavior
- **IP detection**: Properly extract client IP from various headers
- **Rate limit keys**: Ensure keys are unique and don't collide across tenants
- **Analytics overhead**: Minimize performance impact of analytics tracking
- **Dynamic limit validation**: Validate custom limits are reasonable
- **Concurrent requests**: Handle multiple simultaneous requests correctly

---

## Out of Scope

- Tenant resolution system (handled in separate task)
- Billing status checking (handled in separate task)
- SAML/SSO integration (handled in separate task)
- Vercel domain management (handled in separate task)

---

## References

- [Section 7.5 Noisy Neighbor Prevention](docs/plan/domain-7/7.5-noisy-neighbor-prevention-complete-rate-limiting.md)
- [Section 7.1 Philosophy](docs/plan/domain-7/7.1-philosophy.md)
- [Section 7.8 Complete Tenant Resolution Sequence Diagram](docs/plan/domain-7/7.8-complete-tenant-resolution-sequence-diagram.md)
- [Upstash Rate Limiting Documentation](https://upstash.com/docs/redis/sdks/ratelimit-ts/features)
- [Dynamic Rate Limits Blog](https://upstash.com/blog/dynamic-rate-limits)
- [Rate Limiting Best Practices](https://kitemetric.com/blogs/rate-limiting-best-practices)
