// File: lib/env.ts  [TRACE:FILE=lib.env]
// Purpose: Environment variable validation using composable schemas from @repo/infra.
//          Provides type-safe access to all environment variables with conditional validation
//          based on Node environment and feature flags.
//
// Exports / Entry: validatedEnv, environment helper functions
// Used by: All application files requiring environment variable access
//
// Invariants:
// - Must validate all required environment variables before application startup
// - Optional variables must be handled gracefully in development/test modes
// - Type safety must be maintained for all environment variable access
// - Feature flags must accurately reflect available integrations
//
// Status: @internal
// Features:
// - [FEAT:CONFIG] Environment variable validation and type safety
// - [FEAT:SECURITY] Secure handling of sensitive configuration
// - [FEAT:DEVELOPMENT] Development-friendly optional variable handling
// - [FEAT:INTEGRATION] Feature flag management for external services

import 'server-only';

/**
 * Environment variable validation using composable schemas from @repo/infra.
 *
 * **2026 Best Practices Applied:**
 * - Uses composable schema validation from @repo/infra/env
 * - Leverages centralized environment management
 * - Provides type-safe environment variable access
 * - Supports optional and required variables
 * - Includes comprehensive error reporting
 *
 * **Architecture:**
 * - Base schema: NODE_ENV, SITE_URL, SITE_NAME, ANALYTICS_ID
 * - Optional schemas: Rate limiting, Supabase, HubSpot, Booking, Sentry
 * - Public schema: NEXT_PUBLIC_* variables (client-safe)
 *
 * @example
 * ```typescript
 * import { validatedEnv } from './env';
 *
 * // Type-safe access to environment variables
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL;
 * const isProduction = validatedEnv.NODE_ENV === 'production';
 * ```
 */

// Import composable environment utilities from @repo/infra
import { validateEnv, getFeatureFlags, getEnvContext, type CompleteEnv } from '@repo/infra/env';

/**
 * Validated environment variables with type safety.
 *
 * This object provides type-safe access to all environment variables
 * after validation against composable schemas from @repo/infra.
 *
 * **Type Safety:**
 * - TypeScript knows which variables are required vs optional
 * - Autocomplete available for all variables
 * - Compile-time checking for typos
 *
 * **Usage:**
 * ```typescript
 * // Required variables (always string)
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL;
 *
 * // Optional variables (string | undefined)
 * const hubspotToken = validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN;
 *
 * // Feature flags
 * const flags = getFeatureFlags();
 * if (flags.supabaseEnabled) {
 *   // Use Supabase integration
 * }
 * ```
 */
// [TRACE:FUNC=lib.validatedEnv]
// [FEAT:CONFIG] [FEAT:SECURITY] [FEAT:INTEGRATION]
// NOTE: Core environment access - provides type-safe access to all validated environment variables.
export const validatedEnv = validateEnv() as CompleteEnv;

/**
 * Get current Node environment.
 *
 * @returns 'development' | 'production' | 'test'
 */
// [TRACE:FUNC=lib.getNodeEnvironment]
// [FEAT:CONFIG]
// NOTE: Environment detection - provides safe access to current Node environment.
export const getNodeEnvironment = () => validatedEnv.NODE_ENV;

/**
 * Check if running in production.
 *
 * **Use cases:**
 * - Enable production-only features (analytics, Sentry)
 * - Apply production-only headers (HSTS)
 * - Hide dev-only logging
 *
 * @returns true if NODE_ENV === 'production'
 */
// [TRACE:FUNC=lib.isProduction]
// [FEAT:CONFIG] [FEAT:SECURITY]
// NOTE: Production detection - critical for enabling production-only features and security headers.
export const isProduction = () => getNodeEnvironment() === 'production';

/**
 * Check if running in development.
 *
 * **Use cases:**
 * - Enable dev-only logging
 * - Show dev-only UI (debug panels)
 * - Skip external API calls (use mocks)
 *
 * @returns true if NODE_ENV === 'development'
 */
export const isDevelopment = () => getNodeEnvironment() === 'development';

/**
 * Check if running in test mode.
 *
 * **Use cases:**
 * - Disable external API calls in tests
 * - Use test-specific configuration
 * - Skip analytics tracking
 *
 * @returns true if NODE_ENV === 'test'
 */
export const isTest = () => getNodeEnvironment() === 'test';

/**
 * Get environment validation context.
 *
 * Provides information about the current validation environment
 * including Node.js environment, timestamps, and source.
 *
 * @returns Environment validation context
 */
export const getEnvironmentContext = () => getEnvContext();

/**
 * Get feature flags from environment configuration.
 *
 * Returns boolean flags for enabled features and integrations
 * based on current environment variable configuration.
 *
 * @returns Feature flags object
 */
export const getEnvironmentFeatures = () => getFeatureFlags();
