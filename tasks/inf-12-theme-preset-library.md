# INF-12 Theme Preset Library

## Metadata

- **Task ID**: inf-12-theme-preset-library
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C-5, INF-4
- **Downstream Tasks**: Client theming

## Context

Curated theme presets (e.g. minimal, bold, professional) as JSON/TS. Apply via theme: preset('minimal') or extend. Infinite visual styles from presets.

## Dependencies

- **Upstream Task**: C-5 – tokens
- **Upstream Task**: INF-4 – token overrides

## Cross-Task Dependencies & Sequencing

- **Upstream**: C-5, INF-4
- **Downstream**: Client theming

## Research

- **Primary topics**: [R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture), [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva). Theme presets.
- **[2026-02] Presets**: minimal, bold, professional; theme.preset or theme.extend; merge with base; ThemeInjector applies.
- **References**: [RESEARCH-INVENTORY.md – R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture).

## Related Files

- `packages/config/tokens/presets/` – create
- `packages/types/src/site-config.ts` – modify – theme preset
- `packages/ui/src/components/ThemeInjector.tsx` – modify

## Acceptance Criteria

- [ ] Preset library: minimal, bold, professional (initial set)
- [ ] theme.preset or theme.extend accepts preset name
- [ ] Preset applies token overrides
- [ ] Document presets and how to add
- [ ] Clients can use preset in site.config

## Technical Constraints

- Preset = token override object
- Merge with base theme

## Implementation Plan

- [ ] Create presets directory and preset files
- [ ] Add preset resolution to theme config
- [ ] ThemeInjector applies preset
- [ ] Document
- [ ] Add tests or manual verification

## Sample code / examples

- **presets/minimal.ts**: Export token overrides; preset('minimal') in theme; ThemeInjector merges and applies.

## Testing Requirements

- Manual verification or unit tests; build pass.

## Execution notes

- **Related files — current state:** See task Related Files; theme preset library — extend theme layer; presets for common themes.
- **Potential issues / considerations:** Config-driven; no breaking changes; align with c-5 design tokens if done.
- **Verification:** Presets work; build passes; docs updated.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Presets work
- [ ] Build passes
- [ ] Documentation updated
