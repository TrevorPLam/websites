#!/usr/bin/env node

/**
 * @file scripts/monitoring/correlate-metrics.mjs
 * @summary Synthetic and Real User Monitoring data correlation analysis
 * @description Creates correlation between synthetic tests and real user data with variance analysis
 * @security No sensitive data exposure; metrics aggregated and anonymized
 * @requirements TASK-007.2 / synthetic-rum-correlation / variance-analysis
 * @version 2026.02.26
 */

import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import Table from 'cli-table3';
import { program } from 'commander';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(chalk.red('❌ Missing Supabase configuration'));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Correlation analysis configuration
 */
const CORRELATION_CONFIG = {
  // Time windows for correlation analysis
  timeWindows: {
    short: 300000, // 5 minutes - immediate correlation
    medium: 3600000, // 1 hour - recent correlation
    long: 86400000, // 24 hours - daily correlation
  },

  // Variance thresholds for impact assessment
  varianceThresholds: {
    low: 0.15, // 15% variance - acceptable
    medium: 0.3, // 30% variance - concerning
    high: 0.5, // 50% variance - problematic
    critical: 0.75, // 75% variance - critical issue
  },

  // Performance thresholds for Core Web Vitals
  performanceThresholds: {
    lcp: { good: 2500, needsImprovement: 4000 }, // ms
    inp: { good: 200, needsImprovement: 500 }, // ms
    cls: { good: 0.1, needsImprovement: 0.25 }, // score
    ttfb: { good: 800, needsImprovement: 1800 }, // ms
  },
};

/**
 * Main correlation analysis function
 */
async function performCorrelationAnalysis(options) {
  const { tenantId, route, timeWindow = 'medium', detailed = false } = options;

  console.log(chalk.blue('🔍 Starting RUM-Synthetic Correlation Analysis'));
  console.log(
    chalk.gray(`Tenant: ${tenantId || 'all'}, Route: ${route || 'all'}, Window: ${timeWindow}`)
  );

  try {
    const windowMs = CORRELATION_CONFIG.timeWindows[timeWindow];
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - windowMs);

    // Fetch synthetic test results
    const syntheticData = await fetchSyntheticTests(startTime, endTime, tenantId, route);
    console.log(chalk.green(`📊 Found ${syntheticData.length} synthetic test results`));

    // Fetch RUM metrics
    const rumData = await fetchRUMMetrics(startTime, endTime, tenantId, route);
    console.log(chalk.green(`👥 Found ${rumData.length} RUM sessions`));

    if (syntheticData.length === 0 || rumData.length === 0) {
      console.log(chalk.yellow('⚠️  Insufficient data for correlation analysis'));
      return;
    }

    // Perform correlation analysis
    const correlations = await correlateData(syntheticData, rumData, windowMs);
    console.log(chalk.green(`🔗 Generated ${correlations.length} correlations`));

    // Analyze variance patterns
    const varianceAnalysis = analyzeVariancePatterns(correlations);

    // Generate reports
    if (detailed) {
      generateDetailedReport(correlations, varianceAnalysis);
    } else {
      generateSummaryReport(correlations, varianceAnalysis);
    }

    // Store correlation results
    await storeCorrelationResults(correlations);
    console.log(chalk.green('💾 Correlation results stored successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Correlation analysis failed:'), error.message);
    process.exit(1);
  }
}

/**
 * Fetch synthetic test results from database
 */
async function fetchSyntheticTests(startTime, endTime, tenantId, route) {
  let query = supabase
    .from('synthetic_tests')
    .select('*')
    .eq('environment', 'production')
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', endTime.toISOString())
    .order('timestamp', { ascending: false });

  if (tenantId) {
    // Filter by tenant if test metadata includes tenant info
    query = query.contains('test_name', [tenantId]);
  }

  if (route) {
    // Filter by route if test metadata includes route info
    query = query.contains('test_name', [route]);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch synthetic tests: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch RUM metrics from database
 */
async function fetchRUMMetrics(startTime, endTime, tenantId, route) {
  let query = supabase
    .from('rum_metrics')
    .select('*')
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', endTime.toISOString())
    .order('timestamp', { ascending: false });

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  if (route) {
    query = query.eq('route', route);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch RUM metrics: ${error.message}`);
  }

  return data || [];
}

/**
 * Correlate synthetic test data with RUM metrics
 */
async function correlateData(syntheticData, rumData, windowMs) {
  const correlations = [];

  for (const synthetic of syntheticData) {
    const syntheticTime = new Date(synthetic.timestamp).getTime();

    // Find RUM sessions within the correlation window
    const correlatedRUM = rumData.filter((rum) => {
      const rumTime = new Date(rum.timestamp).getTime();
      return Math.abs(rumTime - syntheticTime) <= windowMs;
    });

    for (const rum of correlatedRUM) {
      const correlation = calculateCorrelation(synthetic, rum);
      correlations.push(correlation);
    }
  }

  return correlations;
}

/**
 * Calculate correlation between synthetic test and RUM session
 */
function calculateCorrelation(synthetic, rum) {
  const lcpVariance = Math.abs(synthetic.lcp - rum.lcp) / synthetic.lcp;
  const inpVariance = Math.abs(synthetic.inp - rum.inp) / synthetic.inp;
  const clsVariance = Math.abs(synthetic.cls - rum.cls) / synthetic.cls;
  const ttfbVariance = Math.abs(synthetic.ttfb - rum.ttfb) / synthetic.ttfb;

  const overallVariance = (lcpVariance + inpVariance + clsVariance + ttfbVariance) / 4;
  const correlationScore = Math.max(0, 1 - overallVariance);

  // Determine impact level
  const thresholds = CORRELATION_CONFIG.varianceThresholds;
  let impactLevel = 'low';
  if (overallVariance >= thresholds.critical) impactLevel = 'critical';
  else if (overallVariance >= thresholds.high) impactLevel = 'high';
  else if (overallVariance >= thresholds.medium) impactLevel = 'medium';

  // Generate recommendations
  const recommendations = generateRecommendations({
    lcpVariance,
    inpVariance,
    clsVariance,
    ttfbVariance,
  });

  return {
    syntheticTestId: synthetic.test_id,
    syntheticTestName: synthetic.test_name,
    rumSessionId: rum.session_id,
    rumUserId: rum.user_id,
    correlationScore: Math.round(correlationScore * 100) / 100,
    varianceAnalysis: {
      lcpVariance: Math.round(lcpVariance * 100) / 100,
      inpVariance: Math.round(inpVariance * 100) / 100,
      clsVariance: Math.round(clsVariance * 100) / 100,
      ttfbVariance: Math.round(ttfbVariance * 100) / 100,
      overallVariance: Math.round(overallVariance * 100) / 100,
    },
    impactLevel,
    recommendations,
    syntheticMetrics: {
      lcp: synthetic.lcp,
      inp: synthetic.inp,
      cls: synthetic.cls,
      ttfb: synthetic.ttfb,
    },
    rumMetrics: {
      lcp: rum.lcp,
      inp: rum.inp,
      cls: rum.cls,
      ttfb: rum.ttfb,
    },
    timestamp: Date.now(),
  };
}

/**
 * Generate recommendations based on variance analysis
 */
function generateRecommendations(variances) {
  const recommendations = [];

  if (variances.lcpVariance > 0.3) {
    recommendations.push(
      '🐌 High LCP variance - investigate real-world network conditions and CDN performance'
    );
  }

  if (variances.inpVariance > 0.3) {
    recommendations.push(
      '⚡ High INP variance - review JavaScript execution and main thread blocking'
    );
  }

  if (variances.clsVariance > 0.3) {
    recommendations.push(
      '📐 High CLS variance - check for dynamic content loading and font rendering'
    );
  }

  if (variances.ttfbVariance > 0.3) {
    recommendations.push(
      '🌐 High TTFB variance - investigate server response times and edge caching'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Synthetic and RUM metrics are well correlated');
  }

  return recommendations;
}

/**
 * Analyze variance patterns across all correlations
 */
function analyzeVariancePatterns(correlations) {
  if (correlations.length === 0) {
    return {
      totalCorrelations: 0,
      averageCorrelationScore: 0,
      varianceDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      topIssues: [],
    };
  }

  const totalCorrelations = correlations.length;
  const averageCorrelationScore =
    correlations.reduce((sum, c) => sum + c.correlationScore, 0) / totalCorrelations;

  // Count variance distribution
  const varianceDistribution = correlations.reduce(
    (acc, c) => {
      acc[c.impactLevel]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0, critical: 0 }
  );

  // Identify top issues
  const topIssues = correlations
    .filter((c) => c.impactLevel === 'high' || c.impactLevel === 'critical')
    .sort((a, b) => b.varianceAnalysis.overallVariance - a.varianceAnalysis.overallVariance)
    .slice(0, 5)
    .map((c) => ({
      testName: c.syntheticTestName,
      variance: c.varianceAnalysis.overallVariance,
      recommendations: c.recommendations,
    }));

  return {
    totalCorrelations,
    averageCorrelationScore: Math.round(averageCorrelationScore * 100) / 100,
    varianceDistribution,
    topIssues,
  };
}

/**
 * Generate summary report
 */
function generateSummaryReport(correlations, varianceAnalysis) {
  console.log('\n' + chalk.bold.blue('📈 Correlation Analysis Summary'));
  console.log(chalk.gray('─'.repeat(50)));

  // Summary table
  const summaryTable = new Table({
    head: ['Metric', 'Value'],
    colWidths: [30, 20],
  });

  summaryTable.push(
    ['Total Correlations', varianceAnalysis.totalCorrelations.toString()],
    ['Avg Correlation Score', varianceAnalysis.averageCorrelationScore.toString()],
    ['Low Variance', varianceAnalysis.varianceDistribution.low.toString()],
    ['Medium Variance', varianceAnalysis.varianceDistribution.medium.toString()],
    ['High Variance', varianceAnalysis.varianceDistribution.high.toString()],
    ['Critical Variance', varianceAnalysis.varianceDistribution.critical.toString()]
  );

  console.log(summaryTable.toString());

  // Top issues
  if (varianceAnalysis.topIssues.length > 0) {
    console.log('\n' + chalk.bold.red('🚨 Top Issues'));
    console.log(chalk.gray('─'.repeat(50)));

    varianceAnalysis.topIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${chalk.bold(issue.testName)}`);
      console.log(`   Variance: ${chalk.red((issue.variance * 100).toFixed(1) + '%')}`);
      issue.recommendations.forEach((rec) => {
        console.log(`   • ${rec}`);
      });
      console.log('');
    });
  } else {
    console.log('\n' + chalk.green('✅ No critical issues detected'));
  }
}

/**
 * Generate detailed report
 */
function generateDetailedReport(correlations, varianceAnalysis) {
  generateSummaryReport(correlations, varianceAnalysis);

  console.log('\n' + chalk.bold.blue('🔍 Detailed Correlation Results'));
  console.log(chalk.gray('─'.repeat(50)));

  // Detailed correlations table
  const detailedTable = new Table({
    head: ['Test', 'Score', 'Variance', 'Impact', 'LCP', 'INP', 'CLS', 'TTFB'],
    colWidths: [20, 8, 10, 8, 8, 8, 8, 8],
  });

  correlations.forEach((correlation) => {
    const impactColor = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      critical: 'red',
    }[correlation.impactLevel];

    detailedTable.push([
      correlation.syntheticTestName.substring(0, 18),
      correlation.correlationScore.toString(),
      (correlation.varianceAnalysis.overallVariance * 100).toFixed(1) + '%',
      chalk[impactColor](correlation.impactLevel.toUpperCase()),
      correlation.syntheticMetrics.lcp.toString(),
      correlation.syntheticMetrics.inp.toString(),
      correlation.syntheticMetrics.cls.toString(),
      correlation.syntheticMetrics.ttfb.toString(),
    ]);
  });

  console.log(detailedTable.toString());
}

/**
 * Store correlation results in database
 */
async function storeCorrelationResults(correlations) {
  try {
    for (const correlation of correlations) {
      await supabase.from('rum_synthetic_correlations').upsert({
        synthetic_test_id: correlation.syntheticTestId,
        rum_session_id: correlation.rumSessionId,
        correlation_score: correlation.correlationScore,
        lcp_variance: correlation.varianceAnalysis.lcpVariance,
        inp_variance: correlation.varianceAnalysis.inpVariance,
        cls_variance: correlation.varianceAnalysis.clsVariance,
        ttfb_variance: correlation.varianceAnalysis.ttfbVariance,
        overall_variance: correlation.varianceAnalysis.overallVariance,
        impact_level: correlation.impactLevel,
        recommendations: correlation.recommendations,
        synthetic_metrics: correlation.syntheticMetrics,
        rum_metrics: correlation.rumMetrics,
        timestamp: new Date(correlation.timestamp).toISOString(),
      });
    }
  } catch (error) {
    console.error(chalk.yellow('⚠️  Failed to store some correlation results:'), error.message);
  }
}

/**
 * CLI configuration
 */
program
  .name('correlate-metrics')
  .description('Correlate synthetic test results with RUM data')
  .option('-t, --tenant-id <id>', 'Filter by tenant ID')
  .option('-r, --route <route>', 'Filter by route')
  .option('-w, --time-window <window>', 'Time window (short, medium, long)', 'medium')
  .option('-d, --detailed', 'Show detailed correlation results')
  .action(performCorrelationAnalysis);

// Parse command line arguments
program.parse();

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}
