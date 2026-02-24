'use client';

// ============================================================================
// SESSION ATTRIBUTION MANAGER
// Captures UTM parameters and referrer on landing, stores in sessionStorage.
// On form submission, reads stored data as "last touch."
// On first visit ONLY, persists to localStorage as "first touch."
// ============================================================================

export type AttributionData = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrerUrl: string | null;
  landingPage: string;
  capturedAt: string;
};

const FIRST_TOUCH_KEY = 'attribution_first_touch';
const LAST_TOUCH_KEY = 'attribution_last_touch';

function extractUTMFromURL(
  url: URL
): Omit<AttributionData, 'referrerUrl' | 'landingPage' | 'capturedAt'> {
  return {
    utmSource: url.searchParams.get('utm_source'),
    utmMedium: url.searchParams.get('utm_medium'),
    utmCampaign: url.searchParams.get('utm_campaign'),
    utmContent: url.searchParams.get('utm_content'),
    utmTerm: url.searchParams.get('utm_term'),
  };
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const utmData = extractUTMFromURL(url);
  const hasUTM = Object.values(utmData).some(Boolean);

  const attribution: AttributionData = {
    ...utmData,
    referrerUrl: document.referrer || null,
    landingPage: window.location.pathname + window.location.search,
    capturedAt: new Date().toISOString(),
  };

  // Last touch: always update (every page load with UTM data)
  if (hasUTM) {
    sessionStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(attribution));
  }

  // First touch: only set once per browser (never overwrite)
  const existingFirstTouch = localStorage.getItem(FIRST_TOUCH_KEY);
  if (!existingFirstTouch && (hasUTM || document.referrer)) {
    localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
  }
}

export function getFirstTouch(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(FIRST_TOUCH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getLastTouch(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(LAST_TOUCH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAttributionForSubmission(): {
  firstTouch: AttributionData | null;
  lastTouch: AttributionData | null;
} {
  return {
    firstTouch: getFirstTouch(),
    lastTouch: getLastTouch(),
  };
}
