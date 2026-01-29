/**
 * Analytics event tracking abstraction layer.
 *
 * @module lib/analytics
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Provider-agnostic analytics tracking. Wraps multiple
 * analytics providers (GA4, Plausible) with unified API.
 *
 * **CURRENT STATE**: GA4 selected (T-064 complete); Plausible optional.
 * - NEXT_PUBLIC_ANALYTICS_ID set → GA4 gtag loads after user consent
 * - Missing NEXT_PUBLIC_ANALYTICS_ID → events log to console
 * - Plausible window.plausible present → sends to Plausible (optional)
 *
 * **USAGE**:
 * ```typescript
 * import { trackEvent, trackFormSubmission, trackCTAClick } from '@/lib/analytics'
 *
 * // Custom event
 * trackEvent({ action: 'signup_click', category: 'conversion', label: 'hero' })
 *
 * // Helper functions
 * trackFormSubmission('contact', true)  // form name, success boolean
 * trackCTAClick('homepage')             // CTA text or location label
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding new provider? Add check in trackEvent after Plausible block
 * - Follow pattern: check for window object existence first
 * - Use consistent event naming: snake_case for actions
 * - Dev mode always logs to console (via logInfo)
 *
 * **EVENT NAMING CONVENTION**:
 * - action: verb_noun (e.g., contact_submit, cta_click, page_view)
 * - category: conversion | engagement | navigation | error
 * - label: optional context (e.g., button location, form name)
 *
 * **HELPER FUNCTIONS AVAILABLE**:
 * - trackFormSubmission(formName, success) - contact form tracking
 * - trackCTAClick(ctaText) - CTA button tracking
 *
 * **DEPENDS ON**: GA4 script in app/layout.tsx
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Provide unified API for analytics tracking
 * - Support multiple providers (GA4, Plausible) transparently
 * - Console logging in development for debugging
 *
 * **Supported Providers:**
 * - Google Analytics 4 (via gtag.js)
 * - Plausible Analytics
 * - Extensible for others
 *
 * **Configuration:**
 * - GA4: Set NEXT_PUBLIC_ANALYTICS_ID in env (script injected in layout)
 * - Plausible: Include script in layout (optional)
 * - No config needed for dev logging
 *
 * **Usage:**
 * ```typescript
 * import { trackEvent, trackFormSubmission } from '@/lib/analytics'
 *
 * // Track custom event
 * trackEvent({
 *   action: 'signup_click',
 *   category: 'conversion',
 *   label: 'homepage_hero'
 * })
 *
 * // Track form submission
 * trackFormSubmission('contact', true)
 * ```
 *
 * **Development Behavior:**
 * - Events logged to console instead of sent to providers
 * - Prefix: [Analytics]
 */

import { logInfo } from './logger'
import { hasAnalyticsConsent } from './analytics-consent'

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

function isGtagFunction(value: unknown): value is (...args: unknown[]) => void {
  return typeof value === 'function'
}

/**
 * Analytics event structure following GA4 conventions.
 * 
 * @property action - Event name (e.g., 'button_click')
 * @property category - Event category (e.g., 'engagement')
 * @property label - Optional label for additional context
 * @property value - Optional numeric value
 */
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
  if (!hasAnalyticsConsent()) {
    return
  }

  if (isDevelopment() || isTest()) {
    logInfo('Analytics event', { action, category, label, value })
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: unknown }
    // Guard against misconfigured gtag to prevent runtime errors when scripts fail to load.
    if (isGtagFunction(w.gtag)) {
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
 * Track form submission (conversion on success)
 */
export function trackFormSubmission(formName: string, success = true) {
  trackEvent({
    action: `${formName}_submit`,
    category: success ? 'conversion' : 'error',
    label: formName,
    value: success ? 1 : 0,
  })
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaText: string) {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: ctaText,
  })
}
