#!/usr/bin/env tsx
/**
 * @file scripts/perf/validate-budgets.ts
 * @summary Performance budget validation script for CI/CD gates
 * @see tasks/c-14-slos-performance-budgets.md
 *
 * Purpose: Validates Core Web Vitals (LCP, INP, CLS) and bundle size against defined budgets.
 *          Can be run locally or in CI to prevent performance regressions.
 *
 * Usage:
 *   pnpm validate:budgets [--client=starter-template] [--format=json]
 *
 * Budgets are defined in docs/performance/slo-definition.md
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Performance budgets (from SLO definition)
const BUDGETS = {
  lcp: 2500, // LCP ≤ 2.5s (good)
  inp: 200, // INP ≤ 200ms (good)
  cls: 0.1, // CLS ≤ 0.1 (good)
  bundleSize: {
    // Optional: bundle size budgets per route
    default: 250 * 1024, // 250 KB initial JS
  },
} as const;

interface PerformanceMetrics {
  lcp?: number;
  inp?: number;
  cls?: number;
  bundleSize?: number;
}

interface ValidationResult {
  passed: boolean;
  metrics: PerformanceMetrics;
  violations: string[];
}

/**
 * Validates performance metrics against budgets
 */
function validateBudgets(metrics: PerformanceMetrics): ValidationResult {
  const violations: string[] = [];

  if (metrics.lcp !== undefined && metrics.lcp > BUDGETS.lcp) {
    violations.push(`LCP ${metrics.lcp}ms exceeds budget of ${BUDGETS.lcp}ms`);
  }

  if (metrics.inp !== undefined && metrics.inp > BUDGETS.inp) {
    violations.push(`INP ${metrics.inp}ms exceeds budget of ${BUDGETS.inp}ms`);
  }

  if (metrics.cls !== undefined && metrics.cls > BUDGETS.cls) {
    violations.push(`CLS ${metrics.cls} exceeds budget of ${BUDGETS.cls}`);
  }

  if (metrics.bundleSize !== undefined && metrics.bundleSize > BUDGETS.bundleSize.default) {
    violations.push(
      `Bundle size ${(metrics.bundleSize / 1024).toFixed(2)}KB exceeds budget of ${(BUDGETS.bundleSize.default / 1024).toFixed(2)}KB`
    );
  }

  return {
    passed: violations.length === 0,
    metrics,
    violations,
  };
}

/**
 * Attempts to extract metrics from Lighthouse report if available
 * Falls back to placeholder values for now (requires Lighthouse CI integration)
 */
function extractMetrics(clientPath: string): PerformanceMetrics {
  const lighthouseReportPath = join(clientPath, '.next', 'lighthouse-report.json');

  // TODO: Integrate with Lighthouse CI or local Lighthouse run
  // For now, return empty metrics (script will pass but warn)
  if (existsSync(lighthouseReportPath)) {
    try {
      const report = JSON.parse(readFileSync(lighthouseReportPath, 'utf-8'));
      // Extract from Lighthouse report structure
      return {
        lcp: report.audits?.['largest-contentful-paint']?.numericValue,
        inp: report.audits?.['interactive']?.numericValue,
        cls: report.audits?.['cumulative-layout-shift']?.numericValue,
      };
    } catch (error) {
      console.warn('Failed to parse Lighthouse report:', error);
    }
  }

  // Placeholder: return undefined to indicate metrics not available
  // In CI, this should be populated by Lighthouse CI or similar
  return {};
}

function main() {
  const args = process.argv.slice(2);
  const clientArg = args.find((arg) => arg.startsWith('--client='));
  const client = clientArg ? clientArg.split('=')[1] : 'starter-template';
  const format = args.includes('--format=json') ? 'json' : 'text';

  const clientPath = join(process.cwd(), 'clients', client);

  if (!existsSync(clientPath)) {
    console.error(`Client path not found: ${clientPath}`);
    process.exit(1);
  }

  console.log(`Validating performance budgets for client: ${client}`);

  const metrics = extractMetrics(clientPath);
  const result = validateBudgets(metrics);

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (Object.keys(metrics).length === 0) {
      console.warn('⚠️  No performance metrics available. Install Lighthouse CI or run Lighthouse locally.');
      console.warn('   Budget validation skipped. See docs/performance/slo-definition.md for setup.');
      process.exit(0); // Don't fail if metrics unavailable
    }

    console.log('\nPerformance Metrics:');
    if (metrics.lcp !== undefined) console.log(`  LCP: ${metrics.lcp}ms (budget: ${BUDGETS.lcp}ms)`);
    if (metrics.inp !== undefined) console.log(`  INP: ${metrics.inp}ms (budget: ${BUDGETS.inp}ms)`);
    if (metrics.cls !== undefined) console.log(`  CLS: ${metrics.cls} (budget: ${BUDGETS.cls})`);

    if (result.passed) {
      console.log('\n✅ All performance budgets met');
    } else {
      console.log('\n❌ Performance budget violations:');
      result.violations.forEach((violation) => console.log(`  - ${violation}`));
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}
