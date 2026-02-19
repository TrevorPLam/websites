/**
 * @file packages/integrations-core/src/retry.ts
 * @summary Retry logic with exponential backoff for integration resilience
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Provides retry logic with exponential backoff for transient failures,
 *          enabling integration packages to handle temporary outages gracefully.
 *
 * Exports / Entry: withRetry, RetryOptions, isRetryableError
 * Used by: ResilientHttpClient, integration packages
 *
 * Invariants:
 * - Exponential backoff with configurable multiplier
 * - Max attempts enforced
 * - Only retries retryable errors
 *
 * Status: @public
 */

import { IntegrationError, RateLimitError, NetworkError } from './errors';

export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial backoff delay in milliseconds */
  initialBackoffMs: number;
  /** Backoff multiplier (e.g., 2 for doubling) */
  backoffMultiplier: number;
  /** Maximum backoff delay in milliseconds */
  maxBackoffMs: number;
  /** Function to determine if error is retryable */
  isRetryableError: (error: Error) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialBackoffMs: 1000,
  backoffMultiplier: 2,
  maxBackoffMs: 10000,
  isRetryableError: (error) => {
    if (error instanceof IntegrationError) {
      return error.isRetryable();
    }
    if (error instanceof RateLimitError) return true;
    if (error instanceof NetworkError) return true;
    // Network errors (ECONNRESET, ETIMEDOUT)
    if (error.message.includes('ECONNRESET') || error.message.includes('ETIMEDOUT')) {
      return true;
    }
    return false;
  },
};

/**
 * Sleep utility for backoff delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param options - Retry configuration
 * @returns Result of successful function call
 * @throws Last error if all retries exhausted
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => fetch('https://api.example.com/data'),
 *   {
 *     maxAttempts: 3,
 *     initialBackoffMs: 1000,
 *     backoffMultiplier: 2,
 *     maxBackoffMs: 10000,
 *     isRetryableError: (error) => error instanceof RateLimitError,
 *   }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;
  let backoffMs = opts.initialBackoffMs;
  let lastError: Error | undefined;

  while (attempt < opts.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      attempt++;

      // Don't retry if max attempts reached
      if (attempt >= opts.maxAttempts) {
        break;
      }

      // Don't retry if error is not retryable
      if (!opts.isRetryableError(lastError)) {
        throw lastError;
      }

      // Handle rate limit retry-after header
      if (lastError instanceof RateLimitError && lastError.retryAfter) {
        backoffMs = lastError.retryAfter * 1000; // Convert seconds to ms
      } else {
        // Exponential backoff
        backoffMs = Math.min(backoffMs * opts.backoffMultiplier, opts.maxBackoffMs);
      }

      // Wait before retry
      await sleep(backoffMs);
    }
  }

  // All retries exhausted
  throw lastError || new Error('Retry failed: unknown error');
}

/**
 * Determines if an error is retryable based on common patterns
 *
 * @param error - Error to check
 * @returns True if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof IntegrationError) {
    return error.isRetryable();
  }

  // Network errors
  if (
    error.message.includes('ECONNRESET') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('ECONNREFUSED')
  ) {
    return true;
  }

  return false;
}
