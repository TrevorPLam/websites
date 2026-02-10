/**
 * @file apps/web/lib/__tests__/env-setup.ts
 * @role test
 * @summary Sets required env vars for env validation tests.
 *
 * @entrypoints
 * - Test setup for env.test.ts
 *
 * @exports
 * - None
 *
 * @depends_on
 * - Node: process.env
 *
 * @used_by
 * - apps/web/lib/__tests__/env.test.ts
 *
 * @runtime
 * - environment: test
 * - side_effects: mutates process.env
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

Object.assign(process.env, {
  NODE_ENV: 'test',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SITE_NAME: 'Test Hair Salon',
  SUPABASE_URL: 'https://test-project.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-secret-key-123',
});
process.env.HUBSPOT_PRIVATE_APP_TOKEN = 'pat-test-token-abc';
