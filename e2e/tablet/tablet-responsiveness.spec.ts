/**
 * @file e2e/tablet/tablet-responsiveness.spec.ts
 * @summary Tablet responsiveness testing with UI pattern validation.
 * @description Tests tablet layouts and device-specific UI patterns.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements TABLET-RESPONSIVE-001, TABLET-PERF-001
 */

import { devices } from '@playwright/test';
import { expect, test } from '../fixtures';

test.describe('Tablet Responsiveness Testing', () => {
  test.describe('iPad Pro', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should render correctly on iPad Pro', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: tablet should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify tablet viewport dimensions
      const viewport = page.viewportSize();
      expect(viewport.width).toBeGreaterThanOrEqual(768);
      expect(viewport.width).toBeLessThanOrEqual(1368);

      // Check critical elements are visible and properly sized
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();

      // Verify content utilizes tablet screen space effectively
      const mainContent = page.getByRole('main');
      const mainBox = await mainContent.boundingBox();
      if (mainBox && viewport) {
        const contentWidthRatio = mainBox.width / viewport.width;
        // Main content should use at least 70% of screen width on tablet
        expect(contentWidthRatio).toBeGreaterThan(0.7);
      }
    });

    test('should have optimized navigation on iPad Pro', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();

      // Check if navigation adapts to tablet layout
      const navBox = await navigation.boundingBox();
      const viewport = page.viewportSize();

      if (navBox && viewport) {
        // Navigation should be horizontal on tablet (not collapsed mobile menu)
        const navWidthRatio = navBox.width / viewport.width;
        expect(navWidthRatio).toBeGreaterThan(0.8);
      }
    });

    test('should handle touch interactions on iPad Pro', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test touch targets meet tablet requirements (larger than mobile)
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          // Tablet touch targets should be at least 48x48 CSS pixels
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(48);
        }
      }

      // Test tap response time
      const button = page.getByRole('button').first();
      const startTime = performance.now();
      await button.tap();
      const responseTime = performance.now() - startTime;

      // Tap response should be under 50ms for good UX
      expect(responseTime).toBeLessThan(50);
    });
  });

  test.describe('iPad', () => {
    test.use({ ...devices['iPad'] });

    test('should render correctly on iPad', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: tablet should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify tablet viewport dimensions
      const viewport = page.viewportSize();
      expect(viewport.width).toBeGreaterThanOrEqual(768);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should have proper content layout on iPad', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test typography scales appropriately for tablet
      const headings = await page.getByRole('heading').all();
      for (const heading of headings.slice(0, 3)) {
        const fontSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);
        const fontSizeValue = parseInt(fontSize);

        // Tablet headings should be appropriately sized (between mobile and desktop)
        expect(fontSizeValue).toBeGreaterThanOrEqual(20);
        expect(fontSizeValue).toBeLessThanOrEqual(48);
      }
    });
  });
});
