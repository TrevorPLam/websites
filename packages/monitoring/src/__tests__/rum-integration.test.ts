/**
 * @file packages/monitoring/src/__tests__/rum-integration.test.ts
 * @summary Comprehensive tests for RUM integration service
 * @description Test coverage for RUM ingestion, correlation analysis, and performance monitoring
 * @requirements TASK-007.5 / rum-testing / comprehensive-coverage
 * @version 2026.02.26
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RUMIntegrationService } from '../rum-integration';
import type { RUMMetrics, SyntheticTestResult } from '../rum-integration';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  gte: vi.fn(() => mockSupabase),
  lte: vi.fn(() => mockSupabase),
  order: vi.fn(() => mockSupabase),
  single: vi.fn(() => mockSupabase),
  upsert: vi.fn(() => mockSupabase),
  rpc: vi.fn(() => mockSupabase),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

// Mock Sentry
vi.mock('@repo/infrastructure/sentry/server', () => ({
  withServerSpan: vi.fn((name, fn) => fn()),
}));

describe('RUMIntegrationService', () => {
  let rumService: RUMIntegrationService;

  beforeEach(() => {
    vi.clearAllMocks();
    rumService = new RUMIntegrationService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('RUM Metrics Ingestion', () => {
    it('should ingest RUM metrics successfully', async () => {
      // Arrange
      const mockRUMMetrics: Omit<RUMMetrics, 'sessionId'> = {
        lcp: 2100,
        inp: 150,
        cls: 0.08,
        ttfb: 450,
        routeChangeTime: 200,
        apiResponseTime: 300,
        renderTime: 100,
        firstContentfulPaint: 1200,
        tenantId: 'test-tenant',
        userId: 'test-user',
        route: '/checkout',
        userAgent: 'Mozilla/5.0...',
        viewport: { width: 1920, height: 1080 },
        connection: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
        },
        location: {
          country: 'US',
          city: 'New York',
          timezone: 'America/New_York',
        },
        timestamp: Date.now(),
        sessionStart: Date.now() - 300000,
        pageLoadStart: Date.now() - 5000,
      };

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act
      await rumService.ingestRUMMetrics(mockRUMMetrics);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('rum_metrics');
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_id: 'test-tenant',
          user_id: 'test-user',
          route: '/checkout',
          lcp: 2100,
          inp: 150,
          cls: 0.08,
          ttfb: 450,
        })
      );
    });

    it('should handle ingestion errors gracefully', async () => {
      // Arrange
      const mockRUMMetrics: Omit<RUMMetrics, 'sessionId'> = {
        lcp: 2100,
        inp: 150,
        cls: 0.08,
        ttfb: 450,
        routeChangeTime: 200,
        apiResponseTime: 300,
        renderTime: 100,
        firstContentfulPaint: 1200,
        tenantId: 'test-tenant',
        route: '/checkout',
        userAgent: 'Mozilla/5.0...',
        viewport: { width: 1920, height: 1080 },
        connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
        timestamp: Date.now(),
        sessionStart: Date.now() - 300000,
        pageLoadStart: Date.now() - 5000,
      };

      mockSupabase.insert.mockResolvedValue({ 
        error: new Error('Database connection failed') 
      });

      // Act & Assert
      await expect(rumService.ingestRUMMetrics(mockRUMMetrics)).rejects.toThrow(
        'RUM ingestion failed: Database connection failed'
      );
    });

    it('should generate session ID for anonymous users', async () => {
      // Arrange
      const mockRUMMetrics: Omit<RUMMetrics, 'sessionId'> = {
        lcp: 2100,
        inp: 150,
        cls: 0.08,
        ttfb: 450,
        routeChangeTime: 200,
        apiResponseTime: 300,
        renderTime: 100,
        firstContentfulPaint: 1200,
        tenantId: 'test-tenant',
        route: '/checkout',
        userAgent: 'Mozilla/5.0...',
        viewport: { width: 1920, height: 1080 },
        connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
        timestamp: Date.now(),
        sessionStart: Date.now() - 300000,
        pageLoadStart: Date.now() - 5000,
      };

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act
      await rumService.ingestRUMMetrics(mockRUMMetrics);

      // Assert
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: expect.stringMatching(/^anonymous-\d+-[a-z0-9]+$/),
        })
      );
    });
  });

  describe('Synthetic Test Results Ingestion', () => {
    it('should ingest synthetic test results successfully', async () => {
      // Arrange
      const mockSyntheticResults: SyntheticTestResult[] = [
        {
          testId: 'test-001',
          testName: 'Checkout Page Performance',
          testType: 'lighthouse',
          timestamp: Date.now(),
          duration: 30000,
          lcp: 1800,
          inp: 120,
          cls: 0.05,
          ttfb: 350,
          environment: 'production',
          browser: 'Chrome',
          viewport: { width: 1920, height: 1080 },
          network: {
            connectionType: '4g',
            latency: 50,
            downloadSpeed: 10,
          },
          passed: true,
          score: 92,
          violations: [],
        },
      ];

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act
      await rumService.ingestSyntheticTestResults(mockSyntheticResults);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('synthetic_tests');
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          test_id: 'test-001',
          test_name: 'Checkout Page Performance',
          test_type: 'lighthouse',
          lcp: 1800,
          inp: 120,
          cls: 0.05,
          ttfb: 350,
          passed: true,
          score: 92,
        })
      );
    });

    it('should handle batch ingestion of multiple synthetic tests', async () => {
      // Arrange
      const mockSyntheticResults: SyntheticTestResult[] = [
        {
          testId: 'test-001',
          testName: 'Homepage Performance',
          testType: 'lighthouse',
          timestamp: Date.now(),
          duration: 25000,
          lcp: 1600,
          inp: 100,
          cls: 0.04,
          ttfb: 300,
          environment: 'production',
          browser: 'Chrome',
          viewport: { width: 1920, height: 1080 },
          network: { connectionType: '4g', latency: 50, downloadSpeed: 10 },
          passed: true,
          score: 95,
          violations: [],
        },
        {
          testId: 'test-002',
          testName: 'Product Page Performance',
          testType: 'playwright',
          timestamp: Date.now(),
          duration: 28000,
          lcp: 1900,
          inp: 130,
          cls: 0.06,
          ttfb: 380,
          environment: 'production',
          browser: 'Firefox',
          viewport: { width: 1920, height: 1080 },
          network: { connectionType: '4g', latency: 60, downloadSpeed: 8 },
          passed: true,
          score: 88,
          violations: ['Large image files detected'],
        },
      ];

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act
      await rumService.ingestSyntheticTestResults(mockSyntheticResults);

      // Assert
      expect(mockSupabase.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe('Correlation Analysis', () => {
    it('should correlate synthetic and RUM data successfully', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const route = '/checkout';

      const mockSyntheticData = [
        {
          test_id: 'test-001',
          timestamp: new Date(Date.now() - 1000000).toISOString(),
          lcp: 1800,
          inp: 120,
          cls: 0.05,
          ttfb: 350,
        },
      ];

      const mockRUMData = [
        {
          session_id: 'session-001',
          timestamp: new Date(Date.now() - 950000).toISOString(),
          lcp: 2100,
          inp: 150,
          cls: 0.08,
          ttfb: 450,
        },
      ];

      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.gte.mockReturnValue(mockSupabase);
      mockSupabase.lte.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({ data: null, error: null });

      // Mock synthetic data fetch
      mockSupabase.select.mockResolvedValueOnce({ 
        data: mockSyntheticData, 
        error: null 
      });

      // Mock RUM data fetch
      mockSupabase.select.mockResolvedValueOnce({ 
        data: mockRUMData, 
        error: null 
      });

      // Mock correlation storage
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.upsert.mockResolvedValue({ error: null });

      // Act
      const correlations = await rumService.correlateSyntheticAndRUMData(tenantId, route);

      // Assert
      expect(correlations).toHaveLength(1);
      expect(correlations[0]).toMatchObject({
        syntheticTestId: 'test-001',
        rumSessionId: 'session-001',
        correlationScore: expect.any(Number),
        varianceAnalysis: expect.objectContaining({
          lcpVariance: expect.any(Number),
          inpVariance: expect.any(Number),
          clsVariance: expect.any(Number),
          ttfbVariance: expect.any(Number),
          overallVariance: expect.any(Number),
        }),
        impactLevel: expect.any(String),
        gapAnalysis: expect.objectContaining({
          performanceGap: expect.any(Number),
          userExperienceImpact: expect.any(String),
          recommendations: expect.any(Array),
        }),
      });
    });

    it('should handle empty data gracefully', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const route = '/checkout';

      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.gte.mockReturnValue(mockSupabase);
      mockSupabase.lte.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);

      // Mock empty synthetic data
      mockSupabase.select.mockResolvedValueOnce({ 
        data: [], 
        error: null 
      });

      // Mock empty RUM data
      mockSupabase.select.mockResolvedValueOnce({ 
        data: [], 
        error: null 
      });

      // Act
      const correlations = await rumService.correlateSyntheticAndRUMData(tenantId, route);

      // Assert
      expect(correlations).toHaveLength(0);
    });

    it('should calculate correlation scores correctly', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const route = '/checkout';

      const mockSyntheticData = [
        {
          test_id: 'test-001',
          timestamp: new Date(Date.now() - 1000000).toISOString(),
          lcp: 2000,
          inp: 150,
          cls: 0.1,
          ttfb: 400,
        },
      ];

      const mockRUMData = [
        {
          session_id: 'session-001',
          timestamp: new Date(Date.now() - 950000).toISOString(),
          lcp: 2000, // Perfect match
          inp: 150,  // Perfect match
          cls: 0.1,  // Perfect match
          ttfb: 400,  // Perfect match
        },
      ];

      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.gte.mockReturnValue(mockSupabase);
      mockSupabase.lte.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);
      mockSupabase.upsert.mockResolvedValue({ error: null });

      mockSupabase.select.mockResolvedValueOnce({ 
        data: mockSyntheticData, 
        error: null 
      });
      mockSupabase.select.mockResolvedValueOnce({ 
        data: mockRUMData, 
        error: null 
      });

      // Act
      const correlations = await rumService.correlateSyntheticAndRUMData(tenantId, route);

      // Assert
      expect(correlations).toHaveLength(1);
      expect(correlations[0].correlationScore).toBeCloseTo(1.0, 1);
      expect(correlations[0].varianceAnalysis.overallVariance).toBeCloseTo(0.0, 1);
    });
  });

  describe('Performance Baselines', () => {
    it('should retrieve performance baseline for tenant and route', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const route = '/checkout';

      const mockBaseline = {
        tenant_id: tenantId,
        route: route,
        baseline_metrics: {
          lcp: { p50: 1800, p75: 2200, p90: 2800, p95: 3200 },
          inp: { p50: 100, p75: 150, p90: 200, p95: 250 },
          cls: { p50: 0.05, p75: 0.08, p90: 0.12, p95: 0.15 },
          ttfb: { p50: 300, p75: 400, p90: 600, p95: 800 },
        },
        synthetic_baseline: {
          test_id: 'baseline-test',
          lcp: 2000,
          inp: 120,
          cls: 0.06,
          ttfb: 350,
        },
        last_updated: new Date().toISOString(),
        sample_size: 1000,
      };

      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({ 
        data: mockBaseline, 
        error: null 
      });

      // Act
      const baseline = await rumService.getPerformanceBaseline(tenantId, route);

      // Assert
      expect(baseline).toMatchObject({
        tenantId,
        route,
        baselineMetrics: mockBaseline.baseline_metrics,
        syntheticBaseline: mockBaseline.synthetic_baseline,
        sampleSize: 1000,
      });
    });

    it('should return null when no baseline exists', async () => {
      // Arrange
      const tenantId = 'test-tenant';
      const route = '/checkout';

      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({ 
        data: null, 
        error: { message: 'No rows found' }
      });

      // Act
      const baseline = await rumService.getPerformanceBaseline(tenantId, route);

      // Assert
      expect(baseline).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      const mockRUMMetrics: Omit<RUMMetrics, 'sessionId'> = {
        lcp: 2100,
        inp: 150,
        cls: 0.08,
        ttfb: 450,
        routeChangeTime: 200,
        apiResponseTime: 300,
        renderTime: 100,
        firstContentfulPaint: 1200,
        tenantId: 'test-tenant',
        route: '/checkout',
        userAgent: 'Mozilla/5.0...',
        viewport: { width: 1920, height: 1080 },
        connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
        timestamp: Date.now(),
        sessionStart: Date.now() - 300000,
        pageLoadStart: Date.now() - 5000,
      };

      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      // Act & Assert
      await expect(rumService.ingestRUMMetrics(mockRUMMetrics)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle malformed data gracefully', async () => {
      // Arrange
      const mockRUMMetrics: Omit<RUMMetrics, 'sessionId'> = {
        lcp: -100, // Invalid negative value
        inp: NaN, // Invalid NaN value
        cls: 0.08,
        ttfb: 450,
        routeChangeTime: 200,
        apiResponseTime: 300,
        renderTime: 100,
        firstContentfulPaint: 1200,
        tenantId: 'test-tenant',
        route: '/checkout',
        userAgent: 'Mozilla/5.0...',
        viewport: { width: 1920, height: 1080 },
        connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
        timestamp: Date.now(),
        sessionStart: Date.now() - 300000,
        pageLoadStart: Date.now() - 5000,
      };

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act & Assert - Should not throw, but data validation should handle it
      await expect(rumService.ingestRUMMetrics(mockRUMMetrics)).resolves.not.toThrow();
    });
  });

  describe('Data Validation', () => {
    it('should validate required fields in RUM metrics', async () => {
      // Arrange
      const invalidRUMMetrics = {
        lcp: 2100,
        inp: 150,
        cls: 0.08,
        ttfb: 450,
        // Missing required fields: tenantId, route, timestamp, etc.
      };

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act & Assert
      // @ts-expect-error - Testing invalid input
      await expect(rumService.ingestRUMMetrics(invalidRUMMetrics)).rejects.toThrow();
    });

    it('should validate synthetic test result structure', async () => {
      // Arrange
      const invalidSyntheticResult = {
        testId: 'test-001',
        // Missing required fields
      };

      mockSupabase.insert.mockResolvedValue({ error: null });

      // Act & Assert
      // @ts-expect-error - Testing invalid input
      await expect(
        rumService.ingestSyntheticTestResults([invalidSyntheticResult])
      ).rejects.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    it('should handle large datasets efficiently', async () => {
      // Arrange
      const largeSyntheticDataset = Array.from({ length: 1000 }, (_, i) => ({
        testId: `test-${i}`,
        testName: `Test ${i}`,
        testType: 'lighthouse',
        timestamp: Date.now(),
        duration: 30000,
        lcp: 1800 + Math.random() * 1000,
        inp: 120 + Math.random() * 100,
        cls: 0.05 + Math.random() * 0.1,
        ttfb: 350 + Math.random() * 200,
        environment: 'production',
        browser: 'Chrome',
        viewport: { width: 1920, height: 1080 },
        network: { connectionType: '4g', latency: 50, downloadSpeed: 10 },
        passed: true,
        score: 85 + Math.random() * 15,
        violations: [],
      }));

      mockSupabase.insert.mockResolvedValue({ error: null });

      const startTime = performance.now();

      // Act
      await rumService.ingestSyntheticTestResults(largeSyntheticDataset);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Assert
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(mockSupabase.insert).toHaveBeenCalledTimes(1000);
    });
  });
});
