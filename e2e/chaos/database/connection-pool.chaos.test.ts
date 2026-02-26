import { expect, test } from '@playwright/test';
import { createMockTestEnvironment } from '../../../mcp/servers/__tests__/fixtures/mock-external-integrations';

/**
 * Database Connection Pool Chaos Tests
 *
 * Tests system resilience under various database connection pool failure scenarios
 * Including connection exhaustion, timeout cascades, and recovery patterns
 */

class DatabaseChaosInjector {
  private activeFaults = new Map<string, any>();

  injectFault(type: string, config: any) {
    this.activeFaults.set(type, config);
  }

  clearFaults() {
    this.activeFaults.clear();
  }

  shouldInjectFault(type: string): boolean {
    const fault = this.activeFaults.get(type);
    return fault && Math.random() < (fault.probability || 1.0);
  }

  getFaultConfig(type: string) {
    return this.activeFaults.get(type);
  }
}

class ConnectionPoolSimulator {
  private connections = new Set<string>();
  private maxConnections: number;
  private connectionCount = 0;

  constructor(maxConnections: number = 20) {
    this.maxConnections = maxConnections;
  }

  async getConnection(): Promise<string> {
    if (this.connections.size >= this.maxConnections) {
      throw new Error('Connection pool exhausted');
    }

    const connectionId = `conn-${++this.connectionCount}`;
    this.connections.add(connectionId);

    // Simulate connection establishment delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

    return connectionId;
  }

  releaseConnection(connectionId: string) {
    this.connections.delete(connectionId);
  }

  getActiveConnections(): number {
    return this.connections.size;
  }

  reset() {
    this.connections.clear();
    this.connectionCount = 0;
  }
}

test.describe('Database Connection Pool Chaos Tests', () => {
  let mockEnv: ReturnType<typeof createMockTestEnvironment>;
  let chaosInjector: DatabaseChaosInjector;
  let connectionPool: ConnectionPoolSimulator;

  test.beforeEach(() => {
    mockEnv = createMockTestEnvironment();
    chaosInjector = new DatabaseChaosInjector();
    connectionPool = new ConnectionPoolSimulator(10); // Small pool for testing

    // Setup normal database responses
    mockEnv.database.query.mockResolvedValue({
      rows: [{ id: '1', data: 'test' }],
    });
  });

  test.afterEach(() => {
    chaosInjector.clearFaults();
    connectionPool.reset();
  });

  test('should handle connection pool exhaustion gracefully', async () => {
    // Inject connection pool exhaustion fault
    chaosInjector.injectFault('pool_exhaustion', {
      probability: 1.0,
      maxConnections: 5,
    });

    // Simulate rapid connection requests
    const connectionPromises = Array.from({ length: 15 }, async (_, i) => {
      try {
        const connection = await connectionPool.getConnection();

        // Simulate database operation
        if (chaosInjector.shouldInjectFault('pool_exhaustion')) {
          throw new Error('Connection pool exhausted');
        }

        // Release connection after operation
        setTimeout(() => connectionPool.releaseConnection(connection), 100);

        return { success: true, connectionId: connection };
      } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    });

    const results = await Promise.all(connectionPromises);

    // Analyze results
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    expect(successful).toBeLessThanOrEqual(10); // Should not exceed pool size
    expect(failed).toBeGreaterThan(0); // Some should fail due to exhaustion
    expect(failed).toBeGreaterThanOrEqual(5); // At least 5 should fail

    // Verify error handling
    const failures = results.filter((r) => !r.success);
    failures.forEach((failure) => {
      expect(failure.error).toContain('Connection pool exhausted');
    });
  });

  test('should recover from connection pool exhaustion', async () => {
    // Inject intermittent connection exhaustion
    chaosInjector.injectFault('intermittent_exhaustion', {
      probability: 0.7,
      recoveryTime: 2000,
    });

    let attemptCount = 0;
    const maxAttempts = 20;
    const results = [];

    for (let i = 0; i < maxAttempts; i++) {
      attemptCount++;
      try {
        const connection = await connectionPool.getConnection();

        // Simulate work and release
        setTimeout(() => connectionPool.releaseConnection(connection), 50);

        results.push({ attempt: attemptCount, success: true });
      } catch (error: unknown) {
        results.push({
          attempt: attemptCount,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });

        // Wait for recovery
        if (chaosInjector.shouldInjectFault('intermittent_exhaustion')) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }

    // Should have some successes despite intermittent failures
    const successes = results.filter((r) => r.success).length;
    const failures = results.filter((r) => !r.success).length;

    expect(successes).toBeGreaterThan(0);
    expect(failures).toBeGreaterThan(0);
    expect(successes + failures).toBe(maxAttempts);
  });

  test('should handle connection timeout cascades', async () => {
    // Inject connection timeout fault
    chaosInjector.injectFault('connection_timeout', {
      probability: 0.8,
      timeoutMs: 30000,
    });

    mockEnv.database.query.mockImplementation(async () => {
      if (chaosInjector.shouldInjectFault('connection_timeout')) {
        // Simulate connection timeout
        await new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 100);
        });
      }
      return { rows: [{ id: '1', data: 'test' }] };
    });

    // Test concurrent operations with timeout
    const operations = Array.from({ length: 10 }, async (_, i) => {
      try {
        const result = await mockEnv.database.query('SELECT * FROM test');
        return { operation: i, success: true, data: result };
      } catch (error) {
        return {
          operation: i,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });

    const results = await Promise.allSettled(operations);

    // Analyze timeout impacts
    const timeouts = results.filter(
      (r) =>
        r.status === 'rejected' ||
        (r.status === 'fulfilled' && !r.value.success && r.value.error?.includes('timeout'))
    ).length;

    expect(timeouts).toBeGreaterThan(0);
    expect(timeouts).toBeLessThan(10); // Not all should timeout
  });

  test('should implement proper connection retry logic', async () => {
    // Inject intermittent connection failures
    chaosInjector.injectFault('intermittent_failure', {
      probability: 0.6,
      maxRetries: 3,
    });

    let retryCount = 0;
    const maxRetries = 3;

    mockEnv.database.query.mockImplementation(async () => {
      if (chaosInjector.shouldInjectFault('intermittent_failure') && retryCount < maxRetries) {
        retryCount++;
        throw new Error('Connection failed');
      }
      return { rows: [{ id: '1', data: 'test' }] };
    });

    // Test retry logic
    const executeWithRetry = async (): Promise<any> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await mockEnv.database.query('SELECT * FROM test');
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
    };

    const result = await executeWithRetry();

    expect(result.rows).toBeDefined();
    expect(retryCount).toBeGreaterThan(0);
    expect(retryCount).toBeLessThanOrEqual(maxRetries);
  });

  test('should maintain service during partial pool degradation', async ({ page }) => {
    // Inject partial connection pool degradation
    chaosInjector.injectFault('partial_degradation', {
      degradedConnections: 0.3, // 30% of connections fail
      probability: 1.0,
    });

    // Navigate to a page that uses database connections
    await page.goto('/portal/dashboard');
    await page.waitForLoadState('networkidle');

    // Monitor page behavior during degradation
    const metrics = {
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [] as number[],
    };

    // Make multiple requests to test degradation
    for (let i = 0; i < 20; i++) {
      const startTime = performance.now();

      try {
        const response = await page.evaluate(() => {
          // Simulate database request
          return fetch('/api/dashboard/data').then((r) => r.json());
        });

        metrics.successfulRequests++;
        metrics.responseTimes.push(performance.now() - startTime);
      } catch (error) {
        metrics.failedRequests++;
      }
    }

    // Service should remain partially functional
    expect(metrics.successfulRequests).toBeGreaterThan(10);
    expect(metrics.failedRequests).toBeGreaterThan(0);
    expect(metrics.successfulRequests + metrics.failedRequests).toBe(20);

    // Response times should be reasonable
    const avgResponseTime =
      metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
    expect(avgResponseTime).toBeLessThan(5000); // Less than 5 seconds
  });

  test('should handle connection leak scenarios', async () => {
    // Inject connection leak fault
    chaosInjector.injectFault('connection_leak', {
      probability: 0.5,
      leakRate: 0.3, // 30% of connections are leaked
    });

    const leakedConnections = new Set<string>();
    const normalConnections = new Set<string>();

    // Simulate connection operations with potential leaks
    for (let i = 0; i < 20; i++) {
      try {
        const connection = await connectionPool.getConnection();

        if (chaosInjector.shouldInjectFault('connection_leak')) {
          // Simulate connection leak (don't release)
          leakedConnections.add(connection);
        } else {
          // Normal operation - release connection
          setTimeout(() => {
            connectionPool.releaseConnection(connection);
            normalConnections.add(connection);
          }, 50);
        }
      } catch (error: unknown) {
        // Handle connection pool exhaustion due to leaks
        const errorMessage = error instanceof Error ? error.message : String(error);
        expect(errorMessage).toContain('Connection pool exhausted');
      }
    }

    // Verify leak impact
    expect(leakedConnections.size).toBeGreaterThan(0);
    expect(normalConnections.size).toBeGreaterThan(0);
    expect(connectionPool.getActiveConnections()).toBe(leakedConnections.size);
  });

  test('should implement connection pool health monitoring', async () => {
    // Create health monitoring system
    const healthMetrics = {
      totalConnections: 0,
      activeConnections: 0,
      failedConnections: 0,
      averageResponseTime: 0,
      responseTimes: [] as number[],
    };

    // Inject various connection issues
    chaosInjector.injectFault('health_test', {
      failureRate: 0.2,
      responseTimeVariation: 1000,
    });

    // Monitor connection pool health over time
    for (let i = 0; i < 50; i++) {
      const startTime = performance.now();

      try {
        const connection = await connectionPool.getConnection();

        // Simulate database operation with variable response time
        if (chaosInjector.shouldInjectFault('health_test')) {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
        }

        connectionPool.releaseConnection(connection);

        healthMetrics.totalConnections++;
        healthMetrics.responseTimes.push(performance.now() - startTime);
      } catch (error) {
        healthMetrics.failedConnections++;
      }
    }

    // Calculate health metrics
    healthMetrics.averageResponseTime =
      healthMetrics.responseTimes.reduce((a, b) => a + b, 0) / healthMetrics.responseTimes.length;
    healthMetrics.activeConnections = connectionPool.getActiveConnections();

    // Verify health monitoring
    expect(healthMetrics.totalConnections).toBeGreaterThan(0);
    expect(healthMetrics.failedConnections).toBeGreaterThanOrEqual(0);
    expect(healthMetrics.averageResponseTime).toBeGreaterThan(0);
    expect(healthMetrics.activeConnections).toBe(0); // All connections should be released
  });
});
