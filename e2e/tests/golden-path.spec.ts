/**
 * @file e2e/tests/golden-path.spec.ts
 * @summary Golden path E2E coverage for the primary marketing conversion flow.
 * @description Exercises homepage navigation to contact and validates successful lead submission UX.
 * @security Uses isolated test tenant fixtures and synthetic payloads only.
 * @adr none
 * @requirements TASK-040, E2E-GOLDEN-PATH-001
 */

import { expect, test } from '../fixtures';

test.describe('Golden path: homepage to contact conversion', () => {
  test('visitor can navigate from homepage to contact page and submit a lead', async ({
    page,
    tenantDomain,
    submitContactForm,
  }) => {
    await page.goto(`http://${tenantDomain}/`);

    await expect(page).toHaveTitle(/.+/);

    const contactCta = page.getByRole('link', { name: /contact|get started|book/i }).first();
    await expect(contactCta).toBeVisible();
    await contactCta.click();

    await expect(page).toHaveURL(/\/contact/);

    await submitContactForm({
      name: 'Golden Path Visitor',
      email: `golden-path+${Date.now()}@example.com`,
      phone: '555-000-0000',
      message: 'Looking for implementation support and next steps.',
    });

    await expect(page.getByRole('alert')).toContainText(/thank|received|follow/i);
  });
});
