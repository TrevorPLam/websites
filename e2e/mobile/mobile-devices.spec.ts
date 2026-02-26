/**
 * @file e2e/mobile/mobile-devices.spec.ts
 * @summary Mobile device testing with touch interactions and performance benchmarks.
 * @description Tests mobile responsiveness, touch interactions, and performance.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements MOBILE-TESTING-001, MOBILE-PERF-001
 */

import { devices } from '@playwright/test';
import { expect, test } from '../fixtures';

test.describe('Mobile Device Testing', () => {
  test.describe('iPhone 13', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should render correctly on iPhone 13', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: mobile should load in under 4 seconds
      expect(loadTime).toBeLessThan(4000);

      // Verify mobile viewport is applied
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(414);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should handle touch interactions on iPhone 13', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test tap interactions
      const navigationButton = page.getByRole('button').first();
      await navigationButton.tap();

      // Test touch targets meet WCAG 2.2 AA requirements (44x44 CSS pixels minimum)
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should have responsive navigation on iPhone 13', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Check for mobile menu button
      const menuButton = page
        .getByRole('button')
        .or(page.getByLabel('menu').or(page.locator('[aria-label="menu"]')))
        .first();

      if (await menuButton.isVisible()) {
        // Test mobile menu toggle
        await menuButton.tap();

        // Verify navigation items are now visible
        const navItems = page.getByRole('navigation').getByRole('link');
        await expect(navItems.first()).toBeVisible();
      }
    });
  });

  test.describe('Pixel 7', () => {
    test.use({ ...devices['Pixel 7'] });

    test('should render correctly on Pixel 7', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: mobile should load in under 4 seconds
      expect(loadTime).toBeLessThan(4000);

      // Verify mobile viewport is applied
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(414);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should handle touch interactions on Pixel 7', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test tap interactions
      const navigationButton = page.getByRole('button').first();
      await navigationButton.tap();

      // Test touch targets meet WCAG 2.2 AA requirements
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
});
