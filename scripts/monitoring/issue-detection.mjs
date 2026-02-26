#!/usr/bin/env node

/**
 * @file scripts/monitoring/issue-detection.mjs
 * @summary Automated production issue detection with anomaly detection algorithms
 * @description Implements automated detection of production issues with classification and escalation
 * @security No sensitive data exposure; alerts contain anonymized metrics only
 * @requirements TASK-007.4 / automated-issue-detection / anomaly-detection
 * @version 2026.02.26
 */

import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import Table from 'cli-table3';
import { program } from 'commander';
import nodemailer from 'nodemailer';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(chalk.red('❌ Missing Supabase configuration'));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Issue detection configuration
 */
const DETECTION_CONFIG = {
  // Performance thresholds for issue detection
  performanceThresholds: {
    lcp: { warning: 3000, critical: 4000 }, // ms
    inp: { warning: 300, critical: 500 }, // ms
    cls: { warning: 0.2, critical: 0.3 }, // score
    ttfb: { warning: 1200, critical: 2000 }, // ms
    errorRate: { warning: 2, critical: 5 }, // percentage
    correlationScore: { warning: 0.6, critical: 0.4 }, // score
  },

  // Anomaly detection parameters
  anomalyDetection: {
    windowSize: 20, // Number of data points for baseline
    thresholdMultiplier: 2.5, // Standard deviations from mean
    minSampleSize: 10, // Minimum samples for detection
  },

  // Issue classification rules
  classification: {
    performance: {
      patterns: ['lcp', 'inp', 'cls', 'ttfb'],
      severity: 'high',
      autoResolve: false,
    },
    correlation: {
      patterns: ['correlation_score', 'variance'],
      severity: 'medium',
      autoResolve: false,
    },
    availability: {
      patterns: ['uptime', 'health_check'],
      severity: 'critical',
      autoResolve: false,
    },
    user_experience: {
      patterns: ['bounce_rate', 'session_duration'],
      severity: 'medium',
      autoResolve: true,
    },
  },

  // Escalation rules
  escalation: {
    critical: { delay: 300000, channels: ['email', 'slack'] }, // 5 minutes
    high: { delay: 900000, channels: ['email', 'slack'] }, // 15 minutes
    medium: { delay: 1800000, channels: ['email'] }, // 30 minutes
    low: { delay: 3600000, channels: ['email'] }, // 1 hour
  },
};

/**
 * Issue types and descriptions
 */
const ISSUE_TYPES = {
  PERFORMANCE_DEGRADATION: {
    name: 'Performance Degradation',
    description: 'Core Web Vitals exceeding thresholds',
    impact: 'User experience impact',
    recommendations: [
      'Check for recent code deployments',
      'Analyze database query performance',
      'Review CDN and asset delivery',
      'Investigate third-party service issues',
    ],
  },
  CORRELATION_ANOMALY: {
    name: 'Correlation Anomaly',
    description: 'Low correlation between synthetic and RUM metrics',
    impact: 'Synthetic tests not reflecting real user experience',
    recommendations: [
      'Review synthetic test environments',
      'Check network condition differences',
      'Update test scenarios to match real user patterns',
      'Investigate geographic or device-specific issues',
    ],
  },
  ERROR_RATE_SPIKE: {
    name: 'Error Rate Spike',
    description: 'Unusual increase in error rates',
    impact: 'User experience and reliability impact',
    recommendations: [
      'Check recent deployments',
      'Review error logs for patterns',
      'Investigate external service dependencies',
      'Check database connectivity and performance',
    ],
  },
  AVAILABILITY_ISSUE: {
    name: 'Availability Issue',
    description: 'Service availability or health check failures',
    impact: 'Service disruption',
    recommendations: [
      'Check server status and resources',
      'Verify load balancer configuration',
      'Review database connectivity',
      'Check external service dependencies',
    ],
  },
  USER_EXPERIENCE_DECLINE: {
    name: 'User Experience Decline',
    description: 'Decline in user engagement metrics',
    impact: 'User satisfaction and retention impact',
    recommendations: [
      'Analyze user journey and behavior',
      'Check for UI/UX issues',
      'Review content and feature performance',
      'Investigate device or browser-specific issues',
    ],
  },
};

/**
 * Main issue detection function
 */
async function performIssueDetection(options) {
  const { dryRun = false, tenantId, sendAlerts = false } = options;

  console.log(chalk.blue('🔍 Starting Automated Issue Detection'));
  console.log(chalk.gray(`Dry Run: ${dryRun}, Tenant: ${tenantId || 'all'}`));

  try {
    // Fetch monitoring data
    const monitoringData = await fetchMonitoringData(tenantId);
    console.log(chalk.green(`📊 Analyzing ${monitoringData.length} data points`));

    // Detect anomalies
    const anomalies = await detectAnomalies(monitoringData);
    console.log(chalk.yellow(`⚠️  Found ${anomalies.length} potential anomalies`));

    // Classify issues
    const issues = await classifyIssues(anomalies);
    console.log(chalk.red(`🚨 Identified ${issues.length} issues`));

    // Generate recommendations
    const enrichedIssues = await generateRecommendations(issues);

    // Display results
    displayIssueReport(enrichedIssues);

    // Store issues and send alerts
    if (!dryRun) {
      await storeIssues(enrichedIssues);
      console.log(chalk.green('💾 Issues stored successfully'));

      if (sendAlerts) {
        await sendAlerts(enrichedIssues);
        console.log(chalk.green('📧 Alerts sent successfully'));
      }
    }
  } catch (error) {
    console.error(chalk.red('❌ Issue detection failed:'), error.message);
    process.exit(1);
  }
}

/**
 * Fetch monitoring data from database
 */
async function fetchMonitoringData(tenantId) {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

  let query = supabase
    .from('rum_metrics')
    .select('*')
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', endTime.toISOString())
    .order('timestamp', { ascending: true });

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch monitoring data: ${error.message}`);
  }

  return data || [];
}

/**
 * Detect anomalies in monitoring data
 */
async function detectAnomalies(data) {
  const anomalies = [];
  const config = DETECTION_CONFIG.anomalyDetection;

  // Group data by tenant and route for analysis
  const groupedData = data.reduce((acc, point) => {
    const key = `${point.tenant_id}:${point.route}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(point);
    return acc;
  }, {});

  // Analyze each group for anomalies
  for (const [groupKey, groupData] of Object.entries(groupedData)) {
    if (groupData.length < config.minSampleSize) continue;

    const [tenantId, route] = groupKey.split(':');

    // Detect performance anomalies
    const performanceAnomalies = detectPerformanceAnomalies(groupData, config);
    anomalies.push(...performanceAnomalies.map((a) => ({ ...a, tenantId, route })));

    // Detect correlation anomalies
    const correlationAnomalies = detectCorrelationAnomalies(groupData, config);
    anomalies.push(...correlationAnomalies.map((a) => ({ ...a, tenantId, route })));

    // Detect error rate anomalies
    const errorAnomalies = detectErrorRateAnomalies(groupData, config);
    anomalies.push(...errorAnomalies.map((a) => ({ ...a, tenantId, route })));
  }

  return anomalies;
}

/**
 * Detect performance anomalies using statistical analysis
 */
function detectPerformanceAnomalies(data, config) {
  const anomalies = [];
  const thresholds = DETECTION_CONFIG.performanceThresholds;

  // Analyze each performance metric
  ['lcp', 'inp', 'cls', 'ttfb'].forEach((metric) => {
    const values = data.map((d) => d[metric]).filter((v) => v != null);
    if (values.length < config.minSampleSize) return;

    const stats = calculateStatistics(values);
    const threshold = stats.mean + config.thresholdMultiplier * stats.stdDev;

    // Find values exceeding threshold
    values.forEach((value, index) => {
      if (value > threshold) {
        const severity =
          value > thresholds[metric]?.critical
            ? 'critical'
            : value > thresholds[metric]?.warning
              ? 'high'
              : 'medium';

        anomalies.push({
          type: 'PERFORMANCE_DEGRADATION',
          metric,
          value,
          threshold,
          severity,
          timestamp: data[index].timestamp,
          dataPoint: data[index],
        });
      }
    });
  });

  return anomalies;
}

/**
 * Detect correlation anomalies
 */
function detectCorrelationAnomalies(data, config) {
  const anomalies = [];
  const thresholds = DETECTION_CONFIG.performanceThresholds;

  // Look for low correlation scores in recent data
  const recentData = data.slice(-10); // Last 10 data points
  const correlationScores = recentData.map((d) => d.correlation_score).filter((v) => v != null);

  if (correlationScores.length < 5) return anomalies;

  const avgCorrelation =
    correlationScores.reduce((sum, score) => sum + score, 0) / correlationScores.length;

  if (avgCorrelation < thresholds.correlationScore.critical) {
    anomalies.push({
      type: 'CORRELATION_ANOMALY',
      metric: 'correlation_score',
      value: avgCorrelation,
      threshold: thresholds.correlationScore.critical,
      severity: 'critical',
      timestamp: recentData[recentData.length - 1].timestamp,
      dataPoint: recentData[recentData.length - 1],
    });
  } else if (avgCorrelation < thresholds.correlationScore.warning) {
    anomalies.push({
      type: 'CORRELATION_ANOMALY',
      metric: 'correlation_score',
      value: avgCorrelation,
      threshold: thresholds.correlationScore.warning,
      severity: 'medium',
      timestamp: recentData[recentData.length - 1].timestamp,
      dataPoint: recentData[recentData.length - 1],
    });
  }

  return anomalies;
}

/**
 * Detect error rate anomalies
 */
function detectErrorRateAnomalies(data, config) {
  const anomalies = [];
  const thresholds = DETECTION_CONFIG.performanceThresholds;

  // Calculate error rates (assuming error_count field exists)
  const errorRates = data.map((d) => {
    const totalRequests = d.session_count || 100; // Default if not available
    const errorCount = d.error_count || 0;
    return (errorCount / totalRequests) * 100;
  });

  if (errorRates.length < config.minSampleSize) return anomalies;

  const stats = calculateStatistics(errorRates);
  const threshold = stats.mean + config.thresholdMultiplier * stats.stdDev;

  errorRates.forEach((rate, index) => {
    if (rate > threshold) {
      const severity =
        rate > thresholds.errorRate.critical
          ? 'critical'
          : rate > thresholds.errorRate.warning
            ? 'high'
            : 'medium';

      anomalies.push({
        type: 'ERROR_RATE_SPIKE',
        metric: 'error_rate',
        value: rate,
        threshold,
        severity,
        timestamp: data[index].timestamp,
        dataPoint: data[index],
      });
    }
  });

  return anomalies;
}

/**
 * Calculate statistics for anomaly detection
 */
function calculateStatistics(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev, variance };
}

/**
 * Classify detected issues
 */
async function classifyIssues(anomalies) {
  const issues = [];

  for (const anomaly of anomalies) {
    const issueType = ISSUE_TYPES[anomaly.type];
    const classification =
      DETECTION_CONFIG.classification[anomaly.type.toLowerCase().replace('_degradation', '')];

    if (!issueType || !classification) continue;

    const issue = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: anomaly.type,
      name: issueType.name,
      description: issueType.description,
      impact: issueType.impact,
      severity: anomaly.severity,
      metric: anomaly.metric,
      value: anomaly.value,
      threshold: anomaly.threshold,
      tenantId: anomaly.tenantId,
      route: anomaly.route,
      timestamp: anomaly.timestamp,
      dataPoint: anomaly.dataPoint,
      autoResolve: classification.autoResolve,
      recommendations: issueType.recommendations,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    issues.push(issue);
  }

  return issues;
}

/**
 * Generate additional recommendations based on issue context
 */
async function generateRecommendations(issues) {
  return issues.map((issue) => {
    const enhancedRecommendations = [...issue.recommendations];

    // Add context-specific recommendations
    if (issue.metric === 'lcp') {
      enhancedRecommendations.push('Optimize image loading and compression');
      enhancedRecommendations.push('Implement resource hints (preload, prefetch)');
    } else if (issue.metric === 'inp') {
      enhancedRecommendations.push('Reduce JavaScript execution time');
      enhancedRecommendations.push('Implement code splitting and lazy loading');
    } else if (issue.metric === 'cls') {
      enhancedRecommendations.push('Reserve space for dynamic content');
      enhancedRecommendations.push('Implement font loading strategies');
    } else if (issue.metric === 'ttfb') {
      enhancedRecommendations.push('Optimize server response time');
      enhancedRecommendations.push('Implement edge caching');
    }

    return {
      ...issue,
      recommendations: enhancedRecommendations,
    };
  });
}

/**
 * Display issue detection report
 */
function displayIssueReport(issues) {
  console.log('\n' + chalk.bold.blue('🚨 Issue Detection Report'));
  console.log(chalk.gray('─'.repeat(80)));

  if (issues.length === 0) {
    console.log(chalk.green('✅ No issues detected'));
    return;
  }

  // Summary table
  const summaryTable = new Table({
    head: ['Severity', 'Count', 'Percentage'],
    colWidths: [15, 10, 15],
  });

  const severityCounts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  Object.entries(severityCounts).forEach(([severity, count]) => {
    const percentage = ((count / issues.length) * 100).toFixed(1);
    summaryTable.push([severity.toUpperCase(), count.toString(), `${percentage}%`]);
  });

  console.log(summaryTable.toString());

  // Detailed issues
  console.log('\n' + chalk.bold('📋 Detailed Issues'));
  console.log(chalk.gray('─'.repeat(80)));

  const detailTable = new Table({
    head: ['Type', 'Severity', 'Metric', 'Value', 'Threshold', 'Tenant', 'Route'],
    colWidths: [20, 10, 8, 10, 10, 15, 15],
  });

  issues.forEach((issue) => {
    const severityColor = {
      critical: 'red',
      high: 'yellow',
      medium: 'blue',
      low: 'green',
    }[issue.severity];

    detailTable.push([
      issue.name.substring(0, 18),
      chalk[severityColor](issue.severity.toUpperCase()),
      issue.metric.toUpperCase(),
      issue.value.toFixed(2),
      issue.threshold.toFixed(2),
      issue.tenantId?.substring(0, 12) || 'N/A',
      issue.route?.substring(0, 12) || 'N/A',
    ]);
  });

  console.log(detailTable.toString());

  // Recommendations summary
  console.log('\n' + chalk.bold('💡 Top Recommendations'));
  console.log(chalk.gray('─'.repeat(80)));

  const allRecommendations = issues.flatMap((issue) => issue.recommendations);
  const recommendationCounts = allRecommendations.reduce((acc, rec) => {
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, {});

  const topRecommendations = Object.entries(recommendationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  topRecommendations.forEach(([recommendation, count], index) => {
    console.log(`${index + 1}. ${recommendation} (${count} issues)`);
  });
}

/**
 * Store issues in database
 */
async function storeIssues(issues) {
  try {
    for (const issue of issues) {
      await supabase.from('production_issues').upsert({
        id: issue.id,
        type: issue.type,
        name: issue.name,
        description: issue.description,
        impact: issue.impact,
        severity: issue.severity,
        metric: issue.metric,
        value: issue.value,
        threshold: issue.threshold,
        tenant_id: issue.tenantId,
        route: issue.route,
        timestamp: issue.timestamp,
        data_point: issue.dataPoint,
        auto_resolve: issue.autoResolve,
        recommendations: issue.recommendations,
        status: issue.status,
        created_at: issue.createdAt,
      });
    }
  } catch (error) {
    console.error(chalk.yellow('⚠️  Failed to store some issues:'), error.message);
  }
}

/**
 * Send alerts for detected issues
 */
async function sendAlerts(issues) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(chalk.yellow('⚠️  SMTP not configured, skipping email alerts'));
    return;
  }

  const criticalIssues = issues.filter((issue) => issue.severity === 'critical');
  const highIssues = issues.filter((issue) => issue.severity === 'high');

  if (criticalIssues.length === 0 && highIssues.length === 0) {
    console.log(chalk.green('✅ No critical or high severity issues to alert'));
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const alertContent = generateAlertEmail(criticalIssues.concat(highIssues));

    await transporter.sendMail({
      from: process.env.ALERT_FROM_EMAIL || 'alerts@yourplatform.com',
      to: process.env.ALERT_TO_EMAIL || 'oncall@yourplatform.com',
      subject: `🚨 Production Issues Detected - ${criticalIssues.length} Critical, ${highIssues.length} High`,
      html: alertContent,
    });
  } catch (error) {
    console.error(chalk.red('❌ Failed to send email alerts:'), error.message);
  }
}

/**
 * Generate HTML email content for alerts
 */
function generateAlertEmail(issues) {
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const highIssues = issues.filter((i) => i.severity === 'high');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { color: #dc2626; text-align: center; margin-bottom: 30px; }
        .issue { margin: 20px 0; padding: 15px; border-left: 4px solid #dc2626; background: #fef2f2; }
        .high-issue { border-left-color: #f59e0b; background: #fffbeb; }
        .severity { font-weight: bold; text-transform: uppercase; }
        .recommendations { margin-top: 10px; }
        .recommendations ul { margin: 5px 0; padding-left: 20px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Production Issues Detected</h1>
          <p>${criticalIssues.length} Critical, ${highIssues.length} High Severity Issues</p>
        </div>

        ${criticalIssues
          .map(
            (issue) => `
          <div class="issue">
            <h3>${issue.name}</h3>
            <p><strong>Severity:</strong> <span class="severity">${issue.severity}</span></p>
            <p><strong>Metric:</strong> ${issue.metric.toUpperCase()} = ${issue.value.toFixed(2)} (threshold: ${issue.threshold.toFixed(2)})</p>
            <p><strong>Tenant:</strong> ${issue.tenantId || 'N/A'}</p>
            <p><strong>Route:</strong> ${issue.route || 'N/A'}</p>
            <p><strong>Description:</strong> ${issue.description}</p>
            <div class="recommendations">
              <strong>Recommendations:</strong>
              <ul>
                ${issue.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          </div>
        `
          )
          .join('')}

        ${highIssues
          .map(
            (issue) => `
          <div class="issue high-issue">
            <h3>${issue.name}</h3>
            <p><strong>Severity:</strong> <span class="severity">${issue.severity}</span></p>
            <p><strong>Metric:</strong> ${issue.metric.toUpperCase()} = ${issue.value.toFixed(2)} (threshold: ${issue.threshold.toFixed(2)})</p>
            <p><strong>Tenant:</strong> ${issue.tenantId || 'N/A'}</p>
            <p><strong>Route:</strong> ${issue.route || 'N/A'}</p>
            <p><strong>Description:</strong> ${issue.description}</p>
            <div class="recommendations">
              <strong>Recommendations:</strong>
              <ul>
                ${issue.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          </div>
        `
          )
          .join('')}

        <div class="footer">
          <p>This alert was generated automatically by the Production Issue Detection System</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * CLI configuration
 */
program
  .name('issue-detection')
  .description('Automated production issue detection with anomaly detection')
  .option('-t, --tenant-id <id>', 'Filter by tenant ID')
  .option('-d, --dry-run', 'Run detection without storing issues or sending alerts')
  .option('-s, --send-alerts', 'Send email alerts for critical issues')
  .action(performIssueDetection);

// Parse command line arguments
program.parse();

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}
