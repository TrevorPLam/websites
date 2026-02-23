import { z } from 'zod';

/**
 * Public environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Only includes NEXT_PUBLIC_* variables safe for client-side exposure
 * - Validates URL format and string constraints
 * - Includes comprehensive JSDoc documentation
 * - Ensures no sensitive data is exposed to client
 *
 * **Variables:**
 * - NEXT_PUBLIC_SITE_URL: Public site URL (client-safe)
 * - NEXT_PUBLIC_SITE_NAME: Public site name (client-safe)
 * - NEXT_PUBLIC_ANALYTICS_ID: Analytics tracking ID (client-safe)
 *
 * **Security Notes:**
 * - Only variables with NEXT_PUBLIC_ prefix are exposed to browser
 * - Never include API keys, secrets, or sensitive data
 * - All variables in this schema are safe for client-side access
 *
 * @example
 * ```typescript
 * import { publicEnvSchema } from '@repo/infra/env/schemas/public';
 *
 * const result = publicEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid public environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const publicEnvSchema = z.object({
  /**
   * Public site URL exposed to client-side code.
   * Used for absolute URLs, navigation, and API calls.
   * Must be a valid URL and safe for public exposure.
   *
   * @default 'http://localhost:3000'
   * @format url
   * @example 'https://hairsalon.example.com'
   * @safe This variable is safe for client-side exposure
   */
  NEXT_PUBLIC_SITE_URL: z.coerce
    .string()
    .url('Must be a valid URL')
    .transform((url) => url.replace(/\/$/, '')) // Remove trailing slash
    .default('http://localhost:3000'),

  /**
   * Public site name exposed to client-side code.
   * Used for branding, page titles, and UI elements.
   * Must be safe for public exposure and non-empty.
   *
   * @default 'Hair Salon Template'
   * @min 1
   * @max 100
   * @example 'Elegant Hair Studio'
   * @safe This variable is safe for client-side exposure
   */
  NEXT_PUBLIC_SITE_NAME: z.coerce
    .string()
    .min(1, 'Site name cannot be empty')
    .max(100, 'Site name must be 100 characters or less')
    .default('Hair Salon Template'),

  /**
   * Analytics tracking ID exposed to client-side code.
   * Used for web analytics and tracking scripts.
   * Must be safe for public exposure and non-empty when provided.
   *
   * @optional
   * @min 1
   * @example 'G-XXXXXXXXXX' (Google Analytics)
   * @example 'vercel-analytics' (Vercel Analytics)
   * @safe This variable is safe for client-side exposure
   */
  NEXT_PUBLIC_ANALYTICS_ID: z.coerce
    .string()
    .min(1, 'Analytics ID cannot be empty when provided')
    .optional(),
});

/**
 * Type inference for public environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type PublicEnv = z.infer<typeof publicEnvSchema>;
 * // => {
 * //   NEXT_PUBLIC_SITE_URL: string;
 * //   NEXT_PUBLIC_SITE_NAME: string;
 * //   NEXT_PUBLIC_ANALYTICS_ID?: string | undefined;
 * // }
 * ```
 */
export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Runtime validation function for public environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Validates URL format for NEXT_PUBLIC_SITE_URL
 * - Ensures site name is non-empty and within length limits
 * - Validates analytics ID when provided
 * - Applies sensible defaults for development
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated public environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validatePublicEnv } from '@repo/infra/env/schemas/public';
 *
 * try {
 *   const publicEnv = validatePublicEnv();
 *   console.log(`Site: ${publicEnv.NEXT_PUBLIC_SITE_NAME}`);
 *   console.log(`URL: ${publicEnv.NEXT_PUBLIC_SITE_URL}`);
 *   if (publicEnv.NEXT_PUBLIC_ANALYTICS_ID) {
 *     console.log(`Analytics: ${publicEnv.NEXT_PUBLIC_ANALYTICS_ID}`);
 *   }
 * } catch (error) {
 *   console.error('Public environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validatePublicEnv = (env: Record<string, unknown> = process.env): PublicEnv => {
  const result = publicEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid public environment variables: ${errorMessages}\n\n` +
        `Public variables (exposed to browser):\n` +
        `- NEXT_PUBLIC_SITE_URL: Valid URL (required)\n` +
        `- NEXT_PUBLIC_SITE_NAME: Non-empty string (required, max 100 chars)\n` +
        `- NEXT_PUBLIC_ANALYTICS_ID: Analytics tracking ID (optional)\n\n` +
        `Setup instructions:\n` +
        `1. Set NEXT_PUBLIC_SITE_URL to your production URL\n` +
        `2. Set NEXT_PUBLIC_SITE_NAME to your business name\n` +
        `3. Optionally set NEXT_PUBLIC_ANALYTICS_ID for analytics\n\n` +
        `⚠️  Security: Only NEXT_PUBLIC_* variables are exposed to client-side code`
    );
  }

  return result.data;
};

/**
 * Development-safe validation that doesn't throw errors.
 * Useful for optional features or graceful degradation.
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated environment or null if validation fails
 *
 * @example
 * ```typescript
 * import { safeValidatePublicEnv } from '@repo/infra/env/schemas/public';
 *
 * const publicEnv = safeValidatePublicEnv();
 * if (publicEnv) {
 *   console.log(`Site: ${publicEnv.NEXT_PUBLIC_SITE_NAME}`);
 *   console.log(`URL: ${publicEnv.NEXT_PUBLIC_SITE_URL}`);
 * } else {
 *   console.warn('Public environment validation failed');
 * }
 * ```
 */
export const safeValidatePublicEnv = (
  env: Record<string, unknown> = process.env
): PublicEnv | null => {
  const result = publicEnvSchema.safeParse(env);
  return result.success ? result.data : null;
};

/**
 * Helper function to check if analytics is enabled.
 * Returns true only when NEXT_PUBLIC_ANALYTICS_ID is provided.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if analytics tracking is configured
 *
 * @example
 * ```typescript
 * import { isAnalyticsEnabled } from '@repo/infra/env/schemas/public';
 *
 * if (isAnalyticsEnabled()) {
 *   console.log('Analytics tracking enabled');
 * } else {
 *   console.log('Analytics tracking disabled');
 * }
 * ```
 */
export const isAnalyticsEnabled = (env: Record<string, unknown> = process.env): boolean => {
  const publicEnv = safeValidatePublicEnv(env);
  return !!publicEnv?.NEXT_PUBLIC_ANALYTICS_ID;
};

/**
 * Helper function to get analytics tracking ID.
 * Returns the analytics ID or null if not configured.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns Analytics tracking ID or null
 *
 * @example
 * ```typescript
 * import { getAnalyticsId } from '@repo/infra/env/schemas/public';
 *
 * const analyticsId = getAnalyticsId();
 * if (analyticsId) {
 *   console.log(`Analytics ID: ${analyticsId}`);
 * } else {
 *   console.log('No analytics ID configured');
 * }
 * ```
 */
export const getAnalyticsId = (env: Record<string, unknown> = process.env): string | null => {
  const publicEnv = safeValidatePublicEnv(env);
  return publicEnv?.NEXT_PUBLIC_ANALYTICS_ID ?? null;
};
