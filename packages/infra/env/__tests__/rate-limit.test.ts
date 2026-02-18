/**
 * Rate limiting environment schema tests
 * Tests 2026 best practices implementation
 */

import {
  rateLimitEnvSchema,
  validateRateLimitEnv,
  safeValidateRateLimitEnv,
  isDistributedRateLimitingEnabled,
  type RateLimitEnv,
} from '../schemas/rate-limit';

describe('Rate Limit Environment Schema', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('rateLimitEnvSchema', () => {
    it('should validate with empty object (optional variables)', () => {
      const result = rateLimitEnvSchema.safeParse({});
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.UPSTASH_REDIS_REST_URL).toBeUndefined();
        expect(result.data.UPSTASH_REDIS_REST_TOKEN).toBeUndefined();
      }
    });

    it('should validate with valid Redis configuration', () => {
      const env = {
        UPSTASH_REDIS_REST_URL: 'https://awesome-george-123.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      const result = rateLimitEnvSchema.safeParse(env);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.UPSTASH_REDIS_REST_URL).toBe('https://awesome-george-123.upstash.io');
        expect(result.data.UPSTASH_REDIS_REST_TOKEN).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      }
    });

    it('should coerce string values correctly', () => {
      const env = {
        UPSTASH_REDIS_REST_URL: 'https://example.com',
        UPSTASH_REDIS_REST_TOKEN: 'token123',
      };

      const result = rateLimitEnvSchema.safeParse(env);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.UPSTASH_REDIS_REST_URL).toBe('https://example.com');
        expect(result.data.UPSTASH_REDIS_REST_TOKEN).toBe('token123');
      }
    });

    it('should validate URL format for UPSTASH_REDIS_REST_URL', () => {
      const validUrls = [
        'https://awesome-george-123.upstash.io',
        'https://redis.example.com',
        'http://localhost:6379',
      ];

      validUrls.forEach((url) => {
        const result = rateLimitEnvSchema.safeParse({ UPSTASH_REDIS_REST_URL: url });
        expect(result.success).toBe(true);
      });

      const invalidUrls = ['not-a-url'];

      invalidUrls.forEach((url) => {
        const result = rateLimitEnvSchema.safeParse({ UPSTASH_REDIS_REST_URL: url });
        expect(result.success).toBe(false);
      });
    });

    it('should validate UPSTASH_REDIS_REST_TOKEN constraints', () => {
      const validTokens = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        'simple-token',
        '12345',
      ];

      validTokens.forEach((token) => {
        const result = rateLimitEnvSchema.safeParse({ UPSTASH_REDIS_REST_TOKEN: token });
        expect(result.success).toBe(true);
      });
    });

    it('should allow partial configuration (schema level)', () => {
      const withUrlOnly = rateLimitEnvSchema.safeParse({
        UPSTASH_REDIS_REST_URL: 'https://example.com',
      });
      expect(withUrlOnly.success).toBe(true);

      const withTokenOnly = rateLimitEnvSchema.safeParse({
        UPSTASH_REDIS_REST_TOKEN: 'token123',
      });
      expect(withTokenOnly.success).toBe(true);
    });
  });

  describe('validateRateLimitEnv', () => {
    it('should return valid environment with empty object', () => {
      const env = validateRateLimitEnv();
      expect(env.UPSTASH_REDIS_REST_URL).toBeUndefined();
      expect(env.UPSTASH_REDIS_REST_TOKEN).toBeUndefined();
    });

    it('should validate complete Redis configuration', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

      const env = validateRateLimitEnv();
      expect(env.UPSTASH_REDIS_REST_URL).toBe('https://example.com');
      expect(env.UPSTASH_REDIS_REST_TOKEN).toBe('token123');
    });

    it('should throw error with invalid URL', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'invalid-url';

      expect(() => validateRateLimitEnv()).toThrow(
        '❌ Invalid rate limit environment variables: UPSTASH_REDIS_REST_URL: Must be a valid URL'
      );
    });

    it('should throw error when only one variable is provided', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      // UPSTASH_REDIS_REST_TOKEN not set

      expect(() => validateRateLimitEnv()).toThrow(
        'Rate limit configuration error: Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be provided together or neither'
      );
    });

    it('should throw error when only token is provided', () => {
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';
      // UPSTASH_REDIS_REST_URL not set

      expect(() => validateRateLimitEnv()).toThrow(
        'Rate limit configuration error: Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be provided together or neither'
      );
    });

    it('should provide detailed error message', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'invalid-url';
      process.env.UPSTASH_REDIS_REST_TOKEN = ''; // Empty token

      try {
        validateRateLimitEnv();
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('❌ Invalid rate limit environment variables');
        expect(errorMessage).toContain('Configuration options');
        expect(errorMessage).toContain('Setup instructions');
      }
    });
  });

  describe('safeValidateRateLimitEnv', () => {
    it('should return valid environment', () => {
      const env = safeValidateRateLimitEnv();
      expect(env).not.toBeNull();
      expect(env?.UPSTASH_REDIS_REST_URL).toBeUndefined();
      expect(env?.UPSTASH_REDIS_REST_TOKEN).toBeUndefined();
    });

    it('should return null for invalid environment', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'invalid-url';

      const env = safeValidateRateLimitEnv();
      expect(env).toBeNull();
    });

    it('should return null when only one variable is provided', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      // UPSTASH_REDIS_REST_TOKEN not set

      const env = safeValidateRateLimitEnv();
      expect(env).toBeNull();
    });

    it('should return valid complete configuration', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

      const env = safeValidateRateLimitEnv();
      expect(env).not.toBeNull();
      expect(env?.UPSTASH_REDIS_REST_URL).toBe('https://example.com');
      expect(env?.UPSTASH_REDIS_REST_TOKEN).toBe('token123');
    });
  });

  describe('isDistributedRateLimitingEnabled', () => {
    it('should return false for empty environment', () => {
      const enabled = isDistributedRateLimitingEnabled();
      expect(enabled).toBe(false);
    });

    it('should return false when only URL is provided', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';

      const enabled = isDistributedRateLimitingEnabled();
      expect(enabled).toBe(false);
    });

    it('should return false when only token is provided', () => {
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

      const enabled = isDistributedRateLimitingEnabled();
      expect(enabled).toBe(false);
    });

    it('should return true when both variables are provided', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

      const enabled = isDistributedRateLimitingEnabled();
      expect(enabled).toBe(true);
    });

    it('should return false for invalid configuration', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'invalid-url';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

      const enabled = isDistributedRateLimitingEnabled();
      expect(enabled).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should provide correct TypeScript types', () => {
      // This test ensures TypeScript types are correct
      const env: RateLimitEnv = {
        UPSTASH_REDIS_REST_URL: undefined,
        UPSTASH_REDIS_REST_TOKEN: undefined,
      };

      expect(env.UPSTASH_REDIS_REST_URL).toBeUndefined();
      expect(env.UPSTASH_REDIS_REST_TOKEN).toBeUndefined();
    });
  });
});
