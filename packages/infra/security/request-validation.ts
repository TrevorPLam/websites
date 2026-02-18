/**
 * @file packages/infra/security/request-validation.ts
 * Purpose: Request validation: CSRF (Origin/Referer), IP extraction with trusted proxy headers.
 * Relationship: Used by template lib/actions/helpers, contact-actions, booking-actions. No @repo deps.
 * System role: validateOrigin, getValidatedClientIp; createValidationConfig for allowlist.
 * Assumptions: TRUSTED_IP_HEADERS per environment; expectedHost for CSRF; allowMissingHeaders for same-origin.
 */
// Logger interface for optional logging dependency
export interface Logger {
  info?: (message: string, context?: Record<string, unknown>) => void;
  warn?: (message: string, context?: Record<string, unknown>) => void;
  error?: (message: string, error?: unknown, context?: Record<string, unknown>) => void;
}

/**
 * Simple IPv4/IPv6 validation regex patterns
 * Provides basic validation without requiring Node.js net module
 */
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
const IPV6_COMPRESSED_REGEX =
  /^(?:[0-9a-fA-F]{1,4}:){1,7}:|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})$|^:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)$/;

/**
 * Trusted proxy header configuration for different environments.
 *
 * Maps deployment environments to appropriate IP forwarding headers
 * in priority order. Headers are checked in sequence until a valid
 * IP is found.
 */
export const TRUSTED_IP_HEADERS = {
  production: [
    'cf-connecting-ip', // Cloudflare
    'x-vercel-forwarded-for', // Vercel
    'x-forwarded-for', // Standard proxy
    'x-real-ip', // Nginx
  ],
  development: ['x-forwarded-for', 'x-real-ip'],
  test: ['x-forwarded-for', 'x-real-ip'],
} as const;

export type Environment = keyof typeof TRUSTED_IP_HEADERS;

/**
 * Configuration options for request validation.
 */
export interface RequestValidationConfig {
  /** The expected host/origin for CSRF validation */
  expectedHost: string;
  /** Whether to allow requests without Origin/Referer headers */
  allowMissingHeaders?: boolean;
  /** Custom logger instance */
  logger?: Logger;
  /** Environment override (defaults to NODE_ENV) */
  environment?: Environment;
}

/**
 * Result of origin validation with detailed error information.
 */
export interface OriginValidationResult {
  /** Whether the origin is valid */
  isValid: boolean;
  /** The expected host that was used for validation */
  expectedHost: string;
  /** The origin header value if present */
  origin?: string | null;
  /** The referer header value if present */
  referer?: string | null;
  /** The host header value if present */
  host?: string | null;
  /** Reason for validation failure */
  reason?: string;
}

/**
 * Validates a URL header (Origin or Referer) against the expected host.
 *
 * Implements OWASP-recommended exact host matching to prevent
 * subdomain attacks (e.g., example.org.attacker.com).
 *
 * @param headerValue - The header value to validate
 * @param expectedHost - The expected host (without protocol)
 * @param headerName - The header being validated (for logging)
 * @returns True if the header is valid, false otherwise
 */
function validateHeaderUrl(
  headerValue: string,
  expectedHost: string,
  _headerName: 'origin' | 'referer'
): boolean {
  try {
    // Parse the URL to extract the host
    const url = new URL(headerValue);

    // Exact host matching to prevent subdomain attacks
    // This follows OWASP CSRF prevention guidelines
    if (url.host !== expectedHost) {
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Validates the Origin and/or Referer headers for CSRF protection.
 *
 * Implements defense-in-depth following OWASP guidelines:
 * 1. Prefer Origin header (more reliable, present in HTTPS requests)
 * 2. Fall back to Referer header when Origin is missing
 * 3. Require at least one header for security
 * 4. Validate exact host matches
 *
 * @param requestHeaders - The request headers to validate
 * @param config - Validation configuration
 * @returns Detailed validation result
 */
export function validateOrigin(
  requestHeaders: Headers,
  config: RequestValidationConfig
): OriginValidationResult {
  const { expectedHost, allowMissingHeaders = false, logger } = config;

  const origin = requestHeaders.get('origin');
  const referer = requestHeaders.get('referer');
  const host = requestHeaders.get('host');

  // Check if both Origin and Referer are missing
  if (!origin && !referer) {
    const reason = 'CSRF: No origin or referer header';
    if (!allowMissingHeaders) {
      logger?.warn?.(reason, { host, expectedHost });
    }

    return {
      isValid: allowMissingHeaders,
      expectedHost,
      origin,
      referer,
      host,
      reason: allowMissingHeaders ? undefined : reason,
    };
  }

  // Validate Origin header if present (preferred method)
  if (origin) {
    if (validateHeaderUrl(origin, expectedHost, 'origin')) {
      return {
        isValid: true,
        expectedHost,
        origin,
        referer,
        host,
      };
    }

    const reason = `CSRF: Origin header mismatch`;
    logger?.warn?.(reason, { origin, expectedHost });

    return {
      isValid: false,
      expectedHost,
      origin,
      referer,
      host,
      reason,
    };
  }

  // Validate Referer header as fallback
  if (referer) {
    if (validateHeaderUrl(referer, expectedHost, 'referer')) {
      return {
        isValid: true,
        expectedHost,
        origin,
        referer,
        host,
      };
    }

    const reason = `CSRF: Referer header mismatch`;
    logger?.warn?.(reason, { referer, expectedHost });

    return {
      isValid: false,
      expectedHost,
      origin,
      referer,
      host,
      reason,
    };
  }

  // This should not be reached due to the earlier check
  return {
    isValid: false,
    expectedHost,
    origin,
    referer,
    host,
    reason: 'CSRF: Unexpected validation state',
  };
}

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6).
 *
 * @param value - The string to validate
 * @returns True if the value is a valid IP address
 */
function isValidIpAddress(value: string): boolean {
  return IPV4_REGEX.test(value) || IPV6_REGEX.test(value) || IPV6_COMPRESSED_REGEX.test(value);
}

/**
 * Extracts the first valid IP address from a comma-separated header value.
 *
 * Proxy headers often contain multiple IPs in the format:
 * "client, proxy1, proxy2"
 *
 * @param headerValue - The header value to parse
 * @returns The first valid IP address or null if none found
 */
function extractFirstIp(headerValue: string): string | null {
  const trimmedHeader = headerValue.trim();
  if (!trimmedHeader) {
    return null;
  }

  // Split on commas and take the first IP (client IP)
  const firstIp = trimmedHeader.split(',')[0]?.trim();
  if (!firstIp) {
    return null;
  }

  // Validate that the extracted value is actually an IP address
  if (!isValidIpAddress(firstIp)) {
    // Avoid trusting malformed proxy headers
    return null;
  }

  return firstIp;
}

/**
 * Extracts and validates the client IP address from trusted proxy headers.
 *
 * Supports modern deployment architectures including:
 * - Vercel (x-vercel-forwarded-for)
 * - Cloudflare (cf-connecting-ip)
 * - Standard reverse proxies (x-forwarded-for, x-real-ip)
 *
 * @param requestHeaders - The request headers to examine
 * @param config - Validation configuration
 * @returns The validated client IP address or 'unknown'
 */
export function getValidatedClientIp(
  requestHeaders: Headers,
  config: { environment?: Environment; logger?: Logger } = {}
): string {
  const { environment = 'production', logger } = config;
  const trustedHeaders = TRUSTED_IP_HEADERS[environment];

  for (const headerName of trustedHeaders) {
    const headerValue = requestHeaders.get(headerName);
    if (headerValue) {
      const candidateIp = extractFirstIp(headerValue);
      if (candidateIp) {
        return candidateIp;
      }
    }
  }

  // Log when no valid IP is found (might indicate configuration issues)
  logger?.warn?.('Could not determine client IP from trusted headers', {
    environment,
    trustedHeaders,
    availableHeaders: ['origin', 'referer', 'host', ...trustedHeaders],
  });

  return 'unknown';
}

/**
 * Creates a request validation configuration from environment variables.
 *
 * @param siteUrl - The site URL (should come from validated environment)
 * @param logger - Optional logger instance
 * @param environment - Environment override
 * @returns Configuration object for validation functions
 */
export function createValidationConfig(
  siteUrl: string,
  logger?: Logger,
  environment?: Environment
): RequestValidationConfig {
  // Extract host from site URL (remove protocol and path)
  const expectedHost = siteUrl.replace(/^https?:\/\//, '').split('/')[0] || 'localhost';

  return {
    expectedHost,
    logger,
    environment,
    allowMissingHeaders: false, // Default to secure setting
  };
}

/**
 * Comprehensive request validation for security-sensitive operations.
 *
 * Combines origin validation and IP extraction for complete request
 * security validation in a single call.
 *
 * @param requestHeaders - The request headers to validate
 * @param config - Validation configuration
 * @returns Complete validation result
 */
export function validateRequest(
  requestHeaders: Headers,
  config: RequestValidationConfig
): {
  origin: OriginValidationResult;
  clientIp: string;
  isValid: boolean;
} {
  const origin = validateOrigin(requestHeaders, config);
  const clientIp = getValidatedClientIp(requestHeaders, {
    environment: config.environment,
    logger: config.logger,
  });

  return {
    origin,
    clientIp,
    isValid: origin.isValid,
  };
}
