import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Redis instance
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

  // Contact form submissions: 3 per hour per IP
  contactForm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: '@rl/contact-form',
    analytics: true,
    timeout: 1000,
  }),

  // Password reset: 3 per hour per email
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: '@rl/password-reset',
    analytics: true,
    timeout: 1000,
  }),

  // Sign up attempts: 5 per hour per IP
  signUp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: '@rl/signup',
    analytics: true,
    timeout: 1000,
  }),
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type RateLimitTier = 'starter' | 'professional' | 'enterprise' | 'anonymous';
export type EndpointLimiter = keyof typeof rateLimiters;

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export type RateLimitConfig = {
  tier: RateLimitTier;
  customLimits?: Record<string, { limit: number; window: string }>;
  enableAnalytics: boolean;
};

export type RateLimitHealth = {
  redisConnected: boolean;
  activeLimiters: string[];
  errorCount: number;
};

export type RateLimitAnalytics = {
  totalRequests: number;
  blockedRequests: number;
  topTenants: Array<{ tenantId: string; requests: number }>;
  topEndpoints: Array<{ endpoint: string; requests: number }>;
};

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

async function getTenantTierFromDB(
  tenantId: string
): Promise<'starter' | 'professional' | 'enterprise'> {
  // This should be implemented with your actual database client
  // Example with Supabase:
  // const { data, error } = await supabase
  //   .from('tenants')
  //   .select('tier')
  //   .eq('id', tenantId)
  //   .single();
  // return data?.tier ?? 'starter';

  // Default fallback
  return 'starter';
}

// ============================================================================
// DYNAMIC RATE LIMITS (per-tenant overrides)
// Allows enterprise clients to negotiate custom limits
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
// TENANT TIER LOOKUP (with caching)
// ============================================================================

export async function getTenantTier(
  tenantId: string
): Promise<'starter' | 'professional' | 'enterprise'> {
  // Cache tier information for 1 hour
  const cacheKey = `tenant:tier:${tenantId}`;
  const cached = await redis.get<'starter' | 'professional' | 'enterprise'>(cacheKey);
  if (cached) return cached;

  const tier = await getTenantTierFromDB(tenantId);
  await redis.set(cacheKey, tier, { ex: 3600 });

  return tier;
}

export async function clearTenantTierCache(tenantId: string): Promise<void> {
  await redis.del(`tenant:tier:${tenantId}`);
}

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

export function createRateLimitMiddleware(
  options: {
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  } = {}
) {
  return async function rateLimitMiddleware(request: NextRequest) {
    const tenantId = request.headers.get('X-Tenant-Id');
    const ip = getClientIP(request);

    if (!ip) {
      return NextResponse.next(); // Skip rate limiting if no IP
    }

    try {
      // Get appropriate rate limiter based on tenant tier
      let limiter: Ratelimit;
      let identifier: string;

      if (tenantId) {
        const tier = await getTenantTier(tenantId);
        limiter = rateLimiters[tier];
        identifier = `${tenantId}:${ip}`;
      } else {
        limiter = rateLimiters.anonymous;
        identifier = ip;
      }

      // Check for dynamic override
      if (tenantId) {
        const dynamicLimit = await getDynamicRateLimit(tenantId);
        if (dynamicLimit) {
          limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(dynamicLimit.limit, dynamicLimit.window as any),
            prefix: `@rl/custom:${tenantId}`,
            analytics: true,
            timeout: 1000,
          });
        }
      }

      // Check rate limit
      const { success, limit, remaining, reset } = await limiter.limit(identifier);

      // Add rate limit headers
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      // Return 429 if rate limited
      if (!success) {
        return new Response(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request on error
      return NextResponse.next();
    }
  };
}

// ============================================================================
// ENDPOINT-SPECIFIC RATE LIMITING
// ============================================================================

export async function checkEndpointRateLimit(
  endpoint: EndpointLimiter,
  identifier: string
): Promise<RateLimitResult> {
  const limiter = rateLimiters[endpoint];
  return await limiter.limit(identifier);
}

export function createEndpointRateLimitMiddleware(
  endpoint: EndpointLimiter,
  getIdentifier?: (request: NextRequest) => string | null
) {
  return async function endpointRateLimitMiddleware(request: NextRequest) {
    const identifier = getIdentifier
      ? getIdentifier(request)
      : (getClientIP(request) ?? 'anonymous');

    if (!identifier) {
      return NextResponse.next();
    }

    try {
      const { success, limit, remaining, reset } = await checkEndpointRateLimit(
        endpoint,
        identifier
      );

      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      if (!success) {
        return new Response(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded for this endpoint. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      return response;
    } catch (error) {
      console.error('Endpoint rate limiting error:', error);
      return NextResponse.next();
    }
  };
}

// ============================================================================
// RATE LIMITING UTILITIES
// ============================================================================

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  // NextRequest.ip is available in newer Next.js versions
  const ip = (request as any).ip;

  return forwarded?.split(',')[0]?.trim() ?? real ?? ip ?? null;
}

export function getRateLimitKey(tenantId: string, ip: string, endpoint?: string): string {
  const base = `${tenantId}:${ip}`;
  return endpoint ? `${base}:${endpoint}` : base;
}

export async function isRateLimited(
  tenantId: string,
  ip: string,
  endpoint?: EndpointLimiter
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

export async function getRateLimitHealth(): Promise<RateLimitHealth> {
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
// RATE LIMITING ANALYTICS
// ============================================================================

export async function getRateLimitAnalytics(): Promise<RateLimitAnalytics> {
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
// RATE LIMITING CONFIGURATION
// ============================================================================

export async function updateRateLimitConfig(
  tenantId: string,
  config: RateLimitConfig
): Promise<void> {
  // Update tenant tier in database
  // await supabase.from('tenants').update({ tier: config.tier }).eq('id', tenantId);

  // Clear tier cache
  await clearTenantTierCache(tenantId);

  // Set custom limits if provided
  if (config.customLimits) {
    for (const [endpoint, limitConfig] of Object.entries(config.customLimits)) {
      await redis.set(`tenant:ratelimit:${endpoint}:${tenantId}`, limitConfig, { ex: 86400 });
    }
  }
}

// ============================================================================
// COMBINED MIDDLEWARE (Tenant + Billing + Rate Limit)
// ============================================================================

export async function checkAllRateLimits(
  request: NextRequest,
  options: {
    tenantId?: string;
    endpoints?: EndpointLimiter[];
  } = {}
): Promise<{ allowed: boolean; response?: Response }> {
  const tenantId = options.tenantId ?? request.headers.get('X-Tenant-Id') ?? 'anonymous';
  const ip = getClientIP(request);

  if (!ip) {
    return { allowed: true };
  }

  // Check general rate limit
  const generalLimited = await isRateLimited(tenantId, ip);
  if (generalLimited) {
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({ error: 'Too Many Requests', message: 'General rate limit exceeded' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  // Check endpoint-specific limits
  if (options.endpoints) {
    for (const endpoint of options.endpoints) {
      const limited = await isRateLimited(tenantId, ip, endpoint);
      if (limited) {
        return {
          allowed: false,
          response: new Response(
            JSON.stringify({
              error: 'Too Many Requests',
              message: `Rate limit exceeded for ${endpoint}`,
            }),
            {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            }
          ),
        };
      }
    }
  }

  return { allowed: true };
}
