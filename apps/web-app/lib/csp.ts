/**
 * CSP utilities for generating nonces and policy directives.
 *
 * @module lib/csp
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Centralize CSP nonce creation and policy construction for
 * middleware + layout usage. Keeps CSP logic testable and consistent.
 *
 * **ARCHITECTURE PATTERN**: Pure utilities (no side effects).
 * - `createCspNonce()` creates a per-request nonce.
 * - `buildContentSecurityPolicy()` builds the CSP header string.
 *
 * **AI ITERATION HINTS**:
 * 1. Keep functions pure and under 50 lines.
 * 2. Update tests in `__tests__/lib/csp.test.ts` when changing directives.
 * 3. Avoid importing browser-only modules; this runs in Edge + Node.
 *
 * **SECURITY CHECKLIST**:
 * - [ ] Nonce uses cryptographic randomness (no Math.random).
 * - [ ] Script sources avoid `unsafe-inline`.
 * - [ ] External domains remain tightly allowlisted.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const NONCE_BYTE_LENGTH = 16
export const CSP_NONCE_HEADER = 'x-csp-nonce'

function encodeBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }

  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function getCryptoProvider(): Crypto {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Crypto.getRandomValues is required to create a CSP nonce.')
  }
  return globalThis.crypto
}

export function createCspNonce(): string {
  const bytes = new Uint8Array(NONCE_BYTE_LENGTH)
  getCryptoProvider().getRandomValues(bytes)
  return encodeBase64(bytes)
}

export function buildContentSecurityPolicy({
  nonce,
  isDevelopment,
}: {
  nonce: string
  isDevelopment: boolean
}): string {
  if (!nonce) {
    throw new Error('CSP nonce must be a non-empty string.')
  }

  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    'https://www.googletagmanager.com',
  ]

  if (isDevelopment) {
    scriptSources.splice(1, 0, "'unsafe-eval'")
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
    "frame-ancestors 'none'",
  ].join('; ')
}
