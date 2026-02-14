/**
 * Sentry client-side configuration for hair-salon template.
 * Initializes browser error tracking with PII sanitization.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 * @task 1.3.1
 */
import * as Sentry from '@sentry/nextjs';
import { sanitizeSentryEvent } from '@repo/infra/sentry/sanitize';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  beforeSend: sanitizeSentryEvent,
});
