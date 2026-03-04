/**
 * @file packages/feature-flags/src/flags.ts
 * @summary Canonical flag-name constants and typed helpers.
 * @description Re-exports the typed {@link FeatureFlag} union and the
 *   {@link FEATURE_FLAGS} tuple from `feature-flags.ts` so that consumers
 *   can import flag names from a single location without pulling in the
 *   entire Edge Config / Redis runtime.
 *
 *   Usage:
 *   ```ts
 *   import { FEATURE_FLAGS, FLAG } from '@repo/feature-flags/flags';
 *
 *   if (flags[FLAG.AB_TESTING]) { … }
 *   ```
 *
 * @security Flag name constants contain no secrets; safe to import in client bundles.
 * @adr none
 * @requirements TASK-011
 */

export type { FeatureFlag } from './feature-flags';
export { isValidFeatureFlag } from './feature-flags';

/**
 * All feature flag names as a readonly tuple.
 * Importing this array avoids duplicating the literal list across files.
 */
export const FEATURE_FLAGS = [
  'offline_lead_forms',
  'realtime_lead_feed',
  'ab_testing',
  'ai_chat_widget',
  'booking_calendar',
  'stripe_billing',
  'white_label_portal',
  'gdpr_tools',
  'api_access',
  'sso_enabled',
  'advanced_analytics',
  'multi_site',
  'custom_domain',
  'ghl_crm_sync',
  'hubspot_crm_sync',
] as const;

/**
 * Short-form enum-style constants for flag names.
 * Prevents magic strings in application code.
 *
 * @example
 * ```ts
 * if (resolvedFlags[FLAG.STRIPE_BILLING]) {
 *   showBillingUI();
 * }
 * ```
 */
export const FLAG = {
  OFFLINE_LEAD_FORMS: 'offline_lead_forms',
  REALTIME_LEAD_FEED: 'realtime_lead_feed',
  AB_TESTING: 'ab_testing',
  AI_CHAT_WIDGET: 'ai_chat_widget',
  BOOKING_CALENDAR: 'booking_calendar',
  STRIPE_BILLING: 'stripe_billing',
  WHITE_LABEL_PORTAL: 'white_label_portal',
  GDPR_TOOLS: 'gdpr_tools',
  API_ACCESS: 'api_access',
  SSO_ENABLED: 'sso_enabled',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  MULTI_SITE: 'multi_site',
  CUSTOM_DOMAIN: 'custom_domain',
  GHL_CRM_SYNC: 'ghl_crm_sync',
  HUBSPOT_CRM_SYNC: 'hubspot_crm_sync',
} as const satisfies Record<string, (typeof FEATURE_FLAGS)[number]>;

export type FlagKey = keyof typeof FLAG;
