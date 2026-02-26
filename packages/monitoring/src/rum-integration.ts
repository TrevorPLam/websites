/**
 * @file packages/monitoring/src/rum-integration.ts
 * @summary Real User Monitoring (RUM) integration with synthetic test correlation
 * @description Integrates RUM data with synthetic test results for comprehensive performance monitoring
 * @security Multi-tenant data isolation with GDPR compliance
 * @requirements TASK-007.1 / rum-integration / synthetic-correlation
 * @version 2026.02.26
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { withServerSpan } from '@repo/infrastructure/sentry/server';

export interface RUMMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint (ms)
  inp: number; // Interaction to Next Paint (ms)
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte (ms)
  fid?: number; // First Input Delay (ms) - legacy

  // User Experience Metrics
  routeChangeTime: number;
  apiResponseTime: number;
  renderTime: number;
  firstContentfulPaint: number;

  // Context Information
  tenantId: string;
  userId?: string;
  sessionId: string;
  route: string;
  userAgent: string;
  viewport: { width: number; height: number };
  connection: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  location?: {
    country: string;
    city: string;
    timezone: string;
  };

  // Timestamps
  timestamp: number;
  sessionStart: number;
  pageLoadStart: number;
}

export interface SyntheticTestResult {
  testId: string;
  testName: string;
  testType: 'lighthouse' | 'playwright' | 'custom';
  timestamp: number;
  duration: number;

  // Core Web Vitals from synthetic tests
  lcp: number;
  inp: number;
  cls: number;
  ttfb: number;

  // Test Environment
  environment: 'staging' | 'production';
  browser: string;
  viewport: { width: number; height: number };
  network: {
    connectionType: string;
    latency: number;
    downloadSpeed: number;
  };

  // Test Results
  passed: boolean;
  score: number;
  violations: string[];
}

export interface CorrelationResult {
  syntheticTestId: string;
  rumSessionId: string;
  correlationScore: number; // 0-1 similarity score
  varianceAnalysis: {
    lcpVariance: number;
    inpVariance: number;
    clsVariance: number;
    ttfbVariance: number;
    overallVariance: number;
  };
  gapAnalysis: {
    performanceGap: number;
    userExperienceImpact: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
  };
  timestamp: number;
}

export interface PerformanceBaseline {
  tenantId: string;
  route: string;
  baselineMetrics: {
    lcp: { p50: number; p75: number; p90: number; p95: number };
    inp: { p50: number; p75: number; p90: number; p95: number };
    cls: { p50: number; p75: number; p90: number; p95: number };
    ttfb: { p50: number; p75: number; p90: number; p95: number };
  };
  syntheticBaseline: SyntheticTestResult;
  lastUpdated: number;
  sampleSize: number;
}

/**
 * Real User Monitoring Integration Service
 *
 * Provides comprehensive RUM capabilities:
 * - Real user metrics collection and aggregation
 * - Synthetic test correlation and variance analysis
 * - Performance baseline establishment and monitoring
 * - Multi-tenant data isolation and GDPR compliance
 */
export class RUMIntegrationService {
  private supabase: SupabaseClient<any>;
  private baselineCache = new Map<string, PerformanceBaseline>();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Ingest RUM metrics from client-side tracking
   */
  async ingestRUMMetrics(metrics: Omit<RUMMetrics, 'sessionId'>): Promise<void> {
    return withServerSpan({ name: 'rum.ingest-metrics', op: 'db.query' }, async () => {
      try {
        // Generate session ID if not provided
        const sessionId = metrics.userId 
          ? `${metrics.userId}-${metrics.sessionStart}`
          : `anonymous-${metrics.timestamp}-${Math.random().toString(36).substr(2, 9)}`;

        const rumMetrics: RUMMetrics = {
          ...metrics,
          sessionId,
        };

        // Store RUM metrics in Supabase
        const { error } = await this.supabase
          .from('rum_metrics')
          .insert({
            tenant_id: rumMetrics.tenantId,
            user_id: rumMetrics.userId,
            session_id: rumMetrics.sessionId,
            route: rumMetrics.route,
            lcp: rumMetrics.lcp,
            inp: rumMetrics.inp,
            cls: rumMetrics.cls,
            ttfb: rumMetrics.ttfb,
            fid: rumMetrics.fid,
            route_change_time: rumMetrics.routeChangeTime,
            api_response_time: rumMetrics.apiResponseTime,
            render_time: rumMetrics.renderTime,
            first_contentful_paint: rumMetrics.firstContentfulPaint,
            user_agent: rumMetrics.userAgent,
            viewport_width: rumMetrics.viewport.width,
            viewport_height: rumMetrics.viewport.height,
            connection_type: rumMetrics.connection.effectiveType,
            connection_downlink: rumMetrics.connection.downlink,
            connection_rtt: rumMetrics.connection.rtt,
            location_country: rumMetrics.location?.country,
            location_city: rumMetrics.location?.city,
            location_timezone: rumMetrics.location?.timezone,
            timestamp: new Date(rumMetrics.timestamp).toISOString(),
            session_start: new Date(rumMetrics.sessionStart).toISOString(),
            page_load_start: new Date(rumMetrics.pageLoadStart).toISOString(),
          });

        if (error) {
          console.error('Failed to ingest RUM metrics:', error);
          throw new Error(`RUM ingestion failed: ${error.message}`);
        }

        // Trigger correlation analysis if we have synthetic test data
        await this.triggerCorrelationAnalysis(rumMetrics.tenantId, rumMetrics.route);

      } catch (error) {
        console.error('RUM ingestion error:', error);
        throw error;
      }
    });
  }

  /**
   * Ingest synthetic test results
   */
  async ingestSyntheticTestResults(results: SyntheticTestResult[]): Promise<void> {
    return withServerSpan({ name: 'rum.ingest-synthetic', op: 'db.query' }, async () => {
      try {
        for (const result of results) {
          const { error } = await this.supabase
            .from('synthetic_tests')
            .insert({
              test_id: result.testId,
              test_name: result.testName,
              test_type: result.testType,
              timestamp: new Date(result.timestamp).toISOString(),
              duration: result.duration,
              lcp: result.lcp,
              inp: result.inp,
              cls: result.cls,
              ttfb: result.ttfb,
              environment: result.environment,
              browser: result.browser,
              viewport_width: result.viewport.width,
              viewport_height: result.viewport.height,
              connection_type: result.network.connectionType,
              connection_latency: result.network.latency,
              connection_download_speed: result.network.downloadSpeed,
              passed: result.passed,
              score: result.score,
              violations: result.violations,
            });

          if (error) {
            console.error('Failed to ingest synthetic test results:', error);
            throw new Error(`Synthetic test ingestion failed: ${error.message}`);
          }
        }

        // Update performance baselines after synthetic tests
        await this.updatePerformanceBaselines(results);

      } catch (error) {
        console.error('Synthetic test ingestion error:', error);
        throw error;
      }
    });
  }

  /**
   * Correlate RUM data with synthetic test results
   */
  async correlateSyntheticAndRUMData(
    tenantId: string,
    route: string,
    timeWindow: number = 3600000 // 1 hour default
  ): Promise<CorrelationResult[]> {
    return withServerSpan({ name: 'rum.correlate-data', op: 'db.query' }, async () => {
      try {
        const endTime = Date.now();
        const startTime = endTime - timeWindow;

        // Get recent synthetic test results
        const { data: syntheticData, error: syntheticError } = await this.supabase
          .from('synthetic_tests')
          .select('*')
          .eq('environment', 'production')
          .gte('timestamp', new Date(startTime).toISOString())
          .lte('timestamp', new Date(endTime).toISOString())
          .order('timestamp', { ascending: false });

        if (syntheticError) {
          throw new Error(`Failed to fetch synthetic test data: ${syntheticError.message}`);
        }

        // Get recent RUM metrics for the same route
        const { data: rumData, error: rumError } = await this.supabase
          .from('rum_metrics')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('route', route)
          .gte('timestamp', new Date(startTime).toISOString())
          .lte('timestamp', new Date(endTime).toISOString())
          .order('timestamp', { ascending: false });

        if (rumError) {
          throw new Error(`Failed to fetch RUM data: ${rumError.message}`);
        }

        const correlations: CorrelationResult[] = [];

        // For each synthetic test, find correlated RUM sessions
        for (const synthetic of syntheticData || []) {
          const correlatedRUMSessions = rumData?.filter(rum => {
            const rumTime = new Date(rum.timestamp).getTime();
            const syntheticTime = new Date(synthetic.timestamp).getTime();
            return Math.abs(rumTime - syntheticTime) < 300000; // Within 5 minutes
          }) || [];

          for (const rum of correlatedRUMSessions) {
            const correlation = this.calculateCorrelation(synthetic, rum);
            correlations.push(correlation);
          }
        }

        // Store correlation results
        if (correlations.length > 0) {
          await this.storeCorrelationResults(correlations);
        }

        return correlations;

      } catch (error) {
        console.error('Correlation analysis error:', error);
        throw error;
      }
    });
  }

  /**
   * Calculate correlation score between synthetic and RUM data
   */
  private calculateCorrelation(
    synthetic: any,
    rum: any
  ): CorrelationResult {
    const lcpVariance = Math.abs(synthetic.lcp - rum.lcp) / synthetic.lcp;
    const inpVariance = Math.abs(synthetic.inp - rum.inp) / synthetic.inp;
    const clsVariance = Math.abs(synthetic.cls - rum.cls) / synthetic.cls;
    const ttfbVariance = Math.abs(synthetic.ttfb - rum.ttfb) / synthetic.ttfb;

    const overallVariance = (lcpVariance + inpVariance + clsVariance + ttfbVariance) / 4;
    const correlationScore = Math.max(0, 1 - overallVariance);

    // Determine performance gap impact
    const performanceGap = overallVariance * 100;
    let userExperienceImpact: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (performanceGap > 50) userExperienceImpact = 'critical';
    else if (performanceGap > 30) userExperienceImpact = 'high';
    else if (performanceGap > 15) userExperienceImpact = 'medium';

    // Generate recommendations based on variance patterns
    const recommendations = this.generateRecommendations({
      lcpVariance,
      inpVariance,
      clsVariance,
      ttfbVariance,
    });

    return {
      syntheticTestId: synthetic.test_id,
      rumSessionId: rum.session_id,
      correlationScore,
      varianceAnalysis: {
        lcpVariance,
        inpVariance,
        clsVariance,
        ttfbVariance,
        overallVariance,
      },
      gapAnalysis: {
        performanceGap,
        userExperienceImpact,
        recommendations,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Generate recommendations based on variance analysis
   */
  private generateRecommendations(variances: {
    lcpVariance: number;
    inpVariance: number;
    clsVariance: number;
    ttfbVariance: number;
  }): string[] {
    const recommendations: string[] = [];

    if (variances.lcpVariance > 0.3) {
      recommendations.push('High LCP variance detected - investigate real-world network conditions and content delivery');
    }

    if (variances.inpVariance > 0.3) {
      recommendations.push('High INP variance - review JavaScript execution and main thread blocking');
    }

    if (variances.clsVariance > 0.3) {
      recommendations.push('High CLS variance - check for dynamic content and font loading issues');
    }

    if (variances.ttfbVariance > 0.3) {
      recommendations.push('High TTFB variance - investigate server response times and CDN configuration');
    }

    if (recommendations.length === 0) {
      recommendations.push('Synthetic and RUM metrics are well correlated - continue monitoring');
    }

    return recommendations;
  }

  /**
   * Store correlation results for analysis
   */
  private async storeCorrelationResults(correlations: CorrelationResult[]): Promise<void> {
    try {
      for (const correlation of correlations) {
        const { error } = await this.supabase
          .from('rum_synthetic_correlations')
          .insert({
            synthetic_test_id: correlation.syntheticTestId,
            rum_session_id: correlation.rumSessionId,
            correlation_score: correlation.correlationScore,
            lcp_variance: correlation.varianceAnalysis.lcpVariance,
            inp_variance: correlation.varianceAnalysis.inpVariance,
            cls_variance: correlation.varianceAnalysis.clsVariance,
            ttfb_variance: correlation.varianceAnalysis.ttfbVariance,
            overall_variance: correlation.varianceAnalysis.overallVariance,
            performance_gap: correlation.gapAnalysis.performanceGap,
            user_experience_impact: correlation.gapAnalysis.userExperienceImpact,
            recommendations: correlation.gapAnalysis.recommendations,
            timestamp: new Date(correlation.timestamp).toISOString(),
          });

        if (error) {
          console.error('Failed to store correlation result:', error);
        }
      }
    } catch (error) {
      console.error('Error storing correlation results:', error);
    }
  }

  /**
   * Trigger correlation analysis for new RUM data
   */
  private async triggerCorrelationAnalysis(tenantId: string, route: string): Promise<void> {
    try {
      // Run correlation in background - don't block RUM ingestion
      setTimeout(() => {
        this.correlateSyntheticAndRUMData(tenantId, route).catch(error => {
          console.error('Background correlation analysis failed:', error);
        });
      }, 5000); // 5 second delay
    } catch (error) {
      console.error('Failed to trigger correlation analysis:', error);
    }
  }

  /**
   * Update performance baselines
   */
  private async updatePerformanceBaselines(syntheticResults: SyntheticTestResult[]): Promise<void> {
    try {
      for (const result of syntheticResults) {
        // Group by tenant and route (extract from test name or metadata)
        const tenantId = 'default'; // TODO: Extract from test metadata
        const route = '/'; // TODO: Extract from test metadata

        const cacheKey = `${tenantId}:${route}`;
        const existing = this.baselineCache.get(cacheKey);

        // Update baseline with new synthetic test results
        const updatedBaseline: PerformanceBaseline = {
          tenantId,
          route,
          baselineMetrics: existing?.baselineMetrics || {
            lcp: { p50: 0, p75: 0, p90: 0, p95: 0 },
            inp: { p50: 0, p75: 0, p90: 0, p95: 0 },
            cls: { p50: 0, p75: 0, p90: 0, p95: 0 },
            ttfb: { p50: 0, p75: 0, p90: 0, p95: 0 },
          },
          syntheticBaseline: result,
          lastUpdated: Date.now(),
          sampleSize: (existing?.sampleSize || 0) + 1,
        };

        this.baselineCache.set(cacheKey, updatedBaseline);
      }
    } catch (error) {
      console.error('Failed to update performance baselines:', error);
    }
  }

  /**
   * Get performance baseline for a tenant and route
   */
  async getPerformanceBaseline(
    tenantId: string,
    route: string
  ): Promise<PerformanceBaseline | null> {
    const cacheKey = `${tenantId}:${route}`;
    let baseline = this.baselineCache.get(cacheKey);

    if (!baseline) {
      // Try to load from database
      try {
        const { data } = await this.supabase
          .from('performance_baselines')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('route', route)
          .single();

        if (data) {
          baseline = {
            tenantId: data.tenant_id,
            route: data.route,
            baselineMetrics: data.baseline_metrics,
            syntheticBaseline: data.synthetic_baseline,
            lastUpdated: new Date(data.last_updated).getTime(),
            sampleSize: data.sample_size,
          };
          this.baselineCache.set(cacheKey, baseline);
        }
      } catch (error) {
        console.error('Failed to load performance baseline:', error);
      }
    }

    return baseline || null;
  }
}

/**
 * Global RUM integration service instance
 */
export const rumIntegrationService = new RUMIntegrationService();
