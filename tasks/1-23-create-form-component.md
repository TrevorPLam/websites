# 1.23 Create Form Component

## Metadata

- **Task ID**: 1-23-create-form-component
- **Owner**: AGENT
- **Priority / Severity**: P1
- **Target Release**: TBD
- **Related Epics / ADRs**: Component Library Epic
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1-21-create-checkbox-component.md, 1-22-create-label-component.md, 1-20-create-radio-group-component.md
- **Downstream Tasks**: Tasks requiring form validation

## Context

Form wrapper with validation and error handling needed for robust form experiences. This is a Layer L2 component providing form validation integration with accessible error display.

## Dependencies

- **Package**: react-hook-form – required – provides form validation and state management
- **Package**: @hookform/resolvers – optional – for schema validation integration
- **Code**: packages/ui/src/components/Form.tsx – create – component implementation
- **Code**: packages/ui/src/index.ts – modify – export new component

## Cross-Task Dependencies & Sequencing

- **Upstream**: Checkbox, Label, Radio Group components must exist
- **Parallel Work**: Other primitive components in batch A
- **Downstream**: Contact forms, booking forms, admin interfaces

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-UI**: Radix UI primitives, React 19, ComponentRef — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-ui) for full research findings.
- **[2026-02-18] R-A11Y**: WCAG 2.2 AA, ARIA, touch targets, keyboard — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-a11y) for full research findings.
- **[2026-02-18] R-RADIX**: Radix component APIs — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-radix) for full research findings.
- **[2026-02-18] R-FORM**: React Hook Form, Zod, validation — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-form) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-UI](RESEARCH-INVENTORY.md#r-ui) — Full research findings
- [RESEARCH-INVENTORY.md - R-A11Y](RESEARCH-INVENTORY.md#r-a11y) — Full research findings
- [RESEARCH-INVENTORY.md - R-RADIX](RESEARCH-INVENTORY.md#r-radix) — Full research findings
- [RESEARCH-INVENTORY.md - R-FORM](RESEARCH-INVENTORY.md#r-form) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- `packages/ui/src/components/Form.tsx` – create – component implementation
- `packages/ui/src/index.ts` – modify – export Form components

## Code Snippets / Examples

### Related Patterns
- See [R-UI - Research Findings](RESEARCH-INVENTORY.md#r-ui) for additional examples
- See [R-A11Y - Research Findings](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-RADIX - Research Findings](RESEARCH-INVENTORY.md#r-radix) for additional examples
- See [R-FORM - Research Findings](RESEARCH-INVENTORY.md#r-form) for additional examples

## Acceptance Criteria

- [ ] Component exports from packages/ui correctly
- [ ] Integrates with React Hook Form
- [ ] Supports schema validation (Zod)
- [ ] Accessible error messages
- [ ] Form field composition works
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## Technical Constraints

- Use React Hook Form or Zod only (no custom validation libraries)
- Must integrate with existing form controls (Input, Checkbox, etc.)
- Follow existing component patterns in the repo
- Support both controlled and uncontrolled forms

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for WCAG 2.2 AA expectations; follow ARIA patterns for form validation and error announcements
- Performance: Efficient validation and minimal re-renders
- Error: Clear, accessible error messages with proper association

## Implementation Plan

- [ ] Install and import react-hook-form and resolvers
- [ ] Create Form component suite with forwarding refs
- [ ] Add React Hook Form integration
- [ ] Add schema validation support
- [ ] Add TypeScript types for all components
- [ ] Export components from index.ts
- [ ] Run typecheck and build to verify

## Testing Requirements

- Unit tests for component rendering with different props
- Accessibility tests with axe-core
- Form validation tests
- Error message display tests
- Schema validation integration tests
- Run `pnpm --filter @repo/ui test`; `pnpm test` to verify

## Documentation Updates

- [ ] Update [docs/components/ui-library.md](docs/components/ui-library.md) – add Form component
- [ ] Update packages/ui exports – ensure Form is in index

## Design References

- React Hook Form documentation for API reference
- ARIA Form Pattern for accessibility guidelines

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Component builds successfully
- [ ] Export available in packages/ui
