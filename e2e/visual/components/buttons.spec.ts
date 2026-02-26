import { expect, test } from '@playwright/test';

/**
 * @file e2e/visual/components/buttons.spec.ts
 * @summary Comprehensive visual regression tests for Button components across all variants and states.
 * @description Tests visual consistency across button variants, sizes, states, and interactions including accessibility.
 * @security None - visual testing only
 * @adr none
 * @requirements VISUAL-002, button-coverage, accessibility-testing
 */

test.describe('Button Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts to load and Storybook to be ready
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
  });

  test('button variants visual consistency', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    // Wait for Storybook canvas to render
    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Take screenshot of all button variants
    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-variants.png', {
      animations: 'disabled',
    });
  });

  test('button sizes visual consistency', async ({ page }) => {
    await page.goto('/?path=/story/components-button--small');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-sizes.png', {
      animations: 'disabled',
    });
  });

  test('button destructive variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--destructive');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-destructive.png', {
      animations: 'disabled',
    });
  });

  test('button outline variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--outline');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-outline.png', {
      animations: 'disabled',
    });
  });

  test('button secondary variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--secondary');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-secondary.png', {
      animations: 'disabled',
    });
  });

  test('button ghost variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--ghost');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-ghost.png', {
      animations: 'disabled',
    });
  });

  test('button link variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--link');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-link.png', {
      animations: 'disabled',
    });
  });

  test('button icon variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--icon');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-icon.png', {
      animations: 'disabled',
    });
  });

  test('button disabled state', async ({ page }) => {
    await page.goto('/?path=/story/components-button--disabled');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-disabled.png', {
      animations: 'disabled',
    });
  });

  test('button hover interactions', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Hover over primary button
    const primaryButton = page.locator('button').first();
    await primaryButton.hover();
    await page.waitForTimeout(300); // Allow hover state to render

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-hover.png', {
      animations: 'disabled',
    });
  });

  test('button focus states', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Focus on primary button
    const primaryButton = page.locator('button').first();
    await primaryButton.focus();
    await page.waitForTimeout(300);

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-focus.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Button Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 1024, height: 1366 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`button responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?path=/story/components-button--default');

      await page.waitForSelector('#storybook-root', { timeout: 10000 });

      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `button-responsive-${name}.png`,
        {
          animations: 'disabled',
        }
      );
    });
  });
});

test.describe('Button Accessibility Visual Tests', () => {
  test('high contrast mode', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Emulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-high-contrast.png', {
      animations: 'disabled',
    });

    // Reset forced colors
    await page.emulateMedia({ forcedColors: 'none' });
  });

  test('reduced motion', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Test button hover with reduced motion
    const primaryButton = page.locator('button').first();
    await primaryButton.hover();
    await page.waitForTimeout(300);

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-reduced-motion.png', {
      animations: 'disabled',
    });

    // Reset reduced motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('focus indicators for keyboard navigation', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');

    await page.waitForSelector('#storybook-root', { timeout: 10000 });

    // Tab through buttons to test focus indicators
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    await expect(page.locator('#storybook-root')).toHaveScreenshot('button-keyboard-focus.png', {
      animations: 'disabled',
    });
  });
});
