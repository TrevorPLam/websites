/**
 * Rate limit public API: limitByIp, limitByUserId, limitByEmail,
 * checkMultipleLimits, generateRateLimitHeaders, resetRateLimit, checkRateLimit, legacyRateLimit.
 * @module rate-limit/api
 */

import { hashIp, getClientIp } from './helpers';
import { RateLimiterFactory } from './factory';
import type { RateLimitConfig, RateLimitPreset, RateLimitResult } from './types';

export async function limitByIp(
  headers: Record<string, string>,
  preset: RateLimitPreset = 'general',
  customConfig?: Partial<RateLimitConfig>,
  env?: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }
): Promise<RateLimitResult> {
  const clientIp = getClientIp(headers);
  const hashedIp = hashIp(clientIp);
  const identifier = `ip:${hashedIp}`;
  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);
  return { ...result, preset };
}

export async function limitByUserId(
  userId: string,
  preset: RateLimitPreset = 'general',
  customConfig?: Partial<RateLimitConfig>,
  env?: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }
): Promise<RateLimitResult> {
  const identifier = `user:${userId}`;
  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);
  return { ...result, preset };
}

export async function limitByEmail(
  email: string,
  preset: RateLimitPreset = 'contact',
  customConfig?: Partial<RateLimitConfig>,
  env?: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }
): Promise<RateLimitResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const identifier = `email:${normalizedEmail}`;
  const limiter = await RateLimiterFactory.create(preset, customConfig, env);
  const result = await limiter.limit(identifier);
  return { ...result, preset };
}

export async function checkMultipleLimits(
  checks: Array<{
    type: 'ip' | 'userId' | 'email';
    value: string;
    preset?: RateLimitPreset;
    customConfig?: Partial<RateLimitConfig>;
  }>,
  env?: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }
): Promise<{ success: boolean; results: RateLimitResult[] }> {
  const results: RateLimitResult[] = [];
  type CheckItem = (typeof checks)[number];
  const limitHandlers: Record<CheckItem['type'], (c: CheckItem) => Promise<RateLimitResult>> = {
    ip: (c) =>
      limitByIp({ 'x-forwarded-for': c.value }, c.preset ?? 'general', c.customConfig, env),
    userId: (c) => limitByUserId(c.value, c.preset ?? 'general', c.customConfig, env),
    email: (c) => limitByEmail(c.value, c.preset ?? 'contact', c.customConfig, env),
  };

  for (const check of checks) {
    const handler = limitHandlers[check.type];
    if (!handler) {
      throw new Error(`Unknown rate limit type: ${check.type}`);
    }
    const result = await handler(check);
    results.push(result);
    if (!result.success) {
      return { success: false, results };
    }
  }
  return { success: true, results };
}

export function generateRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'X-RateLimit-Preset': result.preset || 'unknown',
  };
}

export async function resetRateLimit(
  type: 'ip' | 'userId' | 'email',
  value: string,
  preset: RateLimitPreset = 'general',
  env?: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }
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
    default: {
      const _exhaustive: never = type;
      throw new Error(`Unknown rate limit type: ${_exhaustive}`);
    }
  }
  const limiter = await RateLimiterFactory.create(preset, undefined, env);
  await limiter.reset(identifier);
}

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
    if (!emailResult.success) return false;
    const ipResult = await limitByIp({ 'x-forwarded-for': clientIp });
    return ipResult.success;
  },
  resetRateLimiterState: () => {
    RateLimiterFactory.clearCache();
  },
};
