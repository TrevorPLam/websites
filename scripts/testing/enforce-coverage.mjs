#!/usr/bin/env node

/**
 * @file scripts/testing/enforce-coverage.mjs
 * @summary Incremental coverage enforcement with progressive rollout strategy
 * @security Test-only script; no runtime secrets accessed
 * @requirements PROD-TEST-004
 * @tags [#testing #coverage #automation #ci-cd]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Coverage enforcement configuration
 */
const COVERAGE_PHASES = {
  PHASE_1: {
    name: 'Phase 1: Foundation',
    thresholds: { branches: 60, functions: 70, lines: 80, statements: 80 },
    criticalPaths: {
      security: 95,
      payments: 90,
      multiTenant: 95,
      validation: 90,
    },
  },
  PHASE_2: {
    name: 'Phase 2: Enhancement',
    thresholds: { branches: 70, functions: 75, lines: 85, statements: 85 },
    criticalPaths: {
      security: 95,
      payments: 92,
      multiTenant: 95,
      validation: 92,
    },
  },
  PHASE_3: {
    name: 'Phase 3: Optimization',
    thresholds: { branches: 80, functions: 85, lines: 90, statements: 90 },
    criticalPaths: {
      security: 98,
      payments: 95,
      multiTenant: 98,
      validation: 95,
    },
  },
};

/**
 * Critical path mappings for enhanced coverage requirements
 */
const CRITICAL_PATHS = {
  security: [
    'packages/features/src/booking/lib/booking-repository.ts',
    'packages/infrastructure/src/auth/secure-action.ts',
    'packages/infrastructure/src/security/input-validation.ts',
    'packages/infrastructure/src/tenant-context.ts',
  ],
  payments: [
    'packages/billing/src/stripe-client.ts',
    'packages/billing/src/billing-service.ts',
    'packages/integrations/src/stripe/index.ts',
  ],
  multiTenant: [
    'packages/features/src/booking/lib/multi-tenant-isolation.test.ts',
    'packages/infrastructure/src/tenant-context.ts',
    'packages/infrastructure/src/auth/middleware.ts',
  ],
  validation: [
    'packages/shared/src/validation/schemas.ts',
    'packages/shared/src/transformation/data-mapper.ts',
    'packages/infrastructure/src/security/input-validation.ts',
  ],
};

/**
 * Read and parse coverage report
 */
function readCoverageReport(coveragePath = './coverage/coverage-summary.json') {
  try {
    if (!existsSync(coveragePath)) {
      console.error('❌ Coverage report not found:', coveragePath);
      console.log('💡 Run: pnpm test:coverage to generate coverage report');
      process.exit(1);
    }

    const coverageData = JSON.parse(readFileSync(coveragePath, 'utf8'));
    return coverageData;
  } catch (error) {
    console.error('❌ Failed to read coverage report:', error.message);
    process.exit(1);
  }
}

/**
 * Extract global coverage metrics
 */
function getGlobalCoverage(coverageData) {
  const total = coverageData.total;
  return {
    branches: Math.round(total.branches.pct),
    functions: Math.round(total.functions.pct),
    lines: Math.round(total.lines.pct),
    statements: Math.round(total.statements.pct),
  };
}

/**
 * Extract critical path coverage from detailed report
 */
function getCriticalPathCoverage(coverageData) {
  const criticalCoverage = {};
  
  for (const [category, paths] of Object.entries(CRITICAL_PATHS)) {
    let totalLines = 0;
    let coveredLines = 0;
    let totalBranches = 0;
    let coveredBranches = 0;
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalStatements = 0;
    let coveredStatements = 0;

    for (const path of paths) {
      const fileData = coverageData[path];
      if (fileData) {
        totalLines += fileData.lines?.total || 0;
        coveredLines += fileData.lines?.covered || 0;
        totalBranches += fileData.branches?.total || 0;
        coveredBranches += fileData.branches?.covered || 0;
        totalFunctions += fileData.functions?.total || 0;
        coveredFunctions += fileData.functions?.covered || 0;
        totalStatements += fileData.statements?.total || 0;
        coveredStatements += fileData.statements?.covered || 0;
      }
    }

    criticalCoverage[category] = {
      lines: totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 0,
      branches: totalBranches > 0 ? Math.round((coveredBranches / totalBranches) * 100) : 0,
      functions: totalFunctions > 0 ? Math.round((coveredFunctions / totalFunctions) * 100) : 0,
      statements: totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 0,
    };
  }

  return criticalCoverage;
}

/**
 * Validate coverage against thresholds
 */
function validateCoverage(currentCoverage, thresholds, context = 'global') {
  const violations = [];
  
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const current = currentCoverage[metric];
    if (current < threshold) {
      violations.push({
        metric,
        current,
        threshold,
        gap: threshold - current,
        context,
      });
    }
  }

  return violations;
}

/**
 * Generate coverage report with recommendations
 */
function generateReport(globalCoverage, criticalCoverage, phase, violations) {
  const report = {
    timestamp: new Date().toISOString(),
    phase: phase.name,
    globalCoverage,
    criticalPathCoverage: criticalCoverage,
    violations,
    status: violations.length === 0 ? 'PASS' : 'FAIL',
    recommendations: [],
  };

  // Generate recommendations
  if (violations.length > 0) {
    report.recommendations.push('📝 Add tests to uncovered code paths');
    report.recommendations.push('🔍 Review test coverage gaps in failing areas');
    
    const securityViolations = violations.filter(v => v.context === 'security');
    if (securityViolations.length > 0) {
      report.recommendations.push('🔒 CRITICAL: Security functions require immediate attention');
    }

    const paymentViolations = violations.filter(v => v.context === 'payments');
    if (paymentViolations.length > 0) {
      report.recommendations.push('💳 IMPORTANT: Payment processing functions need coverage');
    }
  } else {
    report.recommendations.push('✅ All coverage requirements met');
    report.recommendations.push('🚀 Ready for next phase or production deployment');
  }

  return report;
}

/**
 * Print formatted coverage report
 */
function printReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 Coverage Enforcement Report - ${report.phase}`);
  console.log('='.repeat(80));
  console.log(`🕐 Timestamp: ${report.timestamp}`);
  console.log(`📋 Status: ${report.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n🌍 Global Coverage:');
  console.log(`   Branches: ${report.globalCoverage.branches}%`);
  console.log(`   Functions: ${report.globalCoverage.functions}%`);
  console.log(`   Lines: ${report.globalCoverage.lines}%`);
  console.log(`   Statements: ${report.globalCoverage.statements}%`);

  console.log('\n🎯 Critical Path Coverage:');
  for (const [category, coverage] of Object.entries(report.criticalPathCoverage)) {
    const icon = category === 'security' ? '🔒' : 
                category === 'payments' ? '💳' : 
                category === 'multiTenant' ? '🏢' : '✅';
    console.log(`   ${icon} ${category.charAt(0).toUpperCase() + category.slice(1)}: ${coverage.lines}%`);
  }

  if (report.violations.length > 0) {
    console.log('\n❌ Coverage Violations:');
    for (const violation of report.violations) {
      const context = violation.context === 'global' ? '' : ` (${violation.context})`;
      console.log(`   • ${violation.metric}: ${violation.current}% < ${violation.threshold}%${context} (-${violation.gap}%)`);
    }
  }

  console.log('\n💡 Recommendations:');
  report.recommendations.forEach(rec => console.log(`   ${rec}`));
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Save detailed report for CI/CD integration
 */
function saveReport(report, reportPath = './coverage/enforcement-report.json') {
  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  } catch (error) {
    console.warn('⚠️  Failed to save detailed report:', error.message);
  }
}

/**
 * Update coverage thresholds in vitest.config.ts for next phase
 */
function updateVitestThresholds(nextPhase) {
  const configPath = './vitest.config.ts';
  
  if (!existsSync(configPath)) {
    console.warn('⚠️  vitest.config.ts not found, skipping threshold update');
    return;
  }

  try {
    let configContent = readFileSync(configPath, 'utf8');
    
    // Update global thresholds
    const thresholdsBlock = `thresholds: {
        global: {
          branches: ${nextPhase.thresholds.branches},    // ${nextPhase.name}
          functions: ${nextPhase.thresholds.functions},  // ${nextPhase.name}  
          lines: ${nextPhase.thresholds.lines},      // ${nextPhase.name}
          statements: ${nextPhase.thresholds.statements}, // ${nextPhase.name}
        },
      }`;

    // Replace thresholds in config
    const thresholdsRegex = /thresholds:\s*\{[^}]+\}/s;
    configContent = configContent.replace(thresholdsRegex, thresholdsBlock);
    
    writeFileSync(configPath, configContent);
    console.log(`🔄 Updated vitest.config.ts for ${nextPhase.name}`);
  } catch (error) {
    console.warn('⚠️  Failed to update vitest.config.ts:', error.message);
  }
}

/**
 * Main enforcement function
 */
function enforceCoverage(options = {}) {
  const {
    phase = 'PHASE_1',
    updateConfig = false,
    reportPath = './coverage/enforcement-report.json',
    coveragePath = './coverage/coverage-summary.json',
  } = options;

  console.log(`🚀 Starting coverage enforcement for ${COVERAGE_PHASES[phase].name}`);
  
  // Read coverage data
  const coverageData = readCoverageReport(coveragePath);
  
  // Extract coverage metrics
  const globalCoverage = getGlobalCoverage(coverageData);
  const criticalCoverage = getCriticalPathCoverage(coverageData);
  
  // Get current phase configuration
  const currentPhase = COVERAGE_PHASES[phase];
  
  // Validate global coverage
  const globalViolations = validateCoverage(globalCoverage, currentPhase.thresholds, 'global');
  
  // Validate critical path coverage
  const criticalViolations = [];
  for (const [category, coverage] of Object.entries(criticalCoverage)) {
    const threshold = currentPhase.criticalPaths[category];
    const violations = validateCoverage(coverage, { lines: threshold }, category);
    criticalViolations.push(...violations);
  }
  
  const allViolations = [...globalViolations, ...criticalViolations];
  
  // Generate and print report
  const report = generateReport(globalCoverage, criticalCoverage, currentPhase, allViolations);
  printReport(report);
  saveReport(report, reportPath);
  
  // Update configuration for next phase if requested
  if (updateConfig && report.status === 'PASS') {
    const phases = Object.keys(COVERAGE_PHASES);
    const currentIndex = phases.indexOf(phase);
    if (currentIndex < phases.length - 1) {
      const nextPhase = COVERAGE_PHASES[phases[currentIndex + 1]];
      updateVitestThresholds(nextPhase);
    }
  }
  
  // Exit with appropriate code
  if (report.status === 'FAIL') {
    console.log('\n❌ Coverage requirements not met - exiting with error code');
    process.exit(1);
  } else {
    console.log('\n✅ All coverage requirements met');
    if (updateConfig) {
      console.log('🔄 Configuration updated for next phase');
    }
  }
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--phase':
        options.phase = args[++i];
        break;
      case '--update-config':
        options.updateConfig = true;
        break;
      case '--report-path':
        options.reportPath = args[++i];
        break;
      case '--coverage-path':
        options.coveragePath = args[++i];
        break;
      case '--help':
        console.log(`
Coverage Enforcement Tool

Usage: node enforce-coverage.mjs [options]

Options:
  --phase <phase>          Coverage phase (PHASE_1, PHASE_2, PHASE_3) [default: PHASE_1]
  --update-config          Update vitest.config.ts for next phase when passing
  --report-path <path>      Output report path [default: ./coverage/enforcement-report.json]
  --coverage-path <path>    Coverage summary path [default: ./coverage/coverage-summary.json]
  --help                   Show this help message

Examples:
  node enforce-coverage.mjs
  node enforce-coverage.mjs --phase PHASE_2 --update-config
  node enforce-coverage.mjs --report-path ./reports/coverage.json
        `);
        process.exit(0);
        break;
      default:
        console.error('Unknown option:', arg);
        console.log('Use --help for usage information');
        process.exit(1);
    }
  }
  
  enforceCoverage(options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { enforceCoverage, COVERAGE_PHASES, CRITICAL_PATHS };
