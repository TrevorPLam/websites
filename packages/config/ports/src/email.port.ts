/**
 * @file packages/config/ports/src/email.port.ts
 * @summary Hexagonal architecture Port interface for the Email service.
 * @description Defines the inward-facing contract that application code
 *   depends on. Adapter implementations (Resend, SMTP, etc.) live in
 *   `packages/services/email/adapters/` and must satisfy this interface.
 *   Following the hexagonal principle: dependencies point inward – adapters
 *   depend on this port, not the other way around.
 * @security Callers MUST pass a valid `tenantId` so that adapters can apply
 *   per-tenant configuration (API keys, from-addresses, etc.).
 * @requirements TASK-SVC-001
 */

// ─── Request / Response shapes ──────────────────────────────────────────────

/** A single email attachment. */
export interface EmailAttachment {
  filename: string;
  /** Base64-encoded or raw binary content. */
  content: string | Buffer;
}

/** Input to {@link EmailPort.send}. */
export interface SendEmailRequest {
  /** Tenant that owns the send operation (required for per-tenant config). */
  tenantId: string;
  /** One or more recipient email addresses. */
  to: string | string[];
  /** Email subject line. */
  subject: string;
  /** Pre-rendered HTML body. */
  html: string;
  /** Optional plain-text fallback (auto-generated if omitted). */
  text?: string;
  /** Override the from address. Falls back to the tenant's configured address. */
  from?: string;
  /** Reply-to address. */
  replyTo?: string;
  /** Optional CC recipients. */
  cc?: string[];
  /** Optional BCC recipients. */
  bcc?: string[];
  /** Optional file attachments. */
  attachments?: EmailAttachment[];
  /**
   * Idempotency key to prevent duplicate sends on retry.
   * Callers should derive this from the underlying business event ID.
   */
  idempotencyKey?: string;
  /** Semantic label for observability / filtering (e.g. `"lead_notification"`). */
  emailType?: string;
}

/** Result returned by {@link EmailPort.send}. */
export interface SendEmailResult {
  /** Provider-assigned message ID. */
  id: string;
  /** Delivery disposition as reported by the provider. */
  status: 'sent' | 'queued' | 'failed';
}

// ─── Port interface ──────────────────────────────────────────────────────────

/**
 * Port interface for sending transactional email.
 *
 * All adapter implementations (`ResendAdapter`, `NativeAdapter`, etc.) MUST
 * implement this interface so that they are interchangeable via the adapter
 * factory.
 *
 * @example
 * ```ts
 * // Inject via factory – application code never imports an adapter directly.
 * const emailService: EmailPort = createEmailAdapter();
 * await emailService.send({ tenantId, to: 'user@example.com', subject: 'Hi', html: '<p>Hello</p>' });
 * ```
 */
export interface EmailPort {
  /**
   * Sends a single transactional email.
   *
   * @param request - The email payload including recipient, subject, and body.
   * @returns A result object with the provider message ID and delivery status.
   * @throws {Error} if the underlying provider returns a non-recoverable error.
   */
  send(request: SendEmailRequest): Promise<SendEmailResult>;

  /**
   * Sends multiple emails in a single provider call where supported.
   * Falls back to sequential `send` calls if the provider does not support
   * batch operations.
   *
   * @param requests - An array of email payloads.
   * @returns An array of results in the same order as the input.
   */
  sendBatch(requests: SendEmailRequest[]): Promise<SendEmailResult[]>;
}
