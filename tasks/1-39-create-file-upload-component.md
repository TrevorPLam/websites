# 1.39 Create File Upload Component

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), file upload patterns

**Objective:** File upload with drag-and-drop and preview. Layer L2.

**Files:** Create `packages/ui/src/components/FileUpload.tsx`; update `index.ts`.

**API:** `FileUpload`, `FileUploadTrigger`, `FileUploadList`, `FileUploadItem`. Props: `accept`, `multiple` (boolean), `maxSize`, `maxFiles`, `onUpload`, `preview` (boolean).

**Checklist:** Create FileUpload component; add drag-and-drop; add file preview; add progress indicator; export; type-check; build.
**Done:** Builds; file selection works; drag-and-drop functional; preview displays; progress shows.
**Anti:** No actual upload implementation; file handling only.

---
