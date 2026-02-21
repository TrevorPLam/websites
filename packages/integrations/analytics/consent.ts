/**
 * @file packages/integrations/analytics/consent.ts
 * Purpose: GDPR/CCPA compliant analytics consent (granted/denied/unknown); cookie + localStorage.
 * Relationship: Used by analytics index for hasAnalyticsConsent. Depends on @repo/infra/client (logError).
 * System role: getAnalyticsConsent, hasAnalyticsConsent, setAnalyticsConsent; cookie key ydm_analytics_consent.
 * Assumptions: Browser only; cookie SameSite=Lax, 1y max-age when granted.
 */
import { logError } from '@repo/infra/client';

export type AnalyticsConsentState = 'granted' | 'denied' | 'unknown';

const ANALYTICS_CONSENT_KEY = 'ydm_analytics_consent';
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function parseConsent(value?: string | null): AnalyticsConsentState {
  if (value === 'granted' || value === 'denied') return value;
  return 'unknown';
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function setConsentCookie(consent: AnalyticsConsentState) {
  if (typeof document === 'undefined') return;
  const maxAge = consent === 'unknown' ? 0 : CONSENT_COOKIE_MAX_AGE_SECONDS;
  const value = consent === 'unknown' ? '' : consent;
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ANALYTICS_CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`;
}

function readStoredConsent(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch (error) {
    logError('Failed to read analytics consent from localStorage', error, {
      key: ANALYTICS_CONSENT_KEY,
    });
    return null;
  }
}

function writeStoredConsent(consent: AnalyticsConsentState) {
  if (!isBrowser()) return;
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

export function getAnalyticsConsent(): AnalyticsConsentState {
  if (!isBrowser()) return 'unknown';
  const stored = readStoredConsent();
  const cookie = stored ?? readCookieValue(ANALYTICS_CONSENT_KEY);
  return parseConsent(cookie);
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === 'granted';
}

export function setAnalyticsConsent(consent: AnalyticsConsentState) {
  if (!isBrowser()) return;
  writeStoredConsent(consent);
  setConsentCookie(consent);
}
