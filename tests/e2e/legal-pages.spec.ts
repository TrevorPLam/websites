import { test, expect } from '@playwright/test'

/**
 * Legal pages smoke test
 *
 * Ensures the placeholder privacy/terms pages render and are reachable from the footer.
 */
test('privacy and terms pages render', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible()
  await expect(page.getByText(/placeholder/i)).toBeVisible()

  await page.goto('/terms')
  await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible()
  await expect(page.getByText(/placeholder/i)).toBeVisible()
})

test('footer links navigate to legal pages', async ({ page }) => {
  await page.goto('/')

  const footer = page.getByRole('contentinfo')
  await footer.getByRole('link', { name: /privacy policy/i }).click()
  await expect(page).toHaveURL(/\/privacy$/)

  await footer.getByRole('link', { name: /terms of service/i }).click()
  await expect(page).toHaveURL(/\/terms$/)
})
