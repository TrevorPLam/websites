import { test, expect } from '@playwright/test'

test('ga4 script is injected when analytics id is configured', async ({ page }) => {
  await page.goto('/')

  const script = page.locator('script[src*="googletagmanager.com/gtag/js"]')
  await expect(script).toHaveAttribute('src', /G-TEST-LOCAL/)

  await page.waitForFunction(() => Array.isArray(window.dataLayer))
})
