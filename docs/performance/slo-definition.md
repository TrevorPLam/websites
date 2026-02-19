<!--
/**
 * @file docs/performance/slo-definition.md
 * @role docs
 * @summary Service Level Objectives (SLOs) and performance budgets for marketing websites.
 *
 * @entrypoints
 * - Performance monitoring and optimization reference
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - scripts/perf/validate-budgets.ts
 * - tasks/c-14-slos-performance-budgets.md
 *
 * @used_by
 * - Developers optimizing performance
 * - CI/CD performance gates
 * - Operations monitoring
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: Lighthouse reports, bundle analysis
 * - outputs: SLO compliance status
 *
 * @invariants
 * - Budgets must be achievable for typical client configurations
 * - SLOs align with Core Web Vitals thresholds
 *
 * @gotchas
 * - Metrics require Lighthouse CI or local Lighthouse runs
 * - Bundle sizes vary by client feature set
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Performance SLOs and Budgets

**Last Updated:** 2026-02-19  
**Status:** Active Documentation  
**Related:** [Task c-14](../../tasks/c-14-slos-performance-budgets.md), [validate-budgets script](../../scripts/perf/validate-budgets.ts)

---

## Overview

This document defines Service Level Objectives (SLOs) and performance budgets for marketing website clients. These targets ensure consistent user experience and prevent performance regressions.

## Core Web Vitals Targets

### Largest Contentful Paint (LCP)

**Target:** ≤ 2.5 seconds  
**Budget:** 2500ms  
**Measurement:** 75th percentile of page loads

**Good:** ≤ 2.5s  
**Needs Improvement:** 2.5s - 4.0s  
**Poor:** > 4.0s

### Interaction to Next Paint (INP)

**Target:** ≤ 200 milliseconds  
**Budget:** 200ms  
**Measurement:** 75th percentile of user interactions

**Good:** ≤ 200ms  
**Needs Improvement:** 200ms - 500ms  
**Poor:** > 500ms

### Cumulative Layout Shift (CLS)

**Target:** ≤ 0.1  
**Budget:** 0.1  
**Measurement:** 75th percentile of page loads

**Good:** ≤ 0.1  
**Needs Improvement:** 0.1 - 0.25  
**Poor:** > 0.25

## Bundle Size Budgets

### Initial JavaScript Bundle

**Target:** ≤ 250 KB (gzipped)  
**Measurement:** Total initial JavaScript payload

**Rationale:** Ensures fast initial page load on mobile networks.

### Per-Route Budgets

Route-specific budgets may be defined per client based on feature complexity:

- **Homepage:** ≤ 250 KB
- **Service pages:** ≤ 200 KB
- **Blog posts:** ≤ 180 KB
- **Contact/Booking:** ≤ 220 KB

## Validation

### Local Validation

```bash
# Validate budgets for starter-template
pnpm validate:budgets --client=starter-template

# JSON output for CI
pnpm validate:budgets --client=starter-template --format=json
```

### CI Integration

Performance budgets can be integrated into CI workflows:

```yaml
# .github/workflows/ci.yml
- name: Validate performance budgets
  run: pnpm validate:budgets --client=starter-template
  continue-on-error: true  # Non-blocking initially
```

## Measurement Setup

### Lighthouse CI

To enable automatic performance measurement:

1. Install `@lhci/cli`:
   ```bash
   pnpm add -D -w @lhci/cli
   ```

2. Configure `.lighthouserc.js`:
   ```js
   module.exports = {
     ci: {
       collect: {
         url: ['http://localhost:3101'],
         startServerCommand: 'pnpm --filter @clients/starter-template dev',
       },
       assert: {
         assertions: {
           'categories:performance': ['error', { minScore: 0.9 }],
           'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
           'interactive': ['error', { maxNumericValue: 200 }],
           'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
         },
       },
     },
   };
   ```

3. Run in CI:
   ```bash
   pnpm lhci autorun
   ```

### Bundle Analysis

Enable bundle analysis with `ANALYZE=true`:

```bash
ANALYZE=true pnpm --filter @clients/starter-template build
```

This generates bundle analysis reports in `.next/analyze/`.

## Monitoring

### Production Monitoring

- **Real User Monitoring (RUM):** Integrate with analytics provider
- **Synthetic Monitoring:** Use services like WebPageTest, Lighthouse CI
- **Error Budgets:** Track SLO violations over time

### Alerting

Set up alerts for:
- LCP > 2.5s (p75)
- INP > 200ms (p75)
- CLS > 0.1 (p75)
- Bundle size increases > 10%

## Optimization Strategies

### LCP Optimization

- Optimize images (Next.js Image component)
- Preload critical resources
- Minimize render-blocking CSS/JS
- Use CDN for static assets

### INP Optimization

- Minimize JavaScript execution time
- Use code splitting
- Optimize event handlers
- Reduce main thread blocking

### CLS Optimization

- Set explicit dimensions for images/embeds
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use `font-display: swap` for web fonts

### Bundle Size Optimization

- Code splitting per route
- Tree shaking unused code
- Lazy load non-critical components
- Optimize dependencies

## Related Documentation

- [Performance Baseline](../../docs/performance-baseline.md) (if exists)
- [Task c-14](../../tasks/c-14-slos-performance-budgets.md)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
