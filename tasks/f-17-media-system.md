# F.17 Media System

## Metadata

- **Task ID**: f-17-media-system
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: F.16
- **Downstream Tasks**: (Tasks that consume this output)

## Context

Media system for video, audio, and other media types.

## Dependencies

- **Upstream Task**: F.16 – required – prerequisite
- **Package**: @repo/infrastructure – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: F.16
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **[2026-02-18] RESEARCH.md**: Section Reference Index — § codes resolve to sections; see RESEARCH.md.
- **[2026-02-18] tasks/RESEARCH-INVENTORY.md**: Topic-specific research (R-UI, R-A11Y, R-MARKETING, R-PERF, etc.) directs implementation; see inventory for this task's topics.

## Related Files

- `packages/infrastructure/media/index` – create – (see task objective)
- `packages/infrastructure/media/video.ts` – create – (see task objective)
- `packages/infrastructure/media/audio.ts` – create – (see task objective)
- `packages/infrastructure/media/utils.ts` – create – (see task objective)
- `packages/infrastructure/media/hooks.ts` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `MediaPlayer`, `useMedia`, `VideoPlayer`, `AudioPlayer`, `MediaConfig`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Media components; video; audio; utilities; export.
- [ ] Builds
- [ ] media system functional
- [ ] video works
- [ ] audio works.

## Technical Constraints

- No custom media engine
- HTML5 media only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Media components; video; audio; utilities; export.

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

