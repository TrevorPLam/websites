/**
 * @file e2e/visual/components/cards.spec.ts
 * @summary Comprehensive visual regression tests for Card components across all variants and states.
 * @description Tests visual consistency across card variants, content layouts, and interactions including accessibility.
 * @security None - visual testing only
 * @adr none
 * @requirements VISUAL-003, card-coverage, accessibility-testing
 */

import { expect, test } from '@playwright/test';

test.describe('Card Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts to load and Storybook to be ready
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
  });

  test('card default variant visual consistency', async ({ page }) => {
    await page.goto('/?path=/story/components-card--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-default.png', {
      animations: 'disabled',
    });
  });

  test('card with content layout', async ({ page }) => {
    await page.goto('/?path=/story/components-card--with-content');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-with-content.png', {
      animations: 'disabled',
    });
  });

  test('card interactive states', async ({ page }) => {
    await page.goto('/?path=/story/components-card--interactive');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Test hover state
    const card = page.locator('[data-testid="card"]').first();
    await card.hover();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-hover.png', {
      animations: 'disabled',
    });
  });

  test('card focus states', async ({ page }) => {
    await page.goto('/?path=/story/components-card--interactive');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Test focus state
    const card = page.locator('[data-testid="card"]').first();
    await card.focus();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-focus.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Card Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 1024, height: 1366 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`card responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?path=/story/components-card--default');
      
      await page.waitForSelector('#storybook-root', { timeout: 10000 });
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `card-responsive-${name}.png`,
        {
          animations: 'disabled',
        }
      );
    });
  });
});

test.describe('Card Accessibility Visual Tests', () => {
  test('high contrast mode', async ({ page }) => {
    await page.goto('/?path=/story/components-card--default');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Emulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-high-contrast.png', {
      animations: 'disabled',
    });
    
    // Reset forced colors
    await page.emulateMedia({ forcedColors: 'none' });
  });

  test('reduced motion', async ({ page }) => {
    await page.goto('/?path=/story/components-card--interactive');
    
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Test card hover with reduced motion
    const card = page.locator('[data-testid="card"]').first();
    await card.hover();
    await page.waitForTimeout(300);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('card-reduced-motion.png', {
      animations: 'disabled',
    });
    
    // Reset reduced motion
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
});
