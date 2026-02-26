import { z } from 'zod';

/**
 * Rate limiting environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Supports distributed rate limiting with Upstash Redis
 * - Provides graceful fallback to in-memory limiting
 * - Includes comprehensive JSDoc documentation
 * - Validates URL formats and token requirements
 *
 * **Variables:**
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST API token
 *
 * **Usage Patterns:**
 * - Production: Both variables required for distributed rate limiting
 * - Development: Optional, falls back to in-memory limiting
 * - Testing: Optional, uses mock rate limiting
 *
 * @example
 * ```typescript
 * import { rateLimitEnvSchema } from '@repo/infrastructure/env/schemas/rate-limit';
 *
 * const result = rateLimitEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid rate limit environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const rateLimitEnvSchema = z.object({
  /**
   * Upstash Redis REST URL for distributed rate limiting.
   * Required for production deployments with multiple instances.
   * Falls back to in-memory rate limiting if not provided.
   *
   * @optional
   * @format url
   * @example 'https://awesome-george-123.upstash.io'
   * @see {@link https://upstash.com/docs/redis/overall/getstarted Upstash Redis Documentation}
   */
  UPSTASH_REDIS_REST_URL: z.coerce.string().url('Must be a valid URL').optional(),

  /**
   * Upstash Redis REST token for authentication.
   * Required for production deployments with multiple instances.
   * Must be provided together with UPSTASH_REDIS_REST_URL.
   *
   * @optional
   * @min 1
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   * @see {@link https://upstash.com/docs/redis/overall/getstarted Upstash Redis Documentation}
   */
  UPSTASH_REDIS_REST_TOKEN: z.coerce
    .string()
    .min(1, 'Redis token cannot be empty when provided')
    .optional(),
});

/**
 * Type inference for rate limiting environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type RateLimitEnv = z.infer<typeof rateLimitEnvSchema>;
 * // => { UPSTASH_REDIS_REST_URL?: string | undefined; UPSTASH_REDIS_REST_TOKEN?: string | undefined; }
 * ```
 */
export type RateLimitEnv = z.infer<typeof rateLimitEnvSchema>;

/**
 * Runtime validation function for rate limiting environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Both variables must be provided together or neither
 * - Validates URL format for Redis REST URL
 * - Ensures token is non-empty when provided
 * - Provides clear error messages for misconfiguration
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated rate limiting environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateRateLimitEnv } from '@repo/infrastructure/env/schemas/rate-limit';
 *
 * try {
 *   const rateLimitEnv = validateRateLimitEnv();
 *   if (rateLimitEnv.UPSTASH_REDIS_REST_URL) {
 *     console.log('Distributed rate limiting enabled');
 *   } else {
 *     console.log('In-memory rate limiting (single instance)');
 *   }
 * } catch (error) {
 *   console.error('Rate limit environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateRateLimitEnv = (env: Record<string, unknown> = process.env): RateLimitEnv => {
  const result = rateLimitEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid rate limit environment variables: ${errorMessages}\n\n` +
        `Configuration options:\n` +
        `- Production: Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN required\n` +
        `- Development: Optional, falls back to in-memory rate limiting\n` +
        `- Testing: Optional, uses mock rate limiting\n\n` +
        `Setup instructions:\n` +
        `1. Create Upstash Redis database at https://upstash.com\n` +
        `2. Copy REST URL and token from dashboard\n` +
        `3. Set as environment variables`
    );
  }

  // Custom validation: both variables must be provided together
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = result.data;
  const hasUrl = !!UPSTASH_REDIS_REST_URL;
  const hasToken = !!UPSTASH_REDIS_REST_TOKEN;

  if (hasUrl !== hasToken) {
    throw new Error(
      `❌ Rate limit configuration error: Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be provided together or neither.\n\n` +
        `Current state:\n` +
        `- UPSTASH_REDIS_REST_URL: ${hasUrl ? 'provided' : 'missing'}\n` +
        `- UPSTASH_REDIS_REST_TOKEN: ${hasToken ? 'provided' : 'missing'}\n\n` +
        `Solutions:\n` +
        `- Provide both variables for distributed rate limiting (production)\n` +
        `- Provide neither variable for in-memory rate limiting (development/testing)`
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
 * import { safeValidateRateLimitEnv } from '@repo/infrastructure/env/schemas/rate-limit';
 *
 * const rateLimitEnv = safeValidateRateLimitEnv();
 * if (rateLimitEnv?.UPSTASH_REDIS_REST_URL) {
 *   console.log('Distributed rate limiting available');
 * } else {
 *   console.log('Using in-memory rate limiting');
 * }
 * ```
 */
export const safeValidateRateLimitEnv = (
  env: Record<string, unknown> = process.env
): RateLimitEnv | null => {
  const result = rateLimitEnvSchema.safeParse(env);

  if (!result.success) {
    return null;
  }

  // Check custom validation rule
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = result.data;
  const hasUrl = !!UPSTASH_REDIS_REST_URL;
  const hasToken = !!UPSTASH_REDIS_REST_TOKEN;

  // Return null if validation rule is violated
  return hasUrl === hasToken ? result.data : null;
};

/**
 * Helper function to check if distributed rate limiting is enabled.
 * Returns true only when both Redis URL and token are provided.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if distributed rate limiting is configured
 *
 * @example
 * ```typescript
 * import { isDistributedRateLimitingEnabled } from '@repo/infrastructure/env/schemas/rate-limit';
 *
 * if (isDistributedRateLimitingEnabled()) {
 *   console.log('Using distributed rate limiting with Redis');
 * } else {
 *   console.log('Using in-memory rate limiting');
 * }
 * ```
 */
export const isDistributedRateLimitingEnabled = (
  env: Record<string, unknown> = process.env
): boolean => {
  const rateLimitEnv = safeValidateRateLimitEnv(env);
  return !!(rateLimitEnv?.UPSTASH_REDIS_REST_URL && rateLimitEnv?.UPSTASH_REDIS_REST_TOKEN);
};
