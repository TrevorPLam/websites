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
export * from './src/security/index.js';

// [TRACE:BLOCK=packages.infra.exports.auth]
// [FEAT:AUTH]
// NOTE: Authentication module exports - OAuth 2.1, tenant context, and middleware.
export * from './src/auth/index.js';

// [TRACE:BLOCK=packages.infra.exports.design]
// [FEAT:DESIGN]
// NOTE: Design system exports - spacing, typography, color, border, shadow utilities.
export * from './src/design/index.js';

// [TRACE:BLOCK=packages.infra.exports.monitoring]
// [FEAT:MONITORING]
// NOTE: Monitoring module exports - Sentry error tracking and data sanitization.
export * from './src/monitoring/index.js';

// [TRACE:BLOCK=packages.infra.exports.composition]
// [FEAT:COMPOSITION]
// NOTE: Composition pattern exports - slots, context, providers, HOCs.
export * from './src/composition/index.js';

// [TRACE:BLOCK=packages.infra.exports.accessibility]
// [FEAT:ACCESSIBILITY]
// NOTE: Accessibility exports - ARIA, keyboard, screen reader, hooks.
export * from './src/accessibility/index.js';

// [TRACE:BLOCK=packages.infra.exports.variants]
// [FEAT:VARIANTS]
// NOTE: Variant system exports - CVA, types, composition, utils.
export * from './src/variants/index.js';

// [TRACE:BLOCK=packages.infra.exports.middleware]
// [FEAT:MIDDLEWARE]
// NOTE: Middleware module exports - middleware factory for request processing.
export * from './middleware/create-middleware.js';

// [TRACE:BLOCK=packages.infra.exports.context]
// [FEAT:INFRASTRUCTURE]
// NOTE: Context module exports - request context safe for all environments.
export * from './context/request-context.js';

// [TRACE:BLOCK=packages.infra.exports.logging]
// [FEAT:LOGGING]
// NOTE: Logging module exports - structured logging with request context integration.
export * from './logger/index.js';

// [TRACE:BLOCK=packages.infra.exports.env]
// [FEAT:ENV]
// NOTE: Environment validation exports - schema validation and configuration.
export * from './env/index.js';

// [TRACE:BLOCK=packages.infra.exports.config]
// [FEAT:CONFIG]
// NOTE: Centralized configuration exports - type-safe environment variable access.
export * from './src/config.js';

// [TRACE:CONST=packages.infra.version]
// [FEAT:INFRASTRUCTURE]
// NOTE: Package version constant - used for compatibility checks and debugging.
export const INFRA_PACKAGE_VERSION = '1.0.0';

// [TRACE:BLOCK=packages.infra.exports.experiments]
// [FEAT:EXPERIMENTS]
// NOTE: Experimentation exports - A/B testing engine and guardrails.
export * from './experiments/index.js';
