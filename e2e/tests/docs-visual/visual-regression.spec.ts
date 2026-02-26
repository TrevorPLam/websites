import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Documentation
 * 
 * Part of 2026 Documentation Standards - Phase 2 Automation
 * Tests visual consistency and accessibility of documentation pages
 */

test.describe('Documentation Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
  });

  test('homepage visual consistency', async ({ page }) => {
    await page.goto('/docs');
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('docs-homepage.png', {
      fullPage: true,
      animations: 'disabled',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
  });

  test('tutorials page visual consistency', async ({ page }) => {
    await page.goto('/docs/tutorials');
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Test tutorials quadrant styling
    await expect(page.locator('nav')).toContainText('Tutorials');
    
    await expect(page).toHaveScreenshot('docs-tutorials.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('how-to guides page visual consistency', async ({ page }) => {
    await page.goto('/docs/how-to');
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Test how-to quadrant styling
    await expect(page.locator('nav')).toContainText('How-To Guides');
    
    await expect(page).toHaveScreenshot('docs-howto.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('reference documentation page visual consistency', async ({ page }) => {
    await page.goto('/docs/reference');
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Test reference quadrant styling
    await expect(page.locator('nav')).toContainText('Reference');
    
    await expect(page).toHaveScreenshot('docs-reference.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('explanation documentation page visual consistency', async ({ page }) => {
    await page.goto('/docs/explanation');
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // Test explanation quadrant styling
    await expect(page.locator('nav')).toContainText('Explanations');
    
    await expect(page).toHaveScreenshot('docs-explanation.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('mobile responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();
    
    await expect(page).toHaveScreenshot('docs-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('dark mode visual consistency', async ({ page }) => {
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Toggle dark mode (assuming there's a theme toggle)
    const themeToggle = page.locator('[data-theme-toggle], .theme-toggle, button[aria-label*="theme"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }
    
    await expect(page).toHaveScreenshot('docs-dark-mode.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('code block syntax highlighting', async ({ page }) => {
    await page.goto('/docs/tutorials/monorepo-setup');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for code blocks
    const codeBlocks = page.locator('pre[class*="language-"], .code-block');
    await expect(codeBlocks.first()).toBeVisible();
    
    // Test syntax highlighting colors
    await expect(page).toHaveScreenshot('docs-code-highlighting.png', {
      fullPage: false,
      animations: 'disabled',
      clip: { x: 0, y: 200, width: 1200, height: 400 } // Clip to code block area
    });
  });

  test('table formatting and responsiveness', async ({ page }) => {
    await page.goto('/docs/reference/api');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for tables
    const tables = page.locator('table');
    if (await tables.count() > 0) {
      await expect(tables.first()).toBeVisible();
      
      await expect(page).toHaveScreenshot('docs-tables.png', {
        fullPage: false,
        animations: 'disabled',
        clip: { x: 0, y: 300, width: 1200, height: 300 } // Clip to table area
      });
    }
  });

  test('search functionality visual state', async ({ page }) => {
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], .search-input, [placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.click();
      await searchInput.fill('tutorial');
      await page.waitForTimeout(500); // Wait for search results
      
      await expect(page).toHaveScreenshot('docs-search-results.png', {
        fullPage: false,
        animations: 'disabled',
        clip: { x: 0, y: 0, width: 1200, height: 400 } // Clip to search area
      });
    }
  });

  test('accessibility compliance - focus indicators', async ({ page }) => {
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Test keyboard navigation and focus indicators
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot('docs-focus-indicators.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('print layout', async ({ page }) => {
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    await expect(page).toHaveScreenshot('docs-print-layout.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // Reset media emulation
    await page.emulateMedia({ media: 'screen' });
  });

  test('high contrast mode', async ({ page }) => {
    await page.goto('/docs');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Emulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    
    await expect(page).toHaveScreenshot('docs-high-contrast.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // Reset forced colors
    await page.emulateMedia({ forcedColors: 'none' });
  });
});

test.describe('Documentation Performance Visual Tests', () => {
  test('loading states and skeleton screens', async ({ page }) => {
    // Intercept network to simulate slow loading
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
      } else {
        // Add delay for other resources
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      }
    });
    
    await page.goto('/docs');
    
    // Take screenshot during loading
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('docs-loading-state.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('error states visual consistency', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/docs/non-existent-page');
    
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page).toHaveScreenshot('docs-404-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});

test.describe('Documentation Interactive Elements', () => {
  test('expandable sections and accordions', async ({ page }) => {
    await page.goto('/docs/tutorials');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for expandable sections
    const expandableElements = page.locator('[aria-expanded], details, .accordion');
    if (await expandableElements.count() > 0) {
      // Test collapsed state
      await expect(page).toHaveScreenshot('docs-collapsed-sections.png', {
        fullPage: true,
        animations: 'disabled'
      });
      
      // Expand first element
      await expandableElements.first().click();
      await page.waitForTimeout(300);
      
      // Test expanded state
      await expect(page).toHaveScreenshot('docs-expanded-sections.png', {
        fullPage: true,
        animations: 'disabled'
      });
    }
  });

  test('tooltip and popover visual consistency', async ({ page }) => {
    await page.goto('/docs/reference');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Look for elements with tooltips
    const tooltipTriggers = page.locator('[title], [data-tooltip], .tooltip-trigger');
    if (await tooltipTriggers.count() > 0) {
      await tooltipTriggers.first().hover();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('docs-tooltip-visible.png', {
        fullPage: false,
        animations: 'disabled',
        clip: { x: 0, y: 0, width: 1200, height: 400 }
      });
    }
  });
});
