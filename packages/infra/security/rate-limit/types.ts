/**
 * Rate limit core types, interfaces, and presets.
 * @module rate-limit/types
 */

// Rate limiting configuration constants (exported for consumers that need defaults)
export const DEFAULT_RATE_LIMIT = {
  MAX_REQUESTS: 3,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
} as const;

export const RATE_LIMIT_PRESETS = {
  contact: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000,
    analytics: true,
  },
  booking: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    analytics: true,
  },
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    analytics: true,
  },
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    analytics: true,
  },
  upload: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
    analytics: true,
  },
  general: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
    analytics: true,
  },
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMIT_PRESETS;

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  analytics?: boolean;
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  resetTimeIso: string;
  identifier: string;
  preset?: RateLimitPreset;
}

export interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
  reset(identifier: string): Promise<void>;
}

/**
 * Shape of Upstash Ratelimit instance (from @upstash/ratelimit).
 * Structural type to avoid runtime import.
 */
export interface UpstashRatelimitInstance {
  limit(identifier: string): Promise<{ success: boolean; remaining?: number; reset?: number }>;
  reset?(identifier: string): Promise<void>;
}
