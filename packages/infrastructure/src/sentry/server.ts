/**
 * @file packages/infrastructure/src/sentry/server.ts
 * @summary Sentry server integration placeholder.
 * @description Placeholder for Sentry server-side monitoring integration.
 * @security Monitoring integration with error tracking.
 * @adr none
 * @requirements MONITOR-001
 */

export function withServerSpan<T extends (...args: any[]) => any>(
  spanConfig: { name: string; op: string },
  fn: T
): T {
  // TODO(#001): Implement actual Sentry span integration
  return fn;
}

/**
 * Type assertion helper for HealthCheckResult.
 *
 * @param result Result object to assert as HealthCheckResult.
 * @returns The same result object with proper typing.
 */
export function asHealthCheckResult(result: any): any {
  return result;
}
