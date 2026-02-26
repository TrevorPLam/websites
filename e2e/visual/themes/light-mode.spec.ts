import { test, expect } from '@playwright/test';

/**
 * Light Mode Visual Regression Tests
 * 
 * Tests visual consistency of all components in light theme
 * Ensures proper color contrast and readability
 */

test.describe('Light Mode Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
    
    // Ensure light mode is active
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.waitForTimeout(500); // Allow theme to apply
  });

  test('button components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/button--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-buttons.png');
  });

  test('form components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/form--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-forms.png');
  });

  test('card components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/card--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-cards.png');
  });

  test('alert components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/alert--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-alerts.png');
  });

  test('navigation components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/navigation--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-navigation.png');
  });

  test('modal components in light mode', async ({ page }) => {
    await page.goto('/storybook/story/modal--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-modals.png');
  });

  test('typography in light mode', async ({ page }) => {
    await page.goto('/storybook/story/typography--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-typography.png');
  });

  test('color palette in light mode', async ({ page }) => {
    await page.goto('/storybook/story/colors--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-colors.png');
  });

  test('interactive states in light mode', async ({ page }) => {
    await page.goto('/storybook/story/interactions--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    // Test hover states
    const hoverableElement = page.locator('[data-hoverable]').first();
    await hoverableElement.hover();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-hover.png');
  });

  test('focus states in light mode', async ({ page }) => {
    await page.goto('/storybook/story/button--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    const primaryButton = page.locator('button[data-variant="primary"]').first();
    await primaryButton.focus();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-focus.png');
  });

  test('disabled states in light mode', async ({ page }) => {
    await page.goto('/storybook/story/button--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-disabled.png');
  });

  test('loading states in light mode', async ({ page }) => {
    await page.goto('/storybook/story/button--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-loading.png');
  });
});

test.describe('Light Mode Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`light mode responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      
      // Ensure light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await page.waitForTimeout(500);
      
      await page.goto('/storybook/story/layout--default');
      await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
      
      await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(`light-mode-responsive-${name}.png`);
    });
  });
});

test.describe('Light Mode Accessibility', () => {
  test('color contrast validation', async ({ page }) => {
    await page.goto('/storybook/story/accessibility--contrast');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-contrast.png');
  });

  test('text readability in light mode', async ({ page }) => {
    await page.goto('/storybook/story/typography--readability');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-readability.png');
  });

  test('link states in light mode', async ({ page }) => {
    await page.goto('/storybook/story/links--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('light-mode-links.png');
  });
});
