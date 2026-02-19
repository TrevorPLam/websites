/**
 * @file scripts/test/a11y-check.ts
 * @summary Accessibility test runner using jest-axe
 * @see tasks/d-6-a11y-release-gate.md
 *
 * Purpose: Runs accessibility tests across all component test files
 *          that use jest-axe, ensuring WCAG 2.2 AA compliance.
 *
 * Exports / Entry: CLI script
 * Used by: CI workflow, pre-commit hooks (optional)
 *
 * Invariants:
 * - All component tests should use jest-axe
 * - Tests must render components before checking
 * - Violations block CI merge
 *
 * Status: @public
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

/**
 * Runs accessibility tests using Jest
 * Filters to only jsdom environment tests (component tests)
 */
function runA11yTests(): void {
  const jestConfig = resolve(__dirname, '../../jest.config.js');
  const testPattern = '--testMatch="**/__tests__/**/*.test.{ts,tsx}"';

  console.log('🔍 Running accessibility tests with jest-axe...\n');

  try {
    // Run Jest with jsdom environment (component tests)
    // Filter to tests that use jest-axe (accessibility tests)
    execSync(
      `pnpm jest --testEnvironment=jsdom --testMatch="**/__tests__/**/*.test.{ts,tsx}" --testNamePattern="accessibility|a11y|has no accessibility violations" --passWithNoTests`,
      {
        stdio: 'inherit',
        cwd: resolve(__dirname, '../..'),
        env: { ...process.env },
      }
    );

    console.log('\n✅ Accessibility tests passed!');
  } catch (error) {
    console.error('\n❌ Accessibility tests failed!');
    console.error('Fix accessibility violations before merging.');
    console.error('\n💡 Tip: Run individual component tests to see detailed violation reports.');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runA11yTests();
}

export { runA11yTests };
