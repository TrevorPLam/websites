// File: components/AnalyticsConsentBanner.tsx  [TRACE:FILE=components.analyticsConsentBanner]
// Purpose: GDPR/CCPA compliant analytics consent banner managing user consent for Google Analytics.
//          Handles consent state persistence, conditional script loading, and user preference
//          management with privacy-by-design approach.
//
// Exports / Entry: AnalyticsConsentBanner component (default export)
// Used by: Root layout (app/layout.tsx) - renders on all pages
//
// Invariants:
// - Must not load analytics scripts until explicit user consent is granted
// - Consent state must persist across sessions using localStorage and cookies
// - Banner must only show when consent state is 'unknown'
// - Scripts must include CSP nonce for security compliance
// - Component must be client-side rendered for consent state management
//
// Status: @public
// Features:
// - [FEAT:ANALYTICS] Google Analytics integration with consent gating
// - [FEAT:PRIVACY] GDPR/CCPA compliant consent management
// - [FEAT:SECURITY] CSP-compliant script loading with nonces
// - [FEAT:UX] Non-intrusive consent banner design

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from '@repo/ui';
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsentState,
} from '@/features/analytics/lib/analytics-consent';

interface AnalyticsConsentBannerProps {
  analyticsId?: string;
  nonce?: string;
}

// [TRACE:FUNC=components.shouldRenderBanner]
// [FEAT:PRIVACY] [FEAT:UX]
// NOTE: Banner visibility logic - only shows when consent is unknown and component is ready.
function shouldRenderBanner(consent: AnalyticsConsentState, isReady: boolean): boolean {
  return isReady && consent === 'unknown';
}

// [TRACE:FUNC=components.shouldLoadAnalytics]
// [FEAT:ANALYTICS] [FEAT:PRIVACY]
// NOTE: Analytics loading logic - ensures scripts only load with explicit consent and valid ID.
function shouldLoadAnalytics(consent: AnalyticsConsentState, analyticsId?: string): boolean {
  return consent === 'granted' && Boolean(analyticsId);
}

// [TRACE:FUNC=components.AnalyticsScriptLoader]
// [FEAT:ANALYTICS] [FEAT:SECURITY]
// NOTE: Conditional script loader - only injects GA4 scripts when consent is granted and nonce is available.
function AnalyticsScriptLoader({
  analyticsId,
  enabled,
  nonce,
}: {
  analyticsId: string;
  enabled: boolean;
  nonce?: string;
}) {
  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga4-init" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `}
      </Script>
    </>
  );
}

function ConsentPrompt({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-lg md:left-auto md:right-6 md:max-w-md"
      role="dialog"
      aria-live="polite"
      aria-labelledby="analytics-consent-heading"
    >
      <h2 id="analytics-consent-heading" className="text-sm font-semibold text-foreground">
        Analytics consent
      </h2>
      <p className="mt-2 text-xs text-slate-600">
        We use analytics cookies to understand site usage and improve the experience. You can accept
        or decline.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" size="small" variant="secondary" onClick={onDecline}>
          Decline
        </Button>
        <Button type="button" size="small" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
}

export default function AnalyticsConsentBanner({
  analyticsId,
  nonce,
}: AnalyticsConsentBannerProps) {
  const [consent, setConsent] = useState<AnalyticsConsentState>('unknown');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
    setIsReady(true);
  }, []);

  const canLoadAnalytics = shouldLoadAnalytics(consent, analyticsId);

  if (!analyticsId) {
    return null;
  }

  return (
    <>
      <AnalyticsScriptLoader analyticsId={analyticsId} enabled={canLoadAnalytics} nonce={nonce} />
      {shouldRenderBanner(consent, isReady) ? (
        <ConsentPrompt
          onAccept={() => {
            setAnalyticsConsent('granted');
            setConsent('granted');
          }}
          onDecline={() => {
            setAnalyticsConsent('denied');
            setConsent('denied');
          }}
        />
      ) : null}
    </>
  );
}
