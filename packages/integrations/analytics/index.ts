/**
 * @file packages/integrations/analytics/index.ts
 * Purpose: Analytics tracking with consent-gated GA4 and Plausible support.
 * Relationship: Depends on @repo/infra/client (logInfo). Uses consent.ts for hasAnalyticsConsent.
 * System role: trackEvent, trackFormSubmission, trackCTAClick; dev/test log only; browser gtag/plausible.
 * Assumptions: Consent stored in cookie/localStorage; gtag and plausible optional on window.
 */
import { logInfo } from '@repo/infra/client';
import { hasAnalyticsConsent } from './consent';

export { getAnalyticsConsent, hasAnalyticsConsent, setAnalyticsConsent } from './consent';
export type { AnalyticsConsentState } from './consent';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

function isGtagFunction(value: unknown): value is (...args: unknown[]) => void {
  return typeof value === 'function';
}

export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (!hasAnalyticsConsent()) return;
  if (isDevelopment() || isTest()) {
    logInfo('Analytics event', { action, category, label, value });
    return;
  }
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: unknown };
    if (isGtagFunction(w.gtag)) {
      w.gtag('event', action, { event_category: category, event_label: label, value });
    }
    const pw = window as Window & {
      plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    };
    if (pw.plausible) {
      pw.plausible(action, { props: { category, label, value } });
    }
  }
}

export function trackFormSubmission(formName: string, success = true) {
  trackEvent({
    action: `${formName}_submit`,
    category: success ? 'conversion' : 'error',
    label: formName,
    value: success ? 1 : 0,
  });
}

export function trackCTAClick(ctaText: string) {
  trackEvent({ action: 'cta_click', category: 'engagement', label: ctaText });
}
