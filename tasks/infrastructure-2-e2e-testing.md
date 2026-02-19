# Infrastructure-2: End-to-End (E2E) Testing Architecture

## Metadata

- **Task ID**: infrastructure-2-e2e-testing
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Testing)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Testing strategy, multi-tenant testing, THEGOAL testing
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-2-rls-multi-tenant, security-1-server-action-hardening
- **Downstream Tasks**: None

## Context

Current testing setup:
- Unit tests exist (~646 tests)
- E2E tests minimal or scaffolded
- No systematic multi-tenant E2E strategy
- No visual regression testing

This addresses **Research Topic #21: End-to-End (E2E) Testing Architecture** from perplexity research.

## Dependencies

- **Upstream Tasks**: 
  - `security-2-rls-multi-tenant` — RLS policies must be in place for isolation tests
  - `security-1-server-action-hardening` — Secure actions must be implemented for security tests
- **Required Packages**: Playwright, `@repo/infra`, test fixtures

## Cross-Task Dependencies & Sequencing

- **Upstream**: `security-2-rls-multi-tenant`, `security-1-server-action-hardening`
- **Parallel Work**: Can work alongside other testing improvements
- **Downstream**: Supports all feature development (E2E coverage)

## Research

- **Primary topics**: [R-TEST](RESEARCH-INVENTORY.md#r-test-jest-axe-core-playwright), [R-E2E-TESTING](RESEARCH-INVENTORY.md#r-e2e-testing) (new)
- **[2026-02] Research Topic #21**: E2E testing requirements:
  - Use Playwright or Cypress with isolated tenant test data
  - Parallelism tuned for CI
  - Visual regression testing (Playwright snapshots or Percy)
- **References**: 
  - [docs/research/perplexity-performance-2026.md](../docs/research/perplexity-performance-2026.md) (Topic #21)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)
  - Playwright documentation

## Related Files

- `tests/e2e/playwright.config.ts` – create – Playwright configuration
- `tests/e2e/fixtures/tenant.ts` – create – Tenant test fixture
- `tests/e2e/fixtures/auth.ts` – create – Auth test fixture
- `tests/e2e/specs/booking.spec.ts` – create – Booking flow E2E tests
- `tests/e2e/specs/tenant-isolation.spec.ts` – create – Cross-tenant isolation tests
- `tests/e2e/specs/seo.spec.ts` – create – SEO checks (canonical URLs, sitemaps)
- `docs/operations/testing-strategy.md` – create or update – E2E section

## Acceptance Criteria

- [ ] Playwright test harness created:
  - Configuration for multi-tenant testing
  - Fixtures for tenant provisioning, auth, cleanup
  - Parallelism configured for CI
- [ ] Tenant test fixture:
  - Provisions test tenant, seeds site/config
  - Runs tests, then cleans up
- [ ] E2E tests for critical flows:
  - Booking flow (create, confirm, cancel)
  - Cross-tenant isolation (tenant A cannot access tenant B data)
  - SEO checks (canonical URLs, sitemaps, JSON-LD)
- [ ] Visual regression testing:
  - Playwright snapshots or Percy integration
  - Key pages (home, booking, contact)
- [ ] CI integration:
  - `e2e` job in `.github/workflows/ci.yml`
  - Smoke suite per tenant on PRs
  - Full suite nightly
- [ ] Documentation created: `docs/operations/testing-strategy.md` (E2E section)
- [ ] Flakiness tracking and mitigation

## Technical Constraints

- Must work with Next.js App Router
- Must support multi-tenant test isolation
- Must run in CI (GitHub Actions)
- Visual regression must be deterministic

## Implementation Plan

### Phase 1: Playwright Setup
- [ ] Install Playwright:
  ```bash
  pnpm add -D @playwright/test
  pnpm exec playwright install
  ```
- [ ] Create `tests/e2e/playwright.config.ts`:
  - Base URL configuration
  - Parallelism settings
  - Screenshot/recording options
  - Test timeout configuration

### Phase 2: Test Fixtures
- [ ] Create `tests/e2e/fixtures/tenant.ts`:
  ```typescript
  export const test = base.extend({
    tenant: async ({}, use) => {
      // Provision test tenant
      const tenant = await provisionTestTenant();
      await use(tenant);
      // Cleanup
      await cleanupTestTenant(tenant.id);
    },
  });
  ```
- [ ] Create `tests/e2e/fixtures/auth.ts`:
  - Login helpers
  - Session management
  - Multi-tenant auth support

### Phase 3: Critical Flow Tests
- [ ] Create `tests/e2e/specs/booking.spec.ts`:
  - Booking creation flow
  - Booking confirmation flow
  - Booking cancellation flow
  - Error handling
- [ ] Create `tests/e2e/specs/tenant-isolation.spec.ts`:
  - Cross-tenant booking access fails
  - Cross-tenant data access fails
  - Same-tenant access succeeds

### Phase 4: SEO & Accessibility Tests
- [ ] Create `tests/e2e/specs/seo.spec.ts`:
  - Canonical URLs present
  - Sitemap accessible
  - JSON-LD schema present
  - Robots.txt correct
- [ ] Create `tests/e2e/specs/accessibility.spec.ts`:
  - axe-core integration
  - WCAG 2.2 AA checks

### Phase 5: Visual Regression
- [ ] Configure Playwright snapshots:
  - Key pages (home, booking, contact)
  - Responsive breakpoints
- [ ] Or integrate Percy (if preferred):
  - Visual comparison setup
  - Baseline creation

### Phase 6: CI Integration
- [ ] Update `.github/workflows/ci.yml`:
  - Add `e2e` job
  - Run smoke suite on PRs (affected tenants)
  - Run full suite nightly
- [ ] Configure parallelism:
  - Multiple workers for faster execution
  - Test sharding if needed

### Phase 7: Documentation
- [ ] Create/update `docs/operations/testing-strategy.md`:
  - E2E testing section
  - Fixture usage guide
  - CI configuration

## Sample code / examples

### Playwright Configuration
```typescript
// tests/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3101',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### Tenant Fixture
```typescript
// tests/e2e/fixtures/tenant.ts
import { test as base } from '@playwright/test';
import { provisionTestTenant, cleanupTestTenant } from '../helpers/tenant';

export const test = base.extend({
  tenant: async ({}, use) => {
    const tenant = await provisionTestTenant({
      name: `test-tenant-${Date.now()}`,
      siteConfig: {
        // Minimal test config
      },
    });

    await use(tenant);

    await cleanupTestTenant(tenant.id);
  },
});

export { expect } from '@playwright/test';
```

### Booking Flow Test
```typescript
// tests/e2e/specs/booking.spec.ts
import { test, expect } from '../fixtures/tenant';

test.describe('Booking Flow', () => {
  test('should create and confirm booking', async ({ page, tenant }) => {
    // Navigate to booking page
    await page.goto(`/${tenant.slug}/book`);

    // Fill booking form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.selectOption('[name="service"]', 'consultation');
    await page.click('[data-testid="submit-booking"]');

    // Wait for confirmation
    await expect(page.locator('[data-testid="booking-confirmed"]')).toBeVisible();

    // Verify booking in database (via API or direct DB access)
    const booking = await getBookingByEmail('test@example.com', tenant.id);
    expect(booking).toBeTruthy();
    expect(booking.status).toBe('pending');
  });
});
```

### Tenant Isolation Test
```typescript
// tests/e2e/specs/tenant-isolation.spec.ts
import { test, expect } from '../fixtures/tenant';

test.describe('Tenant Isolation', () => {
  test('tenant A cannot access tenant B booking', async ({ page }) => {
    // Create tenant A and booking
    const tenantA = await provisionTestTenant({ name: 'tenant-a' });
    const bookingA = await createBooking(tenantA.id, { email: 'a@example.com' });

    // Login as tenant B
    await loginAsTenant(page, 'tenant-b');

    // Attempt to access tenant A booking
    const response = await page.goto(`/bookings/${bookingA.id}`);
    
    // Should fail (403 or 404)
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
```

### SEO Test
```typescript
// tests/e2e/specs/seo.spec.ts
import { test, expect } from '../fixtures/tenant';

test.describe('SEO', () => {
  test('should have canonical URL', async ({ page, tenant }) => {
    await page.goto(`/${tenant.slug}`);
    
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain(tenant.slug);
  });

  test('should have JSON-LD schema', async ({ page, tenant }) => {
    await page.goto(`/${tenant.slug}`);
    
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    
    const schema = JSON.parse(jsonLd!);
    expect(schema['@type']).toBe('LocalBusiness');
  });
});
```

## Testing Requirements

- **E2E Tests:**
  - Booking flow (create, confirm, cancel)
  - Cross-tenant isolation (access fails)
  - SEO checks (canonical, sitemap, JSON-LD)
  - Accessibility checks (axe-core)
- **Visual Regression:**
  - Key pages snapshots
  - Responsive breakpoints
- **CI Tests:**
  - Smoke suite runs on PRs
  - Full suite runs nightly

## Execution notes

- **Related files — current state:** 
  - Unit tests exist (~646 tests)
  - E2E tests minimal or scaffolded
  - No Playwright configuration
- **Potential issues / considerations:** 
  - Test data isolation (cleanup between tests)
  - Flakiness (retries, timeouts)
  - CI performance (parallelism, sharding)
- **Verification:** 
  - E2E tests run locally
  - E2E tests run in CI
  - Visual regression baselines created

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Playwright test harness created
- [ ] Critical flow tests implemented (booking, isolation, SEO)
- [ ] Visual regression configured
- [ ] CI integration complete (e2e job)
- [ ] Documentation created (`docs/operations/testing-strategy.md`)
- [ ] Tests stable (low flakiness)
