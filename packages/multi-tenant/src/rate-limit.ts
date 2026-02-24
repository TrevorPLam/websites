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

  // Default tier limits
  return { limit: 200, window: '10 s' };
}

export async function setDynamicRateLimit(
  tenantId: string,
  limit: number,
  window: string
): Promise<void> {
  await redis.set(
    `tenant:ratelimit:override:${tenantId}`,
    { limit, window },
    { ex: 60 * 60 * 24 * 30 } // 30-day TTL (re-configure monthly)
  );
}
