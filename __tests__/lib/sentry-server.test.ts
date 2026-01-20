import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { withServerSpan } from '@/lib/sentry-server'

const startSpanMock = vi.fn()

vi.mock('@sentry/nextjs', () => ({
  startSpan: (...args: unknown[]) => startSpanMock(...args),
}))

describe('withServerSpan', () => {
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  beforeEach(() => {
    startSpanMock.mockReset()
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn
  })

  it('runs the callback inside a span when tracing is enabled', async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://example@test.invalid/1'
    startSpanMock.mockImplementation(async (_options: unknown, callback: () => Promise<string>) => {
      return callback()
    })

    const result = await withServerSpan(
      {
        name: 'contact_form.submit',
        op: 'action',
        attributes: { email_hash: 'hash-value' },
      },
      async () => 'ok',
    )

    expect(result).toBe('ok')
    expect(startSpanMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'contact_form.submit',
        op: 'action',
        attributes: { email_hash: 'hash-value' },
      }),
      expect.any(Function),
    )
  })

  it('falls back to direct execution when tracing is disabled', async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = ''

    const result = await withServerSpan(
      { name: 'contact_form.submit', op: 'action' },
      async () => 'direct',
    )

    expect(result).toBe('direct')
    expect(startSpanMock).not.toHaveBeenCalled()
  })

  it('propagates callback errors', async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://example@test.invalid/1'
    startSpanMock.mockImplementation(async (_options: unknown, callback: () => Promise<unknown>) => {
      return callback()
    })

    await expect(
      withServerSpan({ name: 'contact_form.submit' }, async () => {
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')
  })
})
