/**
 * @file apps/workers/email-worker.ts
 * @summary Long-running email delivery worker process.
 * @description Polls the job queue for `email` jobs and delivers them via
 *   the configured email adapter.  In production the process is managed by
 *   a process supervisor (PM2, Fly.io machines, Railway, etc.).  In
 *   serverless environments, replace this with a cron-triggered call to
 *   {@link processEmailJob} from the API route layer instead.
 *
 *   The queue adapter and email adapter are resolved from environment
 *   variables at startup.  Currently uses {@link InMemoryJobQueue} as a
 *   development stand-in; swap for a BullMQ / QStash adapter in production.
 *
 * @security
 *   - Email credentials are loaded from environment variables, never
 *     hard-coded.
 *   - PII (recipient addresses) is never written to log output.
 * @requirements TASK-012
 */

import { InMemoryJobQueue, processEmailJob, type EmailAdapter } from '@repo/infrastructure/queue';

// ─── Adapter bootstrap ────────────────────────────────────────────────────────

/**
 * Minimal console-based email adapter used when no real provider is configured.
 * Replace with a Resend / SendGrid / Postmark adapter in production by reading
 * the relevant API key from environment variables.
 */
const emailAdapter: EmailAdapter = {
  async send(params) {
    // In production, swap this stub with your email provider SDK call.
    // Example: await resend.emails.send({ from: '...', ...params });
    console.info('[email-worker] Sending email (stub)', {
      to: '[redacted]',
      subject: params.subject,
    });
  },
};

// ─── Queue bootstrap ──────────────────────────────────────────────────────────

// TODO: Replace InMemoryJobQueue with a durable adapter (BullMQ, Upstash QStash)
// once PROD-004 durable queue selection is finalised.
const queue = new InMemoryJobQueue();

// ─── Poll loop ────────────────────────────────────────────────────────────────

async function poll(): Promise<void> {
  try {
    await processEmailJob({ queue, emailAdapter, logger: console });
  } catch (err) {
    console.error('[email-worker] Unexpected error in poll', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

const POLL_INTERVAL_MS = parseInt(process.env['WORKER_POLL_INTERVAL_MS'] ?? '5000', 10);
// Poll immediately on startup to drain any existing jobs, then continue on interval.
void poll();
let pollTimer: ReturnType<typeof setInterval> | null = setInterval(poll, POLL_INTERVAL_MS);

console.info('[email-worker] Started', { pollIntervalMs: POLL_INTERVAL_MS });

// Graceful shutdown on SIGTERM / SIGINT.
function shutdown(): void {
  console.info('[email-worker] Shutting down…');
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
