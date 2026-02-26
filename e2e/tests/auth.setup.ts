/**
 * @file e2e/tests/auth.setup.ts
 * @summary Playwright authentication setup for multi-tenant E2E testing.
 * @description Configures authentication state for different user roles across tenants.
 * @security Handles test credentials securely; validates required environment variables.
 * @adr none
 * @requirements E2E-AUTH-001, auth-setup
 */

import { expect, test as setup } from '@playwright/test';
import { AUTH_PATHS } from '../playwright.config';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

// Validate required environment variables
const requiredEnvVars = {
  TEST_AGENCY_EMAIL: process.env.TEST_AGENCY_EMAIL,
  TEST_AGENCY_PASSWORD: process.env.TEST_AGENCY_PASSWORD,
  TEST_TENANT1_EMAIL: process.env.TEST_TENANT1_EMAIL,
  TEST_TENANT1_PASSWORD: process.env.TEST_TENANT1_PASSWORD,
  TEST_TENANT2_EMAIL: process.env.TEST_TENANT2_EMAIL,
  TEST_TENANT2_PASSWORD: process.env.TEST_TENANT2_PASSWORD,
  TEST_SUPERADMIN_EMAIL: process.env.TEST_SUPERADMIN_EMAIL,
  TEST_SUPERADMIN_PASSWORD: process.env.TEST_SUPERADMIN_PASSWORD,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

setup('authenticate as agency owner', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_AGENCY_EMAIL);
  await page.getByLabel('Password').fill(process.env.TEST_AGENCY_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard', { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.context().storageState({ path: AUTH_PATHS.agencyOwner });
});

setup('authenticate as tenant 1 admin', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_TENANT1_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_TENANT1_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard', { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_PATHS.tenant1Admin });
});

setup('authenticate as tenant 2 admin', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_TENANT2_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_TENANT2_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard', { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_PATHS.tenant2Admin });
});

setup('authenticate as super admin', async ({ page }) => {
  await page.goto(`${process.env.PLAYWRIGHT_ADMIN_URL ?? 'http://localhost:3001'}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_SUPERADMIN_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_SUPERADMIN_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/admin/dashboard**', { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_PATHS.superAdmin });
});
