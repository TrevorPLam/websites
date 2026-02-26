import { z } from 'zod';

/**
 * Sentry environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Validates DSN format and sample rate requirements
 * - Includes comprehensive JSDoc documentation
 * - Supports optional configuration for development/testing
 * - Provides performance monitoring configuration options
 *
 * **Variables:**
 * - NEXT_PUBLIC_SENTRY_DSN: Sentry Data Source Name for error tracking
 * - SENTRY_SAMPLE_RATE: Error sampling rate (0.0 to 1.0)
 *
 * **Security Notes:**
 * - DSN contains authentication information
 * - Never expose DSN to client-side code unless necessary
 * - Use appropriate sampling rates for performance and cost control
 *
 * @example
 * ```typescript
 * import { sentryEnvSchema } from '@repo/infrastructure/env/schemas/sentry';
 *
 * const result = sentryEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid Sentry environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const sentryEnvSchema = z.object({
  /**
   * Sentry Data Source Name (DSN).
   * Required for Sentry error tracking and performance monitoring.
   * Must be a valid Sentry DSN URL from your Sentry project.
   *
   * @optional
   * @format url
   * @example 'https://abcdef1234567890abcdef1234567890@o123456.ingest.sentry.io/1234567'
   * @see {@link https://docs.sentry.io/product/sentry-basics/dsn-explainer/ Sentry DSN Documentation}
   * @security DSN contains project credentials - keep secret
   */
  // [Task 1.3.3] Renamed from SENTRY_DSN to NEXT_PUBLIC_SENTRY_DSN
  // Client-side access requires the NEXT_PUBLIC_ prefix in Next.js
  NEXT_PUBLIC_SENTRY_DSN: z.coerce.string().url('Must be a valid URL').optional(),

  /**
   * Sentry error sampling rate.
   * Controls percentage of errors sent to Sentry (0.0 to 1.0).
   * Useful for controlling volume and costs in high-traffic applications.
   *
   * @optional
   * @min 0
   * @max 1
   * @example 0.1 // Send 10% of errors
   * @example 1.0 // Send all errors
   * @default 1.0
   */
  SENTRY_SAMPLE_RATE: z.coerce
    .number()
    .min(0, 'Sample rate must be between 0 and 1')
    .max(1, 'Sample rate must be between 0 and 1')
    .default(1.0)
    .optional(),
});

/**
 * Type inference for Sentry environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type SentryEnv = z.infer<typeof sentryEnvSchema>;
 * // => { NEXT_PUBLIC_SENTRY_DSN?: string | undefined; SENTRY_SAMPLE_RATE?: number | undefined; }
 * ```
 */
export type SentryEnv = z.infer<typeof sentryEnvSchema>;

/**
 * Runtime validation function for Sentry environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Validates DSN URL format when provided
 * - Ensures sample rate is within valid range (0.0 to 1.0)
 * - Provides clear setup instructions and best practices
 * - Includes performance monitoring guidance
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated Sentry environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateSentryEnv } from '@repo/infrastructure/env/schemas/sentry';
 *
 * try {
 *   const sentryEnv = validateSentryEnv();
 *   if (sentryEnv.NEXT_PUBLIC_SENTRY_DSN) {
 *     console.log('Sentry error tracking enabled');
 *     console.log(`Sample rate: ${sentryEnv.SENTRY_SAMPLE_RATE}`);
 *   } else {
 *     console.log('Sentry error tracking disabled');
 *   }
 * } catch (error) {
 *   console.error('Sentry environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateSentryEnv = (env: Record<string, unknown> = process.env): SentryEnv => {
  const result = sentryEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid Sentry environment variables: ${errorMessages}\n\n` +
        `Configuration options:\n` +
        `- Production: NEXT_PUBLIC_SENTRY_DSN required for error tracking\n` +
        `- Development: Optional, can use local error logging\n` +
        `- Testing: Optional, uses test error reporting\n\n` +
        `Setup instructions:\n` +
        `1. Create Sentry project at https://sentry.io\n` +
        `2. Copy DSN from Settings > Client Keys (DSN)\n` +
        `3. Set NEXT_PUBLIC_SENTRY_DSN environment variable\n` +
        `4. Optionally set SENTRY_SAMPLE_RATE (0.0-1.0)\n\n` +
        `Sample rate recommendations:\n` +
        `- Production: 0.1-1.0 (10%-100%)\n` +
        `- High traffic: 0.01-0.1 (1%-10%)\n` +
        `- Development: 1.0 (100% for debugging)\n\n` +
        `⚠️  Security: Keep DSN secret and use appropriate sample rates`
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
 * import { safeValidateSentryEnv } from '@repo/infrastructure/env/schemas/sentry';
 *
 * const sentryEnv = safeValidateSentryEnv();
 * if (sentryEnv?.NEXT_PUBLIC_SENTRY_DSN) {
 *   console.log('Sentry error tracking available');
 *   console.log(`Sample rate: ${sentryEnv.SENTRY_SAMPLE_RATE}`);
 * } else {
 *   console.log('Sentry error tracking disabled');
 * }
 * ```
 */
export const safeValidateSentryEnv = (
  env: Record<string, unknown> = process.env
): SentryEnv | null => {
  const result = sentryEnvSchema.safeParse(env);
  return result.success ? result.data : null;
};

/**
 * Helper function to check if Sentry error tracking is enabled.
 * Returns true only when DSN is provided and valid.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if Sentry error tracking is configured
 *
 * @example
 * ```typescript
 * import { isSentryEnabled } from '@repo/infrastructure/env/schemas/sentry';
 *
 * if (isSentryEnabled()) {
 *   console.log('Using Sentry for error tracking');
 * } else {
 *   console.log('Sentry error tracking disabled');
 * }
 * ```
 */
export const isSentryEnabled = (env: Record<string, unknown> = process.env): boolean => {
  const sentryEnv = safeValidateSentryEnv(env);
  return !!sentryEnv?.NEXT_PUBLIC_SENTRY_DSN;
};

/**
 * Helper function to get Sentry sample rate.
 * Returns the configured sample rate or default value.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns Sample rate between 0.0 and 1.0
 *
 * @example
 * ```typescript
 * import { getSentrySampleRate } from '@repo/infrastructure/env/schemas/sentry';
 *
 * const sampleRate = getSentrySampleRate();
 * console.log(`Sentry sample rate: ${sampleRate * 100}%`);
 * ```
 */
export const getSentrySampleRate = (env: Record<string, unknown> = process.env): number => {
  const sentryEnv = safeValidateSentryEnv(env);
  return sentryEnv?.SENTRY_SAMPLE_RATE ?? 1.0;
};
