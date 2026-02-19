/**
 * @file packages/integrations-core/src/errors.ts
 * @summary Standardized error types for integration packages
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Provides consistent error types for integration failures,
 *          enabling proper error handling and retry logic.
 *
 * Exports / Entry: IntegrationError, RateLimitError, CircuitBreakerOpenError
 * Used by: Retry logic, circuit breaker, integration clients
 *
 * Invariants:
 * - All errors extend Error
 * - Errors include context for debugging
 * - Retryable errors are clearly identified
 *
 * Status: @public
 */

/**
 * Base error for integration failures
 */
export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'IntegrationError';
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, IntegrationError);
    }
  }

  /**
   * Determines if this error is retryable
   */
  isRetryable(): boolean {
    // 429 (rate limit) and 5xx (server errors) are retryable
    if (this.statusCode === 429) return true;
    if (this.statusCode && this.statusCode >= 500 && this.statusCode < 600) return true;
    return false;
  }
}

/**
 * Error for rate limit violations (429)
 */
export class RateLimitError extends IntegrationError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    context?: Record<string, unknown>
  ) {
    super(message, 429, context);
    this.name = 'RateLimitError';
  }

  override isRetryable(): boolean {
    return true; // Rate limits are always retryable
  }
}

/**
 * Error when circuit breaker is open
 */
export class CircuitBreakerOpenError extends IntegrationError {
  constructor(message: string = 'Circuit breaker is open', context?: Record<string, unknown>) {
    super(message, 503, context);
    this.name = 'CircuitBreakerOpenError';
  }

  override isRetryable(): boolean {
    return false; // Circuit breaker open means don't retry immediately
  }
}

/**
 * Error for network/timeout failures
 */
export class NetworkError extends IntegrationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, undefined, context);
    this.name = 'NetworkError';
  }

  override isRetryable(): boolean {
    return true; // Network errors are retryable
  }
}
