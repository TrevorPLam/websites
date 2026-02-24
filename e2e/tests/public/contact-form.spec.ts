import { test, expect } from '../../fixtures';

test.describe('Contact form → Lead creation', () => {
  test('submitting form creates a lead in the database', async ({
    page,
    tenantDomain,
    tenantId,
    supabase,
    submitContactForm,
    leadCountBefore,
  }) => {
    const leadId = await submitContactForm({
      name: 'Test Visitor',
      email: `test+${Date.now()}@example.com`,
      phone: '555-867-5309',
      message: 'I need an emergency HVAC repair, my AC is broken',
    });

    await expect(page.getByRole('alert')).toContainText(/thank|received|follow/i);

    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId.leadId)
      .single();

    expect(lead).not.toBeNull();
    expect(lead?.name).toBe('Test Visitor');
    expect(lead?.score).toBeGreaterThan(0);
    expect(lead?.tenant_id).toBe(tenantId);

    const { count: countAfter } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    expect(countAfter).toBe(leadCountBefore + 1);
  });

  test('form blocks submission with invalid email', async ({ page, tenantDomain }) => {
    await page.goto(`http://${tenantDomain}/contact`);

    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('not-an-email');
    await page.getByLabel(/message/i).fill('Test message that is long enough');
    await page.getByRole('button', { name: /submit|send/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/email|valid/i);
  });

  test('phone click is tracked as an event', async ({ page, tenantDomain, tenantId, supabase }) => {
    await page.goto(`http://${tenantDomain}/`);

    const phoneLink = page.getByRole('link', { name: /^\+?[\d\s\(\)\-]{7,}$/ }).first();
    await phoneLink.click();

    await page.waitForTimeout(500);

    const { count } = await supabase
      .from('phone_click_events')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    expect(count).toBeGreaterThan(0);
  });
});
