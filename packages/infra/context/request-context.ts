/**
 * @file packages/infra/context/request-context.ts
 * Purpose: Request context stub safe for client and edge; no AsyncLocalStorage.
 * Relationship: Default export from context; server code should use request-context.server for real context.
 * System role: runWithRequestId/getRequestId no-ops here; avoids server-only in client bundles.
 * Assumptions: Server actions import from request-context.server so getRequestId() works in logs.
 */

/**
 * Runs a function with a request ID. Stub implementation: runs the function without storing context.
 * In server bundles, use the export from `@repo/infra/context/request-context.server` for real context.
 */
export function runWithRequestId<T>(_requestId: string | undefined, fn: () => T): T {
  return fn();
}

/**
 * Returns the current request ID if running inside a server context; otherwise undefined.
 */
export function getRequestId(): string | undefined {
  return undefined;
}
