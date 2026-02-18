# 2.27 Build Video Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 16h | **Deps:** 1.7, 2.1 (Hero Video)

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 10+ Video variants with playlists and analytics. L2.

**Requirements:**

- **Variants:** Single Video, Video Gallery, Playlist, With Controls, Autoplay, Background Video, Embedded, With Captions, With Transcript, Minimal (10+ total)
- **Playlists:** Video playlists, next/previous navigation
- **Analytics:** View tracking, engagement metrics, completion rates

**Files:** `packages/marketing-components/src/video/types.ts`, `VideoSingle.tsx`, `VideoGallery.tsx`, `VideoPlaylist.tsx`, `video/playlist.tsx`, `video/analytics.tsx`, `index.ts`

**API:** `VideoDisplay`, `VideoPlayer`. Props: `variant`, `videos` (array), `showPlaylist`, `autoplay`, `trackAnalytics`.

**Checklist:** Types; variants; playlists; analytics; export.
**Done:** All 10+ variants render; playlists work; analytics track.
**Anti:** No custom video player; HTML5 video only.

---
