import { test, expect } from '@playwright/test'

test('homepage to services to contact form flow', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Services' }).click()
  await expect(page).toHaveURL(/\/services/)

  await page.getByRole('button', { name: /schedule free consultation/i }).click()
  await expect(page).toHaveURL(/\/contact/)

  await expect(page.getByRole('form', { name: /contact form/i })).toBeVisible()
})

test('blog listing to blog post to CTA', async ({ page }) => {
  await page.goto('/blog')

  const firstPost = page.getByRole('link', { name: /read more/i }).first()
  await firstPost.click()

  await expect(page).toHaveURL(/\/blog\//)
  await page.getByRole('link', { name: /get started today/i }).click()

  await expect(page).toHaveURL(/\/contact/)
})

test('mobile navigation flow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  await page.getByRole('button', { name: /toggle mobile menu/i }).click()
  await page.getByRole('link', { name: /blog/i }).click()

  await expect(page).toHaveURL(/\/blog/)
})

test('contact form validation', async ({ page }) => {
  await page.goto('/contact')

  await page.getByRole('button', { name: /send message/i }).click()

  await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible()
  await expect(page.getByText(/invalid email address/i)).toBeVisible()
  await expect(page.getByText(/message must be at least 10 characters/i)).toBeVisible()
})

test('404 page handling', async ({ page }) => {
  await page.goto('/non-existent-page')

  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible()
})
