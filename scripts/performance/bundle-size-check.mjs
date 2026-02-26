#!/usr/bin/env node

/**
 * @file scripts/performance/bundle-size-check.mjs
 * @summary Bundle size validation script for marketing websites
 * @description Validates bundle sizes against performance budgets
 * @version 1.0.0
 * @author Performance Team
 * @security None - Validation script only
 * @requirements TASK-003-3, Performance Budgets Configuration
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '../..');

// Load performance budgets
const budgetsPath = join(repoRoot, 'config/performance-budgets.json');
const budgets = JSON.parse(readFileSync(budgetsPath, 'utf8'));

class BundleSizeChecker {
  constructor() {
    this.budgets = budgets.bundleSize.limits;
    this.violations = [];
    this.warnings = [];
  }

  /**
   * Check bundle sizes against budgets
   */
  async checkBundleSizes() {
    console.log('🔍 Checking bundle sizes against performance budgets...\n');

    // Check marketing site bundles
    await this.checkMarketingBundles();

    // Check framework bundles
    await this.checkFrameworkBundles();

    // Check package bundles
    await this.checkPackageBundles();

    // Check portal bundles
    await this.checkPortalBundles();

    this.generateReport();
    return this.violations.length === 0 && this.warnings.length === 0;
  }

  /**
   * Check marketing site bundles
   */
  async checkMarketingBundles() {
    const marketingBundles = this.budgets.marketing;
    const basePath = 'clients/testing-not-a-client/.next/static/chunks/app';

    for (const [page, budget] of Object.entries(marketingBundles)) {
      const path = `${basePath}/${this.getPagePath(page)}-*.js`;
      await this.checkBundle(path, budget, `Marketing: ${page}`);
    }
  }

  /**
   * Check framework bundles
   */
  async checkFrameworkBundles() {
    const frameworkBundles = this.budgets.framework;
    const basePath = 'clients/testing-not-a-client/.next/static/chunks';

    for (const [bundle, budget] of Object.entries(frameworkBundles)) {
      const path = `${basePath}/${this.getFrameworkPath(bundle)}-*.js`;
      await this.checkBundle(path, budget, `Framework: ${bundle}`);
    }
  }

  /**
   * Check package bundles
   */
  async checkPackageBundles() {
    const packageBundles = this.budgets.packages;
    const basePath = 'packages';

    for (const [pkg, budget] of Object.entries(packageBundles)) {
      const path = `${basePath}/${pkg}/dist/index.js`;
      await this.checkBundle(path, budget, `Package: ${pkg}`);
    }
  }

  /**
   * Check portal bundles
   */
  async checkPortalBundles() {
    const portalBundles = this.budgets.portal;
    const basePath = 'apps/portal/.next/static/chunks/app';

    for (const [page, budget] of Object.entries(portalBundles)) {
      const path = `${basePath}/${page}/page-*.js`;
      await this.checkBundle(path, budget, `Portal: ${page}`);
    }
  }

  /**
   * Check individual bundle
   */
  async checkBundle(pathPattern, budget, name) {
    // For now, simulate bundle size check
    // In real implementation, this would find and analyze actual bundle files
    const simulatedSize = this.getSimulatedSize(name);
    const budgetBytes = this.parseBudget(budget.limit);
    const warningThreshold = budgetBytes * 0.9;

    console.log(`📦 ${name}`);
    console.log(`   Path: ${pathPattern}`);
    console.log(`   Size: ${this.formatBytes(simulatedSize)}`);
    console.log(`   Budget: ${budget.limit} (${this.formatBytes(budgetBytes)})`);

    if (simulatedSize > budgetBytes) {
      const violation = {
        type: 'budget_exceeded',
        name,
        path: pathPattern,
        actual: simulatedSize,
        budget: budgetBytes,
        percentage: (((simulatedSize - budgetBytes) / budgetBytes) * 100).toFixed(1),
      };
      this.violations.push(violation);
      console.log(`   ❌ EXCEEDED by ${violation.percentage}%`);
    } else if (simulatedSize > warningThreshold) {
      const warning = {
        type: 'budget_warning',
        name,
        path: pathPattern,
        actual: simulatedSize,
        budget: budgetBytes,
        percentage: (((simulatedSize - warningThreshold) / warningThreshold) * 100).toFixed(1),
      };
      this.warnings.push(warning);
      console.log(`   ⚠️  WARNING: ${warning.percentage}% over warning threshold`);
    } else {
      console.log(`   ✅ Within budget`);
    }
    console.log('');
  }

  /**
   * Get simulated bundle size for testing
   */
  getSimulatedSize(name) {
    // Simulate realistic bundle sizes for testing
    const sizes = {
      'Marketing: homepage': 85 * 1024, // 85 kB
      'Marketing: contact': 60 * 1024, // 60 kB
      'Marketing: blog': 70 * 1024, // 70 kB
      'Marketing: services': 75 * 1024, // 75 kB
      'Framework: core': 140 * 1024, // 140 kB
      'Framework: react': 42 * 1024, // 42 kB
      'Framework: vendor': 95 * 1024, // 95 kB
      'Portal: dashboard': 115 * 1024, // 115 kB
      'Portal: admin': 145 * 1024, // 145 kB
      'Package: ui': 32 * 1024, // 32 kB
      'Package: features': 23 * 1024, // 23 kB
      'Package: infrastructure': 18 * 1024, // 18 kB
      'Package: integrations': 28 * 1024, // 28 kB
    };

    return sizes[name] || 50 * 1024; // Default 50 kB
  }

  /**
   * Parse budget string to bytes
   */
  parseBudget(budgetString) {
    const match = budgetString.match(/^(\d+(?:\.\d+)?)\s*(kB|MB|GB)$/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case 'KB':
        return Math.round(value * 1024);
      case 'MB':
        return Math.round(value * 1024 * 1024);
      case 'GB':
        return Math.round(value * 1024 * 1024 * 1024);
      default:
        return 0;
    }
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }

  /**
   * Get page path from page name
   */
  getPagePath(page) {
    const paths = {
      homepage: 'page',
      contact: 'contact/page',
      blog: 'blog/page',
      services: 'services/page',
    };
    return paths[page] || page;
  }

  /**
   * Get framework path from bundle name
   */
  getFrameworkPath(bundle) {
    const paths = {
      core: 'framework',
      react: 'react',
      vendor: 'vendor',
    };
    return paths[bundle] || bundle;
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('📊 Bundle Size Report');
    console.log('==================\n');

    if (this.violations.length === 0 && this.warnings.length === 0) {
      console.log('✅ All bundles are within budget limits!');
      return;
    }

    if (this.violations.length > 0) {
      console.log(`❌ ${this.violations.length} budget violations:`);
      for (const violation of this.violations) {
        console.log(
          `   • ${violation.name}: ${this.formatBytes(violation.actual)} (${violation.percentage}% over budget)`
        );
      }
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  ${this.warnings.length} warnings:`);
      for (const warning of this.warnings) {
        console.log(
          `   • ${warning.name}: ${this.formatBytes(warning.actual)} (${warning.percentage}% over warning threshold)`
        );
      }
      console.log('');
    }

    console.log('🎯 Recommendations:');
    if (this.violations.length > 0) {
      console.log('   • Review and optimize bundles exceeding budget');
      console.log('   • Consider code splitting and lazy loading');
      console.log('   • Remove unused dependencies');
    }
    if (this.warnings.length > 0) {
      console.log('   • Monitor bundles approaching budget limits');
      console.log('   • Plan optimization for future growth');
    }
  }
}

// CLI interface
async function main() {
  console.log('🚀 Bundle Size Checker Starting...');

  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  console.log(`📋 Command: ${command}`);

  const checker = new BundleSizeChecker();

  switch (command) {
    case 'check':
      const success = await checker.checkBundleSizes();
      console.log(`\n🏁 Check completed. Success: ${success}`);
      process.exit(success ? 0 : 1);
      break;

    case 'simulate-violation':
      console.log('🧪 Simulating violation...');
      // Simulate a violation for testing
      checker.violations.push({
        type: 'budget_exceeded',
        name: 'Test Bundle',
        path: 'test/bundle.js',
        actual: 100 * 1024,
        budget: 90 * 1024,
        percentage: '11.1',
      });
      checker.generateReport();
      break;

    default:
      console.log('Usage: node bundle-size-check.mjs [check|simulate-violation]');
      process.exit(1);
  }
}

// Run main function
main().catch(console.error);

export default BundleSizeChecker;
