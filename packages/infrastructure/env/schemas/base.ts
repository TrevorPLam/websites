import { z } from 'zod';

/**
 * Base environment variable schema with core application settings.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Provides sensible defaults for development experience
 * - Includes comprehensive JSDoc documentation
 * - Validates URLs and enums properly
 * - Supports both required and optional patterns
 *
 * **Variables:**
 * - NODE_ENV: Application environment (development/production/test)
 * - SITE_URL: Public site URL without trailing slash
 * - SITE_NAME: Human-readable site name for branding
 * - ANALYTICS_ID: Optional analytics tracking identifier
 *
 * @example
 * ```typescript
 * import { baseEnvSchema } from '@repo/infra/env/schemas/base';
 *
 * const result = baseEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid base environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const baseEnvSchema = z.object({
  /**
   * Node.js environment setting.
   * Controls application behavior, logging, and feature flags.
   *
   * @default 'development'
   * @enum {string} development|production|test
   * @example 'production'
   */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /**
   * Public site URL without trailing slash.
   * Used for canonical URLs, sitemap generation, and OG tags.
   *
   * @default 'http://localhost:3000'
   * @format url
   * @example 'https://hairsalon.example.com'
   */
  SITE_URL: z.coerce
    .string()
    .url()
    .transform((url) => url.replace(/\/$/, '')) // Remove trailing slash
    .default('http://localhost:3000'),

  /**
   * Human-readable site name for branding.
   * Used in page titles, meta descriptions, and UI elements.
   *
   * @default 'Hair Salon Template'
   * @example 'Elegant Hair Studio'
   */
  SITE_NAME: z.coerce
    .string()
    .min(1, 'Site name cannot be empty')
    .max(100, 'Site name must be 100 characters or less')
    .default('Hair Salon Template'),

  /**
   * Analytics tracking identifier (optional).
   * Supports Google Analytics, Vercel Analytics, or custom providers.
   *
   * @optional
   * @example 'G-XXXXXXXXXX' (Google Analytics)
   * @example 'vercel-analytics' (Vercel Analytics)
   */
  ANALYTICS_ID: z.coerce.string().min(1, 'Analytics ID cannot be empty when provided').optional(),
});

/**
 * Type inference for base environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type BaseEnv = z.infer<typeof baseEnvSchema>;
 * // => { NODE_ENV: string; SITE_URL: string; SITE_NAME: string; ANALYTICS_ID?: string | undefined; }
 * ```
 */
export type BaseEnv = z.infer<typeof baseEnvSchema>;

/**
 * Runtime validation function for base environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Error Handling:**
 * - Provides field-specific error messages
 * - Includes validation context in errors
 * - Stops application startup on invalid configuration
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated base environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateBaseEnv } from '@repo/infra/env/schemas/base';
 *
 * try {
 *   const baseEnv = validateBaseEnv();
 *   console.log(`Site: ${baseEnv.SITE_NAME} (${baseEnv.SITE_URL})`);
 * } catch (error) {
 *   console.error('Environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateBaseEnv = (env: Record<string, unknown> = process.env): BaseEnv => {
  const result = baseEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid base environment variables: ${errorMessages}\n\n` +
        `Required variables:\n` +
        `- NODE_ENV: development|production|test\n` +
        `- SITE_URL: Valid URL (e.g., https://example.com)\n` +
        `- SITE_NAME: Non-empty string (max 100 chars)\n` +
        `- ANALYTICS_ID: Optional string for analytics tracking`
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
 * import { safeValidateBaseEnv } from '@repo/infra/env/schemas/base';
 *
 * const baseEnv = safeValidateBaseEnv();
 * if (baseEnv) {
 *   console.log(`Analytics enabled: ${!!baseEnv.ANALYTICS_ID}`);
 * } else {
 *   console.warn('Base environment validation failed, using defaults');
 * }
 * ```
 */
export const safeValidateBaseEnv = (env: Record<string, unknown> = process.env): BaseEnv | null => {
  const result = baseEnvSchema.safeParse(env);
  return result.success ? result.data : null;
};
