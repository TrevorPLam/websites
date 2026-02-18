/**
 * Base environment schema tests
 * Tests 2026 best practices implementation
 */

import { baseEnvSchema, validateBaseEnv, safeValidateBaseEnv, type BaseEnv } from '../schemas/base';

describe('Base Environment Schema', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('baseEnvSchema', () => {
    it('should validate with default values', () => {
      const result = baseEnvSchema.safeParse({});
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.NODE_ENV).toBe('development');
        expect(result.data.SITE_URL).toBe('http://localhost:3000');
        expect(result.data.SITE_NAME).toBe('Hair Salon Template');
        expect(result.data.ANALYTICS_ID).toBeUndefined();
      }
    });

    it('should coerce string values correctly', () => {
      const env = {
        NODE_ENV: 'production',
        SITE_URL: 'https://example.com/',
        SITE_NAME: 123, // Number should be coerced to string
        ANALYTICS_ID: 456, // Number should be coerced to string
      };

      const result = baseEnvSchema.safeParse(env);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.NODE_ENV).toBe('production');
        expect(result.data.SITE_URL).toBe('https://example.com'); // Trailing slash removed
        expect(result.data.SITE_NAME).toBe('123');
        expect(result.data.ANALYTICS_ID).toBe('456');
      }
    });

    it('should validate NODE_ENV enum values', () => {
      const validValues = ['development', 'production', 'test'];

      validValues.forEach((value) => {
        const result = baseEnvSchema.safeParse({ NODE_ENV: value });
        expect(result.success).toBe(true);
      });

      const invalidResult = baseEnvSchema.safeParse({ NODE_ENV: 'invalid' });
      expect(invalidResult.success).toBe(false);
    });

    it('should validate URL format for SITE_URL', () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://subdomain.example.com/path',
        'https://example.com/',
      ];

      validUrls.forEach((url) => {
        const result = baseEnvSchema.safeParse({ SITE_URL: url });
        expect(result.success).toBe(true);
      });

      const invalidUrls = ['not-a-url'];

      invalidUrls.forEach((url) => {
        const result = baseEnvSchema.safeParse({ SITE_URL: url });
        expect(result.success).toBe(false);
      });
    });

    it('should remove trailing slash from SITE_URL', () => {
      const result = baseEnvSchema.safeParse({ SITE_URL: 'https://example.com/' });
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.SITE_URL).toBe('https://example.com');
      }
    });

    it('should validate SITE_NAME constraints', () => {
      const validNames = ['Test Site', 'A', 'A'.repeat(100)];

      validNames.forEach((name) => {
        const result = baseEnvSchema.safeParse({ SITE_NAME: name });
        expect(result.success).toBe(true);
      });

      const invalidNames = [
        '', // Empty string
        'A'.repeat(101), // Over 100 chars
      ];

      invalidNames.forEach((name) => {
        const result = baseEnvSchema.safeParse({ SITE_NAME: name });
        expect(result.success).toBe(false);
      });
    });

    it('should handle optional ANALYTICS_ID', () => {
      const withAnalytics = baseEnvSchema.safeParse({ ANALYTICS_ID: 'GA-12345' });
      expect(withAnalytics.success).toBe(true);

      if (withAnalytics.success) {
        expect(withAnalytics.data.ANALYTICS_ID).toBe('GA-12345');
      }

      const withoutAnalytics = baseEnvSchema.safeParse({});
      expect(withoutAnalytics.success).toBe(true);

      if (withoutAnalytics.success) {
        expect(withoutAnalytics.data.ANALYTICS_ID).toBeUndefined();
      }
    });
  });

  describe('validateBaseEnv', () => {
    it('should return valid environment with defaults', () => {
      const env = validateBaseEnv({});
      expect(env.NODE_ENV).toBe('development');
      expect(env.SITE_URL).toBe('http://localhost:3000');
      expect(env.SITE_NAME).toBe('Hair Salon Template');
      expect(env.ANALYTICS_ID).toBeUndefined();
    });

    it('should validate custom environment values', () => {
      process.env.NODE_ENV = 'production';
      process.env.SITE_URL = 'https://mysite.com';
      process.env.SITE_NAME = 'My Site';
      process.env.ANALYTICS_ID = 'GA-12345';

      const env = validateBaseEnv();
      expect(env.NODE_ENV).toBe('production');
      expect(env.SITE_URL).toBe('https://mysite.com');
      expect(env.SITE_NAME).toBe('My Site');
      expect(env.ANALYTICS_ID).toBe('GA-12345');
    });

    it('should throw error with invalid environment', () => {
      expect(() => validateBaseEnv({ SITE_URL: 'invalid-url' })).toThrow(
        /❌ Invalid base environment variables:.*SITE_URL/
      );
    });

    it('should provide detailed error message', () => {
      try {
        validateBaseEnv({ NODE_ENV: 'invalid', SITE_URL: 'not-a-url', SITE_NAME: '' });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('❌ Invalid base environment variables');
        expect(errorMessage).toContain('NODE_ENV');
        expect(errorMessage).toContain('SITE_URL');
        expect(errorMessage).toContain('SITE_NAME');
        expect(errorMessage).toContain('Required variables');
      }
    });
  });

  describe('safeValidateBaseEnv', () => {
    it('should return valid environment', () => {
      const env = safeValidateBaseEnv({});
      expect(env).not.toBeNull();
      expect(env?.NODE_ENV).toBe('development');
    });

    it('should return null for invalid environment', () => {
      const env = safeValidateBaseEnv({ SITE_URL: 'invalid-url' });
      expect(env).toBeNull();
    });

    it('should accept custom environment object', () => {
      const customEnv = {
        NODE_ENV: 'production',
        SITE_URL: 'https://example.com',
        SITE_NAME: 'Test',
      };

      const env = safeValidateBaseEnv(customEnv);
      expect(env).not.toBeNull();
      expect(env?.NODE_ENV).toBe('production');
    });
  });

  describe('Type Safety', () => {
    it('should provide correct TypeScript types', () => {
      // This test ensures TypeScript types are correct
      const env: BaseEnv = {
        NODE_ENV: 'development',
        SITE_URL: 'https://example.com',
        SITE_NAME: 'Test Site',
        ANALYTICS_ID: undefined,
      };

      expect(typeof env.NODE_ENV).toBe('string');
      expect(typeof env.SITE_URL).toBe('string');
      expect(typeof env.SITE_NAME).toBe('string');
      expect(env.ANALYTICS_ID).toBeUndefined();
    });
  });
});
