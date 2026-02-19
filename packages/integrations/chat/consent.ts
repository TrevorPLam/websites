/**
 * @file packages/integrations/chat/consent.ts
 * Task: [4.3] Chat widget consent — load third-party script only when granted.
 * Relationship: Mirror of analytics consent; used by feature-chat section before loading widget.
 * Assumptions: Browser only; cookie SameSite=Lax.
 */

/** User consent state for chat widget (third-party script load). */
export type ChatConsentState = 'granted' | 'denied' | 'unknown';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

const CHAT_CONSENT_KEY = 'ydm_chat_consent';
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function parseConsent(value?: string | null): ChatConsentState {
  if (value === 'granted' || value === 'denied') return value;
  return 'unknown';
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

function setConsentCookie(consent: ChatConsentState) {
  if (typeof document === 'undefined') return;
  const maxAge = consent === 'unknown' ? 0 : CONSENT_COOKIE_MAX_AGE_SECONDS;
  const value = consent === 'unknown' ? '' : consent;
  const secureFlag = window.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CHAT_CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`;
}

function readStoredConsent(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(CHAT_CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeStoredConsent(consent: ChatConsentState) {
  if (!isBrowser()) return;
  try {
    if (consent === 'unknown') {
      window.localStorage.removeItem(CHAT_CONSENT_KEY);
      return;
    }
    window.localStorage.setItem(CHAT_CONSENT_KEY, consent);
  } catch {
    // ignore
  }
}

/** Returns current chat widget consent state (cookie/localStorage). */
export function getChatConsent(): ChatConsentState {
  if (!isBrowser()) return 'unknown';
  const stored = readStoredConsent();
  const cookie = stored ?? readCookieValue(CHAT_CONSENT_KEY);
  return parseConsent(cookie);
}

/** True if user has granted consent to load chat widget scripts. */
export function hasChatConsent(): boolean {
  return getChatConsent() === 'granted';
}

/** Persists chat consent and sets cookie (browser only). */
export function setChatConsent(consent: ChatConsentState) {
  if (!isBrowser()) return;
  writeStoredConsent(consent);
  setConsentCookie(consent);
}
