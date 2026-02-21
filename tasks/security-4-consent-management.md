# Security-4: Third-Party Script Loading & Consent Management

## Metadata

- **Task ID**: security-4-consent-management
- **Owner**: AGENT
- **Priority / Severity**: P0 (Critical Compliance)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: GDPR/CCPA compliance, third-party scripts, THEGOAL compliance
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: None

## Context

Third-party scripts (analytics, marketing, chat widgets) currently load without consent gating, violating GDPR/CCPA requirements. Missing:

1. ScriptManager component for consent-gated script loading
2. Consent Management Platform (CMP) integration
3. Script categorization (analytics/marketing/functional)
4. Performance optimization (scripts load only after consent)

This addresses **Research Topic #16: Third-Party Script Loading & Consent Management** from perplexity research.

## Dependencies

- **Upstream Task**: None
- **Required Packages**: `@repo/ui`, `@repo/integrations`, Next.js Script component

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: Can work alongside integration package development
- **Downstream**: None

## Research

- **Primary topics**: [R-COMPLIANCE](RESEARCH-INVENTORY.md#r-compliance-industry-compliance-packs), [R-SECURITY-CONSENT](RESEARCH-INVENTORY.md#r-security-consent) (new)
- **[2026-02] Research Topic #16**: Consent management requirements:
  - Use Next.js `<Script strategy="afterInteractive" | "lazyOnload">` for most third-party scripts
  - Gate non-essential scripts behind CMP consent
  - Scripts load only after consent granted
- **Threat Model**: Illegal tracking pre-consent violates GDPR/CCPA; performance regressions from early script loading
- **References**:
  - [docs/research/perplexity-compliance-2026.md](../docs/research/perplexity-compliance-2026.md) (Topic #16)
  - [docs/research/RESEARCH-GAPS.md](../docs/research/RESEARCH-GAPS.md)
  - GDPR, ePrivacy, CCPA compliance requirements

## Related Files

- `packages/ui/src/components/ScriptManager.tsx` – create – Consent-gated script loader
- `packages/ui/src/hooks/useConsent.ts` – create – Consent state hook
- `packages/integrations/analytics/src/script-metadata.ts` – create – Script metadata exports
- `packages/integrations/chat/src/script-metadata.ts` – create – Script metadata exports
- `packages/types/src/site-config.ts` – modify – Add consent configuration
- `docs/architecture/third-party-scripts.md` – create – Document script management

## Acceptance Criteria

- [ ] `ScriptManager` component created:
  - Reads consent state from CMP (via context or cookie)
  - Only renders allowed scripts based on consent categories
  - Uses Next.js `<Script>` with optimal strategies (`afterInteractive` or `lazyOnload`)
- [ ] Integration packages export script metadata:
  - Category (analytics/marketing/functional)
  - Script URL or component
  - Consent requirements
- [ ] `site.config.ts` includes consent configuration:
  - `consent.cmpProvider` (termly, cookie-script, custom)
  - Which script categories are used
- [ ] Scripts load only after consent:
  - Analytics scripts → only after analytics consent
  - Marketing scripts → only after marketing consent
  - Functional scripts → load immediately (no consent required)
- [ ] Performance optimized:
  - Scripts use `lazyOnload` strategy where possible
  - No scripts in DOM when consent not granted
- [ ] Documentation created: `docs/architecture/third-party-scripts.md`
- [ ] Unit tests for ScriptManager
- [ ] E2E tests: scripts not present without consent, scripts appear after consent

## Technical Constraints

- Must work with Next.js `<Script>` component
- Must support multiple CMP providers (Termly, CookieScript, custom)
- Must be GDPR/CCPA compliant
- Scripts must not execute before consent (DOM presence check)

## Implementation Plan

### Phase 1: Consent Hook & Context

- [ ] Create `packages/ui/src/hooks/useConsent.ts`:
  ```typescript
  export function useConsent() {
    // Read consent from CMP cookie or context
    // Return: { analytics: boolean, marketing: boolean, functional: boolean }
  }
  ```
- [ ] Create `packages/ui/src/contexts/ConsentContext.tsx`:
  - Provides consent state to components
  - Integrates with CMP provider

### Phase 2: ScriptManager Component

- [ ] Create `packages/ui/src/components/ScriptManager.tsx`:

  ```typescript
  export function ScriptManager({ scripts }: { scripts: ScriptConfig[] }) {
    const consent = useConsent();

    return (
      <>
        {scripts
          .filter(script => shouldLoad(script, consent))
          .map(script => (
            <Script
              key={script.id}
              src={script.src}
              strategy={script.strategy || 'lazyOnload'}
            />
          ))}
      </>
    );
  }
  ```

### Phase 3: Integration Metadata

- [ ] Update analytics integrations:
  - Export script metadata with category: 'analytics'
  - Export script URL/component
- [ ] Update marketing integrations:
  - Export script metadata with category: 'marketing'
- [ ] Update chat integrations:
  - Export script metadata with category: 'functional' (or 'marketing' if tracking)

### Phase 4: Configuration

- [ ] Update `packages/types/src/site-config.ts`:
  ```typescript
  consent: {
    cmpProvider: 'termly' | 'cookie-script' | 'custom',
    categories: {
      analytics: boolean,
      marketing: boolean,
      functional: boolean, // Always true
    },
  }
  ```

### Phase 5: Testing & Documentation

- [ ] Unit tests:
  - ScriptManager filters scripts by consent
  - Scripts not rendered without consent
- [ ] E2E tests:
  - Visit page without consenting → scripts absent
  - Accept analytics → only analytics scripts appear
- [ ] Create `docs/architecture/third-party-scripts.md`

## Sample code / examples

### ScriptManager Component

```typescript
// packages/ui/src/components/ScriptManager.tsx
'use client';

import Script from 'next/script';
import { useConsent } from '../hooks/useConsent';

export interface ScriptConfig {
  id: string;
  src?: string;
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
  category: 'analytics' | 'marketing' | 'functional';
  component?: React.ComponentType;
}

interface ScriptManagerProps {
  scripts: ScriptConfig[];
}

export function ScriptManager({ scripts }: ScriptManagerProps) {
  const consent = useConsent();

  const shouldLoad = (script: ScriptConfig, consent: ConsentState): boolean => {
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
  };

  const scriptsToLoad = scripts.filter(script => shouldLoad(script, consent));

  return (
    <>
      {scriptsToLoad.map(script => {
        if (script.component) {
          return <script.component key={script.id} />;
        }

        if (script.src) {
          return (
            <Script
              key={script.id}
              src={script.src}
              strategy={script.strategy || 'lazyOnload'}
            />
          );
        }

        return null;
      })}
    </>
  );
}
```

### Consent Hook

```typescript
// packages/ui/src/hooks/useConsent.ts
'use client';

import { useContext } from 'react';
import { ConsentContext } from '../contexts/ConsentContext';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean; // Always true
}

export function useConsent(): ConsentState {
  const context = useContext(ConsentContext);

  if (!context) {
    // Default: no consent (GDPR/CCPA compliant)
    return {
      analytics: false,
      marketing: false,
      functional: true,
    };
  }

  return context.consent;
}
```

### Integration Script Metadata

```typescript
// packages/integrations/analytics/src/script-metadata.ts
export const googleAnalyticsScript: ScriptConfig = {
  id: 'google-analytics',
  src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
  strategy: 'afterInteractive',
  category: 'analytics',
};

export const googleAnalyticsInitScript: ScriptConfig = {
  id: 'google-analytics-init',
  component: GoogleAnalyticsInit,
  category: 'analytics',
};
```

### Site Config

```typescript
// site.config.ts
export const siteConfig = {
  // ... other config
  consent: {
    cmpProvider: 'termly', // or 'cookie-script', 'custom'
    categories: {
      analytics: true, // Site uses analytics
      marketing: true, // Site uses marketing scripts
      functional: true, // Always true
    },
  },
} satisfies SiteConfig;
```

## Testing Requirements

- **Unit Tests:**
  - ScriptManager filters scripts by consent
  - Scripts not rendered without consent
  - Functional scripts always render
- **E2E Tests:**
  - Visit page without consenting → scripts absent in DOM
  - Accept analytics consent → analytics scripts appear
  - Accept marketing consent → marketing scripts appear
- **Performance Tests:**
  - Measure LCP/INP before/after consent gating
  - Verify scripts don't execute before consent

## Execution notes

- **Related files — current state:**
  - Integration packages may load scripts directly
  - No consent management system
- **Potential issues / considerations:**
  - CMP provider selection (Termly, CookieScript, custom)
  - Consent state persistence (cookie vs context)
  - Script execution timing (DOM presence vs execution)
- **Verification:**
  - Scripts not in DOM without consent
  - Scripts appear after consent granted
  - Performance improved (LCP/INP)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing (unit + E2E)
- [ ] ScriptManager component created
- [ ] Integration packages export script metadata
- [ ] Consent configuration added to site.config.ts
- [ ] Documentation created (`docs/architecture/third-party-scripts.md`)
- [ ] GDPR/CCPA compliance verified (scripts not loaded without consent)
