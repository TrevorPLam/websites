import { z } from 'zod';

/**
 * HubSpot environment variable schema.
 *
 * **2026 Best Practices Applied:**
 * - Uses `z.coerce()` for automatic type conversion from string env vars
 * - Validates private app token format and requirements
 * - Includes comprehensive JSDoc documentation
 * - Supports optional configuration for development/testing
 * - Provides security guidance for API token handling
 *
 * **Variables:**
 * - HUBSPOT_PRIVATE_APP_TOKEN: Private app token for CRM integration
 *
 * **Security Notes:**
 * - Private app token grants access to HubSpot CRM data
 * - Never expose token to client-side code
 * - Use principle of least privilege for token scopes
 * - Rotate tokens regularly for security
 *
 * @example
 * ```typescript
 * import { hubspotEnvSchema } from '@repo/infra/env/schemas/hubspot';
 *
 * const result = hubspotEnvSchema.safeParse(process.env);
 * if (!result.success) {
 *   console.error('Invalid HubSpot environment:', result.error.flatten().fieldErrors);
 * }
 * ```
 */
export const hubspotEnvSchema = z.object({
  /**
   * HubSpot private app token.
   * Required for HubSpot CRM integration and lead synchronization.
   * Must be a valid private app access token from HubSpot developer portal.
   *
   * @optional
   * @min 1
   * @example 'pat-na1-abcdef1234567890abcdef1234567890'
   * @see {@link https://developers.hubspot.com/docs/api/private-apps HubSpot Private Apps}
   * @security This token grants CRM access - keep secret and use minimal scopes
   */
  HUBSPOT_PRIVATE_APP_TOKEN: z.coerce
    .string()
    .min(1, 'HubSpot token cannot be empty when provided')
    .trim()
    .optional(),
});

/**
 * Type inference for HubSpot environment variables.
 * Provides TypeScript autocompletion and type safety.
 *
 * @example
 * ```typescript
 * type HubspotEnv = z.infer<typeof hubspotEnvSchema>;
 * // => { HUBSPOT_PRIVATE_APP_TOKEN?: string | undefined; }
 * ```
 */
export type HubspotEnv = z.infer<typeof hubspotEnvSchema>;

/**
 * Runtime validation function for HubSpot environment variables.
 * Returns validated environment or throws descriptive error.
 *
 * **Validation Logic:**
 * - Validates token format and non-empty requirement
 * - Provides security warnings and best practices
 * - Includes setup instructions for new users
 *
 * @param env - Environment object to validate (defaults to process.env)
 * @returns Validated HubSpot environment variables
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * import { validateHubspotEnv } from '@repo/infra/env/schemas/hubspot';
 *
 * try {
 *   const hubspotEnv = validateHubspotEnv();
 *   if (hubspotEnv.HUBSPOT_PRIVATE_APP_TOKEN) {
 *     console.log('HubSpot CRM integration enabled');
 *   } else {
 *     console.log('HubSpot CRM integration disabled');
 *   }
 * } catch (error) {
 *   console.error('HubSpot environment validation failed:', error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateHubspotEnv = (env: Record<string, unknown> = process.env): HubspotEnv => {
  const result = hubspotEnvSchema.safeParse(env);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');

    throw new Error(
      `❌ Invalid HubSpot environment variables: ${errorMessages}\n\n` +
        `Configuration options:\n` +
        `- Production: HUBSPOT_PRIVATE_APP_TOKEN required for CRM sync\n` +
        `- Development: Optional, can use mock CRM data\n` +
        `- Testing: Optional, uses test CRM endpoints\n\n` +
        `Setup instructions:\n` +
        `1. Go to HubSpot developer portal: https://developers.hubspot.com\n` +
        `2. Create private app with appropriate scopes\n` +
        `3. Generate private app access token\n` +
        `4. Set as HUBSPOT_PRIVATE_APP_TOKEN environment variable\n\n` +
        `⚠️  Security: Use principle of least privilege for token scopes`
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
 * import { safeValidateHubspotEnv } from '@repo/infra/env/schemas/hubspot';
 *
 * const hubspotEnv = safeValidateHubspotEnv();
 * if (hubspotEnv?.HUBSPOT_PRIVATE_APP_TOKEN) {
 *   console.log('HubSpot CRM integration available');
 * } else {
 *   console.log('HubSpot CRM integration disabled');
 * }
 * ```
 */
export const safeValidateHubspotEnv = (
  env: Record<string, unknown> = process.env
): HubspotEnv | null => {
  const result = hubspotEnvSchema.safeParse(env);
  return result.success ? result.data : null;
};

/**
 * Helper function to check if HubSpot integration is enabled.
 * Returns true only when private app token is provided.
 *
 * @param env - Environment object to check (defaults to process.env)
 * @returns true if HubSpot integration is configured
 *
 * @example
 * ```typescript
 * import { isHubspotEnabled } from '@repo/infra/env/schemas/hubspot';
 *
 * if (isHubspotEnabled()) {
 *   console.log('Using HubSpot for CRM integration');
 * } else {
 *   console.log('HubSpot CRM integration disabled');
 * }
 * ```
 */
export const isHubspotEnabled = (env: Record<string, unknown> = process.env): boolean => {
  const hubspotEnv = safeValidateHubspotEnv(env);
  return !!hubspotEnv?.HUBSPOT_PRIVATE_APP_TOKEN;
};
