import { test, expect } from '@playwright/test'

test('homepage is accessible and skip link works', async ({ page }) => {
  await page.goto('/')

  const heading = page.getByRole('heading', { name: /your dedicated marketer/i })
  await expect(heading).toBeVisible()

  await page.getByRole('link', { name: /skip to main content/i }).press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})
