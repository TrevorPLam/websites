/**
 * @file apps/web/lib/request-context.ts
 * @role runtime
 * @summary Client-safe stubs for request context API.
 *
 * @entrypoints
 * - runWithRequestId
 * - getRequestId
 *
 * @exports
 * - runWithRequestId
 * - getRequestId
 *
 * @depends_on
 * - None
 *
 * @used_by
 * - Shared code importing request context on client
 *
 * @runtime
 * - environment: client
 * - side_effects: none
 *
 * @issues
 * - [severity:low] Always returns undefined requestId on client.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

export function runWithRequestId<T>(_requestId: string | undefined, fn: () => T): T {
  return fn();
}

export function getRequestId(): string | undefined {
  return undefined;
}
