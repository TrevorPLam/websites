import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkRateLimit, resetRateLimiterState } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}))

const hashIp = (value: string) => `hashed:${value}`

describe('rate limiting helpers', () => {
  beforeEach(() => {
    // WHY: Reset state so each test runs deterministically.
    resetRateLimiterState()
    vi.clearAllMocks()
  })

  it('test_allows_three_requests_then_blocks_on_fourth', async () => {
    const email = 'limit@example.com'
    const clientIp = '203.0.113.1'

    const first = await checkRateLimit({ email, clientIp, hashIp })
    const second = await checkRateLimit({ email, clientIp, hashIp })
    const third = await checkRateLimit({ email, clientIp, hashIp })
    const fourth = await checkRateLimit({ email, clientIp, hashIp })

    expect(first).toBe(true)
    expect(second).toBe(true)
    expect(third).toBe(true)
    expect(fourth).toBe(false)
  })

  it('test_blocks_when_email_hits_limit_even_if_ip_changes', async () => {
    const email = 'repeat@example.com'

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await checkRateLimit({ email, clientIp: `203.0.113.${attempt}`, hashIp })
    }

    const blocked = await checkRateLimit({ email, clientIp: '198.51.100.10', hashIp })

    // WHY: Dual-layer limiting means the email cap still applies across IPs.
    expect(blocked).toBe(false)
  })

  it('test_returns_false_and_logs_when_identifiers_missing', async () => {
    const result = await checkRateLimit({ email: '', clientIp: '203.0.113.9', hashIp })

    expect(result).toBe(false)
    expect(logError).toHaveBeenCalledWith(
      'Rate limit check missing identifiers',
      expect.objectContaining({ hasEmail: false, hasClientIp: true }),
    )
  })
})
