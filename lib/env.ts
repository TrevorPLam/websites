/**
 * Environment variable validation and type-safe access.
 * 
 * **Purpose:**
 * - Validate environment variables at startup
 * - Provide type-safe access to env vars
 * - Fail fast with clear error messages
 * - Document required vs optional variables
 * 
 * **Validation:**
 * - Uses Zod for runtime type checking
 * - Validates URLs, emails, enums
 * - Provides defaults for optional variables
 * - Throws on missing required variables
 * 
 * **Usage:**
 * ```typescript
 * import { validatedEnv } from './env'
 * 
 * // Type-safe access with autocomplete
 * const apiKey = validatedEnv.RESEND_API_KEY // string | undefined
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL // string (required)
 * ```
 * 
 * **Variable Categories:**
 * - **Public:** NEXT_PUBLIC_* (exposed to browser, use for non-sensitive config)
 * - **Server-only:** All others (never sent to browser, use for API keys/secrets)
 * 
 * @module lib/env
 */

import { z } from 'zod'

/**
 * Environment variable schema with validation rules.
 * 
 * **Public Variables (NEXT_PUBLIC_*):**
 * - Exposed to browser (accessible in client components)
 * - Never include secrets or API keys
 * - Used for site URL, analytics IDs, feature flags
 * 
 * **Server-Only Variables:**
 * - Only accessible in server components and API routes
 * - Use for API keys, database credentials, secrets
 * - Never exposed to browser
 * 
 * **Required vs Optional:**
 * - Optional: Has `.optional()` or `.default()` (graceful fallback)
 * - Required: No fallback (throws error if missing)
 * 
 * **Validation Rules:**
 * - URLs validated with `.url()` (must be valid HTTP/HTTPS URL)
 * - Emails validated with `.email()` (must be valid email format)
 * - Enums validated with `.enum()` (must match allowed values)
 */
const envSchema = z.object({
  /**
   * Public site URL (no trailing slash).
   * Used for absolute URLs in sitemap, OG tags, canonical URLs.
   * 
   * @default 'http://localhost:3000' (development)
   * @example 'https://yourdedicatedmarketer.com' (production)
   */
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  /**
   * Public site name for branding.
   * Used in page titles, OG tags, meta descriptions.
   * 
   * @default 'Your Dedicated Marketer'
   */
  NEXT_PUBLIC_SITE_NAME: z.string().default('Your Dedicated Marketer'),

  /**
   * Analytics tracking ID (optional).
   * Used by lib/analytics.ts for event tracking.
   * 
   * @optional
   * @example 'G-XXXXXXXXXX' (Google Analytics)
   * @example 'vercel-analytics' (Vercel Analytics)
   */
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  /**
   * Resend API key for transactional emails (optional).
   * If not set, contact form logs instead of sending emails (development mode).
   * 
   * @optional
   * @see {@link https://resend.com/docs/api-reference/authentication Resend API}
   */
  RESEND_API_KEY: z.string().optional(),

  /**
   * Email address to receive contact form submissions.
   * 
   * @default 'contact@yourdedicatedmarketer.com'
   */
  CONTACT_EMAIL: z.string().email().default('contact@yourdedicatedmarketer.com'),

  /**
   * Node environment (development, production, test).
   * 
   * @default 'development'
   */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /**
   * Upstash Redis REST URL for distributed rate limiting (optional).
   * If not set, falls back to in-memory rate limiting (single instance only).
   * 
   * @optional
   * @see {@link https://upstash.com/docs/redis/overall/getstarted Upstash Redis}
   */
  UPSTASH_REDIS_REST_URL: z.string().optional(),

  /**
   * Upstash Redis REST token for distributed rate limiting (optional).
   * Must be set together with UPSTASH_REDIS_REST_URL.
   * 
   * @optional
   */
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
})

/**
 * Validate environment variables at module load time.
 * 
 * **Behavior:**
 * - Reads from process.env
 * - Validates against envSchema
 * - Applies defaults for optional variables
 * - Throws descriptive error on validation failure
 * 
 * **Error Handling:**
 * - Logs field-specific errors to console
 * - Throws error to stop application startup
 * - Prevents running with invalid configuration
 * 
 * **Example Error Output:**
 * ```
 * ❌ Invalid environment variables: {
 *   NEXT_PUBLIC_SITE_URL: ['Invalid URL'],
 *   CONTACT_EMAIL: ['Invalid email']
 * }
 * ```
 */
const env = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  NODE_ENV: process.env.NODE_ENV,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
})

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

/**
 * Validated environment variables with type safety.
 * 
 * **Type Safety:**
 * - TypeScript knows which variables are required vs optional
 * - Autocomplete available for all variables
 * - Compile-time checking for typos
 * 
 * **Usage:**
 * ```typescript
 * import { validatedEnv } from './env'
 * 
 * // Required variables (always string)
 * const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL
 * 
 * // Optional variables (string | undefined)
 * if (validatedEnv.RESEND_API_KEY) {
 *   // Send email
 * } else {
 *   // Log to console (development mode)
 * }
 * ```
 */
export const validatedEnv = env.data

/**
 * Get current Node environment.
 * 
 * @returns 'development' | 'production' | 'test'
 */
export const getNodeEnvironment = () => process.env.NODE_ENV || validatedEnv.NODE_ENV

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
export const isProduction = () => getNodeEnvironment() === 'production'

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
export const isDevelopment = () => getNodeEnvironment() === 'development'

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
export const isTest = () => getNodeEnvironment() === 'test'
