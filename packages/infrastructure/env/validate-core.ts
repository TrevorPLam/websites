/**
 * Core environment validation functions.
 *
 * Purpose: validateEnv and safeValidateEnv for type-safe environment validation.
 * Exports: validateEnv, safeValidateEnv
 */
import type { CompleteEnv, EnvConfigOptions, EnvValidationResult } from './types';
import { completeEnvSchema } from './validate-schema';
import { baseEnvSchema } from './schemas/base';
import { publicEnvSchema } from './schemas/public';

/**
 * Validates environment variables with comprehensive error reporting.
 * Returns validated environment or throws descriptive error.
 */
export const validateEnv = (
  options: EnvConfigOptions = {}
): CompleteEnv | EnvValidationResult<CompleteEnv> => {
  const {
    throwOnError = true,
    includeOptional = true,
    env = process.env,
    serverOnly = false,
  } = options;

  const schema = includeOptional ? completeEnvSchema : baseEnvSchema.merge(publicEnvSchema);
  const result = schema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    const errorMessage =
      `❌ Invalid environment variables: ${errorMessages}\n\n` +
      `Validation context:\n` +
      `- Node Environment: ${env.NODE_ENV || 'development'}\n` +
      `- Include Optional: ${includeOptional}\n` +
      `- Server Only: ${serverOnly}\n\n` +
      `Common issues:\n` +
      `- Missing required variables (NODE_ENV, SITE_URL, SITE_NAME)\n` +
      `- Invalid URL format for SITE_URL or NEXT_PUBLIC_SITE_URL\n` +
      `- Incomplete provider configuration (both API key and ID required)\n\n` +
      `Setup instructions:\n` +
      `1. Copy .env.example to .env.local\n` +
      `2. Configure required variables for your environment\n` +
      `3. Add optional variables for integrations you need\n` +
      `4. Restart your application`;

    if (throwOnError) throw new Error(errorMessage);

    return {
      success: false,
      error: { fieldErrors, message: errorMessage },
    } as EnvValidationResult<CompleteEnv>;
  }

  const validatedEnv = result.data as CompleteEnv;
  if (throwOnError) return validatedEnv;

  return { success: true, data: validatedEnv } as EnvValidationResult<CompleteEnv>;
};

/**
 * Safe environment validation that doesn't throw errors.
 * Returns validation result with success status.
 */
export const safeValidateEnv = (
  options: Omit<EnvConfigOptions, 'throwOnError'> = {}
): EnvValidationResult<CompleteEnv> => {
  const result = validateEnv({ ...options, throwOnError: false });

  if (typeof result === 'object' && 'success' in result) return result;

  return { success: true, data: result };
};
