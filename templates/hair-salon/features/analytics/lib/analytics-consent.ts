// File: features/analytics/lib/analytics-consent.ts  [TRACE:FILE=features.analytics.analyticsConsent]
// Purpose: GDPR/CCPA compliant analytics consent management with dual storage strategy.
//          Provides persistent consent state management across sessions using localStorage
//          and secure cookies with privacy-by-design approach.
//
// Exports / Entry: getAnalyticsConsent, hasAnalyticsConsent, setAnalyticsConsent, AnalyticsConsentState type
// Used by: AnalyticsConsentBanner component, analytics gating system
//
// Invariants:
// - Consent state must persist across sessions using localStorage and cookies
// - Must handle browser environment gracefully (SSR compatibility)
// - Cookies must be secure (HTTPS) with SameSite protection
// - localStorage operations must be error-handled for private browsing mode
// - Consent state defaults to 'unknown' for privacy-by-design
//
// Status: @internal
// Features:
// - [FEAT:ANALYTICS] Google Analytics consent state management
// - [FEAT:PRIVACY] GDPR/CCPA compliant consent persistence
// - [FEAT:SECURITY] Secure cookie handling with SameSite protection
// - [FEAT:UX] Dual storage for reliable consent state recovery

import { logError } from '@repo/infra/client';

export type AnalyticsConsentState = 'granted' | 'denied' | 'unknown';

// [TRACE:CONST=features.analytics.consentKey]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: Storage key for consent state - consistent across localStorage and cookies.
const ANALYTICS_CONSENT_KEY = 'ydm_analytics_consent';

// [TRACE:CONST=features.analytics.cookieMaxAge]
// [FEAT:PRIVACY]
// NOTE: 1-year persistence for consent cookies - GDPR compliant for remembering user preferences.
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

// [TRACE:FUNC=features.analytics.isBrowser]
// [FEAT:PRIVACY]
// NOTE: Browser detection - ensures SSR compatibility by checking window object availability.
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// [TRACE:FUNC=features.analytics.parseConsent]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: Consent validation - ensures only valid consent states are accepted, defaults to unknown for safety.
function parseConsent(value?: string | null): AnalyticsConsentState {
  if (value === 'granted' || value === 'denied') {
    return value;
  }

  return 'unknown';
}

// [TRACE:FUNC=features.analytics.readCookieValue]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: Cookie reading - safely extracts consent value from document cookies with error handling.
function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }

  const match = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split('=').slice(1).join('='));
}

// [TRACE:FUNC=features.analytics.setConsentCookie]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: Cookie setting - creates secure consent cookies with proper flags for GDPR compliance.
function setConsentCookie(consent: AnalyticsConsentState) {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = consent === 'unknown' ? 0 : CONSENT_COOKIE_MAX_AGE_SECONDS;
  const value = consent === 'unknown' ? '' : consent;
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `${ANALYTICS_CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`;
}

// [TRACE:FUNC=features.analytics.readStoredConsent]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: localStorage reading - retrieves consent state with error handling for private browsing mode.
function readStoredConsent(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch (error) {
    logError('Failed to read analytics consent from localStorage', error, {
      key: ANALYTICS_CONSENT_KEY,
    });
    return null;
  }
}

// [TRACE:FUNC=features.analytics.writeStoredConsent]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: localStorage writing - persists consent state with cleanup for unknown state and error handling.
function writeStoredConsent(consent: AnalyticsConsentState) {
  if (!isBrowser()) {
    return;
  }

  try {
    if (consent === 'unknown') {
      window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
      return;
    }

    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch (error) {
    logError('Failed to write analytics consent to localStorage', error, {
      key: ANALYTICS_CONSENT_KEY,
    });
  }
}

// [TRACE:FUNC=features.analytics.getAnalyticsConsent]
// [FEAT:ANALYTICS] [FEAT:PRIVACY]
// NOTE: Primary consent getter - implements dual storage strategy with localStorage fallback to cookies.
export function getAnalyticsConsent(): AnalyticsConsentState {
  if (!isBrowser()) {
    return 'unknown';
  }

  const storedValue = readStoredConsent();
  const cookieValue = storedValue ?? readCookieValue(ANALYTICS_CONSENT_KEY);

  return parseConsent(cookieValue);
}

// [TRACE:FUNC=features.analytics.hasAnalyticsConsent]
// [FEAT:ANALYTICS] [FEAT:PRIVACY]
// NOTE: Consent checker - provides boolean convenience function for analytics gating logic.
export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === 'granted';
}

// [TRACE:FUNC=features.analytics.setAnalyticsConsent]
// [FEAT:PRIVACY] [FEAT:SECURITY]
// NOTE: Primary consent setter - updates both localStorage and cookies for reliable persistence.
export function setAnalyticsConsent(consent: AnalyticsConsentState) {
  if (!isBrowser()) {
    return;
  }

  writeStoredConsent(consent);
  setConsentCookie(consent);
}
