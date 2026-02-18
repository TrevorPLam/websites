/**
 * Environment variable validation and composition utilities.
 *
 * **2026 Best Practices Applied:**
 * - Composable schema validation with Zod
 * - Descriptive error messages with setup instructions
 * - Type-safe environment variable access
 * - Support for optional and required variables
 * - Comprehensive validation context and error reporting
 *
 * @example
 * ```typescript
 * import { validateEnv, createEnvSchema } from '@repo/infra/env/validate';
 * import type { CompleteEnv } from '@repo/infra/env/types';
 *
 * const env = validateEnv();
 * console.log('Site:', env.NEXT_PUBLIC_SITE_NAME);
 * ```
 */

export {
  createEnvSchema,
  completeEnvSchema,
  createEnvSchemaForEnvironment,
} from './validate-schema';

export { validateEnv, safeValidateEnv } from './validate-core';

export { getEnvContext, getFeatureFlags } from './validate-context';

export { validateEnvForEnvironment } from './validate-environment';
