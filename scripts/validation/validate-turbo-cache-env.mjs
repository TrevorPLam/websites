#!/usr/bin/env node
/**
 * @file scripts/validation/validate-turbo-cache-env.mjs
 * @summary Validates required env vars for Turbo remote cache signature mode.
 * @description Ensures CI and local builds fail fast when signature mode is enabled without the signing key.
 * @security Does not read or log secret values; only checks variable presence.
 * @adr none
 * @requirements Wave-0 Task-1 (Turbo remote caching env validation)
 */

const required = ['TURBO_REMOTE_CACHE_SIGNATURE_KEY'];

const missing = required.filter((name) => {
  const value = process.env[name];
  return !value || value.trim().length === 0;
});

if (missing.length > 0) {
  console.error('[validate-turbo-cache-env] Missing required environment variables:');
  for (const variable of missing) {
    console.error(` - ${variable}`);
  }
  process.exit(1);
}

console.log('[validate-turbo-cache-env] Turbo remote cache signature key is configured.');
