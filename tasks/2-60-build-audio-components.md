# 2.28 Build Audio Components

## Metadata

- **Task ID**: 2-28-build-audio-components
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 1.7
- **Downstream Tasks**: (Tasks that consume this output)

## Context

6+ Audio variants with waveforms and transcripts. L2.

**Enhanced Requirements:**

- **Variants:** Single Audio, Playlist, With Waveform, With Transcript, With Controls, Minimal (6+ total)
- **Waveforms:** Audio waveform visualization, progress indicator
- **Transcripts:** Audio transcripts, synchronized highlighting

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

- `packages/marketing-components/src/audio/types.ts` – modify – (see task objective)
- `AudioPlayer.tsx` – modify – (see task objective)
- `AudioPlaylist.tsx` – modify – (see task objective)
- `AudioWithWaveform.tsx` – modify – (see task objective)
- `audio/waveform.tsx` – modify – (see task objective)
- `audio/transcript.tsx` – modify – (see task objective)
- `index.ts` – modify – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `AudioDisplay`, `AudioPlayer`. Props: `variant`, `audio` (array), `showWaveform`, `showTranscript`, `autoplay`.

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Types; variants; waveforms; transcripts; export.
- [ ] All 6+ variants render
- [ ] waveforms display
- [ ] transcripts show.

## Technical Constraints

- No custom audio processing
- HTML5 audio only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] Types; variants; waveforms; transcripts; export.

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

