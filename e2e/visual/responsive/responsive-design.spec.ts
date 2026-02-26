/**
 * @file e2e/visual/responsive/responsive-design.spec.ts
 * @summary Comprehensive responsive design testing across all viewport sizes and device types.
 * @description Tests responsive behavior of components across mobile, tablet, desktop, and ultra-wide displays.
 * @security None - visual testing only
 * @adr none
 * @requirements VISUAL-005, responsive-testing, cross-device-testing
 */

import { expect, test } from '@playwright/test';

test.describe('Responsive Design Testing', () => {
  // Comprehensive viewport matrix covering all device categories
  const viewports = [
    // Mobile devices
    { name: 'iphone-se', width: 375, height: 667, category: 'mobile' },
    { name: 'iphone-12', width: 390, height: 844, category: 'mobile' },
    { name: 'iphone-12-pro-max', width: 428, height: 926, category: 'mobile' },
    { name: 'pixel-7', width: 393, height: 851, category: 'mobile' },
    { name: 'samsung-galaxy-s21', width: 384, height: 854, category: 'mobile' },
    
    // Tablet devices
    { name: 'ipad-mini', width: 768, height: 1024, category: 'tablet' },
    { name: 'ipad', width: 820, height: 1180, category: 'tablet' },
    { name: 'ipad-pro-11', width: 834, height: 1194, category: 'tablet' },
    { name: 'ipad-pro-12-9', width: 1024, height: 1366, category: 'tablet' },
    { name: 'surface-pro', width: 1368, height: 912, category: 'tablet' },
    
    // Desktop devices
    { name: 'desktop-small', width: 1280, height: 720, category: 'desktop' },
    { name: 'desktop-medium', width: 1440, height: 900, category: 'desktop' },
    { name: 'desktop-large', width: 1920, height: 1080, category: 'desktop' },
    { name: 'desktop-ultrawide', width: 2560, height: 1440, category: 'desktop' },
    
    // Special cases
    { name: 'mobile-landscape', width: 844, height: 390, category: 'mobile-landscape' },
    { name: 'tablet-landscape', width: 1366, height: 1024, category: 'tablet-landscape' },
  ];

  viewports.forEach(({ name, width, height, category }) => {
    test.describe(`${category} - ${name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.waitForLoadState('networkidle');
      });

      test('button responsive layout', async ({ page }) => {
        await page.goto('/?path=/story/components-button--default');
        await page.waitForSelector('#storybook-root', { timeout: 10000 });
        
        await expect(page.locator('#storybook-root')).toHaveScreenshot(
          `responsive-button-${name}.png`,
          {
            animations: 'disabled',
          }
        );
      });

      test('card responsive layout', async ({ page }) => {
        await page.goto('/?path=/story/components-card--default');
        await page.waitForSelector('#storybook-root', { timeout: 10000 });
        
        await expect(page.locator('#storybook-root')).toHaveScreenshot(
          `responsive-card-${name}.png`,
          {
            animations: 'disabled',
          }
        );
      });

      test('input responsive layout', async ({ page }) => {
        await page.goto('/?path=/story/components-input--default');
        await page.waitForSelector('#storybook-root', { timeout: 10000 });
        
        await expect(page.locator('#storybook-root')).toHaveScreenshot(
          `responsive-input-${name}.png`,
          {
            animations: 'disabled',
          }
        );
      });

      // Additional tests for mobile-specific considerations
      if (category === 'mobile' || category === 'mobile-landscape') {
        test('mobile touch targets', async ({ page }) => {
          await page.goto('/?path=/story/components-button--default');
          await page.waitForSelector('#storybook-root', { timeout: 10000 });
          
          // Test that buttons meet minimum touch target size (44x44px)
          const buttons = page.locator('button');
          const buttonCount = await buttons.count();
          
          for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i);
            const boundingBox = await button.boundingBox();
            expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
          }
          
          await expect(page.locator('#storybook-root')).toHaveScreenshot(
            `mobile-touch-targets-${name}.png`,
            {
              animations: 'disabled',
            }
          );
        });
      }

      // Additional tests for ultra-wide displays
      if (name === 'desktop-ultrawide') {
        test('ultrawide content layout', async ({ page }) => {
          await page.goto('/?path=/story/components-card--default');
          await page.waitForSelector('#storybook-root', { timeout: 10000 });
          
          // Test that content doesn't stretch uncomfortably wide
          await expect(page.locator('#storybook-root')).toHaveScreenshot(
            `ultrawide-layout-${name}.png`,
            {
              animations: 'disabled',
            }
          );
        });
      }
    });
  });
});

test.describe('Orientation Change Testing', () => {
  const orientations = [
    { name: 'portrait', width: 390, height: 844 },
    { name: 'landscape', width: 844, height: 390 },
  ];

  orientations.forEach(({ name, width, height }) => {
    test(`orientation ${name} - button layout`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?path=/story/components-button--default');
      await page.waitForSelector('#storybook-root', { timeout: 10000 });
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `orientation-${name}-button.png`,
        {
          animations: 'disabled',
        }
      );
    });

    test(`orientation ${name} - card layout`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?path=/story/components-card--default');
      await page.waitForSelector('#storybook-root', { timeout: 10000 });
      
      await expect(page.locator('#storybook-root')).toHaveScreenshot(
        `orientation-${name}-card.png`,
        {
          animations: 'disabled',
        }
      );
    });
  });
});

test.describe('Dynamic Viewport Testing', () => {
  test('viewport resize behavior', async ({ page }) => {
    // Start with mobile size
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?path=/story/components-button--default');
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    
    // Take initial screenshot
    await expect(page.locator('#storybook-root')).toHaveScreenshot('viewport-resize-start.png', {
      animations: 'disabled',
    });
    
    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Allow for layout adjustments
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('viewport-resize-tablet.png', {
      animations: 'disabled',
    });
    
    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    await expect(page.locator('#storybook-root')).toHaveScreenshot('viewport-resize-desktop.png', {
      animations: 'disabled',
    });
  });
});
