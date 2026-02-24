import { test, expect } from '../../fixtures';

test.describe('Billing portal', () => {
  test('displays current plan correctly', async ({ page }) => {
    await page.goto('/billing');

    await expect(page.getByText('Current Plan')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Starter' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Professional' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Enterprise' })).toBeVisible();
  });

  test('manage subscription button appears for current plan', async ({ page }) => {
    await page.goto('/billing');

    await expect(page.getByRole('button', { name: 'Manage Subscription' })).toBeVisible();
  });
});
