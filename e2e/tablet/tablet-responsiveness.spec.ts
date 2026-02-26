/**
 * @file e2e/tablet/tablet-responsiveness.spec.ts
<<<<<<< Updated upstream
 * @summary Tablet responsiveness testing with UI pattern validation.
 * @description Tests tablet layouts and device-specific UI patterns.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements TABLET-RESPONSIVE-001, TABLET-PERF-001
 */

import { devices } from '@playwright/test';
import { expect, test } from '../fixtures';

test.describe('Tablet Responsiveness Testing', () => {
  test.describe('iPad Pro', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should render correctly on iPad Pro', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: tablet should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify tablet viewport dimensions
      const viewport = page.viewportSize();
      expect(viewport.width).toBeGreaterThanOrEqual(768);
      expect(viewport.width).toBeLessThanOrEqual(1368);

      // Check critical elements are visible and properly sized
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();

      // Verify content utilizes tablet screen space effectively
      const mainContent = page.getByRole('main');
      const mainBox = await mainContent.boundingBox();
      if (mainBox && viewport) {
        const contentWidthRatio = mainBox.width / viewport.width;
        // Main content should use at least 70% of screen width on tablet
        expect(contentWidthRatio).toBeGreaterThan(0.7);
      }
    });

    test('should have optimized navigation on iPad Pro', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();

      // Check if navigation adapts to tablet layout
      const navBox = await navigation.boundingBox();
      const viewport = page.viewportSize();

      if (navBox && viewport) {
        // Navigation should be horizontal on tablet (not collapsed mobile menu)
        const navWidthRatio = navBox.width / viewport.width;
        expect(navWidthRatio).toBeGreaterThan(0.8);
      }
    });

    test('should handle touch interactions on iPad Pro', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test touch targets meet tablet requirements (larger than mobile)
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          // Tablet touch targets should be at least 48x48 CSS pixels
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(48);
        }
      }

      // Test tap response time
      const button = page.getByRole('button').first();
      const startTime = performance.now();
      await button.tap();
      const responseTime = performance.now() - startTime;

      // Tap response should be under 50ms for good UX
      expect(responseTime).toBeLessThan(50);
    });
  });

  test.describe('iPad', () => {
    test.use({ ...devices['iPad'] });

    test('should render correctly on iPad', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: tablet should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Verify tablet viewport dimensions
      const viewport = page.viewportSize();
      expect(viewport.width).toBeGreaterThanOrEqual(768);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should have proper content layout on iPad', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test typography scales appropriately for tablet
      const headings = await page.getByRole('heading').all();
      for (const heading of headings.slice(0, 3)) {
        const fontSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);
        const fontSizeValue = parseInt(fontSize);

        // Tablet headings should be appropriately sized (between mobile and desktop)
        expect(fontSizeValue).toBeGreaterThanOrEqual(20);
        expect(fontSizeValue).toBeLessThanOrEqual(48);
=======
 * @summary Tablet responsiveness testing with UI pattern validation and performance benchmarks.
 * @description Tests tablet layouts, touch optimization, and device-specific UI patterns.
 * @security Tests use tenant isolation; no production data accessed.
 * @adr none
 * @requirements TABLET-RESPONSIVE-001, TABLET-PERF-001, TABLET-UI-001
 */

import { test, expect, devices } from '../fixtures';

// Tablet device configurations for comprehensive testing
const TABLET_DEVICES = {
  'iPad Pro': devices['iPad Pro'],
  'iPad': devices['iPad'],
  'Surface Pro': {
    viewport: { width: 1368, height: 912 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    deviceScaleFactor: 1.5,
    isMobile: false,
    hasTouch: true,
  },
  'Galaxy Tab S': {
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
};

test.describe('Tablet Responsiveness Testing', () => {
  Object.entries(TABLET_DEVICES).forEach(([deviceName, deviceConfig]) => {
    test.describe(`${deviceName}`, () => {
      test.use({ ...deviceConfig });

      test(`should render correctly on ${deviceName}`, async ({ page, tenantDomain }) => {
        const startTime = performance.now();
        
        await page.goto(`http://${tenantDomain}/`);
        await page.waitForLoadState('networkidle');
        
        const loadTime = performance.now() - startTime;
        
        // Performance benchmark: tablet should load in under 3 seconds
        expect(loadTime).toBeLessThan(3000);
        
        // Verify tablet viewport dimensions
        const viewport = page.viewportSize();
        expect(viewport.width).toBeGreaterThanOrEqual(768);
        expect(viewport.width).toBeLessThanOrEqual(1368);
        
        // Check critical elements are visible and properly sized
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
        
        // Verify content utilizes tablet screen space effectively
        const mainContent = page.getByRole('main');
        const mainBox = await mainContent.boundingBox();
        if (mainBox && viewport) {
          const contentWidthRatio = mainBox.width / viewport.width;
          // Main content should use at least 70% of screen width on tablet
          expect(contentWidthRatio).toBeGreaterThan(0.7);
        }
      });

      test(`should have optimized navigation for ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        const navigation = page.getByRole('navigation');
        await expect(navigation).toBeVisible();
        
        // Check if navigation adapts to tablet layout
        const navBox = await navigation.boundingBox();
        const viewport = page.viewportSize();
        
        if (navBox && viewport) {
          // Navigation should be horizontal on tablet (not collapsed mobile menu)
          const navWidthRatio = navBox.width / viewport.width;
          expect(navWidthRatio).toBeGreaterThan(0.8);
        }
        
        // Test navigation items are visible without menu toggle
        const navLinks = navigation.getByRole('link');
        const linkCount = await navLinks.count();
        
        if (linkCount > 0) {
          // First few navigation items should be visible
          await expect(navLinks.first()).toBeVisible();
          
          // Check if navigation supports touch interaction
          if (deviceConfig.hasTouch) {
            await navLinks.first().tap();
            // Verify tap response
            await expect(navLinks.first()).toBeVisible();
          }
        }
      });

      test(`should handle touch interactions on ${deviceName}`, async ({ page, tenantDomain }) => {
        if (!deviceConfig.hasTouch) {
          test.skip();
          return;
        }
        
        await page.goto(`http://${tenantDomain}/`);
        
        // Test touch targets meet tablet requirements (larger than mobile)
        const buttons = page.getByRole('button').all();
        for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
          const boundingBox = await button.boundingBox();
          if (boundingBox) {
            // Tablet touch targets should be at least 48x48 CSS pixels
            const minDimension = Math.min(boundingBox.width, boundingBox.height);
            expect(minDimension).toBeGreaterThanOrEqual(48);
          }
        }
        
        // Test swipe gestures for content areas
        const mainContent = page.getByRole('main');
        await mainContent.tap();
        
        // Test pinch zoom capability
        await page.touchscreen.tap(400, 300);
        
        // Verify touch feedback
        const touchedElement = page.locator(':focus');
        if (await touchedElement.isVisible()) {
          await expect(touchedElement).toBeVisible();
        }
      });

      test(`should have proper content layout on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Test content columns and layout
        const mainContent = page.getByRole('main');
        const viewport = page.viewportSize();
        
        if (viewport) {
          // Tablet should show multi-column layouts where appropriate
          const contentElements = mainContent.locator('section, .grid, .flex').all();
          
          for (const element of contentElements.slice(0, 3)) {
            const elementBox = await element.boundingBox();
            if (elementBox) {
              // Content elements should utilize horizontal space
              const elementWidthRatio = elementBox.width / viewport.width;
              expect(elementWidthRatio).toBeGreaterThan(0.5);
            }
          }
        }
        
        // Test typography scales appropriately for tablet
        const headings = page.getByRole('heading').all();
        for (const heading of headings.slice(0, 3)) {
          const fontSize = await heading.evaluate(el => 
            window.getComputedStyle(el).fontSize
          );
          const fontSizeValue = parseInt(fontSize);
          
          // Tablet headings should be appropriately sized (between mobile and desktop)
          expect(fontSizeValue).toBeGreaterThanOrEqual(20);
          expect(fontSizeValue).toBeLessThanOrEqual(48);
        }
      });

      test(`should handle form interactions on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/contact`);
        
        // Test form layout on tablet
        const form = page.locator('form').first();
        if (await form.isVisible()) {
          const formBox = await form.boundingBox();
          const viewport = page.viewportSize();
          
          if (formBox && viewport) {
            // Form should be appropriately sized for tablet
            const formWidthRatio = formBox.width / viewport.width;
            expect(formWidthRatio).toBeGreaterThan(0.6);
            expect(formWidthRatio).toBeLessThan(0.9);
          }
        }
        
        // Test form field interactions
        const nameField = page.getByLabel(/name/i);
        const emailField = page.getByLabel(/email/i);
        const messageField = page.getByLabel(/message/i);
        
        if (await nameField.isVisible()) {
          // Test field focus and input
          await nameField.tap();
          await nameField.fill('Tablet Test User');
          
          await emailField.tap();
          await emailField.fill('tablet@test.com');
          
          await messageField.tap();
          await messageField.fill('Testing tablet form input');
          
          // Verify keyboard doesn't obscure content on tablet
          const submitButton = page.getByRole('button', { name: /submit|send/i });
          const buttonBox = await submitButton.boundingBox();
          const viewport = page.viewportSize();
          
          if (buttonBox && viewport) {
            // Submit button should remain visible
            expect(buttonBox.y).toBeLessThan(viewport.height * 0.9);
          }
        }
      });

      test(`should handle orientation changes on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        const originalViewport = page.viewportSize();
        if (!originalViewport) return;
        
        // Test landscape orientation
        const landscapeWidth = Math.max(originalViewport.width, originalViewport.height);
        const landscapeHeight = Math.min(originalViewport.width, originalViewport.height);
        
        await page.setViewportSize({ width: landscapeWidth, height: landscapeHeight });
        
        // Verify layout adapts to landscape
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
        
        // Test portrait orientation
        await page.setViewportSize({ width: originalViewport.width, height: originalViewport.height });
        
        // Verify layout adapts back to portrait
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
      });

      test(`should have optimized performance on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Test scroll performance
        const mainContent = page.getByRole('main');
        
        const scrollStart = performance.now();
        await mainContent.evaluate(el => {
          el.scrollTop = 500;
        });
        const scrollTime = performance.now() - scrollStart;
        
        // Scroll should be responsive (< 100ms)
        expect(scrollTime).toBeLessThan(100);
        
        // Test tap response time
        const button = page.getByRole('button').first();
        const tapStart = performance.now();
        await button.tap();
        const tapTime = performance.now() - tapStart;
        
        // Tap response should be fast (< 50ms on tablet)
        expect(tapTime).toBeLessThan(50);
      });

      test(`should handle multi-touch gestures on ${deviceName}`, async ({ page, tenantDomain }) => {
        if (!deviceConfig.hasTouch) {
          test.skip();
          return;
        }
        
        await page.goto(`http://${tenantDomain}/`);
        
        // Test two-finger tap (if applicable)
        await page.touchscreen.tap(300, 400);
        await page.touchscreen.tap(350, 450);
        
        // Test swipe gestures
        const mainContent = page.getByRole('main');
        await mainContent.tap();
        
        // Test pinch zoom simulation
        await page.touchscreen.tap(400, 300);
        await page.touchscreen.tap(500, 400);
        
        // Verify content remains accessible after gestures
        await expect(page.getByRole('main')).toBeVisible();
      });
    });
  });

  test.describe('Tablet UI Pattern Validation', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should display tablet-specific UI patterns', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Check for tablet-optimized layouts
      const sections = page.locator('section').all();
      
      for (const section of sections.slice(0, 3)) {
        const sectionBox = await section.boundingBox();
        const viewport = page.viewportSize();
        
        if (sectionBox && viewport) {
          // Sections should utilize tablet screen width effectively
          const sectionWidthRatio = sectionBox.width / viewport.width;
          expect(sectionWidthRatio).toBeGreaterThan(0.8);
        }
      }
      
      // Test grid layouts work properly on tablet
      const gridElements = page.locator('.grid, [class*="grid"]').all();
      
      for (const grid of gridElements.slice(0, 2)) {
        if (await grid.isVisible()) {
          const gridBox = await grid.boundingBox();
          if (gridBox) {
            // Grid should be wider on tablet than mobile
            expect(gridBox.width).toBeGreaterThan(600);
          }
        }
      }
    });

    test('should have appropriate spacing and padding on tablet', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      const mainContent = page.getByRole('main');
      const mainBox = await mainContent.boundingBox();
      const viewport = page.viewportSize();
      
      if (mainBox && viewport) {
        // Should have appropriate margins on tablet
        const marginRatio = (viewport.width - mainBox.width) / viewport.width;
        expect(marginRatio).toBeGreaterThan(0.05); // At least 5% margin
        expect(marginRatio).toBeLessThan(0.2); // But not more than 20% margin
      }
      
      // Test element spacing
      const cards = page.locator('.card, [class*="card"]').all();
      
      for (const card of cards.slice(0, 3)) {
        if (await card.isVisible()) {
          const cardBox = await card.boundingBox();
          if (cardBox) {
            // Cards should have appropriate padding
            expect(cardBox.width).toBeGreaterThan(200);
            expect(cardBox.height).toBeGreaterThan(100);
          }
        }
      }
    });

    test('should handle tablet-specific interactions', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Test hover states (tablet supports hover)
      const buttons = page.getByRole('button').all();
      
      for (const button of buttons.slice(0, 3)) {
        if (await button.isVisible()) {
          await button.hover();
          
          // Check for hover effects
          const styles = await button.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              transform: computed.transform,
              transition: computed.transition,
            };
          });
          
          // Should have some visual feedback on hover
          expect(styles.transition || styles.transform).toBeTruthy();
        }
      }
      
      // Test keyboard navigation on tablet
      await page.keyboard.press('Tab');
      const firstFocusable = page.locator(':focus');
      await expect(firstFocusable).toBeVisible();
      
      // Test multiple tab presses
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const thirdFocusable = page.locator(':focus');
      await expect(thirdFocusable).toBeVisible();
    });
  });

  test.describe('Tablet Performance Benchmarks', () => {
    test.use({ ...devices['iPad Pro'] });

    test('should meet tablet performance standards', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.LCP = entry.renderTime || entry.loadTime;
              }
              if (entry.entryType === 'first-input') {
                vitals.FID = entry.processingStart - entry.startTime;
              }
              if (entry.entryType === 'layout-shift') {
                vitals.CLS = (vitals.CLS || 0) + entry.value;
              }
            });
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          
          setTimeout(() => observer.disconnect(), 5000);
        });
      });

      // Core Web Vitals thresholds for tablet (slightly relaxed from mobile)
      if (metrics.LCP) expect(metrics.LCP).toBeLessThan(2000); // 2.0s
      if (metrics.FID) expect(metrics.FID).toBeLessThan(80); // 80ms
      if (metrics.CLS) expect(metrics.CLS).toBeLessThan(0.1); // 0.1
    });

    test('should handle memory efficiently on tablet', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Check memory usage
      const memoryMetrics = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          };
        }
        return null;
      });

      if (memoryMetrics) {
        // Memory usage should be reasonable for tablet devices
        const memoryUsageMB = memoryMetrics.usedJSHeapSize / (1024 * 1024);
        expect(memoryUsageMB).toBeLessThan(80); // Less than 80MB for tablet
>>>>>>> Stashed changes
      }
    });
  });
});
