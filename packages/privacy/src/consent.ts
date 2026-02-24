'use server';

import { cookies } from 'next/headers';

const CONSENT_COOKIE = 'cookie_consent_v2';
const CONSENT_VERSION = 2;
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60;

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: number;
  consentGiven: boolean;
}

export async function getCookieConsent(): Promise<CookieConsent | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CONSENT_COOKIE)?.value;
  if (!raw) return null;

  try {
    const consent = JSON.parse(raw) as CookieConsent;
    if (consent.version !== CONSENT_VERSION) return null;
    if (Date.now() - consent.timestamp > CONSENT_MAX_AGE * 1000) return null;
    return consent;
  } catch {
    return null;
  }
}

export async function hasValidConsent(): Promise<boolean> {
  const consent = await getCookieConsent();
  return consent?.consentGiven === true;
}

export async function shouldLoadAnalytics(): Promise<boolean> {
  const consent = await getCookieConsent();
  return consent?.consentGiven === true && consent.analytics === true;
}

export async function shouldLoadMarketing(): Promise<boolean> {
  const consent = await getCookieConsent();
  return consent?.consentGiven === true && consent.marketing === true;
}

export async function shouldShowBanner(): Promise<boolean> {
  return !(await hasValidConsent());
}

function buildConsent(options: { analytics: boolean; marketing: boolean }): CookieConsent {
  return {
    essential: true,
    analytics: options.analytics,
    marketing: options.marketing,
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    consentGiven: true,
  };
}

export async function acceptAllCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    CONSENT_COOKIE,
    JSON.stringify(buildConsent({ analytics: true, marketing: true })),
    {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: CONSENT_MAX_AGE,
      path: '/',
    }
  );
}

export async function rejectNonEssentialCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    CONSENT_COOKIE,
    JSON.stringify(buildConsent({ analytics: false, marketing: false })),
    {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: CONSENT_MAX_AGE,
      path: '/',
    }
  );
}

export async function saveCustomConsent(options: {
  analytics: boolean;
  marketing: boolean;
}): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CONSENT_COOKIE, JSON.stringify(buildConsent(options)), {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: CONSENT_MAX_AGE,
    path: '/',
  });
}
