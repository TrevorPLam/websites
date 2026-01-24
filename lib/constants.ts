/**
 * Application-wide constants for configuration values.
 * 
 * @module lib/constants
 * 
 * This file centralizes magic numbers and configuration values to:
 * - Improve code maintainability
 * - Provide clear naming for values
 * - Make it easier to adjust configuration
 * - Enable consistent values across the application
 */

/**
 * Form validation constants
 */
export const FORM_VALIDATION = {
  /** Minimum length for name field */
  NAME_MIN_LENGTH: 2,
  /** Maximum length for name field */
  NAME_MAX_LENGTH: 100,
  
  /** Maximum length for email address (RFC 5321 standard) */
  EMAIL_MAX_LENGTH: 254,
  
  /** Maximum length for company field */
  COMPANY_MAX_LENGTH: 200,
  
  /** Maximum length for phone field */
  PHONE_MAX_LENGTH: 50,
  
  /** Maximum length for marketing spend field */
  MARKETING_SPEND_MAX_LENGTH: 50,
  
  /** Minimum length for message field */
  MESSAGE_MIN_LENGTH: 10,
  /** Maximum length for message field */
  MESSAGE_MAX_LENGTH: 5000,
  
  /** Maximum length for "hear about us" field */
  HEAR_ABOUT_US_MAX_LENGTH: 100,
  
  /** Maximum length for email subject lines */
  EMAIL_SUBJECT_MAX_LENGTH: 200,
} as const

/**
 * Rate limiting constants
 */
export const RATE_LIMIT = {
  /** Maximum requests allowed within the time window */
  MAX_REQUESTS: 3,
  /** Time window in milliseconds (1 hour) */
  WINDOW_MS: 60 * 60 * 1000,
} as const

/**
 * HubSpot integration constants
 */
export const HUBSPOT = {
  /** Maximum number of retry attempts for HubSpot API calls */
  MAX_RETRIES: 3,
  /** Base delay in milliseconds for exponential backoff */
  RETRY_BASE_DELAY_MS: 250,
  /** Maximum delay in milliseconds for exponential backoff */
  RETRY_MAX_DELAY_MS: 2000,
} as const

/**
 * UI/UX timing constants
 */
export const UI_TIMING = {
  /** Delay before showing PWA install prompt (milliseconds) */
  PWA_INSTALL_PROMPT_DELAY_MS: 3000,
  /** Debounce delay for form error display (milliseconds) */
  FORM_ERROR_DEBOUNCE_MS: 500,
} as const

/**
 * Test-related constants
 */
export const TEST = {
  /** Default timeout for Playwright tests (milliseconds) */
  PLAYWRIGHT_TIMEOUT_MS: 60 * 1000,
  /** Default timeout for Playwright expect assertions (milliseconds) */
  PLAYWRIGHT_EXPECT_TIMEOUT_MS: 10 * 1000,
  /** Default local development URL */
  DEFAULT_DEV_URL: 'http://localhost:3000',
} as const
