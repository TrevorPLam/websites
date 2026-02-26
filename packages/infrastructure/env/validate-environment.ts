/**
 * Environment-specific validation with warnings.
 *
 * Purpose: validateEnvForEnvironment for dev/prod/test validation rules.
 * Exports: validateEnvForEnvironment
 */
import type { CompleteEnv, EnvValidationResult } from './types';
import { safeValidateEnv } from './validate-core';

/**
 * Validates environment for specific environment (development/production/test).
 * Applies environment-specific validation rules and requirements.
 */
export const validateEnvForEnvironment = (
  targetEnv: 'development' | 'production' | 'test',
  env: Record<string, unknown> = process.env
): EnvValidationResult<CompleteEnv> => {
  const result = safeValidateEnv({ includeOptional: true, env });

  if (!result.success) return result;

  const { data } = result;
  if (!data) return result;

  const warnings: string[] = [];

  if (targetEnv === 'production') {
    if (!data.UPSTASH_REDIS_REST_URL || !data.UPSTASH_REDIS_REST_TOKEN) {
      warnings.push('Production should use distributed rate limiting with Redis');
    }
    if (!data.NEXT_PUBLIC_SENTRY_DSN) {
      warnings.push('Production should have Sentry error tracking enabled');
    }
  }

  if (targetEnv === 'development' && data.NODE_ENV !== 'development') {
    warnings.push('NODE_ENV should be set to "development" in development');
  }

  if (targetEnv === 'test' && data.NODE_ENV !== 'test') {
    warnings.push('NODE_ENV should be set to "test" during testing');
  }

  if (warnings.length > 0) {
    return {
      success: true,
      data: result.data,
      error: {
        fieldErrors: {},
        message: `Environment warnings for ${targetEnv}:\n${warnings.join('\n')}`,
      },
    };
  }

  return result;
};
