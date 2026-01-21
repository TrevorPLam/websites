'use client'

/**
 * AnalyticsConsentBanner — Analytics consent prompt and script gate.
 *
 * @example
 * <AnalyticsConsentBanner analyticsId="G-XXXX" />
 */

import { useEffect, useState } from 'react'
import Script from 'next/script'
import Button from '@/components/ui/Button'
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsentState,
} from '@/lib/analytics-consent'

interface AnalyticsConsentBannerProps {
  analyticsId?: string
}

function shouldRenderBanner(consent: AnalyticsConsentState, isReady: boolean): boolean {
  return isReady && consent === 'unknown'
}

function shouldLoadAnalytics(consent: AnalyticsConsentState, analyticsId?: string): boolean {
  return consent === 'granted' && Boolean(analyticsId)
}

function AnalyticsScriptLoader({ analyticsId, enabled }: { analyticsId: string; enabled: boolean }) {
  if (!enabled) {
    return null
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `}
      </Script>
    </>
  )
}

function ConsentPrompt({
  onAccept,
  onDecline,
}: {
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-slate-200 bg-white p-4 shadow-lg md:left-auto md:right-6 md:max-w-md"
      role="dialog"
      aria-live="polite"
      aria-labelledby="analytics-consent-heading"
    >
      <h2 id="analytics-consent-heading" className="text-sm font-semibold text-charcoal">
        Analytics consent
      </h2>
      <p className="mt-2 text-xs text-slate-600">
        We use analytics cookies to understand site usage and improve the experience. You can accept or decline.
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
  )
}

export default function AnalyticsConsentBanner({ analyticsId }: AnalyticsConsentBannerProps) {
  const [consent, setConsent] = useState<AnalyticsConsentState>('unknown')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setConsent(getAnalyticsConsent())
    setIsReady(true)
  }, [])

  const canLoadAnalytics = shouldLoadAnalytics(consent, analyticsId)

  if (!analyticsId) {
    return null
  }

  return (
    <>
      <AnalyticsScriptLoader analyticsId={analyticsId} enabled={canLoadAnalytics} />
      {shouldRenderBanner(consent, isReady) ? (
        <ConsentPrompt
          onAccept={() => {
            setAnalyticsConsent('granted')
            setConsent('granted')
          }}
          onDecline={() => {
            setAnalyticsConsent('denied')
            setConsent('denied')
          }}
        />
      ) : null}
    </>
  )
}
