import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.hoisted(() => vi.fn())
const logError = vi.hoisted(() => vi.fn())
const logInfo = vi.hoisted(() => vi.fn())
const logWarn = vi.hoisted(() => vi.fn())
const supabaseUrl = process.env.SUPABASE_URL ?? 'https://supabase.example'

vi.stubGlobal('fetch', fetchMock)

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => {
      if (key === 'x-forwarded-for') {
        return '203.0.113.9'
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

vi.mock('@/lib/logger', () => ({
  logError,
  logInfo,
  logWarn,
}))

vi.mock('@/lib/env', () => ({
  validatedEnv: {
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: 'supabase-key',
    HUBSPOT_PRIVATE_APP_TOKEN: 'hubspot-token',
    UPSTASH_REDIS_REST_URL: '',
    UPSTASH_REDIS_REST_TOKEN: '',
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
  },
  isProduction: () => false,
}))

const buildPayload = (email: string) => ({
  name: 'Jamie\nTest',
  email,
  phone: '555-123-4567',
  website: '',
  message: 'Looking for marketing support. <script>alert(1)</script>',
})

const buildResponse = (data: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
})

const getHubSpotUpsertCalls = () =>
  fetchMock.mock.calls.filter(
    ([url]) => typeof url === 'string' && url.endsWith('/crm/v3/objects/contacts')
  )

describe('contact form lead pipeline', () => {
  beforeEach(() => {
    // WHY: Reset module state so in-memory rate limiter doesn't leak between tests.
    vi.resetModules()
    vi.resetAllMocks()
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-123' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ total: 0, results: [] })
      }

      if (url.endsWith('/crm/v3/objects/contacts')) {
        return buildResponse({ id: 'hubspot-123' })
      }

      if (url.includes('/crm/v3/objects/contacts/')) {
        return buildResponse({ id: 'hubspot-123' })
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })
  })

  it('stores a sanitized lead and syncs to HubSpot', async () => {
    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('jamie@example.com'))

    expect(response.success).toBe(true)
    const insertCall = fetchMock.mock.calls.find(([url]) => url === `${supabaseUrl}/rest/v1/leads`)
    const insertBody = JSON.parse(insertCall?.[1]?.body as string)[0]

    expect(insertBody.message).toMatch(/&lt;script&gt;alert\(1\)&lt;.*script&gt;/)
    expect(insertBody.is_suspicious).toBe(false)
  })

  it('returns success even when HubSpot fails', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-456' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ message: 'HubSpot failure' }, false, 500)
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('error@example.com'))

    expect(response.success).toBe(true)
    expect(logError).toHaveBeenCalledWith('HubSpot sync failed', expect.any(Error))
    const updateCall = fetchMock.mock.calls.find(([url]) =>
      typeof url === 'string' && url.startsWith(`${supabaseUrl}/rest/v1/leads?id=eq.`)
    )
    const updateBody = JSON.parse(updateCall?.[1]?.body as string)
    expect(updateBody.hubspot_sync_status).toBe('needs_sync')
    expect(updateBody.hubspot_retry_count).toBe(3)
    expect(updateBody.hubspot_idempotency_key).toBeTypeOf('string')
  })

  it('retries HubSpot upserts with a stable idempotency key', async () => {
    let upsertAttempt = 0
    fetchMock.mockImplementation(async (input: RequestInfo, _init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-789' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ total: 0, results: [] })
      }

      if (url.endsWith('/crm/v3/objects/contacts')) {
        upsertAttempt += 1
        if (upsertAttempt < 2) {
          return buildResponse({ message: 'HubSpot temporary failure' }, false, 502)
        }
        return buildResponse({ id: 'hubspot-789' })
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('retry@example.com'))

    expect(response.success).toBe(true)
    const updateCall = fetchMock.mock.calls.find(([url]) =>
      typeof url === 'string' && url.startsWith(`${supabaseUrl}/rest/v1/leads?id=eq.`)
    )
    const updateBody = JSON.parse(updateCall?.[1]?.body as string)
    expect(updateBody.hubspot_retry_count).toBe(2)
    expect(updateBody.hubspot_idempotency_key).toBeTypeOf('string')

    const upsertCalls = getHubSpotUpsertCalls()
    expect(upsertCalls).toHaveLength(2)
    const firstHeaders = upsertCalls[0]?.[1]?.headers as Record<string, string>
    const secondHeaders = upsertCalls[1]?.[1]?.headers as Record<string, string>
    expect(firstHeaders['Idempotency-Key']).toBeDefined()
    expect(firstHeaders['Idempotency-Key']).toBe(secondHeaders['Idempotency-Key'])
  })

  it('treats malformed HubSpot search responses as sync failures', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 'lead-999' }])
      }

      if (url.startsWith(`${supabaseRestUrl}?id=eq.`)) {
        return buildResponse([])
      }

      if (url.endsWith('/crm/v3/objects/contacts/search')) {
        return buildResponse({ total: 1, results: null })
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('malformed@example.com'))

    expect(response.success).toBe(true)
    expect(logError).toHaveBeenCalledWith('HubSpot sync failed', expect.any(Error))
  })

  it('returns an error when Supabase insert responses are malformed', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString()
      const supabaseRestUrl = `${supabaseUrl}/rest/v1/leads`

      if (url === supabaseRestUrl) {
        return buildResponse([{ id: 123 }])
      }

      return buildResponse({ message: 'not found' }, false, 404)
    })

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('bad-id@example.com'))

    expect(response.success).toBe(false)
    expect(logError).toHaveBeenCalledWith('Contact form submission error', expect.any(Error))
  })
})
