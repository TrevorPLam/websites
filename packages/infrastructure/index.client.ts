// Infrastructure package client entry point
// Exports client-safe infrastructure utilities only (no server-only code)

export * from './sentry/client';
export { logError, logInfo } from './logger/client';

// Client-safe security utilities
export {
  escapeHtml,
  sanitizeHtml,
  sanitizeEmailSubject,
  sanitizeEmail,
  sanitizeName,
  sanitizeUrl,
  sanitizeInput,
  validateAndSanitize,
  legacySanitize,
} from './security/sanitize';

export const INFRA_CLIENT_PACKAGE_VERSION = '1.0.0';
