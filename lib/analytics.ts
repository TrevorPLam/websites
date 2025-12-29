/**
 * Analytics utilities
 * Centralized analytics tracking for consistent event monitoring
 */

import { isDevelopment } from './env'

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

/**
 * Track a custom event
 * Supports Google Analytics, Plausible, or custom analytics
 */
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (isDevelopment) {
    console.log('[Analytics]', { action, category, label, value })
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (w.gtag) {
      w.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  // Plausible Analytics
  if (typeof window !== 'undefined') {
    const w = window as Window & { plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void }
    if (w.plausible) {
      w.plausible(action, {
        props: { category, label, value },
      })
    }
  }

  // Add other analytics providers here
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (isDevelopment) {
    console.log('[Analytics] Page view:', url)
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (w.gtag) {
      w.gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID, {
        page_path: url,
      })
    }
  }

  // Plausible Analytics (automatic)
  // No need to manually track page views with Plausible
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'engagement',
    label: formName,
  })
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, location: string) {
  trackEvent({
    action: 'button_click',
    category: 'engagement',
    label: `${location}: ${buttonName}`,
  })
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaText: string, destination: string) {
  trackEvent({
    action: 'cta_click',
    category: 'conversion',
    label: `${ctaText} -> ${destination}`,
  })
}

/**
 * Track outbound link
 */
export function trackOutboundLink(url: string) {
  trackEvent({
    action: 'outbound_link',
    category: 'engagement',
    label: url,
  })
}

/**
 * Track file download
 */
export function trackDownload(fileName: string) {
  trackEvent({
    action: 'download',
    category: 'engagement',
    label: fileName,
  })
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    value: depth,
  })
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number) {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  })
}
