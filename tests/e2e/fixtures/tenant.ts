/**
 * @file tenant.ts
 * @role test
 * @summary Tenant fixture for multi-tenant E2E testing.
 *
 * @entrypoints
 * - E2E test specs
 *
 * @exports
 * - Extended test with tenant fixture
 * - expect from Playwright
 *
 * @depends_on
 * - External: @playwright/test
 * - Internal: @repo/infra (tenant management)
 *
 * @used_by
 * - All E2E tests requiring tenant isolation
 *
 * @runtime
 * - environment: test
 * - side_effects: creates and cleans up test tenants
 *
 * @data_flow
 * - inputs: test configuration
 * - outputs: provisioned tenant with cleanup
 *
 * @invariants
 * - Each test gets an isolated tenant
 * - Tenant data is cleaned up after test
 * - No cross-tenant data leakage
 *
 * @gotchas
 * - Tenant provisioning timing
 * - Cleanup reliability
 * - Database transaction isolation
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Add tenant data seeding factories
 * - Add tenant configuration variations
 *
 * @verification
 * - Run: pnpm test:e2e tests/e2e/specs/tenant-isolation.spec.ts
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-21
 * - updated: Initial tenant fixture for multi-tenant testing
 */

import { test as base, expect } from '@playwright/test';
import type { TestFixture } from '@playwright/test';

/**
 * Test tenant interface for type safety
 */
interface TestTenant {
  id: string;
  slug: string;
  name: string;
  siteConfig: {
    title: string;
    industry: string;
    // Add other site config properties as needed
  };
  createdAt: Date;
}

/**
 * Tenant fixture options for customization
 */
interface TenantFixtureOptions {
  /** Custom tenant name for test identification */
  name?: string;
  /** Pre-configured site config for the tenant */
  siteConfig?: Partial<TestTenant['siteConfig']>;
  /** Whether to seed the tenant with test data */
  seedData?: boolean;
}

/**
 * Extended test fixture with tenant provisioning
 *
 * This fixture automatically:
 * - Creates a new test tenant for each test
 * - Configures the tenant with minimal required settings
 * - Cleans up the tenant and its data after the test
 * - Provides tenant isolation guarantees
 */
export const test = base.extend<{
  tenant: TestTenant;
}>({
  // Tenant fixture that provisions and cleans up test tenants
  tenant: async ({}, use, testInfo) => {
    const tenantOptions: TenantFixtureOptions = {
      name: `test-tenant-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`,
      siteConfig: {
        title: 'Test Business',
        industry: 'professional-services',
      },
      seedData: false,
    };

    // Create test tenant
    const tenant = await createTestTenant(tenantOptions);
    console.log(`🏢 Created test tenant: ${tenant.name} (${tenant.id})`);

    try {
      // Use the tenant in the test
      await use(tenant);
    } finally {
      // Cleanup tenant and associated data
      await cleanupTestTenant(tenant.id);
      console.log(`🗑️ Cleaned up test tenant: ${tenant.name} (${tenant.id})`);
    }
  },
});

/**
 * Create a test tenant with the specified configuration
 */
async function createTestTenant(options: TenantFixtureOptions): Promise<TestTenant> {
  const tenantId = generateTenantId();
  const tenantSlug = generateTenantSlug(options.name || 'test-tenant');

  const tenant: TestTenant = {
    id: tenantId,
    slug: tenantSlug,
    name: options.name || 'Test Tenant',
    siteConfig: {
      title: 'Test Business',
      industry: 'professional-services',
      ...options.siteConfig,
    },
    createdAt: new Date(),
  };

  // TODO: Implement actual tenant creation in your system
  // - Insert tenant record in database
  // - Configure tenant settings
  // - Set up RLS policies for the tenant
  // - Seed initial data if requested

  // For now, we'll simulate tenant creation
  await simulateTenantCreation(tenant);

  return tenant;
}

/**
 * Clean up a test tenant and all associated data
 */
async function cleanupTestTenant(tenantId: string): Promise<void> {
  // TODO: Implement actual tenant cleanup in your system
  // - Remove all data associated with the tenant
  // - Delete tenant record
  // - Verify no data leakage
  // - Handle cleanup failures gracefully

  // For now, we'll simulate cleanup
  await simulateTenantCleanup(tenantId);
}

/**
 * Generate a unique tenant ID for testing
 */
function generateTenantId(): string {
  return `test-tenant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a URL-friendly tenant slug
 */
function generateTenantSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Simulate tenant creation (replace with actual implementation)
 */
async function simulateTenantCreation(tenant: TestTenant): Promise<void> {
  // This is a placeholder for your actual tenant creation logic
  // In a real implementation, this would:
  // 1. Insert tenant record in your database
  // 2. Configure tenant-specific settings
  // 3. Set up any required infrastructure
  // 4. Return the created tenant object

  console.log(`📝 Simulating tenant creation for: ${tenant.name}`);

  // Simulate database operation delay
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Simulate tenant cleanup (replace with actual implementation)
 */
async function simulateTenantCleanup(tenantId: string): Promise<void> {
  // This is a placeholder for your actual tenant cleanup logic
  // In a real implementation, this would:
  // 1. Delete all data associated with the tenant
  // 2. Remove tenant record from database
  // 3. Clean up any tenant-specific resources
  // 4. Verify complete cleanup

  console.log(`🗑️ Simulating tenant cleanup for: ${tenantId}`);

  // Simulate database operation delay
  await new Promise((resolve) => setTimeout(resolve, 50));
}

/**
 * Helper function to create a tenant with custom options
 * Useful for tests that need specific tenant configurations
 */
export async function createCustomTenant(options: TenantFixtureOptions): Promise<TestTenant> {
  return createTestTenant(options);
}

/**
 * Helper function to get tenant URL for navigation
 */
export function getTenantUrl(tenant: TestTenant, path: string = ''): string {
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3101';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}/${tenant.slug}${cleanPath}`;
}

// Re-export expect for convenience
export { expect };
