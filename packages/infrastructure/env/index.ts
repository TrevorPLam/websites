/**
 * @file packages/infra/env/index.ts
 * Environment variable validation and composition utilities.
 *
 * Purpose: Composable Zod schemas and validateEnv/getFeatureFlags for type-safe env and feature flags.
 * Relationship: Used by template lib/env.ts, booking-providers, features. Depends on env/schemas/*, env/validate.
 * System role: Barrel of schemas and validateEnv; CompleteEnv from types; getFeatureFlags for integration gates.
 * Assumptions: validateEnv() called once at app bootstrap; schemas compose (base, rate-limit, supabase, etc.).
 *
 * @example
 * import { validateEnv, getFeatureFlags } from '@repo/infra/env';
 * const env = validateEnv();
 * const flags = getFeatureFlags();
 */
// Export all schemas for individual validation
export { baseEnvSchema } from './schemas/base';
export { rateLimitEnvSchema } from './schemas/rate-limit';
export { supabaseEnvSchema } from './schemas/supabase';
export { hubspotEnvSchema } from './schemas/hubspot';
export { bookingEnvSchema } from './schemas/booking';
export { sentryEnvSchema } from './schemas/sentry';
export { publicEnvSchema } from './schemas/public';

// Export validation functions from individual schemas
export { validateBaseEnv, safeValidateBaseEnv } from './schemas/base';
export {
  validateRateLimitEnv,
  safeValidateRateLimitEnv,
  isDistributedRateLimitingEnabled,
} from './schemas/rate-limit';
export {
  validateSupabaseEnv,
  safeValidateSupabaseEnv,
  isSupabaseEnabled,
} from './schemas/supabase';
export { validateHubspotEnv, safeValidateHubspotEnv, isHubspotEnabled } from './schemas/hubspot';
export {
  validateBookingEnv,
  safeValidateBookingEnv,
  isBookingEnabled,
  getEnabledBookingProviders,
} from './schemas/booking';
export {
  validateSentryEnv,
  safeValidateSentryEnv,
  isSentryEnabled,
  getSentrySampleRate,
} from './schemas/sentry';
export {
  validatePublicEnv,
  safeValidatePublicEnv,
  isAnalyticsEnabled,
  getAnalyticsId,
} from './schemas/public';

// Export types and validation utilities
export type {
  BaseEnv,
  RateLimitEnv,
  SupabaseEnv,
  HubspotEnv,
  BookingEnv,
  SentryEnv,
  PublicEnv,
  CompleteEnv,
  ServerEnv,
  ClientEnv,
  EnvValidationResult,
  EnvConfigOptions,
  EnvSchemaComposition,
  EnvFeatureFlags,
  EnvValidationContext,
  EnvTypeGuards,
  EnvTransformations,
} from './types';

export {
  createEnvSchema,
  completeEnvSchema,
  validateEnv,
  safeValidateEnv,
  getEnvContext,
  getFeatureFlags,
  validateEnvForEnvironment,
  createEnvSchemaForEnvironment,
} from './validate';

// Re-export commonly used combinations for convenience
// Note: baseEnvSchema is already exported above at line 32
export { validateBaseEnv as validateCoreEnv } from './schemas/base';
export { safeValidateBaseEnv as safeValidateCoreEnv } from './schemas/base';
