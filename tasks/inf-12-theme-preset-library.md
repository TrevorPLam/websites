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

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Presets work
- [ ] Build passes
- [ ] Documentation updated
