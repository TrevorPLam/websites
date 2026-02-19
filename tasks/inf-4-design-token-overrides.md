# INF-4 Design Token Overrides

## Metadata

- **Task ID**: inf-4-design-token-overrides
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: Infinite Extensibility (Tier 12)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: C-5 (tokens)
- **Downstream Tasks**: INF-12

## Context

Allow site.config to provide partial token overrides (colors, spacing, radius) that merge with base tokens. Token values from config, not just theme colors. Infinite theme variations without code changes.

## Dependencies

- **Upstream Task**: C-5 – design tokens

## Related Files

- `packages/types/src/site-config.ts` – modify – theme extend
- `packages/config/tokens/` – modify – Override merge
- `packages/ui/src/components/ThemeInjector.tsx` – modify

## Acceptance Criteria

- [ ] site.config.theme can override: colors, spacing, radius (partial)
- [ ] Overrides merge with base tokens (no full replacement required)
- [ ] ThemeInjector applies overrides at runtime
- [ ] Document override keys and merge behavior

## Technical Constraints

- Merge strategy: config overrides base, base fills gaps
- HSL format for colors (existing convention)

## Implementation Plan

- [ ] Extend theme schema with optional token overrides
- [ ] Implement merge logic
- [ ] ThemeInjector applies merged tokens
- [ ] Document
- [ ] Add tests

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Build passes
- [ ] Documentation updated
