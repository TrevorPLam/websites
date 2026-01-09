import { beforeEach, describe, expect, it, vi } from 'vitest'
import { submitContactForm } from '@/lib/actions'

let currentIp = '203.0.113.1'

vi.mock('next/headers', () => ({
  headers: () => ({
    get: (key: string) => {
      if (key === 'x-forwarded-for') {
        return currentIp
      }
      return null
    },
  }),
}))

const buildPayload = (email: string) => ({
  name: 'Test User',
  email,
  phone: '555-123-4567',
  website: '',
  message: 'This is a sufficiently long message for validation.',
})

describe('contact form rate limiting', () => {
  beforeEach(() => {
    currentIp = '203.0.113.1'
  })

  it('enforces email limits even when the IP changes', async () => {
    const email = 'limit@example.com'

    const first = await submitContactForm(buildPayload(email))
    const second = await submitContactForm(buildPayload(email))
    const third = await submitContactForm(buildPayload(email))

    currentIp = '203.0.113.2'
    const fourth = await submitContactForm(buildPayload(email))

    expect(first.success).toBe(true)
    expect(second.success).toBe(true)
    expect(third.success).toBe(true)
    expect(fourth.success).toBe(false)
  })

  it('allows submissions when both email and IP change', async () => {
    const email = 'original@example.com'

    await submitContactForm(buildPayload(email))
    await submitContactForm(buildPayload(email))
    await submitContactForm(buildPayload(email))

    currentIp = '198.51.100.5'
    const next = await submitContactForm(buildPayload('fresh@example.com'))

    expect(next.success).toBe(true)
  })

  it('rejects submissions when the honeypot is filled', async () => {
    const response = await submitContactForm({
      ...buildPayload('bot@example.com'),
      website: 'https://spam.example.com',
    })

    expect(response.success).toBe(false)
  })
})
