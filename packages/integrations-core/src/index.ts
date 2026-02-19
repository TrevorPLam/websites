/**
 * @file packages/integrations-core/src/index.ts
 * @summary Core resilience utilities for integration packages
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Provides retry logic, circuit breaker, DLQ, and resilient HTTP client
 *          for all integration packages to ensure robust error handling.
 *
 * Exports / Entry: All resilience utilities
 * Used by: @repo/integrations-* packages
 *
 * Status: @public
 */

export { ResilientHttpClient, type ResilientHttpClientOptions } from './client';
export { CircuitBreaker, type CircuitBreakerOptions } from './circuit-breaker';
export { withRetry, isRetryableError, type RetryOptions } from './retry';
export { addToDLQ, getDLQEntries, processDLQEntry, clearDLQ, type DLQEntry } from './dlq';
export {
  IntegrationError,
  RateLimitError,
  CircuitBreakerOpenError,
  NetworkError,
} from './errors';
