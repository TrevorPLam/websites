# 3.5 ContactPageTemplate

## Metadata

- **Task ID**: 3-5-contactpagetemplate
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Each template reads siteConfig.pages.<page>.sections, renders composePage. Registers sections in registry.

## Dependencies

- **Upstream Task**: 3.1 + respective features (2.1 – required – prerequisite
- **Upstream Task**: 2.2 – required – prerequisite
- **Upstream Task**: 2.3/2.17 – required – prerequisite
- **Upstream Task**: 2.10/2.13 – required – prerequisite
- **Upstream Task**: 2.14 – required – prerequisite
- **Upstream Task**: 2.14 – required – prerequisite
- **Upstream Task**: 2.12) – required – prerequisite

## Cross-Task Dependencies & Sequencing

- **Upstream**: 3.1 + respective features (2.1, 2.2, 2.3/2.17, 2.10/2.13, 2.14, 2.14, 2.12)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

### Primary Research Topics
- **[2026-02-18] R-NEXT**: App Router, RSC, Server Actions — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-next) for full research findings.
- **[2026-02-18] R-CMS**: Content adapters, MDX, pagination — see [RESEARCH-INVENTORY.md](RESEARCH-INVENTORY.md#r-cms) for full research findings.

### Key Findings

Research findings are available in the referenced RESEARCH-INVENTORY.md sections.

### References
- [RESEARCH-INVENTORY.md - R-NEXT](RESEARCH-INVENTORY.md#r-next) — Full research findings
- [RESEARCH-INVENTORY.md - R-CMS](RESEARCH-INVENTORY.md#r-cms) — Full research findings
- [RESEARCH.md](RESEARCH.md) — Additional context

## Related Files

- (Add file paths)

## Code Snippets / Examples

### Related Patterns
- See [R-NEXT - Research Findings](RESEARCH-INVENTORY.md#r-next) for additional examples
- See [R-CMS - Research Findings](RESEARCH-INVENTORY.md#r-cms) for additional examples

## Acceptance Criteria

- [ ] Register sections; create Template.tsx; use composePage; export.
- [ ] Template renders
- [ ] config-driven sections.

## Technical Constraints

- No hardcoded industry content
- all from config.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Register sections; create Template.tsx; use composePage; export.

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

