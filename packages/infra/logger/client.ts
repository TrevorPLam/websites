/**
 * Client-safe logger — console + optional Sentry in browser.
 * Use this in client components; do not import the server logger.
 */

export type LogContext = Record<string, unknown>;

/**
 * Log info from client code.
 */
export function logInfo(message: string, context?: LogContext): void {
  if (typeof window === 'undefined') return;
  console.info('[INFO]', message, context ?? '');
}

/**
 * Log an error from client code (e.g. Error Boundary).
 * Uses console.error and optionally Sentry if available.
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext): void {
  if (typeof window === 'undefined') {
    return;
  }
  console.error('[ERROR]', message, error ?? '', context ?? '');
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs')
      .then((Sentry) => {
        if (error instanceof Error) {
          Sentry.captureException(error, { extra: { message, ...context } });
        } else {
          Sentry.captureMessage(message, { level: 'error', extra: context });
        }
      })
      .catch(() => {});
  }
}
