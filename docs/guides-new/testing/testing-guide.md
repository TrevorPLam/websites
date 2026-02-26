---
title: Testing Guide
description: Comprehensive testing strategy for multi-tenant SaaS applications with unit, integration, E2E, and accessibility testing
last_updated: 2026-02-26
tags: [#testing #playwright #vitest #testing-library #accessibility #e2e]
estimated_read_time: 60 minutes
difficulty: intermediate
---

# Testing Guide

## Overview

Comprehensive testing strategy for multi-tenant SaaS applications using modern testing frameworks and best practices. This guide covers unit testing with Vitest, component testing with React Testing Library, end-to-end testing with Playwright, and accessibility testing with axe-core.

## Key Features

- **Unit Testing**: Fast unit tests with Vitest and TypeScript
- **Component Testing**: User-focused testing with React Testing Library
- **E2E Testing**: Multi-tenant end-to-end testing with Playwright
- **Accessibility Testing**: Automated WCAG compliance with axe-core
- **Multi-Tenant Testing**: Tenant isolation and context-aware testing
- **Performance Testing**: Core Web Vitals and performance regression testing
- **2026 Standards**: Latest testing patterns and best practices

---

## 🧪 Unit Testing with Vitest

### Core Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    // Test environment
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],

    // Global APIs
    globals: true,

    // Test matching
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: ['node_modules', 'dist'],

    // Performance optimization
    threads: true,
    isolate: true,
    pool: 'threads',

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/test/',
        'src/mocks/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Timeout and retry
    testTimeout: 10000,
    hookTimeout: 10000,
    retry: process.env.CI ? 2 : 0,
  },

  // Vite config integration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@repo': resolve(__dirname, './packages'),
    },
  },
});
```

### Test Setup and Utilities

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

// Global test utilities
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Unit Testing Patterns

```typescript
// src/lib/__tests__/validation.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { validateTenantData } from '../validation';

describe('Tenant Validation', () => {
  describe('validateTenantData', () => {
    it('should validate valid tenant data', () => {
      const validData = {
        name: 'Test Company',
        domain: 'test.example.com',
        plan: 'professional',
      };

      const result = validateTenantData(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject invalid tenant data', () => {
      const invalidData = {
        name: '', // Empty name
        domain: 'invalid-domain', // Invalid domain format
        plan: 'invalid-plan',
      };

      const result = validateTenantData(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(3);
    });

    it('should handle missing required fields', () => {
      const incompleteData = {
        name: 'Test Company',
        // Missing domain and plan
      };

      const result = validateTenantData(incompleteData);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(issue => issue.path.includes('domain'))).toBe(true);
    });
  });
});
```

### Mocking and Test Doubles

```typescript
// src/lib/__tests__/tenant-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantService } from '../tenant-service';
import { mockTenant } from '@/test/mocks/tenant';

// Mock the database client
vi.mock('@repo/db', () => ({
  db: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        where: vi.fn(() => ({
          single: vi.fn(),
          eq: vi.fn(),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

describe('TenantService', () => {
  let tenantService: TenantService;

  beforeEach(() => {
    vi.clearAllMocks();
    tenantService = new TenantService();
  });

  describe('createTenant', () => {
    it('should create a new tenant successfully', async () => {
      const tenantData = {
        name: 'New Company',
        domain: 'new.example.com',
        plan: 'basic',
      };

      const expectedTenant = mockTenant(tenantData);
      
      // Mock database response
      const { db } = await import('@repo/db');
      vi.mocked(db.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: expectedTenant, error: null }),
          }),
        }),
      } as any);

      const result = await tenantService.createTenant(tenantData);

      expect(result).toEqual(expectedTenant);
      expect(db.from).toHaveBeenCalledWith('tenants');
    });

    it('should handle database errors gracefully', async () => {
      const tenantData = {
        name: 'Error Company',
        domain: 'error.example.com',
        plan: 'basic',
      };

      // Mock database error
      const { db } = await import('@repo/db');
      vi.mocked(db.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ 
              data: null, 
              error: { message: 'Database constraint violation' } 
            }),
          }),
        }),
      } as any);

      await expect(tenantService.createTenant(tenantData))
        .rejects.toThrow('Database constraint violation');
    });
  });
});
```

---

## 🎯 Component Testing with React Testing Library

### Testing Philosophy

React Testing Library focuses on testing components from a user's perspective rather than testing implementation details. This approach increases confidence that your application works for real users and reduces test fragility when refactoring.

### Core Testing Patterns

```typescript
// src/components/__tests__/TenantForm.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TenantForm } from '../TenantForm';

describe('TenantForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields correctly', () => {
    render(<TenantForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create tenant/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<TenantForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create tenant/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/domain is required/i)).toBeInTheDocument();
      expect(screen.getByText(/plan is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<TenantForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/company name/i), 'Test Company');
    await user.type(screen.getByLabelText(/domain/i), 'test.example.com');
    await user.selectOptions(screen.getByLabelText(/plan/i), 'professional');

    const submitButton = screen.getByRole('button', { name: /create tenant/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Company',
        domain: 'test.example.com',
        plan: 'professional',
      });
    });
  });

  it('should handle API submission errors', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<TenantForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/company name/i), 'Test Company');
    await user.type(screen.getByLabelText(/domain/i), 'test.example.com');
    await user.selectOptions(screen.getByLabelText(/plan/i), 'professional');

    const submitButton = screen.getByRole('button', { name: /create tenant/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create tenant/i)).toBeInTheDocument();
    });
  });

  it('should be accessible', async () => {
    const { container } = render(<TenantForm onSubmit={mockOnSubmit} />);
    
    // Check for proper form structure
    expect(container.querySelector('form')).toBeInTheDocument();
    
    // Check for proper labeling
    expect(screen.getByLabelText(/company name/i)).toHaveAttribute('id');
    expect(screen.getByLabelText(/domain/i)).toHaveAttribute('id');
    
    // Check for submit button
    const submitButton = screen.getByRole('button', { name: /create tenant/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
```

### Advanced Component Testing

```typescript
// src/components/__tests__/TenantDashboard.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { TenantDashboard } from '../TenantDashboard';
import { mockTenant, mockMetrics } from '@/test/mocks';

// Mock child components
vi.mock('../TenantMetrics', () => ({
  TenantMetrics: ({ metrics }: { metrics: any }) => (
    <div data-testid="tenant-metrics">
      <span>Users: {metrics.users}</span>
      <span>Revenue: ${metrics.revenue}</span>
    </div>
  ),
}));

vi.mock('../TenantSettings', () => ({
  TenantSettings: ({ tenant }: { tenant: any }) => (
    <div data-testid="tenant-settings">
      <span>Settings for {tenant.name}</span>
    </div>
  ),
}));

describe('TenantDashboard', () => {
  it('should display tenant information', () => {
    const tenant = mockTenant();
    render(<TenantDashboard tenant={tenant} />);

    expect(screen.getByText(tenant.name)).toBeInTheDocument();
    expect(screen.getByText(tenant.domain)).toBeInTheDocument();
    expect(screen.getByText(tenant.plan)).toBeInTheDocument();
  });

  it('should render metrics component', () => {
    const tenant = mockTenant();
    const metrics = mockMetrics();
    
    render(<TenantDashboard tenant={tenant} metrics={metrics} />);
    
    const metricsComponent = screen.getByTestId('tenant-metrics');
    expect(metricsComponent).toBeInTheDocument();
    expect(metricsComponent).toHaveTextContent(`Users: ${metrics.users}`);
    expect(metricsComponent).toHaveTextContent(`Revenue: $${metrics.revenue}`);
  });

  it('should show loading state', () => {
    const tenant = mockTenant();
    render(<TenantDashboard tenant={tenant} loading={true} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByTestId('tenant-metrics')).not.toBeInTheDocument();
  });

  it('should handle error state', () => {
    const tenant = mockTenant();
    render(<TenantDashboard tenant={tenant} error="Failed to load data" />);

    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    expect(screen.queryByTestId('tenant-metrics')).not.toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const tenant = mockTenant();
    const { container } = render(<TenantDashboard tenant={tenant} />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for landmark elements
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('nav')).toBeInTheDocument();

    // Check for ARIA labels
    expect(screen.getByRole('region', { name: /tenant metrics/i })).toBeInTheDocument();
  });
});
```

---

## 🎭 End-to-End Testing with Playwright

### Multi-Tenant Configuration

```typescript
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
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
    // Marketing site - test from each tenant's domain
    {
      name: 'marketing-hvac',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://demo-hvac.localhost:3000',
        extraHTTPHeaders: { 'x-playwright-tenant': 'demo-hvac' },
      },
    },
    {
      name: 'marketing-plumbing',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://demo-plumbing.localhost:3000',
        extraHTTPHeaders: { 'x-playwright-tenant': 'demo-plumbing' },
      },
    },
    // Portal application
    {
      name: 'portal',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    // Mobile testing
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        baseURL: 'http://demo-hvac.localhost:3000',
      },
    },
  ],

  // Global setup for test data
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
});
```

### Tenant-Aware Test Fixtures

```typescript
// e2e/fixtures/tenant.fixture.ts
import { test as base, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface TenantFixture {
  tenantId: string;
  subdomain: string;
  cleanup: () => Promise<void>;
}

// Extend base test with tenant fixture
export const test = base.extend<TenantFixture>({
  tenantId: async ({}, use) => {
    const tenantId = uuidv4();
    await use(tenantId);
  },

  subdomain: async ({ tenantId }, use) => {
    const subdomain = `test-${tenantId.slice(0, 8)}`;
    await use(subdomain);
  },

  cleanup: async ({ tenantId }, use) => {
    // Create cleanup function
    const cleanupFunctions: Array<() => Promise<void>> = [];
    
    await use(async () => {
      // Run all cleanup functions
      await Promise.all(cleanupFunctions.map(fn => fn().catch(console.error)));
    });

    // Add cleanup function to remove test data
    cleanupFunctions.push(async () => {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);
    });
  },
});

export { expect };
```

### Authentication Fixture

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { Clerk } from '@clerk/clerk-js';

interface AuthFixture {
  signInAsAdmin: () => Promise<void>;
  signInAsUser: (tenantId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const test = base.extend<AuthFixture>({
  signInAsAdmin: async ({ page }, use) => {
    await use(async () => {
      // Sign in as admin user
      await page.goto('/sign-in');
      await page.getByLabel('Email address').fill(process.env.ADMIN_EMAIL!);
      await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Wait for successful sign-in
      await expect(page.getByText('Dashboard')).toBeVisible();
    });
  },

  signInAsUser: async ({ page }, use) => {
    await use(async (tenantId: string) => {
      // Create test user for tenant
      const userEmail = `test-${tenantId}@example.com`;
      
      await page.goto('/sign-in');
      await page.getByLabel('Email address').fill(userEmail);
      await page.getByLabel('Password').fill('test-password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Wait for successful sign-in
      await expect(page.getByText('Welcome')).toBeVisible();
    });
  },

  signOut: async ({ page }, use) => {
    await use(async () => {
      await page.getByRole('button', { name: /user menu/i }).click();
      await page.getByRole('menuitem', { name: /sign out/i }).click();
      
      // Wait for sign-out completion
      await expect(page.getByText('Sign in')).toBeVisible();
    });
  },
});
```

### E2E Test Examples

```typescript
// e2e/specs/tenant-management.spec.ts
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Tenant Management', () => {
  test.beforeEach(async ({ signInAsAdmin }) => {
    await signInAsAdmin();
  });

  test('should create new tenant', async ({ page }) => {
    await page.goto('/admin/tenants');
    
    // Click create tenant button
    await page.getByRole('button', { name: /create tenant/i }).click();
    
    // Fill tenant form
    await page.getByLabel('Tenant Name').fill('Test HVAC Company');
    await page.getByLabel('Domain').fill('test-hvac');
    await page.getByLabel('Plan').selectOption('professional');
    
    // Submit form
    await page.getByRole('button', { name: /create tenant/i }).click();
    
    // Verify tenant was created
    await expect(page.getByText('Test HVAC Company')).toBeVisible();
    await expect(page.getByText('test-hvac.example.com')).toBeVisible();
    await expect(page.getByText('Professional')).toBeVisible();
  });

  test('should update tenant settings', async ({ page }) => {
    await page.goto('/admin/tenants');
    
    // Find and click on existing tenant
    await page.getByText('Test HVAC Company').click();
    
    // Update tenant settings
    await page.getByLabel('Display Name').fill('Updated HVAC Company');
    await page.getByLabel('Primary Color').fill('#ff0000');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Verify changes were saved
    await expect(page.getByText('Settings updated successfully')).toBeVisible();
    await expect(page.getByDisplayValue('Updated HVAC Company')).toBeVisible();
  });

  test('should handle tenant deletion', async ({ page }) => {
    await page.goto('/admin/tenants');
    
    // Find tenant and click delete
    const tenantRow = page.getByText('Test HVAC Company');
    await tenantRow.getByRole('button', { name: /delete/i }).click();
    
    // Confirm deletion in modal
    await page.getByRole('button', { name: /confirm delete/i }).click();
    
    // Verify tenant was deleted
    await expect(page.getByText('Test HVAC Company')).not.toBeVisible();
    await expect(page.getByText('Tenant deleted successfully')).toBeVisible();
  });
});
```

### Multi-Tenant E2E Tests

```typescript
// e2e/specs/marketing-site.spec.ts
import { test, expect } from '../fixtures/tenant.fixture';

test.describe('Marketing Site', () => {
  test('should load tenant-specific branding', async ({ page, subdomain }) => {
    await page.goto(`http://${subdomain}.localhost:3000`);
    
    // Check tenant-specific branding
    await expect(page.getByText('Demo HVAC Company')).toBeVisible();
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0066cc');
  });

  test('should capture leads correctly', async ({ page, subdomain }) => {
    await page.goto(`http://${subdomain}.localhost:3000`);
    
    // Fill contact form
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Phone').fill('555-123-4567');
    await page.getByLabel('Message').fill('I need HVAC services');
    
    // Submit form
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Verify success message
    await expect(page.getByText(/thank you for your inquiry/i)).toBeVisible();
    
    // Verify lead was captured (check database or admin panel)
    await page.goto('/admin/leads');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john.doe@example.com')).toBeVisible();
  });

  test('should be accessible on mobile', async ({ page, subdomain }) => {
    await page.goto(`http://${subdomain}.localhost:3000`);
    
    // Test mobile navigation
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Test touch targets (24x24 minimum)
    const menuItems = page.getByRole('navigation').getByRole('link');
    const firstMenuItem = menuItems.first();
    const boundingBox = await firstMenuItem.boundingBox();
    
    expect(boundingBox?.width).toBeGreaterThanOrEqual(24);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(24);
  });
});
```

---

## ♿ Accessibility Testing with axe-core

### Integration with Test Frameworks

```typescript
// src/test/accessibility.ts
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

export async function testAccessibility(container: HTMLElement) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

export async function testComponentAccessibility(
  renderResult: RenderResult
) {
  await testAccessibility(renderResult.container);
}

// Custom React Testing Library render with accessibility testing
export const renderWithAccessibility = async (ui: React.ReactElement) => {
  const renderResult = render(ui);
  await testComponentAccessibility(renderResult);
  return renderResult;
};
```

### Component Accessibility Tests

```typescript
// src/components/__tests__/ContactForm.accessibility.test.tsx
import { describe, it } from 'vitest';
import { renderWithAccessibility } from '@/test/accessibility';
import { ContactForm } from '../ContactForm';

describe('ContactForm Accessibility', () => {
  it('should not have accessibility violations', async () => {
    await renderWithAccessibility(<ContactForm />);
  });

  it('should be accessible when showing errors', async () => {
    await renderWithAccessibility(
      <ContactForm error="Please fill in all required fields" />
    );
  });

  it('should be accessible when submitting', async () => {
    await renderWithAccessibility(
      <ContactForm loading={true} />
    );
  });
});
```

### E2E Accessibility Testing

```typescript
// e2e/specs/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should pass axe-core accessibility tests', async ({ page }) => {
    await page.goto('/');
    
    // Run axe-core accessibility tests
    const accessibilityScanResults = await page.accessibility.snapshot();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for single h1
    const h1Elements = page.getByRole('heading', { level: 1 });
    await expect(h1Elements).toHaveCount(1);
    
    // Check heading order (h1, h2, h3, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(h => h.evaluate(el => parseInt(el.tagName.charAt(1))))
    );
    
    // Verify headings are in proper order (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test focus trap in modals
    await page.getByRole('button', { name: /contact/i }).click();
    
    // Focus should be trapped in modal
    const modalFocusableElements = page.locator('.modal *:focusable');
    const firstModalElement = modalFocusableElements.first();
    await expect(firstModalElement).toBeFocused();
    
    // Test tabbing within modal
    await page.keyboard.press('Tab');
    const modalFocusedElements = page.locator('.modal :focus');
    expect(await modalFocusedElements.count()).toBeGreaterThan(0);
  });

  test('should meet WCAG 2.2 touch target requirements', async ({ page }) => {
    await page.goto('/');
    
    // Get all interactive elements
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const boundingBox = await element.boundingBox();
      
      if (boundingBox) {
        // WCAG 2.2 requires 24x24 CSS pixels minimum
        expect(boundingBox.width).toBeGreaterThanOrEqual(24);
        expect(boundingBox.height).toBeGreaterThanOrEqual(24);
      }
    }
  });
});
```

### Automated Accessibility CI Integration

```typescript
// scripts/accessibility-check.ts
import { PlaywrightTestConfig, chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

async function runAccessibilityCheck() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = {
    violations: [] as any[],
    passes: [] as any[],
    incomplete: [] as any[],
  };

  try {
    // Check all routes
    const routes = [
      '/',
      '/about',
      '/contact',
      '/pricing',
      '/dashboard',
    ];

    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`);
      
      // Run axe-core
      const scanResults = await page.accessibility.snapshot({
        interestingOnly: false,
      });
      
      if (scanResults.violations.length > 0) {
        results.violations.push({
          route,
          violations: scanResults.violations,
        });
      }
      
      results.passes.push(...scanResults.passes.map(pass => ({ ...pass, route })));
      results.incomplete.push(...scanResults.incomplete.map(inc => ({ ...inc, route })));
    }

    // Generate report
    const report = {
      summary: {
        totalViolations: results.violations.length,
        totalPasses: results.passes.length,
        totalIncomplete: results.incomplete.length,
      },
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
    };

    // Write report
    writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
    
    // Exit with error code if violations found
    if (results.violations.length > 0) {
      console.error(`❌ Found ${results.violations.length} accessibility violations`);
      process.exit(1);
    } else {
      console.log('✅ No accessibility violations found');
    }
  } finally {
    await browser.close();
  }
}

runAccessibilityCheck().catch(console.error);
```

---

## 📊 Performance Testing

### Core Web Vitals Testing

```typescript
// e2e/specs/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            lcp: 0,
            fid: 0,
            cls: 0,
          };
          
          entries.forEach((entry) => {
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.name === 'first-input-delay') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.name === 'cumulative-layout-shift') {
              vitals.cls = entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'cumulative-layout-shift'] });
      });
    });
    
    // Core Web Vitals thresholds
    expect(metrics.lcp).toBeLessThan(2500); // 2.5s
    expect(metrics.fid).toBeLessThan(100); // 100ms
    expect(metrics.cls).toBeLessThan(0.1); // 0.1
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Get all image elements
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      
      // Check for alt text
      await expect(image).toHaveAttribute('alt');
      
      // Check for proper sizing
      const naturalWidth = await image.evaluate(img => img.naturalWidth);
      const displayWidth = await image.evaluate(img => img.clientWidth);
      
      // Image should not be significantly larger than display size
      expect(naturalWidth / displayWidth).toBeLessThan(2);
    }
  });

  test('should have efficient bundle sizes', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 0,
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total bundle size
    const totalJSSize = responses
      .filter(r => r.url.includes('.js'))
      .reduce((sum, r) => sum + parseInt(r.size), 0);
    
    const totalCSSSize = responses
      .filter(r => r.url.includes('.css'))
      .reduce((sum, r) => sum + parseInt(r.size), 0);
    
    // Bundle size thresholds (in bytes)
    expect(totalJSSize).toBeLessThan(250 * 1024); // 250KB gzipped
    expect(totalCSSSize).toBeLessThan(50 * 1024); // 50KB gzipped
  });
});
```

---

## 🔧 Testing Utilities and Helpers

### Custom Test Utilities

```typescript
// src/test/utils.ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Test providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from RTL
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const createMockTenant = (overrides = {}) => ({
  id: 'tenant-123',
  name: 'Test Company',
  domain: 'test.example.com',
  plan: 'professional',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  tenantId: 'tenant-123',
  role: 'admin',
  createdAt: new Date().toISOString(),
  ...overrides,
});
```

### Test Data Factory

```typescript
// src/test/factories.ts
import { faker } from '@faker-js/faker';
import { Tenant, User, Lead } from '@/types';

export class TenantFactory {
  static create(overrides: Partial<Tenant> = {}): Tenant {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      domain: faker.internet.domainName(),
      plan: faker.helpers.arrayElement(['basic', 'professional', 'enterprise']),
      status: 'active',
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Tenant> = {}): Tenant[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      tenantId: faker.string.uuid(),
      role: faker.helpers.arrayElement(['admin', 'user', 'viewer']),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      ...overrides,
    };
  }
}

export class LeadFactory {
  static create(overrides: Partial<Lead> = {}): Lead {
    return {
      id: faker.string.uuid(),
      tenantId: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      message: faker.lorem.paragraph(),
      status: 'new',
      createdAt: faker.date.recent().toISOString(),
      ...overrides,
    };
  }
}
```

---

## 📚 References

### Authoritative Sources
- [Vitest Documentation](https://vitest.dev/) — Modern testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — Component testing philosophy
- [Playwright Documentation](https://playwright.dev/) — E2E testing framework
- [axe-core Documentation](https://dequeuniversity.com/rules/axe/) — Accessibility testing
- [Web.dev Testing](https://web.dev/testing/) — Web performance testing
- [Core Web Vitals](https://web.dev/vitals/) — Performance metrics

### Internal Documentation
- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns
- [Multi-Tenant Architecture](../architecture/system-architecture-guide.md) — Tenant patterns
- [Performance Engineering](../development/performance-guide.md) — Performance testing
- [Security Patterns](../security/security-patterns-guide.md) — Security testing

---

## 🚀 Implementation Checklist

### Setup Requirements
- [ ] Vitest configuration with TypeScript support
- [ ] React Testing Library setup with custom render
- [ ] Playwright configuration for multi-tenant testing
- [ ] axe-core integration for accessibility testing
- [ ] Test data factories and mock utilities

### Unit Testing
- [ ] Core business logic tests
- [ ] Utility function tests
- [ ] API client tests
- [ ] Validation schema tests
- [ ] Database repository tests

### Component Testing
- [ ] User interaction tests
- [ ] Form validation tests
- [ ] Error handling tests
- [ ] Loading states tests
- [ ] Accessibility tests

### E2E Testing
- [ ] Multi-tenant user flows
- [ ] Authentication flows
- [ ] Data isolation tests
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness tests

### Accessibility Testing
- [ ] Automated axe-core scans
- [ ] Keyboard navigation tests
- [ ] Screen reader compatibility
- [ ] WCAG 2.2 compliance checks
- [ ] Focus management tests

### Performance Testing
- [ ] Core Web Vitals monitoring
- [ ] Bundle size analysis
- [ ] Image optimization tests
- [ ] Network performance tests
- [ ] Memory leak detection

### CI/CD Integration
- [ ] Automated test execution
- [ ] Coverage reporting
- [ ] Accessibility gating
- [ ] Performance regression tests
- [ ] Test result notifications

---

*This guide consolidates and replaces the following documentation files:*
- *playwright-best-practices.md*
- *testing-library-documentation.md*
- *vitest-documentation.md*
- *e2e-testing-suite-patterns.md*
- *axe-core-documentation.md*
- *playwright-documentation.md*
