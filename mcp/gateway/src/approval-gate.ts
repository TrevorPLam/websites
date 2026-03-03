/**
 * @file mcp/gateway/src/approval-gate.ts
 * @summary Human-in-the-loop approval gate for high-impact MCP tool calls.
 * @description Pauses execution of HIGH-risk actions (deployments, schema changes,
 *   destructive operations) until a human approver explicitly approves or rejects
 *   the request.  Requests time out after a configurable window and fail closed
 *   (i.e. the action is blocked on timeout, not allowed).
 *
 *   This implementation uses an in-process pending-request store.  In production
 *   the store should be backed by Redis or a database so approvals can be granted
 *   from external tooling (Slack, PagerDuty, admin UI, etc.).
 *
 * @security Fails closed on timeout — unreviewed actions are never executed.
 *   Every approval or rejection is recorded in the audit log with the approver
 *   identity and a timestamp so the chain of custody is immutable.
 * @requirements 3-C: Add Human Approval Gates for High-Impact Tools
 */

import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default timeout before a pending approval request auto-rejects (5 minutes). */
const DEFAULT_APPROVAL_TIMEOUT_MS = 5 * 60_000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ApprovalRequest {
  id: string;
  correlationId: string;
  tenantId: string;
  /** MCP server that wants to perform the action. */
  server: string;
  /** Tool name that triggered the approval gate. */
  tool: string;
  /** Human-readable description of what will happen if approved. */
  description: string;
  riskLevel: RiskLevel;
  /** ISO-8601 timestamp when the request was created. */
  createdAt: string;
  /** ISO-8601 deadline — gate rejects automatically after this time. */
  expiresAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'timed_out';
  /** Identity of the approver (set on resolution). */
  approvedBy?: string;
  /** ISO-8601 timestamp of the resolution. */
  resolvedAt?: string;
  /** Optional rejection reason. */
  rejectionReason?: string;
}

export interface ApprovalGateConfig {
  /** Timeout in milliseconds before a pending request is auto-rejected. Defaults to 5 minutes. */
  timeoutMs?: number;
  /** Optional logger. Defaults to stderr JSON lines. */
  logger?: (entry: Record<string, unknown>) => void;
}

// ---------------------------------------------------------------------------
// ApprovalGate
// ---------------------------------------------------------------------------

/**
 * In-process human approval gate.
 *
 * @example
 * ```ts
 * const gate = new ApprovalGate({ timeoutMs: 5 * 60_000 });
 *
 * // In the tool handler:
 * const request = await gate.request({
 *   correlationId,
 *   tenantId: 'tenant-uuid',
 *   server: 'secure-deployment',
 *   tool: 'deploy-secure-infrastructure',
 *   description: 'Deploy v2.3.1 to production environment us-east-1',
 *   riskLevel: 'HIGH',
 * });
 *
 * // The call blocks until approve()/reject() is called externally or times out.
 * // If not approved, an error is thrown.
 * ```
 */
export class ApprovalGate {
  private readonly pending = new Map<
    string,
    {
      request: ApprovalRequest;
      resolve: (approved: boolean) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  private readonly auditLog: ApprovalRequest[] = [];
  private readonly timeoutMs: number;
  private readonly log: (entry: Record<string, unknown>) => void;

  constructor(config: ApprovalGateConfig = {}) {
    this.timeoutMs = config.timeoutMs ?? DEFAULT_APPROVAL_TIMEOUT_MS;
    this.log = config.logger ?? ((entry) => {
      process.stderr.write(JSON.stringify(entry) + '\n');
    });
  }

  /**
   * Initiate an approval request and wait for a human decision.
   *
   * Resolves when the request is approved.
   * Throws when the request is rejected or times out.
   *
   * @param opts - Metadata describing the action that needs approval.
   * @returns The resolved ApprovalRequest with status `'approved'`.
   * @throws Error if rejected or timed out.
   */
  async request(opts: {
    correlationId: string;
    tenantId: string;
    server: string;
    tool: string;
    description: string;
    riskLevel: RiskLevel;
  }): Promise<ApprovalRequest> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.timeoutMs);

    const approvalRequest: ApprovalRequest = {
      id: crypto.randomUUID(),
      correlationId: opts.correlationId,
      tenantId: opts.tenantId,
      server: opts.server,
      tool: opts.tool,
      description: opts.description,
      riskLevel: opts.riskLevel,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'pending',
    };

    this.log({
      event: 'approval_requested',
      approvalId: approvalRequest.id,
      correlationId: opts.correlationId,
      tenantId: opts.tenantId,
      server: opts.server,
      tool: opts.tool,
      description: opts.description,
      riskLevel: opts.riskLevel,
      expiresAt: expiresAt.toISOString(),
      timestamp: now.toISOString(),
    });

    return new Promise<ApprovalRequest>((resolve, reject) => {
      const timer = setTimeout(() => {
        const entry = this.pending.get(approvalRequest.id);
        if (!entry) return;

        approvalRequest.status = 'timed_out';
        approvalRequest.resolvedAt = new Date().toISOString();
        approvalRequest.rejectionReason = `Approval timed out after ${this.timeoutMs}ms`;

        this._archive(approvalRequest);
        this.pending.delete(approvalRequest.id);

        this.log({
          event: 'approval_timed_out',
          approvalId: approvalRequest.id,
          correlationId: opts.correlationId,
          tenantId: opts.tenantId,
          timestamp: approvalRequest.resolvedAt,
        });

        reject(new Error(`High-risk action blocked: approval timed out (id=${approvalRequest.id})`));
      }, this.timeoutMs);

      this.pending.set(approvalRequest.id, {
        request: approvalRequest,
        resolve: (approved: boolean) => {
          if (approved) {
            resolve(approvalRequest);
          } else {
            reject(new Error(
              `High-risk action blocked: approval rejected (id=${approvalRequest.id})` +
              (approvalRequest.rejectionReason ? ` — ${approvalRequest.rejectionReason}` : '')
            ));
          }
        },
        timer,
      });
    });
  }

  /**
   * Approve a pending request.
   *
   * @param approvalId - The `id` field from the ApprovalRequest.
   * @param approvedBy - Identity of the human approver (e.g. email, user ID).
   * @returns True if the request was found and approved; false if not found.
   */
  approve(approvalId: string, approvedBy: string): boolean {
    const entry = this.pending.get(approvalId);
    if (!entry) return false;

    clearTimeout(entry.timer);

    entry.request.status = 'approved';
    entry.request.approvedBy = approvedBy;
    entry.request.resolvedAt = new Date().toISOString();

    this._archive(entry.request);
    this.pending.delete(approvalId);

    this.log({
      event: 'approval_granted',
      approvalId,
      approvedBy,
      correlationId: entry.request.correlationId,
      tenantId: entry.request.tenantId,
      server: entry.request.server,
      tool: entry.request.tool,
      timestamp: entry.request.resolvedAt,
    });

    entry.resolve(true);
    return true;
  }

  /**
   * Reject a pending request.
   *
   * @param approvalId - The `id` field from the ApprovalRequest.
   * @param rejectedBy - Identity of the rejector.
   * @param reason     - Optional human-readable reason for rejection.
   * @returns True if the request was found and rejected; false if not found.
   */
  reject(approvalId: string, rejectedBy: string, reason?: string): boolean {
    const entry = this.pending.get(approvalId);
    if (!entry) return false;

    clearTimeout(entry.timer);

    entry.request.status = 'rejected';
    entry.request.approvedBy = rejectedBy;   // resolvedBy identity
    entry.request.resolvedAt = new Date().toISOString();
    entry.request.rejectionReason = reason;

    this._archive(entry.request);
    this.pending.delete(approvalId);

    this.log({
      event: 'approval_rejected',
      approvalId,
      rejectedBy,
      reason,
      correlationId: entry.request.correlationId,
      tenantId: entry.request.tenantId,
      server: entry.request.server,
      tool: entry.request.tool,
      timestamp: entry.request.resolvedAt,
    });

    entry.resolve(false);
    return true;
  }

  /**
   * List all currently pending approval requests.
   */
  listPending(): ApprovalRequest[] {
    return Array.from(this.pending.values()).map(e => ({ ...e.request }));
  }

  /**
   * Return a copy of the immutable audit log.
   */
  getAuditLog(): Readonly<ApprovalRequest[]> {
    return [...this.auditLog];
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private _archive(request: ApprovalRequest): void {
    this.auditLog.push({ ...request });
  }
}

// ---------------------------------------------------------------------------
// Singleton for use in MCP server files
// ---------------------------------------------------------------------------

/** Shared approval gate instance (5-minute timeout). */
export const approvalGate = new ApprovalGate({ timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS });
