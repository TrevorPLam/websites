import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  trackEvent,
  trackFormSubmission,
  trackCTAClick,
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
      // Happy path: valid gtag should receive the event payload.
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
      // Happy path: plausible event should match unified payload structure.
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

    it('test_handles_empty_label', () => {
      // Empty input: allow empty labels without throwing or mutating payload.
      trackEvent({
        action: 'click',
        category: 'button',
        label: '',
      })

      expect(gtagMock).toHaveBeenCalledWith('event', 'click', {
        event_category: 'button',
        event_label: '',
        value: undefined,
      })
    })

    it('test_skips_tracking_in_development_mode', () => {
      // Edge case: dev mode should avoid external tracking and only log.
      process.env.NODE_ENV = 'development'
      const consoleSpy = vi.spyOn(console, 'info')

      trackEvent({
        action: 'click',
        category: 'button',
      })

      expect(gtagMock).not.toHaveBeenCalled()
      expect(plausibleMock).not.toHaveBeenCalled()
      // Verify console logging with correct event data
      expect(consoleSpy).toHaveBeenCalledWith(
        '[INFO]',
        'Analytics event',
        expect.objectContaining({
          action: 'click',
          category: 'button',
        })
      )

      consoleSpy.mockRestore()
    })

    it('test_skips_tracking_when_consent_denied', () => {
      // Error path: missing consent should short-circuit provider calls.
      setAnalyticsConsent('denied')

      trackEvent({
        action: 'click',
        category: 'button',
      })

      expect(gtagMock).not.toHaveBeenCalled()
      expect(plausibleMock).not.toHaveBeenCalled()
    })

    it('test_handles_non_function_gtag', () => {
      // Error path: misconfigured gtag should not throw or block plausible.
      Object.defineProperty(window, 'gtag', {
        value: 'not-a-function',
        writable: true,
        configurable: true,
      })

      expect(() => {
        trackEvent({
          action: 'click',
          category: 'button',
        })
      }).not.toThrow()

      // Verify plausible is still called with correct arguments even when gtag fails
      expect(plausibleMock).toHaveBeenCalledWith('click', {
        props: {
          category: 'button',
          label: undefined,
          value: undefined,
        },
      })
    })
  })

  describe('trackFormSubmission', () => {
    it('test_tracks_form_submission_conversion', () => {
      // Happy path: conversion should map to conversion category + value.
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
      // Happy path: CTA click should emit consistent engagement event.
      trackCTAClick('Get Started')

      expect(gtagMock).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'Get Started',
        value: undefined,
      })
    })
  })

  describe('Error handling', () => {
    it('test_handles_missing_gtag', () => {
      // Error path: missing gtag should be safe when provider script fails to load.
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
