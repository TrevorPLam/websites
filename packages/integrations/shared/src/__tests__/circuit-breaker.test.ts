/**
 * @file packages/integrations/shared/src/__tests__/circuit-breaker.test.ts
 * Task: Test circuit breaker functionality across all integrations
 *
 * Purpose: Comprehensive test suite for circuit breaker patterns,
 * retry logic, timeout handling, and monitoring capabilities.
 *
 * Created: 2026-02-21
 * Standards: 2026 testing best practices with Jest and mocking
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createHttpClient } from '../utils/http-client';
import type { HttpClientConfig } from '../utils/http-client';

// Mock fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Circuit Breaker Pattern', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Circuit Breaker Functionality', () => {
    it('should start in closed state', () => {
      const httpClient = createHttpClient();
      expect(httpClient.getCircuitBreakerState()).toBe('closed');
    });

    it('should open circuit breaker after failure threshold', async () => {
      const httpClient = createHttpClient({
        circuitBreaker: {
          failureThreshold: 3,
          resetTimeout: 1000,
        },
      });

      // Mock fetch to fail
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Trigger failures to reach threshold
      for (let i = 0; i < 3; i++) {
        const result = await httpClient.request({ url: '/test' });
        expect(result.success).toBe(false);
      }

      // Circuit breaker should now be open
      expect(httpClient.getCircuitBreakerState()).toBe('open');
    });

    it('should reject requests when circuit breaker is open', async () => {
      const httpClient = createHttpClient({
        circuitBreaker: {
          failureThreshold: 2,
          resetTimeout: 1000,
        },
      });

      // Mock fetch to fail
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Trigger failures to open circuit breaker
      for (let i = 0; i < 2; i++) {
        await httpClient.request({ url: '/test' });
      }

      expect(httpClient.getCircuitBreakerState()).toBe('open');

      // Subsequent requests should be rejected immediately
      const result = await httpClient.request({ url: '/test' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Circuit breaker is open');
      expect(result.code).toBe('CIRCUIT_BREAKER_OPEN');
      expect(result.retryable).toBe(true);
    });
  });

  describe('Retry Logic', () => {
    it('should retry retryable errors', async () => {
      const httpClient = createHttpClient({
        retry: {
          maxAttempts: 3,
          baseDelay: 10, // Short delay for testing
          maxDelay: 100,
          backoffFactor: 2,
          jitterEnabled: false, // Disable jitter for predictable testing
        },
      });

      // Mock fetch to fail twice, then succeed
      mockFetch
        .mockRejectedValueOnce(new Error('TimeoutError'))
        .mockRejectedValueOnce(new Error('TimeoutError'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          json: () => Promise.resolve({ data: 'success' }),
        } as Response);

      const result = await httpClient.request({ url: '/test' });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const httpClient = createHttpClient({
        retry: {
          maxAttempts: 3,
          baseDelay: 10,
          maxDelay: 100,
          backoffFactor: 2,
          jitterEnabled: false,
        },
      });

      // Mock fetch to fail with non-retryable error
      const error = new Error('Bad request');
      (error as any).status = 400;
      mockFetch.mockRejectedValue(error);

      const result = await httpClient.request({ url: '/test' });

      expect(result.success).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Metrics and Monitoring', () => {
    it('should track request metrics correctly', async () => {
      const httpClient = createHttpClient();

      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({ data: 'success' }),
      } as Response);

      // Make some requests
      await httpClient.request({ url: '/test1' });
      await httpClient.request({ url: '/test2' });

      // Mock failure
      mockFetch.mockRejectedValue(new Error('Network error'));
      await httpClient.request({ url: '/test3' });

      const metrics = httpClient.getMetrics();

      expect(metrics.requestCount).toBe(3);
      expect(metrics.successCount).toBe(2);
      expect(metrics.failureCount).toBe(1);
      expect(metrics.successRate).toBe(2 / 3);
      expect(metrics.circuitBreakerState).toBe('closed');
    });
  });
});
