/**
 * @file scripts/test/a11y-check.ts
 * @summary Accessibility test runner using vitest and axe-core
 * @security Read-only script, no sensitive data access or modification.
 * @adr none
 * @requirements WCAG 2.2 AA compliance
 * @see tasks/d-6-a11y-release-gate.md
 *
 * Purpose: Runs accessibility tests across all component test files
 *          that use jest-axe, ensuring WCAG 2.2 AA compliance.
 *
 * Exports / Entry: CLI script
 * Used by: CI workflow, pre-commit hooks (optional)
 *
 * Invariants:
 * - All component tests should use jest-axe (compatible with Vitest)
 * - Tests must render components before checking
 * - Violations block CI merge
 *
 * Status: @public
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

/**
 * Runs accessibility tests using Vitest
 * Filters to only jsdom environment tests (component tests)
 */
function runA11yTests(): void {
  console.log('🔍 Running accessibility tests with axe-core...\n');

  try {
    // Run Vitest with jsdom environment (component tests)
    // Filter to tests that use jest-axe (accessibility tests)
    execSync(
      `pnpm vitest run --testEnvironment=jsdom --testMatch="**/__tests__/**/*.test.{ts,tsx}" --testNamePattern="accessibility|a11y|has no accessibility violations" --passWithNoTests`,
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
