import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Visual Regression Testing
 * 
 * Extends the base configuration with visual testing specific settings
 * Includes component testing, theme testing, and responsive testing
 */

export default defineConfig({
  testDir: './visual',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-visual-report', open: 'never' }],
    ['json', { outputFile: 'visual-test-results.json' }],
    ['list'],
  ],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.STORYBOOK_URL ?? 'http://localhost:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'visual-chrome',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },
    {
      name: 'visual-firefox',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1200, height: 800 },
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },
    {
      name: 'visual-mobile',
      testMatch: '**/responsive/**/*.spec.ts',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'visual-tablet',
      testMatch: '**/responsive/**/*.spec.ts',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @repo/ui run storybook',
      url: 'http://localhost:6006',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
