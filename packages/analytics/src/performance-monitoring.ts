/**
 * Performance Monitoring Utilities
 *
 * Integrates with existing Sentry, OpenTelemetry, and Tinybird infrastructure
 * Provides comprehensive performance tracking for multi-tenant SaaS platform
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint (ms)
  fid?: number; // First Input Delay (ms)
  cls?: number; // Cumulative Layout Shift
  inp?: number; // Interaction to Next Paint (ms)
  ttfb?: number; // Time to First Byte (ms)

  // Custom metrics
  routeChangeTime?: number;
  apiResponseTime?: number;
  renderTime?: number;

  // Context
  tenantId?: string;
  userId?: string;
  route?: string;
  userAgent?: string;
  timestamp: number;
}

export interface PerformanceThresholds {
  lcp: number; // 2.5s
  inp: number; // 200ms
  cls: number; // 0.1
  ttfb: number; // 800ms
  fid: number; // 100ms
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500,
  inp: 200,
  cls: 0.1,
  ttfb: 800,
  fid: 100,
};

/**
 * Track Core Web Vitals using web-vitals library
 */
export async function trackCoreWebVitals(
  tenantId: string,
  onMetric?: (metric: PerformanceMetrics) => void
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } = await import('web-vitals');

    const metrics: Partial<PerformanceMetrics> = {
      tenantId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    // Track CLS
    getCLS((metric) => {
      metrics.cls = metric.value;
      if (onMetric) onMetric({ ...metrics, cls: metric.value } as PerformanceMetrics);
    });

    // Track FID (deprecated in favor of INP)
    getFID((metric) => {
      metrics.fid = metric.value;
      if (onMetric) onMetric({ ...metrics, fid: metric.value } as PerformanceMetrics);
    });

    // Track FCP (used for LCP calculation)
    getFCP((metric) => {
      // FCP is tracked but not sent directly
    });

    // Track LCP
    getLCP((metric) => {
      metrics.lcp = metric.value;
      if (onMetric) onMetric({ ...metrics, lcp: metric.value } as PerformanceMetrics);
    });

    // Track TTFB
    getTTFB((metric) => {
      metrics.ttfb = metric.value;
      if (onMetric) onMetric({ ...metrics, ttfb: metric.value } as PerformanceMetrics);
    });

    // Track INP (replaces FID)
    getINP((metric) => {
      metrics.inp = metric.value;
      if (onMetric) onMetric({ ...metrics, inp: metric.value } as PerformanceMetrics);
    });
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
  }
}

/**
 * Measure API response time
 */
export function measureApiResponse<T>(
  apiCall: () => Promise<T>,
  context: { tenantId: string; endpoint: string }
): Promise<T> {
  const startTime = performance.now();

  return apiCall()
    .then((result) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Send to analytics
      sendPerformanceMetric({
        apiResponseTime: responseTime,
        tenantId: context.tenantId,
        route: context.endpoint,
        timestamp: Date.now(),
      } as PerformanceMetrics);

      return result;
    })
    .catch((error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Send error metric
      sendPerformanceMetric({
        apiResponseTime: responseTime,
        tenantId: context.tenantId,
        route: context.endpoint,
        timestamp: Date.now(),
      } as PerformanceMetrics);

      throw error;
    });
}

/**
 * Measure render time for React components
 */
export function measureRenderTime(componentName: string, tenantId: string): () => void {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    sendPerformanceMetric({
      renderTime,
      tenantId,
      route: componentName,
      timestamp: Date.now(),
    } as PerformanceMetrics);
  };
}

/**
 * Check if metrics exceed thresholds
 */
export function checkPerformanceThresholds(
  metrics: PerformanceMetrics,
  thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  if (metrics.lcp && metrics.lcp > thresholds.lcp) {
    violations.push(`LCP: ${metrics.lcp.toFixed(0)}ms > ${thresholds.lcp}ms`);
  }

  if (metrics.inp && metrics.inp > thresholds.inp) {
    violations.push(`INP: ${metrics.inp.toFixed(0)}ms > ${thresholds.inp}ms`);
  }

  if (metrics.cls && metrics.cls > thresholds.cls) {
    violations.push(`CLS: ${metrics.cls.toFixed(3)} > ${thresholds.cls}`);
  }

  if (metrics.ttfb && metrics.ttfb > thresholds.ttfb) {
    violations.push(`TTFB: ${metrics.ttfb.toFixed(0)}ms > ${thresholds.ttfb}ms`);
  }

  if (metrics.fid && metrics.fid > thresholds.fid) {
    violations.push(`FID: ${metrics.fid.toFixed(0)}ms > ${thresholds.fid}ms`);
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Send performance metrics to analytics (Tinybird/Sentry)
 */
function sendPerformanceMetric(metrics: PerformanceMetrics): void {
  // Send to Tinybird for business analytics
  if (typeof window !== 'undefined' && metrics.tenantId) {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    }).catch(() => {
      // Silently fail - don't let performance tracking break the app
    });
  }

  // Send to Sentry for error tracking
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs')
      .then((Sentry) => {
        const { passed, violations } = checkPerformanceThresholds(metrics);

        if (!passed) {
          Sentry.captureMessage('Performance Threshold Violations', {
            level: 'warning',
            extra: {
              metrics,
              violations,
              tenantId: metrics.tenantId,
            },
          });
        }
      })
      .catch(() => {
        // Silently fail
      });
  }
}

/**
 * Performance monitoring hook for React components
 */
export function usePerformanceMonitoring(tenantId: string, componentName: string) {
  if (typeof window === 'undefined') return null;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Start tracking Core Web Vitals
    trackCoreWebVitals(tenantId, (newMetrics) => {
      setMetrics(newMetrics);
    });
  }, [tenantId]);

  const measureRender = useCallback(() => {
    return measureRenderTime(componentName, tenantId);
  }, [componentName, tenantId]);

  return {
    metrics,
    measureRender,
    isHealthy: metrics ? checkPerformanceThresholds(metrics).passed : true,
  };
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(
  metrics: PerformanceMetrics,
  thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
): number {
  if (!metrics) return 100;

  let score = 100;
  const deductions: number[] = [];

  if (metrics.lcp) {
    const lcpScore = Math.max(0, 100 - (metrics.lcp / thresholds.lcp) * 100);
    deductions.push(lcpScore);
  }

  if (metrics.inp) {
    const inpScore = Math.max(0, 100 - (metrics.inp / thresholds.inp) * 100);
    deductions.push(inpScore);
  }

  if (metrics.cls) {
    const clsScore = Math.max(0, 100 - (metrics.cls / thresholds.cls) * 100);
    deductions.push(clsScore);
  }

  if (metrics.ttfb) {
    const ttfbScore = Math.max(0, 100 - (metrics.ttfb / thresholds.ttfb) * 100);
    deductions.push(ttfbScore);
  }

  if (deductions.length > 0) {
    score = deductions.reduce((sum, current) => sum + current, 0) / deductions.length;
  }

  return Math.round(score);
}

// Re-export for convenience
export { DEFAULT_THRESHOLDS as PERFORMANCE_THRESHOLDS };
