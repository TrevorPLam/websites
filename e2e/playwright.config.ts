import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const AUTH_PATHS = {
  agencyOwner: path.join(__dirname, '.auth/agency-owner.json'),
  tenant1Admin: path.join(__dirname, '.auth/tenant1-admin.json'),
  tenant2Admin: path.join(__dirname, '.auth/tenant2-admin.json'),
  superAdmin: path.join(__dirname, '.auth/super-admin.json'),
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['github'], ['list']],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'auth-setup',
      testMatch: '**/*.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'agency-owner',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_PATHS.agencyOwner,
      },
      testMatch: '**/portal/**/*.spec.ts',
    },
    {
      name: 'tenant-admin',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_PATHS.tenant1Admin,
      },
      testMatch: '**/tenant/**/*.spec.ts',
    },
    {
      name: 'super-admin',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_PATHS.superAdmin,
      },
      testMatch: '**/admin/**/*.spec.ts',
    },
    {
      name: 'public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/public/**/*.spec.ts',
    },
    {
      name: 'public-mobile',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/public/**/*.spec.ts',
    },
    {
      name: 'a11y',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/a11y/**/*.spec.ts',
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
});
