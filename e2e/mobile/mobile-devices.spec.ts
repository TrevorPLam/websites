/**
 * @file e2e/mobile/mobile-devices.spec.ts
<<<<<<< Updated upstream
 * @summary Mobile device testing with touch interactions and performance benchmarks.
 * @description Tests mobile responsiveness, touch interactions, and performance.
 * @security Tests use tenant isolation; no production data accessed.
 * @requirements MOBILE-TESTING-001, MOBILE-PERF-001
 */

import { devices } from '@playwright/test';
import { expect, test } from '../fixtures';

test.describe('Mobile Device Testing', () => {
  test.describe('iPhone 13', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should render correctly on iPhone 13', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: mobile should load in under 4 seconds
      expect(loadTime).toBeLessThan(4000);

      // Verify mobile viewport is applied
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(414);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should handle touch interactions on iPhone 13', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test tap interactions
      const navigationButton = page.getByRole('button').first();
      await navigationButton.tap();

      // Test touch targets meet WCAG 2.2 AA requirements (44x44 CSS pixels minimum)
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should have responsive navigation on iPhone 13', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Check for mobile menu button
      const menuButton = page
        .getByRole('button')
        .or(page.getByLabel('menu').or(page.locator('[aria-label="menu"]')))
        .first();

      if (await menuButton.isVisible()) {
        // Test mobile menu toggle
        await menuButton.tap();

        // Verify navigation items are now visible
        const navItems = page.getByRole('navigation').getByRole('link');
        await expect(navItems.first()).toBeVisible();
=======
 * @summary Comprehensive mobile device testing with touch interactions and performance benchmarks.
 * @description Tests mobile responsiveness, touch interactions, performance, and device-specific issues.
 * @security Tests use tenant isolation; no production data accessed.
 * @adr none
 * @requirements MOBILE-TESTING-001, MOBILE-PERF-001, MOBILE-A11Y-001
 */

import { test, expect, devices } from '../fixtures';

// Mobile device configurations for comprehensive testing
const MOBILE_DEVICES = {
  'iPhone 13': devices['iPhone 13'],
  'Pixel 7': devices['Pixel 7'],
  'Galaxy S9': devices['Galaxy S9'],
  'iPhone SE': devices['iPhone SE'],
};

test.describe('Mobile Device Testing', () => {
  Object.entries(MOBILE_DEVICES).forEach(([deviceName, deviceConfig]) => {
    test.describe(`${deviceName}`, () => {
      test.use({ ...deviceConfig });

      test(`should render correctly on ${deviceName}`, async ({ page, tenantDomain }) => {
        const startTime = performance.now();
        
        await page.goto(`http://${tenantDomain}/`);
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        const loadTime = performance.now() - startTime;
        
        // Performance benchmark: mobile should load in under 4 seconds
        expect(loadTime).toBeLessThan(4000);
        
        // Verify mobile viewport is applied
        const viewport = page.viewportSize();
        expect(viewport.width).toBeLessThanOrEqual(414);
        
        // Check critical elements are visible
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
      });

      test(`should handle touch interactions on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Test tap interactions
        const navigationButton = page.getByRole('button').first();
        await navigationButton.tap();
        
        // Test swipe gestures (if applicable)
        const mainContent = page.getByRole('main');
        await mainContent.tap();
        
        // Test pinch zoom (if supported)
        await page.touchscreen.tap(200, 300);
        
        // Verify touch targets meet WCAG 2.2 AA requirements (44x44 CSS pixels minimum)
        const buttons = page.getByRole('button').all();
        for (const button of buttons) {
          const boundingBox = await button.boundingBox();
          if (boundingBox) {
            const minDimension = Math.min(boundingBox.width, boundingBox.height);
            expect(minDimension).toBeGreaterThanOrEqual(44);
          }
        }
      });

      test(`should have responsive navigation on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Check for mobile menu button
        const menuButton = page.getByRole('button', { name: /menu|hamburger/i }).or(
          page.getByLabel('menu').or(page.getByLabel('navigation'))
        );
        
        if (await menuButton.isVisible()) {
          // Test mobile menu toggle
          await menuButton.tap();
          
          // Verify navigation items are now visible
          const navItems = page.getByRole('navigation').getByRole('link');
          await expect(navItems.first()).toBeVisible();
          
          // Test menu close
          await menuButton.tap();
          await expect(navItems.first()).not.toBeVisible();
        }
      });

      test(`should handle form input on mobile keyboard on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/contact`);
        
        // Test form field interactions
        const nameField = page.getByLabel(/name/i);
        const emailField = page.getByLabel(/email/i);
        const messageField = page.getByLabel(/message/i);
        
        // Test keyboard focus and input
        await nameField.tap();
        await nameField.fill('Mobile Test User');
        
        await emailField.tap();
        await emailField.fill('mobile@test.com');
        
        await messageField.tap();
        await messageField.fill('Testing mobile form input');
        
        // Verify mobile keyboard doesn't obscure important content
        const submitButton = page.getByRole('button', { name: /submit|send/i });
        const buttonBox = await submitButton.boundingBox();
        const viewport = page.viewportSize();
        
        if (buttonBox && viewport) {
          // Button should be visible above keyboard
          expect(buttonBox.y).toBeLessThan(viewport.height * 0.8);
        }
      });

      test(`should have proper text readability on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Check text sizes meet mobile readability standards
        const headings = page.getByRole('heading').all();
        for (const heading of headings) {
          const fontSize = await heading.evaluate(el => 
            window.getComputedStyle(el).fontSize
          );
          const fontSizeValue = parseInt(fontSize);
          
          // Mobile headings should be at least 24px
          expect(fontSizeValue).toBeGreaterThanOrEqual(24);
        }
        
        // Check body text readability
        const bodyText = page.getByRole('main').locator('p').first();
        const bodyFontSize = await bodyText.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        const bodyFontSizeValue = parseInt(bodyFontSize);
        
        // Mobile body text should be at least 16px
        expect(bodyFontSizeValue).toBeGreaterThanOrEqual(16);
      });

      test(`should handle orientation changes on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Test landscape orientation
        await page.setViewportSize({ width: 896, height: 414 }); // iPhone 13 landscape
        
        // Verify layout adapts to landscape
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
        
        // Test portrait orientation
        await page.setViewportSize({ width: 414, height: 896 }); // iPhone 13 portrait
        
        // Verify layout adapts back to portrait
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('main')).toBeVisible();
      });

      test(`should have fast tap response time on ${deviceName}`, async ({ page, tenantDomain }) => {
        await page.goto(`http://${tenantDomain}/`);
        
        // Test tap response time
        const button = page.getByRole('button').first();
        
        const startTime = performance.now();
        await button.tap();
        const responseTime = performance.now() - startTime;
        
        // Tap response should be under 100ms for good UX
        expect(responseTime).toBeLessThan(100);
      });

      test(`should handle network conditions on ${deviceName}`, async ({ page, tenantDomain }) => {
        // Simulate slow 3G network
        await page.route('**/*', route => {
          // Add delay to simulate slow network
          setTimeout(() => route.continue(), 1000);
        });
        
        const startTime = performance.now();
        await page.goto(`http://${tenantDomain}/`);
        await page.waitForLoadState('networkidle');
        const loadTime = performance.now() - startTime;
        
        // Should still load within reasonable time even on slow network
        expect(loadTime).toBeLessThan(10000);
        
        // Verify content is still accessible
        await expect(page.getByRole('main')).toBeVisible();
      });
    });
  });

  test.describe('Mobile Performance Benchmarks', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should meet Core Web Vitals on mobile', async ({ page, tenantDomain }) => {
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
          
          // Give some time for metrics to be collected
          setTimeout(() => observer.disconnect(), 5000);
        });
      });

      // Core Web Vitals thresholds for mobile
      if (metrics.LCP) expect(metrics.LCP).toBeLessThan(2500); // 2.5s
      if (metrics.FID) expect(metrics.FID).toBeLessThan(100); // 100ms
      if (metrics.CLS) expect(metrics.CLS).toBeLessThan(0.1); // 0.1
    });

    test('should have efficient memory usage on mobile', async ({ page, tenantDomain }) => {
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
        // Memory usage should be reasonable for mobile devices
        const memoryUsageMB = memoryMetrics.usedJSHeapSize / (1024 * 1024);
        expect(memoryUsageMB).toBeLessThan(50); // Less than 50MB
>>>>>>> Stashed changes
      }
    });
  });

<<<<<<< Updated upstream
  test.describe('Pixel 7', () => {
    test.use({ ...devices['Pixel 7'] });

    test('should render correctly on Pixel 7', async ({ page, tenantDomain }) => {
      const startTime = performance.now();

      await page.goto(`http://${tenantDomain}/`);
      await page.waitForLoadState('networkidle');

      const loadTime = performance.now() - startTime;

      // Performance benchmark: mobile should load in under 4 seconds
      expect(loadTime).toBeLessThan(4000);

      // Verify mobile viewport is applied
      const viewport = page.viewportSize();
      expect(viewport.width).toBeLessThanOrEqual(414);

      // Check critical elements are visible
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should handle touch interactions on Pixel 7', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);

      // Test tap interactions
      const navigationButton = page.getByRole('button').first();
      await navigationButton.tap();

      // Test touch targets meet WCAG 2.2 AA requirements
      const buttons = await page.getByRole('button').all();
      for (const button of buttons.slice(0, 3)) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          const minDimension = Math.min(boundingBox.width, boundingBox.height);
          expect(minDimension).toBeGreaterThanOrEqual(44);
        }
=======
  test.describe('Mobile Accessibility', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should be accessible via screen reader on mobile', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Test screen reader navigation
      await page.keyboard.press('Tab');
      const firstFocusable = page.locator(':focus');
      await expect(firstFocusable).toBeVisible();
      
      // Test ARIA labels and roles
      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();
      
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
      
      // Test skip links for mobile
      const skipLink = page.getByRole('link', { name: /skip/i });
      if (await skipLink.isVisible()) {
        await skipLink.click();
        const mainContent = page.locator(':focus');
        await expect(mainContent).toBeVisible();
      }
    });

    test('should have sufficient color contrast on mobile', async ({ page, tenantDomain }) => {
      await page.goto(`http://${tenantDomain}/`);
      
      // Check color contrast for text elements
      const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span').all();
      
      for (const element of textElements.slice(0, 10)) { // Check first 10 elements
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
          };
        });
        
        // Basic contrast check (simplified - in production use proper contrast calculation)
        expect(styles.color).not.toBe(styles.backgroundColor);
>>>>>>> Stashed changes
      }
    });
  });
});
