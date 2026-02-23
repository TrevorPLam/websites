/**
 * Environment validation context and feature flags.
 *
 * Purpose: getEnvContext and getFeatureFlags for validation metadata.
 * Exports: getEnvContext, getFeatureFlags
 */
import type { EnvFeatureFlags, EnvValidationContext } from './types';
import { isDistributedRateLimitingEnabled } from './schemas/rate-limit';
import { isSupabaseEnabled } from './schemas/supabase';
import { isHubspotEnabled } from './schemas/hubspot';
import { isBookingEnabled, getEnabledBookingProviders } from './schemas/booking';
import { isSentryEnabled } from './schemas/sentry';
import { isAnalyticsEnabled } from './schemas/public';

/**
 * Gets environment validation context.
 * Provides information about the current validation environment.
 */
export const getEnvContext = (env: Record<string, unknown> = process.env): EnvValidationContext => {
  const nodeEnv = (env.NODE_ENV as string) || 'development';

  return {
    nodeEnv: nodeEnv as 'development' | 'production' | 'test',
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    validatedAt: new Date(),
    source: env === process.env ? 'process.env' : 'custom',
  };
};

/**
 * Gets feature flags from environment configuration.
 * Returns boolean flags for enabled features and integrations.
 */
export const getFeatureFlags = (env: Record<string, unknown> = process.env): EnvFeatureFlags => ({
  distributedRateLimiting: isDistributedRateLimitingEnabled(env),
  supabaseEnabled: isSupabaseEnabled(env),
  hubspotEnabled: isHubspotEnabled(env),
  bookingEnabled: isBookingEnabled(env),
  sentryEnabled: isSentryEnabled(env),
  analyticsEnabled: isAnalyticsEnabled(env),
  enabledBookingProviders: getEnabledBookingProviders(env),
});
