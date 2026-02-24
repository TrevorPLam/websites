// This file is loaded by Next.js before any request is handled
// Instrument OpenTelemetry ONCE here — all Server Components and Server Actions
// automatically traced via @vercel/otel
// Reference: next.config.ts -> experimental.instrumentationHook: true

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');
    const { SentryPropagator, SentrySpanProcessor } = await import('@sentry/opentelemetry');

    registerOTel({
      serviceName: `marketing-platform-${process.env.NEXT_PUBLIC_SITE_ID ?? 'unknown'}`,
      // Sentry as OpenTelemetry backend
      spanProcessors: [new SentrySpanProcessor()],
      // Propagate Sentry trace headers
      propagators: [new SentryPropagator()],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime: minimal instrumentation (no full OTel SDK)
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  }
}
