import { expect, test } from '@playwright/test';

/**
 * Visual Regression Tests for Button Components
 *
 * Tests visual consistency across all button variants, states, and sizes
 * Includes theme testing and responsive behavior
 */

test.describe('Button Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
  });

  test('button variants visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/button--default');

    // Wait for Storybook to render
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-variants.png');
  });

  test('button states visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/button--states');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-states.png', {
      animations: 'disabled',
    });
  });

  test('button sizes visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/button--sizes');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-sizes.png', {
      animations: 'disabled',
    });
  });

  test('button hover interactions', async ({ page }) => {
    await page.goto('/storybook/story/button--default');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    // Hover over primary button
    const primaryButton = page.locator('button[data-variant="primary"]').first();
    await primaryButton.hover();
    await page.waitForTimeout(200); // Allow hover state to render

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-hover.png', {
      animations: 'disabled',
    });
  });

  test('button focus states', async ({ page }) => {
    await page.goto('/storybook/story/button--default');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    // Focus on primary button
    const primaryButton = page.locator('button[data-variant="primary"]').first();
    await primaryButton.focus();
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-focus.png', {
      animations: 'disabled',
    });
  });

  test('button disabled state', async ({ page }) => {
    await page.goto('/storybook/story/button--states');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-disabled.png', {
      animations: 'disabled',
    });
  });

  test('button loading state', async ({ page }) => {
    await page.goto('/storybook/story/button--states');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-loading.png', {
      animations: 'disabled',
    });
  });

  test('button with icons', async ({ page }) => {
    await page.goto('/storybook/story/button--with-icons');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('button-icons.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Button Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`button responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/storybook/story/button--responsive');

      await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

      await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(
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
    await page.goto('/storybook/story/button--default');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    // Emulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(
      'button-high-contrast.png',
      {
        animations: 'disabled',
      }
    );

    // Reset forced colors
    await page.emulateMedia({ forcedColors: 'none' });
  });

  test('reduced motion', async ({ page }) => {
    await page.goto('/storybook/story/button--default');

    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });

    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Test button hover with reduced motion
    const primaryButton = page.locator('button[data-variant="primary"]').first();
    await primaryButton.hover();
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(
      'button-reduced-motion.png',
      {
        animations: 'disabled',
      }
    );

    // Reset reduced motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
});
