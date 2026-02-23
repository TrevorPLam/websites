/**
 * Environment variable type definitions.
 *
 * **2026 Best Practices Applied:**
 * - Provides comprehensive TypeScript type safety
 * - Uses z.infer for automatic type generation
 * - Supports composable environment schemas
 * - Includes detailed JSDoc documentation
 * - Enables type-safe environment variable access
 *
 * **Type Categories:**
 * - BaseEnv: Core application settings
 * - RateLimitEnv: Rate limiting configuration
 * - SupabaseEnv: Supabase integration settings
 * - HubspotEnv: HubSpot CRM integration settings
 * - BookingEnv: Booking provider settings
 * - SentryEnv: Error tracking settings
 * - PublicEnv: Client-safe environment variables
 * - CompleteEnv: Combined environment configuration
 *
 * @example
 * ```typescript
 * import type { BaseEnv, CompleteEnv } from '@repo/infra/env/types';
 *
 * const baseConfig: BaseEnv = {
 *   NODE_ENV: 'production',
 *   SITE_URL: 'https://example.com',
 *   SITE_NAME: 'My Site',
 *   ANALYTICS_ID: 'GA-12345'
 * };
 *
 * const completeConfig: CompleteEnv = {
 *   ...baseConfig,
 *   // All environment variables combined
 * };
 * ```
 */

// Import individual schema types
import type { z } from 'zod';
import type { baseEnvSchema } from './schemas/base';
import type { rateLimitEnvSchema } from './schemas/rate-limit';
import type { supabaseEnvSchema } from './schemas/supabase';
import type { hubspotEnvSchema } from './schemas/hubspot';
import type { bookingEnvSchema } from './schemas/booking';
import type { sentryEnvSchema } from './schemas/sentry';
import type { publicEnvSchema } from './schemas/public';

/**
 * Base environment variable types.
 * Core application settings required for all deployments.
 */
export type BaseEnv = z.infer<typeof baseEnvSchema>;

/**
 * Rate limiting environment variable types.
 * Configuration for distributed rate limiting with Redis.
 */
export type RateLimitEnv = z.infer<typeof rateLimitEnvSchema>;

/**
 * Supabase environment variable types.
 * Configuration for Supabase database integration.
 */
export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

/**
 * HubSpot environment variable types.
 * Configuration for HubSpot CRM integration.
 */
export type HubspotEnv = z.infer<typeof hubspotEnvSchema>;

/**
 * Booking environment variable types.
 * Configuration for external booking providers.
 */
export type BookingEnv = z.infer<typeof bookingEnvSchema>;

/**
 * Sentry environment variable types.
 * Configuration for error tracking and monitoring.
 */
export type SentryEnv = z.infer<typeof sentryEnvSchema>;

/**
 * Public environment variable types.
 * Client-safe environment variables (NEXT_PUBLIC_*).
 */
export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Complete environment variable types.
 * Combined configuration for all environment variables.
 *
 * This type represents the full environment configuration
 * including all optional and required variables across all schemas.
 */
export type CompleteEnv = BaseEnv &
  RateLimitEnv &
  SupabaseEnv &
  HubspotEnv &
  BookingEnv &
  SentryEnv &
  PublicEnv;

/**
 * Server-only environment variable types.
 * Environment variables that should only be accessed on the server.
 *
 * These variables contain sensitive information and should never
 * be exposed to client-side code.
 */
export type ServerEnv = Omit<CompleteEnv, keyof PublicEnv>;

/**
 * Client-safe environment variable types.
 * Environment variables that are safe to expose to client-side code.
 *
 * Only variables with NEXT_PUBLIC_ prefix should be included in this type.
 */
export type ClientEnv = PublicEnv;

/**
 * Environment validation result types.
 * Represents the result of environment variable validation.
 */
export interface EnvValidationResult<T = CompleteEnv> {
  /** Whether validation succeeded */
  success: boolean;
  /** Validated environment data if successful */
  data?: T;
  /** Error information if validation failed */
  error?: {
    /** Field-specific validation errors */
    fieldErrors: Record<string, string[]>;
    /** General error message */
    message: string;
  };
}

/**
 * Environment configuration options.
 * Options for configuring environment validation and composition.
 */
export interface EnvConfigOptions {
  /** Whether to throw errors on validation failure */
  throwOnError?: boolean;
  /** Whether to include optional variables in validation */
  includeOptional?: boolean;
  /** Custom environment object to validate (defaults to process.env) */
  env?: Record<string, unknown>;
  /** Whether to validate server-only variables */
  serverOnly?: boolean;
}

/**
 * Environment schema composition types.
 * Types for composing multiple environment schemas together.
 */
export interface EnvSchemaComposition {
  /** Base schema (always included) */
  base: typeof baseEnvSchema;
  /** Optional schemas to include */
  optional?: {
    rateLimit?: typeof rateLimitEnvSchema;
    supabase?: typeof supabaseEnvSchema;
    hubspot?: typeof hubspotEnvSchema;
    booking?: typeof bookingEnvSchema;
    sentry?: typeof sentryEnvSchema;
    public?: typeof publicEnvSchema;
  };
}

/**
 * Environment feature flags.
 * Type-safe feature flags based on environment configuration.
 */
export interface EnvFeatureFlags {
  /** Whether distributed rate limiting is enabled */
  distributedRateLimiting: boolean;
  /** Whether Supabase integration is enabled */
  supabaseEnabled: boolean;
  /** Whether HubSpot CRM integration is enabled */
  hubspotEnabled: boolean;
  /** Whether any booking providers are enabled */
  bookingEnabled: boolean;
  /** Whether Sentry error tracking is enabled */
  sentryEnabled: boolean;
  /** Whether analytics tracking is enabled */
  analyticsEnabled: boolean;
  /** List of enabled booking providers */
  enabledBookingProviders: string[];
}

/**
 * Environment validation context.
 * Context information for environment validation.
 */
export interface EnvValidationContext {
  /** Current Node.js environment */
  nodeEnv: 'development' | 'production' | 'test';
  /** Whether running in development mode */
  isDevelopment: boolean;
  /** Whether running in production mode */
  isProduction: boolean;
  /** Whether running in test mode */
  isTest: boolean;
  /** Timestamp of validation */
  validatedAt: Date;
  /** Source of environment variables */
  source: 'process.env' | 'custom';
}

/**
 * Type guards for environment variables.
 * Utility functions for type checking environment variables.
 */
export interface EnvTypeGuards {
  /** Check if value is a valid URL */
  isUrl: (value: unknown) => value is string;
  /** Check if value is a non-empty string */
  isNonEmptyString: (value: unknown) => value is string;
  /** Check if value is a valid email */
  isEmail: (value: unknown) => value is string;
  /** Check if value is a valid enum value */
  isEnumValue: <T extends string>(value: unknown, enumValues: T[]) => value is T;
}

/**
 * Environment variable transformation types.
 * Types for transforming environment variable values.
 */
export interface EnvTransformations {
  /** Transform URL by removing trailing slash */
  normalizeUrl: (url: string) => string;
  /** Transform string to boolean */
  toBoolean: (value: unknown) => boolean;
  /** Transform string to number */
  toNumber: (value: unknown) => number;
  /** Trim whitespace from string */
  trim: (value: string) => string;
}
