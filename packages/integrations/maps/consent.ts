/**
 * @file packages/integrations/maps/consent.ts
 * Task: [4.5] Maps widget consent — load Google Maps JS only when granted.
 * Relationship: Used before loading interactive Maps script; cookie SameSite=Lax.
 */

/** User consent state for interactive map (third-party script load). */
export type MapsConsentState = 'granted' | 'denied' | 'unknown';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

const MAPS_CONSENT_KEY = 'ydm_maps_consent';
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function parseConsent(value?: string | null): MapsConsentState {
  if (value === 'granted' || value === 'denied') return value;
  return 'unknown';
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function setConsentCookie(consent: MapsConsentState) {
  if (typeof document === 'undefined') return;
  const maxAge = consent === 'unknown' ? 0 : CONSENT_COOKIE_MAX_AGE_SECONDS;
  const value = consent === 'unknown' ? '' : consent;
  const secureFlag = window.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${MAPS_CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`;
}

function readStoredConsent(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(MAPS_CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeStoredConsent(consent: MapsConsentState) {
  if (!isBrowser()) return;
  try {
    if (consent === 'unknown') {
      window.localStorage.removeItem(MAPS_CONSENT_KEY);
      return;
    }
    window.localStorage.setItem(MAPS_CONSENT_KEY, consent);
  } catch {
    // ignore
  }
}

/** Returns current maps (interactive) consent state (cookie/localStorage). */
export function getMapsConsent(): MapsConsentState {
  if (!isBrowser()) return 'unknown';
  const stored = readStoredConsent();
  const cookie = stored ?? readCookieValue(MAPS_CONSENT_KEY);
  return parseConsent(cookie);
}

/** True if user has granted consent to load interactive map scripts. */
export function hasMapsConsent(): boolean {
  return getMapsConsent() === 'granted';
}

/** Persists maps consent and sets cookie (browser only). */
export function setMapsConsent(consent: MapsConsentState) {
  if (!isBrowser()) return;
  writeStoredConsent(consent);
  setConsentCookie(consent);
}
