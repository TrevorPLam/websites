import { injectAxe, getViolations } from 'axe-playwright';
import { test, expect } from '../../fixtures';

test.describe('Accessibility — Marketing site', () => {
  test('homepage has no critical accessibility violations', async ({ page, tenantDomain }) => {
    await page.goto(`http://${tenantDomain}/`);
    await injectAxe(page);

    const results = await getViolations(page, undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      },
    });

    const critical = results.filter((v) => v.impact === 'critical' || v.impact === 'serious');

    if (critical.length > 0) {
      console.error('Accessibility violations:', JSON.stringify(critical, null, 2));
    }

    expect(critical).toHaveLength(0);
  });

  test('contact form is keyboard navigable', async ({ page, tenantDomain }) => {
    await page.goto(`http://${tenantDomain}/contact`);

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/name/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/phone/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/message/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /submit|send/i })).toBeFocused();
  });

  test('skip to content link is the first focusable element', async ({ page, tenantDomain }) => {
    await page.goto(`http://${tenantDomain}/`);

    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');

    await expect(focused).toHaveText(/skip to/i);
    await expect(focused).toBeVisible();
  });
});
