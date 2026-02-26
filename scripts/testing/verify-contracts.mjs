#!/usr/bin/env node

/**
 * @file scripts/testing/verify-contracts.mjs
 * @summary Contract verification script for external service integrations.
 * @security Test-only verification; no production secrets exposed.
 * @requirements TASK-002-6: Add contract verification to CI/CD pipeline
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

/**
 * Contract verification configuration
 */
const VERIFICATION_CONFIG = {
  stripe: {
    providerBaseUrl: process.env.STRIPE_API_URL || 'https://api.stripe.com/v1',
    pactUrls: [join(projectRoot, 'pact/pacts/marketing-websites-app-stripe-api.json')],
    timeout: 30000,
    retries: 3,
  },
  supabase: {
    providerBaseUrl: process.env.SUPABASE_URL || 'https://test.supabase.co',
    pactUrls: [join(projectRoot, 'pact/pacts/marketing-websites-app-supabase-api.json')],
    timeout: 30000,
    retries: 3,
  },
  resend: {
    providerBaseUrl: process.env.RESEND_API_URL || 'https://api.resend.com',
    pactUrls: [join(projectRoot, 'pact/pacts/marketing-websites-app-resend-api.json')],
    timeout: 30000,
    retries: 3,
  },
};

/**
 * Colors for console output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Log with colors
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Execute command with error handling
 */
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout || '', error: error.stderr || error.message };
  }
}

/**
 * Verify contract for specific provider
 */
async function verifyContract(provider) {
  const config = VERIFICATION_CONFIG[provider];
  if (!config) {
    log(`❌ Unknown provider: ${provider}`, colors.red);
    return { success: false, error: `Unknown provider: ${provider}` };
  }

  log(`🔍 Verifying contract for ${provider}...`, colors.blue);

  // Check if contract file exists
  const contractFile = config.pactUrls[0];
  if (!existsSync(contractFile)) {
    log(`❌ Contract file not found: ${contractFile}`, colors.red);
    return { success: false, error: `Contract file not found: ${contractFile}` };
  }

  // Verify environment variables
  const requiredEnvVars = getRequiredEnvVars(provider);
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log(`❌ Missing required environment variables: ${missingVars.join(', ')}`, colors.red);
    return { success: false, error: `Missing environment variables: ${missingVars.join(', ')}` };
  }

  // Build pact verification command
  const pactCommand = buildPactCommand(provider, config);
  
  log(`🚀 Running: ${pactCommand}`, colors.cyan);
  
  const result = execCommand(pactCommand, {
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      CI: 'true',
    },
  });

  if (result.success) {
    log(`✅ Contract verification passed for ${provider}`, colors.green);
    return { success: true, provider };
  } else {
    log(`❌ Contract verification failed for ${provider}`, colors.red);
    log(`Error output: ${result.error}`, colors.red);
    return { success: false, provider, error: result.error };
  }
}

/**
 * Get required environment variables for provider
 */
function getRequiredEnvVars(provider) {
  switch (provider) {
    case 'stripe':
      return ['STRIPE_API_KEY'];
    case 'supabase':
      return ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    case 'resend':
      return ['RESEND_API_KEY'];
    default:
      return [];
  }
}

/**
 * Build Pact verification command
 */
function buildPactCommand(provider, config) {
  const baseCommand = `npx pact-broker verify contracts/consumers/${provider}-consumer.json`;
  
  const options = [
    `--provider-base-url=${config.providerBaseUrl}`,
    `--provider=${provider}-api`,
    `--consumer=marketing-websites-app`,
    `--timeout=${config.timeout}`,
    `--retry=${config.retries}`,
    '--verbose',
  ];

  // Add provider-specific options
  switch (provider) {
    case 'stripe':
      options.push('--broker-username=$PACT_BROKER_USERNAME', '--broker-password=$PACT_BROKER_PASSWORD');
      break;
    case 'supabase':
      options.push('--custom-provider-header=Authorization: Bearer $SUPABASE_ANON_KEY');
      break;
    case 'resend':
      options.push('--custom-provider-header=Authorization: Bearer $RESEND_API_KEY');
      break;
  }

  return `${baseCommand} ${options.join(' ')}`;
}

/**
 * Generate verification report
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    providers: results.map(r => ({
      provider: r.provider,
      success: r.success,
      error: r.error || null,
    })),
  };

  const reportPath = join(projectRoot, 'contract-verification-report.json');
  try {
    require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`📊 Verification report saved to: ${reportPath}`, colors.blue);
  } catch (error) {
    log(`⚠️ Failed to save report: ${error.message}`, colors.yellow);
  }

  return report;
}

/**
 * Main execution function
 */
async function main() {
  const provider = process.argv[2];
  
  if (!provider) {
    log('❌ Please specify a provider: stripe, supabase, or resend', colors.red);
    log('Usage: node scripts/testing/verify-contracts.mjs <provider>', colors.cyan);
    process.exit(1);
  }

  log('🚀 Starting contract verification...', colors.magenta);
  log(`📅 Timestamp: ${new Date().toISOString()}`, colors.blue);
  log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`, colors.blue);

  const result = await verifyContract(provider);
  
  // Generate report
  const report = generateReport([result]);
  
  // Print summary
  log('\n📋 Verification Summary:', colors.magenta);
  log(`Total providers: ${report.total}`, colors.blue);
  log(`Passed: ${report.passed}`, colors.green);
  log(`Failed: ${report.failed}`, colors.red);
  log(`Success rate: ${((report.passed / report.total) * 100).toFixed(1)}%`, colors.blue);

  // Exit with appropriate code
  if (result.success) {
    log('✅ Contract verification completed successfully!', colors.green);
    process.exit(0);
  } else {
    log('❌ Contract verification failed!', colors.red);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, colors.red);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`❌ Unhandled rejection: ${reason}`, colors.red);
  process.exit(1);
});

// Run main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(`❌ Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

export { verifyContract, generateReport };
