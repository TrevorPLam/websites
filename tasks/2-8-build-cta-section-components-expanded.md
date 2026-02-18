# 2.8 Build CTA Section Components (Expanded)

## Metadata

- **Task ID**: 2-8-build-cta-section-components-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ CTA Section variants with A/B testing support. L2.

**Enhanced Requirements:**

- **Variants:** Centered, Split, With Image, With Video, With Form, Minimal, Bold, With Stats, With Testimonials, Sidebar (10+ total)
- **A/B Testing:** Variant selection, conversion tracking, analytics integration
- **Composition:** CTA sections with headline, description, primary CTA, secondary CTA, image/video, form

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.2 (Button); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/marketing-components/src/cta/types.ts` – modify – (see task objective)
- `CTACentered.tsx` – modify – (see task objective)
- `CTASplit.tsx` – modify – (see task objective)
- `CTAWithImage.tsx` – modify – (see task objective)
- `CTAWithVideo.tsx` – modify – (see task objective)
- `CTAWithForm.tsx` – modify – (see task objective)
- `cta/ab-testing.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `CTASection`. Props: `variant`, `headline`, `description`, `primaryCta`, `secondaryCta`, `image`, `video`, `form`, `abTestVariant`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; A/B testing integration; export.
- [ ] All 10+ variants render
- [ ] A/B testing functional
- [ ] conversion tracking works.

## Technical Constraints

- No analytics provider integration
- basic tracking only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; A/B testing integration; export.

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

