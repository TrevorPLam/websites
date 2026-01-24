import { describe, expect, it } from 'vitest'

import { isPayloadTooLarge, parseContentLength } from '@/middleware'

describe('parseContentLength', () => {
  it('returns a numeric value for valid headers (happy path)', () => {
    // Happy path: the header is well-formed, so we trust the number.
    expect(parseContentLength('2048')).toBe(2048)
  })

  it('returns null when the header is missing (edge case)', () => {
    // Edge case: missing header should skip the size gate instead of guessing.
    expect(parseContentLength(null)).toBeNull()
  })

  it('treats non-numeric values as oversized to avoid bypasses (error handling)', () => {
    // Error path: invalid input should be treated as oversized for safety.
    expect(parseContentLength('not-a-number')).toBe(1024 * 1024 + 1)
  })
})

describe('isPayloadTooLarge', () => {
  it('flags payloads above the limit (happy path)', () => {
    // Happy path: a clearly oversized payload should be blocked.
    expect(isPayloadTooLarge(1024 * 1024 + 1)).toBe(true)
  })

  it('treats missing content length as safe (edge case)', () => {
    // Edge case: unknown size should not be blocked by the size guard.
    expect(isPayloadTooLarge(null)).toBe(false)
  })
})
