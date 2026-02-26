import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
/**
 * Security headers module tests
 * Tests 2026 best practices implementation
 */

import {
  getSecurityHeaders,
  getProductionSecurityHeaders,
  getDevelopmentSecurityHeaders,
  validateSecurityHeaders,
  getLegacySecurityHeaders,
} from '../security/security-headers';

describe('Security Headers Module', () => {
  describe('getSecurityHeaders', () => {
    it('includes base security headers in all environments', () => {
      const prodHeaders = getSecurityHeaders({ environment: 'production' });
      const devHeaders = getSecurityHeaders({ environment: 'development' });

      const baseHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'X-DNS-Prefetch-Control',
        'X-Download-Options',
        'X-Permitted-Cross-Domain-Policies',
        'Cross-Origin-Resource-Policy',
        'Critical-CH',
      ];

      baseHeaders.forEach((header) => {
        expect(prodHeaders).toHaveProperty(header);
        expect(devHeaders).toHaveProperty(header);
      });
    });

    it('includes HSTS in production when enabled', () => {
      const headers = getSecurityHeaders({
        environment: 'production',
        enableHSTS: true,
      });

      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
      expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
      expect(headers['Strict-Transport-Security']).toContain('preload');
    });

    it('excludes HSTS when disabled', () => {
      const headers = getSecurityHeaders({
        environment: 'production',
        enableHSTS: false,
      });

      expect(headers).not.toHaveProperty('Strict-Transport-Security');
    });

    it('includes COEP and COOP when enabled', () => {
      const headers = getSecurityHeaders({
        environment: 'production',
        enableCOEP: true,
        enableCOOP: true,
      });

      expect(headers).toHaveProperty('Cross-Origin-Embedder-Policy');
      expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp');
      expect(headers).toHaveProperty('Cross-Origin-Opener-Policy');
      expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin');
    });

    it('excludes COEP and COOP when disabled', () => {
      const headers = getSecurityHeaders({
        environment: 'development',
        enableCOEP: false,
        enableCOOP: false,
      });

      expect(headers).not.toHaveProperty('Cross-Origin-Embedder-Policy');
      expect(headers).not.toHaveProperty('Cross-Origin-Opener-Policy');
    });

    it('includes comprehensive Permissions-Policy', () => {
      const headers = getSecurityHeaders({ environment: 'production' });

      expect(headers).toHaveProperty('Permissions-Policy');

      const policy = headers['Permissions-Policy'];
      const restrictedFeatures = [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'bluetooth=()',
      ];

      restrictedFeatures.forEach((feature) => {
        expect(policy).toContain(feature);
      });
    });

    it('allows custom permissions', () => {
      const customPermissions = ['camera=(self)', 'microphone=(self)'];
      const headers = getSecurityHeaders({
        environment: 'production',
        customPermissions,
      });

      expect(headers['Permissions-Policy']).toContain('camera=(self)');
      expect(headers['Permissions-Policy']).toContain('microphone=(self)');
    });

    it('includes debug info in development', () => {
      const headers = getSecurityHeaders({ environment: 'development' });

      expect(headers).toHaveProperty('X-Debug-Info');
      expect(headers['X-Debug-Info']).toBe('enabled');
    });
  });

  describe('getProductionSecurityHeaders', () => {
    it('returns production-optimized headers', () => {
      const headers = getProductionSecurityHeaders();

      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers).toHaveProperty('Cross-Origin-Embedder-Policy');
      expect(headers).toHaveProperty('Cross-Origin-Opener-Policy');
      expect(headers).not.toHaveProperty('X-Debug-Info');
    });

    it('accepts custom permissions', () => {
      const customPermissions = ['camera=(self)'];
      const headers = getProductionSecurityHeaders(customPermissions);

      expect(headers['Permissions-Policy']).toContain('camera=(self)');
    });
  });

  describe('getDevelopmentSecurityHeaders', () => {
    it('returns development-optimized headers', () => {
      const headers = getDevelopmentSecurityHeaders();

      expect(headers).not.toHaveProperty('Strict-Transport-Security');
      expect(headers).not.toHaveProperty('Cross-Origin-Embedder-Policy');
      expect(headers).not.toHaveProperty('Cross-Origin-Opener-Policy');
      expect(headers).toHaveProperty('X-Debug-Info');
    });
  });

  describe('validateSecurityHeaders', () => {
    it('validates complete security headers', () => {
      const headers = getProductionSecurityHeaders();
      const result = validateSecurityHeaders(headers);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('warns about missing essential headers', () => {
      const incompleteHeaders = {
        'X-Frame-Options': 'DENY',
        // Missing other essential headers
      };

      const result = validateSecurityHeaders(incompleteHeaders);

      expect(result.isValid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings).toContain(
        'Missing essential security header: X-Content-Type-Options'
      );
    });

    it('recommends HSTS improvements', () => {
      const headers = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000', // Missing includeSubDomains and preload
      };

      const result = validateSecurityHeaders(headers);

      expect(result.recommendations).toContain(
        'Consider adding includeSubDomains to HSTS for broader protection'
      );
      expect(result.recommendations).toContain(
        'Consider adding preload to HSTS for browser preloading'
      );
    });

    it('warns about permissive Permissions-Policy', () => {
      const headers = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=*, microphone=()', // Allows unrestricted camera
      };

      const result = validateSecurityHeaders(headers);

      expect(result.warnings).toContain(
        'Permissions-Policy allows unrestricted camera/microphone access'
      );
    });

    it('recommends COEP/COOP pairing', () => {
      const headersWithCOEP = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        // Missing COOP
      };

      const resultCOEP = validateSecurityHeaders(headersWithCOEP);
      expect(resultCOEP.recommendations).toContain(
        'Consider adding Cross-Origin-Opener-Policy when using COEP'
      );

      const headersWithCOOP = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        // Missing COEP
      };

      const resultCOOP = validateSecurityHeaders(headersWithCOOP);
      expect(resultCOOP.recommendations).toContain(
        'Consider adding Cross-Origin-Embedder-Policy when using COOP'
      );
    });
  });

  describe('getLegacySecurityHeaders', () => {
    it('maintains backward compatibility', () => {
      const legacy = getLegacySecurityHeaders('production');
      const modern = getSecurityHeaders({
        environment: 'production',
        enableHSTS: true,
        enableCOEP: true,
        enableCOOP: true,
      });

      expect(legacy).toEqual(modern);
    });

    it('handles development environment', () => {
      const headers = getLegacySecurityHeaders('development');

      expect(headers).not.toHaveProperty('Strict-Transport-Security');
      expect(headers).not.toHaveProperty('Cross-Origin-Embedder-Policy');
      expect(headers).not.toHaveProperty('Cross-Origin-Opener-Policy');
      expect(headers).toHaveProperty('X-Debug-Info');
    });
  });

  describe('Header Values', () => {
    it('uses correct header values', () => {
      const headers = getProductionSecurityHeaders();

      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['X-DNS-Prefetch-Control']).toBe('on');
      expect(headers['X-Download-Options']).toBe('noopen');
      expect(headers['X-Permitted-Cross-Domain-Policies']).toBe('none');
      expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin');
    });

    it('includes Critical-CH header', () => {
      const headers = getProductionSecurityHeaders();

      expect(headers['Critical-CH']).toBe('Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform');
    });
  });
});
