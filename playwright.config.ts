import { defineConfig, devices } from '@playwright/test'
import { TEST } from './lib/constants'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: TEST.PLAYWRIGHT_TIMEOUT_MS,
  expect: {
    timeout: TEST.PLAYWRIGHT_EXPECT_TIMEOUT_MS,
  },
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || TEST.DEFAULT_DEV_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: TEST.DEFAULT_DEV_URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      ...process.env,
      NEXT_PUBLIC_ANALYTICS_ID: 'G-TEST-LOCAL',
    },
  },
})
