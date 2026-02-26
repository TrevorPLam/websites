import { test, expect } from '@playwright/test';

/**
 * Dark Mode Visual Regression Tests
 * 
 * Tests visual consistency of all components in dark theme
 * Ensures proper color contrast and readability in dark mode
 */

test.describe('Dark Mode Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForLoadState('networkidle');
    
    // Ensure dark mode is active
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(500); // Allow theme to apply
  });

  test('button components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/button--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-buttons.png');
  });

  test('form components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/form--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-forms.png');
  });

  test('card components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/card--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-cards.png');
  });

  test('alert components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/alert--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-alerts.png');
  });

  test('navigation components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/navigation--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-navigation.png');
  });

  test('modal components in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/modal--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-modals.png');
  });

  test('typography in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/typography--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-typography.png');
  });

  test('color palette in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/colors--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-colors.png');
  });

  test('interactive states in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/interactions--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    // Test hover states
    const hoverableElement = page.locator('[data-hoverable]').first();
    await hoverableElement.hover();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-hover.png');
  });

  test('focus states in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/button--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    const primaryButton = page.locator('button[data-variant="primary"]').first();
    await primaryButton.focus();
    await page.waitForTimeout(200);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-focus.png');
  });

  test('disabled states in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/button--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-disabled.png');
  });

  test('loading states in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/button--states');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-loading.png');
  });
});

test.describe('Dark Mode Responsive Testing', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`dark mode responsive layout - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      
      // Ensure dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      });
      await page.waitForTimeout(500);
      
      await page.goto('/storybook/story/layout--default');
      await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
      
      await expect(page.locator('[data-testid="story"]')).toHaveScreenshot(`dark-mode-responsive-${name}.png`);
    });
  });
});

test.describe('Dark Mode Accessibility', () => {
  test('color contrast validation', async ({ page }) => {
    await page.goto('/storybook/story/accessibility--contrast');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-contrast.png');
  });

  test('text readability in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/typography--readability');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-readability.png');
  });

  test('link states in dark mode', async ({ page }) => {
    await page.goto('/storybook/story/links--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('dark-mode-links.png');
  });
});

test.describe('Theme Transition Testing', () => {
  test('light to dark theme transition', async ({ page }) => {
    // Start in light mode
    await page.goto('/storybook/story/button--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    // Take light mode screenshot
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('theme-transition-light.png');
    
    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(500);
    
    // Take dark mode screenshot
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('theme-transition-dark.png');
  });

  test('theme toggle functionality', async ({ page }) => {
    await page.goto('/storybook/story/theme-toggle--default');
    await page.waitForSelector('[data-testid="story"]', { timeout: 10000 });
    
    // Find and click theme toggle
    const themeToggle = page.locator('[data-theme-toggle]').first();
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="story"]')).toHaveScreenshot('theme-toggle-after-click.png');
  });
});
