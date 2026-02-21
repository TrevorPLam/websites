'use client';

/**
 * @file packages/ui/src/contexts/ConsentContext.tsx
 * @summary Consent management context for GDPR/CCPA compliance
 * @see tasks/security-4-consent-management.md
 *
 * Purpose: Provides consent state to components, integrating with CMP providers
 *          (Termly, CookieScript, custom) to gate third-party script loading.
 *
 * Exports / Entry: ConsentContext, ConsentProvider
 * Used by: ScriptManager, useConsent hook
 *
 * Invariants:
 * - Default state: no consent (GDPR/CCPA compliant)
 * - Functional scripts always allowed
 * - Consent state persisted in cookies/localStorage
 *
 * Status: @public
 */

'use client';

import * as React from 'react';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean; // Always true
}

interface ConsentContextValue {
  consent: ConsentState;
  updateConsent: (updates: Partial<ConsentState>) => void;
  hasConsent: (category: keyof ConsentState) => boolean;
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null);

const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  functional: true, // Always true
};

const CONSENT_COOKIE_NAME = 'consent-preferences';

/**
 * Reads consent state from cookie or localStorage
 */
function readConsentFromStorage(): ConsentState {
  if (typeof window === 'undefined') {
    return DEFAULT_CONSENT;
  }

  // Try cookie first (CMP providers often use cookies)
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')[1];

  if (cookieValue) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieValue));
      return {
        ...DEFAULT_CONSENT,
        ...parsed,
        functional: true, // Always true
      };
    } catch {
      // Invalid cookie, fall back to default
    }
  }

  // Fall back to localStorage
  const stored = localStorage.getItem(CONSENT_COOKIE_NAME);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_CONSENT,
        ...parsed,
        functional: true,
      };
    } catch {
      // Invalid storage, fall back to default
    }
  }

  return DEFAULT_CONSENT;
}

/**
 * Writes consent state to cookie and localStorage
 */
function writeConsentToStorage(consent: ConsentState): void {
  if (typeof window === 'undefined') {
    return;
  }

  const value = JSON.stringify(consent);
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry

  // Write to cookie
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  // Write to localStorage as backup
  localStorage.setItem(CONSENT_COOKIE_NAME, value);
}

interface ConsentProviderProps {
  children: React.ReactNode;
  initialConsent?: Partial<ConsentState>;
  cmpProvider?: 'termly' | 'cookie-script' | 'custom';
}

/**
 * ConsentProvider - Provides consent state to child components
 *
 * Integrates with CMP providers by reading consent from cookies/localStorage.
 * For custom CMPs, pass initialConsent prop.
 */
export function ConsentProvider({
  children,
  initialConsent,
  cmpProvider = 'custom',
}: ConsentProviderProps) {
  const [consent, setConsent] = React.useState<ConsentState>(() => {
    // Use initialConsent if provided, otherwise read from storage
    const stored = readConsentFromStorage();
    return initialConsent ? { ...DEFAULT_CONSENT, ...initialConsent, functional: true } : stored;
  });

  // Listen for CMP consent changes (for Termly, CookieScript, etc.)
  React.useEffect(() => {
    if (cmpProvider === 'custom') {
      return; // Custom CMPs handle consent updates via updateConsent
    }

    // Poll for CMP cookie changes (CMPs update cookies)
    const interval = setInterval(() => {
      const updated = readConsentFromStorage();
      setConsent((prev) => {
        // Only update if changed
        if (prev.analytics !== updated.analytics || prev.marketing !== updated.marketing) {
          return updated;
        }
        return prev;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [cmpProvider]);

  const updateConsent = React.useCallback((updates: Partial<ConsentState>) => {
    setConsent((prev) => {
      const next = {
        ...prev,
        ...updates,
        functional: true, // Always true
      };
      writeConsentToStorage(next);
      return next;
    });
  }, []);

  const hasConsent = React.useCallback(
    (category: keyof ConsentState): boolean => {
      return consent[category] ?? false;
    },
    [consent]
  );

  const value = React.useMemo(
    () => ({
      consent,
      updateConsent,
      hasConsent,
    }),
    [consent, updateConsent, hasConsent]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

/**
 * Hook to access consent context
 * @throws Error if used outside ConsentProvider
 */
export function useConsentContext(): ConsentContextValue {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsentContext must be used within ConsentProvider');
  }
  return context;
}

export { ConsentContext };
