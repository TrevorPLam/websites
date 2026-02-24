import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tracing
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/.*\.supabase\.co/,
    /^https:\/\/.*\.youragency\.com/,
  ],

  // Profiling (CPU-level performance traces)
  profilesSampleRate: 0.05, // 5% of traced transactions

  // Integrations
  integrations: [
    // Automatically capture unhandled Postgres errors
    Sentry.postgresIntegration(),
    // Capture fetch timing for all outbound requests
    Sentry.httpIntegration({ tracing: true }),
  ],

  // PII scrubbing (GDPR)
  beforeSend: (event: Sentry.Event) => {
    // Scrub email addresses from error payloads
    const eventStr = JSON.stringify(event);
    const scrubbed = eventStr.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');
    return JSON.parse(scrubbed);
  },

  // Environment tagging (filter by tenant in Sentry dashboard)
  initialScope: {
    tags: {
      'platform.version': process.env.NEXT_PUBLIC_PLATFORM_VERSION ?? 'unknown',
    },
  },
});
