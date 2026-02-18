# 1.5 Create Tooltip Component (Enhanced)

**Status:** [ ] TODO | **Batch:** A | **Effort:** 8h | **Deps:** None

**Related Research:** §2.2 (Radix UI), §3.1 (React 19), WCAG 1.4.13

**Objective:** Small popup on hover/focus with extensive positioning and customization. Layer L2. WCAG 2.2 1.4.13 compliance.

**Enhanced Requirements:**

- **Positions:** top, top-start, top-end, bottom, bottom-start, bottom-end, left, left-start, left-end, right, right-start, right-end (12 total)
- **Trigger Modes:** hover, focus, click, manual (4 total)
- **Rich Content:** Icons, formatted text, links (accessible)
- **Delays:** Show delay, hide delay (configurable)
- **Collision Detection:** Auto-adjust position when near viewport edge
- **Animations:** Fade, slide, scale (3 animation types)
- **Arrow:** Optional arrow pointing to trigger
- **Accessibility:** WCAG 1.4.13 compliance (hoverable, dismissible), ARIA attributes, keyboard support

**Files:** Create `packages/ui/src/components/Tooltip.tsx`, `tooltip/types.ts`, `tooltip/hooks.ts`; update `index.ts`.

**API:** `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipArrow`. Props: `side`, `align`, `sideOffset`, `alignOffset`, `delayDuration`, `disableHoverableContent`, `collisionPadding`.

**Checklist:**

- 1.5a: Create base Tooltip with Radix UI (2h)
- 1.5b: Add all 12 position variants (2h)
- 1.5c: Add multiple trigger modes (2h)
- 1.5d: Add rich content support and animations (2h)
- Import from radix-ui; provider for delay; WCAG 1.4.13 (hoverable, dismissible); export.

**Done:** Builds; all positions work; hover/focus/click triggers; rich content displays; escape dismissal; collision detection; animations smooth.
**Anti:** Rich HTML limited to accessible patterns; text-only fallback for screen readers.

---
