/**
 * @file e2e/fixtures/index.ts
 * @summary Playwright test fixtures for E2E testing with tenant isolation.
 * @description Provides custom fixtures for Supabase client, tenant context, and form testing.
 * @security Handles test credentials securely; no production data accessed.
 * @adr none
 * @requirements E2E-FIXTURES-001, test-fixtures
 */

import { test as base, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

interface CustomFixtures {
  tenantId: string;
  tenantDomain: string;
  supabase: ReturnType<typeof createClient>;
  leadCountBefore: number;
  submitContactForm: (options: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => Promise<{ leadId: string }>;
}

export const test = base.extend<CustomFixtures>({
  tenantId: async ({}, use) => {
    await use(process.env.TEST_TENANT_ID ?? '');
  },

  tenantDomain: async ({ tenantId, supabase }, use) => {
    const { data } = await supabase.from('tenants').select('subdomain').eq('id', tenantId).single();

    await use(`${data?.subdomain}.localhost:3000`);
  },

  supabase: async ({}, use) => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'test-service-role-key'
    );
    await use(client);
  },

  leadCountBefore: async ({ tenantId, supabase }, use) => {
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    await use(count ?? 0);
  },

  submitContactForm: async ({ page, tenantDomain }, use) => {
    const submit = async (options: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }): Promise<{ leadId: string }> => {
      await page.goto(`http://${tenantDomain}/contact`);

      await page.getByLabel(/name/i).fill(options.name);
      await page.getByLabel(/email/i).fill(options.email);
      if (options.phone) {
        await page.getByLabel(/phone/i).fill(options.phone);
      }
      await page.getByLabel(/message/i).fill(options.message);

      const responsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/api/contact') && (resp.status() === 200 || resp.status() === 201)
      );

      await page.getByRole('button', { name: /submit|send|contact/i }).click();

      const response = await responsePromise;
      const body = await response.json();

      return { leadId: body.leadId };
    };

    await use(submit);
  },
});

export { expect };
