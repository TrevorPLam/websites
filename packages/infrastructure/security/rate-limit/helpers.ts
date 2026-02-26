/**
 * Rate limit helper utilities: hashIp, getClientIp.
 * @module rate-limit/helpers
 */

/**
 * IP hashing utility for privacy compliance.
 * Hashes IP addresses to avoid storing PII while maintaining uniqueness for rate limiting.
 *
 * Security posture: This uses a fast non-cryptographic hash (djb2-like). That is intentional
 * for rate limiting — we need determinism and speed, not cryptographic properties.
 */
export function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Extract client IP from request headers.
 * Handles various proxy configurations and cloud providers.
 */
export function getClientIp(headers: Record<string, string>): string {
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded',
  ];

  for (const header of ipHeaders) {
    const value = headers[header] || headers[header.toUpperCase()];
    if (value) {
      const first = value.split(',')[0];
      const ip = first?.trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }

  return '127.0.0.1';
}
