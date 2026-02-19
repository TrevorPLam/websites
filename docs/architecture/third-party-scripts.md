<!--
/**
 * @file docs/architecture/third-party-scripts.md
 * @role docs
 * @summary Third-party script management and consent gating architecture.
 *
 * @entrypoints
 * - Architecture documentation for script loading and consent management
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - tasks/security-4-consent-management.md
 * - packages/ui/src/components/ScriptManager.tsx
 *
 * @used_by
 * - Developers integrating third-party scripts
 * - Compliance and security reviews
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: Consent state, script configurations
 * - outputs: Loaded scripts (only after consent)
 *
 * @invariants
 * - Scripts never load without consent (GDPR/CCPA compliant)
 * - Functional scripts always load
 * - Consent state persisted in cookies/localStorage
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Third-Party Script Management

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Task security-4](../../tasks/security-4-consent-management.md), [Consent Management](../../packages/ui/src/contexts/ConsentContext.tsx)

---

## Overview

Third-party scripts (analytics, marketing, chat widgets) are loaded only after user consent, ensuring GDPR/CCPA compliance and improving performance. The system uses a consent-gated script loader that prevents illegal tracking and optimizes page load times.

## Architecture

### Components

1. **ConsentProvider** - Provides consent state via React context
2. **useConsent** - Hook to access consent state
3. **ScriptManager** - Component that loads scripts based on consent

### Script Categories

- **Functional** - Always load (no consent required)
  - Essential site functionality
  - Examples: Core site scripts, error tracking (non-tracking)

- **Analytics** - Require analytics consent
  - User behavior tracking
  - Examples: Google Analytics, Plausible

- **Marketing** - Require marketing consent
  - Marketing and advertising scripts
  - Examples: Facebook Pixel, marketing pixels, retargeting

## Usage

### Basic Setup

1. **Wrap app with ConsentProvider:**

```tsx
// app/layout.tsx
import { ConsentProvider } from '@repo/ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConsentProvider cmpProvider="termly">
          {children}
        </ConsentProvider>
      </body>
    </html>
  );
}
```

2. **Configure consent in site.config.ts:**

```ts
const siteConfig = {
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

3. **Load scripts via ScriptManager:**

```tsx
import { ScriptManager } from '@repo/ui';
import { googleAnalyticsScript } from '@repo/integrations-analytics';

export function AnalyticsScripts() {
  return (
    <ScriptManager
      scripts={[
        googleAnalyticsScript,
        // Other scripts...
      ]}
    />
  );
}
```

### Integration Script Metadata

Integration packages export script metadata:

```ts
// packages/integrations/analytics/src/script-metadata.ts
import type { ScriptConfig } from '@repo/ui';

export const googleAnalyticsScript: ScriptConfig = {
  id: 'google-analytics',
  src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
  strategy: 'afterInteractive',
  category: 'analytics',
};
```

## Consent Management Platforms (CMP)

### Supported Providers

- **Termly** - Popular GDPR/CCPA compliant CMP
- **CookieScript** - Alternative CMP provider
- **Custom** - Custom consent implementation

### CMP Integration

The ConsentProvider automatically reads consent from CMP cookies:

- **Termly**: Reads `termly-consent` cookie
- **CookieScript**: Reads `CookieScript` cookie
- **Custom**: Uses `updateConsent` function

### Custom CMP Implementation

For custom CMPs, use the `updateConsent` function:

```tsx
import { useConsentContext } from '@repo/ui';

function CustomConsentBanner() {
  const { updateConsent } = useConsentContext();

  const handleAccept = () => {
    updateConsent({
      analytics: true,
      marketing: true,
    });
  };

  return <button onClick={handleAccept}>Accept</button>;
}
```

## Performance Optimization

### Script Loading Strategies

Scripts use Next.js Script component strategies:

- **`lazyOnload`** (default) - Load after page becomes interactive
- **`afterInteractive`** - Load after page becomes interactive (faster)
- **`beforeInteractive`** - Load before page becomes interactive (rarely needed)

### Best Practices

1. **Use `lazyOnload` for non-critical scripts**
2. **Use `afterInteractive` for analytics after consent**
3. **Never use `beforeInteractive` unless absolutely necessary**
4. **Group scripts by category for easier management**

## Compliance

### GDPR Compliance

- Scripts not loaded without consent
- Consent state persisted (1 year expiry)
- Users can revoke consent
- Functional scripts exempt (no tracking)

### CCPA Compliance

- "Do Not Sell" respected
- Marketing scripts require explicit consent
- Analytics can be opt-out (configurable)

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { ScriptManager } from '@repo/ui';

test('scripts not loaded without consent', () => {
  render(
    <ScriptManager
      scripts={[
        {
          id: 'analytics',
          src: '/analytics.js',
          category: 'analytics',
        },
      ]}
    />
  );

  // Script should not be in DOM
  expect(screen.queryByTestId('analytics')).not.toBeInTheDocument();
});
```

### E2E Tests

- Visit page without consenting → scripts absent
- Accept analytics consent → analytics scripts appear
- Revoke consent → scripts removed

## Related Documentation

- [Task security-4](../../tasks/security-4-consent-management.md)
- [ConsentContext source](../../packages/ui/src/contexts/ConsentContext.tsx)
- [ScriptManager source](../../packages/ui/src/components/ScriptManager.tsx)
- [GDPR Compliance](https://gdpr.eu/)
