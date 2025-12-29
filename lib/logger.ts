/**
 * Centralized logging utility
 * Integrates with Sentry for production error tracking and monitoring
 */

import { isDevelopment } from './env'

type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

// Dynamically import Sentry only on client-side to avoid SSR issues
let Sentry: typeof import('@sentry/nextjs') | null = null

if (typeof window !== 'undefined') {
  // Import Sentry dynamically on client-side
  import('@sentry/nextjs').then((module) => {
    Sentry = module
  }).catch(() => {
    // Sentry failed to load, continue without it
    console.warn('Sentry failed to load')
  })
}

/**
 * Log an informational message
 * In production, sends to Sentry
 */
export function logInfo(message: string, context?: LogContext) {
  if (isDevelopment) {
    console.info('[INFO]', message, context || '')
  } else if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, { level: 'info', extra: context })
  }
}

/**
 * Log a warning
 * In production, sends to Sentry
 */
export function logWarn(message: string, context?: LogContext) {
  if (isDevelopment) {
    console.warn('[WARN]', message, context || '')
  } else if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, { level: 'warning', extra: context })
  }
}

/**
 * Log an error
 * In production, sends to Sentry with full error details
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext) {
  if (isDevelopment) {
    console.error('[ERROR]', message, error, context || '')
  } else if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...context } })
    } else {
      Sentry.captureMessage(message, { level: 'error', extra: { error, ...context } })
    }
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
