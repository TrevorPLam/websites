import { test, expect } from '@playwright/test'

// Extend Window interface for Google Analytics dataLayer
declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

test('ga4 script is injected when analytics id is configured', async ({ page }) => {
  await page.goto('/')

  const script = page.locator('script[src*="googletagmanager.com/gtag/js"]')
  await expect(script).toHaveAttribute('src', /G-TEST-LOCAL/)

  await page.waitForFunction(() => Array.isArray(window.dataLayer))
})
