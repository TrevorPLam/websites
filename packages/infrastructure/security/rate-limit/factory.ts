/**
 * Rate limiter factory.
 * Creates appropriate rate limiter based on environment and configuration.
 * @module rate-limit/factory
 */

import { InMemoryRateLimiter } from './in-memory';
import { UpstashRateLimiter } from './upstash';
import {
  RATE_LIMIT_PRESETS,
  type RateLimitConfig,
  type RateLimitPreset,
  type RateLimiter,
} from './types';

export class RateLimiterFactory {
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

    if (this.instances[cacheKey]) {
      return this.instances[cacheKey];
    }

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

    const memoryLimiter = new InMemoryRateLimiter(config);
    this.instances[cacheKey] = memoryLimiter;
    return memoryLimiter;
  }

  static clearCache(): void {
    this.instances = {};
  }
}
