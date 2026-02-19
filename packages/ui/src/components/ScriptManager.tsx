/**
 * @file packages/ui/src/components/ScriptManager.tsx
 * @summary Consent-gated script loader for GDPR/CCPA compliance
 * @see tasks/security-4-consent-management.md
 *
 * Purpose: Loads third-party scripts only after user consent, preventing
 *          illegal tracking and improving performance.
 *
 * Exports / Entry: ScriptManager, ScriptConfig
 * Used by: Client layouts, integration components
 *
 * Invariants:
 * - Scripts not rendered without consent (GDPR/CCPA compliant)
 * - Functional scripts always load
 * - Uses Next.js Script component with optimal strategies
 *
 * Status: @public
 */

'use client';

import * as React from 'react';
import { useConsent } from '../hooks/useConsent';
import type { ConsentState } from '../contexts/ConsentContext';

// Accept Script component as prop to avoid direct Next.js dependency
// Consumers must pass the framework-specific Script (e.g., next/script)
export interface ScriptComponentProps {
  src?: string;
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
  id?: string;
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: unknown;
}

export interface ScriptConfig {
  id: string;
  src?: string;
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
  category: 'analytics' | 'marketing' | 'functional';
  component?: React.ComponentType;
  onLoad?: () => void;
  onError?: () => void;
}

interface ScriptManagerProps {
  Script: React.ComponentType<ScriptComponentProps>;
  scripts: ScriptConfig[];
}

/**
 * Determines if a script should load based on consent state
 */
function shouldLoadScript(script: ScriptConfig, consent: ConsentState): boolean {
  // Functional scripts always load
  if (script.category === 'functional') {
    return true;
  }

  // Analytics scripts require analytics consent
  if (script.category === 'analytics') {
    return consent.analytics;
  }

  // Marketing scripts require marketing consent
  if (script.category === 'marketing') {
    return consent.marketing;
  }

  return false;
}

/**
 * ScriptManager - Consent-gated script loader
 *
 * Only renders scripts that have user consent, ensuring GDPR/CCPA compliance.
 * Functional scripts always load; analytics and marketing scripts require consent.
 *
 * @example
 * ```tsx
 * <ScriptManager
 *   scripts={[
 *     {
 *       id: 'google-analytics',
 *       src: 'https://www.googletagmanager.com/gtag/js?id=GA_ID',
 *       strategy: 'afterInteractive',
 *       category: 'analytics',
 *     },
 *   ]}
 * />
 * ```
 */
export function ScriptManager({ Script, scripts }: ScriptManagerProps) {
  const consent = useConsent();

  const scriptsToLoad = React.useMemo(
    () => scripts.filter((script) => shouldLoadScript(script, consent)),
    [scripts, consent]
  );

  return (
    <>
      {scriptsToLoad.map((script) => {
        // Component-based scripts (e.g., React components)
        if (script.component) {
          const Component = script.component;
          return <Component key={script.id} />;
        }

        // URL-based scripts (e.g., external scripts)
        if (script.src) {
          return (
            <Script
              key={script.id}
              src={script.src}
              strategy={script.strategy || 'lazyOnload'}
              onLoad={script.onLoad}
              onError={script.onError}
            />
          );
        }

        return null;
      })}
    </>
  );
}
