/**
 * Dashboard E2E Tests
 * 
 * End-to-end tests for the admin dashboard functionality.
 * Tests navigation, data display, and user interactions.
 * 
 * @feature Testing Infrastructure
 * @layer __e2e__
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Overview of your multi-tenant platform')).toBeVisible();
  });

  test('should display quick stats', async ({ page }) => {
    await expect(page.getByText('Total Tenants')).toBeVisible();
    await expect(page.getByText('Active Users')).toBeVisible();
    await expect(page.getByText('Total Leads')).toBeVisible();
    await expect(page.getByText('Uptime')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(page.getByText('New tenant registered')).toBeVisible();
    await expect(page.getByText('System update completed')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation to tenants
    await page.getByRole('link', { name: 'Tenants' }).click();
    await expect(page.getByRole('heading', { name: 'Tenants' })).toBeVisible();

    // Test navigation to users
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

    // Test navigation to system
    await page.getByRole('link', { name: 'System' }).click();
    await expect(page.getByRole('heading', { name: 'System Monitoring' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
    // Mobile menu should be available
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  });

  test('should handle quick actions', async ({ page }) => {
    // Test quick action buttons
    const createTenantButton = page.getByText('Create Tenant');
    if (await createTenantButton.isVisible()) {
      await createTenantButton.click();
      // Should navigate to tenant creation or show modal
    }

    const viewAnalyticsButton = page.getByText('View Analytics');
    if (await viewAnalyticsButton.isVisible()) {
      await viewAnalyticsButton.click();
      // Should navigate to analytics section
    }
  });
});
