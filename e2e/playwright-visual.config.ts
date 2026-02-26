/**
 * @file e2e/playwright-visual.config.ts
 * @summary Playwright configuration for visual regression testing across browsers and viewports.
 * @description Configures cross-browser visual testing with Storybook integration for comprehensive UI regression detection.
 * @security Handles test authentication files securely; no production credentials.
 * @adr none
 * @requirements VISUAL-001, cross-browser-testing, responsive-testing
 */

import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export const AUTH_PATHS = {
  agencyOwner: path.join(__dirname, '.auth/agency-owner.json'),
  tenant1Admin: path.join(__dirname, '.auth/tenant1-admin.json'),
  tenant2Admin: path.join(__dirname, '.auth/tenant2-admin.json'),
  superAdmin: path.join(__dirname, '.auth/super-admin.json'),
};

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
    // Visual testing specific expectations
    toHaveScreenshot: {
      threshold: 0.2, // Allow for small anti-aliasing differences
      maxDiffPixels: 1000, // Maximum number of different pixels
      maxDiffPixelRatio: 0.01, // Maximum ratio of different pixels
    },
  },
  use: {
    baseURL: process.env.STORYBOOK_URL ?? 'http://localhost:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Visual testing specific settings
    ignoreHTTPSErrors: true,
    colorScheme: 'light',
  },
  projects: [
    // Desktop browsers - Cross-browser visual testing
    {
      name: 'visual-chrome',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },
    {
      name: 'visual-firefox',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },
    {
      name: 'visual-webkit',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },

    // Mobile viewports - Responsive design testing
    {
      name: 'visual-mobile',
      testMatch: '**/responsive/**/*.spec.ts',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'visual-mobile-chrome',
      testMatch: '**/responsive/**/*.spec.ts',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
      },
    },

    // Tablet viewports - Responsive design testing
    {
      name: 'visual-tablet',
      testMatch: '**/responsive/**/*.spec.ts',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },

    // High DPI displays - Visual fidelity testing
    {
      name: 'visual-high-dpi',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },

    // Dark mode testing
    {
      name: 'visual-dark-mode',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark',
      },
      testIgnore: ['**/responsive/**/*.spec.ts'],
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @repo/ui run storybook --port 6006',
      url: 'http://localhost:6006',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
