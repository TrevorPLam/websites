// File: lib/constants.ts  [TRACE:FILE=lib.constants]
// Purpose: Application-wide constants for form validation, rate limiting, API configuration,
//          and UI timing. Centralizes magic numbers and configuration values to ensure
//          consistency across the codebase and facilitate maintenance.
//
// Exports / Entry: FORM_VALIDATION, RATE_LIMIT, HUBSPOT, UI_TIMING, TEST constants
// Used by: Form components, API handlers, rate limiting, and UI features throughout the application
//
// Invariants:
// - All validation limits must align with database schema constraints
// - Rate limits must be reasonable for user experience while preventing abuse
// - Retry delays must follow exponential backoff patterns
// - UI timing constants must balance responsiveness with user experience
// - Test timeouts must accommodate CI/CD environment constraints
//
// Status: @public
// Features:
// - [FEAT:VALIDATION] Form field length limits and constraints
// - [FEAT:SECURITY] Rate limiting and abuse prevention
// - [FEAT:INTEGRATION] External API retry configuration
// - [FEAT:UX] UI timing and debounce constants
// - [FEAT:TESTING] Test environment configuration

// [TRACE:CONST=lib.constants.formValidation]
// [FEAT:VALIDATION] [FEAT:SECURITY]
// NOTE: Form validation limits - enforces reasonable input lengths and prevents abuse while maintaining usability.
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

  /** Maximum length for services interested field */
  SERVICES_INTERESTED_MAX_LENGTH: 50,

  /** Maximum length for preferred appointment field */
  PREFERRED_APPOINTMENT_MAX_LENGTH: 50,

  /** Minimum length for message field */
  MESSAGE_MIN_LENGTH: 10,
  /** Maximum length for message field */
  MESSAGE_MAX_LENGTH: 5000,

  /** Maximum length for "hear about us" field */
  HEAR_ABOUT_US_MAX_LENGTH: 100,

  /** Maximum length for email subject lines */
  EMAIL_SUBJECT_MAX_LENGTH: 200,
} as const;

// [TRACE:CONST=lib.constants.rateLimit]
// [FEAT:SECURITY] [FEAT:PERFORMANCE]
// NOTE: Rate limiting configuration - balances user experience with abuse prevention using distributed Redis.
export const RATE_LIMIT = {
  /** Maximum requests allowed within time window */
  MAX_REQUESTS: 3,
  /** Time window in milliseconds (1 hour) */
  WINDOW_MS: 60 * 60 * 1000,
} as const;

// [TRACE:CONST=lib.constants.hubspot]
// [FEAT:INTEGRATION] [FEAT:RELIABILITY]
// NOTE: HubSpot API retry configuration - implements exponential backoff for resilient external API calls.
export const HUBSPOT = {
  /** Maximum number of retry attempts for HubSpot API calls */
  MAX_RETRIES: 3,
  /** Base delay in milliseconds for exponential backoff */
  RETRY_BASE_DELAY_MS: 250,
  /** Maximum delay in milliseconds for exponential backoff */
  RETRY_MAX_DELAY_MS: 2000,
} as const;

// [TRACE:CONST=lib.constants.uiTiming]
// [FEAT:UX] [FEAT:PERFORMANCE]
// NOTE: UI timing constants - optimizes user experience with appropriate delays and debouncing.
export const UI_TIMING = {
  /** Delay before showing PWA install prompt (milliseconds) */
  PWA_INSTALL_PROMPT_DELAY_MS: 3000,
  /** Debounce delay for form error display (milliseconds) */
  FORM_ERROR_DEBOUNCE_MS: 500,
} as const;

// [TRACE:CONST=lib.constants.test]
// [FEAT:TESTING] [FEAT:CI_CD]
// NOTE: Test configuration - ensures reliable test execution in CI/CD environments with appropriate timeouts.
export const TEST = {
  /** Default timeout for Playwright tests (milliseconds) */
  PLAYWRIGHT_TIMEOUT_MS: 60 * 1000,
  /** Default timeout for Playwright expect assertions (milliseconds) */
  PLAYWRIGHT_EXPECT_TIMEOUT_MS: 10 * 1000,
  /** Default local development URL */
  DEFAULT_DEV_URL: 'http://localhost:3000',
} as const;
