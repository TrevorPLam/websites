/**
 * @file e2e/accessibility/cross-platform.spec.ts
<<<<<<< Updated upstream
 * @summary Cross-platform accessibility testing with WCAG 2.2 AA compliance.
 * @description Tests accessibility across desktop, mobile, and tablet platforms.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements A11Y-CROSS-001, A11Y-WCAG22-001
=======
 * @summary Comprehensive cross-platform accessibility testing with WCAG 2.2 AA compliance.
 * @description Tests accessibility across desktop, mobile, and tablet platforms with screen readers and keyboard navigation.
 * @security Tests use tenant isolation; no production data accessed.
 * @adr none
 * @requirements A11Y-CROSS-001, A11Y-WCAG22-001, A11Y-SCREEN-READER-001
>>>>>>> Stashed changes
 */

import { devices } from '@playwright/test';
import { getViolations, injectAxe } from 'axe-playwright';
import { expect, test } from '../fixtures';

<<<<<<< Updated upstream
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
=======
// Cross-platform device configurations
const ACCESSIBILITY_DEVICES = {
  'Desktop Chrome': devices['Desktop Chrome'],
  'iPhone 13': devices['iPhone 13'],
  'iPad Pro': devices['iPad Pro'],
};

test.describe('Cross-Platform Accessibility Testing', () => {
  Object.entries(ACCESSIBILITY_DEVICES).forEach(([deviceName, deviceConfig]) => {
    test.describe(`${deviceName} Accessibility`, () => {
      test.use({ ...deviceConfig });

      test(`should have no critical accessibility violations on ${deviceName}`, async ({
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
          console.error(
            `Accessibility violations on ${deviceName}:`,
            JSON.stringify(critical, null, 2)
          );
        }

        expect(critical).toHaveLength(0);
      });

      test(`should be keyboard navigable on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);

        // Test sequential keyboard navigation
        const focusableElements = [
          page.getByRole('link'),
          page.getByRole('button'),
          page.locator('input'),
          page.locator('textarea'),
          page.locator('select'),
        ];

        let previousElement = null;

        for (const elementSelector of focusableElements) {
          const elements = await elementSelector.all();

          for (const element of elements.slice(0, 3)) {
            // Test first 3 elements of each type
            if (await element.isVisible()) {
              await page.keyboard.press('Tab');

              const focusedElement = page.locator(':focus');
              await expect(focusedElement).toBeVisible();

              // Ensure focus is moving to new elements
              if (previousElement) {
                expect(await focusedElement.evaluate((el) => el === previousElement)).toBeFalsy();
              }

              previousElement = await focusedElement.evaluate((el) => el);
            }
          }
        }

        // Test Shift+Tab for reverse navigation
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Shift+Tab');

        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      });

      test(`should have proper focus management on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
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

        // Test focus trapping in modals (if present)
        const modalButtons = page.getByRole('button', { name: /open|dialog|modal/i });

        for (const button of modalButtons.slice(0, 2)) {
          if (await button.isVisible()) {
            await button.click();

            // Test that focus stays within modal
            await page.keyboard.press('Tab');
            const modalFocus = page.locator(':focus');

            // Focus should be within the modal
            const modal = page.locator('[role="dialog"], .modal, .dialog').first();
            if (await modal.isVisible()) {
              const modalBox = await modal.boundingBox();
              const focusBox = await modalFocus.boundingBox();

              if (modalBox && focusBox) {
                // Focus should be within modal bounds
                expect(focusBox.x).toBeGreaterThanOrEqual(modalBox.x);
                expect(focusBox.y).toBeGreaterThanOrEqual(modalBox.y);
                expect(focusBox.x + focusBox.width).toBeLessThanOrEqual(
                  modalBox.x + modalBox.width
                );
                expect(focusBox.y + focusBox.height).toBeLessThanOrEqual(
                  modalBox.y + modalBox.height
                );
              }
            }

            // Close modal (Escape key)
            await page.keyboard.press('Escape');
          }
        }
      });

      test(`should have proper ARIA labels and roles on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        // Test landmark roles
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
        await expect(page.getByRole('contentinfo')).toBeVisible();

        // Test form labels
        const inputs = page.locator('input').all();

        for (const input of inputs.slice(0, 5)) {
          if (await input.isVisible()) {
            // Check for associated label
            const inputId = await input.getAttribute('id');

            if (inputId) {
              const label = page.locator(`label[for="${inputId}"]`);
              if (await label.isVisible()) {
                await expect(label).toBeVisible();
              } else {
                // Check aria-label or aria-labelledby
                const ariaLabel = await input.getAttribute('aria-label');
                const ariaLabelledBy = await input.getAttribute('aria-labelledby');

                expect(ariaLabel || ariaLabelledBy).toBeTruthy();
              }
            } else {
              // Check aria-label if no id
              const ariaLabel = await input.getAttribute('aria-label');
              expect(ariaLabel).toBeTruthy();
            }
          }
        }

        // Test button accessibility
        const buttons = page.getByRole('button').all();

        for (const button of buttons.slice(0, 5)) {
          if (await button.isVisible()) {
            // Buttons should have accessible names
            const accessibleName = await button.evaluate((el) => {
              return (
                el.textContent?.trim() ||
                el.getAttribute('aria-label') ||
                el.getAttribute('aria-labelledby') ||
                el.getAttribute('title')
              );
            });

            expect(accessibleName).toBeTruthy();
            expect(accessibleName?.length).toBeGreaterThan(0);
          }
        }
      });

      test(`should have sufficient color contrast on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
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
          console.error(
            `Color contrast violations on ${deviceName}:`,
            JSON.stringify(contrastViolations, null, 2)
          );
        }

        expect(contrastViolations).toHaveLength(0);
      });

      test(`should have proper heading hierarchy on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        // Test heading structure
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

        if (headings.length > 0) {
          // Should have exactly one h1
          const h1Headings = await page.locator('h1').all();
          expect(h1Headings.length).toBe(1);

          // Test heading hierarchy (no skipped levels)
          let previousLevel = 0;

          for (const heading of headings) {
            const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
            const currentLevel = parseInt(tagName.charAt(1));

            if (previousLevel > 0) {
              // Should not skip heading levels (e.g., h1 to h3)
              expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
            }

            previousLevel = currentLevel;
          }
        }
      });

      test(`should have accessible form validation on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/contact`);

        const form = page.locator('form').first();

        if (await form.isVisible()) {
          const submitButton = page.getByRole('button', { name: /submit|send/i });

          if (await submitButton.isVisible()) {
            // Test form submission without filling required fields
            await submitButton.click();

            // Check for error messages
            const errorElements = page.locator('[role="alert"], .error, .invalid').all();

            for (const error of errorElements) {
              if (await error.isVisible()) {
                // Error messages should be associated with form fields
                await expect(error).toBeVisible();

                // Check if error is properly announced
                const ariaLive = await error.getAttribute('aria-live');
                const role = await error.getAttribute('role');

                expect(
                  ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert'
                ).toBeTruthy();
              }
            }
          }
        }
      });

      test(`should handle screen reader announcements on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        // Test dynamic content announcements
        const buttons = page.getByRole('button').all();

        for (const button of buttons.slice(0, 3)) {
          if (await button.isVisible()) {
            // Check for aria-live regions
            const liveRegions = page.locator('[aria-live]').all();

            for (const region of liveRegions) {
              if (await region.isVisible()) {
                const ariaLive = await region.getAttribute('aria-live');
                expect(['polite', 'assertive', 'off']).toContain(ariaLive);
              }
            }

            break; // Test only first button
          }
        }

        // Test status messages
        const statusElements = page.locator('[role="status"]').all();

        for (const status of statusElements) {
          if (await status.isVisible()) {
            await expect(status).toBeVisible();
          }
        }
      });

      test(`should have accessible touch targets on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        const touchTargets = [
          page.getByRole('button'),
          page.getByRole('link'),
          page.locator('input'),
          page.locator('textarea'),
        ];

        for (const targetSelector of touchTargets) {
          const targets = targetSelector.all();

          for (const target of targets.slice(0, 5)) {
            if (await target.isVisible()) {
              const boundingBox = await target.boundingBox();

              if (boundingBox) {
                // WCAG 2.2 AA: Touch targets should be at least 24x24 CSS pixels
                const minDimension = Math.min(boundingBox.width, boundingBox.height);
                expect(minDimension).toBeGreaterThanOrEqual(24);

                // For better accessibility, recommend 44x44
                if (deviceConfig.isMobile) {
                  expect(minDimension).toBeGreaterThanOrEqual(44);
                }
              }
            }
          }
        }
      });

      test(`should have proper language and reading direction on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        // Check html lang attribute
        const htmlLang = await page.locator('html').getAttribute('lang');
        expect(htmlLang).toBeTruthy();
        expect(['en', 'en-US']).toContain(htmlLang);

        // Check for proper text direction
        const html = page.locator('html');
        const dir = await html.getAttribute('dir');

        if (dir) {
          expect(['ltr', 'rtl']).toContain(dir);
        }
      });

      test(`should have accessible data tables on ${deviceName}`, async ({
        page,
        tenantDomain,
      }) => {
        await page.goto(`http://${tenantDomain}/`);

        const tables = page.locator('table').all();

        for (const table of tables.slice(0, 2)) {
          if (await table.isVisible()) {
            // Check for table caption
            const caption = table.locator('caption');
            if (await caption.isVisible()) {
              await expect(caption).toBeVisible();
            }

            // Check for table headers
            const headers = table.locator('th').all();
            if (headers.length > 0) {
              for (const header of headers.slice(0, 3)) {
                if (await header.isVisible()) {
                  // Headers should have scope attribute
                  const scope = await header.getAttribute('scope');
                  expect(['row', 'col', 'rowgroup', 'colgroup']).toContain(scope);
                }
              }
            }

            // Check for proper table structure
            const thead = table.locator('thead');
            const tbody = table.locator('tbody');

            if (await thead.isVisible()) {
              await expect(thead).toBeVisible();
            }

            if (await tbody.isVisible()) {
              await expect(tbody).toBeVisible();
            }
          }
        }
      });
    });
  });

  test.describe('Screen Reader Testing', () => {
    test.use({ ...devices['Desktop Chrome'] });

    test('should work with screen readers', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test semantic markup
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();

      // Test skip links
      const skipLinks = page.getByRole('link', { name: /skip/i }).all();

      for (const skipLink of skipLinks) {
        if (await skipLink.isVisible()) {
          await skipLink.click();

          // Should jump to main content
          const mainContent = page.locator(':focus');
          await expect(mainContent).toBeVisible();

          // Should be within main element
          const main = page.getByRole('main');
          const mainId = await main.getAttribute('id');

          if (mainId) {
            const focusedId = await mainContent.evaluate((el) => el.getAttribute('id'));
            expect(focusedId).toBe(mainId);
          }
        }
      }

      // Test form accessibility
      await page.goto(`http://${tenantDomain}/contact`);

      const form = page.locator('form').first();
      if (await form.isVisible()) {
        // Check for fieldsets
        const fieldsets = form.locator('fieldset').all();

        for (const fieldset of fieldsets) {
          if (await fieldset.isVisible()) {
            // Fieldsets should have legends
            const legend = fieldset.locator('legend');
            if (await legend.isVisible()) {
              await expect(legend).toBeVisible();
            }
>>>>>>> Stashed changes
          }
        }
      }
    });
  });

<<<<<<< Updated upstream
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
=======
  test.describe('WCAG 2.2 AA Specific Requirements', () => {
    test.use({ ...devices['Desktop Chrome'] });

    test('should meet WCAG 2.2 Focus Not Obscured requirements', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test that focus is not obscured by other content
      const focusableElements = [
        page.getByRole('button'),
        page.getByRole('link'),
        page.locator('input'),
      ];

      for (const elementSelector of focusableElements) {
        const elements = elementSelector.all();

        for (const element of elements.slice(0, 3)) {
          if (await element.isVisible()) {
            await element.focus();

            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();

            // Check that focused element is not obscured
            const boundingBox = await focusedElement.boundingBox();
            if (boundingBox) {
              expect(boundingBox.width).toBeGreaterThan(0);
              expect(boundingBox.height).toBeGreaterThan(0);
            }
          }
        }
      }
    });

    test('should meet WCAG 2.2 Target Size requirements', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // WCAG 2.2: Target size minimum 24x24 CSS pixels
      const targets = [
        page.getByRole('button'),
        page.getByRole('link'),
        page.locator('input'),
        page.getByRole('checkbox'),
        page.getByRole('radio'),
      ];

      for (const targetSelector of targets) {
        const elements = targetSelector.all();

        for (const element of elements.slice(0, 5)) {
          if (await element.isVisible()) {
            const boundingBox = await element.boundingBox();

            if (boundingBox) {
              const minDimension = Math.min(boundingBox.width, boundingBox.height);
              expect(minDimension).toBeGreaterThanOrEqual(24);
            }
          }
        }
      }
    });

    test('should meet WCAG 2.2 Dragging Movements requirements', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Check for draggable elements
      const draggables = page.locator('[draggable="true"]').all();

      for (const draggable of draggables) {
        if (await draggable.isVisible()) {
          // Should provide alternative to dragging
          const ariaLabel = await draggable.getAttribute('aria-label');
          const title = await draggable.getAttribute('title');

          // Check for keyboard alternatives
          const keyboardAlternatives = draggable.locator('button, [role="button"]').all();

          if (keyboardAlternatives.length === 0) {
            // If no keyboard alternative, should have clear instructions
            expect(ariaLabel || title).toBeTruthy();
          }
>>>>>>> Stashed changes
        }
      }
    });
  });
});
