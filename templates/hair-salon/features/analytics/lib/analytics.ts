// File: features/analytics/lib/analytics.ts  [TRACE:FILE=features.analytics.lib.analytics]
// Purpose: Analytics tracking library providing consent-gated event tracking for multiple
//          analytics providers. Implements GDPR/CCPA compliance by checking consent state
//          before any tracking and supporting both GA4 and Plausible Analytics.
//
// Exports / Entry: trackEvent, trackFormSubmission, trackCTAClick functions
// Used by: AnalyticsConsentBanner, ContactForm, BookingForm, and conversion tracking
//
// Invariants:
// - Must check consent state before any analytics tracking
// - Must handle missing analytics providers gracefully
// - Must log events in development/test environments for debugging
// - Must support multiple analytics providers without breaking changes
// - Event structure must follow GA4 conventions for compatibility
//
// Status: @public
// Features:
// - [FEAT:ANALYTICS] Multi-provider analytics tracking (GA4, Plausible)
// - [FEAT:PRIVACY] Consent-gated tracking with GDPR/CCPA compliance
// - [FEAT:MONITORING] Event logging and conversion tracking
// - [FEAT:ENVIRONMENT] Development/test environment handling
// - [FEAT:EXTENSIBILITY] Provider-agnostic tracking interface

import { logInfo } from '@repo/infra/client';
import { hasAnalyticsConsent } from './analytics-consent';

// [TRACE:FUNC=features.analytics.lib.analytics.isDevelopment]
// [FEAT:ENVIRONMENT]
// NOTE: Environment detection - determines if running in development mode for logging.
function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// [TRACE:FUNC=features.analytics.lib.analytics.isTest]
// [FEAT:ENVIRONMENT]
// NOTE: Test environment detection - prevents analytics during automated testing.
function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// [TRACE:FUNC=features.analytics.lib.analytics.isGtagFunction]
// [FEAT:ANALYTICS]
// NOTE: Type guard for gtag function - prevents runtime errors when GA script fails to load.
function isGtagFunction(value: unknown): value is (...args: unknown[]) => void {
  return typeof value === 'function';
}

// [TRACE:INTERFACE=features.analytics.lib.analytics.AnalyticsEvent]
// [FEAT:ANALYTICS]
// NOTE: Analytics event structure - follows GA4 conventions for cross-provider compatibility.
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// [TRACE:FUNC=features.analytics.lib.analytics.trackEvent]
// [FEAT:ANALYTICS] [FEAT:PRIVACY] [FEAT:MONITORING]
// NOTE: Main analytics tracking function - checks consent, handles multiple providers, and logs events.
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (!hasAnalyticsConsent()) {
    return;
  }

  if (isDevelopment() || isTest()) {
    logInfo('Analytics event', { action, category, label, value });
    return;
  }

  // [TRACE:BLOCK=features.analytics.lib.analytics.ga4Tracking]
  // [FEAT:ANALYTICS]
  // NOTE: Google Analytics 4 tracking - sends events to GA4 with proper parameter structure.
  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: unknown };
    // Guard against misconfigured gtag to prevent runtime errors when scripts fail to load.
    if (isGtagFunction(w.gtag)) {
      w.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }

  // [TRACE:BLOCK=features.analytics.lib.analytics.plausibleTracking]
  // [FEAT:ANALYTICS]
  // NOTE: Plausible Analytics tracking - sends events to Plausible with custom properties.
  // Plausible Analytics
  if (typeof window !== 'undefined') {
    const w = window as Window & {
      plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    };
    if (w.plausible) {
      w.plausible(action, {
        props: { category, label, value },
      });
    }
  }

  // Add other analytics providers here
}

// [TRACE:FUNC=features.analytics.lib.analytics.trackFormSubmission]
// [FEAT:MONITORING] [FEAT:ANALYTICS]
// NOTE: Form submission tracking - tracks conversion events with success/failure status.
export function trackFormSubmission(formName: string, success = true) {
  trackEvent({
    action: `${formName}_submit`,
    category: success ? 'conversion' : 'error',
    label: formName,
    value: success ? 1 : 0,
  });
}

// [TRACE:FUNC=features.analytics.lib.analytics.trackCTAClick]
// [FEAT:MONITORING] [FEAT:ANALYTICS]
// NOTE: CTA click tracking - tracks user engagement with call-to-action elements.
export function trackCTAClick(ctaText: string) {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: ctaText,
  });
}
