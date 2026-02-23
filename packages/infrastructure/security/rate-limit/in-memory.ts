/**
 * In-memory rate limiter implementation.
 * Fallback for development or when external services are unavailable.
 * @module rate-limit/in-memory
 */

import type { RateLimitConfig, RateLimitResult, RateLimiter } from './types';

export class InMemoryRateLimiter implements RateLimiter {
  private limits: { [key: string]: { count: number; resetAt: number } } = {};
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.limits[identifier];

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
