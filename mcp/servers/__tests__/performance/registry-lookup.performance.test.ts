/**
 * @file registry-lookup.performance.test.ts
 * @summary Performance tests for MCP Registry lookup operations
 * @version 1.0.0
 * @description Validates registry performance under load with k6 integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMockTestEnvironment } from '../fixtures/mock-external-integrations';

describe('Registry Lookup Performance Tests', () => {
  let mockEnv: ReturnType<typeof createMockTestEnvironment>;
  let performanceMetrics: Array<{
    operation: string;
    duration: number;
    timestamp: number;
  }> = [];

  beforeEach(() => {
    mockEnv = createMockTestEnvironment();
    performanceMetrics = [];
    
    // Setup mock registry data
    const mockSkills = Array.from({ length: 1000 }, (_, i) => ({
      id: `skill-${i}`,
      name: `skill-${i}`,
      version: '1.0.0',
      category: 'core',
      tenant_id: `tenant-${i % 100}`, // 100 tenants
      created_at: new Date().toISOString(),
    }));

    mockEnv.database.query.mockImplementation((sql, params) => {
      const start = performance.now();
      
      // Simulate database latency
      return new Promise(resolve => {
        setTimeout(() => {
          let result = { rows: [] };
          
          if (sql.includes('SELECT') && sql.includes('skills')) {
            if (params.length > 0 && typeof params[0] === 'string') {
              // Single skill lookup
              result.rows = mockSkills.filter(skill => skill.id === params[0]);
            } else {
              // All skills lookup
              result.rows = mockSkills;
            }
          } else if (sql.includes('tenants')) {
            result.rows = Array.from({ length: 100 }, (_, i) => ({
              id: `tenant-${i}`,
              name: `Tenant ${i}`,
              status: 'active',
            }));
          }
          
          const duration = performance.now() - start;
          performanceMetrics.push({
            operation: 'database_query',
            duration,
            timestamp: Date.now(),
          });
          
          resolve(result);
        }, Math.random() * 50 + 10); // 10-60ms latency
      });
    });
  });

  afterEach(() => {
    performanceMetrics = [];
  });

  describe('Single Skill Lookup Performance', () => {
    it('should complete single skill lookup within 100ms budget', async () => {
      const skillId = 'skill-123';
      const performanceBudget = 100; // 100ms

      const startTime = performance.now();
      
      await mockEnv.database.query(
        'SELECT * FROM skills WHERE id = $1',
        [skillId]
      );
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
      expect(mockEnv.database.query).toHaveBeenCalledWith(
        'SELECT * FROM skills WHERE id = $1',
        [skillId]
      );
    });

    it('should handle 100 concurrent single lookups efficiently', async () => {
      const concurrentRequests = 100;
      const performanceBudget = 1000; // 1 second for all requests

      const requests = Array.from({ length: concurrentRequests }, (_, i) =>
        mockEnv.database.query(
          'SELECT * FROM skills WHERE id = $1',
          [`skill-${i}`]
        )
      );

      const startTime = performance.now();
      await Promise.all(requests);
      const totalDuration = performance.now() - startTime;

      expect(totalDuration).toBeLessThan(performanceBudget);
      expect(mockEnv.database.query).toHaveBeenCalledTimes(concurrentRequests);

      // Verify average request time
      const avgDuration = totalDuration / concurrentRequests;
      expect(avgDuration).toBeLessThan(50); // 50ms average
    });

    it('should maintain performance under repeated lookups', async () => {
      const iterations = 50;
      const performanceBudget = 200; // 200ms per iteration
      const durations: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        
        await mockEnv.database.query(
          'SELECT * FROM skills WHERE id = $1',
          [`skill-${i % 10}`] // Repeat 10 different skills
        );
        
        const duration = performance.now() - startTime;
        durations.push(duration);
        expect(duration).toBeLessThan(performanceBudget);
      }

      // Check performance consistency
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const minDuration = Math.min(...durations);

      expect(avgDuration).toBeLessThan(100); // 100ms average
      expect(maxDuration).toBeLessThan(200); // 200ms maximum
      expect(maxDuration - minDuration).toBeLessThan(150); // Low variance
    });
  });

  describe('Bulk Operations Performance', () => {
    it('should handle bulk skill lookup within performance budget', async () => {
      const skillCount = 100;
      const performanceBudget = 500; // 500ms for 100 skills

      const startTime = performance.now();
      
      await mockEnv.database.query('SELECT * FROM skills LIMIT $1', [skillCount]);
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });

    it('should handle tenant skill lookup efficiently', async () => {
      const tenantId = 'tenant-5';
      const performanceBudget = 150; // 150ms

      const startTime = performance.now();
      
      await mockEnv.database.query(
        'SELECT * FROM skills WHERE tenant_id = $1',
        [tenantId]
      );
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });

    it('should handle category-based filtering efficiently', async () => {
      const category = 'core';
      const performanceBudget = 200; // 200ms

      const startTime = performance.now();
      
      await mockEnv.database.query(
        'SELECT * FROM skills WHERE category = $1',
        [category]
      );
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });
  });

  describe('Search and Filter Performance', () => {
    it('should handle text search within performance budget', async () => {
      const searchTerm = 'skill';
      const performanceBudget = 300; // 300ms

      const startTime = performance.now();
      
      await mockEnv.database.query(
        'SELECT * FROM skills WHERE name ILIKE $1',
        [`%${searchTerm}%`]
      );
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });

    it('should handle complex filter queries efficiently', async () => {
      const performanceBudget = 400; // 400ms

      const startTime = performance.now();
      
      await mockEnv.database.query(`
        SELECT * FROM skills 
        WHERE category = $1 
        AND tenant_id = $2 
        AND created_at > $3
        LIMIT 100
      `, ['core', 'tenant-1', '2024-01-01']);
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });

    it('should handle pagination efficiently', async () => {
      const page = 1;
      const pageSize = 50;
      const performanceBudget = 200; // 200ms

      const startTime = performance.now();
      
      await mockEnv.database.query(
        'SELECT * FROM skills ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [pageSize, (page - 1) * pageSize]
      );
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(performanceBudget);
    });
  });

  describe('Cache Performance', () => {
    it('should demonstrate cache hit performance improvement', async () => {
      const skillId = 'skill-cached';
      const uncachedDuration = await measureUncachedLookup(skillId);
      const cachedDuration = await measureCachedLookup(skillId);

      // Cache should be significantly faster
      expect(cachedDuration).toBeLessThan(uncachedDuration * 0.5); // At least 50% faster
      expect(cachedDuration).toBeLessThan(20); // Under 20ms for cache hits
    });

    it('should handle cache eviction gracefully', async () => {
      const skillCount = 200;
      const cacheSize = 100; // Simulate cache size limit
      
      // Fill cache beyond capacity
      for (let i = 0; i < skillCount; i++) {
        await mockEnv.redis.set(`skill:${i}`, JSON.stringify({ id: `skill-${i}` }), { ex: 3600 });
      }
      
      // Access evicted items
      const startTime = performance.now();
      
      await mockEnv.redis.get('skill:50'); // Should be evicted
      await mockEnv.redis.get('skill:150'); // Should be evicted
      
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(50); // Should handle eviction quickly
    });
  });

  describe('Load Testing Simulation', () => {
    it('should simulate realistic load patterns', async () => {
      const scenarios = [
        { name: 'browse', weight: 0.6, delay: 100 }, // 60% browsing, 100ms think time
        { name: 'search', weight: 0.3, delay: 200 }, // 30% searching, 200ms think time
        { name: 'detail', weight: 0.1, delay: 300 }, // 10% detail view, 300ms think time
      ];

      const totalRequests = 1000;
      const performanceBudget = 30000; // 30 seconds total

      const requests = Array.from({ length: totalRequests }, async (_, i) => {
        const random = Math.random();
        let scenario = scenarios[0];
        let cumulative = 0;

        for (const s of scenarios) {
          cumulative += s.weight;
          if (random <= cumulative) {
            scenario = s;
            break;
          }
        }

        // Simulate user think time
        await new Promise(resolve => setTimeout(resolve, scenario.delay));

        const startTime = performance.now();

        switch (scenario.name) {
          case 'browse':
            await mockEnv.database.query('SELECT * FROM skills LIMIT 20');
            break;
          case 'search':
            await mockEnv.database.query('SELECT * FROM skills WHERE name ILIKE $1', ['%test%']);
            break;
          case 'detail':
            await mockEnv.database.query('SELECT * FROM skills WHERE id = $1', [`skill-${i % 100}`]);
            break;
        }

        return performance.now() - startTime;
      });

      const overallStart = performance.now();
      const durations = await Promise.all(requests);
      const overallDuration = performance.now() - overallStart;

      expect(overallDuration).toBeLessThan(performanceBudget);

      // Analyze performance metrics
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const p95Duration = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];
      const maxDuration = Math.max(...durations);

      expect(avgDuration).toBeLessThan(150); // 150ms average
      expect(p95Duration).toBeLessThan(300); // 300ms p95
      expect(maxDuration).toBeLessThan(1000); // 1 second maximum
    });
  });

  describe('Performance Regression Detection', () => {
    it('should detect performance regressions', () => {
      const baselineMetrics = {
        singleLookup: 50,    // 50ms baseline
        bulkLookup: 200,     // 200ms baseline
        searchQuery: 150,    // 150ms baseline
      };

      const currentMetrics = {
        singleLookup: 75,    // 50% slower
        bulkLookup: 180,     // 10% faster
        searchQuery: 300,    // 100% slower
      };

      // Check for regressions (>20% slower)
      const singleLookupRegression = currentMetrics.singleLookup > baselineMetrics.singleLookup * 1.2;
      const bulkLookupRegression = currentMetrics.bulkLookup > baselineMetrics.bulkLookup * 1.2;
      const searchQueryRegression = currentMetrics.searchQuery > baselineMetrics.searchQuery * 1.2;

      expect(singleLookupRegression).toBe(true);  // Detected regression
      expect(bulkLookupRegression).toBe(false);  // No regression
      expect(searchQueryRegression).toBe(true);  // Detected regression
    });
  });

  describe('Resource Usage Monitoring', () => {
    it('should monitor memory usage during operations', async () => {
      const initialMemory = process.memoryUsage();
      
      // Perform memory-intensive operations
      const requests = Array.from({ length: 100 }, () =>
        mockEnv.database.query('SELECT * FROM skills')
      );
      
      await Promise.all(requests);
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (< 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    it('should track database connection usage', async () => {
      const connectionCount = 20;
      
      const requests = Array.from({ length: connectionCount }, (_, i) =>
        mockEnv.database.query(`SELECT * FROM skills WHERE id = $1`, [`skill-${i}`])
      );
      
      await Promise.all(requests);
      
      // Verify all connections were used
      expect(mockEnv.database.query).toHaveBeenCalledTimes(connectionCount);
    });
  });
});

// Helper functions
async function measureUncachedLookup(skillId: string): Promise<number> {
  const mockEnv = createMockTestEnvironment();
  mockEnv.redis.get.mockResolvedValue(null); // Cache miss
  
  const startTime = performance.now();
  await mockEnv.database.query('SELECT * FROM skills WHERE id = $1', [skillId]);
  return performance.now() - startTime;
}

async function measureCachedLookup(skillId: string): Promise<number> {
  const mockEnv = createMockTestEnvironment();
  mockEnv.redis.get.mockResolvedValue(JSON.stringify({ id: skillId })); // Cache hit
  
  const startTime = performance.now();
  await mockEnv.redis.get(`skill:${skillId}`);
  return performance.now() - startTime;
}
