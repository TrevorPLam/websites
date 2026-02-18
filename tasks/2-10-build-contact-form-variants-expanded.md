# 2.10 Build Contact Form Variants (Expanded)

## Metadata

- **Task ID**: 2-10-build-contact-form-variants-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: @repo/marketing-components (exists), 1.23 (Form), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Contact Form variants with validation and integration. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Map, With Office Info, Multi-Step, With File Upload, With Calendar, With Chat, Sidebar, Full Page (10+ total)
- **Validation:** Client-side validation, error messages, success states
- **Integration:** Email service, CRM integration, webhook support

## Dependencies

- **Upstream Task**: @repo/marketing-components (exists) – required
- **Upstream Task**: 1.23 (Form) – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.23 (Form), 1.2 (Button); marketing-components exists
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-FORM**: React Hook Form, Zod, validation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-form) for full research findings.
- **[2026-02-18] R-MARKETING**: Hero, menu, pricing, testimonials, FAQ, sections — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-marketing) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-FORM](RESEARCH-INVENTORY.md#r-form) — Full research findings
- [RESEARCH-INVENTORY.md - R-MARKETING](RESEARCH-INVENTORY.md#r-marketing) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/marketing-components/src/contact/types.ts` – modify – (see task objective)
- `ContactFormStandard.tsx` – modify – (see task objective)
- `ContactFormMinimal.tsx` – modify – (see task objective)
- `ContactFormWithMap.tsx` – modify – (see task objective)
- `ContactFormMultiStep.tsx` – modify – (see task objective)
- `ContactFormWithUpload.tsx` – modify – (see task objective)
- `contact/validation.tsx` – modify – (see task objective)
- `contact/integration.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

### Related Patterns
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-FORM - Research Findings](RESEARCH-INVENTORY.md#r-form) for additional examples
- See [R-MARKETING - Research Findings](RESEARCH-INVENTORY.md#r-marketing) for additional examples

## Acceptance Criteria

- [ ] Types; variants; validation; integration; export.
- [ ] All 10+ variants render
- [ ] validation works
- [ ] integrations functional
- [ ] accessible.

## Technical Constraints

- No custom field types
- standard inputs only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; validation; integration; export.

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

