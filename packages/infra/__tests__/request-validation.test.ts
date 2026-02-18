/**
 * Request Validation Tests
 *
 * Tests for 2026 security best practices implementation including:
 * - CSRF protection via Origin/Referer header validation
 * - IP address validation with trusted proxy support
 * - Defense in depth following OWASP guidelines
 */

import {
  validateOrigin,
  getValidatedClientIp,
  createValidationConfig,
  validateRequest,
  TRUSTED_IP_HEADERS,
} from '../security/request-validation';

// Define types inline for Jest compatibility
type Logger = {
  info?: (message: string, context?: Record<string, unknown>) => void;
  warn?: (message: string, context?: Record<string, unknown>) => void;
  error?: (message: string, error?: unknown, context?: Record<string, unknown>) => void;
};

type OriginValidationResult = {
  isValid: boolean;
  expectedHost: string;
  origin?: string | null;
  referer?: string | null;
  host?: string | null;
  reason?: string;
};

// Mock logger for testing
const mockLogger: Logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('Request Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateOrigin', () => {
    const expectedHost = 'example.com';
    const config = {
      expectedHost,
      logger: mockLogger,
      allowMissingHeaders: false,
    };

    describe('Valid requests', () => {
      test('should accept request with matching Origin header', () => {
        const headers = new Headers({
          origin: 'https://example.com',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(true);
        expect(result.origin).toBe('https://example.com');
        expect(result.expectedHost).toBe(expectedHost);
        expect(mockLogger.warn).not.toHaveBeenCalled();
      });

      test('should accept request with matching Referer header when Origin is missing', () => {
        const headers = new Headers({
          referer: 'https://example.com/page',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(true);
        expect(result.referer).toBe('https://example.com/page');
        expect(result.expectedHost).toBe(expectedHost);
        expect(mockLogger.warn).not.toHaveBeenCalled();
      });

      test('should accept request with both matching Origin and Referer', () => {
        const headers = new Headers({
          origin: 'https://example.com',
          referer: 'https://example.com/page',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(true);
        expect(result.origin).toBe('https://example.com');
        expect(result.referer).toBe('https://example.com/page');
      });

      test('should handle different ports correctly', () => {
        const headers = new Headers({
          origin: 'https://example.com:3000',
          host: 'example.com:3000',
        });

        const portConfig = { ...config, expectedHost: 'example.com:3000' };
        const result = validateOrigin(headers, portConfig);

        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid requests', () => {
      test('should reject request with non-matching Origin header', () => {
        const headers = new Headers({
          origin: 'https://evil.com',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('Origin header mismatch');
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'CSRF: Origin header mismatch',
          expect.objectContaining({ origin: 'https://evil.com' })
        );
      });

      test('should reject request with non-matching Referer header', () => {
        const headers = new Headers({
          referer: 'https://evil.com/page',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('Referer header mismatch');
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'CSRF: Referer header mismatch',
          expect.objectContaining({ referer: 'https://evil.com/page' })
        );
      });

      test('should reject request with subdomain attack attempt', () => {
        const headers = new Headers({
          origin: 'https://example.com.evil.com',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('Origin header mismatch');
      });

      test('should reject request with malformed Origin URL', () => {
        const headers = new Headers({
          origin: 'not-a-url',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('Origin header mismatch');
      });

      test('should reject request with malformed Referer URL', () => {
        const headers = new Headers({
          referer: 'not-a-url',
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('Referer header mismatch');
      });

      test('should reject request with no Origin or Referer headers', () => {
        const headers = new Headers({
          host: 'example.com',
        });

        const result = validateOrigin(headers, config);

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('No origin or referer header');
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'CSRF: No origin or referer header',
          expect.objectContaining({ host: 'example.com' })
        );
      });
    });

    describe('Missing headers configuration', () => {
      test('should allow missing headers when configured', () => {
        const headers = new Headers({
          host: 'example.com',
        });

        const lenientConfig = { ...config, allowMissingHeaders: true };
        const result = validateOrigin(headers, lenientConfig);

        expect(result.isValid).toBe(true);
        expect(result.reason).toBeUndefined();
        expect(mockLogger.warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('getValidatedClientIp', () => {
    describe('Production environment', () => {
      test('should extract IP from Cloudflare header', () => {
        const headers = new Headers({
          'cf-connecting-ip': '192.168.1.1',
          'x-forwarded-for': '10.0.0.1',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.1');
      });

      test('should extract IP from Vercel header', () => {
        const headers = new Headers({
          'x-vercel-forwarded-for': '192.168.1.2',
          'x-forwarded-for': '10.0.0.1',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.2');
      });

      test('should fallback to standard headers when cloud-specific headers are missing', () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.3',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.3');
      });

      test('should handle multiple IPs in x-forwarded-for header', () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.4, 10.0.0.1, 172.16.0.1',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.4'); // First IP is the client
      });

      test('should return unknown when no valid IP found', () => {
        const headers = new Headers({
          'x-forwarded-for': 'invalid-ip',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('unknown');
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Could not determine client IP from trusted headers',
          expect.any(Object)
        );
      });
    });

    describe('Development environment', () => {
      test('should use development header priorities', () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.5',
          'cf-connecting-ip': '192.168.1.6', // Should be ignored in dev
        });

        const ip = getValidatedClientIp(headers, {
          environment: 'development',
          logger: mockLogger,
        });

        expect(ip).toBe('192.168.1.5');
      });
    });

    describe('IP validation', () => {
      test('should validate IPv4 addresses', () => {
        const headers = new Headers({
          'x-forwarded-for': '192.168.1.1',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.1');
      });

      test('should validate IPv6 addresses', () => {
        const headers = new Headers({
          'x-forwarded-for': '2001:db8::1',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('2001:db8::1');
      });

      test('should reject invalid IP addresses', () => {
        const headers = new Headers({
          'x-forwarded-for': 'not-an-ip',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('unknown');
      });

      test('should handle empty header values', () => {
        const headers = new Headers({
          'x-forwarded-for': '',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('unknown');
      });

      test('should handle whitespace in header values', () => {
        const headers = new Headers({
          'x-forwarded-for': ' 192.168.1.7 ',
        });

        const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

        expect(ip).toBe('192.168.1.7');
      });
    });
  });

  describe('createValidationConfig', () => {
    test('should create config from HTTPS URL', () => {
      const config = createValidationConfig('https://example.com', mockLogger);

      expect(config.expectedHost).toBe('example.com');
      expect(config.logger).toBe(mockLogger);
      expect(config.allowMissingHeaders).toBe(false);
    });

    test('should create config from HTTP URL', () => {
      const config = createValidationConfig('http://example.com', mockLogger);

      expect(config.expectedHost).toBe('example.com');
    });

    test('should extract host from URL with path', () => {
      const config = createValidationConfig('https://example.com/path/to/page', mockLogger);

      expect(config.expectedHost).toBe('example.com');
    });

    test('should extract host from URL with port', () => {
      const config = createValidationConfig('https://example.com:3000/path', mockLogger);

      expect(config.expectedHost).toBe('example.com:3000');
    });

    test('should handle environment override', () => {
      const config = createValidationConfig('https://example.com', mockLogger, 'test');

      expect(config.expectedHost).toBe('example.com');
      expect(config.environment).toBe('test');
    });
  });

  describe('validateRequest', () => {
    test('should validate complete request successfully', () => {
      const headers = new Headers({
        origin: 'https://example.com',
        host: 'example.com',
        'x-forwarded-for': '192.168.1.1',
      });

      const config = createValidationConfig('https://example.com', mockLogger);
      const result = validateRequest(headers, config);

      expect(result.isValid).toBe(true);
      expect(result.origin.isValid).toBe(true);
      expect(result.clientIp).toBe('192.168.1.1');
    });

    test('should fail validation when origin is invalid', () => {
      const headers = new Headers({
        origin: 'https://evil.com',
        host: 'example.com',
        'x-forwarded-for': '192.168.1.1',
      });

      const config = createValidationConfig('https://example.com', mockLogger);
      const result = validateRequest(headers, config);

      expect(result.isValid).toBe(false);
      expect(result.origin.isValid).toBe(false);
      expect(result.clientIp).toBe('192.168.1.1');
    });

    test('should handle missing IP gracefully', () => {
      const headers = new Headers({
        origin: 'https://example.com',
        host: 'example.com',
      });

      const config = createValidationConfig('https://example.com', mockLogger);
      const result = validateRequest(headers, config);

      expect(result.isValid).toBe(true);
      expect(result.origin.isValid).toBe(true);
      expect(result.clientIp).toBe('unknown');
    });
  });

  describe('TRUSTED_IP_HEADERS', () => {
    test('should have production headers in correct priority order', () => {
      expect(TRUSTED_IP_HEADERS.production).toEqual([
        'cf-connecting-ip',
        'x-vercel-forwarded-for',
        'x-forwarded-for',
        'x-real-ip',
      ]);
    });

    test('should have development headers', () => {
      expect(TRUSTED_IP_HEADERS.development).toEqual(['x-forwarded-for', 'x-real-ip']);
    });

    test('should have test headers', () => {
      expect(TRUSTED_IP_HEADERS.test).toEqual(['x-forwarded-for', 'x-real-ip']);
    });
  });

  describe('Edge cases', () => {
    test('should handle null header values gracefully', () => {
      const headers = new Headers();
      headers.set('origin', 'https://example.com');
      headers.set('referer', null as unknown as string); // Edge case: invalid header value

      const config = createValidationConfig('https://example.com', mockLogger);
      const result = validateOrigin(headers, config);

      expect(result.isValid).toBe(true);
      expect(result.origin).toBe('https://example.com');
    });

    test('should handle undefined header values gracefully', () => {
      const headers = new Headers();
      headers.set('origin', 'https://example.com');
      // Don't set referer at all

      const config = createValidationConfig('https://example.com', mockLogger);
      const result = validateOrigin(headers, config);

      expect(result.isValid).toBe(true);
      expect(result.origin).toBe('https://example.com');
      expect(result.referer).toBeNull();
    });

    test('should handle IPv6 localhost', () => {
      const headers = new Headers({
        'x-forwarded-for': '::1',
      });

      const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

      expect(ip).toBe('::1');
    });

    test('should handle compressed IPv6', () => {
      const headers = new Headers({
        'x-forwarded-for': '2001:db8:85a3::8a2e:370:7334',
      });

      const ip = getValidatedClientIp(headers, { environment: 'production', logger: mockLogger });

      expect(ip).toBe('2001:db8:85a3::8a2e:370:7334');
    });
  });
});
