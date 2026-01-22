import { describe, expect, it, vi } from 'vitest'
import { getValidatedClientIp, validateOrigin } from '@/lib/request-validation'
import { logWarn } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logWarn: vi.fn(),
}))

const buildHeaders = (entries: Record<string, string>) => new Headers(entries)

describe('request validation helpers', () => {
  it('test_accepts_origin_and_referer_for_same_host', () => {
    const headers = buildHeaders({
      host: 'example.com',
      origin: 'https://example.com',
      referer: 'https://example.com/contact',
    })

    const result = validateOrigin(headers)

    expect(result).toBe(true)
  })

  it('test_rejects_missing_origin_and_referer', () => {
    const headers = buildHeaders({ host: 'example.com' })

    const result = validateOrigin(headers)

    // WHY: CSRF checks must fail closed when no provenance headers exist.
    expect(result).toBe(false)
  })

  it('test_logs_warning_for_invalid_origin_url', () => {
    const headers = buildHeaders({
      host: 'example.com',
      origin: 'not-a-url',
    })

    const result = validateOrigin(headers)

    expect(result).toBe(false)
    expect(logWarn).toHaveBeenCalledWith('CSRF: Invalid origin URL', {
      origin: 'not-a-url',
    })
  })

  it('test_falls_back_to_real_ip_when_forwarded_ip_invalid', () => {
    const headers = buildHeaders({
      'x-forwarded-for': 'not-an-ip',
      'x-real-ip': '203.0.113.55',
    })

    const ip = getValidatedClientIp(headers)

    expect(ip).toBe('203.0.113.55')
  })
})
