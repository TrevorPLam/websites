#!/usr/bin/env node

/**
 * @file scripts/testing/test-coverage-enforcement.mjs
 * @summary Test script for coverage enforcement functionality
 * @security Test-only script; no runtime secrets accessed
 * @requirements PROD-TEST-005
 */

import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create coverage directory if it doesn't exist
const coverageDir = join(__dirname, '../../coverage');
try {
  mkdirSync(coverageDir, { recursive: true });
} catch (error) {
  // Directory already exists
}

// Test Case 1: Coverage above thresholds (should pass)
const passingCoverage = {
  total: {
    lines: { total: 1000, covered: 850, pct: 85 },
    functions: { total: 100, covered: 80, pct: 80 },
    branches: { total: 200, covered: 130, pct: 65 },
    statements: { total: 1000, covered: 820, pct: 82 },
  },
};

// Test Case 2: Coverage below thresholds (should fail)
const failingCoverage = {
  total: {
    lines: { total: 1000, covered: 750, pct: 75 },
    functions: { total: 100, covered: 60, pct: 60 },
    branches: { total: 200, covered: 100, pct: 50 },
    statements: { total: 1000, covered: 700, pct: 70 },
  },
};

// Test Case 3: Critical path coverage data
const criticalPathData = {
  'packages/features/src/booking/lib/booking-repository.ts': {
    lines: { total: 100, covered: 95, pct: 95 },
    functions: { total: 20, covered: 19, pct: 95 },
    branches: { total: 30, covered: 28, pct: 93 },
    statements: { total: 100, covered: 95, pct: 95 },
  },
  'packages/billing/src/stripe-client.ts': {
    lines: { total: 80, covered: 72, pct: 90 },
    functions: { total: 15, covered: 14, pct: 93 },
    branches: { total: 20, covered: 17, pct: 85 },
    statements: { total: 80, covered: 72, pct: 90 },
  },
  'packages/infrastructure/src/auth/secure-action.ts': {
    lines: { total: 60, covered: 58, pct: 97 },
    functions: { total: 12, covered: 12, pct: 100 },
    branches: { total: 15, covered: 15, pct: 100 },
    statements: { total: 60, covered: 58, pct: 97 },
  },
  'packages/infrastructure/src/security/input-validation.ts': {
    lines: { total: 40, covered: 36, pct: 90 },
    functions: { total: 8, covered: 8, pct: 100 },
    branches: { total: 10, covered: 9, pct: 90 },
    statements: { total: 40, covered: 36, pct: 90 },
  },
  'packages/infrastructure/src/tenant-context.ts': {
    lines: { total: 50, covered: 48, pct: 96 },
    functions: { total: 10, covered: 10, pct: 100 },
    branches: { total: 12, covered: 12, pct: 100 },
    statements: { total: 50, covered: 48, pct: 96 },
  },
  'packages/shared/src/validation/schemas.ts': {
    lines: { total: 30, covered: 27, pct: 90 },
    functions: { total: 6, covered: 6, pct: 100 },
    branches: { total: 8, covered: 7, pct: 88 },
    statements: { total: 30, covered: 27, pct: 90 },
  },
};

console.log('🧪 Testing Coverage Enforcement Script\n');

// Test passing case
console.log('Test 1: Coverage above thresholds (should pass)');
const passingCoverageWithCritical = { ...passingCoverage, ...criticalPathData };
writeFileSync(
  join(coverageDir, 'coverage-summary.json'),
  JSON.stringify(passingCoverageWithCritical, null, 2)
);
writeFileSync(
  join(coverageDir, 'coverage-final.json'),
  JSON.stringify(passingCoverageWithCritical, null, 2)
);

try {
  const { enforceCoverage } = await import('./enforce-coverage.mjs');
  enforceCoverage({ phase: 'PHASE_1', reportPath: join(coverageDir, 'test-pass-report.json') });
  console.log('✅ PASS: Coverage enforcement correctly accepts passing coverage\n');
} catch (error) {
  console.log('❌ FAIL: Coverage enforcement should have passed but failed:', error.message, '\n');
}

// Test failing case
console.log('Test 2: Coverage below thresholds (should fail)');
writeFileSync(join(coverageDir, 'coverage-summary.json'), JSON.stringify(failingCoverage, null, 2));
writeFileSync(join(coverageDir, 'coverage-final.json'), JSON.stringify(failingCoverage, null, 2));

try {
  const { enforceCoverage } = await import('./enforce-coverage.mjs');
  enforceCoverage({ phase: 'PHASE_1', reportPath: join(coverageDir, 'test-fail-report.json') });
  console.log('❌ FAIL: Coverage enforcement should have failed but passed\n');
} catch (error) {
  console.log(
    '✅ PASS: Coverage enforcement correctly rejects failing coverage:',
    error.message,
    '\n'
  );
}

// Test critical path coverage
console.log('Test 3: Critical path coverage analysis');
const combinedCoverage = {
  total: {
    lines: {
      total:
        passingCoverage.total.lines.total +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.lines.total,
          0
        ),
      covered:
        passingCoverage.total.lines.covered +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.lines.covered,
          0
        ),
      pct:
        ((passingCoverage.total.lines.covered +
          Object.values(criticalPathData).reduce(
            (acc, fileCoverage) => acc + fileCoverage.lines.covered,
            0
          )) /
          (passingCoverage.total.lines.total +
            Object.values(criticalPathData).reduce(
              (acc, fileCoverage) => acc + fileCoverage.lines.total,
              0
            ))) *
        100,
    },
    functions: {
      total:
        passingCoverage.total.functions.total +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.functions.total,
          0
        ),
      covered:
        passingCoverage.total.functions.covered +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.functions.covered,
          0
        ),
      pct:
        ((passingCoverage.total.functions.covered +
          Object.values(criticalPathData).reduce(
            (acc, fileCoverage) => acc + fileCoverage.functions.covered,
            0
          )) /
          (passingCoverage.total.functions.total +
            Object.values(criticalPathData).reduce(
              (acc, fileCoverage) => acc + fileCoverage.functions.total,
              0
            ))) *
        100,
    },
    branches: {
      total:
        passingCoverage.total.branches.total +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.branches.total,
          0
        ),
      covered:
        passingCoverage.total.branches.covered +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.branches.covered,
          0
        ),
      pct:
        ((passingCoverage.total.branches.covered +
          Object.values(criticalPathData).reduce(
            (acc, fileCoverage) => acc + fileCoverage.branches.covered,
            0
          )) /
          (passingCoverage.total.branches.total +
            Object.values(criticalPathData).reduce(
              (acc, fileCoverage) => acc + fileCoverage.branches.total,
              0
            ))) *
        100,
    },
    statements: {
      total:
        passingCoverage.total.statements.total +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.statements.total,
          0
        ),
      covered:
        passingCoverage.total.statements.covered +
        Object.values(criticalPathData).reduce(
          (acc, fileCoverage) => acc + fileCoverage.statements.covered,
          0
        ),
      pct:
        ((passingCoverage.total.statements.covered +
          Object.values(criticalPathData).reduce(
            (acc, fileCoverage) => acc + fileCoverage.statements.covered,
            0
          )) /
          (passingCoverage.total.statements.total +
            Object.values(criticalPathData).reduce(
              (acc, fileCoverage) => acc + fileCoverage.statements.total,
              0
            ))) *
        100,
    },
  },
  ...criticalPathData,
};
writeFileSync(
  join(coverageDir, 'coverage-summary.json'),
  JSON.stringify(combinedCoverage, null, 2)
);
writeFileSync(join(coverageDir, 'coverage-final.json'), JSON.stringify(combinedCoverage, null, 2));

try {
  const { enforceCoverage } = await import('./enforce-coverage.mjs');
  enforceCoverage({ phase: 'PHASE_1', reportPath: join(coverageDir, 'test-critical-report.json') });
  console.log('✅ PASS: Critical path coverage analysis completed\n');
} catch (error) {
  console.log('❌ FAIL: Critical path coverage analysis failed:', error.message, '\n');
}

console.log('🎯 Coverage enforcement testing completed!');
console.log('📄 Test reports saved to coverage directory');
console.log('🔍 Check the following files for detailed results:');
console.log('   - coverage/test-pass-report.json');
console.log('   - coverage/test-fail-report.json');
console.log('   - coverage/test-critical-report.json');
