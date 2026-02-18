# 2.28 Build Audio Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 6+ Audio variants with waveforms and transcripts. L2.

**Requirements:**

- **Variants:** Single Audio, Playlist, With Waveform, With Transcript, With Controls, Minimal (6+ total)
- **Waveforms:** Audio waveform visualization, progress indicator
- **Transcripts:** Audio transcripts, synchronized highlighting

**Files:** `packages/marketing-components/src/audio/types.ts`, `AudioPlayer.tsx`, `AudioPlaylist.tsx`, `AudioWithWaveform.tsx`, `audio/waveform.tsx`, `audio/transcript.tsx`, `index.ts`

**API:** `AudioDisplay`, `AudioPlayer`. Props: `variant`, `audio` (array), `showWaveform`, `showTranscript`, `autoplay`.

**Checklist:** Types; variants; waveforms; transcripts; export.
**Done:** All 6+ variants render; waveforms display; transcripts show.
**Anti:** No custom audio processing; HTML5 audio only.

---
