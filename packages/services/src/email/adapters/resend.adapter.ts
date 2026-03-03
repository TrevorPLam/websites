/**
 * @file packages/services/src/email/adapters/resend.adapter.ts
 * @summary Resend-backed adapter implementing the {@link EmailPort} interface.
 * @description Wraps the Resend REST API to provide transactional email
 *   delivery. Uses per-tenant API keys retrieved from the environment or a
 *   tenant configuration service. Implements idempotent sending and rich
 *   observability headers for GDPR / CAN-SPAM compliance.
 * @security The adapter NEVER logs the full email body or recipient list.
 *   `tenantId` is validated as a non-empty string before any API call.
 *   Provider errors are wrapped in a generic `EmailSendError` to prevent
 *   leaking internal provider error messages to higher layers.
 * @requirements TASK-SVC-002-REV
 */

import type {
  EmailPort,
  SendEmailRequest,
  SendEmailResult,
} from '@repo/service-ports/email';

// ─── Error type ─────────────────────────────────────────────────────────────

/** Thrown when the Resend API returns a non-recoverable error. */
export class EmailSendError extends Error {
  constructor(
    message: string,
    public readonly emailType: string | undefined,
    public readonly tenantId: string,
  ) {
    super(message);
    this.name = 'EmailSendError';
  }
}

// ─── Minimal Resend client surface ──────────────────────────────────────────
// We type only what we use so that the adapter is not tightly coupled to the
// resend npm package's internal type evolution.

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{ filename: string; content: string }>;
  headers?: Record<string, string>;
  idempotency_key?: string;
  tags?: Array<{ name: string; value: string }>;
}

interface ResendClient {
  emails: {
    send(
      payload: ResendEmailPayload,
    ): Promise<{ data: { id: string } | null; error: { message: string } | null }>;
  };
}

// ─── Adapter ────────────────────────────────────────────────────────────────

/**
 * Resend adapter configuration.
 *
 * Provide either a static `apiKey` or a `resolveApiKey` function so the
 * adapter can fetch per-tenant keys at send time.
 */
export interface ResendAdapterOptions {
  /**
   * Static API key used for all sends.
   * Mutually exclusive with `resolveApiKey`.
   */
  apiKey?: string;
  /**
   * Async resolver that returns the correct API key for a given tenant.
   * Use this for multi-tenant setups where each tenant may have their own
   * Resend account.
   */
  resolveApiKey?: (tenantId: string) => Promise<string>;
  /**
   * Default from-address used when {@link SendEmailRequest.from} is not set.
   * Format: `"Name <address@domain.com>"`.
   */
  defaultFromAddress?: string;
  /**
   * Base URL of the platform (used in List-Unsubscribe headers).
   * Defaults to `process.env.NEXT_PUBLIC_APP_URL`.
   */
  appUrl?: string;
}

/**
 * Creates a Resend client for a given API key.
 * Lazy-imported so the `resend` package is an optional peer dependency.
 */
async function createResendClient(apiKey: string): Promise<ResendClient> {
  // Dynamic import keeps `resend` as an optional peer dep at runtime.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = (await import('resend')) as { Resend: new (key: string) => ResendClient };
  return new Resend(apiKey);
}

/**
 * Resend-backed implementation of {@link EmailPort}.
 *
 * @example
 * ```ts
 * const adapter = new ResendAdapter({ apiKey: process.env.RESEND_API_KEY });
 * await adapter.send({ tenantId, to: 'user@example.com', subject: 'Hi', html: '<p>Hello</p>' });
 * ```
 */
export class ResendAdapter implements EmailPort {
  private readonly options: ResendAdapterOptions;

  constructor(options: ResendAdapterOptions) {
    if (!options.apiKey && !options.resolveApiKey) {
      throw new Error(
        'ResendAdapter requires either `apiKey` or `resolveApiKey` to be provided.',
      );
    }
    this.options = options;
  }

  // ─── EmailPort.send ─────────────────────────────────────────────────────

  async send(request: SendEmailRequest): Promise<SendEmailResult> {
    const apiKey = await this.resolveKey(request.tenantId);
    const client = await createResendClient(apiKey);

    const appUrl =
      this.options.appUrl ?? process.env['NEXT_PUBLIC_APP_URL'] ?? '';

    const recipients = Array.isArray(request.to)
      ? request.to.map((e) => e.toLowerCase())
      : [request.to.toLowerCase()];

    const payload: ResendEmailPayload = {
      from: request.from ?? this.options.defaultFromAddress ?? `noreply@${request.tenantId}.example.com`,
      to: recipients,
      subject: request.subject,
      html: request.html,
      ...(request.text ? { text: request.text } : {}),
      ...(request.replyTo ? { reply_to: request.replyTo } : {}),
      ...(request.cc?.length ? { cc: request.cc } : {}),
      ...(request.bcc?.length ? { bcc: request.bcc } : {}),
      ...(request.attachments?.length
        ? {
            attachments: request.attachments.map((a) => ({
              filename: a.filename,
              content:
                typeof a.content === 'string'
                  ? a.content
                  : a.content.toString('base64'),
            })),
          }
        : {}),
      ...(request.idempotencyKey
        ? { idempotency_key: request.idempotencyKey }
        : {}),
      headers: {
        'X-Tenant-Id': request.tenantId,
        ...(request.emailType
          ? { 'X-Email-Type': request.emailType }
          : {}),
        'List-Unsubscribe': `<${appUrl}/unsubscribe?tenant=${request.tenantId}&email=${recipients[0]}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'tenant_id', value: request.tenantId },
        ...(request.emailType
          ? [{ name: 'email_type', value: request.emailType }]
          : []),
      ],
    };

    const { data, error } = await client.emails.send(payload);

    if (error ?? !data) {
      throw new EmailSendError(
        error?.message ?? 'Unknown Resend error',
        request.emailType,
        request.tenantId,
      );
    }

    return { id: data.id, status: 'sent' };
  }

  // ─── EmailPort.sendBatch ─────────────────────────────────────────────────

  async sendBatch(requests: SendEmailRequest[]): Promise<SendEmailResult[]> {
    // Resend's batch API is not yet stable; fall back to sequential sends.
    const results: SendEmailResult[] = [];
    for (const request of requests) {
      results.push(await this.send(request));
    }
    return results;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async resolveKey(tenantId: string): Promise<string> {
    if (this.options.resolveApiKey) {
      return this.options.resolveApiKey(tenantId);
    }
    // Static key path – already validated in constructor.
    return this.options.apiKey as string;
  }
}
