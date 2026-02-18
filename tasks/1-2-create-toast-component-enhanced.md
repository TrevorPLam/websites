# 1.2 Create Toast Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §3.1 (React 19), §4.2 (INP), §2.2 (shadcn/ui), §7.1 (pnpm catalog)

**Objective:** Non-blocking notification system with extensive customization. Sonner integration at L2 (@repo/ui). Current usage: `packages/features/src/booking/components/BookingForm.tsx` line 29.

**Enhanced Requirements:**

- **Variants:** success, error, warning, info, loading, custom (6 total)
- **Positions:** top-left, top-center, top-right, bottom-left, bottom-center, bottom-right (6 total)
- **Actions:** Action buttons, close button, dismiss on click, swipe to dismiss
- **Custom Content:** Rich HTML, icons, images, progress bars
- **Duration:** Auto-dismiss (configurable), persistent, manual dismiss
- **Queue Management:** Max visible toasts, stacking behavior, priority system
- **Animations:** Slide, fade, scale, bounce (4 animation types)
- **Accessibility:** ARIA live regions, keyboard navigation, screen reader announcements

**Files:** Create `packages/ui/src/components/Toast.tsx`, `Toaster.tsx`, `toast/types.ts`, `toast/hooks.ts`; update `index.ts`.

**API:** `Toaster(props?)`, `toast.success/error/warning/info/loading/custom`, `toast.promise(promise, {loading, success, error})`, `toast.dismiss(id)`, `toast.dismissAll()`, `useToast()`

**Checklist:**

- 1.2a: Create Toast base component with variant system (3h)
- 1.2b: Add position system and queue management (2h)
- 1.2c: Add actions and custom content support (2h)
- 1.2d: Add animations and accessibility features (1h)
- Add sonner to @repo/ui via catalog; create Toaster + Toast; export; migrate BookingForm import.

**Done:** Builds; all variants work; positions configurable; actions functional; animations smooth; a11y compliant; BookingForm uses @repo/ui.
**Anti:** No custom queue beyond sonner's built-in; no persistence across sessions; stop at sonner foundation.

---
