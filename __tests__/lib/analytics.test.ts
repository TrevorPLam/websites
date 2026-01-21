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
import { setAnalyticsConsent } from '@/lib/analytics-consent'

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

    setAnalyticsConsent('granted')
  })

  afterEach(() => {
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv

    // Clean up mocks
    vi.clearAllMocks()
    window.localStorage.removeItem('ydm_analytics_consent')
    document.cookie = 'ydm_analytics_consent=; Max-Age=0; Path=/'
  })

  describe('trackEvent', () => {
    it('test_calls_gtag_with_correct_parameters', () => {
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

    it('test_calls_plausible_with_correct_parameters', () => {
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

    it('test_skips_tracking_in_development_mode', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'info')

      trackEvent({
        action: 'click',
        category: 'button',
      })

      expect(gtagMock).not.toHaveBeenCalled()
      expect(plausibleMock).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('test_skips_tracking_when_consent_denied', () => {
      setAnalyticsConsent('denied')

      trackEvent({
        action: 'click',
        category: 'button',
      })

      expect(gtagMock).not.toHaveBeenCalled()
      expect(plausibleMock).not.toHaveBeenCalled()
    })
  })

  describe('trackPageView', () => {
    it('test_calls_gtag_config_with_page_path', () => {
      trackPageView('/about')

      expect(gtagMock).toHaveBeenCalledWith(
        'config',
        process.env.NEXT_PUBLIC_ANALYTICS_ID,
        {
          page_path: '/about',
        }
      )
    })

    it('test_skips_pageview_tracking_in_development', () => {
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'info')

      trackPageView('/about')

      expect(gtagMock).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('trackFormSubmission', () => {
    it('test_tracks_form_submission_conversion', () => {
      trackFormSubmission('contact')

      expect(gtagMock).toHaveBeenCalledWith('event', 'contact_submit', {
        event_category: 'conversion',
        event_label: 'contact',
        value: 1,
      })
    })
  })

  describe('trackCTAClick', () => {
    it('test_tracks_cta_click_event', () => {
      trackCTAClick('Get Started', '/contact')

      expect(gtagMock).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'Get Started',
        value: undefined,
      })
    })
  })

  describe('trackButtonClick', () => {
    it('test_tracks_button_click_event', () => {
      trackButtonClick('Submit', '/form')

      expect(gtagMock).toHaveBeenCalledWith('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'Submit',
        value: undefined,
      })
    })
  })

  describe('trackOutboundLink', () => {
    it('test_tracks_outbound_link_click', () => {
      trackOutboundLink('https://example.com')

      expect(gtagMock).toHaveBeenCalledWith('event', 'outbound_link', {
        event_category: 'navigation',
        event_label: 'https://example.com',
        value: undefined,
      })
    })
  })

  describe('trackDownload', () => {
    it('test_tracks_file_download', () => {
      trackDownload('guide.pdf')

      expect(gtagMock).toHaveBeenCalledWith('event', 'download', {
        event_category: 'engagement',
        event_label: 'guide.pdf',
        value: undefined,
      })
    })
  })

  describe('Error handling', () => {
    it('test_handles_missing_gtag', () => {
      // @ts-ignore
      delete window.gtag

      expect(() => {
        trackEvent({
          action: 'click',
          category: 'button',
        })
      }).not.toThrow()
    })

    it('test_handles_missing_plausible', () => {
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
