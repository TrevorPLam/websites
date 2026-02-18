<!--
/**
 * @file docs/SETUP_ANALYTICS.md
 * @role docs
 * @summary Guide for setting up documentation analytics and feedback mechanisms.
 *
 * @entrypoints
 * - Referenced from documentation plan
 * - Analytics setup
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/README.md (documentation structure)
 *
 * @used_by
 * - Documentation maintainers
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: user interactions
 * - outputs: analytics data
 *
 * @invariants
 * - Must respect user privacy
 * - Must comply with GDPR/CCPA
 *
 * @gotchas
 * - Requires consent management
 * - May need privacy policy updates
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add more tracking options
 * - Integrate with error tracking
 *
 * @verification
 * - ✅ Steps verified against service documentation
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Setting Up Documentation Analytics

**Last Updated:** 2026-02-18  
**Status:** Setup Guide  
**Related:** [Documentation Hub](README.md)

---

This guide explains how to set up analytics and feedback mechanisms for the documentation to track usage, identify popular content, and gather user feedback.

## Analytics Options

### 1. Google Analytics 4

**Best for:** Comprehensive analytics

**Setup:**
1. Create GA4 property
2. Get Measurement ID
3. Add to documentation site

**Implementation:**
```html
<!-- In documentation site HTML -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Privacy:** Requires consent management for GDPR compliance.

### 2. Plausible Analytics

**Best for:** Privacy-focused analytics

**Setup:**
1. Sign up at https://plausible.io
2. Add domain
3. Add script tag

**Implementation:**
```html
<script defer data-domain="your-docs-domain.com" src="https://plausible.io/js/script.js"></script>
```

**Privacy:** GDPR-compliant, no cookies, lightweight.

### 3. GitHub Analytics

**Best for:** Open source projects

**Setup:**
- GitHub provides basic analytics for repositories
- View in repository Insights tab
- No additional setup needed

**Limitations:** Limited to GitHub-hosted content.

## Feedback Mechanisms

### 1. "Was this helpful?" Buttons

**Implementation:**
```tsx
import { useState } from 'react';

export function FeedbackButtons({ page }: { page: string }) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  
  const submitFeedback = async (value: 'helpful' | 'not-helpful') => {
    setFeedback(value);
    // Send to analytics or API
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ page, feedback: value }),
    });
  };
  
  return (
    <div>
      <p>Was this helpful?</p>
      <button onClick={() => submitFeedback('helpful')}>Yes</button>
      <button onClick={() => submitFeedback('not-helpful')}>No</button>
      {feedback && <p>Thank you for your feedback!</p>}
    </div>
  );
}
```

### 2. Issue Creation from Docs

**Implementation:**
```tsx
export function ReportIssue({ page }: { page: string }) {
  const createIssue = () => {
    const url = `https://github.com/your-org/marketing-websites/issues/new?` +
      `title=Documentation Issue: ${page}&` +
      `body=Page: ${page}%0A%0AIssue: `;
    window.open(url, '_blank');
  };
  
  return (
    <button onClick={createIssue}>
      Report an issue with this page
    </button>
  );
}
```

### 3. Search Analytics

**Track search queries:**
- What users search for
- Search success rate
- Popular queries
- Failed searches

**Implementation:**
```typescript
// Track search events
function trackSearch(query: string, results: number) {
  gtag('event', 'search', {
    search_term: query,
    results_count: results,
  });
}
```

## Quality Metrics Dashboard

### Metrics to Track

1. **Coverage**
   - Percentage of APIs documented
   - Number of undocumented features
   - Documentation completeness score

2. **Accuracy**
   - Outdated content detection
   - Broken link rate
   - Code example validity

3. **Usage**
   - Page views
   - Time on page
   - Popular content
   - Search queries

4. **User Satisfaction**
   - Feedback scores
   - Issue reports
   - Community contributions

### Dashboard Implementation

Create a simple dashboard:

```typescript
// scripts/docs-metrics.ts
import fs from 'fs';
import path from 'path';

interface Metrics {
  coverage: number;
  linkValidity: number;
  lastUpdated: Date;
  totalPages: number;
}

export function calculateMetrics(): Metrics {
  const docsPath = path.join(process.cwd(), 'docs');
  const files = getAllMarkdownFiles(docsPath);
  
  return {
    coverage: calculateCoverage(files),
    linkValidity: validateLinks(files),
    lastUpdated: getLastUpdateDate(),
    totalPages: files.length,
  };
}
```

## Privacy Considerations

### Consent Management

**Required for:**
- Google Analytics
- Any tracking that uses cookies
- Personal data collection

**Implementation:**
```tsx
import { useState, useEffect } from 'react';

export function ConsentBanner() {
  const [consent, setConsent] = useState<boolean | null>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('analytics-consent');
    setConsent(stored === 'true');
  }, []);
  
  const accept = () => {
    localStorage.setItem('analytics-consent', 'true');
    setConsent(true);
    // Initialize analytics
  };
  
  const reject = () => {
    localStorage.setItem('analytics-consent', 'false');
    setConsent(false);
  };
  
  if (consent !== null) return null;
  
  return (
    <div className="consent-banner">
      <p>We use analytics to improve our documentation.</p>
      <button onClick={accept}>Accept</button>
      <button onClick={reject}>Reject</button>
    </div>
  );
}
```

## Implementation Checklist

- [ ] Choose analytics platform
- [ ] Set up tracking
- [ ] Add consent management
- [ ] Implement feedback buttons
- [ ] Set up issue reporting
- [ ] Create metrics dashboard
- [ ] Update privacy policy
- [ ] Test analytics

## Resources

- [Google Analytics Setup](https://support.google.com/analytics/answer/9304153)
- [Plausible Analytics](https://plausible.io/docs)
- [GDPR Compliance](https://gdpr.eu/)

---

**Note:** Always respect user privacy and comply with applicable regulations.
