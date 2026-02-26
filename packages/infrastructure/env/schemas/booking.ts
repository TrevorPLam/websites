import { z } from 'zod';

/**
 * Booking providers environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Supports multiple booking providers (Mindbody, Vagaro, Square)
 * - Validates API key and business ID combinations
 * - Includes comprehensive JSDoc documentation
 * - Supports optional configuration for development/testing
 *
 * **Variables:**
 * - MINDBODY_API_KEY: Mindbody API key for booking integration
 * - MINDBODY_BUSINESS_ID: Mindbody business ID
 * - VAGARO_API_KEY: Vagaro API key for booking integration
 * - VAGARO_BUSINESS_ID: Vagaro business ID
 * - SQUARE_API_KEY: Square API key for booking integration
 * - SQUARE_BUSINESS_ID: Square business ID
 *
 * **Provider Combinations:**
 * - Each provider requires both API key and business ID
 * - Multiple providers can be configured simultaneously
 * - Provider selection handled at runtime based on configuration
 *
 * @example
 * ```typescript
 * import { bookingEnvSchema } from '@repo/infrastructure/env/schemas/booking';
 *
 * const result = bookingEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid booking environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const bookingEnvSchema = z.object({
  /**
   * Mindbody API key for booking integration.
   * Required for Mindbody booking provider functionality.
   * Must be a valid API key from Mindbody developer portal.
   *
   * @optional
   * @min 1
   * @example 'abcdef1234567890abcdef1234567890'
   * @see {@link https://developers.mindbodyonline.com/ Mindbody Developer Portal}
   * @security This key grants booking system access - keep secret
   */
  MINDBODY_API_KEY: z.coerce
    .string()
    .min(1, 'Mindbody API key cannot be empty when provided')
    .trim()
    .optional(),

  /**
   * Mindbody business ID for booking integration.
   * Required together with MINDBODY_API_KEY for Mindbody provider.
   * Must be a valid business ID from your Mindbody account.
   *
   * @optional
   * @min 1
   * @example '-99887'
   * @see {@link https://developers.mindbodyonline.com/ Mindbody Developer Portal}
   */
  MINDBODY_BUSINESS_ID: z.coerce
    .string()
    .min(1, 'Mindbody business ID cannot be empty when provided')
    .trim()
    .optional(),

  /**
   * Vagaro API key for booking integration.
   * Required for Vagaro booking provider functionality.
   * Must be a valid API key from Vagaro developer portal.
   *
   * @optional
   * @min 1
   * @example 'abcdef1234567890abcdef1234567890'
   * @see {@link https://developer.vagaro.com/ Vagaro Developer Portal}
   * @security This key grants booking system access - keep secret
   */
  VAGARO_API_KEY: z.coerce
    .string()
    .min(1, 'Vagaro API key cannot be empty when provided')
    .trim()
    .optional(),

  /**
   * Vagaro business ID for booking integration.
   * Required together with VAGARO_API_KEY for Vagaro provider.
   * Must be a valid business ID from your Vagaro account.
   *
   * @optional
   * @min 1
   * @example '123456'
   * @see {@link https://developer.vagaro.com/ Vagaro Developer Portal}
   */
  VAGARO_BUSINESS_ID: z.coerce
    .string()
    .min(1, 'Vagaro business ID cannot be empty when provided')
    .trim()
    .optional(),

  /**
   * Square API key for booking integration.
   * Required for Square booking provider functionality.
   * Must be a valid API key from Square developer portal.
   *
   * @optional
   * @min 1
   * @example 'sq0idp-abcdef1234567890abcdef1234567890'
   * @see {@link https://developer.squareup.com/ Square Developer Portal}
   * @security This key grants booking system access - keep secret
   */
  SQUARE_API_KEY: z.coerce
    .string()
    .min(1, 'Square API key cannot be empty when provided')
    .trim()
    .optional(),

  /**
   * Square business ID for booking integration.
   * Required together with SQUARE_API_KEY for Square provider.
   * Must be a valid business ID from your Square account.
   *
   * @optional
   * @min 1
   * @example 'ABC123DEF456'
   * @see {@link https://developer.squareup.com/ Square Developer Portal}
   */
  SQUARE_BUSINESS_ID: z.coerce
    .string()
    .min(1, 'Square business ID cannot be empty when provided')
    .trim()
    .optional(),
});

/**
 * Type inference for booking environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type BookingEnv = z.infer<typeof bookingEnvSchema>;
 * // => {
 * //   MINDBODY_API_KEY?: string | undefined;
 * //   MINDBODY_BUSINESS_ID?: string | undefined;
 * //   VAGARO_API_KEY?: string | undefined;
 * //   VAGARO_BUSINESS_ID?: string | undefined;
 * //   SQUARE_API_KEY?: string | undefined;
 * //   SQUARE_BUSINESS_ID?: string | undefined;
 * // }
 * ```
 */
export type BookingEnv = z.infer<typeof bookingEnvSchema>;

/**
 * Runtime validation function for booking environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Each provider must have both API key and business ID or neither
 * - Validates non-empty requirements for all provided values
 * - Provides clear error messages for misconfiguration
 * - Supports multiple providers simultaneously
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated booking environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateBookingEnv } from '@repo/infrastructure/env/schemas/booking';
 *
 * try {
 *   const bookingEnv = validateBookingEnv();
 *   const enabledProviders = getEnabledBookingProviders(bookingEnv);
 *   console.log('Enabled booking providers:', enabledProviders);
 * } catch (error) {
 *   console.error('Booking environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateBookingEnv = (env: Record<string, unknown> = process.env): BookingEnv => {
  const result = bookingEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid booking environment variables: ${errorMessages}\n\n` +
        `Provider configuration requirements:\n` +
        `- Mindbody: Both MINDBODY_API_KEY and MINDBODY_BUSINESS_ID required\n` +
        `- Vagaro: Both VAGARO_API_KEY and VAGARO_BUSINESS_ID required\n` +
        `- Square: Both SQUARE_API_KEY and SQUARE_BUSINESS_ID required\n\n` +
        `Setup instructions:\n` +
        `1. Choose booking provider(s) for your business\n` +
        `2. Create developer account(s) and obtain API credentials\n` +
        `3. Set environment variables for each provider\n` +
        `4. Configure provider selection in your booking system\n\n` +
        `⚠️  Security: Keep API keys secret and use minimal permissions`
    );
  }

  // Custom validation: each provider must have both API key and business ID
  const {
    MINDBODY_API_KEY,
    MINDBODY_BUSINESS_ID,
    VAGARO_API_KEY,
    VAGARO_BUSINESS_ID,
    SQUARE_API_KEY,
    SQUARE_BUSINESS_ID,
  } = result.data;

  const errors: string[] = [];

  // Check Mindbody configuration
  const hasMindbodyKey = !!MINDBODY_API_KEY;
  const hasMindbodyId = !!MINDBODY_BUSINESS_ID;
  if (hasMindbodyKey !== hasMindbodyId) {
    errors.push(
      'Mindbody: Both MINDBODY_API_KEY and MINDBODY_BUSINESS_ID must be provided together or neither'
    );
  }

  // Check Vagaro configuration
  const hasVagaroKey = !!VAGARO_API_KEY;
  const hasVagaroId = !!VAGARO_BUSINESS_ID;
  if (hasVagaroKey !== hasVagaroId) {
    errors.push(
      'Vagaro: Both VAGARO_API_KEY and VAGARO_BUSINESS_ID must be provided together or neither'
    );
  }

  // Check Square configuration
  const hasSquareKey = !!SQUARE_API_KEY;
  const hasSquareId = !!SQUARE_BUSINESS_ID;
  if (hasSquareKey !== hasSquareId) {
    errors.push(
      'Square: Both SQUARE_API_KEY and SQUARE_BUSINESS_ID must be provided together or neither'
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `❌ Booking provider configuration error:\n${errors.join('\n')}\n\n` +
        `Solutions:\n` +
        `- Provide complete credentials for each enabled provider\n` +
        `- Provide no credentials for unused providers\n` +
        `- At least one provider must be configured for booking functionality`
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
 * import { safeValidateBookingEnv } from '@repo/infrastructure/env/schemas/booking';
 *
 * const bookingEnv = safeValidateBookingEnv();
 * if (bookingEnv) {
 *   const providers = getEnabledBookingProviders(bookingEnv);
 *   console.log('Available booking providers:', providers);
 * } else {
 *   console.log('No booking providers configured');
 * }
 * ```
 */
export const safeValidateBookingEnv = (
  env: Record<string, unknown> = process.env
): BookingEnv | null => {
  const result = bookingEnvSchema.safeParse(env);

  if (!result.success) {
    return null;
  }

  // Check custom validation rules
  const {
    MINDBODY_API_KEY,
    MINDBODY_BUSINESS_ID,
    VAGARO_API_KEY,
    VAGARO_BUSINESS_ID,
    SQUARE_API_KEY,
    SQUARE_BUSINESS_ID,
  } = result.data;

  // Check each provider configuration
  const hasMindbodyKey = !!MINDBODY_API_KEY;
  const hasMindbodyId = !!MINDBODY_BUSINESS_ID;
  const hasVagaroKey = !!VAGARO_API_KEY;
  const hasVagaroId = !!VAGARO_BUSINESS_ID;
  const hasSquareKey = !!SQUARE_API_KEY;
  const hasSquareId = !!SQUARE_BUSINESS_ID;

  // Return null if any provider configuration is invalid
  if (
    hasMindbodyKey !== hasMindbodyId ||
    hasVagaroKey !== hasVagaroId ||
    hasSquareKey !== hasSquareId
  ) {
    return null;
  }

  return result.data;
};

/**
 * Helper function to get list of enabled booking providers.
 * Returns array of provider names that are properly configured.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns Array of enabled provider names
 *
 * @example
 * ```typescript
 * import { getEnabledBookingProviders } from '@repo/infrastructure/env/schemas/booking';
 *
 * const providers = getEnabledBookingProviders();
 * console.log('Enabled providers:', providers); // ['mindbody', 'square']
 * ```
 */
export const getEnabledBookingProviders = (
  env: Record<string, unknown> = process.env
): string[] => {
  const bookingEnv = safeValidateBookingEnv(env);
  if (!bookingEnv) return [];

  const providers: string[] = [];

  if (bookingEnv.MINDBODY_API_KEY && bookingEnv.MINDBODY_BUSINESS_ID) {
    providers.push('mindbody');
  }

  if (bookingEnv.VAGARO_API_KEY && bookingEnv.VAGARO_BUSINESS_ID) {
    providers.push('vagaro');
  }

  if (bookingEnv.SQUARE_API_KEY && bookingEnv.SQUARE_BUSINESS_ID) {
    providers.push('square');
  }

  return providers;
};

/**
 * Helper function to check if any booking provider is enabled.
 * Returns true if at least one provider is properly configured.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if any booking provider is configured
 *
 * @example
 * ```typescript
 * import { isBookingEnabled } from '@repo/infrastructure/env/schemas/booking';
 *
 * if (isBookingEnabled()) {
 *   console.log('Booking system is available');
 * } else {
 *   console.log('No booking providers configured');
 * }
 * ```
 */
export const isBookingEnabled = (env: Record<string, unknown> = process.env): boolean => {
  return getEnabledBookingProviders(env).length > 0;
};
