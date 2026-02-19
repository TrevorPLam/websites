# INF-3 Font Registry / Theme Typography

## Metadata

- **Task ID**: inf-3-font-registry-typography
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C-5 (tokens), theme
- **Downstream Tasks**: INF-12, INF-13

## Context

Add theme.fonts extension: custom font URLs, font-display, per-section font overrides. Optional type scale as config (modular scale, custom sizes). Supports infinite fonts and type treatments.

## Dependencies

- **Upstream Task**: C-5 – optional (tokens)
- **Upstream Task**: ThemeInjector, theme – required

## Cross-Task Dependencies & Sequencing

- **Upstream**: C-5, ThemeInjector
- **Downstream**: INF-12, INF-13

## Research

- **Primary topics**: [R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), [R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture). THEGOAL typography.
- **[2026-02] Font registry**: theme.fonts (heading, body, accent, custom); font-display; type scale; per-section overrides; next/font or link.
- **References**: [RESEARCH-INVENTORY.md – R-INFRA](RESEARCH-INVENTORY.md#r-infra-slot-provider-context-theme-cva), packages/types/src/site-config.ts.

## Related Files

- `packages/types/src/site-config.ts` – modify – ThemeFonts extend
- `packages/ui/src/components/ThemeInjector.tsx` – modify
- `packages/config/tailwind-theme.css` – modify
- `packages/config/tokens/` – reference

## Acceptance Criteria

- [ ] theme.fonts accepts: heading, body, accent, custom (URL, font-display)
- [ ] Optional type scale config (sizes, line heights)
- [ ] Per-section font override (e.g. hero font different from body)
- [ ] Fonts loaded correctly (next/font or link)
- [ ] Document in design docs

## Technical Constraints

- next/font or standard link preload
- No layout shift (font-display: optional or swap)

## Implementation Plan

- [ ] Extend ThemeFonts with custom URL, font-display
- [ ] Add type scale to theme config
- [ ] Update ThemeInjector to apply fonts
- [ ] Add per-section override mechanism
- [ ] Document
- [ ] Add tests or manual verification

## Sample code / examples

- **SiteConfig theme.fonts**: Extend type; ThemeInjector applies font vars; tailwind-theme.css references. Per-section override via section-level theme or data attributes.

## Testing Requirements

- Manual verification of font loading; run build and type-check.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Font config works
- [ ] Build passes
- [ ] Documentation updated
