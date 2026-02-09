/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Request Context Stubs (Client-Side)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Provide no-op stubs for request context API on client side
 * - Enable shared code to import same module path on client and server
 * - Prevent build errors when client components import this module
 *
 * Responsibilities:
 * - Owns: Client-side stub implementations (no-ops)
 * - Does NOT own: Actual implementation (see request-context.server.ts)
 *
 * Key Flows:
 * - Client component imports → receives stub → functions are no-ops
 * - Prevents "AsyncLocalStorage not available" errors in browser
 *
 * Inputs/Outputs:
 * - runWithRequestId(): Always runs function immediately (ignores requestId)
 * - getRequestId(): Always returns undefined
 * - Side effects: None
 *
 * Dependencies:
 * - External: None
 * - Internal: Counterpart to request-context.server.ts
 *
 * State & Invariants:
 * - Invariant: Must export same function signatures as server version
 * - Invariant: Functions must be safe to call (no errors)
 * - Assumption: Client code handles undefined requestId gracefully
 *
 * Error Handling:
 * - No errors thrown (all functions are no-ops)
 * - Undefined requestId is expected behavior on client
 *
 * Performance Notes:
 * - Minimal overhead (function calls return immediately)
 * - No AsyncLocalStorage overhead on client
 *
 * Security Notes:
 * - No security implications (no-op stubs)
 * - Request IDs not needed on client (server-side correlation only)
 *
 * Testing Notes:
 * - Test: Verify functions callable without errors
 * - Test: Verify getRequestId() returns undefined
 * - Mock: Not needed (stubs are already minimal)
 *
 * Change Risks:
 * - Signature mismatch with server version breaks shared code
 * - Removing exports breaks imports in shared modules
 *
 * Owner Boundaries:
 * - Server implementation: request-context.server.ts
 * - Usage: Shared code (lib/logger.ts, etc.)
 *
 * AI Navigation Tags:
 * #context #request-id #client #stub #correlation
 *
 * NOTE: This is the CLIENT-SIDE stub; actual implementation is in request-context.server.ts
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  return fn()
}

export function getRequestId(): string | undefined {
  return undefined
}
