import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const getRequestId = vi.hoisted(() => vi.fn())

vi.mock('@/lib/request-context', () => ({
  getRequestId,
  runWithRequestId: (_requestId: string | undefined, fn: () => unknown) => fn(),
}))

import { logInfo, logWarn, logError, sanitizeLogContext } from '@/lib/logger'

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))

describe('Logger', () => {
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let originalNodeEnv: string | undefined
  let originalSentryDSN: string | undefined

  beforeEach(() => {
    // Save original env vars
    originalNodeEnv = process.env.NODE_ENV
    originalSentryDSN = process.env.NEXT_PUBLIC_SENTRY_DSN

    // Create console spies
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    getRequestId.mockReset()
  })

  afterEach(() => {
    // Restore env vars
    process.env.NODE_ENV = originalNodeEnv
    if (originalSentryDSN === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = originalSentryDSN
    }

    // Restore console methods
    consoleInfoSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('logInfo', () => {
    it('should log info message in development', () => {
      process.env.NODE_ENV = 'development'

      logInfo('Test info message')

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'Test info message', '')
    })

    it('should log info with context in development', () => {
      process.env.NODE_ENV = 'development'

      logInfo('Test info message', { userId: '123' })

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', 'Test info message', { userId: '123' })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'

      logInfo('Test info message')

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1)
      const [payload] = consoleInfoSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        level: 'info',
        message: 'Test info message',
      })
    })

    it('should include request id in production logs when available', () => {
      process.env.NODE_ENV = 'production'
      getRequestId.mockReturnValue('req-123')

      logInfo('Test info message', { userId: '123' })

      const [payload] = consoleInfoSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        context: { userId: '123', request_id: 'req-123' },
      })
    })
  })

  describe('logWarn', () => {
    it('should log warning message in development', () => {
      process.env.NODE_ENV = 'development'

      logWarn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning message', '')
    })

    it('should log warning with context in development', () => {
      process.env.NODE_ENV = 'development'

      logWarn('Test warning message', { code: 'WARN_001' })

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', 'Test warning message', {
        code: 'WARN_001',
      })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'

      logWarn('Test warning message')

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      const [payload] = consoleWarnSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        level: 'warn',
        message: 'Test warning message',
      })
    })
  })

  describe('logError', () => {
    it('should log error message in development', () => {
      process.env.NODE_ENV = 'development'

      logError('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', undefined, '')
    })

    it('should log error with Error object in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')

      logError('Test error message', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', error, '')
    })

    it('should log error with context in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')

      logError('Test error message', error, { userId: '123' })

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message', error, {
        userId: '123',
      })
    })

    it('should not log in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://mock@sentry.io/123'

      logError('Test error message')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      const [payload] = consoleErrorSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        level: 'error',
        message: 'Test error message',
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined context gracefully', () => {
      process.env.NODE_ENV = 'development'

      expect(() => {
        logInfo('Test', undefined)
        logWarn('Test', undefined)
        logError('Test', undefined, undefined)
      }).not.toThrow()
    })

    it('should handle empty strings', () => {
      process.env.NODE_ENV = 'development'

      expect(() => {
        logInfo('')
        logWarn('')
        logError('')
      }).not.toThrow()
    })

    it('should handle special characters in messages', () => {
      process.env.NODE_ENV = 'development'

      const specialMessage = 'Test <script>alert("xss")</script> message'

      logInfo(specialMessage)
      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO]', specialMessage, '')
    })
  })

  describe('Structured JSON logs', () => {
    it('should redact sensitive fields in production JSON logs', () => {
      process.env.NODE_ENV = 'production'

      logInfo('Sensitive log', { password: 'secret', safe: 'ok' })

      const [payload] = consoleInfoSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        context: { password: '[REDACTED]', safe: 'ok' },
      })
    })

    it('should serialize errors for production logs', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Boom')

      logError('Error log', error)

      const [payload] = consoleErrorSpy.mock.calls[0] ?? []
      expect(JSON.parse(payload as string)).toMatchObject({
        error: { message: 'Boom', name: 'Error' },
      })
    })
  })

  describe('sanitizeLogContext', () => {
    it('should redact sensitive fields', () => {
      const result = sanitizeLogContext({
        password: 'supersecret',
        token: 'token-value',
        authorization: 'Bearer 123',
        cookie: 'session=abc',
        api_key: 'key-value',
        secret: 'shh',
        safe: 'value',
      })

      expect(result).toEqual({
        password: '[REDACTED]',
        token: '[REDACTED]',
        authorization: '[REDACTED]',
        cookie: '[REDACTED]',
        api_key: '[REDACTED]',
        secret: '[REDACTED]',
        safe: 'value',
      })
    })

    it('should redact nested sensitive fields', () => {
      const result = sanitizeLogContext({
        user: {
          name: 'Jane',
          apiKey: 'should-redact',
          meta: {
            token: 'nested-token',
          },
        },
        items: [{ password: 'nested-pass' }],
      })

      expect(result).toEqual({
        user: {
          name: 'Jane',
          apiKey: '[REDACTED]',
          meta: {
            token: '[REDACTED]',
          },
        },
        items: [{ password: '[REDACTED]' }],
      })
    })
  })
})
