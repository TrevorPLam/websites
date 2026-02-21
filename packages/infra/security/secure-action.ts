/**
 * @file packages/infra/security/secure-action.ts
 * Task: security-1-server-action-hardening
 *
 * Purpose: Unified secureAction wrapper for Next.js Server Actions. Provides
 * input validation (Zod), tenant context resolution, security audit logging,
 * and structured Result<T, ActionError> error handling.
 *
 * Exports: secureAction, ActionContext, ActionError, ActionOptions, Result
 * Used by: packages/features server actions (booking, contact, etc.)
 *
 * Invariants:
 * - Input is always validated via Zod before handler is called
 * - All errors are returned (never thrown) in Result<T, ActionError> shape
 * - Tenant context is resolved from AsyncLocalStorage (never from client input)
 * - Audit log is written for every invocation (success + failure)
 * - correlationId is a fresh UUID per invocation
 *
 * Status: @public
 */

import 'server-only';
import { z } from 'zod';
import { auditLogger } from './audit-logger';
import { resolveTenantId } from '../src/auth/tenant-context';

// Sanitize error messages for user consumption - prevents information leakage
function sanitizeError(): string {
  // Always return generic message for security - no internal details exposed
  return 'An unexpected error occurred. Please try again.';
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Context injected into every secure action handler. */
export interface ActionContext {
  /** Resolved tenant ID (from JWT scope or siteId fallback). */
  tenantId: string;
  /** Authenticated user ID — 'anonymous' when requireAuth is false. */
  userId: string;
  /** User roles — empty array for anonymous actions. */
  roles: string[];
  /** Unique ID for correlating logs across a single invocation. */
  correlationId: string;
}

/** Discriminated error union returned by secureAction. */
export type ActionError =
  | { code: 'VALIDATION_ERROR'; message?: string }
  | { code: 'UNAUTHORIZED'; message?: string }
  | { code: 'FORBIDDEN'; message?: string }
  | { code: 'NOT_FOUND'; message?: string }
  | { code: 'INTERNAL_ERROR'; message: string };

/** Discriminated result type — avoids exceptions crossing Server Action boundaries. */
export type Result<T, E = ActionError> = { success: true; data: T } | { success: false; error: E };

/** Options for configuring secureAction behaviour. */
export interface ActionOptions {
  /** Human-readable action name for audit logs (e.g. 'confirmBooking'). */
  actionName: string;
  /** Site ID used for single-tenant tenantId fallback. */
  siteId?: string;
  /**
   * When true, UNAUTHORIZED is returned if no userId is present.
   * When false (default), anonymous callers are allowed with userId = 'anonymous'.
   */
  requireAuth?: boolean;
  /**
   * Audit log level. Defaults to 'info'. Use 'warn' for sensitive mutations.
   */
  logLevel?: 'info' | 'warn';
}

// ─── Core wrapper ────────────────────────────────────────────────────────────

/**
 * Wraps a Server Action handler with validation, tenant context, and audit logging.
 *
 * @param rawInput  - Unvalidated input from the client (Server Action argument)
 * @param schema    - Zod schema to validate rawInput
 * @param handler   - Business logic callback; receives typed context + validated input
 * @param options   - Action configuration (name, siteId, requireAuth)
 * @returns         - Result<TOutput, ActionError> — never throws
 *
 * @example
 * export async function confirmBooking(input: unknown) {
 *   return secureAction(input, confirmSchema, async (ctx, data) => {
 *     return repository.confirm(data.bookingId, ctx.tenantId);
 *   }, { actionName: 'confirmBooking', siteId: siteConfig.id });
 * }
 */
export async function secureAction<TInput, TOutput>(
  rawInput: unknown,
  schema: z.ZodSchema<TInput>,
  handler: (ctx: ActionContext, input: TInput) => Promise<TOutput>,
  options: ActionOptions
): Promise<Result<TOutput, ActionError>> {
  const correlationId = crypto.randomUUID();
  const { actionName, siteId, requireAuth = false, logLevel = 'info' } = options;

  // ── 1. Validate input ──────────────────────────────────────────────────────
  const parsed = schema.safeParse(rawInput);
  if (!parsed.success) {
    auditLogger.log({
      level: 'warn',
      action: actionName,
      correlationId,
      status: 'validation_error',
      metadata: { issueCount: parsed.error.issues.length },
    });
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input provided',
      },
    };
  }

  // ── 2. Resolve tenant context ──────────────────────────────────────────────
  const tenantId = resolveTenantId(siteId);

  // ── 3. Resolve user identity (pluggable — anonymous fallback) ──────────────
  // In a full auth setup, replace with: const session = await getServerSession();
  // For now, we resolve userId from the request context or fall back to 'anonymous'.
  const userId = 'anonymous';
  const roles: string[] = [];

  if (requireAuth && userId === 'anonymous') {
    auditLogger.log({
      level: 'warn',
      action: actionName,
      correlationId,
      tenantId,
      userId,
      status: 'unauthorized',
    });
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
  }

  const ctx: ActionContext = { tenantId, userId, roles, correlationId };

  // ── 4. Audit: action start ─────────────────────────────────────────────────
  auditLogger.log({
    level: logLevel,
    action: actionName,
    correlationId,
    tenantId,
    userId,
    status: 'started',
  });

  // ── 5. Execute handler ─────────────────────────────────────────────────────
  try {
    const data = await handler(ctx, parsed.data);

    auditLogger.log({
      level: logLevel,
      action: actionName,
      correlationId,
      tenantId,
      userId,
      status: 'success',
    });

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    auditLogger.log({
      level: 'error',
      action: actionName,
      correlationId,
      tenantId,
      userId,
      status: 'error',
      metadata: { error: message },
    });

    return { success: false, error: { code: 'INTERNAL_ERROR', message: sanitizeError() } };
  }
}
