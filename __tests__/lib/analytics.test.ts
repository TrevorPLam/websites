import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  trackEvent,
  trackPageView,
  trackFormSubmission,
  trackCTAClick,
  trackButtonClick,
  trackOutboundLink,
  trackDownload,
} from '@/lib/analytics'

describe('Analytics', () => {
  let gtagMock: ReturnType<typeof vi.fn>
  let plausibleMock: ReturnType<typeof vi.fn>
  let originalNodeEnv: string | undefined

  beforeEach(() => {
    // Save original NODE_ENV
    originalNodeEnv = process.env.NODE_ENV

    // Set to production for testing
    process.env.NODE_ENV = 'production'

    // Create mocks
    gtagMock = vi.fn()
    plausibleMock = vi.fn()

    // Set up window mocks
    Object.defineProperty(window, 'gtag', {
      value: gtagMock,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(window, 'plausible', {
      value: plausibleMock,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv

    // Clean up mocks
    vi.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('should call gtag with correct parameters', () => {
      trackEvent({
        action: 'click',
        category: 'button',
        label: 'cta',
        value: 1,
      })

      expect(gtagMock).toHaveBeenCalledWith('event', 'click', {
        event_category: 'button',
        event_label: 'cta',
        value: 1,
      })
    })

    it('should call plausible with correct parameters', () => {
      trackEvent({
        action: 'click',
        category: 'button',
        label: 'cta',
        value: 1,
      })

      expect(plausibleMock).toHaveBeenCalledWith('click', {
        props: {
          category: 'button',
          label: 'cta',
          value: 1,
        },
      })
    })

    it('should not track in development mode', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'log')

      trackEvent({
        action: 'click',
        category: 'button',
      })

      expect(gtagMock).not.toHaveBeenCalled()
      expect(plausibleMock).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('trackPageView', () => {
    it('should call gtag config with page path', () => {
      trackPageView('/about')

      expect(gtagMock).toHaveBeenCalledWith(
        'config',
        process.env.NEXT_PUBLIC_ANALYTICS_ID,
        {
          page_path: '/about',
        }
      )
    })

    it('should not track in development mode', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'log')

      trackPageView('/about')

      expect(gtagMock).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('trackFormSubmission', () => {
    it('should track form submission event', () => {
      trackFormSubmission('contact')

      expect(gtagMock).toHaveBeenCalledWith('event', 'form_submission', {
        event_category: 'form',
        event_label: 'contact',
        value: undefined,
      })
    })
  })

  describe('trackCTAClick', () => {
    it('should track CTA click event', () => {
      trackCTAClick('Get Started', '/contact')

      expect(gtagMock).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'Get Started',
        value: undefined,
      })
    })
  })

  describe('trackButtonClick', () => {
    it('should track button click event', () => {
      trackButtonClick('Submit', '/form')

      expect(gtagMock).toHaveBeenCalledWith('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'Submit',
        value: undefined,
      })
    })
  })

  describe('trackOutboundLink', () => {
    it('should track outbound link click', () => {
      trackOutboundLink('https://example.com')

      expect(gtagMock).toHaveBeenCalledWith('event', 'outbound_link', {
        event_category: 'navigation',
        event_label: 'https://example.com',
        value: undefined,
      })
    })
  })

  describe('trackDownload', () => {
    it('should track file download', () => {
      trackDownload('guide.pdf', 'pdf')

      expect(gtagMock).toHaveBeenCalledWith('event', 'download', {
        event_category: 'engagement',
        event_label: 'guide.pdf',
        value: undefined,
      })
    })
  })

  describe('Error handling', () => {
    it('should not throw error if gtag is not available', () => {
      // @ts-ignore
      delete window.gtag

      expect(() => {
        trackEvent({
          action: 'click',
          category: 'button',
        })
      }).not.toThrow()
    })

    it('should not throw error if plausible is not available', () => {
      // @ts-ignore
      delete window.plausible

      expect(() => {
        trackEvent({
          action: 'click',
          category: 'button',
        })
      }).not.toThrow()
    })
  })
})
