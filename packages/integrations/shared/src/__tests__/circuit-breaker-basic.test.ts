/**
 * @file packages/integrations/shared/src/__tests__/circuit-breaker-basic.test.ts
 * @summary Basic circuit breaker functionality tests.
 * @description Test core circuit breaker patterns without complex dependencies.
 * @security Mock implementations only, no real network requests or authentication.
 * @adr none
 * @requirements none
 *
 * Created: 2026-02-21
 * Standards: 2026 testing best practices with Vitest and mocking
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the logger to avoid dependency issues
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    logApiCall: vi.fn(),
  }),
  IntegrationMetrics: {
    recordRequest: vi.fn(),
  },
}));

import { createHttpClient } from '../utils/http-client';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Circuit Breaker Pattern - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('Success Cases', () => {
    it('should handle successful requests', async () => {
      const httpClient = createHttpClient();

      // Mock successful response with proper content-type
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: 'success' }),
        text: () => Promise.resolve('{"data": "success"}'),
        blob: () => Promise.resolve(new Blob()),
      } as Response);

      const result = await httpClient.request({ url: '/test' });

      expect(result.success).toBe(true);
      // The HTTP client returns the full HttpResponse object
      expect(result.data).toEqual({
        data: { data: 'success' },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should track metrics correctly', async () => {
      const httpClient = createHttpClient();

      // Mock successful response with proper content-type
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: 'success' }),
        text: () => Promise.resolve('{"data": "success"}'),
        blob: () => Promise.resolve(new Blob()),
      } as Response);

      // Make a successful request
      await httpClient.request({ url: '/test' });

      const metrics = httpClient.getMetrics();
      expect(metrics.requestCount).toBe(1);
      expect(metrics.successCount).toBe(1);
      expect(metrics.failureCount).toBe(0);
      expect(metrics.successRate).toBe(1);
      expect(metrics.circuitBreakerState).toBe('closed');
    });
  });
});
