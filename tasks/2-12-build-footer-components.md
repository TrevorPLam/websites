# 2.12 Build Footer Components

## Metadata

- **Task ID**: 2-12-build-footer-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Footer variants with newsletter and social-focused layouts. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Newsletter, Social-Focused, Multi-Column, With Map, With Contact, With Links, With Logo, Sticky (10+ total)
- **Newsletter Integration:** Email signup, validation, integration
- **Social Integration:** Social media links, icons, follow buttons

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/footer/types.ts` – modify – (see task objective)
- `FooterStandard.tsx` – modify – (see task objective)
- `FooterMinimal.tsx` – modify – (see task objective)
- `FooterWithNewsletter.tsx` – modify – (see task objective)
- `FooterSocial.tsx` – modify – (see task objective)
- `footer/newsletter.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Footer`. Props: `variant`, `links` (array), `showNewsletter`, `showSocial`, `showMap`, `showContact`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; newsletter integration; social integration; export.
- [ ] All 10+ variants render
- [ ] newsletter works
- [ ] social links functional.

## Technical Constraints

- No custom styling
- standard layouts only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; newsletter integration; social integration; export.

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

