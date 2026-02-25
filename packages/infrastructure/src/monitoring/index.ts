/**
 * @file packages/infrastructure/src/monitoring/index.ts
 * @summary Monitoring utilities barrel export
 * @description Consolidated monitoring: Sentry integration, sanitization, and health checks
 * @security Monitoring data sanitization and PII protection for GDPR compliance
 * @requirements PROD-007 / observability / monitoring
 */

// Server-side monitoring
export { withServerSpan, type SpanAttributeValue, type SpanAttributes } from '../../sentry/server';

// Data sanitization for monitoring
export { sanitizeSentryEvent } from '../../sentry/sanitize';

// Client-side monitoring
export { setSentryUser, setSentryContext, withSentrySpan } from '../../sentry/client';

// Health check system
export {
  HealthCheckManager,
  healthCheckManager,
  type HealthCheckResult,
  type HealthCheckSummary,
} from './health-checks';
