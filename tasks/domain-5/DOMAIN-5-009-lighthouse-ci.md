---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-009
title: 'Lighthouse CI configuration with performance gates'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-009-lighthouse-ci
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-009 · Lighthouse CI configuration with performance gates

## Objective

Implement Lighthouse CI configuration following section 5.9 specification with 2026 thresholds, performance gates, accessibility compliance, and automated performance monitoring.

---

## Context

**Codebase area:** CI/CD pipeline — Lighthouse integration

**Related files:** CI configuration, performance monitoring, accessibility testing

**Dependencies:** Lighthouse CI, existing CI infrastructure, performance monitoring tools

**Prior work:** Basic CI may exist but lacks comprehensive Lighthouse integration

**Constraints:** Must follow section 5.9 specification with 2026 compliance thresholds

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| CI            | Lighthouse CI with automated testing |
| Performance   | Core Web Vitals monitoring           |
| Accessibility | WCAG 2.2 AA compliance testing       |
| Testing       | Multi-client archetype testing       |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement Lighthouse CI configuration following section 5.9 specification
- [ ] **[Agent]** Configure 2026 performance thresholds (Performance ≥85, Accessibility ≥95)
- [ ] **[Agent]** Add Core Web Vitals gates (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] **[Agent]** Implement multi-client archetype testing
- [ ] **[Agent]** Add accessibility compliance (WCAG 2.2 AA)
- [ ] **[Agent]** Configure automated reporting and upload
- [ ] **[Agent]** Test CI integration with various scenarios
- [ ] **[Human]** Verify configuration follows section 5.9 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.9 specification** — Extract Lighthouse CI requirements
- [ ] **[Agent]** **Create Lighthouse configuration** — Set up 2026 thresholds and testing
- [ ] **[Agent]** **Add multi-client testing** — Test all client archetypes
- [ ] **[Agent]** **Configure performance gates** — Set Core Web Vitals thresholds
- [ ] **[Agent]** **Add accessibility testing** — WCAG 2.2 AA compliance
- [ ] **[Agent]** **Implement reporting** — Add automated result upload
- [ ] **[Agent]** **Test CI integration** — Verify CI pipeline works
- [ ] **[Agent]** **Add monitoring** — Track performance trends

> ⚠️ **Agent Question**: Ask human before proceeding if any existing CI configuration needs migration.

---

## Commands

```bash
# Test Lighthouse CI locally
npm install -g @lhci/cli
lhci autorun

# Test specific client
lhci autorun --config=lighthouserc.js --collect.url=http://localhost:3001

# Test performance thresholds
lhci autorun --config=lighthouserc.js --assert.performance=85

# Generate Lighthouse report
lhci autorun --output=json --output-path=lighthouse-report.json
```

---

## Code Style

```javascript
// ✅ Correct — Lighthouse CI configuration following section 5.9
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      // Test all three client archetypes
      url: [
        'http://localhost:3001', // Law firm
        'http://localhost:3002', // Restaurant
        'http://localhost:3003', // Home services
        'http://localhost:3001/contact',
        'http://localhost:3001/blog',
      ],
      numberOfRuns: 3, // Average of 3 runs for stability
      settings: {
        chromeFlags: '--no-sandbox --headless',
        formFactor: 'mobile', // Google ranks on mobile-first
        throttlingMethod: 'simulate', // Simulate 4G mobile (Lighthouse standard)
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 812,
          deviceScaleFactor: 3,
        },
      },
    },
    assert: {
      // 2026 thresholds (ADA Title II compliance context)
      assertions: {
        // Performance (Core Web Vitals composite)
        'categories:performance': ['error', { minScore: 0.85 }],

        // Accessibility (WCAG 2.2 AA requirement by April 2026 for ADA Title II)
        'categories:accessibility': ['error', { minScore: 0.95 }],

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],

        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals — explicit metric gates
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // 1.8s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // 2.5s
        'total-blocking-time': ['error', { maxNumericValue: 200 }], // 200ms (INP proxy)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        interactive: ['warn', { maxNumericValue: 3800 }], // TTI < 3.8s

        // Critical a11y checks (WCAG 2.2 AA + ADA Title II compliance)
        'color-contrast': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        'focus-indicators': ['error', { minScore: 1 }], // ADA Title II focus visibility
        'keyboard-navigation': ['error', { minScore: 1 }], // ADA Title II keyboard access
        'aria-input-field-name': ['error', { minScore: 1 }], // Screen reader compatibility
        'label-title-only': ['error', { minScore: 1 }], // Form labeling compliance

        // SEO
        'meta-description': ['error', { minScore: 1 }],
        canonical: ['warn', { minScore: 1 }],
        'structured-data': ['warn', { minScore: 1 }],

        // Security
        'is-on-https': ['error', { minScore: 1 }],
        'no-vulnerable-libraries': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'lhci', // Upload to LHCI server
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      token: process.env.LHCI_BUILD_TOKEN,
    },
  },
};

// ============================================================================
// GITHUB ACTIONS WORKFLOW
// ============================================================================

// .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]
  schedule:
  # Run daily at 2 AM UTC to catch performance regressions
  - cron: '0 2 * * *'

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build applications
        run: |
          pnpm build --filter="@repo/ui"
          pnpm build --filter="@repo/features"
          pnpm build --filter="sites/*"

      - name: Start applications
        run: |
          pnpm dev:law-firm &
          pnpm dev:restaurant &
          pnpm dev:home-services &
          sleep 30 # Wait for apps to start

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Upload results to LHCI server
        if: always()
        run: |
          lhci upload --serverBaseUrl=${{ secrets.LHCI_SERVER_URL }} --token=${{ secrets.LHCI_BUILD_TOKEN }}

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');

            // Read Lighthouse results
            const results = JSON.parse(fs.readFileSync('.lighthouseci/lhr-results.json', 'utf8'));

            // Create summary comment
            let summary = '## 🚦 Lighthouse Performance Report\n\n';
            summary += '| Category | Score | Status |\n';
            summary += '|----------|-------|--------|\n';

            const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
            for (const category of categories) {
              const score = results.lhr.categories[category]?.score ?? 0;
              const status = score >= 0.9 ? '✅' : score >= 0.8 ? '⚠️' : '❌';
              summary += `| ${category.charAt(0).toUpperCase() + category.slice(1)} | ${(score * 100).toFixed(0)} | ${status} |\n`;
            }

            // Add Core Web Vitals
            summary += '\n### Core Web Vitals\n';
            const vitals = results.lhr.audits;

            const lcp = vitals['largest-contentful-paint']?.numericValue ?? 0;
            const inp = vitals['total-blocking-time']?.numericValue ?? 0;
            const cls = vitals['cumulative-layout-shift']?.numericValue ?? 0;

            summary += `- **LCP**: ${lcp.toFixed(0)}ms ${lcp <= 2500 ? '✅' : '❌'}\n`;
            summary += `- **INP**: ${inp.toFixed(0)}ms ${inp <= 200 ? '✅' : '❌'}\n`;
            summary += `- **CLS**: ${cls.toFixed(3)} ${cls <= 0.1 ? '✅' : '❌'}\n`;

            // Add recommendations if score is low
            if (results.lhr.categories.performance.score < 0.85) {
              summary += '\n### 🎯 Performance Recommendations\n';
              const perfAudits = results.lhr.audits.filter(a =>
                a.scoreDisplayMode === 'numeric' && a.score < 0.9
              ).slice(0, 5);

              for (const audit of perfAudits) {
                summary += `- ${audit.title}: ${audit.description}\n`;
              }
            }

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

```typescript
// ✅ Correct — Performance monitoring dashboard
// components/LighthouseDashboard.tsx
'use client';

import { useEffect, useState } from 'react';

interface LighthouseResult {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    bestPractices: { score: number };
    seo: { score: number };
  };
  audits: {
    'largest-contentful-paint': { numericValue: number };
    'total-blocking-time': { numericValue: number };
    'cumulative-layout-shift': { numericValue: number };
  };
}

export function LighthouseDashboard({ tenantId }: { tenantId: string }) {
  const [results, setResults] = useState<LighthouseResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLighthouseResults() {
      try {
        const response = await fetch(`/api/lighthouse/results?tenant_id=${tenantId}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch Lighthouse results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLighthouseResults();
    // Refresh every hour
    const interval = setInterval(fetchLighthouseResults, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tenantId]);

  if (loading) {
    return <div>Loading Lighthouse data...</div>;
  }

  if (!results) {
    return <div>No Lighthouse data available</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVitalStatus = (value: number, threshold: number) => {
    return value <= threshold ? '✅' : '❌';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">Performance</h3>
        <p className={`text-2xl font-bold ${getScoreColor(results.categories.performance.score)}`}>
          {(results.categories.performance.score * 100).toFixed(0)}
        </p>
        <div className="text-sm text-gray-600 mt-2">
          <p>LCP: {results.audits['largest-contentful-paint'].numericValue.toFixed(0)}ms {getVitalStatus(results.audits['largest-contentful-paint'].numericValue, 2500)}</p>
          <p>INP: {results.audits['total-blocking-time'].numericValue.toFixed(0)}ms {getVitalStatus(results.audits['total-blocking-time'].numericValue, 200)}</p>
          <p>CLS: {results.audits['cumulative-layout-shift'].numericValue.toFixed(3)} {getVitalStatus(results.audits['cumulative-layout-shift'].numericValue, 0.1)}</p>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">Accessibility</h3>
        <p className={`text-2xl font-bold ${getScoreColor(results.categories.accessibility.score)}`}>
          {(results.categories.accessibility.score * 100).toFixed(0)}
        </p>
        <p className="text-sm text-gray-600 mt-2">WCAG 2.2 AA + ADA Title II compliance</p>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">Best Practices</h3>
        <p className={`text-2xl font-bold ${getScoreColor(results.categories.bestPractices.score)}`}>
          {(results.categories.bestPractices.score * 100).toFixed(0)}
        </p>
        <p className="text-sm text-gray-600 mt-2">Modern web standards</p>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold">SEO</h3>
        <p className={`text-2xl font-bold ${getScoreColor(results.categories.seo.score)}`}>
          {(results.categories.seo.score * 100).toFixed(0)}
        </p>
        <p className="text-sm text-gray-600 mt-2">Search engine optimization</p>
      </div>
    </div>
  );
}
```

**Lighthouse CI principles:**

- **2026 compliance**: Updated thresholds for modern performance standards
- **Mobile-first testing**: All tests run on mobile emulation
- **Multi-client coverage**: Test all client archetypes for consistency
- **Automated enforcement**: CI blocks deployments that fail thresholds
- **Performance monitoring**: Real-time dashboards for performance tracking
- **Accessibility compliance**: WCAG 2.2 AA + ADA Title II requirements for legal compliance

---

## Boundaries

| Tier             | Scope                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 5.9 specification; implement 2026 thresholds; test all clients; enforce CI gates; monitor performance trends |
| ⚠️ **Ask first** | Changing existing CI configuration; modifying performance thresholds; updating accessibility requirements                   |
| 🚫 **Never**     | Skip accessibility testing; ignore performance gates; allow failing deployments; bypass multi-client testing                |

---

## Success Verification

- [ ] **[Agent]** Test Lighthouse CI locally — All tests pass with current configuration
- [ ] **[Agent]** Verify CI integration — GitHub Actions workflow works correctly
- [ ] **[Agent]** Test performance thresholds — 2026 standards are enforced
- [ ] **[Agent]** Verify accessibility testing — WCAG 2.2 AA + ADA Title II compliance checked
- [ ] **[Agent]** Test multi-client coverage — All client archetypes tested
- [ ] **[Agent]** Verify reporting — Results uploaded and commented correctly
- [ ] **[Human]** Test with real PR workflow — CI comments work in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Network variability**: Account for test environment performance differences
- **Third-party dependencies**: Monitor external service impact on scores
- **Mobile emulation**: Ensure mobile-first testing is representative
- **Score fluctuations**: Handle normal variations in CI runs
- **Accessibility testing**: Ensure consistent a11y test results
- **CI environment**: Verify CI environment matches production conditions

---

## Out of Scope

- Bundle size optimization (handled in separate task)
- Core Web Vitals optimization (handled in separate task)
- PPR optimization (handled in separate tasks)
- React Compiler optimization (handled in separate task)

---

## References

- [Section 5.9 Lighthouse CI Configuration](../../../docs/plan/domain-5/5.9-lighthouse-ci-configuration.md)
- [Section 5.6 LCP, INP, CLS Optimization](../../../docs/plan/domain-5/5.6-lcp-inp-cls-optimization.md)
- [Section 5.1 Complete next.config.ts](../../../docs/plan/domain-5/5.1-complete-nextconfigts.md)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals Documentation](https://web.dev/vitals/)
- [WCAG 2.2 Documentation](https://www.w3.org/WAI/WCAG21/quickref/)
