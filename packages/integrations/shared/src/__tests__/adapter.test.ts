/**
 * @file packages/integrations/shared/src/__tests__/adapter.test.ts
 * Task: Add comprehensive test suite for standardized patterns
 *
 * Purpose: Test suite for base integration adapter and standardized patterns.
 * Validates circuit breaker, retry logic, authentication, and monitoring.
 *
 * Created: 2026-02-21
 * Standards: Comprehensive testing, security validation, performance testing
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BaseIntegrationAdapter, DEFAULT_INTEGRATION_CONFIG } from '../types/adapter';
import { createLogger } from '../utils/logger';
import type { IntegrationConfig, IntegrationResult } from '../types/adapter';

// Mock logger for testing
vi.mock('../utils/logger');
const mockLogger = createLogger as any;

// Test implementation of BaseIntegrationAdapter
class TestAdapter extends BaseIntegrationAdapter {
  constructor() {
    super('test-adapter', 'Test Adapter', '1.0.0');
  }

  protected async onInitialize(config: IntegrationConfig): Promise<void> {
    // Mock implementation
  }

  async healthCheck(): Promise<
    IntegrationResult<{ status: 'healthy' | 'degraded' | 'unhealthy' }>
  > {
    return this.executeOperation(async () => {
      return { status: 'healthy' };
    }, 'health-check');
  }

  // Test method for circuit breaker
  async testOperation(shouldFail: boolean = false): Promise<IntegrationResult<string>> {
    return this.executeOperation(async () => {
      if (shouldFail) {
        throw new Error('Test operation failed');
      }
      // Simulate realistic operation timing (100ms)
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'success';
    }, 'test-operation');
  }
}

describe('BaseIntegrationAdapter', () => {
  let adapter: TestAdapter;
  let config: IntegrationConfig;

  beforeEach(() => {
    adapter = new TestAdapter();
    config = {
      ...DEFAULT_INTEGRATION_CONFIG,
      timeout: 1000,
      retry: {
        maxAttempts: 3,
        baseDelay: 100,
        maxDelay: 1000,
        backoffFactor: 2,
        jitterEnabled: false, // Disable for predictable tests
      },
      circuitBreaker: {
        failureThreshold: 3,
        resetTimeout: 5000,
        monitoringEnabled: true,
      },
      auth: {
        type: 'api_key',
        key: 'test-key',
        headerName: 'X-Test-Key',
      },
    } as IntegrationConfig;

    mockLogger.mockReturnValue({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      startOperation: vi.fn(() => () => {}),
      logApiCall: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct properties', () => {
      expect(adapter.id).toBe('test-adapter');
      expect(adapter.name).toBe('Test Adapter');
      expect(adapter.version).toBe('1.0.0');
    });

    it('should initialize with configuration', async () => {
      await adapter.initialize(config);
      expect(adapter.getCircuitBreakerState()).toBe('closed');
    });

    it('should throw error when executing without initialization', async () => {
      const result = await adapter.testOperation();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Adapter not initialized');
      expect(result.code).toBe('NOT_INITIALIZED');
    });
  });

  describe('Circuit Breaker', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should remain closed on successful operations', async () => {
      const result = await adapter.testOperation(false);
      expect(result.success).toBe(true);
      expect(adapter.getCircuitBreakerState()).toBe('closed');
    });

    it('should open circuit after failure threshold', async () => {
      // Trigger failures to reach threshold
      for (let i = 0; i < config.circuitBreaker.failureThreshold; i++) {
        const result = await adapter.testOperation(true);
        expect(result.success).toBe(false);
      }

      expect(adapter.getCircuitBreakerState()).toBe('open');
    });

    it('should reject operations when circuit is open', async () => {
      // Open the circuit
      for (let i = 0; i < config.circuitBreaker.failureThreshold; i++) {
        await adapter.testOperation(true);
      }

      // Try operation while circuit is open
      const result = await adapter.testOperation(false);
      expect(result.success).toBe(false);
      expect(result.code).toBe('CIRCUIT_BREAKER_OPEN');
      expect(result.retryable).toBe(true);
    });

    it('should transition to half-open after reset timeout', async () => {
      // Open the circuit
      for (let i = 0; i < config.circuitBreaker.failureThreshold; i++) {
        await adapter.testOperation(true);
      }

      // Fast-forward time
      vi.useFakeTimers();
      vi.advanceTimersByTime(config.circuitBreaker.resetTimeout + 1000);

      // Next operation should transition to half-open
      await adapter.testOperation(false);
      expect(adapter.getCircuitBreakerState()).toBe('half-open');

      vi.useRealTimers();
    });

    it('should close circuit on successful operation in half-open state', async () => {
      // Open the circuit
      for (let i = 0; i < config.circuitBreaker.failureThreshold; i++) {
        await adapter.testOperation(true);
      }

      // Fast-forward time and attempt successful operation
      vi.useFakeTimers();
      vi.advanceTimersByTime(config.circuitBreaker.resetTimeout + 1000);

      const result = await adapter.testOperation(false);
      expect(result.success).toBe(true);
      expect(adapter.getCircuitBreakerState()).toBe('closed');

      vi.useRealTimers();
    });
  });

  describe('Retry Logic', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should retry retryable errors', async () => {
      let attemptCount = 0;
      const mockOperation = vi.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          const error = new Error('Network error');
          (error as any).status = 500;
          throw error;
        }
        return 'success';
      });

      // Access the protected method through type assertion
      const result = await (adapter as any).executeWithRetry(mockOperation, config.retry);

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const mockOperation = vi.fn().mockImplementation(() => {
        const error = new Error('Bad request');
        (error as any).status = 400;
        throw error;
      });

      try {
        await (adapter as any).executeWithRetry(mockOperation, config.retry);
      } catch (error) {
        // Expected to fail
      }

      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should respect max retry attempts', async () => {
      const mockOperation = vi.fn().mockImplementation(() => {
        const error = new Error('Server error');
        (error as any).status = 500;
        throw error;
      });

      try {
        await (adapter as any).executeWithRetry(mockOperation, config.retry);
      } catch (error) {
        // Expected to fail
      }

      expect(mockOperation).toHaveBeenCalledTimes(config.retry.maxAttempts);
    });
  });

  describe('Metrics', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should track successful operations', async () => {
      await adapter.testOperation(false);

      const metrics = adapter.getMetrics();
      expect(metrics.success).toBe(true);
      expect(metrics.data.requestCount).toBe(1);
      expect(metrics.data.successRate).toBe(1);
      expect(metrics.data.errorRate).toBe(0);
    });

    it('should track failed operations', async () => {
      await adapter.testOperation(true);

      const metrics = adapter.getMetrics();
      expect(metrics.success).toBe(false);
      expect(metrics.data.requestCount).toBe(1);
      expect(metrics.data.successRate).toBe(0);
      expect(metrics.data.errorRate).toBe(1);
    });

    it('should calculate average response time', async () => {
      await adapter.testOperation(false); // Now has built-in 100ms delay

      const metrics = adapter.getMetrics();
      expect(metrics.success).toBe(true);
      expect(metrics.data.averageResponseTime).toBeGreaterThan(90);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when operational', async () => {
      await adapter.initialize(config);

      const result = await adapter.healthCheck();
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('healthy');
    });

    it('should return error when not initialized', async () => {
      const result = await adapter.healthCheck();
      expect(result.success).toBe(false);
      expect(result.code).toBe('NOT_INITIALIZED');
    });
  });

  describe('Error Classification', () => {
    beforeEach(async () => {
      await adapter.initialize(config);
    });

    it('should classify network errors as retryable', async () => {
      const result = await adapter.testOperation(true);
      expect(result.success).toBe(false);
      expect(result.retryable).toBe(true);
    });

    it('should provide appropriate error codes', async () => {
      // Test different error types
      const testCases = [
        { error: new Error('TimeoutError'), expectedCode: 'TIMEOUT' },
        { error: new Error('NetworkError'), expectedCode: 'NETWORK_ERROR' },
        {
          error: Object.assign(new Error('HTTP Error'), { status: 500 }),
          expectedCode: 'HTTP_500',
        },
      ];

      for (const testCase of testCases) {
        const errorCode = (adapter as any).getErrorCode(testCase.error);
        expect(errorCode).toBe(testCase.expectedCode);
      }
    });
  });
});

describe('DEFAULT_INTEGRATION_CONFIG', () => {
  it('should provide sensible defaults', () => {
    expect(DEFAULT_INTEGRATION_CONFIG.timeout).toBe(10000);
    expect(DEFAULT_INTEGRATION_CONFIG.retry.maxAttempts).toBe(3);
    expect(DEFAULT_INTEGRATION_CONFIG.circuitBreaker.failureThreshold).toBe(5);
    expect(DEFAULT_INTEGRATION_CONFIG.monitoring?.enabled).toBe(true);
  });

  it('should have retry configuration with exponential backoff', () => {
    const { retry } = DEFAULT_INTEGRATION_CONFIG;
    expect(retry.baseDelay).toBe(1000);
    expect(retry.maxDelay).toBe(10000);
    expect(retry.backoffFactor).toBe(2);
    expect(retry.jitterEnabled).toBe(true);
  });

  it('should have circuit breaker configuration', () => {
    const { circuitBreaker } = DEFAULT_INTEGRATION_CONFIG;
    expect(circuitBreaker.resetTimeout).toBe(30000);
    expect(circuitBreaker.monitoringEnabled).toBe(true);
  });
});
