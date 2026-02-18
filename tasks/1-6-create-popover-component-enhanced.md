# 1.6 Create Popover Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19)

**Objective:** Rich interactive overlay with advanced positioning and composition. Click-outside dismissal, focus management. Layer L2. WCAG 2.2 Dialog pattern.

**Enhanced Requirements:**

- **Modes:** Modal, non-modal (2 total)
- **Positions:** All 12 positions (same as Tooltip)
- **Collision Detection:** Auto-adjust when near viewport edges
- **Slots:** Header, body, footer slots for composition
- **Nested Popovers:** Support for popovers within popovers
- **Animations:** Fade, slide, scale, zoom (4 animation types)
- **Arrow:** Optional arrow with positioning
- **Focus Management:** Focus trap in modal mode, return focus on close
- **Accessibility:** Full ARIA support, keyboard navigation, escape to close

**Files:** Create `packages/ui/src/components/Popover.tsx`, `popover/types.ts`, `popover/hooks.ts`; update `index.ts`.

**API:** `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverArrow`, `PopoverClose`, `PopoverHeader`, `PopoverBody`, `PopoverFooter`. Props: `side`, `align`, `modal`, `collisionPadding`, `animation`.

**Checklist:**

- 1.6a: Create base Popover with Radix UI (2h)
- 1.6b: Add collision detection and positioning (2h)
- 1.6c: Add slot system for composition (2h)
- 1.6d: Add nested popover support and animations (2h)
- Import from radix-ui; modal/non-modal modes; export; a11y tests.

**Done:** Builds; trigger works; modal focus trap; collision detection; slots functional; nested popovers; animations smooth.
**Anti:** No complex forms (use Dialog); stop at Radix foundation.

---

### UI Primitives (New 1.7–1.50)
