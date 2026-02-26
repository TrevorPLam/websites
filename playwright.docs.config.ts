import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Documentation Testing
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation
 * Includes visual regression testing and accessibility compliance
 */

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Visual regression settings
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Accessibility settings
    colorScheme: 'light',
    reducedMotion: 'reduce',
    
    // Screenshot settings
    ignoreHTTPSErrors: true,
    bypassCSP: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/docs-visual/**/*.spec.ts',
      dependencies: ['start-docs'],
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/docs-visual/**/*.spec.ts',
      dependencies: ['start-docs'],
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/docs-visual/**/*.spec.ts',
      dependencies: ['start-docs'],
    },
    
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/docs-visual/**/*.spec.ts',
      dependencies: ['start-docs'],
    },
    
    {
      name: 'tablet-safari',
      use: { ...devices['iPad Pro'] },
      testMatch: '**/docs-visual/**/*.spec.ts',
      dependencies: ['start-docs'],
    },
    
    // Documentation server
    {
      name: 'start-docs',
      testMatch: [],
      teardown: 'stop-docs',
      use: {
        command: 'cd docs && npm run build && npm run serve',
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120000, // 2 minutes
      },
    },
    
    {
      name: 'stop-docs',
      testMatch: [],
      teardown: 'cleanup',
      use: {
        command: 'pkill -f "docusaurus serve" || true',
      },
    },
  ],

  // Global setup and teardown
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  // Test timeout
  timeout: 60000, // 1 minute per test
  
  // Output directory
  outputDir: 'test-results/',
  
  // Web server
  webServer: {
    command: 'cd docs && npm run build && npm run serve',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Visual regression configuration
  expect: {
    // Screenshot comparison options
    toHaveScreenshot: {
      threshold: 0.2, // Allow for small differences
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.01,
      animationDetection: true,
    },
    
    // Accessibility options
    toMatchA11ySnapshot: {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true },
        'heading-order': { enabled: true },
        'landmark-roles': { enabled: true },
      },
    },
  },

  // Metadata for test organization
  metadata: {
    'Test Environment': process.env.NODE_ENV || 'development',
    'Documentation Version': '2026',
    'Browser Versions': ['Chrome', 'Firefox', 'Safari'],
    'Viewports': ['Desktop', 'Mobile', 'Tablet'],
    'Accessibility Standards': 'WCAG 2.2 AA',
    'Visual Regression': true,
  },
});
