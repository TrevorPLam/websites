#!/usr/bin/env node

/**
 * Build Performance Monitoring Script
 *
 * Purpose: Track build performance metrics and cache effectiveness
 * Usage: node scripts/ci/report-build-performance.ts
 *
 * Features:
 * - Build timing metrics
 * - Cache hit/miss analysis
 * - Package dependency graph analysis
 * - Performance recommendations
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface BuildMetric {
  package: string;
  task: string;
  duration: number;
  cacheHit: boolean;
  timestamp: string;
}

interface PerformanceReport {
  buildMetrics: BuildMetric[];
  summary: {
    totalBuildTime: number;
    cacheHitRate: number;
    slowestPackage: string;
    fastestPackage: string;
    totalPackages: number;
  };
  recommendations: string[];
}

function parseTurboOutput(): BuildMetric[] {
  try {
    const output = execSync('pnpm build --dry-run=json', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const data = JSON.parse(output);
    const metrics: BuildMetric[] = [];

    for (const [taskId, taskData] of Object.entries(data.tasks)) {
      metrics.push({
        package: taskId.split('#')[0] || taskId,
        task: taskId.split('#')[1] || 'build',
        duration: taskData.duration || 0,
        cacheHit: taskData.cacheHit || false,
        timestamp: new Date().toISOString(),
      });
    }

    return metrics;
  } catch (error) {
    console.error('Error parsing Turbo output:', error);
    return [];
  }
}

function generateSummary(metrics: BuildMetric[]) {
  if (metrics.length === 0) {
    return {
      totalBuildTime: 0,
      cacheHitRate: 0,
      slowestPackage: 'N/A',
      fastestPackage: 'N/A',
      totalPackages: 0,
    };
  }

  const totalBuildTime = metrics.reduce((sum, m) => sum + m.duration, 0);
  const cacheHits = metrics.filter((m) => m.cacheHit).length;
  const cacheHitRate = (cacheHits / metrics.length) * 100;

  const sortedByDuration = metrics.sort((a, b) => b.duration - a.duration);

  return {
    totalBuildTime,
    cacheHitRate,
    slowestPackage: `${sortedByDuration[0].package} (${sortedByDuration[0].duration}ms)`,
    fastestPackage: `${sortedByDuration[sortedByDuration.length - 1].package} (${sortedByDuration[sortedByDuration.length - 1].duration}ms)`,
    totalPackages: metrics.length,
  };
}

function generateRecommendations(metrics: BuildMetric[]): string[] {
  const recommendations: string[] = [];

  // Cache performance recommendations
  const cacheHitRate = (metrics.filter((m) => m.cacheHit).length / metrics.length) * 100;
  if (cacheHitRate < 70) {
    recommendations.push(
      '🚨 Low cache hit rate (<70%). Consider optimizing inputs and dependencies.'
    );
  }

  // Slow package recommendations
  const slowPackages = metrics.filter((m) => m.duration > 5000);
  if (slowPackages.length > 0) {
    recommendations.push(
      `🐌 ${slowPackages.length} packages taking >5s. Consider code splitting or dependency optimization.`
    );
  }

  // Build time recommendations
  const totalBuildTime = metrics.reduce((sum, m) => sum + m.duration, 0);
  if (totalBuildTime > 60000) {
    recommendations.push(
      '⏱️ Total build time >60s. Enable remote caching and optimize dependency graph.'
    );
  }

  // Package-specific recommendations
  const packageTimes = new Map<string, number>();
  metrics.forEach((m) => {
    const current = packageTimes.get(m.package) || 0;
    packageTimes.set(m.package, current + m.duration);
  });

  const sortedPackages = Array.from(packageTimes.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (sortedPackages.length > 0) {
    recommendations.push(
      `📊 Top 3 slowest packages: ${sortedPackages.map(([name, time]) => `${name} (${time}ms)`).join(', ')}`
    );
  }

  return recommendations;
}

function generateReport(): PerformanceReport {
  const metrics = parseTurboOutput();
  const summary = generateSummary(metrics);
  const recommendations = generateRecommendations(metrics);

  return {
    buildMetrics: metrics,
    summary,
    recommendations,
  };
}

function saveReport(report: PerformanceReport) {
  const reportPath = join(process.cwd(), 'build-performance-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Build performance report saved to: ${reportPath}`);
}

function printSummary(report: PerformanceReport) {
  console.log('\n🏗️  Build Performance Report');
  console.log('='.repeat(50));
  console.log(`📦 Total Packages: ${report.summary.totalPackages}`);
  console.log(`⏱️  Total Build Time: ${(report.summary.totalBuildTime / 1000).toFixed(2)}s`);
  console.log(`💾 Cache Hit Rate: ${report.summary.cacheHitRate.toFixed(1)}%`);
  console.log(`🐌 Slowest Package: ${report.summary.slowestPackage}`);
  console.log(`🚀 Fastest Package: ${report.summary.fastestPackage}`);

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach((rec) => console.log(`  ${rec}`));
  } else {
    console.log('\n✅ Build performance looks great!');
  }
}

function checkPerformanceThresholds(report: PerformanceReport): boolean {
  const issues: string[] = [];

  // Cache hit rate threshold
  if (report.summary.cacheHitRate < 70) {
    issues.push(
      `Cache hit rate too low: ${report.summary.cacheHitRate.toFixed(1)}% (target: >70%)`
    );
  }

  // Build time threshold
  if (report.summary.totalBuildTime > 60000) {
    issues.push(
      `Build time too long: ${(report.summary.totalBuildTime / 1000).toFixed(2)}s (target: <60s)`
    );
  }

  // Slow package threshold
  const slowPackages = report.buildMetrics.filter((m) => m.duration > 10000);
  if (slowPackages.length > 0) {
    issues.push(`${slowPackages.length} packages taking >10s`);
  }

  if (issues.length > 0) {
    console.log('\n🚨 Performance Issues Detected:');
    issues.forEach((issue) => console.log(`  ❌ ${issue}`));
    return false;
  }

  return true;
}

// Main execution
function main() {
  console.log('🔍 Analyzing build performance...');

  try {
    const report = generateReport();
    printSummary(report);
    saveReport(report);

    const isHealthy = checkPerformanceThresholds(report);
    process.exit(isHealthy ? 0 : 1);
  } catch (error) {
    console.error('❌ Error generating performance report:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateReport, checkPerformanceThresholds };
