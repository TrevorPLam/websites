/**
 * @file packages/ui/src/hooks/useConsent.ts
 * @summary Consent state hook for GDPR/CCPA compliance
 * @see tasks/security-4-consent-management.md
 *
 * Purpose: Provides easy access to consent state for components.
 *          Returns default (no consent) if used outside ConsentProvider.
 *
 * Exports / Entry: useConsent
 * Used by: ScriptManager, any component needing consent state
 *
 * Invariants:
 * - Returns default (no consent) if context unavailable (safe default)
 * - Functional consent always true
 *
 * Status: @public
 */

'use client';

import { useContext } from 'react';
import { ConsentContext, type ConsentState } from '../contexts/ConsentContext';

const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  functional: true,
};

/**
 * Hook to access consent state
 *
 * Returns consent state from ConsentContext, or default (no consent) if context unavailable.
 * This safe default ensures GDPR/CCPA compliance when used outside ConsentProvider.
 *
 * @returns ConsentState with analytics, marketing, and functional flags
 *
 * @example
 * ```tsx
 * const consent = useConsent();
 * if (consent.analytics) {
 *   // Load analytics script
 * }
 * ```
 */
export function useConsent(): ConsentState {
  const context = useContext(ConsentContext);

  // Safe default: no consent (GDPR/CCPA compliant)
  if (!context) {
    return DEFAULT_CONSENT;
  }

  return context.consent;
}
