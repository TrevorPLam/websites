#!/usr/bin/env node

/**
 * @file scripts/performance/performance-alerts.mjs
 * @summary Performance Regression Alerts System for Marketing Websites
 * @description Automated performance monitoring with regression detection and alerting
 * @version 1.0.0
 * @author Performance Team
 * @security None - Monitoring script only
 * @requirements TASK-003-4, Performance Budgets Configuration
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../..');

// Load performance budgets
const budgetsPath = join(repoRoot, 'config/performance-budgets.json');
const budgets = JSON.parse(readFileSync(budgetsPath, 'utf8'));

// Load baseline performance data
const baselinePath = join(repoRoot, '.monitoring/content-baseline.txt');
let baselineData = {};

if (existsSync(baselinePath)) {
  try {
    const baselineContent = readFileSync(baselinePath, 'utf8');
    // Try to parse as JSON first, otherwise use empty object
    if (baselineContent.trim().startsWith('{')) {
      baselineData = JSON.parse(baselineContent);
    } else {
      // File is not JSON format, create empty baseline
      baselineData = {};
    }
  } catch (error) {
    console.warn('Warning: Could not parse baseline file, using empty baseline');
    baselineData = {};
  }
}

class PerformanceAlerts {
  constructor() {
    this.alerts = [];
    this.thresholds = budgets.monitoring.alerting;
    this.currentMetrics = {};
    this.baselineMetrics = baselineData;
  }

  /**
   * Analyze current performance metrics against baseline
   */
  analyzePerformance(currentMetrics) {
    this.currentMetrics = currentMetrics;
    this.alerts = [];

    // Check Core Web Vitals regressions
    this.checkCoreWebVitalsRegressions();

    // Check bundle size increases
    this.checkBundleSizeRegressions();

    // Check Lighthouse score drops
    this.checkLighthouseScoreRegressions();

    return this.alerts;
  }

  /**
   * Check Core Web Vitals for regressions
   */
  checkCoreWebVitalsRegressions() {
    const coreMetrics = ['lcp', 'inp', 'cls', 'fcp', 'tbt', 'speedIndex'];

    for (const metric of coreMetrics) {
      const current = this.currentMetrics[metric];
      const baseline = this.baselineMetrics[metric];

      if (!current || !baseline) continue;

      const regression = this.calculateRegression(current, baseline);
      const threshold = this.thresholds.performanceRegression.threshold;

      if (regression > threshold) {
        this.alerts.push({
          type: 'performance_regression',
          severity: this.thresholds.performanceRegression.severity,
          metric: metric.toUpperCase(),
          current: current,
          baseline: baseline,
          regression: `${(regression * 100).toFixed(1)}%`,
          threshold: `${(threshold * 100).toFixed(1)}%`,
          recommendation: this.getMetricRecommendation(metric),
          urgency: regression > 0.2 ? 'critical' : 'warning',
        });
      }
    }
  }

  /**
   * Check bundle size increases
   */
  checkBundleSizeRegressions() {
    const bundleMetrics = this.currentMetrics.bundles || {};
    const baselineBundles = this.baselineMetrics.bundles || {};

    for (const [bundleName, currentSize] of Object.entries(bundleMetrics)) {
      const baselineSize = baselineBundles[bundleName];
      if (!baselineSize) continue;

      const regression = this.calculateRegression(currentSize, baselineSize);
      const threshold = this.thresholds.bundleSizeIncrease.threshold;

      if (regression > threshold) {
        this.alerts.push({
          type: 'bundle_size_increase',
          severity: this.thresholds.bundleSizeIncrease.severity,
          bundle: bundleName,
          current: `${(currentSize / 1024).toFixed(1)} kB`,
          baseline: `${(baselineSize / 1024).toFixed(1)} kB`,
          regression: `${(regression * 100).toFixed(1)}%`,
          threshold: `${(threshold * 100).toFixed(1)}%`,
          recommendation: 'Review bundle analysis and optimize imports',
          urgency: regression > 0.25 ? 'critical' : 'warning',
        });
      }
    }
  }

  /**
   * Check Lighthouse score drops
   */
  checkLighthouseScoreRegressions() {
    const categories = ['performance', 'accessibility', 'bestPractices', 'seo'];

    for (const category of categories) {
      const current = this.currentMetrics.lighthouse?.[category];
      const baseline = this.baselineMetrics.lighthouse?.[category];

      if (!current || !baseline) continue;

      const drop = baseline - current;
      const threshold = 0.05; // 5% drop threshold

      if (drop > threshold) {
        this.alerts.push({
          type: 'lighthouse_score_drop',
          severity: 'warning',
          category: category,
          current: current,
          baseline: baseline,
          drop: `${(drop * 100).toFixed(1)}%`,
          threshold: `${(threshold * 100).toFixed(1)}%`,
          recommendation: `Review ${category} audit findings and address issues`,
          urgency: drop > 0.1 ? 'critical' : 'warning',
        });
      }
    }
  }

  /**
   * Calculate regression percentage
   */
  calculateRegression(current, baseline) {
    return Math.max(0, (current - baseline) / baseline);
  }

  /**
   * Get metric-specific recommendations
   */
  getMetricRecommendation(metric) {
    const recommendations = {
      lcp: 'Optimize loading performance: image optimization, font loading, server response time',
      inp: 'Reduce JavaScript execution time, optimize event handlers, minimize main thread work',
      cls: 'Ensure proper image dimensions, avoid content shifts, use CSS aspect ratios',
      fcp: 'Improve server response time, optimize critical resources, enable compression',
      tbt: 'Reduce JavaScript execution time, optimize long tasks, use code splitting',
      speedIndex: 'Optimize above-the-fold content, improve perceived performance',
    };

    return recommendations[metric] || 'Review performance optimization best practices';
  }

  /**
   * Generate alert report
   */
  generateReport() {
    if (this.alerts.length === 0) {
      return {
        status: 'success',
        message: 'No performance regressions detected',
        timestamp: new Date().toISOString(),
        alerts: [],
      };
    }

    const criticalAlerts = this.alerts.filter((a) => a.urgency === 'critical');
    const warningAlerts = this.alerts.filter((a) => a.urgency === 'warning');

    return {
      status: 'alert',
      message: `${this.alerts.length} performance regressions detected`,
      timestamp: new Date().toISOString(),
      summary: {
        total: this.alerts.length,
        critical: criticalAlerts.length,
        warnings: warningAlerts.length,
      },
      alerts: this.alerts.sort((a, b) => {
        const urgencyOrder = { critical: 3, warning: 2, info: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }),
    };
  }

  /**
   * Send alerts to configured channels
   */
  async sendAlerts(report) {
    if (report.status === 'success') return;

    const channels = budgets.monitoring.reporting.channels;

    for (const channel of channels) {
      try {
        await this.sendToChannel(channel, report);
      } catch (error) {
        console.error(`Failed to send alert to ${channel}:`, error);
      }
    }
  }

  /**
   * Send alert to specific channel
   */
  async sendToChannel(channel, report) {
    const message = this.formatAlertMessage(report);

    switch (channel) {
      case 'slack':
        // Integration with Slack webhook
        console.log('🚨 SLACK ALERT:', message);
        break;
      case 'email':
        // Integration with email service
        console.log('📧 EMAIL ALERT:', message);
        break;
      case 'dashboard':
        // Update performance dashboard
        console.log('📊 DASHBOARD UPDATE:', message);
        break;
      default:
        console.log(`📢 ${channel.toUpperCase()} ALERT:`, message);
    }
  }

  /**
   * Format alert message
   */
  formatAlertMessage(report) {
    const { summary, alerts } = report;

    let message = `🚨 Performance Regression Alert\n`;
    message += `📊 Summary: ${summary.total} regressions (${summary.critical} critical, ${summary.warnings} warnings)\n`;
    message += `⏰ Time: ${new Date().toLocaleString()}\n\n`;

    for (const alert of alerts.slice(0, 5)) {
      // Limit to top 5 alerts
      message += `🔴 ${alert.type.replace('_', ' ').toUpperCase()}\n`;
      message += `   Metric: ${alert.metric || alert.bundle || alert.category}\n`;
      message += `   Current: ${alert.current}\n`;
      message += `   Baseline: ${alert.baseline}\n`;
      message += `   Regression: ${alert.regression || alert.drop}\n`;
      message += `   Recommendation: ${alert.recommendation}\n\n`;
    }

    if (alerts.length > 5) {
      message += `... and ${alerts.length - 5} more alerts\n`;
    }

    return message;
  }

  /**
   * Update baseline with current metrics
   */
  updateBaseline() {
    const updatedBaseline = {
      ...this.baselineMetrics,
      ...this.currentMetrics,
      lastUpdated: new Date().toISOString(),
    };

    writeFileSync(baselinePath, JSON.stringify(updatedBaseline, null, 2));
    console.log('✅ Performance baseline updated');
  }
}

// CLI interface
async function main() {
  console.log('🚀 Performance Alerts System Starting...');

  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  console.log(`📋 Command: ${command}`);

  const alerts = new PerformanceAlerts();

  switch (command) {
    case 'check':
      console.log('🔍 Checking performance metrics...');
      // Simulate current metrics (in real implementation, this would come from Lighthouse CI)
      const mockMetrics = {
        lcp: 2400,
        inp: 180,
        cls: 0.08,
        fcp: 1600,
        tbt: 180,
        speedIndex: 3200,
        lighthouse: {
          performance: 0.88,
          accessibility: 0.96,
          bestPractices: 0.92,
          seo: 0.94,
        },
        bundles: {
          homepage: 92160,
          framework: 153600,
          vendor: 102400,
        },
      };

      const report = alerts.analyzePerformance(mockMetrics);
      console.log('📊 Performance Report:');
      console.log(JSON.stringify(report, null, 2));

      if (report.status === 'alert') {
        await alerts.sendAlerts(report);
        process.exit(1); // Exit with error code for CI/CD
      }
      break;

    case 'update-baseline':
      console.log('📝 Updating performance baseline...');
      alerts.updateBaseline();
      break;

    case 'simulate-alert':
      console.log('🧪 Simulating Performance Regression Alert...\n');
      // Set baseline metrics for testing
      alerts.baselineMetrics = {
        lcp: 2500,
        inp: 180,
        cls: 0.1,
        fcp: 1800,
        tbt: 200,
        speedIndex: 3400,
        bundles: {
          homepage: 92160,
        },
      };

      // Simulate a regression for testing
      const regressionMetrics = {
        lcp: 3200, // 28% increase
        inp: 280, // 56% increase
        cls: 0.15, // 50% increase
        bundles: {
          homepage: 115200, // 25% increase
        },
      };

      const regressionReport = alerts.analyzePerformance(regressionMetrics);
      console.log('🚨 SIMULATED REGRESSION REPORT:');
      console.log(JSON.stringify(regressionReport, null, 2));
      break;

    default:
      console.log('Usage: node performance-alerts.mjs [check|update-baseline|simulate-alert]');
      process.exit(1);
  }
}

// Run main function
main().catch(console.error);

export default PerformanceAlerts;
