/**
 * @file e2e/tests/portal/billing.spec.ts
 * @summary E2E tests for billing portal functionality and plan display.
 * @description Verifies billing page renders correctly and shows current plan information.
 * @security Tests billing UI only; no payment processing or sensitive financial data.
 * @adr none
 * @requirements E2E-BILLING-001, billing-tests
 */

import { expect, test } from '../../fixtures';

test.describe('Billing portal', () => {
  test('displays current plan correctly', async ({ page }) => {
    await page.goto('/billing');

    await expect(page.getByText('Current Plan')).toBeVisible();
    // Check for any plan heading rather than hardcoded names
    await expect(page.locator('[role="heading"]').first()).toBeVisible();
  });

  test('manage subscription button appears for current plan', async ({ page }) => {
    await page.goto('/billing');

    await expect(page.getByRole('button', { name: /manage subscription/i })).toBeVisible();
  });

  test('displays plan options', async ({ page }) => {
    await page.goto('/billing');

    // Look for plan cards or pricing sections
    await expect(page.locator('[data-testid="plan-card"]').first()).toBeVisible();
  });
});
