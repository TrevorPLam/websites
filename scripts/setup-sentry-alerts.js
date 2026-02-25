#!/usr/bin/env node

/**
 * @file scripts/setup-sentry-alerts.js
 * @role script
 * @summary Automated Sentry alert rule configuration
 * @exports CLI: pnpm setup-sentry-alerts
 * @security Requires SENTRY_AUTH_TOKEN environment variable
 * @description Configure production alert rules in Sentry via API
 * @requirements PROD-007 / observability / sentry-alerts
 */

const https = require('https');
const http = require('http');

// Configuration
const SENTRY_API_BASE = 'https://sentry.io/api/0';
const ORG_SLUG = process.env.SENTRY_ORG_SLUG;
const PROJECT_SLUGS = process.env.SENTRY_PROJECT_SLUGS?.split(',') || ['web', 'portal', 'admin'];
const AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('❌ SENTRY_AUTH_TOKEN environment variable required');
  process.exit(1);
}

if (!ORG_SLUG) {
  console.error('❌ SENTRY_ORG_SLUG environment variable required');
  process.exit(1);
}

/**
 * Make HTTP request to Sentry API
 */
async function sentryRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${SENTRY_API_BASE}${endpoint}`;
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.detail || parsed.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Alert rule definitions
 */
const alertRules = [
  {
    name: 'P0 - Platform Outage',
    dataset: 'error',
    query: 'error.rate > 10',
    timeWindow: '5m',
    environment: 'production',
    thresholdType: 'count',
    triggerType: 'count',
    thresholdValue: 10,
    aggregation: 'count()',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'critical',
    description: 'Platform-wide outage affecting multiple services',
  },
  {
    name: 'P0 - Database Connection Failure',
    dataset: 'error',
    query: 'error.message:"connection" AND error.count > 5',
    timeWindow: '2m',
    environment: 'production',
    thresholdType: 'count',
    triggerType: 'count',
    thresholdValue: 5,
    aggregation: 'count()',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'critical',
    description: 'Database connectivity issues',
  },
  {
    name: 'P0 - Authentication System Failure',
    dataset: 'error',
    query: 'transaction:auth OR url:/api/auth/*',
    timeWindow: '3m',
    environment: 'production',
    thresholdType: 'percentage',
    triggerType: 'percentage',
    thresholdValue: 5,
    aggregation: 'percentage(errors)',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'critical',
    description: 'Authentication service degradation',
  },
  {
    name: 'P0 - Payment Processing Failure',
    dataset: 'error',
    query: 'transaction:payment OR url:/api/stripe/* OR tags:payment_failure',
    timeWindow: '2m',
    environment: 'production',
    thresholdType: 'percentage',
    triggerType: 'percentage',
    thresholdValue: 1,
    aggregation: 'percentage(errors)',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'critical',
    description: 'Payment processing issues affecting revenue',
  },
  {
    name: 'P1 - Performance Degradation',
    dataset: 'transaction',
    query: 'transaction.duration > 3000',
    timeWindow: '10m',
    environment: 'production',
    thresholdType: 'percentage',
    triggerType: 'percentage',
    thresholdValue: 10,
    aggregation: 'percentage(transaction.duration > 3000)',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'warning',
    description: 'Performance degradation affecting user experience',
  },
  {
    name: 'P1 - Critical Page Errors',
    dataset: 'error',
    query: 'url:/checkout OR url:/dashboard OR url:/admin/*',
    timeWindow: '5m',
    environment: 'production',
    thresholdType: 'percentage',
    triggerType: 'percentage',
    thresholdValue: 2,
    aggregation: 'percentage(errors)',
    projects: PROJECT_SLUGS,
    owner: 'oncall',
    alertType: 'warning',
    description: 'Errors on critical business pages',
  },
  {
    name: 'P2 - Elevated Error Rate',
    dataset: 'error',
    query: '!tags:ignore',
    timeWindow: '15m',
    environment: 'production',
    thresholdType: 'percentage',
    triggerType: 'percentage',
    thresholdValue: 1,
    aggregation: 'percentage(errors)',
    projects: PROJECT_SLUGS,
    owner: 'team-lead',
    alertType: 'info',
    description: 'Elevated error rate requiring attention',
  },
];

/**
 * Notification channel configurations
 */
const notificationChannels = [
  {
    type: 'slack',
    name: 'alerts-critical',
    integrationId: process.env.SENTRY_SLACK_CRITICAL_INTEGRATION_ID,
    channel: '#alerts-critical',
    mention: ['here'],
  },
  {
    type: 'slack',
    name: 'alerts-performance',
    integrationId: process.env.SENTRY_SLACK_PERFORMANCE_INTEGRATION_ID,
    channel: '#alerts-performance',
    mention: ['here'],
  },
  {
    type: 'slack',
    name: 'alerts-errors',
    integrationId: process.env.SENTRY_SLACK_ERRORS_INTEGRATION_ID,
    channel: '#alerts-errors',
    mention: ['here'],
  },
  {
    type: 'email',
    name: 'oncall-email',
    addresses: ['oncall@youragency.com'],
  },
];

/**
 * Get existing alert rules
 */
async function getExistingAlertRules(projectSlug) {
  try {
    const response = await sentryRequest(
      'GET',
      `/projects/${ORG_SLUG}/${projectSlug}/alert-rules/`
    );
    return response;
  } catch (error) {
    console.warn(`⚠️  Could not fetch existing rules for ${projectSlug}: ${error.message}`);
    return [];
  }
}

/**
 * Create or update alert rule
 */
async function createAlertRule(projectSlug, ruleConfig) {
  try {
    // Check if rule already exists
    const existingRules = await getExistingAlertRules(projectSlug);
    const existingRule = existingRules.find((rule) => rule.name === ruleConfig.name);

    if (existingRule) {
      console.log(`📝 Updating existing rule: ${ruleConfig.name} in ${projectSlug}`);
      const endpoint = `/projects/${ORG_SLUG}/${projectSlug}/alert-rules/${existingRule.id}/`;
      return await sentryRequest('PUT', endpoint, ruleConfig);
    } else {
      console.log(`➕ Creating new rule: ${ruleConfig.name} in ${projectSlug}`);
      const endpoint = `/projects/${ORG_SLUG}/${projectSlug}/alert-rules/`;
      return await sentryRequest('POST', endpoint, ruleConfig);
    }
  } catch (error) {
    console.error(`❌ Failed to create rule ${ruleConfig.name}: ${error.message}`);
    throw error;
  }
}

/**
 * Get existing notification channels
 */
async function getExistingNotificationChannels() {
  try {
    const response = await sentryRequest('GET', `/organizations/${ORG_SLUG}/notification-actions/`);
    return response;
  } catch (error) {
    console.warn(`⚠️  Could not fetch notification channels: ${error.message}`);
    return [];
  }
}

/**
 * Create notification channel
 */
async function createNotificationChannel(channelConfig) {
  try {
    const existingChannels = await getExistingNotificationChannels();
    const existingChannel = existingChannels.find((channel) => channel.name === channelConfig.name);

    if (existingChannel) {
      console.log(`📝 Notification channel already exists: ${channelConfig.name}`);
      return existingChannel;
    } else {
      console.log(`➕ Creating notification channel: ${channelConfig.name}`);
      const endpoint = `/organizations/${ORG_SLUG}/notification-actions/`;
      return await sentryRequest('POST', endpoint, channelConfig);
    }
  } catch (error) {
    console.error(`❌ Failed to create channel ${channelConfig.name}: ${error.message}`);
    throw error;
  }
}

/**
 * Link alert rule to notification channels
 */
async function linkAlertToNotifications(ruleId, alertType) {
  try {
    const channels = await getExistingNotificationChannels();
    const targetChannels = channels.filter((channel) => {
      if (alertType === 'critical') {
        return channel.name === 'alerts-critical' || channel.name === 'oncall-email';
      } else if (alertType === 'warning') {
        return channel.name === 'alerts-performance' || channel.name === 'alerts-errors';
      } else {
        return channel.name === 'alerts-errors';
      }
    });

    for (const channel of targetChannels) {
      console.log(`🔗 Linking rule ${ruleId} to channel ${channel.name}`);
      const endpoint = `/organizations/${ORG_SLUG}/alert-rules/${ruleId}/triggers/`;
      await sentryRequest('POST', endpoint, {
        alertRuleId: ruleId,
        actionId: channel.id,
      });
    }
  } catch (error) {
    console.warn(`⚠️  Could not link notifications for rule ${ruleId}: ${error.message}`);
  }
}

/**
 * Main setup function
 */
async function setupSentryAlerts() {
  console.log('🚀 Setting up Sentry alert rules and notifications...\n');

  try {
    // Step 1: Create notification channels
    console.log('📢 Setting up notification channels...');
    for (const channelConfig of notificationChannels) {
      if (channelConfig.type === 'slack' && !channelConfig.integrationId) {
        console.log(
          `⚠️  Skipping Slack channel ${channelConfig.name} - integration ID not configured`
        );
        continue;
      }
      await createNotificationChannel(channelConfig);
    }
    console.log('✅ Notification channels configured\n');

    // Step 2: Create alert rules for each project
    console.log('📋 Setting up alert rules...');
    let totalRulesCreated = 0;

    for (const projectSlug of PROJECT_SLUGS) {
      console.log(`\n📦 Processing project: ${projectSlug}`);

      for (const ruleConfig of alertRules) {
        try {
          // Build Sentry rule configuration
          const sentryRuleConfig = {
            name: ruleConfig.name,
            dataset: ruleConfig.dataset,
            query: ruleConfig.query,
            environment: ruleConfig.environment,
            projects: [projectSlug],
            owner: ruleConfig.owner,
            description: ruleConfig.description,
            thresholdType: ruleConfig.thresholdType,
            triggerType: ruleConfig.triggerType,
            thresholdValue: ruleConfig.thresholdValue,
            aggregation: ruleConfig.aggregation,
            timeWindow: ruleConfig.timeWindow,
          };

          const result = await createAlertRule(projectSlug, sentryRuleConfig);

          // Link to notification channels
          await linkAlertToNotifications(result.id, ruleConfig.alertType);

          totalRulesCreated++;
        } catch (error) {
          console.error(
            `❌ Failed to setup rule ${ruleConfig.name} for ${projectSlug}: ${error.message}`
          );
        }
      }
    }

    console.log(
      `\n✅ Setup completed! Created/updated ${totalRulesCreated} alert rules across ${PROJECT_SLUGS.length} projects`
    );

    // Step 3: Verify setup
    console.log('\n🔍 Verifying setup...');
    for (const projectSlug of PROJECT_SLUGS) {
      const rules = await getExistingAlertRules(projectSlug);
      console.log(`📊 ${projectSlug}: ${rules.length} alert rules configured`);
    }

    console.log('\n🎉 Sentry alert setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Verify alert rules in Sentry dashboard');
    console.log('2. Test alert notifications');
    console.log('3. Configure on-call schedules');
    console.log('4. Set up escalation policies');
  } catch (error) {
    console.error(`❌ Setup failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const command = process.argv[2];

  if (command === '--help' || command === '-h') {
    console.log(`
Usage: pnpm setup-sentry-alerts [options]

Options:
  --help, -h     Show this help message
  --dry-run     Show what would be created without making changes

Environment variables (required):
  SENTRY_AUTH_TOKEN      Sentry API token with admin permissions
  SENTRY_ORG_SLUG        Sentry organization slug
  SENTRY_PROJECT_SLUGS   Comma-separated list of project slugs

Optional environment variables:
  SENTRY_SLACK_CRITICAL_INTEGRATION_ID    Slack integration for critical alerts
  SENTRY_SLACK_PERFORMANCE_INTEGRATION_ID Slack integration for performance alerts
  SENTRY_SLACK_ERRORS_INTEGRATION_ID      Slack integration for error alerts

Examples:
  SENTRY_AUTH_TOKEN=sntrys_... SENTRY_ORG_SLUG=myorg SENTRY_PROJECT_SLUGS=web,portal pnpm setup-sentry-alerts
`);
    process.exit(0);
  }

  if (command === '--dry-run') {
    console.log('🔍 Dry run mode - showing what would be created:\n');
    console.log('Alert rules to create:');
    alertRules.forEach((rule) => {
      console.log(`  - ${rule.name} (${rule.alertType})`);
    });
    console.log('\nNotification channels to create:');
    notificationChannels.forEach((channel) => {
      console.log(`  - ${channel.name} (${channel.type})`);
    });
    console.log(`\nProjects to configure: ${PROJECT_SLUGS.join(', ')}`);
    process.exit(0);
  }

  setupSentryAlerts();
}

module.exports = { setupSentryAlerts };
