# Infrastructure-4: Partytown Integration for Third-Party Scripts

## Metadata

- **Task ID**: infrastructure-4-partytown-integration
- **Owner**: AGENT
- **Priority / Severity**: P1 (High Priority)
- **Target Release**: Wave 1
- **Related Epics / ADRs**: Performance optimization, Core Web Vitals, third-party script management
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: security-4-consent-management
- **Downstream Tasks**: None

## Context

Third-party scripts (HubSpot, GA4, Meta Pixel, chat widgets) block the main thread, degrading Core Web Vitals (especially INP - Interaction to Next Paint). Partytown offloads these scripts to Web Workers, keeping the main thread free for user interactions.

Current state: Third-party scripts load synchronously, blocking main thread. No script offloading strategy.

This addresses **Research Topic: Partytown Integration** from gemini2.md.

## Dependencies

- **Upstream Task**: `security-4-consent-management` — scripts must be consent-gated before offloading
- **Required Packages**: `@builder.io/partytown`, Next.js 16.1.5
- **Browser Support**: Requires Web Worker support (all modern browsers)

## Research

- **Primary topics**: [R-PARTYTOWN](RESEARCH-INVENTORY.md#r-partytown) (new)
- **[2026-02] Gemini Research**: Partytown benefits:
  - Offloads third-party scripts to Web Workers
  - Prevents main-thread congestion
  - Improves INP (Interaction to Next Paint) metric
  - Click-to-load strategy for non-essential scripts
- **Threat Model**: Performance degradation, poor user experience, Core Web Vitals failures
- **References**: 
  - [docs/research/gemini-production-audit-2026.md](../docs/research/gemini-production-audit-2026.md) (Topic: Observability & Performance)

## Related Files

- `packages/infra/src/scripts/partytown-config.ts` – create – Partytown configuration
- `packages/infra/src/scripts/script-manager.ts` – modify – Integrate Partytown
- `next.config.js` – modify – Add Partytown plugin configuration
- `public/~partytown/` – create – Partytown worker files (auto-generated)
- `docs/architecture/performance/partytown.md` – create – Document Partytown usage

## Acceptance Criteria

- [ ] Partytown installed and configured:
  - Next.js plugin integration
  - Worker files generated in `public/~partytown/`
- [ ] Script Manager updated:
  - Partytown integration for eligible scripts
  - Click-to-load strategy for non-essential scripts
- [ ] Core Web Vitals improved:
  - INP < 200ms target
  - Main thread free time increased
- [ ] Documentation created: `docs/architecture/performance/partytown.md`
- [ ] Performance tests verify improvement
- [ ] Compatibility tests: Verify scripts work in Web Worker context

## Technical Constraints

- Not all scripts are compatible with Web Workers (DOM access limitations)
- Must maintain consent management integration
- Requires Next.js 16+ for optimal integration

## Implementation Plan

### Phase 1: Setup
- [ ] Install `@builder.io/partytown`
- [ ] Configure Next.js plugin in `next.config.js`:
  ```javascript
  const partytown = require('@builder.io/partytown/utils');
  
  module.exports = {
    // ... existing config
    plugins: [
      partytown({
        dest: '~partytown',
      }),
    ],
  };
  ```

### Phase 2: Script Integration
- [ ] Update ScriptManager to use Partytown for compatible scripts:
  - Analytics scripts (GA4, Plausible)
  - Tracking pixels (Meta Pixel)
  - Non-DOM-dependent scripts
- [ ] Implement click-to-load for chat widgets:
  - Show static preview
  - Load actual script on user interaction

### Phase 3: Testing & Optimization
- [ ] Performance testing: Measure INP before/after
- [ ] Compatibility testing: Verify scripts function correctly
- [ ] Monitor Core Web Vitals in production

### Phase 4: Documentation
- [ ] Document Partytown usage patterns
- [ ] Create guide for adding new scripts with Partytown
- [ ] Document compatibility limitations

## Testing

- [ ] Unit tests for Partytown configuration
- [ ] Integration tests: Verify scripts load in Web Worker
- [ ] Performance tests: Measure INP improvement
- [ ] E2E tests: Verify analytics/tracking still work

## Notes

- Partytown is most effective for CPU-intensive scripts (analytics, tracking)
- Chat widgets may require click-to-load due to DOM dependencies
- Monitor Core Web Vitals after deployment to verify improvement
- Complements `security-4-consent-management` by offloading consent-gated scripts
