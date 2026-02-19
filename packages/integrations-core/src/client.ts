/**
 * @file packages/integrations-core/src/client.ts
 * @summary Resilient HTTP client with retry, circuit breaker, and DLQ
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Provides a resilient HTTP client that combines retry logic,
 *          circuit breaker pattern, and dead letter queue for integration resilience.
 *
 * Exports / Entry: ResilientHttpClient, ResilientHttpClientOptions
 * Used by: Integration packages (HubSpot, scheduling, email, etc.)
 *
 * Invariants:
 * - Retries transient errors with exponential backoff
 * - Opens circuit breaker after failure threshold
 * - Stores failed requests in DLQ after max retries
 *
 * Status: @public
 */

import { withRetry, type RetryOptions } from './retry';
import { CircuitBreaker, type CircuitBreakerOptions } from './circuit-breaker';
import { addToDLQ } from './dlq';
import { IntegrationError, RateLimitError, NetworkError, CircuitBreakerOpenError } from './errors';

export interface ResilientHttpClientOptions {
  /** Integration name for DLQ entries */
  integration: string;
  /** Retry configuration */
  retry: Partial<RetryOptions>;
  /** Circuit breaker configuration */
  circuitBreaker: Partial<CircuitBreakerOptions>;
}

/**
 * Resilient HTTP client with retry, circuit breaker, and DLQ
 *
 * Combines retry logic, circuit breaker pattern, and dead letter queue
 * to provide robust integration resilience.
 *
 * @example
 * ```typescript
 * const client = new ResilientHttpClient({
 *   integration: 'hubspot',
 *   retry: {
 *     maxAttempts: 3,
 *     initialBackoffMs: 1000,
 *   },
 *   circuitBreaker: {
 *     failureThreshold: 5,
 *     timeoutMs: 60000,
 *   },
 * });
 *
 * const response = await client.request('https://api.hubspot.com/contacts', {
 *   method: 'POST',
 *   headers: { Authorization: 'Bearer token' },
 *   body: JSON.stringify(data),
 * });
 * ```
 */
export class ResilientHttpClient {
  private circuitBreaker: CircuitBreaker;

  constructor(private options: ResilientHttpClientOptions) {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      timeoutMs: 60000,
      halfOpenMaxAttempts: 2,
      ...options.circuitBreaker,
    });
  }

  /**
   * Makes an HTTP request with retry, circuit breaker, and DLQ
   *
   * @param url - Request URL
   * @param init - Fetch request options
   * @returns Response object
   * @throws IntegrationError, RateLimitError, CircuitBreakerOpenError
   */
  async request(url: string, init: RequestInit = {}): Promise<Response> {
    try {
      return await this.circuitBreaker.execute(() =>
        withRetry(
          async () => {
            const response = await fetch(url, {
              ...init,
              headers: {
                'Content-Type': 'application/json',
                ...init.headers,
              },
            });

            // Handle non-OK responses
            if (!response.ok) {
              const errorText = await response.text().catch(() => 'Unknown error');

              // Rate limit (429)
              if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                throw new RateLimitError(
                  `Rate limit exceeded: ${errorText}`,
                  retryAfter ? parseInt(retryAfter, 10) : undefined,
                  { url, status: response.status }
                );
              }

              // Server errors (5xx) - retryable
              if (response.status >= 500 && response.status < 600) {
                throw new IntegrationError(
                  `Server error ${response.status}: ${errorText}`,
                  response.status,
                  { url }
                );
              }

              // Client errors (4xx) - not retryable (except 429)
              throw new IntegrationError(
                `Client error ${response.status}: ${errorText}`,
                response.status,
                { url }
              );
            }

            return response;
          },
          {
            maxAttempts: 3,
            initialBackoffMs: 1000,
            backoffMultiplier: 2,
            maxBackoffMs: 10000,
            isRetryableError: (error) => {
              if (error instanceof RateLimitError) return true;
              if (error instanceof IntegrationError && error.statusCode && error.statusCode >= 500)
                return true;
              if (error instanceof NetworkError) return true;
              if (error instanceof CircuitBreakerOpenError) return false;
              // Network errors
              if (
                error.message.includes('ECONNRESET') ||
                error.message.includes('ETIMEDOUT') ||
                error.message.includes('ENOTFOUND')
              ) {
                return true;
              }
              return false;
            },
            ...this.options.retry,
          }
        )
      );
    } catch (error) {
      // Add to DLQ after all retries exhausted
      if (error instanceof IntegrationError || error instanceof RateLimitError) {
        await addToDLQ({
          url,
          method: init.method || 'GET',
          headers: (init.headers as Record<string, string>) || {},
          body: typeof init.body === 'string' ? init.body : JSON.stringify(init.body),
          error: String(error),
          retryCount: this.options.retry.maxAttempts || 3,
          integration: this.options.integration,
        }).catch((dlqError) => {
          // Log DLQ failure but don't throw (original error is more important)
          console.error('Failed to add to DLQ:', dlqError);
        });
      }

      throw error;
    }
  }

  /**
   * Gets current circuit breaker state
   */
  getCircuitBreakerState(): 'closed' | 'open' | 'half-open' {
    return this.circuitBreaker.getState();
  }

  /**
   * Resets circuit breaker (useful for testing)
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }
}
