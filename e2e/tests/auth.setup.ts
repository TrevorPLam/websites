import { expect, test as setup } from '@playwright/test';
import { AUTH_PATHS } from '../playwright.config';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

setup('authenticate as agency owner', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_AGENCY_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_AGENCY_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard**', { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.context().storageState({ path: AUTH_PATHS.agencyOwner });
});

setup('authenticate as tenant 1 admin', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_TENANT1_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_TENANT1_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard**', { timeout: 15_000 });

  await page.context().storageState({ path: AUTH_PATHS.tenant1Admin });
});

setup('authenticate as tenant 2 admin', async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);

  await page.getByLabel('Email address').fill(process.env.TEST_TENANT2_EMAIL ?? '');
  await page.getByLabel('Password').fill(process.env.TEST_TENANT2_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/dashboard**', { timeout: 15_000 });

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
