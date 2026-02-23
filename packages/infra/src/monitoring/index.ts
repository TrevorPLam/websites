/**
 * Monitoring utilities barrel export
 * Consolidated monitoring: Sentry integration and sanitization
 */

// Server-side monitoring
export { withServerSpan, type SpanAttributeValue, type SpanAttributes } from '../../sentry/server';

// Data sanitization for monitoring
export { sanitizeSentryEvent } from '../../sentry/sanitize';

// Client-side monitoring
export { setSentryUser, setSentryContext, withSentrySpan } from '../../sentry/client';
