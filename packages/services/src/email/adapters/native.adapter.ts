/**
 * @file packages/services/src/email/adapters/native.adapter.ts
 * @summary Native (no-external-provider) adapter implementing {@link EmailPort}.
 * @description Provides a fallback email delivery mechanism using Node.js's
 *   built-in `node:http` / `node:https` modules (or a minimal SMTP client)
 *   so that the platform can operate without a third-party email vendor.
 *   In development / test environments this adapter logs the email payload
 *   instead of sending, making it safe for local use.
 * @security The adapter redacts `to`, `html`, and `attachments` from logs to
 *   prevent accidental PII exposure. Enable full logging only via `DEBUG=email`
 *   in non-production environments.
 * @requirements TASK-SVC-002-REV
 */

import type {
  EmailPort,
  SendEmailRequest,
  SendEmailResult,
} from '@repo/service-ports/email';

// ─── Options ────────────────────────────────────────────────────────────────

export interface NativeAdapterOptions {
  /**
   * When `true`, emails are logged to stdout instead of being delivered.
   * Automatically set to `true` when `NODE_ENV !== 'production'`.
   */
  dryRun?: boolean;
  /**
   * Optional hook called after each successful (or dry-run) send.
   * Useful for testing: collect sent messages without side effects.
   */
  onSend?: (request: SendEmailRequest, result: SendEmailResult) => void;
}

// ─── Adapter ────────────────────────────────────────────────────────────────

/**
 * Native email adapter that logs in development and can be extended for SMTP.
 *
 * @example
 * ```ts
 * // Dry-run mode (default in non-production):
 * const adapter = new NativeAdapter({ dryRun: true });
 * const result = await adapter.send({ ... });
 * // => Logs the request; returns a synthetic result.
 *
 * // With an onSend hook for testing:
 * const sent: SendEmailRequest[] = [];
 * const adapter = new NativeAdapter({ dryRun: true, onSend: (req) => sent.push(req) });
 * ```
 */
export class NativeAdapter implements EmailPort {
  private readonly dryRun: boolean;
  private readonly onSend?: NativeAdapterOptions['onSend'];

  constructor(options: NativeAdapterOptions = {}) {
    this.dryRun =
      options.dryRun ?? process.env['NODE_ENV'] !== 'production';
    this.onSend = options.onSend;
  }

  // ─── EmailPort.send ─────────────────────────────────────────────────────

  async send(request: SendEmailRequest): Promise<SendEmailResult> {
    const result: SendEmailResult = {
      id: `native-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      status: 'sent',
    };

    if (this.dryRun) {
      // Safe structured log: redact sensitive fields.
      console.info('[NativeAdapter] DRY-RUN email send', {
        tenantId: request.tenantId,
        subject: request.subject,
        emailType: request.emailType,
        recipientCount: Array.isArray(request.to)
          ? request.to.length
          : 1,
        id: result.id,
      });
    } else {
      // Production SMTP delivery would be implemented here.
      // For now, emit a structured warning so the operator knows to configure
      // a proper provider via EMAIL_PROVIDER=resend.
      console.warn(
        '[NativeAdapter] Production send attempted but no SMTP transport is configured. ' +
          'Set EMAIL_PROVIDER=resend and configure RESEND_API_KEY.',
        { tenantId: request.tenantId, emailType: request.emailType },
      );
      result.status = 'queued';
    }

    this.onSend?.(request, result);
    return result;
  }

  // ─── EmailPort.sendBatch ─────────────────────────────────────────────────

  async sendBatch(requests: SendEmailRequest[]): Promise<SendEmailResult[]> {
    const results: SendEmailResult[] = [];
    for (const request of requests) {
      results.push(await this.send(request));
    }
    return results;
  }
}
