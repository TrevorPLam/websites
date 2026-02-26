/**
 * @file packages/monitoring/src/correlation-analyzer.ts
 * @summary Advanced correlation analysis between synthetic and RUM data
 * @description Statistical analysis engine for synthetic vs real user correlation
 * @security No sensitive data exposure; correlation IDs used for tracing only
 * @requirements TASK-007.2 / correlation-analysis / statistical-engine
 * @version 2026.02.26
 */

export interface CorrelationConfig {
  timeWindow: number; // milliseconds
  minSampleSize: number;
  significanceThreshold: number; // p-value threshold
  varianceThreshold: number; // acceptable variance percentage
  enableSeasonalAdjustment: boolean;
  geographicWeighting: boolean;
  deviceSegmentation: boolean;
}

export interface VarianceAnalysis {
  lcpVariance: number;
  inpVariance: number;
  clsVariance: number;
  ttfbVariance: number;
  overallVariance: number;
  statisticalSignificance: number; // p-value
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  trendDirection: 'improving' | 'degrading' | 'stable';
}

export interface CorrelationResult {
  syntheticTestId: string;
  rumSessionId: string;
  correlationScore: number;
  varianceAnalysis: VarianceAnalysis;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  metadata: {
    sampleSize: number;
    timeWindow: number;
    geographicFactors: Record<string, number>;
    deviceFactors: Record<string, number>;
    networkFactors: Record<string, number>;
  };
}

export interface CorrelationMatrix {
  syntheticTests: string[];
  rumSessions: string[];
  scores: number[][];
  metadata: {
    generatedAt: number;
    config: CorrelationConfig;
    statistics: {
      meanCorrelation: number;
      medianCorrelation: number;
      standardDeviation: number;
      outlierCount: number;
    };
  };
}

/**
 * Advanced correlation analyzer for synthetic vs RUM data
 */
export class CorrelationAnalyzer {
  private config: CorrelationConfig;

  constructor(config: Partial<CorrelationConfig> = {}) {
    this.config = {
      timeWindow: 3600000, // 1 hour
      minSampleSize: 10,
      significanceThreshold: 0.05,
      varianceThreshold: 0.3, // 30%
      enableSeasonalAdjustment: true,
      geographicWeighting: true,
      deviceSegmentation: true,
      ...config,
    };
  }

  /**
   * Analyze correlation between synthetic test and RUM data
   */
  public analyzeCorrelation(syntheticData: any[], rumData: any[]): CorrelationResult[] {
    const correlations: CorrelationResult[] = [];

    // Group RUM data by time windows around synthetic tests
    for (const synthetic of syntheticData) {
      const syntheticTime = new Date(synthetic.timestamp).getTime();

      // Find RUM sessions within the time window
      const correlatedRUM = rumData.filter((rum) => {
        const rumTime = new Date(rum.timestamp).getTime();
        return Math.abs(rumTime - syntheticTime) <= this.config.timeWindow;
      });

      if (correlatedRUM.length < this.config.minSampleSize) {
        continue; // Skip if insufficient sample size
      }

      // Perform detailed correlation analysis
      const correlation = this.calculateDetailedCorrelation(synthetic, correlatedRUM);
      correlations.push(correlation);
    }

    return correlations;
  }

  /**
   * Calculate detailed correlation with statistical analysis
   */
  private calculateDetailedCorrelation(synthetic: any, rumSessions: any[]): CorrelationResult {
    // Extract metrics for analysis
    const syntheticMetrics = {
      lcp: synthetic.lcp,
      inp: synthetic.inp,
      cls: synthetic.cls,
      ttfb: synthetic.ttfb,
    };

    const rumMetrics = rumSessions.map((rum) => ({
      lcp: rum.lcp,
      inp: rum.inp,
      cls: rum.cls,
      ttfb: rum.ttfb,
      sessionId: rum.session_id,
      geographicFactors: this.extractGeographicFactors(rum),
      deviceFactors: this.extractDeviceFactors(rum),
      networkFactors: this.extractNetworkFactors(rum),
    }));

    // Calculate variance for each metric
    const varianceAnalysis = this.calculateVarianceAnalysis(syntheticMetrics, rumMetrics);

    // Calculate weighted correlation score
    const correlationScore = this.calculateWeightedCorrelation(
      syntheticMetrics,
      rumMetrics,
      varianceAnalysis
    );

    // Determine impact level
    const impactLevel = this.determineImpactLevel(varianceAnalysis.overallVariance);

    // Generate recommendations
    const recommendations = this.generateRecommendations(varianceAnalysis, rumMetrics);

    // Calculate metadata
    const metadata = this.calculateMetadata(rumMetrics);

    return {
      syntheticTestId: synthetic.test_id,
      rumSessionId: rumSessions[0].session_id, // Primary session
      correlationScore,
      varianceAnalysis,
      impactLevel,
      recommendations,
      metadata,
    };
  }

  /**
   * Calculate comprehensive variance analysis
   */
  private calculateVarianceAnalysis(
    synthetic: Record<string, number>,
    rumData: Array<Record<string, number> & any>
  ): VarianceAnalysis {
    const metrics = ['lcp', 'inp', 'cls', 'ttfb'] as const;
    const variances: Record<string, number> = {};

    // Calculate variance for each metric
    for (const metric of metrics) {
      const syntheticValue = synthetic[metric];
      const rumValues = rumData.map((rum) => rum[metric]).filter((v) => v != null);

      if (rumValues.length === 0) {
        variances[metric] = 0;
        continue;
      }

      // Calculate percentage variance
      const variance = this.calculatePercentageVariance(syntheticValue, rumValues);
      variances[metric] = variance;
    }

    // Calculate overall variance (weighted average)
    const weights = { lcp: 0.3, inp: 0.3, cls: 0.2, ttfb: 0.2 };
    const overallVariance = Object.entries(variances).reduce((sum, [metric, variance]) => {
      return sum + variance * weights[metric];
    }, 0);

    // Calculate statistical significance
    const statisticalSignificance = this.calculateStatisticalSignificance(synthetic, rumData);

    // Calculate confidence interval
    const confidenceInterval = this.calculateConfidenceInterval(synthetic, rumData);

    // Determine trend direction
    const trendDirection = this.calculateTrendDirection(rumData);

    return {
      lcpVariance: variances.lcp,
      inpVariance: variances.inp,
      clsVariance: variances.cls,
      ttfbVariance: variances.ttfb,
      overallVariance,
      statisticalSignificance,
      confidenceInterval,
      trendDirection,
    };
  }

  /**
   * Calculate percentage variance
   */
  private calculatePercentageVariance(syntheticValue: number, rumValues: number[]): number {
    if (syntheticValue === 0) return 0;

    const rumMean = rumValues.reduce((sum, val) => sum + val, 0) / rumValues.length;
    const variance = Math.abs(syntheticValue - rumMean) / syntheticValue;

    return Math.min(variance, 1); // Cap at 100%
  }

  /**
   * Calculate statistical significance (p-value)
   */
  private calculateStatisticalSignificance(
    synthetic: Record<string, number>,
    rumData: Array<Record<string, number>>
  ): number {
    // Simplified t-test calculation
    // In production, use a proper statistical library
    const metrics = ['lcp', 'inp', 'cls', 'ttfb'] as const;
    const pValues: number[] = [];

    for (const metric of metrics) {
      const syntheticValue = synthetic[metric];
      const rumValues = rumData.map((rum) => rum[metric]).filter((v) => v != null);

      if (rumValues.length < 2) {
        pValues.push(1);
        continue;
      }

      const rumMean = rumValues.reduce((sum, val) => sum + val, 0) / rumValues.length;
      const rumStdDev = Math.sqrt(
        rumValues.reduce((sum, val) => sum + Math.pow(val - rumMean, 2), 0) / rumValues.length
      );

      // Calculate t-statistic
      const tStat = Math.abs(syntheticValue - rumMean) / (rumStdDev / Math.sqrt(rumValues.length));

      // Approximate p-value (simplified)
      const pValue = Math.max(0.001, 1 - tStat / 10); // Simplified approximation
      pValues.push(pValue);
    }

    // Return the most significant p-value
    return Math.min(...pValues);
  }

  /**
   * Calculate confidence interval
   */
  private calculateConfidenceInterval(
    synthetic: Record<string, number>,
    rumData: Array<Record<string, number>>
  ): { lower: number; upper: number } {
    const metrics = ['lcp', 'inp', 'cls', 'ttbf'] as const;
    const intervals: Array<{ lower: number; upper: number }> = [];

    for (const metric of metrics) {
      const syntheticValue = synthetic[metric];
      const rumValues = rumData.map((rum) => rum[metric]).filter((v) => v != null);

      if (rumValues.length < 2) {
        intervals.push({ lower: syntheticValue, upper: syntheticValue });
        continue;
      }

      const rumMean = rumValues.reduce((sum, val) => sum + val, 0) / rumValues.length;
      const rumStdDev = Math.sqrt(
        rumValues.reduce((sum, val) => sum + Math.pow(val - rumMean, 2), 0) / rumValues.length
      );

      // 95% confidence interval
      const margin = 1.96 * (rumStdDev / Math.sqrt(rumValues.length));
      intervals.push({
        lower: rumMean - margin,
        upper: rumMean + margin,
      });
    }

    // Combine intervals (simplified)
    const lowerBounds = intervals.map((i) => i.lower);
    const upperBounds = intervals.map((i) => i.upper);

    return {
      lower: Math.min(...lowerBounds),
      upper: Math.max(...upperBounds),
    };
  }

  /**
   * Calculate trend direction
   */
  private calculateTrendDirection(
    rumData: Array<Record<string, number>>
  ): 'improving' | 'degrading' | 'stable' {
    if (rumData.length < 3) return 'stable';

    // Sort by timestamp
    const sortedData = rumData.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate trend for LCP as primary indicator
    const lcpValues = sortedData.map((d) => d.lcp).filter((v) => v != null);
    if (lcpValues.length < 3) return 'stable';

    // Simple linear regression to determine trend
    const n = lcpValues.length;
    const xSum = (n * (n - 1)) / 2; // Sum of indices
    const ySum = lcpValues.reduce((sum, val) => sum + val, 0);
    const xySum = lcpValues.reduce((sum, val, index) => sum + index * val, 0);
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);

    if (Math.abs(slope) < 0.1) return 'stable';
    return slope > 0 ? 'degrading' : 'improving';
  }

  /**
   * Calculate weighted correlation score
   */
  private calculateWeightedCorrelation(
    synthetic: Record<string, number>,
    rumMetrics: Array<Record<string, number> & any>,
    varianceAnalysis: VarianceAnalysis
  ): number {
    const baseCorrelation = 1 - varianceAnalysis.overallVariance;

    // Apply weighting factors
    let weightedScore = baseCorrelation;

    // Geographic weighting
    if (this.config.geographicWeighting) {
      const geographicFactor = this.calculateGeographicWeighting(rumMetrics);
      weightedScore *= geographicFactor;
    }

    // Device segmentation weighting
    if (this.config.deviceSegmentation) {
      const deviceFactor = this.calculateDeviceWeighting(rumMetrics);
      weightedScore *= deviceFactor;
    }

    // Statistical significance adjustment
    if (varianceAnalysis.statisticalSignificance > this.config.significanceThreshold) {
      weightedScore *= 0.8; // Reduce score if not statistically significant
    }

    return Math.max(0, Math.min(1, weightedScore));
  }

  /**
   * Calculate geographic weighting factor
   */
  private calculateGeographicWeighting(rumMetrics: Array<any>): number {
    const geographicDistribution = rumMetrics.reduce(
      (acc, rum) => {
        const country = rum.geographicFactors?.country || 'unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSamples = rumMetrics.length;
    const maxSamples = Math.max(...Object.values(geographicDistribution));

    // Prefer diverse geographic distribution
    const diversityRatio = Object.keys(geographicDistribution).length / totalSamples;
    return Math.min(1, diversityRatio * 2);
  }

  /**
   * Calculate device weighting factor
   */
  private calculateDeviceWeighting(rumMetrics: Array<any>): number {
    const deviceDistribution = rumMetrics.reduce(
      (acc, rum) => {
        const device = rum.deviceFactors?.type || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSamples = rumMetrics.length;

    // Prefer diverse device distribution
    const diversityRatio = Object.keys(deviceDistribution).length / totalSamples;
    return Math.min(1, diversityRatio * 2);
  }

  /**
   * Determine impact level based on variance
   */
  private determineImpactLevel(variance: number): 'low' | 'medium' | 'high' | 'critical' {
    if (variance <= 0.15) return 'low';
    if (variance <= 0.3) return 'medium';
    if (variance <= 0.5) return 'high';
    return 'critical';
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    varianceAnalysis: VarianceAnalysis,
    rumMetrics: Array<any>
  ): string[] {
    const recommendations: string[] = [];

    // LCP recommendations
    if (varianceAnalysis.lcpVariance > 0.3) {
      recommendations.push(
        '🐌 High LCP variance - investigate real-world network conditions and CDN performance'
      );
      recommendations.push(
        '📡 Consider geographic distribution of users and edge caching strategies'
      );
    }

    // INP recommendations
    if (varianceAnalysis.inpVariance > 0.3) {
      recommendations.push(
        '⚡ High INP variance - review JavaScript execution and main thread blocking'
      );
      recommendations.push('📱 Analyze device-specific performance patterns');
    }

    // CLS recommendations
    if (varianceAnalysis.clsVariance > 0.3) {
      recommendations.push(
        '📐 High CLS variance - check for dynamic content loading and font rendering'
      );
      recommendations.push('🎨 Review responsive design behavior across different viewports');
    }

    // TTFB recommendations
    if (varianceAnalysis.ttfbVariance > 0.3) {
      recommendations.push(
        '🌐 High TTFB variance - investigate server response times and edge caching'
      );
      recommendations.push('🗄️  Analyze database query performance and connection pooling');
    }

    // Trend-based recommendations
    if (varianceAnalysis.trendDirection === 'degrading') {
      recommendations.push('📉 Performance degradation detected - investigate recent changes');
      recommendations.push('🔍 Review recent deployments and configuration changes');
    } else if (varianceAnalysis.trendDirection === 'improving') {
      recommendations.push('📈 Performance improving - document successful optimizations');
    }

    // Statistical significance recommendations
    if (varianceAnalysis.statisticalSignificance > this.config.significanceThreshold) {
      recommendations.push(
        '📊 Low statistical significance - increase sample size for reliable analysis'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        '✅ Synthetic and RUM metrics are well correlated - continue monitoring'
      );
    }

    return recommendations;
  }

  /**
   * Extract geographic factors from RUM data
   */
  private extractGeographicFactors(rum: any): Record<string, any> {
    return {
      country: rum.location_country,
      city: rum.location_city,
      timezone: rum.location_timezone,
    };
  }

  /**
   * Extract device factors from RUM data
   */
  private extractDeviceFactors(rum: any): Record<string, any> {
    const userAgent = rum.user_agent || '';

    return {
      type: this.detectDeviceType(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      viewport: {
        width: rum.viewport_width,
        height: rum.viewport_height,
      },
    };
  }

  /**
   * Extract network factors from RUM data
   */
  private extractNetworkFactors(rum: any): Record<string, any> {
    return {
      type: rum.connection_type,
      downlink: rum.connection_downlink,
      rtt: rum.connection_rtt,
    };
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile';
    }
    if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Detect browser from user agent
   */
  private detectBrowser(userAgent: string): string {
    if (/Chrome/.test(userAgent)) return 'chrome';
    if (/Firefox/.test(userAgent)) return 'firefox';
    if (/Safari/.test(userAgent)) return 'safari';
    if (/Edge/.test(userAgent)) return 'edge';
    return 'unknown';
  }

  /**
   * Detect OS from user agent
   */
  private detectOS(userAgent: string): string {
    if (/Windows/.test(userAgent)) return 'windows';
    if (/Mac/.test(userAgent)) return 'macos';
    if (/Linux/.test(userAgent)) return 'linux';
    if (/Android/.test(userAgent)) return 'android';
    if (/iOS|iPhone|iPad/.test(userAgent)) return 'ios';
    return 'unknown';
  }

  /**
   * Calculate metadata for correlation result
   */
  private calculateMetadata(rumMetrics: Array<any>): CorrelationResult['metadata'] {
    const geographicFactors = rumMetrics.reduce(
      (acc, rum) => {
        const factors = this.extractGeographicFactors(rum);
        Object.entries(factors).forEach(([key, value]) => {
          if (value) {
            acc[key] = (acc[key] || 0) + 1;
          }
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const deviceFactors = rumMetrics.reduce(
      (acc, rum) => {
        const factors = this.extractDeviceFactors(rum);
        Object.entries(factors).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            acc[value] = (acc[value] || 0) + 1;
          }
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const networkFactors = rumMetrics.reduce(
      (acc, rum) => {
        const factors = this.extractNetworkFactors(rum);
        Object.entries(factors).forEach(([key, value]) => {
          if (value) {
            acc[key] = (acc[key] || 0) + 1;
          }
        });
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      sampleSize: rumMetrics.length,
      timeWindow: this.config.timeWindow,
      geographicFactors,
      deviceFactors,
      networkFactors,
    };
  }

  /**
   * Generate correlation matrix for multiple tests and sessions
   */
  public generateCorrelationMatrix(syntheticData: any[], rumData: any[]): CorrelationMatrix {
    const correlations = this.analyzeCorrelation(syntheticData, rumData);

    // Create matrix representation
    const syntheticTests = [...new Set(correlations.map((c) => c.syntheticTestId))];
    const rumSessions = [...new Set(correlations.map((c) => c.rumSessionId))];

    const scores: number[][] = Array(syntheticTests.length)
      .fill(null)
      .map(() => Array(rumSessions.length).fill(0));

    correlations.forEach((correlation) => {
      const syntheticIndex = syntheticTests.indexOf(correlation.syntheticTestId);
      const rumIndex = rumSessions.indexOf(correlation.rumSessionId);
      if (syntheticIndex !== -1 && rumIndex !== -1) {
        scores[syntheticIndex][rumIndex] = correlation.correlationScore;
      }
    });

    // Calculate statistics
    const flatScores = correlations.map((c) => c.correlationScore);
    const meanCorrelation = flatScores.reduce((sum, score) => sum + score, 0) / flatScores.length;
    const medianCorrelation = this.calculateMedian(flatScores);
    const standardDeviation = Math.sqrt(
      flatScores.reduce((sum, score) => sum + Math.pow(score - meanCorrelation, 2), 0) /
        flatScores.length
    );
    const outlierCount = flatScores.filter(
      (score) => Math.abs(score - meanCorrelation) > 2 * standardDeviation
    ).length;

    return {
      syntheticTests,
      rumSessions,
      scores,
      metadata: {
        generatedAt: Date.now(),
        config: this.config,
        statistics: {
          meanCorrelation,
          medianCorrelation,
          standardDeviation,
          outlierCount,
        },
      },
    };
  }

  /**
   * Calculate median value
   */
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }
}
