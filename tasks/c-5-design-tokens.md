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

## Testing Requirements

- Verify tokens resolve in a client build
- Run `pnpm build` for affected packages

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Tokens integrated
- [ ] Documentation updated
- [ ] Build passes
