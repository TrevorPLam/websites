# 1.8 Create Avatar Component

## Metadata

- **Task ID**: 1-8-create-avatar-component
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: None
- **Downstream Tasks**: (Tasks that consume this output)

## Context

User avatar with image, fallback, and status indicator. Layer L2.

## Dependencies

- **Package**: @repo/ui – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: None
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.2 (Radix UI), §3.1 (React 19)

## Related Files

- `packages/ui/src/components/Avatar.tsx` – create – (see task objective)
- `index.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `Avatar`, `AvatarImage`, `AvatarFallback`. Props: `size` (sm, md, lg, xl), `status` (online, offline, away, busy), `shape` (circle, square).

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Import Avatar from radix-ui; add status indicator; export; type-check; build.
- [ ] Builds
- [ ] image/fallback work
- [ ] status indicators display.

## Technical Constraints

- No custom status colors
- stop at Radix.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Import Avatar from radix-ui; add status indicator; export; type-check; build.

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

