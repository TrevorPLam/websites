/**
 * Environment schema composition utilities.
 *
 * Purpose: Composable Zod schema creation for environment validation.
 * Exports: createEnvSchema, completeEnvSchema, createEnvSchemaForEnvironment
 */
import type { EnvSchemaComposition } from './types';
import { baseEnvSchema } from './schemas/base';
import { rateLimitEnvSchema } from './schemas/rate-limit';
import { supabaseEnvSchema } from './schemas/supabase';
import { hubspotEnvSchema } from './schemas/hubspot';
import { bookingEnvSchema } from './schemas/booking';
import { sentryEnvSchema } from './schemas/sentry';
import { publicEnvSchema } from './schemas/public';

/**
 * Creates a composable environment schema.
 * Combines multiple schemas based on configuration options.
 */
export const createEnvSchema = (composition: EnvSchemaComposition) => {
  let schema = baseEnvSchema;

  if (composition.optional) {
    const {
      rateLimit,
      supabase,
      hubspot,
      booking,
      sentry,
      public: publicSchema,
    } = composition.optional;

    if (rateLimit) schema = schema.merge(rateLimit);
    if (supabase) schema = schema.merge(supabase);
    if (hubspot) schema = schema.merge(hubspot);
    if (booking) schema = schema.merge(booking);
    if (sentry) schema = schema.merge(sentry);
    if (publicSchema) schema = schema.merge(publicSchema);
  }

  return schema;
};

/** Default complete environment schema including all available variables. */
export const completeEnvSchema = createEnvSchema({
  base: baseEnvSchema,
  optional: {
    rateLimit: rateLimitEnvSchema,
    supabase: supabaseEnvSchema,
    hubspot: hubspotEnvSchema,
    booking: bookingEnvSchema,
    sentry: sentryEnvSchema,
    public: publicEnvSchema,
  },
});

/**
 * Creates environment-specific schema.
 * Returns schema optimized for development, production, or test.
 */
export const createEnvSchemaForEnvironment = (targetEnv: 'development' | 'production' | 'test') => {
  const baseComposition: EnvSchemaComposition = {
    base: baseEnvSchema,
    optional: { public: publicEnvSchema },
  };

  if (targetEnv === 'production' || targetEnv === 'development') {
    baseComposition.optional = {
      ...baseComposition.optional,
      rateLimit: rateLimitEnvSchema,
      supabase: supabaseEnvSchema,
      hubspot: hubspotEnvSchema,
      booking: bookingEnvSchema,
      sentry: sentryEnvSchema,
    };
  }

  return createEnvSchema(baseComposition);
};
