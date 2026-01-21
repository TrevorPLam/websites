import { beforeEach, describe, expect, it, vi } from 'vitest'

const limitMock = vi.hoisted(() => vi.fn())
const fetchMock = vi.hoisted(() => vi.fn())
const logError = vi.hoisted(() => vi.fn())
const logInfo = vi.hoisted(() => vi.fn())
const logWarn = vi.hoisted(() => vi.fn())

let currentIp = '203.0.113.55'

vi.mock('@upstash/ratelimit', () => {
  class Ratelimit {
    limit = limitMock

    constructor(_config: unknown) {}

    static slidingWindow() {
      return 'sliding-window'
    }
  }

  return { Ratelimit }
})

vi.mock('@upstash/redis', () => ({
  Redis: class Redis {
    constructor(_config: unknown) {}
  },
}))

vi.mock('@/lib/env', () => ({
  validatedEnv: {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_SERVICE_ROLE_KEY: 'supabase-key',
    HUBSPOT_PRIVATE_APP_TOKEN: 'hubspot-token',
    UPSTASH_REDIS_REST_URL: 'https://upstash.example',
    UPSTASH_REDIS_REST_TOKEN: 'token',
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
  },
  isProduction: () => false,
}))

vi.mock('@/lib/logger', () => ({
  logError,
  logInfo,
  logWarn,
}))

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => {
      if (key === 'x-forwarded-for') {
        return currentIp
      }
      if (key === 'origin') {
        return 'https://example.com'
      }
      if (key === 'referer') {
        return 'https://example.com/contact'
      }
      if (key === 'host') {
        return 'example.com'
      }
      return null
    },
  }),
}))

vi.stubGlobal('fetch', fetchMock)

const buildPayload = (email: string) => ({
  name: 'Upstash User',
  email,
  phone: '555-555-5555',
  website: '',
  message: 'Message long enough for validation in the Upstash test suite.',
})

describe('contact form Upstash rate limiting', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    currentIp = '203.0.113.55'
    let leadCounter = 0
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${process.env.SUPABASE_URL}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        leadCounter += 1
        return {
          ok: true,
          status: 201,
          json: async () => [{ id: `lead-${leadCounter}` }],
        }
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return { ok: true, status: 200, json: async () => [] }
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return { ok: true, status: 200, json: async () => ({ total: 0, results: [] }) }
      }

      if (url.endsWith('/crm/v3/objects/contacts')) {
        return { ok: true, status: 200, json: async () => ({ id: 'hubspot-123' }) }
      }

      if (url.includes('/crm/v3/objects/contacts/')) {
        return { ok: true, status: 200, json: async () => ({ id: 'hubspot-123' }) }
      }

      return { ok: false, status: 404, json: async () => ({ message: 'not found' }) }
    })
  })

  it('uses Upstash limiter when credentials are present', async () => {
    limitMock.mockResolvedValue({ success: true })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('upstash@example.com'))

    expect(response.success).toBe(true)
    expect(limitMock).toHaveBeenCalledTimes(2)
    expect(limitMock).toHaveBeenNthCalledWith(1, 'email:upstash@example.com')
    expect(limitMock).toHaveBeenNthCalledWith(2, expect.stringMatching(/^ip:/))
    expect(logInfo).toHaveBeenCalledWith('Initialized distributed rate limiting with Upstash Redis')
  })

  it('blocks submissions when Upstash reports a limit breach', async () => {
    limitMock.mockResolvedValueOnce({ success: false })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('blocked@example.com'))

    expect(response.success).toBe(false)
    expect(response.message).toBe('Too many submissions. Please try again later.')
    expect(limitMock).toHaveBeenCalledTimes(1)
    expect(logWarn).toHaveBeenCalledWith(
      'Rate limit exceeded for contact form',
      expect.objectContaining({ emailHash: expect.any(String), ip: expect.any(String) })
    )
  })
})
