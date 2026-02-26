/**
 * Rate limiting utilities — barrel export.
 * @module rate-limit
 */

export {
  DEFAULT_RATE_LIMIT,
  RATE_LIMIT_PRESETS,
  type RateLimitConfig,
  type RateLimitPreset,
  type RateLimitResult,
} from './types';

export { hashIp, getClientIp } from './helpers';

export {
  limitByIp,
  limitByUserId,
  limitByEmail,
  checkMultipleLimits,
  generateRateLimitHeaders,
  resetRateLimit,
  checkRateLimit,
  legacyRateLimit,
} from './api';
