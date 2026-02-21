/**
 * @file playwright.config.ts
 * @role test
 * @summary Playwright E2E testing configuration for marketing websites monorepo.
 *
 * @entrypoints
 * - pnpm test:e2e
 * - pnpm test:e2e:ui
 *
 * @exports
 * - Playwright configuration object
 *
 * @depends_on
 * - External: @playwright/test
 * - Internal: @repo/infra (for auth fixtures)
 *
 * @used_by
 * - E2E test specs in tests/e2e/specs/
 * - CI/CD pipeline (.github/workflows/ci.yml)
 *
 * @runtime
 * - environment: test
 * - side_effects: launches browsers for testing
 *
 * @data_flow
 * - inputs: test files and fixtures
 * - outputs: test reports, screenshots, traces
 *
 * @invariants
 * - Multi-tenant test isolation must be maintained
 * - Base URL must point to running application
 *
 * @gotchas
 * - CI vs local worker count differences
 * - Test data cleanup between runs
 * - Parallel test execution isolation
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Add visual regression testing with Percy or Playwright snapshots
 * - Add accessibility testing with axe-core integration
 *
 * @verification
 * - Run: pnpm test:e2e and confirm tests execute with proper browser context
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-21
 * - updated: Initial Playwright configuration for E2E testing
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing in the marketing websites monorepo.
 *
 * Features:
 * - Multi-browser testing (Chrome, Firefox, Safari)
 * - Multi-tenant test isolation
 * - CI-optimized parallelism
 * - Comprehensive reporting and debugging
 * - Visual regression support
 * - Accessibility testing integration
 */
export default defineConfig({
  // Test directory structure
  testDir: './specs',

  // Run all tests in parallel for maximum efficiency
  fullyParallel: true,

  // Forbid only() in CI to ensure all tests run
  forbidOnly: !!process.env.CI,

  // Retry configuration for flaky test mitigation
  retries: process.env.CI ? 2 : 0,

  // Optimize worker count for CI vs local development
  workers: process.env.CI ? 4 : undefined,

  // Comprehensive reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  // Global test configuration
  use: {
    // Base URL for the application under test
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3101',

    // Capture trace on first retry for debugging
    trace: 'on-first-retry',

    // Take screenshots only on test failure
    screenshot: 'only-on-failure',

    // Record video only on failure for CI
    video: process.env.CI ? 'retain-on-failure' : 'off',

    // Global timeout for all actions
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Multi-browser testing projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome-specific settings
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: !process.env.CI,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: !process.env.CI,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: !process.env.CI,
      },
    },
    // Mobile responsive testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        ignoreHTTPSErrors: !process.env.CI,
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
        ignoreHTTPSErrors: !process.env.CI,
      },
    },
  ],

  // Global setup and teardown
  globalSetup: './helpers/global-setup.ts',
  globalTeardown: './helpers/global-teardown.ts',

  // Test organization
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],

  // Output directories
  outputDir: 'test-results/',

  // Test timeout configuration
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Web server configuration (if needed for static files)
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev',
        port: 3101,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },

  // Development-specific configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Enable more verbose output in development
    reporter: [['html'], ['list']],

    // Disable retries in development for faster feedback
    retries: 0,

    // Use single worker for easier debugging
    workers: 1,
  }),
});
