/**
 * Centralized logging utility with Sentry integration.
 *
 * @module lib/logger
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralized logging with automatic Sentry integration.
 * All console logging should go through this module for consistent behavior.
 *
 * **SECURITY CRITICAL**: Automatically sanitizes sensitive data.
 * - Passwords, tokens, API keys → [REDACTED]
 * - See SENSITIVE_KEYS constant for full list
 *
 * **BEHAVIOR BY ENVIRONMENT**:
 * | Env | Info | Warn | Error |
 * |-----|------|------|-------|
 * | development | console.info | console.warn | console.error |
 * | test | console.info | console.warn | console.error |
 * | production | Sentry message | Sentry warning | Sentry exception |
 *
 * **USAGE**:
 * ```typescript
 * import { logInfo, logWarn, logError } from '@/lib/logger'
 *
 * logInfo('User signed up', { email: user.email })
 * logWarn('Rate limit approached', { remaining: 2 })
 * logError('Payment failed', error, { orderId: '123' })
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding sensitive field? Add to SENSITIVE_KEYS Set
 * - Never use console.log/error directly — use logger functions
 * - Context objects are sanitized automatically
 * - Error objects preserved for Sentry stack traces
 *
 * **SENTRY INTEGRATION**:
 * - Requires NEXT_PUBLIC_SENTRY_DSN env var
 * - Without DSN: falls back to console in all environments
 * - Errors captured with full context in Sentry dashboard
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [ ] Add structured logging format (JSON) for log aggregation
 * - [ ] Add request ID correlation
 * - [ ] Add performance timing helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Integrates with Sentry for production error tracking and monitoring.
 * Works on both server and client side.
 */

import * as Sentry from '@sentry/nextjs'
import { getRequestId } from '@/lib/request-context'

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogRecord {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: unknown
}

const SENSITIVE_KEYS = new Set([
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
])

const SENSITIVE_KEY_SUBSTRINGS = [
  'password',
  'passcode',
  'token',
  'secret',
  'authorization',
  'cookie',
  'apikey',
  'api_key',
  'client_secret',
  'refresh_token',
  'access_token',
  'session_id',
  'sessionid',
]

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

function isSensitiveKey(key: string): boolean {
  const normalized = normalizeKey(key)
  if (SENSITIVE_KEYS.has(normalized)) {
    return true
  }

  // Prefer over-redaction to avoid leaking secrets with variable naming.
  return SENSITIVE_KEY_SUBSTRINGS.some((fragment) => normalized.includes(fragment))
}

function buildLogContext(context?: LogContext): LogContext | undefined {
  const requestId = getRequestId()
  const hasRequestId = Boolean(context?.request_id || context?.requestId)

  if (!requestId || hasRequestId) {
    return context
  }

  return { ...(context ?? {}), request_id: requestId }
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
  }
}

function logJson(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
  const record = buildLogRecord(level, message, context, error)
  const payload = JSON.stringify(record)

  if (level === 'info') {
    console.info(payload)
    return
  }

  if (level === 'warn') {
    console.warn(payload)
    return
  }

  console.error(payload)
}

function shouldPreserveObject(value: object): boolean {
  // Preserve structured objects so stacks and timestamps remain useful in logs.
  return value instanceof Error || value instanceof Date || value instanceof RegExp
}

function sanitizeArray(values: unknown[]): unknown[] {
  // Recursively sanitize arrays to keep nested structures safe.
  return values.map((item) => sanitizeValue(item))
}

function sanitizeObject(value: Record<string, unknown>): Record<string, unknown> {
  // Treat every key as potentially sensitive to avoid leaking secrets.
  // Use a null-prototype object to avoid prototype pollution from keys like "__proto__".
  return Object.entries(value).reduce<Record<string, unknown>>(
    (acc, [key, entryValue]) => {
      acc[key] = isSensitiveKey(key) ? '[REDACTED]' : sanitizeValue(entryValue)
      return acc
    },
    Object.create(null) as Record<string, unknown>,
  )
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return sanitizeArray(value)
  }

  if (value && typeof value === 'object') {
    if (shouldPreserveObject(value)) {
      return value
    }

    return sanitizeObject(value as Record<string, unknown>)
  }

  return value
}

/**
 * Sanitize log context objects for safe external usage.
 *
 * NOTE: Exported for tests and future integrations that need log-safe context
 * without sending logs directly. (Currently used internally as well.)
 */
export function sanitizeLogContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return context
  }

  return sanitizeValue(context) as LogContext
}

function serializeError(error?: Error | unknown): unknown {
  if (!error) {
    return undefined
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return sanitizeValue(error)
}

/**
 * Check if Sentry is properly configured and available
 */
function isSentryAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN)
}

/**
 * Log an informational message
 * In production, sends to Sentry
 */
export function logInfo(message: string, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context))
  if (isDevelopment() || isTest()) {
    console.info('[INFO]', message, enrichedContext || '')
    return
  }

  logJson('info', message, enrichedContext)
  if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'info', extra: enrichedContext })
  }
}

/**
 * Log a warning
 * In production, sends to Sentry
 */
export function logWarn(message: string, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context))
  if (isDevelopment() || isTest()) {
    console.warn('[WARN]', message, enrichedContext || '')
    return
  }

  logJson('warn', message, enrichedContext)
  if (isSentryAvailable()) {
    Sentry.captureMessage(message, { level: 'warning', extra: enrichedContext })
  }
}

/**
 * Log an error
 * In production, sends to Sentry with full error details
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  const enrichedContext = sanitizeLogContext(buildLogContext(context))
  const serializedError = serializeError(error)
  if (isDevelopment() || isTest()) {
    console.error('[ERROR]', message, serializedError, enrichedContext || '')
    return
  }

  logJson('error', message, enrichedContext, serializedError)
  if (isSentryAvailable()) {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...enrichedContext } })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { error: sanitizeValue(error), ...enrichedContext },
      })
    }
    return
  }
}

/**
 * Generic log function
 */
export function log(level: LogLevel, message: string, context?: LogContext) {
  switch (level) {
    case 'info':
      logInfo(message, context)
      break
    case 'warn':
      logWarn(message, context)
      break
    case 'error':
      logError(message, undefined, context)
      break
  }
}
