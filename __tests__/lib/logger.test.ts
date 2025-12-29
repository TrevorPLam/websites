import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logInfo, logWarn, logError } from '@/lib/logger'

describe('Logger', () => {
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let originalNodeEnv: string | undefined

  beforeEach(() => {
    // Save original NODE_ENV
    originalNodeEnv = process.env.NODE_ENV

    // Create console spies
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv

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

      expect(consoleInfoSpy).not.toHaveBeenCalled()
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

      expect(consoleWarnSpy).not.toHaveBeenCalled()
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

      logError('Test error message')

      expect(consoleErrorSpy).not.toHaveBeenCalled()
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
})
