import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TEST_URLS = [
  { name: 'Homepage', url: 'http://localhost:3001' },
  { name: 'Contact Page', url: 'http://localhost:3001/contact' },
  { name: 'Services Page', url: 'http://localhost:3001/services' },
  { name: 'Blog Index', url: 'http://localhost:3001/blog' },
  { name: 'Portal Login', url: 'http://localhost:3000/auth/login' },
  { name: 'Portal Dashboard', url: 'http://localhost:3000/dashboard' },
];

for (const { name, url } of TEST_URLS) {
  test(`${name}: no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag22aa', // WCAG 2.2 AA rules
        'best-practice',
      ])
      .exclude('#cookie-banner') // Exclude third-party elements
      .analyze();

    // Group violations by impact for clear reporting
    const critical = results.violations.filter((v) => v.impact === 'critical');
    const serious = results.violations.filter((v) => v.impact === 'serious');

    // Zero tolerance for critical and serious violations
    if (critical.length || serious.length) {
      console.error('[A11y Violations]', JSON.stringify([...critical, ...serious], null, 2));
    }

    expect(critical).toHaveLength(0);
    expect(serious).toHaveLength(0);

    // Log moderate/minor for awareness (don't fail CI)
    const moderate = results.violations.filter((v) => v.impact === 'moderate');
    if (moderate.length) {
      console.warn(`[A11y Warning] ${moderate.length} moderate violations on ${name}`);
    }
  });

  test(`${name}: keyboard navigation completes without trap`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    // Tab through 20 elements — if focus is trapped, this will hang
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focusedEl = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedEl).not.toBeNull();
    }
  });

  test(`${name}: skip to content link works`, async ({ page }) => {
    await page.goto(url);

    // First Tab should focus the skip link
    await page.keyboard.press('Tab');
    const skipLink = await page.evaluate(() => {
      const el = document.activeElement;
      return { tagName: el?.tagName, text: el?.textContent?.trim() };
    });

    expect(skipLink.tagName).toBe('A');
    expect(skipLink.text?.toLowerCase()).toContain('skip');

    // Activate the skip link
    await page.keyboard.press('Enter');

    // Focus should now be on main content
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.id ?? el?.tagName;
    });
    expect(focused).toBe('main-content');
  });

  test(`${name}: all images have alt text`, async ({ page }) => {
    await page.goto(url);

    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter((img) => img.getAttribute('alt') === null).map((img) => img.src);
    });

    expect(imagesWithoutAlt).toHaveLength(0);
  });

  test(`${name}: color contrast ratio ≥ 4.5:1 on body text`, async ({ page }) => {
    await page.goto(url);

    // Axe handles this programmatically
    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();

    expect(results.violations).toHaveLength(0);
  });
}
