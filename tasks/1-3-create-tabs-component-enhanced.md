# 1.3 Create Tabs Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), §4.2 (INP)

**Objective:** Tabbed content with accessible tablist, roving focus, and extensive customization. Layer L2 (@repo/ui).

**Enhanced Requirements:**

- **Variants:** default, underline, pills, enclosed, soft (5 total)
- **Sizes:** sm, md, lg, xl (4 total)
- **Orientations:** horizontal, vertical (2 total)
- **URL Sync:** Hash-based and query parameter sync
- **Nested Tabs:** Support for tabs within tabs
- **Scrollable:** Horizontal/vertical scrolling for many tabs
- **Icons:** Icon support in triggers
- **Animations:** Smooth transitions, indicator animations
- **Accessibility:** Full keyboard navigation, ARIA attributes, focus management

**Files:** Create `packages/ui/src/components/Tabs.tsx`, `tabs/types.ts`, `tabs/hooks.ts`; update `index.ts`. Import from unified `radix-ui`.

**API:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `TabsIndicator`. Props: `orientation`, `activationMode`, `variant`, `size`, `syncWithUrl`, `scrollable`, `nested`.

**Checklist:**

- 1.3a: Create base Tabs component with Radix UI (2h)
- 1.3b: Add variant system and sizes (2h)
- 1.3c: Add URL sync functionality (2h)
- 1.3d: Add nested tabs and scrollable support (2h)
- Import Tabs from radix-ui; CVA variants; prefers-reduced-motion; export; type-check; build.

**Done:** Builds; all variants render; keyboard nav works; URL sync functional; nested tabs work; scrollable tabs; controlled/uncontrolled.
**Anti:** No framer-motion animations (use CSS transitions); URL sync limited to hash/query params.

---
