# C.5 Add Design Token Architecture

## Metadata

- **Task ID**: c-5-design-tokens
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [C.5], design system
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: Theming, INF-4

## Context

Add three-layer design token architecture per THEGOAL: packages/config/tokens/ with option-tokens.css (raw values), decision-tokens.css (semantic aliases), component-tokens.css (component-specific). Integrates with tailwind-theme.css and ThemeInjector.

## Dependencies

- **Upstream Task**: None – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: Theme extensions, INF-4 token overrides

## Research

- **Primary topics**: [R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture). THEGOAL [C.5].
- **[2026-02] Three-layer tokens**: option-tokens.css (raw), decision-tokens.css (semantic), component-tokens.css; DTCG v1.0; Tailwind v4 @theme; ThemeInjector overrides from site.config.
- **References**: [RESEARCH-INVENTORY.md – R-DESIGN-TOKENS](RESEARCH-INVENTORY.md#r-design-tokens-three-layer-token-architecture), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `packages/config/tokens/option-tokens.css` – create – Raw values
- `packages/config/tokens/decision-tokens.css` – create – Semantic aliases
- `packages/config/tokens/component-tokens.css` – create – Component tokens
- `packages/config/tailwind-theme.css` – modify – Reference tokens
- `packages/ui/src/components/ThemeInjector.tsx` – reference – Override injection

## Acceptance Criteria

- [ ] option-tokens.css: colors, spacing, type scales as raw CSS vars
- [ ] decision-tokens.css: --color-primary, --space-page, etc. (semantic)
- [ ] component-tokens.css: --button-bg, --card-radius, etc.
- [ ] Tokens used by tailwind-theme or components
- [ ] Document in docs/design/design-token-architecture.md

## Technical Constraints

- Compatible with Tailwind v4 @theme
- ThemeInjector overrides at runtime via site.config theme

## Implementation Plan

- [ ] Create tokens directory and three CSS files
- [ ] Define option tokens (primitives)
- [ ] Define decision tokens (semantic)
- [ ] Define component tokens
- [ ] Wire into build/import chain
- [ ] Update design docs

## Sample code / examples

- **option-tokens.css**: Raw CSS vars (e.g. `--color-raw-500: 174 100% 26%;`). **decision-tokens.css**: Semantic aliases (`--color-primary: var(--color-raw-500);`). **component-tokens.css**: Component tokens (`--button-bg: var(--color-primary);`). Import in tailwind-theme.css.

## Testing Requirements

- Verify tokens resolve in a client build
- Run `pnpm build` for affected packages

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Tokens integrated
- [ ] Documentation updated
- [ ] Build passes
