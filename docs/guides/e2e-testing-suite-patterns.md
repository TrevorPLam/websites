<!--
/**
 * @file e2e-testing-suite-patterns.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for e2e testing suite patterns.
 * @entrypoints docs/guides/e2e-testing-suite-patterns.md
 * @exports e2e testing suite patterns
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# e2e-testing-suite-patterns.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

End-to-end testing for a multi-tenant platform requires strategies beyond standard single-app Playwright patterns. Each test must establish a known tenant context, authenticate as a specific role, and make assertions against that tenant's data in isolation. [blog.akbarsahata](https://blog.akbarsahata.id/articles/end-to-end-testing-in-a-next-js-monorepo-with-playwright-and-turborepo.md)

---

## Test Package Structure

```
packages/e2e/
├── playwright.config.ts
├── fixtures/
│   ├── tenant.fixture.ts    ← Per-test tenant context setup
│   ├── auth.fixture.ts      ← Clerk session injection
│   └── db.fixture.ts        ← Supabase test data seeding
├── helpers/
│   ├── tenant-helpers.ts
│   └── lead-helpers.ts
├── page-objects/
│   ├── LeadFeedPage.ts
│   ├── PortalSettingsPage.ts
│   └── MarketingContactPage.ts
└── specs/
    ├── lead-capture.spec.ts
    ├── portal-settings.spec.ts
    ├── service-area-pages.spec.ts
    └── domain-verification.spec.ts
```

---

## Playwright Configuration

```typescript
// packages/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // No .only in CI
  retries: process.env.CI ? 2 : 0, // Retry flaky tests in CI
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Marketing site — test from each tenant's domain
    {
      name: 'marketing-hvac',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://demo-hvac.localhost:3000',
        extraHTTPHeaders: { 'x-playwright-tenant': 'demo-hvac' },
      },
    },
    {
      name: 'portal',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    // Mobile — contact form + offline behavior
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        baseURL: 'http://demo-hvac.localhost:3000',
      },
    },
  ],
});
```

---

## Tenant-Aware Test Fixtures

```typescript
// packages/e2e/fixtures/tenant.fixture.ts
import { test as base } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface TenantFixture {
  tenantId: string;
  subdomain: string;
  cleanup: () => Promise<void>;
}

// Extend base test with tenant fixture
export const test = base.extend<{ tenant: TenantFixture }>({
  tenant: async ({}, use) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create isolated test tenant
    const tenantId = uuidv4();
    const subdomain = `test-${tenantId.slice(0, 8)}`;

    await supabase.from('tenants').insert({
      id: tenantId,
      subdomain,
      status: 'active',
      plan: 'pro',
      config: {
        identity: {
          siteName: 'Playwright Test Business',
          industry: 'hvac',
          contact: { phone: '(555) 000-0000', email: 'test@example.com' },
          address: { city: 'Test City', state: 'TX' },
          serviceAreas: ['Test City, TX', 'Nearby City, TX'],
          services: [{ name: 'Test Service', slug: 'test-service', description: 'A test service' }],
        },
        theme: { colors: { primary: '#2563eb' } },
      },
    });

    await use({
      tenantId,
      subdomain,
      cleanup: async () => {
        // Cascade deletes leads, bookings, etc. via FK constraints
        await supabase.from('tenants').delete().eq('id', tenantId);
      },
    });
  },
});

export const expect = base.expect;
```

---

## Page Object Model

```typescript
// packages/e2e/page-objects/MarketingContactPage.ts
import { type Page, type Locator } from '@playwright/test';

export class MarketingContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Your name');
    this.emailInput = page.getByLabel('Email address');
    this.phoneInput = page.getByLabel('Phone number');
    this.messageInput = page.getByLabel('Message');
    this.submitButton = page.getByRole('button', { name: /send message|get a quote/i });
    this.successMessage = page.getByRole('status').filter({ hasText: /thank you/i });
  }

  async goto(baseURL: string) {
    await this.page.goto(`${baseURL}/contact`);
  }

  async fillAndSubmit(data: { name: string; email: string; phone?: string; message: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.messageInput.fill(data.message);
    await this.submitButton.click();
  }

  async expectSuccess() {
    await this.successMessage.waitFor({ state: 'visible', timeout: 10_000 });
  }
}
```

---

## Multi-Tenant Test Spec

```typescript
// packages/e2e/specs/lead-capture.spec.ts
import { test, expect } from '../fixtures/tenant.fixture';
import { MarketingContactPage } from '../page-objects/MarketingContactPage';
import { createClient } from '@supabase/supabase-js';

test.describe('Lead capture — multi-tenant isolation', () => {
  test('contact form creates lead scoped to correct tenant', async ({ page, tenant }) => {
    const contact = new MarketingContactPage(page);

    // Navigate to this test tenant's marketing site
    await contact.goto(`http://${tenant.subdomain}.localhost:3000`);

    await contact.fillAndSubmit({
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '(555) 123-4567',
      message: 'I need HVAC service',
    });

    await contact.expectSuccess();

    // Verify lead was created in DB scoped to this tenant
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenant.tenantId)
      .eq('email', 'testuser@example.com');

    expect(leads).toHaveLength(1);
    expect(leads![0].name).toBe('Test User');
    expect(leads![0].score).toBeGreaterThanOrEqual(0);
    expect(leads![0].score).toBeLessThanOrEqual(100);
  });

  test('tenant A cannot see tenant B leads in Realtime', async ({ page, tenant }) => {
    // Subscribe to tenant A's Realtime channel
    const realtimeEvents: unknown[] = [];

    await page.goto(`http://${tenant.subdomain}.localhost:3000`);
    await page.evaluate((tenantId) => {
      // Simulate Realtime subscription
      window.__testRealtimeEvents = [];
    }, tenant.tenantId);

    // Insert a lead for a DIFFERENT tenant directly via service role
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const otherTenantId = '00000000-0000-0000-0000-000000000001'; // Known test tenant
    await supabase.from('leads').insert({
      tenant_id: otherTenantId,
      name: 'Other Tenant Lead',
      email: 'other@example.com',
      message: 'Test',
      score: 75,
      source: 'contact_form',
    });

    // Wait and assert no cross-tenant event received
    await page.waitForTimeout(2000);
    const events = await page.evaluate(() => (window as any).__testRealtimeEvents ?? []);
    expect(events.filter((e: any) => e.email === 'other@example.com')).toHaveLength(0);
  });

  test.afterEach(async ({ tenant }) => {
    await tenant.cleanup();
  });
});
```

---

## CI Configuration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, staging]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    services:
      postgres:
        image: supabase/postgres:15.1.1.78
        env: { POSTGRES_PASSWORD: postgres }
        options: --health-cmd pg_isready --health-interval 10s
        ports: ['5432:5432']

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: '9' }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: npx supabase db push --local # Apply migrations to test DB
      - run: npx tsx scripts/seed.ts # Seed fixture tenants
      - run: pnpm --filter marketing build
      - run: pnpm --filter portal build
      - name: Install Playwright
        run: pnpm --filter e2e exec playwright install chromium
      - name: Run E2E tests
        run: pnpm --filter e2e test
        env:
          CI: true
          SUPABASE_URL: http://localhost:54321
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.LOCAL_SUPABASE_SERVICE_KEY }}
          PLAYWRIGHT_BASE_URL: http://localhost:3000
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ github.sha }}
          path: packages/e2e/playwright-report/
          retention-days: 14
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Playwright Official Documentation — https://playwright.dev/docs/intro
- E2E Testing in Next.js Monorepo — https://blog.akbarsahata.id/articles/end-to-end-testing-in-a-next-js-monorepo-with-playwright-and-turborepo.md
- Makerkit E2E with Playwright — https://makerkit.dev/docs/nextjs-prisma/testing/e2e
- Next.js Playwright Best Practices — https://www.linkedin.com/pulse/test-nextjs-apps-playwright-5-best-practices-javascriptmastery-3ubpc


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]
