# 2.10 Build Contact Form Variants (Expanded)

## Metadata

- **Task ID**: 2-10-build-contact-form-variants-expanded
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 1.23 (Form), 1.2 (Button)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Contact Form variants with validation and integration. L2.

**Enhanced Requirements:**

- **Variants:** Standard, Minimal, With Map, With Office Info, Multi-Step, With File Upload, With Calendar, With Chat, Sidebar, Full Page (10+ total)
- **Validation:** Client-side validation, error messages, success states
- **Integration:** Email service, CRM integration, webhook support

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 1.23 (Form) – required – prerequisite
- **Upstream Task**: 1.2 (Button) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 1.23 (Form), 1.2 (Button)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2, form validation patterns

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

```typescript
// API surface (from task)
// `ContactForm`. Props: `variant`, `fields` (array), `onSubmit`, `showMap`, `showOfficeInfo`, `integrations`.

// Add usage examples per implementation
```

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

