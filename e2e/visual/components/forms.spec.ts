import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Form Components
 * 
 * Tests visual consistency across all form elements including inputs,
 * textareas, selects, checkboxes, and validation states
 */

test.describe('Form Components Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
  });

  test('input variants visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/input--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('input-variants.png');
  });

  test('input states visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/input--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('input-states.png');
  });

  test('textarea visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/textarea--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('textarea-default.png');
  });

  test('select component visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/select--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('select-default.png');
  });

  test('checkbox visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/checkbox--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('checkbox-default.png');
  });

  test('switch component visual consistency', async ({ page }) => {
    await page.goto('/storybook/story/switch--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('switch-default.png');
  });

  test('form validation states', async ({ page }) => {
    await page.goto('/storybook/story/form--validation');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-validation.png');
  });

  test('form with error states', async ({ page }) => {
    await page.goto('/storybook/story/form--error-states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-error-states.png');
  });

  test('form focus states', async ({ page }) => {
    await page.goto('/storybook/story/input--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    // Focus on first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-focus-states.png');
  });

  test('form disabled states', async ({ page }) => {
    await page.goto('/storybook/story/form--disabled');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-disabled-states.png');
  });
});

test.describe('Form Components Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`form responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/storybook/story/form--layout');
      await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
      
      await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(`form-responsive-${name}.png`);
    });
  });
});

test.describe('Form Components Accessibility', () => {
  test('high contrast mode', async ({ page }) => {
    await page.goto('/storybook/story/form--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await page.emulateMedia({ forcedColors: 'active' });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-high-contrast.png');
    
    await page.emulateMedia({ forcedColors: 'none' });
  });

  test('reduced motion', async ({ page }) => {
    await page.goto('/storybook/story/form--interactions');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Test input focus with reduced motion
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('form-reduced-motion.png');
    
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
});
