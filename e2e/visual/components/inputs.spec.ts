/**
 * @file e2e/visual/components/inputs.spec.ts
 * @summary Comprehensive visual regression tests for Input components across all variants and states.
 * @description Tests visual consistency across input types, states, validation, and accessibility features.
 * @security None - visual testing only
 * @adr none
 * @requirements VISUAL-004, input-coverage, accessibility-testing
 */

import { expect, test } from '@playwright/test';

test.describe('Input Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts to load and Storybook to be ready
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
  });

  test('input variants visual consistency', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-variants.png', {
      animations: 'disabled',
    });
  });

  test('input states visual consistency', async ({ page }) => {
    await page.goto('/?path=/story/components-input--states');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-states.png', {
      animations: 'disabled',
    });
  });

  test('input with labels and placeholders', async ({ page }) => {
    await page.goto('/?path=/story/components-input--with-label');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-with-label.png', {
      animations: 'disabled',
    });
  });

  test('input validation states', async ({ page }) => {
    await page.goto('/?path=/story/components-input--validation');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-validation.png', {
      animations: 'disabled',
    });
  });

  test('input focus interactions', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Focus on first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-focus.png', {
      animations: 'disabled',
    });
  });

  test('input hover interactions', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Hover over first input
    const firstInput = page.locator('input').first();
    await firstInput.hover();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-hover.png', {
      animations: 'disabled',
    });
  });

  test('input disabled state', async ({ page }) => {
    await page.goto('/?path=/story/components-input--disabled');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-disabled.png', {
      animations: 'disabled',
    });
  });

  test('input with icons', async ({ page }) => {
    await page.goto('/?path=/story/components-input--with-icon');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-with-icon.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Input Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 1024, height: 1366 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`input responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?path=/story/components-input--default');
      
      await page.waitForSelector('#storybook-root', { timeout: 10000 });
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `input-responsive-${name}.png`,
        {
          animations: 'disabled',
        }
      );
    });
  });
});

test.describe('Input Accessibility Visual Tests', () => {
  test('high contrast mode', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Emulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-high-contrast.png', {
      animations: 'disabled',
    });
    
    // Reset forced colors
    await page.emulateMedia({ forcedColors: 'none' });
  });

  test('reduced motion', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Test input focus with reduced motion
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-reduced-motion.png', {
      animations: 'disabled',
    });
    
    // Reset reduced motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('keyboard navigation focus indicators', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Tab through inputs to test focus indicators
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('input-keyboard-focus.png', {
      animations: 'disabled',
    });
  });
});
