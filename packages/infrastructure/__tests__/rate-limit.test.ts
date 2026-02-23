/**
 * Rate limiting module tests
 * Tests 2026 best practices implementation
 */

import {
  RATE_LIMIT_PRESETS,
  limitByIp,
  limitByUserId,
  limitByEmail,
  checkMultipleLimits,
  generateRateLimitHeaders,
  resetRateLimit,
  hashIp,
  getClientIp,
  legacyRateLimit,
} from '../security/rate-limit';

describe('Rate Limit Module', () => {
  describe('RATE_LIMIT_PRESETS', () => {
    it('has all required presets', () => {
      expect(RATE_LIMIT_PRESETS).toHaveProperty('contact');
      expect(RATE_LIMIT_PRESETS).toHaveProperty('booking');
      expect(RATE_LIMIT_PRESETS).toHaveProperty('api');
      expect(RATE_LIMIT_PRESETS).toHaveProperty('auth');
      expect(RATE_LIMIT_PRESETS).toHaveProperty('upload');
      expect(RATE_LIMIT_PRESETS).toHaveProperty('general');
    });

    it('has stricter limits for sensitive operations', () => {
      expect(RATE_LIMIT_PRESETS.contact.maxRequests).toBeLessThan(
        RATE_LIMIT_PRESETS.general.maxRequests
      );
      expect(RATE_LIMIT_PRESETS.auth.maxRequests).toBeLessThan(RATE_LIMIT_PRESETS.api.maxRequests);
    });

    it('has appropriate time windows', () => {
      expect(RATE_LIMIT_PRESETS.contact.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(RATE_LIMIT_PRESETS.api.windowMs).toBe(60 * 1000); // 1 minute
      expect(RATE_LIMIT_PRESETS.auth.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    });
  });

  describe('hashIp', () => {
    it('hashes IP addresses consistently', () => {
      const ip = '192.168.1.1';
      const hash1 = hashIp(ip);
      const hash2 = hashIp(ip);
      expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different IPs', () => {
      const hash1 = hashIp('192.168.1.1');
      const hash2 = hashIp('192.168.1.2');
      expect(hash1).not.toBe(hash2);
    });

    it('produces hexadecimal strings', () => {
      const hash = hashIp('192.168.1.1');
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });
  });

  describe('getClientIp', () => {
    it('extracts IP from x-forwarded-for header', () => {
      const headers = { 'x-forwarded-for': '203.0.113.1' };
      expect(getClientIp(headers)).toBe('203.0.113.1');
    });

    it('handles multiple IPs in x-forwarded-for', () => {
      const headers = { 'x-forwarded-for': '203.0.113.1, 192.168.1.1' };
      expect(getClientIp(headers)).toBe('203.0.113.1');
    });

    it('falls back to x-real-ip', () => {
      const headers = { 'x-real-ip': '203.0.113.2' };
      expect(getClientIp(headers)).toBe('203.0.113.2');
    });

    it('falls back to Cloudflare header', () => {
      const headers = { 'cf-connecting-ip': '203.0.113.3' };
      expect(getClientIp(headers)).toBe('203.0.113.3');
    });

    it('returns localhost when no headers found', () => {
      const headers = {};
      expect(getClientIp(headers)).toBe('127.0.0.1');
    });

    it('handles case-insensitive headers', () => {
      const headers = { 'X-FORWARDED-FOR': '203.0.113.4' };
      expect(getClientIp(headers)).toBe('203.0.113.4');
    });
  });

  describe('limitByIp', () => {
    it('allows requests within limit', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.1' };
      const result = await limitByIp(headers, 'general');

      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.identifier).toContain('ip:');
    });

    it('uses default preset when not specified', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.1' };
      const result = await limitByIp(headers);

      expect(result.preset).toBe('general');
    });

    it('respects custom configuration', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.1' };
      const customConfig = { maxRequests: 1, windowMs: 1000 };
      const result = await limitByIp(headers, 'general', customConfig);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });
  });

  describe('limitByUserId', () => {
    it('allows requests within limit', async () => {
      const result = await limitByUserId('user123', 'general');

      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.identifier).toContain('user:');
    });

    it('different users have separate limits', async () => {
      const result1 = await limitByUserId('user1', 'general');
      const result2 = await limitByUserId('user2', 'general');

      expect(result1.identifier).not.toBe(result2.identifier);
      expect(result1.remaining).toBe(result2.remaining);
    });
  });

  describe('limitByEmail', () => {
    it('normalizes email addresses', async () => {
      const result1 = await limitByEmail('Test@Example.COM');
      const result2 = await limitByEmail('test@example.com');

      expect(result1.identifier).toBe(result2.identifier);
    });

    it('allows requests within limit', async () => {
      const result = await limitByEmail('test@example.com', 'contact');

      expect(result.success).toBe(true);
      expect(result.preset).toBe('contact');
      expect(result.identifier).toContain('email:');
    });

    it('uses contact preset by default', async () => {
      const result = await limitByEmail('test@example.com');

      expect(result.preset).toBe('contact');
    });
  });

  describe('checkMultipleLimits', () => {
    beforeEach(() => {
      legacyRateLimit.resetRateLimiterState();
    });

    it('passes when all limits are within bounds', async () => {
      const checks = [
        { type: 'email' as const, value: 'checkmulti-a@example.com' },
        { type: 'ip' as const, value: '10.0.0.1' },
      ];

      const result = await checkMultipleLimits(checks);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('fails fast when any limit is exceeded', async () => {
      const strictConfig = { maxRequests: 1, windowMs: 1000 };
      const checks = [
        { type: 'email' as const, value: 'test1@example.com', customConfig: strictConfig },
        { type: 'email' as const, value: 'test2@example.com', customConfig: strictConfig },
      ];

      // First request should pass
      const result1 = await checkMultipleLimits([checks[0]]);
      expect(result1.success).toBe(true);

      // Second request should fail
      const result2 = await checkMultipleLimits([checks[0]]);
      expect(result2.success).toBe(false);
    });

    it('handles different limit types', async () => {
      const checks = [
        { type: 'email' as const, value: 'checkmulti-b@example.com' },
        { type: 'userId' as const, value: 'user-checkmulti' },
        { type: 'ip' as const, value: '10.0.0.2' },
      ];

      const result = await checkMultipleLimits(checks);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(3);

      const identifiers = result.results.map((r) => r.identifier);
      expect(identifiers.some((id) => id.indexOf('email:') !== -1)).toBe(true);
      expect(identifiers.some((id) => id.indexOf('user:') !== -1)).toBe(true);
      expect(identifiers.some((id) => id.indexOf('ip:') !== -1)).toBe(true);
    });
  });

  describe('generateRateLimitHeaders', () => {
    it('generates standard rate limit headers', () => {
      const result = {
        success: true,
        limit: 10,
        remaining: 5,
        resetTime: Date.now() + 3600000,
        resetTimeIso: new Date(Date.now() + 3600000).toISOString(),
        identifier: 'test',
        preset: 'general' as const,
      };

      const headers = generateRateLimitHeaders(result);

      expect(headers).toHaveProperty('X-RateLimit-Limit', '10');
      expect(headers).toHaveProperty('X-RateLimit-Remaining', '5');
      expect(headers).toHaveProperty('X-RateLimit-Reset');
      expect(headers).toHaveProperty('X-RateLimit-Preset', 'general');
    });

    it('handles missing preset', () => {
      const result = {
        success: true,
        limit: 10,
        remaining: 5,
        resetTime: Date.now() + 3600000,
        resetTimeIso: new Date(Date.now() + 3600000).toISOString(),
        identifier: 'test',
      };

      const headers = generateRateLimitHeaders(result);

      expect(headers['X-RateLimit-Preset']).toBe('unknown');
    });
  });

  describe('resetRateLimit', () => {
    beforeEach(() => {
      legacyRateLimit.resetRateLimiterState();
    });

    it('resets email rate limit', async () => {
      // limitByEmail uses preset 'contact' by default; reset must use same preset
      await limitByEmail('reset-test@example.com');

      await resetRateLimit('email', 'reset-test@example.com', 'contact');

      const result = await limitByEmail('reset-test@example.com');
      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('resets email rate limit with custom preset', async () => {
      // First, use the limit
      await limitByEmail('test@example.com', 'general');

      // Reset it
      await resetRateLimit('email', 'test@example.com', 'general');

      // Should be able to use it again
      const result = await limitByEmail('test@example.com', 'general');
      expect(result.success).toBe(true);
    });

    it('resets user ID rate limit', async () => {
      await limitByUserId('user123');
      await resetRateLimit('userId', 'user123');

      const result = await limitByUserId('user123');
      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('resets IP rate limit', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.1' };
      await limitByIp(headers);
      await resetRateLimit('ip', '192.168.1.1');

      const result = await limitByIp(headers);
      expect(result.success).toBe(true);
    });
  });

  describe('legacy compatibility', () => {
    it('maintains backward compatibility with checkRateLimit', async () => {
      const params = {
        email: 'test@example.com',
        clientIp: '192.168.1.1',
        hashIp: hashIp,
      };

      const result = await legacyRateLimit.checkRateLimit(params);
      expect(typeof result).toBe('boolean');
    });

    it('maintains backward compatibility with resetRateLimiterState', () => {
      expect(() => legacyRateLimit.resetRateLimiterState()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('handles missing headers gracefully', async () => {
      const headers = {};
      const result = await limitByIp(headers);

      expect(result.success).toBe(true);
      expect(result.identifier).toContain('ip:');
    });

    it('handles empty strings gracefully', async () => {
      const result = await limitByEmail('');

      expect(result.success).toBe(true);
      expect(result.identifier).toContain('email:');
    });
  });
});
