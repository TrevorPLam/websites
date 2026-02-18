/**
 * @file packages/features/src/analytics/lib/analytics-config.ts
 * Purpose: Analytics feature configuration
 */

export type AnalyticsProvider = 'google' | 'plausible' | 'none';

export interface AnalyticsFeatureConfig {
  /** Analytics provider */
  provider?: AnalyticsProvider;
  /** Tracking ID (e.g. GA-4 measurement ID) */
  trackingId?: string;
  /** Whether tracking is enabled */
  enabled?: boolean;
}

export function createAnalyticsConfig(
  overrides: Partial<AnalyticsFeatureConfig> = {}
): AnalyticsFeatureConfig {
  return {
    provider: 'none',
    enabled: false,
    ...overrides,
  };
}
