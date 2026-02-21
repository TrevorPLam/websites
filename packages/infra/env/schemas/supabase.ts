import { z } from 'zod';

/**
 * Supabase environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Validates URL format for Supabase project URL
 * - Ensures service role key is non-empty when provided
 * - Includes comprehensive JSDoc documentation
 * - Supports optional configuration for development/testing
 *
 * **Variables:**
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for elevated access
 *
 * **Security Notes:**
 * - Service role key grants elevated database access
 * - Never expose service role key to client-side code
 * - Use service role key only in server-side operations
 *
 * @example
 * ```typescript
 * import { supabaseEnvSchema } from '@repo/infra/env/schemas/supabase';
 *
 * const result = supabaseEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid Supabase environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const supabaseEnvSchema = z.object({
  /**
   * Supabase project URL.
   * Required for all Supabase client operations.
   * Must be a valid HTTPS URL pointing to your Supabase project.
   *
   * @optional
   * @format url
   * @example 'https://xyzcompany.supabase.co'
   * @see {@link https://supabase.com/docs/guides/getting-started Supabase Documentation}
   */
  SUPABASE_URL: z.coerce.string().url('Must be a valid URL').trim().optional(),

  /**
   * Supabase service role key.
   * Grants elevated access to database operations.
   * Must be kept secret and never exposed to client-side code.
   *
   * @optional
   * @min 1
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   * @security This key grants full database access - keep secret
   */
  SUPABASE_SERVICE_ROLE_KEY: z.coerce
    .string()
    .min(1, 'Service role key cannot be empty when provided')
    .trim()
    .optional(),
});

/**
 * Type inference for Supabase environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;
 * // => { SUPABASE_URL?: string | undefined; SUPABASE_SERVICE_ROLE_KEY?: string | undefined; }
 * ```
 */
export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

/**
 * Runtime validation function for Supabase environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Both variables must be provided together or neither
 * - Validates URL format for Supabase project URL
 * - Ensures service role key is non-empty when provided
 * - Provides clear security warnings
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated Supabase environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateSupabaseEnv } from '@repo/infra/env/schemas/supabase';
 *
 * try {
 *   const supabaseEnv = validateSupabaseEnv();
 *   if (supabaseEnv.SUPABASE_URL) {
 *     console.log('Supabase integration enabled');
 *   } else {
 *     console.log('Supabase integration disabled');
 *   }
 * } catch (error) {
 *   console.error('Supabase environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateSupabaseEnv = (env: Record<string, unknown> = process.env): SupabaseEnv => {
  const result = supabaseEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid Supabase environment variables: ${errorMessages}\n\n` +
        `Configuration options:\n` +
        `- Production: Both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required\n` +
        `- Development: Optional, can use mock data\n` +
        `- Testing: Optional, uses test database\n\n` +
        `Setup instructions:\n` +
        `1. Create Supabase project at https://supabase.com\n` +
        `2. Copy project URL from Settings > API\n` +
        `3. Copy service role key from Settings > API\n` +
        `4. Set as environment variables\n\n` +
        `⚠️  Security: Never expose service role key to client-side code`
    );
  }

  // Custom validation: both variables must be provided together
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = result.data;
  const hasUrl = !!SUPABASE_URL;
  const hasKey = !!SUPABASE_SERVICE_ROLE_KEY;

  if (hasUrl !== hasKey) {
    throw new Error(
      `❌ Supabase configuration error: Both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided together or neither.\n\n` +
        `Current state:\n` +
        `- SUPABASE_URL: ${hasUrl ? 'provided' : 'missing'}\n` +
        `- SUPABASE_SERVICE_ROLE_KEY: ${hasKey ? 'provided' : 'missing'}\n\n` +
        `Solutions:\n` +
        `- Provide both variables for Supabase integration\n` +
        `- Provide neither variable to disable Supabase integration`
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
 * import { safeValidateSupabaseEnv } from '@repo/infra/env/schemas/supabase';
 *
 * const supabaseEnv = safeValidateSupabaseEnv();
 * if (supabaseEnv?.SUPABASE_URL) {
 *   console.log('Supabase integration available');
 * } else {
 *   console.log('Supabase integration disabled');
 * }
 * ```
 */
export const safeValidateSupabaseEnv = (
  env: Record<string, unknown> = process.env
): SupabaseEnv | null => {
  const result = supabaseEnvSchema.safeParse(env);

  if (!result.success) {
    return null;
  }

  // Check custom validation rule
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = result.data;
  const hasUrl = !!SUPABASE_URL;
  const hasKey = !!SUPABASE_SERVICE_ROLE_KEY;

  // Return null if validation rule is violated
  return hasUrl === hasKey ? result.data : null;
};

/**
 * Helper function to check if Supabase integration is enabled.
 * Returns true only when both URL and service role key are provided.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if Supabase integration is configured
 *
 * @example
 * ```typescript
 * import { isSupabaseEnabled } from '@repo/infra/env/schemas/supabase';
 *
 * if (isSupabaseEnabled()) {
 *   console.log('Using Supabase for data storage');
 * } else {
 *   console.log('Supabase integration disabled');
 * }
 * ```
 */
export const isSupabaseEnabled = (env: Record<string, unknown> = process.env): boolean => {
  const supabaseEnv = safeValidateSupabaseEnv(env);
  return !!(supabaseEnv?.SUPABASE_URL && supabaseEnv?.SUPABASE_SERVICE_ROLE_KEY);
};
