# 2.27 Build Video Components

## Metadata

- **Task ID**: 2-27-build-video-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7, 2.1 (Hero Video)
- **Downstream Tasks**: (Tasks that consume this output)

## Context

10+ Video variants with playlists and analytics. L2.

**Enhanced Requirements:**

- **Variants:** Single Video, Video Gallery, Playlist, With Controls, Autoplay, Background Video, Embedded, With Captions, With Transcript, Minimal (10+ total)
- **Playlists:** Video playlists, next/previous navigation
- **Analytics:** View tracking, engagement metrics, completion rates

## Dependencies

- **Upstream Task**: 1.7 – required – prerequisite
- **Upstream Task**: 2.1 (Hero Video) – required – prerequisite
- **Package**: @repo/marketing-components – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 1.7, 2.1 (Hero Video)
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §2.1, §4.2, §2.2

## Related Files

- `packages/marketing-components/src/video/types.ts` – modify – (see task objective)
- `VideoSingle.tsx` – modify – (see task objective)
- `VideoGallery.tsx` – modify – (see task objective)
- `VideoPlaylist.tsx` – modify – (see task objective)
- `video/playlist.tsx` – modify – (see task objective)
- `video/analytics.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `VideoDisplay`, `VideoPlayer`. Props: `variant`, `videos` (array), `showPlaylist`, `autoplay`, `trackAnalytics`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; playlists; analytics; export.
- [ ] All 10+ variants render
- [ ] playlists work
- [ ] analytics track.

## Technical Constraints

- No custom video player
- HTML5 video only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; playlists; analytics; export.

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

