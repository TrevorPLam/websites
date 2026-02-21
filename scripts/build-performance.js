#!/usr/bin/env node

/**
 * Simple Build Performance Monitoring
 *
 * Usage: node scripts/build-performance.js
 */

const { execSync } = require('child_process');

function getBuildMetrics() {
  try {
    // Run build with timing
    const start = Date.now();
    const output = execSync('pnpm build', {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const end = Date.now();

    // Parse build output for timing information
    const lines = output.split('\n');
    const timingLine = lines.find((line) => line.includes('✓ Compiled successfully in'));
    const compileTime = timingLine ? timingLine.match(/in (\d+\.\d+)s/)?.[1] : '0';

    // Extract cache information
    const cacheInfo = lines.find((line) => line.includes('Cached:'));
    const cacheStats = cacheInfo
      ? cacheInfo.match(/Cached:\s*(\d+)\s*cached,\s*(\d+)\s*total/)
      : null;

    return {
      totalBuildTime: (end - start) / 1000,
      compileTime: parseFloat(compileTime) || 0,
      cacheHitRate: cacheStats ? (parseInt(cacheStats[1]) / parseInt(cacheStats[2])) * 100 : 0,
      cacheHits: cacheStats ? parseInt(cacheStats[1]) : 0,
      totalTasks: cacheStats ? parseInt(cacheStats[2]) : 0,
    };
  } catch (error) {
    console.error('Error getting build metrics:', error);
    return null;
  }
}

function analyzePerformance(metrics) {
  const recommendations = [];

  if (!metrics) {
    return {
      status: 'ERROR',
      message: 'Failed to collect build metrics',
      recommendations: [],
    };
  }

  // Analyze cache performance
  if (metrics.cacheHitRate < 70) {
    recommendations.push(
      '🚨 Low cache hit rate (<70%). Consider optimizing inputs and dependencies.'
    );
  }

  // Analyze build time
  if (metrics.totalBuildTime > 120) {
    recommendations.push(
      '⏱️ Build time >2min. Enable remote caching and optimize dependency graph.'
    );
  }

  // Analyze compile time
  if (metrics.compileTime > 30) {
    recommendations.push(
      '🐌 Compile time >30s. Consider code splitting and dependency optimization.'
    );
  }

  // Determine overall status
  let status = 'EXCELLENT';
  if (metrics.cacheHitRate < 70 || metrics.totalBuildTime > 120 || metrics.compileTime > 30) {
    status = 'NEEDS_IMPROVEMENT';
  }
  if (metrics.cacheHitRate < 50 || metrics.totalBuildTime > 180 || metrics.compileTime > 45) {
    status = 'POOR';
  }

  return {
    status,
    metrics,
    recommendations,
  };
}

function main() {
  console.log('🔍 Analyzing build performance...\n');

  const metrics = getBuildMetrics();
  const analysis = analyzePerformance(metrics);

  console.log('📊 Build Performance Report');
  console.log('='.repeat(50));

  if (analysis.status === 'ERROR') {
    console.log(`❌ ${analysis.message}`);
    process.exit(1);
  }

  console.log(`📦 Total Build Time: ${analysis.metrics.totalBuildTime.toFixed(2)}s`);
  console.log(`⚡ Compile Time: ${analysis.metrics.compileTime.toFixed(2)}s`);
  console.log(`💾 Cache Hit Rate: ${analysis.metrics.cacheHitRate.toFixed(1)}%`);
  console.log(
    `📋 Cache Stats: ${analysis.metrics.cacheHits}/${analysis.metrics.totalTasks} tasks cached`
  );
  console.log(`📈 Status: ${analysis.status}`);

  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    analysis.recommendations.forEach((rec) => console.log(`  ${rec}`));
  } else {
    console.log('\n✅ Build performance looks great!');
  }

  // Exit with appropriate code
  const exitCode = analysis.status === 'EXCELLENT' ? 0 : 1;
  process.exit(exitCode);
}

// Run if executed directly
if (require.main === module) {
  main();
}
