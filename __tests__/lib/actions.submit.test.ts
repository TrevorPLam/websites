import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendMock = vi.hoisted(() => vi.fn())
const logError = vi.hoisted(() => vi.fn())
const logInfo = vi.hoisted(() => vi.fn())
const logWarn = vi.hoisted(() => vi.fn())

vi.mock('resend', () => {
  class Resend {
    emails = { send: sendMock }

    constructor(_apiKey: string) {}
  }

  return { Resend }
})

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => (key === 'x-forwarded-for' ? '203.0.113.9' : null),
  }),
}))

vi.mock('@/lib/logger', () => ({
  logError,
  logInfo,
  logWarn,
}))

vi.mock('@/lib/env', () => ({
  validatedEnv: {
    RESEND_API_KEY: 'test-api-key',
    CONTACT_EMAIL: 'contact@example.com',
    UPSTASH_REDIS_REST_URL: '',
    UPSTASH_REDIS_REST_TOKEN: '',
  },
}))

const buildPayload = (email: string) => ({
  name: 'Jamie\nTest',
  email,
  phone: '555-123-4567',
  website: '',
  message: 'Looking for marketing support. <script>alert(1)</script>',
})

describe('contact form email pipeline', () => {
  beforeEach(() => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('sends a sanitized email when Resend is configured', async () => {
    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('jamie@example.com'))

    expect(response.success).toBe(true)
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'contact@example.com',
        subject: expect.not.stringMatching(/[\r\n]/),
        html: expect.stringContaining('&lt;script&gt;alert(1)&lt;/script&gt;'),
      })
    )
  })

  it('returns a safe error response when Resend fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('Resend failed'))

    const { submitContactForm } = await import('@/lib/actions')
    const response = await submitContactForm(buildPayload('error@example.com'))

    expect(response.success).toBe(false)
    expect(response.message).toBe('Something went wrong. Please try again or email us directly.')
    expect(logError).toHaveBeenCalledWith('Contact form submission error', expect.any(Error))
  })
})
