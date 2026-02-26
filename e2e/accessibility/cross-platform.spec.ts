/**
 * @file e2e/accessibility/cross-platform.spec.ts
 * @summary Cross-platform accessibility testing with WCAG 2.2 AA compliance.
 * @description Tests accessibility across desktop, mobile, and tablet platforms.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements A11Y-CROSS-001, A11Y-WCAG22-001
 */

import { devices } from '@playwright/test';
import { getViolations, injectAxe } from 'axe-playwright';
import { expect, test } from '../fixtures';

test.describe('Cross-Platform Accessibility Testing', () => {
  test.describe('Desktop Chrome Accessibility', () => {
    test.use({ ...devices['Desktop Chrome'] });

    test('should have no critical accessibility violations', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      await injectAxe(page);

      const results = await getViolations(page, undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });

      const critical = results.filter((v) => v.impact === 'critical' || v.impact === 'serious');

      if (critical.length > 0) {
        console.error('Accessibility violations:', JSON.stringify(critical, null, 2));
      }

      expect(critical).toHaveLength(0);
    });

    test('should be keyboard navigable', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test sequential keyboard navigation
      await page.keyboard.press('Tab');
      const firstFocused = page.locator(':focus');
      await expect(firstFocused).toBeVisible();

      // Test multiple tab presses
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const thirdFocused = page.locator(':focus');
      await expect(thirdFocused).toBeVisible();
    });

    test('should have proper focus management', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test focus indicators
      await page.keyboard.press('Tab');
      const firstFocused = page.locator(':focus');

      if (await firstFocused.isVisible()) {
        // Check for visible focus indicator
        const styles = await firstFocused.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineOffset: computed.outlineOffset,
            boxShadow: computed.boxShadow,
          };
        });

        // Should have some form of focus indicator
        const hasFocusIndicator =
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          styles.outlineOffset !== '0px';

        expect(hasFocusIndicator).toBeTruthy();
      }
    });

    test('should have sufficient color contrast', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      await injectAxe(page);

      // Check color contrast violations
      const contrastResults = await getViolations(page, undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      const contrastViolations = contrastResults.filter((v) => v.id === 'color-contrast');

      if (contrastViolations.length > 0) {
        console.error('Color contrast violations:', JSON.stringify(contrastViolations, null, 2));
      }

      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should have no critical accessibility violations on mobile', async ({
      page,
      tenantDomain,
    }) => {
      await page.goto(`http://${tenantDomain}/`);
      await injectAxe(page);

      const results = await getViolations(page, undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });

      const critical = results.filter((v) => v.impact === 'critical' || v.impact === 'serious');

      if (critical.length > 0) {
        console.error('Mobile accessibility violations:', JSON.stringify(critical, null, 2));
      }

      expect(critical).toHaveLength(0);
    });

    test('should have accessible touch targets on mobile', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // WCAG 2.2: Touch targets should be at least 24x24 CSS pixels
      const buttons = await page.getByRole('button').all();

      for (const button of buttons.slice(0, 5)) {
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox();

          if (boundingBox) {
            const minDimension = Math.min(boundingBox.width, boundingBox.height);
            expect(minDimension).toBeGreaterThanOrEqual(24);

            // For better accessibility on mobile, recommend 44x44
            expect(minDimension).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });

  test.describe('Tablet Accessibility', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should have no critical accessibility violations on tablet', async ({
      page,
      tenantDomain,
    }) => {
      await page.goto(`http://${tenantDomain}/`);
      await injectAxe(page);

      const results = await getViolations(page, undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });

      const critical = results.filter((v) => v.impact === 'critical' || v.impact === 'serious');

      if (critical.length > 0) {
        console.error('Tablet accessibility violations:', JSON.stringify(critical, null, 2));
      }

      expect(critical).toHaveLength(0);
    });

    test('should handle both touch and keyboard on tablet', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const firstFocused = page.locator(':focus');
      await expect(firstFocused).toBeVisible();

      // Test touch interactions
      const button = page.getByRole('button').first();
      if (await button.isVisible()) {
        await button.tap();

        // Touch targets should be at least 48x48 on tablet
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(48);
        }
      }
    });
  });
});
