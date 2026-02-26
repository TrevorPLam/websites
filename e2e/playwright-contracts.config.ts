import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Contract Testing
 * 
 * Configuration for provider and consumer contract testing
 * Validates API compatibility and prevents breaking changes
 */

export default defineConfig({
  testDir: './contracts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-contracts-report', open: 'never' }],
    ['json', { outputFile: 'contract-test-results.json' }],
    ['junit', { outputFile: 'contract-test-results.xml' }],
    ['list'],
  ],
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'contract-providers',
      testMatch: '**/providers/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
    {
      name: 'contract-consumers',
      testMatch: '**/consumers/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
    {
      name: 'contract-evolution',
      testMatch: '**/evolution/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter portal run start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter web run start',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  globalSetup: './contracts/global-setup.ts',
  globalTeardown: './contracts/global-teardown.ts',
});
