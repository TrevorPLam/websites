#!/usr/bin/env node

/**
 * @file scripts/testing/contract-coverage.mjs
 * @summary Contract coverage analysis script for API integration testing.
 * @security Test-only coverage analysis; no production secrets exposed.
 * @requirements TASK-002-6: Add contract verification to CI/CD pipeline
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

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
 * Read and parse JSON file
 */
function readJsonFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      return null;
    }
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`⚠️ Failed to read JSON file ${filePath}: ${error.message}`, colors.yellow);
    return null;
  }
}

/**
 * Analyze contract coverage
 */
function analyzeContractCoverage() {
  const contractsDir = join(projectRoot, 'contracts/consumers');
  const testFilesDir = join(projectRoot, 'e2e/contracts/consumers');
  
  if (!existsSync(contractsDir)) {
    log(`❌ Contracts directory not found: ${contractsDir}`, colors.red);
    return null;
  }

  const contractFiles = readdirSync(contractsDir).filter(file => file.endsWith('.json'));
  const testFiles = readdirSync(testFilesDir).filter(file => file.endsWith('.spec.ts'));

  log(`📊 Analyzing contract coverage...`, colors.blue);
  log(`📁 Contract files found: ${contractFiles.length}`, colors.cyan);
  log(`🧪 Test files found: ${testFiles.length}`, colors.cyan);

  const coverage = {
    total: 0,
    covered: 0,
    providers: {},
    interactions: {
      total: 0,
      covered: 0,
    },
    endpoints: {
      total: 0,
      covered: 0,
    },
    methods: {
      GET: 0,
      POST: 0,
      PUT: 0,
      PATCH: 0,
      DELETE: 0,
    },
  };

  // Analyze each contract file
  for (const contractFile of contractFiles) {
    const contractPath = join(contractsDir, contractFile);
    const contract = readJsonFile(contractPath);
    
    if (!contract) {
      continue;
    }

    const provider = contract.provider;
    coverage.providers[provider] = {
      total: 0,
      covered: 0,
      interactions: contract.interactions?.length || 0,
      endpoints: new Set(),
      methods: new Set(),
    };

    coverage.total++;
    coverage.interactions.total += contract.interactions?.length || 0;

    // Check if corresponding test file exists
    const testFileName = contractFile.replace('.json', '.spec.ts');
    const hasTestFile = testFiles.includes(testFileName);
    
    if (hasTestFile) {
      coverage.covered++;
      coverage.providers[provider].covered++;
      coverage.interactions.covered += contract.interactions?.length || 0;
    }

    // Analyze interactions
    if (contract.interactions) {
      for (const interaction of contract.interactions) {
        const method = interaction.request?.method;
        const path = interaction.request?.path;
        
        if (method) {
          coverage.methods[method] = (coverage.methods[method] || 0) + 1;
          coverage.providers[provider].methods.add(method);
        }
        
        if (path) {
          coverage.endpoints.total++;
          coverage.providers[provider].endpoints.add(`${method} ${path}`);
          
          if (hasTestFile) {
            coverage.endpoints.covered++;
          }
        }
      }
    }
  }

  return coverage;
}

/**
 * Generate coverage report
 */
function generateCoverageReport(coverage) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalContracts: coverage.total,
      coveredContracts: coverage.covered,
      contractCoverage: coverage.total > 0 ? ((coverage.covered / coverage.total) * 100).toFixed(1) : 0,
      totalInteractions: coverage.interactions.total,
      coveredInteractions: coverage.interactions.covered,
      interactionCoverage: coverage.interactions.total > 0 ? ((coverage.interactions.covered / coverage.interactions.total) * 100).toFixed(1) : 0,
      totalEndpoints: coverage.endpoints.total,
      coveredEndpoints: coverage.endpoints.covered,
      endpointCoverage: coverage.endpoints.total > 0 ? ((coverage.endpoints.covered / coverage.endpoints.total) * 100).toFixed(1) : 0,
    },
    providers: {},
    methods: coverage.methods,
  };

  // Process provider data
  for (const [provider, data] of Object.entries(coverage.providers)) {
    report.providers[provider] = {
      totalContracts: data.total,
      coveredContracts: data.covered,
      contractCoverage: data.total > 0 ? ((data.covered / data.total) * 100).toFixed(1) : 0,
      totalInteractions: data.interactions,
      coveredInteractions: data.covered ? data.interactions : 0,
      interactionCoverage: data.covered ? 100 : 0,
      totalEndpoints: data.endpoints.size,
      coveredEndpoints: data.covered ? data.endpoints.size : 0,
      endpointCoverage: data.covered ? 100 : 0,
      methods: Array.from(data.methods),
    };
  }

  return report;
}

/**
 * Print coverage report
 */
function printCoverageReport(report) {
  log('\n📊 Contract Coverage Report', colors.magenta);
  log('================================', colors.magenta);

  // Summary
  log('\n📋 Summary:', colors.blue);
  log(`Contracts: ${report.summary.coveredContracts}/${report.summary.totalContracts} (${report.summary.contractCoverage}%)`, 
      report.summary.contractCoverage >= 80 ? colors.green : colors.yellow);
  log(`Interactions: ${report.summary.coveredInteractions}/${report.summary.totalInteractions} (${report.summary.interactionCoverage}%)`, 
      report.summary.interactionCoverage >= 80 ? colors.green : colors.yellow);
  log(`Endpoints: ${report.summary.coveredEndpoints}/${report.summary.totalEndpoints} (${report.summary.endpointCoverage}%)`, 
      report.summary.endpointCoverage >= 80 ? colors.green : colors.yellow);

  // Provider breakdown
  log('\n🏢 Provider Breakdown:', colors.blue);
  for (const [provider, data] of Object.entries(report.providers)) {
    const status = data.contractCoverage >= 80 ? colors.green : colors.yellow;
    log(`${provider}:`, colors.cyan);
    log(`  Contracts: ${data.coveredContracts}/${data.totalContracts} (${data.contractCoverage}%)`, status);
    log(`  Endpoints: ${data.coveredEndpoints}/${data.totalEndpoints} (${data.endpointCoverage}%)`, status);
    log(`  Methods: ${data.methods.join(', ')}`, colors.blue);
  }

  // HTTP Methods
  log('\n🔧 HTTP Methods:', colors.blue);
  for (const [method, count] of Object.entries(report.methods)) {
    log(`  ${method}: ${count}`, colors.cyan);
  }

  // Recommendations
  log('\n💡 Recommendations:', colors.blue);
  if (report.summary.contractCoverage < 80) {
    log('  ⚠️ Contract coverage is below 80%. Consider adding tests for uncovered contracts.', colors.yellow);
  }
  if (report.summary.interactionCoverage < 80) {
    log('  ⚠️ Interaction coverage is below 80%. Review test coverage for all interactions.', colors.yellow);
  }
  if (report.summary.endpointCoverage < 80) {
    log('  ⚠️ Endpoint coverage is below 80%. Ensure all API endpoints are tested.', colors.yellow);
  }
  if (report.summary.contractCoverage >= 80 && report.summary.interactionCoverage >= 80 && report.summary.endpointCoverage >= 80) {
    log('  ✅ Excellent coverage! All contracts, interactions, and endpoints are well tested.', colors.green);
  }

  // Quality gates
  log('\n🚪 Quality Gates:', colors.blue);
  const gates = [
    { name: 'Contract Coverage', value: report.summary.contractCoverage, threshold: 80 },
    { name: 'Interaction Coverage', value: report.summary.interactionCoverage, threshold: 80 },
    { name: 'Endpoint Coverage', value: report.summary.endpointCoverage, threshold: 80 },
  ];

  let allPassed = true;
  for (const gate of gates) {
    const passed = gate.value >= gate.threshold;
    const status = passed ? colors.green : colors.red;
    log(`  ${gate.name}: ${gate.value}% >= ${gate.threshold}% ${passed ? '✅' : '❌'}`, status);
    if (!passed) allPassed = false;
  }

  return allPassed;
}

/**
 * Save coverage report
 */
function saveCoverageReport(report) {
  const reportPath = join(projectRoot, 'contract-coverage-report.json');
  try {
    require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`📊 Coverage report saved to: ${reportPath}`, colors.blue);
  } catch (error) {
    log(`⚠️ Failed to save coverage report: ${error.message}`, colors.yellow);
  }
}

/**
 * Main execution function
 */
async function main() {
  log('🚀 Starting contract coverage analysis...', colors.magenta);
  log(`📅 Timestamp: ${new Date().toISOString()}`, colors.blue);

  const coverage = analyzeContractCoverage();
  
  if (!coverage) {
    log('❌ Failed to analyze contract coverage', colors.red);
    process.exit(1);
  }

  const report = generateCoverageReport(coverage);
  const allGatesPassed = printCoverageReport(report);
  
  saveCoverageReport(report);

  // Exit with appropriate code
  if (allGatesPassed) {
    log('\n✅ All quality gates passed!', colors.green);
    process.exit(0);
  } else {
    log('\n❌ Some quality gates failed!', colors.red);
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

export { analyzeContractCoverage, generateCoverageReport, printCoverageReport };
