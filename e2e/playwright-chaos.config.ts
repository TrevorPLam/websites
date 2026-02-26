import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Chaos Engineering Tests
 * 
 * Configuration for running chaos engineering scenarios
 * Includes database, external services, infrastructure, and application layer tests
 */

export default defineConfig({
  testDir: './chaos',
  fullyParallel: false, // Chaos tests should not run in parallel to avoid interference
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker for chaos tests to control environment
  reporter: [
    ['html', { outputFolder: 'playwright-chaos-report', open: 'never' }],
    ['json', { outputFile: 'chaos-test-results.json' }],
    ['list'],
  ],
  timeout: 120_000, // Longer timeout for chaos scenarios
  expect: {
    timeout: 30_000, // Longer expect timeout for chaos recovery
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chaos-database',
      testMatch: '**/database/**/*.chaos.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
    {
      name: 'chaos-external-services',
      testMatch: '**/external-services/**/*.chaos.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
    {
      name: 'chaos-infrastructure',
      testMatch: '**/infrastructure/**/*.chaos.test.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
    },
    {
      name: 'chaos-application',
      testMatch: '**/application/**/*.chaos.test.ts',
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
      timeout: 180_000, // Longer startup time for chaos testing
    },
    {
      command: 'pnpm --filter web run start',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
  globalSetup: './chaos/global-setup.ts',
  globalTeardown: './chaos/global-teardown.ts',
});
