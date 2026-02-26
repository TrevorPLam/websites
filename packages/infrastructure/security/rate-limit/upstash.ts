/**
 * Upstash Redis rate limiter implementation.
 * Production-ready distributed rate limiting.
 * @module rate-limit/upstash
 */

import { InMemoryRateLimiter } from './in-memory';
import type {
  RateLimitConfig,
  RateLimitResult,
  RateLimiter,
  UpstashRatelimitInstance,
} from './types';

export class UpstashRateLimiter implements RateLimiter {
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
