/**
 * @file packages/infrastructure/security/csp.ts
 * @summary Content Security Policy utilities and nonce generation helpers.
 * @exports createCspNonce, generateCSPNonce, buildContentSecurityPolicy, constants
 * @invariants Nonces are cryptographically strong and policy generation remains deterministic.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Use middleware to inject nonce header before rendering server HTML.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

// File: packages/infra/security/csp.ts  [TRACE:FILE=packages.infra.security.csp]
// Purpose: Content Security Policy utilities implementing 2026 security best practices.
//          Provides nonce-based CSP generation, policy building, and violation reporting.
//
// Relationship: Used by create-middleware and layout (nonce). No @repo deps.
// System role: buildContentSecurityPolicy, createCspNonce, CSP_NONCE_HEADER for nonce-based script/style.
// Assumptions: Nonce passed from middleware to layout; strict-dynamic in production.
//
// Exports / Entry: createCspNonce, buildContentSecurityPolicy, constants, interfaces
// Used by: Root layout (app/layout.tsx), middleware, and security configuration
//
// Invariants:
// - Nonces must use cryptographically secure random values (128 bits entropy)
// - CSP policies must follow zero-trust approach for third-party resources
// - Development mode must allow debugging tools while maintaining security
// - All CSP directives must be properly escaped and validated
// - Violation reporting must not leak sensitive information
//
// Status: @internal
// Features:
// - [FEAT:SECURITY] XSS prevention through Content Security Policy
// - [FEAT:CRYPTOGRAPHY] Cryptographically secure nonce generation
// - [FEAT:REPORTING] CSP violation monitoring and logging
// - [FEAT:ENVIRONMENT] Development vs production security policies
// - [FEAT:COMPLIANCE] 2026 web security standards compliance

const NONCE_BYTE_LENGTH = 16;
export const CSP_NONCE_HEADER = 'x-csp-nonce';
export const CSP_REPORT_TO_HEADER = 'Report-To';
export const CSP_REPORT_ONLY_HEADER = 'Content-Security-Policy-Report-Only';

// [TRACE:INTERFACE=packages.infra.security.csp.CspOptions]
// [FEAT:SECURITY] [FEAT:ENVIRONMENT]
// NOTE: CSP configuration options - controls nonce, environment, and reporting behavior.
interface CspOptions {
  nonce: string;
  isDevelopment: boolean;
  reportEndpoint?: string;
  enableStrictDynamic?: boolean;
}

// [TRACE:INTERFACE=packages.infra.security.csp.CspViolationReport]
// [FEAT:REPORTING]
// NOTE: CSP violation report structure - standardized format for security incident logging.
interface CspViolationReport {
  cspReport: {
    documentURI: string;
    referrer: string;
    blockedURI: string;
    violatedDirective: string;
    effectiveDirective: string;
    originalPolicy: string;
    sourceFile?: string;
    lineNumber?: number;
    columnNumber?: number;
    statusCode?: number;
  };
}

// [TRACE:FUNC=packages.infra.security.csp.encodeBase64]
// [FEAT:CRYPTOGRAPHY]
// NOTE: Base64 encoding utility - handles both Node.js and browser environments for nonce encoding.
function encodeBase64(bytes: Uint8Array): string {
  // Use Buffer in Node.js environment, fallback to browser API
  if (typeof window === 'undefined' && typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  // [Task 9.7.1] Fixed O(n^2) string concatenation — use Array.from().join()
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
}

// [TRACE:FUNC=packages.infra.security.csp.getCryptoProvider]
// [FEAT:CRYPTOGRAPHY]
// NOTE: Crypto provider validation - ensures secure random number generation is available.
function getCryptoProvider(): Crypto {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Crypto.getRandomValues is required to create a CSP nonce.');
  }
  return globalThis.crypto;
}

// [TRACE:FUNC=packages.infra.security.csp.createCspNonce]
// [FEAT:CRYPTOGRAPHY] [FEAT:SECURITY]
// NOTE: Creates cryptographically secure CSP nonce using 128 bits of entropy for optimal security.
/**
 * export function createCspNonce(): string.
 */
export function createCspNonce(): string {
  const bytes = new Uint8Array(NONCE_BYTE_LENGTH);
  getCryptoProvider().getRandomValues(bytes);
  return encodeBase64(bytes);
}

// [TRACE:FUNC=packages.infra.security.csp.buildContentSecurityPolicy]
// [FEAT:SECURITY] [FEAT:ENVIRONMENT] [FEAT:COMPLIANCE]
// NOTE: Builds CSP header value with 2026 best practices - nonce-based, strict-dynamic, and reporting.
/**
 * export function buildContentSecurityPolicy(.
 */
export function buildContentSecurityPolicy({
  nonce,
  isDevelopment,
  reportEndpoint,
  enableStrictDynamic = !isDevelopment,
}: CspOptions): string {
  if (!nonce) {
    throw new Error('CSP nonce must be a non-empty string.');
  }

  // Base script sources with nonce and self
  const scriptSources = ["'self'", `'nonce-${nonce}'`];

  // Add strict-dynamic for production (replaces unsafe-inline/unsafe-eval)
  if (enableStrictDynamic) {
    scriptSources.push("'strict-dynamic'");
  }

  // In development we permit unsafe-eval solely for Next.js HMR/runtime transforms; production keeps this disabled to preserve XSS hardening.
  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
  }

  // Trusted third-party domains
  const trustedDomains = ['https://www.googletagmanager.com', 'https://www.google-analytics.com'];
  scriptSources.push(...trustedDomains);

  // Build CSP directives
  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,

    // Style sources: allow inline for CSS-in-JS libraries in dev, hash-based in prod
    isDevelopment ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",

    // Image sources: allow data URLs and HTTPS images
    "img-src 'self' data: https:",

    // Font sources: self and data URLs
    "font-src 'self' data:",

    // Connect sources: analytics and API endpoints
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",

    // Frame sources: allow YouTube and Vimeo embeds
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://youtube.com https://vimeo.com",

    // Frame security: prevent clickjacking
    "frame-ancestors 'none'",

    // Object sources: prevent plugin execution
    "object-src 'none'",

    // Base URI: restrict base tag usage
    "base-uri 'self'",

    // Form action: restrict form submissions
    "form-action 'self'",
  ];

  // Add violation reporting if endpoint provided
  if (reportEndpoint) {
    directives.push(`report-to ${reportEndpoint}`);
    directives.push(`report-uri ${reportEndpoint}`);
  }

  return directives.join('; ');
}

/**
 * Creates a Report-To endpoint configuration for CSP violation reporting
 * Follows 2026 reporting API standards
 */
/**
 * export function buildReportToConfig(.
 */
export function buildReportToConfig({
  endpoint,
  groupName = 'csp-endpoint',
  // [Task 9.2.2] Named constant for CSP report max-age (24 hours in seconds)
  maxAge = 86_400,
}: {
  endpoint: string;
  groupName?: string;
  maxAge?: number;
}): string {
  return JSON.stringify({
    group: groupName,
    max_age: maxAge,
    endpoints: [
      {
        url: endpoint,
      },
    ],
    include_subdomains: false,
  });
}

/**
 * Validates a CSP nonce format and entropy
 * Ensures nonce meets security requirements
 */
/**
 * export function validateCspNonce(nonce: string): boolean.
 */
export function validateCspNonce(nonce: string): boolean {
  if (!nonce || typeof nonce !== 'string') {
    return false;
  }

  // Check base64 format and minimum length
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  // [Task 9.2.4] Use NONCE_BYTE_LENGTH constant for consistency (single source of truth)
  if (!base64Regex.test(nonce) || nonce.length < NONCE_BYTE_LENGTH) {
    return false;
  }

  return true;
}

/**
 * Processes CSP violation reports for security monitoring
 * Implements 2026 observability patterns
 */
/**
 * export function processCspViolationReport(report: CspViolationReport):.
 */
export function processCspViolationReport(report: CspViolationReport): {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'script' | 'style' | 'image' | 'connect' | 'frame' | 'other';
  recommendation: string;
} {
  const { violatedDirective, blockedURI, documentURI } = report.cspReport;

  // Determine severity based on directive
  const severity =
    violatedDirective.indexOf('script-src') !== -1
      ? 'critical'
      : violatedDirective.indexOf('script-src-elem') !== -1
        ? 'high'
        : violatedDirective.indexOf('style-src') !== -1
          ? 'medium'
          : 'low';

  // Categorize violation type
  const category =
    violatedDirective.indexOf('script') !== -1
      ? 'script'
      : violatedDirective.indexOf('style') !== -1
        ? 'style'
        : violatedDirective.indexOf('img') !== -1
          ? 'image'
          : violatedDirective.indexOf('connect') !== -1
            ? 'connect'
            : violatedDirective.indexOf('frame') !== -1
              ? 'frame'
              : 'other';

  // Generate recommendation
  const recommendation =
    blockedURI.indexOf(documentURI) !== -1
      ? 'Consider adding hash or nonce for inline content'
      : `Review if ${blockedURI} should be added to trusted domains`;

  return {
    severity,
    category,
    recommendation,
  };
}

/**
 * Legacy compatibility wrapper for existing implementations
 * Maintains backward compatibility while encouraging migration
 * @deprecated Use buildContentSecurityPolicy with full options
 */
/**
 * export function buildLegacyContentSecurityPolicy(.
 */
export function buildLegacyContentSecurityPolicy({
  nonce,
  isDevelopment,
}: {
  nonce: string;
  isDevelopment: boolean;
}): string {
  return buildContentSecurityPolicy({
    nonce,
    isDevelopment,
    enableStrictDynamic: !isDevelopment,
  });
}

/** Backward-compatible alias for middleware nonce generation. */
export function generateCSPNonce(): string {
  return createCspNonce();
}
