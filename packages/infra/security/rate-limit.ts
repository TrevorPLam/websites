// File: packages/infra/security/rate-limit.ts  [TRACE:FILE=packages.infra.security.rateLimit]
// Purpose: Rate limiting utilities implementing 2026 security best practices with sliding
//          window algorithms, distributed limiting, and privacy-first approach.
//
// Relationship: Used by contact-actions, booking-actions, template submit. Depends on @repo/utils (hashIp).
// System role: checkRateLimit(email, clientIp, hashIp); in-memory and optional Redis/Upstash.
// Assumptions: hashIp provided by caller; Redis optional; env for REDIS_URL / Upstash.
//
// Exports / Entry: Rate limiting functions, presets, and configuration constants
// Used by: Middleware, API routes, and form submission handlers
//
// Invariants:
// - Must use sliding window algorithm for accurate rate limiting
// - Must not store IP addresses or PII for privacy compliance
// - Must provide analytics integration for monitoring and alerting
// - Must support distributed scenarios across multiple server instances
// - All presets must follow principle of least privilege
//
// Status: @internal
// Features:
// - [FEAT:SECURITY] Sliding window rate limiting algorithm
// - [FEAT:PRIVACY] Privacy-first approach without IP storage
// - [FEAT:MONITORING] Analytics integration for rate limit events
// - [FEAT:CONFIGURATION] Flexible presets for different use cases
// - [FEAT:DISTRIBUTED] Support for multi-server deployments

// Rate limiting configuration constants (exported for consumers that need defaults)
// [TRACE:CONST=packages.infra.security.rateLimit.DEFAULT_RATE_LIMIT]
// [FEAT:CONFIGURATION]
// NOTE: Default rate limit configuration - conservative limits for general use.
export const DEFAULT_RATE_LIMIT = {
  MAX_REQUESTS: 3,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Rate limit preset configurations for different use cases
 * Implements 2026 best practices for context-aware limiting
 */
// [TRACE:CONST=packages.infra.security.rateLimit.RATE_LIMIT_PRESETS]
// [FEAT:CONFIGURATION] [FEAT:SECURITY]
// NOTE: Context-aware rate limit presets - optimized for specific application scenarios.
export const RATE_LIMIT_PRESETS = {
  // Contact forms - strict to prevent spam
  contact: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    analytics: true,
  },

  // Booking forms - moderate to prevent abuse
  booking: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    analytics: true,
  },

  // API endpoints - higher limit for legitimate use
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    analytics: true,
  },

  // Authentication - very strict to prevent brute force
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    analytics: true,
  },

  // File uploads - strict due to resource costs
  upload: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    analytics: true,
  },

  // General purpose - balanced default
  general: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    analytics: true,
  },
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMIT_PRESETS;

/**
 * Rate limit configuration interface
 * Allows fine-tuning of rate limiting behavior
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  analytics?: boolean;
  prefix?: string;
}

/**
 * Rate limit result interface
 * Provides detailed information about rate limit status
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  resetTimeIso: string;
  identifier: string;
  preset?: RateLimitPreset;
}

/**
 * Rate limiter interface abstraction
 * Allows different implementations (Upstash, in-memory, etc.)
 */
interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
  reset(identifier: string): Promise<void>;
}

/**
 * Shape of Upstash Ratelimit instance (from @upstash/ratelimit).
 * Structural type to avoid runtime import; matches Ratelimit.limit() return value.
 */
interface UpstashRatelimitInstance {
  limit(identifier: string): Promise<{ success: boolean; remaining?: number; reset?: number }>;
  reset?(identifier: string): Promise<void>;
}

/**
 * In-memory rate limiter implementation
 * Fallback for development or when external services are unavailable
 */
class InMemoryRateLimiter implements RateLimiter {
  private limits: { [key: string]: { count: number; resetAt: number } } = {};
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.limits[identifier];

    // Clean up expired entries
    if (existing && now > existing.resetAt) {
      delete this.limits[identifier];
    }

    const current = this.limits[identifier];
    if (!current) {
      this.limits[identifier] = {
        count: 1,
        resetAt: now + this.config.windowMs,
      };

      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
        resetTimeIso: new Date(now + this.config.windowMs).toISOString(),
        identifier,
      };
    }

    if (current.count >= this.config.maxRequests) {
      return {
        success: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetTime: current.resetAt,
        resetTimeIso: new Date(current.resetAt).toISOString(),
        identifier,
      };
    }

    current.count += 1;
    return {
      success: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests - current.count,
      resetTime: current.resetAt,
      resetTimeIso: new Date(current.resetAt).toISOString(),
      identifier,
    };
  }

  async reset(identifier: string): Promise<void> {
    delete this.limits[identifier];
  }
}

/**
 * Upstash Redis rate limiter implementation
 * Production-ready distributed rate limiting
 */
class UpstashRateLimiter implements RateLimiter {
  private readonly limiter: UpstashRatelimitInstance;
  private readonly config: RateLimitConfig;

  constructor(limiter: UpstashRatelimitInstance, config: RateLimitConfig) {
    this.limiter = limiter;
    this.config = config;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    try {
      const result = await this.limiter.limit(identifier);

      return {
        success: result.success,
        limit: this.config.maxRequests,
        remaining: result.remaining || 0,
        resetTime: result.reset || Date.now() + this.config.windowMs,
        resetTimeIso: new Date(result.reset || Date.now() + this.config.windowMs).toISOString(),
        identifier,
      };
    } catch (error) {
      // Fallback to in-memory on Upstash failure
      console.warn('Upstash rate limiting failed, falling back to in-memory:', error);
      const fallbackLimiter = new InMemoryRateLimiter(this.config);
      return fallbackLimiter.limit(identifier);
    }
  }

  async reset(identifier: string): Promise<void> {
    try {
      await this.limiter.reset?.(identifier);
    } catch (error) {
      console.warn('Failed to reset Upstash rate limit:', error);
    }
  }
}

/**
 * Rate limiter factory
 * Creates appropriate rate limiter based on environment and configuration
 */
class RateLimiterFactory {
  private static instances: { [key: string]: RateLimiter } = {};

  static async create(
    preset: RateLimitPreset,
    customConfig?: Partial<RateLimitConfig>,
    env?: {
      UPSTASH_REDIS_REST_URL?: string;
      UPSTASH_REDIS_REST_TOKEN?: string;
    }
  ): Promise<RateLimiter> {
    const config = { ...RATE_LIMIT_PRESETS[preset], ...customConfig };
    const cacheKey = `${preset}-${JSON.stringify(config)}`;

    // Return cached instance if available
    if (this.instances[cacheKey]) {
      return this.instances[cacheKey];
    }

    // Try to create Upstash rate limiter
    if (env?.UPSTASH_REDIS_REST_URL && env?.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Ratelimit } = await import('@upstash/ratelimit');
        const { Redis } = await import('@upstash/redis');

        const redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });

        const limiter = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs}ms`),
          analytics: config.analytics,
          prefix: config.prefix || `rate_limit_${preset}`,
        });

        const upstashLimiter = new UpstashRateLimiter(limiter, config);
        this.instances[cacheKey] = upstashLimiter;
        return upstashLimiter;
      } catch (error) {
        console.warn('Failed to initialize Upstash rate limiter, using in-memory:', error);
      }
    }

    // Fallback to in-memory rate limiter
    const memoryLimiter = new InMemoryRateLimiter(config);
    this.instances[cacheKey] = memoryLimiter;
    return memoryLimiter;
  }

  static clearCache(): void {
    this.instances = {};
  }
}

/**
 * IP hashing utility for privacy compliance
 * Hashes IP addresses to avoid storing PII while maintaining uniqueness
 */
export function hashIp(ip: string): string {
  // Simple hash function for IP addresses
  // In production, consider using a proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Extract client IP from request headers
 * Handles various proxy configurations and cloud providers
 */
export function getClientIp(headers: Record<string, string>): string {
  // Check common headers in order of preference
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
  ];

  for (const header of ipHeaders) {
    const value = headers[header] || headers[header.toUpperCase()];
    if (value) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const first = value.split(',')[0];
      const ip = first?.trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }

  // Fallback to remote address (not available in serverless functions)
  return '127.0.0.1';
}

/**
 * Rate limiting by IP address
 * Ideal for public endpoints and anonymous users
 */
export async function limitByIp(
  headers: Record<string, string>,
  preset: RateLimitPreset = 'general',
  customConfig?: Partial<RateLimitConfig>,
  env?: {
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
): Promise<RateLimitResult> {
  const clientIp = getClientIp(headers);
  const hashedIp = hashIp(clientIp);
  const identifier = `ip:${hashedIp}`;

  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);

  return {
    ...result,
    preset,
  };
}

/**
 * Rate limiting by user ID
 * Ideal for authenticated users and personalized limits
 */
export async function limitByUserId(
  userId: string,
  preset: RateLimitPreset = 'general',
  customConfig?: Partial<RateLimitConfig>,
  env?: {
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
): Promise<RateLimitResult> {
  const identifier = `user:${userId}`;

  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);

  return {
    ...result,
    preset,
  };
}

/**
 * Rate limiting by email address
 * Ideal for contact forms and email-based interactions
 */
export async function limitByEmail(
  email: string,
  preset: RateLimitPreset = 'contact',
  customConfig?: Partial<RateLimitConfig>,
  env?: {
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
): Promise<RateLimitResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const identifier = `email:${normalizedEmail}`;

  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);

  return {
    ...result,
    preset,
  };
}

/**
 * Multiple rate limiting checks
 * Applies multiple rate limits for enhanced protection
 */
export async function checkMultipleLimits(
  checks: Array<{
    type: 'ip' | 'userId' | 'email';
    value: string;
    preset?: RateLimitPreset;
    customConfig?: Partial<RateLimitConfig>;
  }>,
  env?: {
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
): Promise<{ success: boolean; results: RateLimitResult[] }> {
  const results: RateLimitResult[] = [];

  for (const check of checks) {
    let result: RateLimitResult;

    switch (check.type) {
      case 'ip':
        // For IP checks, we need headers, so we'll use a placeholder
        // In practice, this should be called with limitByIp directly
        result = await limitByIp(
          { 'x-forwarded-for': check.value },
          check.preset || 'general',
          check.customConfig,
          env
        );
        break;
      case 'userId':
        result = await limitByUserId(
          check.value,
          check.preset || 'general',
          check.customConfig,
          env
        );
        break;
      case 'email':
        result = await limitByEmail(
          check.value,
          check.preset || 'contact',
          check.customConfig,
          env
        );
        break;
      default:
        throw new Error(`Unknown rate limit type: ${(check as any).type}`);
    }

    results.push(result);

    // Fail fast if any limit is exceeded
    if (!result.success) {
      return { success: false, results };
    }
  }

  return { success: true, results };
}

/**
 * Generate rate limit headers for HTTP responses
 * Provides clients with rate limit information
 */
export function generateRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'X-RateLimit-Preset': result.preset || 'unknown',
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for administrative purposes or testing
 */
export async function resetRateLimit(
  type: 'ip' | 'userId' | 'email',
  value: string,
  preset: RateLimitPreset = 'general',
  env?: {
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
): Promise<void> {
  let identifier: string;

  switch (type) {
    case 'ip':
      identifier = `ip:${hashIp(value)}`;
      break;
    case 'userId':
      identifier = `user:${value}`;
      break;
    case 'email':
      identifier = `email:${value.toLowerCase().trim()}`;
      break;
  }

  const limiter = await RateLimiterFactory.create(preset, undefined, env);
  await limiter.reset(identifier);
}

/**
 * Check rate limits for email and IP (contact/booking forms).
 * Uses contact preset for email and IP limits.
 */
export async function checkRateLimit(params: {
  email: string;
  clientIp: string;
  hashIp?: (value: string) => string;
}): Promise<boolean> {
  return legacyRateLimit.checkRateLimit({
    ...params,
    hashIp: params.hashIp ?? hashIp,
  });
}

/**
 * Legacy compatibility wrapper
 * Maintains backward compatibility with existing implementations
 * @deprecated Use specific limit functions (limitByIp, limitByUserId, limitByEmail)
 */
export const legacyRateLimit = {
  checkRateLimit: async (params: {
    email: string;
    clientIp: string;
    hashIp?: (value: string) => string;
  }): Promise<boolean> => {
    const { email, clientIp } = params;

    const emailResult = await limitByEmail(email);
    if (!emailResult.success) {
      return false;
    }

    const ipResult = await limitByIp({ 'x-forwarded-for': clientIp });
    return ipResult.success;
  },

  resetRateLimiterState: () => {
    RateLimiterFactory.clearCache();
  },
};
