// File: packages/infra/logger/index.ts  [TRACE:FILE=packages.infra.logger.index]
// Purpose: Structured logging system entry point providing server-side logging with
//
// Relationship: Used by all infra and features (logError, logWarn, logInfo). request-context.server for requestId.
// System role: logInfo/logWarn/logError with optional context; sanitizeLogContext for PII; server-focused.
// Assumptions: Context may contain PII; sanitizeLogContext strips sensitive keys.
//          environment-aware output formatting, security sanitization, and Sentry
//          integration for production error tracking and monitoring.
//
// Exports / Entry: logInfo, logWarn, logError, log, sanitizeLogContext, LogLevel, LogContext
// Used by: Server-side code, API routes, middleware, any infrastructure components
//
// Invariants:
// - Must be server-only (browser usage is not supported)
// - Production output must be JSON formatted for log drains
// - Sensitive data must be sanitized before logging
// - Request context must be enriched when available
// - Sentry integration must be conditional on DSN availability
//
// Status: @internal
// Features:
// - [FEAT:LOGGING] Structured logging with multiple levels
// - [FEAT:SECURITY] OWASP-compliant data sanitization
// - [FEAT:MONITORING] Sentry error tracking integration
// - [FEAT:PERFORMANCE] Environment-aware output formatting
// - [FEAT:CONTEXT] Request ID enrichment and tracing

/**
 * Structured logger — server-only.
 * Production: JSON output (Vercel Log Drain compatible). Dev/test: human-readable.
 * Sanitizes context (OWASP logging); enriches with request ID when available.
 * @module @repo/infrastructure/logger
 */

import * as Sentry from '@sentry/nextjs';
import { getRequestId } from '../context/request-context.server';

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

interface LogRecord {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: unknown;
}

// [Task 9.6.5] Single source of truth for sensitive key fragments.
// Used for both exact-match and substring-match PII detection.
const SENSITIVE_KEY_FRAGMENTS = [
  'password',
  'passcode',
  'token',
  'authorization',
  'cookie',
  'api_key',
  'apikey',
  'secret',
  'client_secret',
  'refresh_token',
  'access_token',
  'session_id',
  'sessionid',
] as const;

const SENSITIVE_KEYS = new Set<string>(SENSITIVE_KEY_FRAGMENTS);

// [Task 9.7.4] Pre-compiled regex for substring matching — avoids per-call iteration
const SENSITIVE_KEY_PATTERN = new RegExp(SENSITIVE_KEY_FRAGMENTS.join('|'), 'i');

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function isSensitiveKey(key: string): boolean {
  const normalized = normalizeKey(key);
  if (SENSITIVE_KEYS.has(normalized)) {
    return true;
  }
  // [Task 9.7.4] Uses pre-compiled regex instead of Array.some() loop
  return SENSITIVE_KEY_PATTERN.test(normalized);
}

function buildLogContext(context?: LogContext): LogContext | undefined {
  const requestId = getRequestId();
  const hasRequestId = Boolean(context?.request_id || context?.requestId);

  if (!requestId || hasRequestId) {
    return context;
  }

  return { ...(context ?? {}), request_id: requestId };
}

function buildLogRecord(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: unknown
): LogRecord {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
    ...(error !== undefined ? { error } : {}),
  };
}

function logJson(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
  const record = buildLogRecord(level, message, context, error);
  const payload = JSON.stringify(record);

  if (level === 'info') {
    console.info(payload);
    return;
  }

  if (level === 'warn') {
    console.warn(payload);
    return;
  }

  console.error(payload);
}

function shouldPreserveObject(value: object): boolean {
  return value instanceof Error || value instanceof Date || value instanceof RegExp;
}

// [Task 1.5.7] maxDepth parameter prevents stack overflow on deeply nested objects
const MAX_SANITIZE_DEPTH = 10;

function sanitizeArray(values: unknown[], depth: number): unknown[] {
  return values.map((item) => sanitizeValue(item, depth));
}

function sanitizeObject(value: Record<string, unknown>, depth: number): Record<string, unknown> {
  return Object.entries(value).reduce<Record<string, unknown>>(
    (acc, [key, entryValue]) => {
      acc[key] = isSensitiveKey(key) ? '[REDACTED]' : sanitizeValue(entryValue, depth);
      return acc;
    },
    Object.create(null) as Record<string, unknown>
  );
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  // [Task 1.5.7] Bail out at max depth to prevent stack overflow on cyclic/deep objects
  if (depth >= MAX_SANITIZE_DEPTH) {
    return '[too deep]';
  }

  if (Array.isArray(value)) {
    return sanitizeArray(value, depth + 1);
  }

  if (value && typeof value === 'object') {
    if (shouldPreserveObject(value)) {
      return value;
    }

    return sanitizeObject(value as Record<string, unknown>, depth + 1);
  }

  return value;
}

/**
 * Sanitize log context for safe external usage (tests, integrations).
 */
export function sanitizeLogContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return context;
  }

  return sanitizeValue(context) as LogContext;
}

function serializeError(error?: Error | unknown): unknown {
  if (!error) {
    return undefined;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // [Task 1.5.8] In production, redact internal file paths from stack traces
      // to prevent information disclosure about server directory structure
      stack:
        isDevelopment() || isTest()
          ? error.stack
          : error.stack?.replace(/\(?\/([\w./-]+)\)?/g, '[redacted path]'),
    };
  }

  return sanitizeValue(error);
}

function isSentryAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}

/**
 * Log an informational message. In production: JSON + Sentry if configured.
 */
export function logInfo(message: string, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context));
  if (isDevelopment() || isTest()) {
    console.info('[INFO]', message, enrichedContext || '');
    return;
  }

  logJson('info', message, enrichedContext);
  if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'info', extra: enrichedContext });
  }
}

/**
 * Log a warning. In production: JSON + Sentry if configured.
 */
export function logWarn(message: string, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context));
  if (isDevelopment() || isTest()) {
    console.warn('[WARN]', message, enrichedContext || '');
    return;
  }

  logJson('warn', message, enrichedContext);
  if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'warning', extra: enrichedContext });
  }
}

/**
 * Log an error. In production: JSON + Sentry with full error details if configured.
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context));
  const serializedError = serializeError(error);
  if (isDevelopment() || isTest()) {
    console.error('[ERROR]', message, serializedError, enrichedContext || '');
    return;
  }

  logJson('error', message, enrichedContext, serializedError);
  if (isSentryAvailable()) {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...enrichedContext } });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { error: sanitizeValue(error), ...enrichedContext },
      });
    }
    return;
  }
}

/**
 * Generic log by level.
 */
export function log(level: LogLevel, message: string, context?: LogContext) {
  switch (level) {
    case 'info':
      logInfo(message, context);
      break;
    case 'warn':
      logWarn(message, context);
      break;
    case 'error':
      logError(message, undefined, context);
      break;
  }
}
