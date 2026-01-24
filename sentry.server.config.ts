import * as Sentry from '@sentry/nextjs'
import { sanitizeSentryEvent } from './lib/sentry-sanitize'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Configure environment
  environment: process.env.NODE_ENV || 'development',

  // Ignore errors from third-party modules
  ignoreErrors: [
    // Network errors
    'Network request failed',
    'NetworkError',
    'Failed to fetch',
    // Timeout errors
    'timeout',
    'ETIMEDOUT',
  ],

  // Configure beforeSend to filter or modify events
  beforeSend(event, _hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
      return null
    }

    // Add custom tags
    event.tags = {
      ...event.tags,
      runtime: 'server',
    }

    return sanitizeSentryEvent(event)
  },
})
