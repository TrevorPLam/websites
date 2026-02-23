/**
 * @file packages/infra/sentry/server.ts
 * Purpose: Sentry server helpers (withServerSpan). Server-only.
 * Relationship: Used by contact-actions, booking-actions, template actions. Peer: @sentry/nextjs.
 * System role: withServerSpan(options, callback) wraps async work in a span when DSN set.
 * Assumptions: NEXT_PUBLIC_SENTRY_DSN and Sentry.startSpan available in Node.
 */
import * as Sentry from '@sentry/nextjs';

export type SpanAttributeValue = string | number | boolean;
export type SpanAttributes = Record<string, SpanAttributeValue | undefined>;

type SpanOptions = {
  name: string;
  op?: string;
  attributes?: SpanAttributes;
};

function isSentryTracingEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN) && typeof Sentry.startSpan === 'function';
}

export async function withServerSpan<T>(
  options: SpanOptions,
  callback: () => Promise<T>
): Promise<T> {
  if (!isSentryTracingEnabled()) {
    return callback();
  }

  return Sentry.startSpan(
    {
      name: options.name,
      op: options.op,
      attributes: options.attributes,
    },
    async () => callback()
  );
}
