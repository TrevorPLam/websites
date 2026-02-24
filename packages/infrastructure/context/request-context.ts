/**
 * @file packages/infrastructure/context/request-context.ts
 * @summary Request context shim safe for client and edge bundles.
 * @exports generateRequestId, runWithRequestId, getRequestId
 * @invariants Client-safe implementation; no AsyncLocalStorage usage in this module.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Server-side context storage lives in request-context.server.ts.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

function randomId(): string {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * export function generateRequestId(prefix = 'req'): string.
 */
export function generateRequestId(prefix = 'req'): string {
  return `${prefix}_${randomId()}`;
}

/**
 * export function runWithRequestId<T>(_requestId: string | undefined, fn: () => T): T.
 */
export function runWithRequestId<T>(_requestId: string | undefined, fn: () => T): T {
  return fn();
}

/**
 * export function getRequestId(): string | undefined.
 */
export function getRequestId(): string | undefined {
  return undefined;
}
