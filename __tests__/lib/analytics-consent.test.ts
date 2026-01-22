import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAnalyticsConsent, hasAnalyticsConsent, setAnalyticsConsent } from '@/lib/analytics-consent'
import { logError } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

describe('Analytics consent helpers', () => {
  const logErrorMock = vi.mocked(logError)

  beforeEach(() => {
    window.localStorage.removeItem('ydm_analytics_consent')
    document.cookie = 'ydm_analytics_consent=; Max-Age=0; Path=/'
    logErrorMock.mockClear()
  })

  afterEach(() => {
    window.localStorage.removeItem('ydm_analytics_consent')
    document.cookie = 'ydm_analytics_consent=; Max-Age=0; Path=/'
  })

  it('test_returns_granted_when_local_storage_set', () => {
    setAnalyticsConsent('granted')

    expect(getAnalyticsConsent()).toBe('granted')
    expect(hasAnalyticsConsent()).toBe(true)
  })

  it('test_returns_unknown_when_storage_empty', () => {
    expect(getAnalyticsConsent()).toBe('unknown')
    expect(hasAnalyticsConsent()).toBe(false)
  })

  it('test_returns_unknown_for_unrecognized_large_value', () => {
    const largeValue = 'x'.repeat(5000)
    window.localStorage.setItem('ydm_analytics_consent', largeValue)

    expect(getAnalyticsConsent()).toBe('unknown')
  })

  it('test_logs_error_when_local_storage_read_fails', () => {
    // Create a spy that throws an error when getItem is called
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked by browser')
    })

    // This should trigger the error handling path in readStoredConsent()
    const result = getAnalyticsConsent()
    
    // Should return unknown when error occurs
    expect(result).toBe('unknown')
    
    // Should have logged the error with correct message and context
    expect(logErrorMock).toHaveBeenCalledWith(
      'Failed to read analytics consent from localStorage',
      expect.any(Error),
      expect.objectContaining({
        key: 'ydm_analytics_consent',
      })
    )

    getItemSpy.mockRestore()
  })
})
