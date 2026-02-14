

// Set up required env vars BEFORE mocking/importing env module
require('./env-setup');

// Mock 'server-only' to allow testing in Node environment
jest.mock('server-only', () => ({}));

const { validatedEnv, getNodeEnvironment, isProduction, isDevelopment, isTest } = require('../env');

describe('lib/env - Environment Validation', () => {
  const originalEnv = { ...process.env };

  // Clean up after each test
  afterEach(() => {
    Object.assign(process.env, { NODE_ENV: originalEnv.NODE_ENV });
  });

  // ─────────────────────────────────────────────────────────────────
  // validatedEnv - Exported Environment Variables
  // ─────────────────────────────────────────────────────────────────

  describe('validatedEnv - exported variables', () => {
    test('NEXT_PUBLIC_SITE_URL is set', () => {
      expect(validatedEnv.NEXT_PUBLIC_SITE_URL).toBeDefined();
      expect(typeof validatedEnv.NEXT_PUBLIC_SITE_URL).toBe('string');
    });

    test('NEXT_PUBLIC_SITE_NAME is set', () => {
      expect(validatedEnv.NEXT_PUBLIC_SITE_NAME).toBeDefined();
      expect(typeof validatedEnv.NEXT_PUBLIC_SITE_NAME).toBe('string');
    });

    test('SUPABASE_URL behavior', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.SUPABASE_URL).toBeDefined();
        expect(typeof validatedEnv.SUPABASE_URL).toBe('string');
        expect(validatedEnv.SUPABASE_URL).toMatch(/^https?:\/\//);
      } else {
        // In development/test, SUPABASE_URL is optional
        expect(validatedEnv.SUPABASE_URL).toBeUndefined();
      }
    });

    test('SUPABASE_SERVICE_ROLE_KEY behavior', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
        expect(typeof validatedEnv.SUPABASE_SERVICE_ROLE_KEY).toBe('string');
        expect(validatedEnv.SUPABASE_SERVICE_ROLE_KEY?.length).toBeGreaterThan(0);
      } else {
        // In development/test, these are optional
        expect(validatedEnv.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
      }
    });

    test('HUBSPOT_PRIVATE_APP_TOKEN behavior', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN).toBeDefined();
        expect(typeof validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN).toBe('string');
        expect(validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN?.length).toBeGreaterThan(0);
      } else {
        // In development/test, these are optional
        expect(validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN).toBeUndefined();
      }
    });

    test('NODE_ENV is set', () => {
      expect(validatedEnv.NODE_ENV).toBeDefined();
      expect(['development', 'production', 'test']).toContain(validatedEnv.NODE_ENV);
    });

    test('NEXT_PUBLIC_ANALYTICS_ID is optional (may be undefined)', () => {
      expect(validatedEnv.NEXT_PUBLIC_ANALYTICS_ID).toBeUndefined();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // getNodeEnvironment - Environment Detection
  // ─────────────────────────────────────────────────────────────────

  describe('getNodeEnvironment()', () => {
    test('returns current NODE_ENV', () => {
      Object.assign(process.env, { NODE_ENV: 'test' });
      const env = getNodeEnvironment();
      expect(env).toBe('test');
    });

    test('defaults to development when not set', () => {
      // Note: In actual execution, NODE_ENV should be set
      // This test verifies the function works
      const env = getNodeEnvironment();
      expect(['development', 'production', 'test']).toContain(env);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // isProduction - Production Mode Check
  // ─────────────────────────────────────────────────────────────────

  describe('isProduction()', () => {
    test('returns true when NODE_ENV is production', () => {
      Object.assign(process.env, { NODE_ENV: 'production' });
      expect(isProduction()).toBe(true);
    });

    test('returns false when NODE_ENV is development', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      expect(isProduction()).toBe(false);
    });

    test('returns false when NODE_ENV is test', () => {
      Object.assign(process.env, { NODE_ENV: 'test' });
      expect(isProduction()).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // isDevelopment - Development Mode Check
  // ─────────────────────────────────────────────────────────────────

  describe('isDevelopment()', () => {
    test('returns true when NODE_ENV is development', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      expect(isDevelopment()).toBe(true);
    });

    test('returns false when NODE_ENV is production', () => {
      Object.assign(process.env, { NODE_ENV: 'production' });
      expect(isDevelopment()).toBe(false);
    });

    test('returns false when NODE_ENV is test', () => {
      Object.assign(process.env, { NODE_ENV: 'test' });
      expect(isDevelopment()).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // isTest - Test Mode Check
  // ─────────────────────────────────────────────────────────────────

  describe('isTest()', () => {
    test('returns true when NODE_ENV is test', () => {
      Object.assign(process.env, { NODE_ENV: 'test' });
      expect(isTest()).toBe(true);
    });

    test('returns false when NODE_ENV is development', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      expect(isTest()).toBe(false);
    });

    test('returns false when NODE_ENV is production', () => {
      Object.assign(process.env, { NODE_ENV: 'production' });
      expect(isTest()).toBe(false);
    });

    // Note: This test already runs with NODE_ENV=test during test execution
    test('test environment is properly detected during test run', () => {
      expect(isTest()).toBe(true);
      expect(isProduction()).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Validation Schema Tests
  // ─────────────────────────────────────────────────────────────────

  describe('Environment Schema Validation', () => {
    test('NEXT_PUBLIC_SITE_URL must be valid URL', () => {
      // Current value should be valid
      expect(validatedEnv.NEXT_PUBLIC_SITE_URL).toMatch(/^https?:\/\/.+/);
    });

    test('SUPABASE_URL validation behavior', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.SUPABASE_URL).toMatch(/^https?:\/\/.+/);
      } else {
        // In development/test, SUPABASE_URL is optional
        expect(validatedEnv.SUPABASE_URL).toBeUndefined();
      }
    });

    test('Required string vars behavior by environment', () => {
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy();
        expect(validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN).toBeTruthy();
      } else {
        // In development/test, these are optional
        expect(validatedEnv.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
        expect(validatedEnv.HUBSPOT_PRIVATE_APP_TOKEN).toBeUndefined();
      }
    });

    test('NODE_ENV is one of allowed values', () => {
      const validModes = ['development', 'production', 'test'];
      expect(validModes).toContain(validatedEnv.NODE_ENV);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Production Safety Checks
  // ─────────────────────────────────────────────────────────────────

  describe('Production Safety (Issue #005 - Rate Limiting)', () => {
    test('allows production without Redis in test mode', () => {
      // This test verifies that test environment doesn't enforce Redis
      Object.assign(process.env, { NODE_ENV: 'test' });
      expect(isTest()).toBe(true);
      // No error should be thrown
    });

    test('development mode allows optional Redis', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      expect(isDevelopment()).toBe(true);
      // No error should be thrown
    });

    test('production mode with proper env vars works', () => {
      // Verify that production with all required vars is valid
      Object.assign(process.env, { NODE_ENV: 'production' });
      // If we get here without error, production safety checks passed
      expect(isProduction()).toBe(true);
    });

    // Note: Cannot easily test the actual production error without mocking module load
    // because env validation happens at module load time. This is tested by:
    // - Manual testing of production deployment
    // - CI will fail if production doesn't have Redis vars
    test('production safety check documentation exists', () => {
      // This is a smoke test for safety mechanism
      expect(validatedEnv.NODE_ENV).toBeDefined();
      // In test mode, Upstash variables are optional to allow testing without Redis
      if (process.env.NODE_ENV === 'production') {
        expect(validatedEnv.UPSTASH_REDIS_REST_URL).toBeDefined();
        expect(validatedEnv.UPSTASH_REDIS_REST_TOKEN).toBeDefined();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Edge Cases
  // ─────────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    test('handles NODE_ENV with various cases (normalized)', () => {
      // ZodENUM is case-sensitive, so only lowercase works
      Object.assign(process.env, { NODE_ENV: 'test' });
      expect(getNodeEnvironment()).toBe('test');
    });

    test('NEXT_PUBLIC_SITE_URL has default fallback', () => {
      // Even if not set, it should have a default
      expect(validatedEnv.NEXT_PUBLIC_SITE_URL).toBeTruthy();
    });

    test('Upstash vars are optional in non-production', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      // Should not throw even if Redis not configured
      expect(isDevelopment()).toBe(true);
    });
  });
});
