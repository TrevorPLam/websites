// File: packages/infra/index.ts  [TRACE:FILE=packages.infra.index]
// Purpose: Infrastructure package entry point providing centralized exports for all security,
//          middleware, logging, and monitoring utilities. Serves as the main interface for
//          application infrastructure components and services.
//
// Relationship: Depends on @repo/utils, zod, server-only. Consumed by templates, @repo/features, @repo/integrations-*.
// System role: Cross-cutting infra; server-only exports; client-safe surface in index.client.ts.
// Assumptions: Sentry/rate-limit are optional (peer deps); env validation required at app bootstrap.
//
// Exports / Entry: All infrastructure modules, INFRA_PACKAGE_VERSION constant
// Used by: Application code requiring security, middleware, logging, or monitoring functionality
//
// Invariants:
// - Must export all completed infrastructure modules
// - Must maintain backward compatibility for existing exports
// - Server-only modules must be clearly documented
// - Version must reflect breaking changes or major updates
// - All exports must be properly typed and documented
//
// Status: @internal
// Features:
// - [FEAT:SECURITY] CSP, security headers, sanitization, and rate limiting
// - [FEAT:MIDDLEWARE] Request validation and middleware factory
// - [FEAT:LOGGING] Structured logging with request context
// - [FEAT:MONITORING] Sentry error tracking and sanitization
// - [FEAT:INFRASTRUCTURE] Centralized infrastructure exports

// [TRACE:BLOCK=packages.infra.exports.security]
// [FEAT:SECURITY]
// NOTE: Security module exports - CSP, headers, sanitization, rate limiting, and request validation.
// CSP Module (Task 1.1.2 - COMPLETED)
export * from './security/csp';

// Security Headers Module (Task 1.1.3 - COMPLETED)
export * from './security/security-headers';

// Sanitize Module (Task 1.1.4 - COMPLETED)
export * from './security/sanitize';

// Rate Limit Module (Task 1.1.5 - COMPLETED)
export * from './security/rate-limit';
export * from './security/secure-action';
export type { Result, ActionError } from './security/secure-action';

// Request Validation Module (Task 1.1.6 - COMPLETED)
export * from './security/request-validation';

// Tenant Context Module (Task security-2 - COMPLETED)
export * from './src/auth/tenant-context';

// Database Booking Helpers (Task security-1 - COMPLETED)
export * from './src/database-booking';

// [TRACE:BLOCK=packages.infra.exports.middleware]
// [FEAT:MIDDLEWARE]
// NOTE: Middleware module exports - middleware factory for request processing.
// Middleware Factory (Task 1.1.7 - COMPLETED)
export * from './middleware/create-middleware';

// [TRACE:BLOCK=packages.infra.exports.context]
// [FEAT:INFRASTRUCTURE]
// NOTE: Context module exports - request context safe for all environments.
// Request context (stub — safe for all environments)
export * from './context/request-context';

// [TRACE:BLOCK=packages.infra.exports.logging]
// [FEAT:LOGGING]
// NOTE: Logging module exports - structured logging with request context integration.
// Logger (server-only; uses request-context.server internally)
export * from './logger';

// [TRACE:BLOCK=packages.infra.exports.monitoring]
// [FEAT:MONITORING]
// NOTE: Monitoring module exports - Sentry error tracking and data sanitization.
// Sentry server and sanitize (server-only)
export * from './sentry/server';
export * from './sentry/sanitize';

// [TRACE:CONST=packages.infra.version]
// [FEAT:INFRASTRUCTURE]
// NOTE: Package version constant - used for compatibility checks and debugging.
export const INFRA_PACKAGE_VERSION = '1.0.0';
