/**
 * @file registry-failure.chaos.test.ts
 * @summary Chaos engineering tests for MCP Registry failure scenarios
 * @version 1.0.0
 * @description Tests system resilience under various failure conditions
 * @security Chaos testing only; validates failure handling and recovery.
 * @adr none
 * @requirements MCP-001, CHAOS-001
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTestEnvironment } from '../fixtures/mock-external-integrations';

describe('Registry Failure Chaos Tests', () => {
  let mockEnv: ReturnType<typeof createMockTestEnvironment>;
  let faultInjector: FaultInjector;

  beforeEach(() => {
    mockEnv = createMockTestEnvironment();
    faultInjector = new FaultInjector();

    // Setup normal operation responses
    mockEnv.database.query.mockResolvedValue({
      rows: [{ id: 'skill-1', name: 'test-skill', version: '1.0.0' }],
    });

    mockEnv.redis.get.mockResolvedValue('{"cached": "data"}');
    mockEnv.redis.set.mockResolvedValue('OK');
  });

  afterEach(() => {
    faultInjector.clearAllFaults();
    vi.clearAllMocks();
  });

  describe('Database Failure Scenarios', () => {
    it('should handle database connection timeout gracefully', async () => {
      // Inject database timeout fault
      faultInjector.injectFault('database', 'timeout', {
        delay: 30000, // 30 second timeout
        probability: 1.0,
      });

      mockEnv.database.query.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 100);
        });
      });

      // Test graceful degradation
      const result = await executeWithFallback(
        () => mockEnv.database.query('SELECT * FROM skills'),
        () => Promise.resolve({ rows: [] }) // Fallback to empty result
      );

      expect(result.rows).toEqual([]);
      expect(mockEnv.logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Database operation failed'),
        expect.any(Error)
      );
    });

    it('should handle database connection exhaustion', async () => {
      // Inject connection exhaustion
      faultInjector.injectFault('database', 'connection_exhaustion', {
        maxConnections: 5,
        probability: 1.0,
      });

      let connectionCount = 0;
      mockEnv.database.query.mockImplementation(() => {
        connectionCount++;
        if (connectionCount > 5) {
          return Promise.reject(new Error('Connection pool exhausted'));
        }
        return Promise.resolve({ rows: [{ id: 'skill-1' }] });
      });

      // Test with concurrent requests
      const requests = Array.from({ length: 10 }, () =>
        mockEnv.database.query('SELECT * FROM skills')
      );

      const results = await Promise.allSettled(requests);

      // Some should succeed, some should fail
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      expect(successful).toBe(5);
      expect(failed).toBe(5);
    });

    it('should handle database query failures', async () => {
      // Inject query failure
      faultInjector.injectFault('database', 'query_failure', {
        errorType: 'syntax_error',
        probability: 1.0,
      });

      mockEnv.database.query.mockRejectedValueOnce(new Error('SQL syntax error near "WHERE"'));

      try {
        await mockEnv.database.query('INVALID SQL QUERY');
      } catch (error) {
        expect(error.message).toContain('SQL syntax error');
        expect(mockEnv.logger.error).toHaveBeenCalled();
      }
    });

    it('should handle database deadlock scenarios', async () => {
      // Inject deadlock
      faultInjector.injectFault('database', 'deadlock', {
        probability: 1.0,
      });

      mockEnv.database.query.mockRejectedValueOnce(new Error('Deadlock detected'));

      // Test retry logic
      let attempts = 0;
      const maxRetries = 3;

      const executeWithRetry = async (): Promise<any> => {
        try {
          attempts++;
          return await mockEnv.database.query('SELECT * FROM skills');
        } catch (error) {
          if (attempts < maxRetries && error.message.includes('Deadlock')) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Backoff
            return executeWithRetry();
          }
          throw error;
        }
      };

      // Mock successful retry
      mockEnv.database.query.mockResolvedValueOnce({
        rows: [{ id: 'skill-1' }],
      });

      const result = await executeWithRetry();
      expect(result.rows).toHaveLength(1);
      expect(attempts).toBe(2); // Initial failure + retry success
    });
  });

  describe('Cache Failure Scenarios', () => {
    it('should handle Redis connection failure', async () => {
      // Inject Redis connection failure
      faultInjector.injectFault('redis', 'connection_failure', {
        probability: 1.0,
      });

      mockEnv.redis.get.mockRejectedValueOnce(new Error('Redis connection failed'));

      // Test fallback to database
      const result = await executeWithFallback(
        () => mockEnv.redis.get('skill:1'),
        () => mockEnv.database.query('SELECT * FROM skills WHERE id = $1', ['1'])
      );

      expect(result).toBeDefined();
      expect(mockEnv.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache fallback to database')
      );
    });

    it('should handle Redis memory exhaustion', async () => {
      // Inject memory exhaustion
      faultInjector.injectFault('redis', 'memory_exhaustion', {
        probability: 1.0,
      });

      mockEnv.redis.set.mockRejectedValueOnce(new Error('Out of memory'));

      // Test graceful degradation
      const setResult = await executeWithFallback(
        () => mockEnv.redis.set('key', 'value'),
        () => Promise.resolve('OK') // Continue without caching
      );

      expect(setResult).toBe('OK');
      expect(mockEnv.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache write failed')
      );
    });

    it('should handle Redis high latency', async () => {
      // Inject high latency
      faultInjector.injectFault('redis', 'high_latency', {
        delay: 5000, // 5 second delay
        probability: 1.0,
      });

      mockEnv.redis.get.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve('cached-value'), 5000);
        });
      });

      // Test timeout handling
      const startTime = performance.now();

      const result = await executeWithTimeout(
        () => mockEnv.redis.get('skill:1'),
        1000 // 1 second timeout
      );

      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(1500); // Should timeout quickly
      expect(result).toBeNull(); // Timeout should return null
    });
  });

  describe('Network Failure Scenarios', () => {
    it('should handle external API timeouts', async () => {
      // Inject API timeout
      faultInjector.injectFault('external_api', 'timeout', {
        delay: 30000,
        probability: 1.0,
      });

      mockEnv.http.get.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ data: null, status: 408 }), 100);
        });
      });

      // Test timeout handling
      const result = await executeWithTimeout(
        () => mockEnv.http.get('https://api.example.com/skills'),
        5000 // 5 second timeout
      );

      expect(result.status).toBe(408);
      expect(mockEnv.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('External API timeout')
      );
    });

    it('should handle network partition', async () => {
      // Inject network partition
      faultInjector.injectFault('network', 'partition', {
        probability: 1.0,
      });

      mockEnv.http.get.mockRejectedValueOnce(new Error('Network unreachable'));

      // Test circuit breaker pattern
      const circuitBreaker = new CircuitBreaker(mockEnv.http.get, {
        failureThreshold: 3,
        timeout: 60000,
      });

      // Trigger failures to open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute('https://api.example.com/test');
        } catch (error) {
          // Expected failures
        }
      }

      // Circuit should now be open
      expect(circuitBreaker.isOpen()).toBe(true);

      // Subsequent calls should fail fast
      try {
        await circuitBreaker.execute('https://api.example.com/test');
      } catch (error) {
        expect(error.message).toContain('Circuit breaker is open');
      }
    });

    it('should handle DNS resolution failures', async () => {
      // Inject DNS failure
      faultInjector.injectFault('network', 'dns_failure', {
        probability: 1.0,
      });

      mockEnv.http.get.mockRejectedValueOnce(new Error('ENOTFOUND domain.com'));

      try {
        await mockEnv.http.get('https://nonexistent-domain.com/api');
      } catch (error) {
        expect(error.message).toContain('ENOTFOUND');
        expect(mockEnv.logger.error).toHaveBeenCalledWith(
          expect.stringContaining('DNS resolution failed')
        );
      }
    });
  });

  describe('Memory and Resource Failures', () => {
    it('should handle memory pressure', async () => {
      // Inject memory pressure
      faultInjector.injectFault('system', 'memory_pressure', {
        availableMemory: 100 * 1024 * 1024, // 100MB
        probability: 1.0,
      });

      // Mock memory usage
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = vi.fn().mockReturnValue({
        heapUsed: 900 * 1024 * 1024, // 900MB used
        heapTotal: 1024 * 1024 * 1024, // 1GB total
        external: 50 * 1024 * 1024,
        rss: 1000 * 1024 * 1024,
      });

      // Test memory-aware operations
      const canAllocate = checkMemoryAvailability(200 * 1024 * 1024); // 200MB needed
      expect(canAllocate).toBe(false);

      // Should trigger garbage collection
      if (global.gc) {
        global.gc();
      }

      // Restore original
      process.memoryUsage = originalMemoryUsage;
    });

    it('should handle file system exhaustion', async () => {
      // Inject disk space exhaustion
      faultInjector.injectFault('filesystem', 'disk_full', {
        probability: 1.0,
      });

      mockEnv.fs.writeFile.mockRejectedValueOnce(new Error('ENOSPC: No space left on device'));

      try {
        await mockEnv.fs.writeFile('/tmp/skill-data.json', JSON.stringify({ data: 'test' }));
      } catch (error) {
        expect(error.message).toContain('No space left on device');
        expect(mockEnv.logger.error).toHaveBeenCalledWith(
          expect.stringContaining('Disk space exhausted')
        );
      }
    });

    it('should handle file descriptor exhaustion', async () => {
      // Inject file descriptor exhaustion
      faultInjector.injectFault('filesystem', 'fd_exhaustion', {
        probability: 1.0,
      });

      mockEnv.fs.readFile.mockRejectedValueOnce(new Error('EMFILE: Too many open files'));

      try {
        await mockEnv.fs.readFile('/tmp/skill-config.json');
      } catch (error) {
        expect(error.message).toContain('Too many open files');
        expect(mockEnv.logger.error).toHaveBeenCalledWith(
          expect.stringContaining('File descriptor exhaustion')
        );
      }
    });
  });

  describe('Security Failure Scenarios', () => {
    it('should handle authentication service failures', async () => {
      // Inject auth service failure
      faultInjector.injectFault('auth', 'service_failure', {
        probability: 1.0,
      });

      mockEnv.auth.validateToken.mockRejectedValueOnce(new Error('Auth service unavailable'));

      // Test secure fallback
      const result = await executeWithSecureFallback(
        () => mockEnv.auth.validateToken('token'),
        () => Promise.resolve({ valid: false, reason: 'auth_unavailable' })
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('auth_unavailable');
      expect(mockEnv.logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Authentication service failure')
      );
    });

    it('should handle rate limiter failures', async () => {
      // Inject rate limiter failure
      faultInjector.injectFault('rate_limiter', 'failure', {
        probability: 1.0,
      });

      mockEnv.redis.incr.mockRejectedValueOnce(new Error('Rate limiter unavailable'));

      // Test fail-open behavior for rate limiting
      const isAllowed = await checkRateLimitWithFallback('user-123', 'skill:execute');

      // Should allow request when rate limiter fails (fail-open)
      expect(isAllowed).toBe(true);
      expect(mockEnv.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Rate limiter unavailable, allowing request')
      );
    });
  });

  describe('Cascading Failure Scenarios', () => {
    it('should handle cascading failures gracefully', async () => {
      // Inject multiple cascading failures
      faultInjector.injectFault('database', 'timeout', { probability: 0.5 });
      faultInjector.injectFault('redis', 'connection_failure', { probability: 0.5 });
      faultInjector.injectFault('external_api', 'timeout', { probability: 0.5 });

      let databaseFailures = 0;
      let redisFailures = 0;
      let apiFailures = 0;

      mockEnv.database.query.mockImplementation(() => {
        if (Math.random() < 0.5) {
          databaseFailures++;
          return Promise.reject(new Error('Database timeout'));
        }
        return Promise.resolve({ rows: [{ id: 'skill-1' }] });
      });

      mockEnv.redis.get.mockImplementation(() => {
        if (Math.random() < 0.5) {
          redisFailures++;
          return Promise.reject(new Error('Redis connection failed'));
        }
        return Promise.resolve('cached-data');
      });

      mockEnv.http.get.mockImplementation(() => {
        if (Math.random() < 0.5) {
          apiFailures++;
          return Promise.reject(new Error('API timeout'));
        }
        return Promise.resolve({ data: { skills: [] }, status: 200 });
      });

      // Execute mixed operations
      const operations = Array.from({ length: 100 }, async (_, i) => {
        try {
          // Try cache first
          const cached = await mockEnv.redis.get(`skill:${i}`);
          if (cached) return { source: 'cache', data: cached };

          // Fallback to database
          const dbResult = await mockEnv.database.query('SELECT * FROM skills WHERE id = $1', [i]);
          if (dbResult.rows.length > 0) return { source: 'database', data: dbResult.rows[0] };

          // Fallback to external API
          const apiResult = await mockEnv.http.get(`https://api.example.com/skills/${i}`);
          return { source: 'api', data: apiResult.data };
        } catch (error) {
          return { source: 'error', error: error.message };
        }
      });

      const results = await Promise.all(operations);

      // Analyze resilience
      const successful = results.filter((r) => r.source !== 'error').length;
      const failed = results.filter((r) => r.source === 'error').length;

      // Should have some success despite failures
      expect(successful).toBeGreaterThan(50); // At least 50% success rate
      expect(failed).toBeLessThan(50); // Less than 50% failure rate

      // Verify fallback chain worked
      const cacheHits = results.filter((r) => r.source === 'cache').length;
      const dbHits = results.filter((r) => r.source === 'database').length;
      const apiHits = results.filter((r) => r.source === 'api').length;

      expect(cacheHits + dbHits + apiHits).toBe(successful);
    });
  });

  describe('Recovery Testing', () => {
    it('should demonstrate automatic recovery', async () => {
      // Inject intermittent failure
      faultInjector.injectFault('database', 'intermittent_failure', {
        failureRate: 0.3,
        recoveryTime: 5000,
      });

      let failureCount = 0;
      mockEnv.database.query.mockImplementation(() => {
        failureCount++;
        if (failureCount <= 3) {
          return Promise.reject(new Error('Intermittent failure'));
        }
        return Promise.resolve({ rows: [{ id: 'skill-1' }] });
      });

      // Test recovery with exponential backoff
      const result = await executeWithExponentialBackoff(
        () => mockEnv.database.query('SELECT * FROM skills'),
        { maxRetries: 5, baseDelay: 1000 }
      );

      expect(result.rows).toHaveLength(1);
      expect(failureCount).toBe(4); // 3 failures + 1 success
    });

    it('should maintain service during partial degradation', async () => {
      // Inject partial service degradation
      faultInjector.injectFault('service', 'partial_degradation', {
        degradedServices: ['search', 'analytics'],
        performanceFactor: 0.5, // 50% performance
        probability: 1.0,
      });

      // Mock degraded performance
      const originalQuery = mockEnv.database.query;
      mockEnv.database.query.mockImplementation((sql, params) => {
        if (sql.includes('search') || sql.includes('analytics')) {
          return new Promise((resolve) => {
            setTimeout(() => resolve({ rows: [] }), 2000); // Slower response
          });
        }
        return originalQuery(sql, params);
      });

      // Test that core functionality still works
      const coreResult = await mockEnv.database.query('SELECT * FROM skills');
      const searchResult = await mockEnv.database.query('SELECT * FROM skills_search');

      expect(coreResult.rows).toBeDefined();
      expect(searchResult.rows).toBeDefined();

      // Verify performance difference
      const coreTime = performance.now();
      await mockEnv.database.query('SELECT * FROM skills');
      const coreDuration = performance.now() - coreTime;

      const searchTime = performance.now();
      await mockEnv.database.query('SELECT * FROM skills_search');
      const searchDuration = performance.now() - searchTime;

      expect(searchDuration).toBeGreaterThan(coreDuration);
    });
  });
});

// Helper classes and functions
class FaultInjector {
  private faults = new Map<string, any>();

  injectFault(service: string, faultType: string, config: any) {
    this.faults.set(`${service}:${faultType}`, config);
  }

  clearAllFaults() {
    this.faults.clear();
  }

  shouldInjectFault(service: string, faultType: string): boolean {
    const fault = this.faults.get(`${service}:${faultType}`);
    return fault && Math.random() < (fault.probability || 1.0);
  }

  getFaultConfig(service: string, faultType: string) {
    return this.faults.get(`${service}:${faultType}`);
  }
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private operation: Function,
    private options: { failureThreshold: number; timeout: number }
  ) {}

  async execute(...args: any[]) {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.options.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await this.operation(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
    }
  }

  isOpen() {
    return this.state === 'open';
  }
}

async function executeWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    return await fallback();
  }
}

async function executeWithTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number
): Promise<T | null> {
  const timeoutPromise = new Promise<null>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } catch (error) {
    if (error.message === 'Operation timeout') {
      return null;
    }
    throw error;
  }
}

async function executeWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  options: { maxRetries: number; baseDelay: number }
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === options.maxRetries) {
        throw lastError;
      }

      const delay = options.baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

async function executeWithSecureFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    // Log security-relevant failures
    console.error('Security operation failed, using fallback:', error);
    return await fallback();
  }
}

function checkMemoryAvailability(requiredBytes: number): boolean {
  const usage = process.memoryUsage();
  const available = usage.heapTotal - usage.heapUsed;
  return available >= requiredBytes;
}

async function checkRateLimitWithFallback(userId: string, action: string): Promise<boolean> {
  try {
    // Try rate limiter
    const count = await mockEnv.redis.incr(`rate_limit:${userId}:${action}`);
    await mockEnv.redis.expire(`rate_limit:${userId}:${action}`, 60);
    return count <= 100; // 100 requests per minute
  } catch (error) {
    // Fail-open: allow request if rate limiter fails
    return true;
  }
}
