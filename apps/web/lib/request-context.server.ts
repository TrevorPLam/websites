/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Request Context Storage (Server-Side)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 * - Provide request-scoped context storage using Node.js AsyncLocalStorage
 * - Enable correlation of logs/errors to specific requests via request ID
 * - Maintain context across async operations (server actions, API routes)
 *
 * Responsibilities:
 * - Owns: Request ID storage and retrieval within async context
 * - Owns: AsyncLocalStorage instance for thread-safe context
 * - Does NOT own: Request ID generation (handled by middleware)
 *
 * Key Flows:
 * - Middleware generates ID → calls runWithRequestId() → nested calls see same ID
 * - Logger calls getRequestId() → retrieves ID from context → includes in logs
 *
 * Inputs/Outputs:
 * - runWithRequestId(id, fn): Stores ID in context, runs function, returns result
 * - getRequestId(): Returns current request ID or undefined
 * - Side effects: AsyncLocalStorage maintains context across async boundaries
 *
 * Dependencies:
 * - External: node:async_hooks (Node.js built-in)
 * - Internal: Used by lib/logger.ts, middleware.ts
 *
 * State & Invariants:
 * - Invariant: Request ID is isolated per request (thread-safe)
 * - Invariant: Nested runWithRequestId calls maintain separate contexts
 * - Assumption: Node.js environment (AsyncLocalStorage available)
 *
 * Error Handling:
 * - No errors thrown (AsyncLocalStorage handles edge cases)
 * - Missing context returns undefined (graceful)
 * - Function errors propagate normally
 *
 * Performance Notes:
 * - Minimal overhead (<1µs per context operation)
 * - AsyncLocalStorage is optimized by Node.js runtime
 * - No memory leaks (context cleaned up automatically)
 *
 * Security Notes:
 * - No security implications (request ID is random UUID)
 * - Request ID is safe to log (no PII, no secrets)
 *
 * Testing Notes:
 * - Test: Verify nested contexts maintain separate IDs
 * - Test: Verify getRequestId() returns undefined outside context
 * - Mock: Not needed (AsyncLocalStorage is deterministic)
 *
 * Change Risks:
 * - Removing AsyncLocalStorage breaks request correlation
 * - Signature changes break logger integration
 * - Edge runtime incompatibility (no AsyncLocalStorage support)
 *
 * Owner Boundaries:
 * - Client stubs: request-context.ts (client-side no-ops)
 * - Usage: lib/logger.ts, middleware.ts
 * - Request ID generation: middleware.ts
 *
 * AI Navigation Tags:
 * #context #request-id #async-local-storage #correlation #logging #server
 *
 * NOTE: This is the SERVER-SIDE implementation; client stub is in request-context.ts
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  requestId?: string
}

const requestContextStore = new AsyncLocalStorage<RequestContext>()

export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  if (!requestId) {
    return fn()
  }

  return requestContextStore.run({ requestId }, fn)
}

export function getRequestId(): string | undefined {
  return requestContextStore.getStore()?.requestId
}
