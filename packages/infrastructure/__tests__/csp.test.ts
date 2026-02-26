import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
/**
 * CSP module tests
 * Tests 2026 best practices implementation
 */

import {
  createCspNonce,
  buildContentSecurityPolicy,
  buildReportToConfig,
  validateCspNonce,
  processCspViolationReport,
  buildLegacyContentSecurityPolicy,
  CSP_NONCE_HEADER,
} from '../security/csp';

describe('CSP Module', () => {
  describe('createCspNonce', () => {
    it('returns a non-empty base64 string', () => {
      const nonce = createCspNonce();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);

      // Should be valid base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      expect(base64Regex.test(nonce)).toBe(true);
    });

    it('generates unique nonces', () => {
      const nonce1 = createCspNonce();
      const nonce2 = createCspNonce();
      expect(nonce1).not.toBe(nonce2);
    });

    it('generates consistent length nonces', () => {
      const nonce = createCspNonce();
      expect(nonce.length).toBe(24); // 16 bytes = 24 chars in base64
    });
  });

  describe('buildContentSecurityPolicy', () => {
    const mockNonce = 'test-nonce-12345678901234567890';

    it('includes strict-dynamic in production', () => {
      const csp = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
        enableStrictDynamic: true,
      });

      expect(csp).toContain("'strict-dynamic'");
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it('includes unsafe-eval in development', () => {
      const csp = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: true,
        enableStrictDynamic: false,
      });

      expect(csp).toContain("'unsafe-eval'");
      expect(csp).not.toContain("'strict-dynamic'");
    });

    it('includes nonce in script-src', () => {
      const csp = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
      });

      expect(csp).toContain(`'nonce-${mockNonce}'`);
    });

    it('includes report-to when endpoint provided', () => {
      const endpoint = 'https://example.com/csp-report';
      const csp = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
        reportEndpoint: endpoint,
      });

      expect(csp).toContain(`report-to ${endpoint}`);
      expect(csp).toContain(`report-uri ${endpoint}`);
    });

    it('throws error for empty nonce', () => {
      expect(() => {
        buildContentSecurityPolicy({
          nonce: '',
          isDevelopment: false,
        });
      }).toThrow('CSP nonce must be a non-empty string.');
    });

    it('includes all required directives', () => {
      const csp = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
      });

      const requiredDirectives = [
        "default-src 'self'",
        'script-src',
        'style-src',
        'img-src',
        'font-src',
        'connect-src',
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ];

      requiredDirectives.forEach((directive) => {
        expect(csp).toContain(directive);
      });
    });
  });

  describe('buildReportToConfig', () => {
    it('creates valid Report-To configuration', () => {
      const endpoint = 'https://example.com/csp-report';
      const config = buildReportToConfig({ endpoint });

      const parsed = JSON.parse(config);
      expect(parsed.group).toBe('csp-endpoint');
      expect(parsed.max_age).toBe(86400);
      expect(parsed.endpoints).toHaveLength(1);
      expect(parsed.endpoints[0].url).toBe(endpoint);
    });

    it('accepts custom group name and max age', () => {
      const endpoint = 'https://example.com/csp-report';
      const config = buildReportToConfig({
        endpoint,
        groupName: 'custom-group',
        maxAge: 3600,
      });

      const parsed = JSON.parse(config);
      expect(parsed.group).toBe('custom-group');
      expect(parsed.max_age).toBe(3600);
    });
  });

  describe('validateCspNonce', () => {
    it('validates correct nonce format', () => {
      const nonce = createCspNonce();
      expect(validateCspNonce(nonce)).toBe(true);
    });

    it('rejects empty nonce', () => {
      expect(validateCspNonce('')).toBe(false);
      expect(validateCspNonce(null as unknown as string)).toBe(false);
      expect(validateCspNonce(undefined as unknown as string)).toBe(false);
    });

    it('rejects invalid base64', () => {
      expect(validateCspNonce('invalid!nonce')).toBe(false);
    });

    it('rejects short nonces', () => {
      expect(validateCspNonce('abcd')).toBe(false);
    });
  });

  describe('processCspViolationReport', () => {
    const mockReport = {
      cspReport: {
        documentURI: 'https://example.com',
        referrer: '',
        blockedURI: 'https://evil.com',
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        sourceFile: 'https://example.com/app.js',
        lineNumber: 10,
        columnNumber: 5,
        statusCode: 200,
      },
    };

    it('processes script violations as critical', () => {
      const result = processCspViolationReport(mockReport);
      expect(result.severity).toBe('critical');
      expect(result.category).toBe('script');
      expect(result.recommendation).toContain('trusted domains');
    });

    it('processes style violations as medium', () => {
      const styleReport = {
        ...mockReport,
        cspReport: {
          ...mockReport.cspReport,
          violatedDirective: 'style-src',
          effectiveDirective: 'style-src',
        },
      };

      const result = processCspViolationReport(styleReport);
      expect(result.severity).toBe('medium');
      expect(result.category).toBe('style');
    });

    it('processes inline violations differently', () => {
      const inlineReport = {
        ...mockReport,
        cspReport: {
          ...mockReport.cspReport,
          blockedURI: 'https://example.com',
        },
      };

      const result = processCspViolationReport(inlineReport);
      expect(result.recommendation).toContain('hash or nonce');
    });
  });

  describe('buildLegacyContentSecurityPolicy', () => {
    it('maintains backward compatibility', () => {
      const mockNonce = 'test-nonce-12345678901234567890';

      const legacy = buildLegacyContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
      });

      const modern = buildContentSecurityPolicy({
        nonce: mockNonce,
        isDevelopment: false,
        enableStrictDynamic: true,
      });

      expect(legacy).toBe(modern);
    });

    it('enables strict-dynamic in production', () => {
      const csp = buildLegacyContentSecurityPolicy({
        nonce: 'test-nonce',
        isDevelopment: false,
      });

      expect(csp).toContain("'strict-dynamic'");
    });

    it('allows unsafe-eval in development', () => {
      const csp = buildLegacyContentSecurityPolicy({
        nonce: 'test-nonce',
        isDevelopment: true,
      });

      expect(csp).toContain("'unsafe-eval'");
    });
  });

  describe('Constants', () => {
    it('exports CSP_NONCE_HEADER constant', () => {
      expect(CSP_NONCE_HEADER).toBe('x-csp-nonce');
    });
  });
});
