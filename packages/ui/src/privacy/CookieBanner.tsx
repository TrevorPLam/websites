'use client';

import { useState, useTransition } from 'react';
import {
  acceptAllCookies,
  rejectNonEssentialCookies,
  saveCustomConsent,
} from '@repo/privacy/consent';

interface CookieBannerProps {
  show: boolean;
  businessName: string;
  privacyPolicyUrl: string;
}

export function CookieBanner({ show, businessName, privacyPolicyUrl }: CookieBannerProps) {
  const [isPending, startTransition] = useTransition();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-lg">
      <div className="mx-auto max-w-4xl space-y-3">
        <p className="text-sm text-gray-700">
          {businessName} uses cookies to improve your experience. Essential cookies are always on.
          You can accept all, reject non-essential, or customize preferences.
        </p>

        <p className="text-xs text-gray-600">
          Learn more in our{' '}
          <a href={privacyPolicyUrl} className="underline" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>

        {showCustomize ? (
          <div className="space-y-2 rounded border p-3 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>Analytics cookies</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Marketing cookies</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </label>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            disabled={isPending}
            onClick={() => startTransition(() => void acceptAllCookies())}
          >
            Accept all
          </button>
          <button
            className="rounded border px-4 py-2 text-sm disabled:opacity-50"
            disabled={isPending}
            onClick={() => startTransition(() => void rejectNonEssentialCookies())}
          >
            Reject non-essential
          </button>
          <button
            className="rounded border px-4 py-2 text-sm disabled:opacity-50"
            disabled={isPending}
            onClick={() => startTransition(() => void saveCustomConsent({ analytics, marketing }))}
          >
            Save preferences
          </button>
          <button
            className="rounded px-4 py-2 text-sm underline"
            onClick={() => setShowCustomize((v) => !v)}
          >
            {showCustomize ? 'Hide settings' : 'Customize'}
          </button>
        </div>
      </div>
    </div>
  );
}
