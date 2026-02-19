/**
 * @file packages/integrations-core/src/circuit-breaker.ts
 * @summary Circuit breaker pattern for integration resilience
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Prevents cascading failures by opening circuit when integration
 *          fails repeatedly, allowing it to recover before retrying.
 *
 * Exports / Entry: CircuitBreaker, CircuitBreakerOptions, CircuitBreakerOpenError
 * Used by: ResilientHttpClient, integration packages
 *
 * Invariants:
 * - Three states: closed, open, half-open
 * - Automatic state transitions based on failure threshold
 * - State is in-memory (single instance) - use Redis for distributed
 *
 * Status: @public
 */

import { CircuitBreakerOpenError } from './errors';

export interface CircuitBreakerOptions {
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Timeout in milliseconds before attempting half-open */
  timeoutMs: number;
  /** Number of successful attempts in half-open before closing */
  halfOpenMaxAttempts: number;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  timeoutMs: 60000, // 1 minute
  halfOpenMaxAttempts: 2,
};

type CircuitState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker implementation for integration resilience
 *
 * Prevents cascading failures by opening circuit when integration fails repeatedly.
 * Automatically transitions to half-open after timeout, then closes on success.
 *
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   timeoutMs: 60000,
 *   halfOpenMaxAttempts: 2,
 * });
 *
 * try {
 *   const result = await breaker.execute(() => apiCall());
 * } catch (error) {
 *   if (error instanceof CircuitBreakerOpenError) {
 *     // Circuit is open, don't retry
 *   }
 * }
 * ```
 */
export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenAttempts = 0;

  constructor(private options: CircuitBreakerOptions = DEFAULT_OPTIONS) {}

  /**
   * Executes a function through the circuit breaker
   *
   * @param fn - Function to execute
   * @returns Result of function execution
   * @throws CircuitBreakerOpenError if circuit is open
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from open to half-open
    if (this.state === 'open') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure >= this.options.timeoutMs) {
        this.state = 'half-open';
        this.halfOpenAttempts = 0;
      } else {
        throw new CircuitBreakerOpenError(
          `Circuit breaker is open. Retry after ${Math.ceil((this.options.timeoutMs - timeSinceFailure) / 1000)}s`
        );
      }
    }

    try {
      const result = await fn();

      // Success - reset failure count
      if (this.state === 'half-open') {
        this.halfOpenAttempts++;
        if (this.halfOpenAttempts >= this.options.halfOpenMaxAttempts) {
          // Circuit closed - fully recovered
          this.state = 'closed';
          this.failureCount = 0;
        }
      } else {
        // Closed state - reset failure count on success
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      // Failure - increment failure count
      this.failureCount++;
      this.lastFailureTime = Date.now();

      // Check if threshold reached
      if (this.failureCount >= this.options.failureThreshold) {
        this.state = 'open';
      } else if (this.state === 'half-open') {
        // Half-open attempt failed - back to open
        this.state = 'open';
        this.halfOpenAttempts = 0;
      }

      throw error;
    }
  }

  /**
   * Gets current circuit breaker state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Gets current failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * Resets circuit breaker to closed state
   * Useful for testing or manual recovery
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.halfOpenAttempts = 0;
  }
}
