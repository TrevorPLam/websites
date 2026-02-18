<!--
@file docs/accessibility/component-a11y-rubric.md
@role reference
@summary WCAG 2.2 AA accessibility checklist for all UI components in this monorepo.
@invariants
  - All criteria align with WCAG 2.2 AA (W3C, 2023)
  - Each criterion is testable with axe-core, @testing-library, or manual audit
  - Rubric applies to every component in @repo/ui, @repo/features, @repo/marketing-components
@gotchas
  - WCAG 2.5.8 (touch targets) is new in 2.2 — minimum 24×24 CSS px, not 44×44
  - Focus-visible contrast (3:1) is separate from text contrast (4.5:1 normal, 3:1 large)
  - prefers-reduced-motion must suppress CSS transitions AND JS-driven animations
@verification pnpm test (jest-axe), manual keyboard walkthrough, screen reader spot-check
@status active
-->

# Component Accessibility Rubric

**Standard:** WCAG 2.2 Level AA
**Last Updated:** 2026-02-18
**Applies to:** All components in `@repo/ui`, `@repo/features`, `@repo/marketing-components`

Reference this rubric in every UI task's Acceptance Criteria. Every shipped component must pass all applicable criteria before the task is marked Done.

---

## How to Use This Rubric

1. **Identify applicable criteria** — not every criterion applies to every component (e.g., "Live Regions" only applies to dynamic content).
2. **Test with axe-core** — automated checks (`jest-axe` in unit tests) cover ~30–40% of WCAG criteria.
3. **Manual keyboard walkthrough** — tab through the component; verify every interactive element is reachable and operable without a mouse.
4. **Screen reader spot-check** — VoiceOver (macOS/iOS) or NVDA (Windows) for complex widgets.
5. **Mark each criterion** `[x]` when verified; leave a note if deferred.

---

## Section 1 — Keyboard Navigation (WCAG 2.1)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 1.1 | All interactive elements are reachable via Tab / Shift+Tab | 2.1.1 | Keyboard walk |
| 1.2 | No keyboard trap — user can always Tab out | 2.1.2 | Keyboard walk |
| 1.3 | Custom widgets use standard keyboard patterns (arrows for listbox/menu, Enter/Space to activate, Escape to close) | 2.1.1 | Keyboard walk + WAI-ARIA APG |
| 1.4 | Roving `tabindex` used inside composite widgets (menu, toolbar, listbox) so only one element in the group is in the tab sequence | 2.1.1 | DOM inspection |
| 1.5 | Keyboard shortcuts do not conflict with AT or browser shortcuts; if single-character shortcuts exist, they can be remapped or disabled | 2.1.4 | Manual |

**Implementation pattern (roving tabindex):**
```tsx
// All items start tabIndex={-1}; only the active item gets tabIndex={0}
<li role="menuitem" tabIndex={isActive ? 0 : -1} onKeyDown={handleArrow}>
```

---

## Section 2 — Focus Visibility (WCAG 2.4, 2.5)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 2.1 | Focus indicator is visible on every interactive element | 2.4.7 | Keyboard walk |
| 2.2 | Focus indicator has ≥ 2 CSS px outline **and** ≥ 3:1 contrast ratio against adjacent background | 2.4.11 | Colour Contrast Analyzer |
| 2.3 | Focus indicator is not clipped by `overflow: hidden` (use `outline`, not `border`) | 2.4.11 | DOM/visual |
| 2.4 | Focus order matches visual/logical reading order | 2.4.3 | Keyboard walk |
| 2.5 | On focus, content does not scroll or move unexpectedly so the focused element is obscured | 2.4.12 | Keyboard walk |

**Standard focus ring (Tailwind):**
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

> `ring-ring` must resolve to a colour with ≥ 3:1 contrast ratio against the component's background in both light and dark themes.

---

## Section 3 — Touch Targets (WCAG 2.5)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 3.1 | All interactive targets are ≥ 24 × 24 CSS px (minimum per WCAG 2.2 §2.5.8) | 2.5.8 | DevTools ruler / Playwright |
| 3.2 | Preferred minimum is 44 × 44 CSS px for primary actions (buttons, links) | Best practice | DevTools |
| 3.3 | Targets smaller than 24 × 24 px have ≥ 24 px spacing from other targets (offset exception) | 2.5.8 | DevTools |
| 3.4 | Dragging movements (sliders, sortable lists) have a single-pointer alternative (click/tap steps) | 2.5.7 | Keyboard / single-pointer walk |

**Minimum size pattern:**
```tsx
// Button — min-h enforces 44px touch target height
className="min-h-[44px] px-4 ..."

// Icon-only button — must be at least 44×44px
className="min-h-[44px] min-w-[44px] ..."
```

---

## Section 4 — Colour & Contrast (WCAG 1.4)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 4.1 | Normal text (< 18 pt / < 14 pt bold): ≥ 4.5:1 contrast ratio | 1.4.3 | axe-core / CCA |
| 4.2 | Large text (≥ 18 pt / ≥ 14 pt bold): ≥ 3:1 contrast ratio | 1.4.3 | axe-core / CCA |
| 4.3 | UI components and graphical objects: ≥ 3:1 contrast ratio against adjacent colours | 1.4.11 | CCA |
| 4.4 | Colour is never the **sole** means of conveying information (e.g., error states also use icon/text) | 1.4.1 | Visual inspection |
| 4.5 | Text does not get lost when background images/gradients are used (ensure text overlay has sufficient contrast) | 1.4.3 | CCA |

**axe-core check in jest:**
```tsx
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  expect(await axe(container)).toHaveNoViolations();
});
```

---

## Section 5 — ARIA & Semantics (WCAG 1.3, 4.1)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 5.1 | Native HTML semantics used where possible (`<button>`, `<nav>`, `<main>`, `<dialog>`) before adding ARIA | 1.3.1 | DOM inspection |
| 5.2 | Every form control has an associated `<label>` (via `for`/`id`, `aria-label`, or `aria-labelledby`) | 1.3.1 | axe-core |
| 5.3 | Required fields use `aria-required="true"` in addition to visual indicator | 1.3.1 | axe-core |
| 5.4 | Error messages are associated with their input via `aria-describedby` | 1.3.1 | axe-core |
| 5.5 | Roles, states, and properties are valid per WAI-ARIA 1.2 (no invalid role/property combos) | 4.1.2 | axe-core |
| 5.6 | ARIA `id` references (`aria-labelledby`, `aria-describedby`, `aria-controls`) point to existing DOM elements | 4.1.2 | axe-core |
| 5.7 | Dialog/modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title, focus locked inside | 4.1.2 | axe-core + keyboard |
| 5.8 | Lists rendered as `<ul>`/`<ol>` with `<li>` children, or `role="list"` + `role="listitem"` | 1.3.1 | axe-core |

**Dialog pattern (Radix):**
```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content aria-labelledby="dialog-title" aria-describedby="dialog-desc">
      <Dialog.Title id="dialog-title">Title</Dialog.Title>
      <Dialog.Description id="dialog-desc">Description</Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## Section 6 — Live Regions & Dynamic Content (WCAG 4.1)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 6.1 | Status messages (toasts, form feedback, loading states) use `role="status"` (polite) or `role="alert"` (assertive) | 4.1.3 | Screen reader / axe |
| 6.2 | Loading spinners announce "Loading…" to AT; completion is also announced | 4.1.3 | Screen reader |
| 6.3 | Content injected after user action is either focused or announced via live region | 4.1.3 | Screen reader |
| 6.4 | Live regions are not abused — use `aria-live="assertive"` only for critical errors, not routine updates | 4.1.3 | Code review |

**Live region pattern:**
```tsx
// Toast — Sonner uses role="status" internally; confirm it fires
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// Error alert
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## Section 7 — Motion & Animation (WCAG 2.3)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 7.1 | All animations and transitions respect `prefers-reduced-motion: reduce` | 2.3.3 | DevTools emulation |
| 7.2 | No content flashes more than 3 times per second | 2.3.1 | Photosensitivity test tool |
| 7.3 | Parallax, auto-scroll, and looping animations can be paused or stopped | 2.2.2 | Manual |

**Reduced-motion pattern (Tailwind):**
```tsx
// Always add motion-safe/motion-reduce variants for transitions
className="transition-opacity motion-reduce:transition-none"

// Or target in CSS
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React hook:**
```tsx
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return prefersReducedMotion;
}
```

---

## Section 8 — Images & Media (WCAG 1.1, 1.2)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 8.1 | Informative images have descriptive `alt` text | 1.1.1 | axe-core |
| 8.2 | Decorative images use `alt=""` (empty string) and/or `aria-hidden="true"` | 1.1.1 | axe-core |
| 8.3 | Complex images (charts, diagrams) have extended description (via `aria-describedby` or adjacent text) | 1.1.1 | Manual |
| 8.4 | Icon-only buttons have `aria-label` describing the action | 4.1.2 | axe-core |
| 8.5 | SVG icons used as content have `role="img"` and `aria-label` or `<title>` | 1.1.1 | axe-core |
| 8.6 | Video content has captions; audio has transcript | 1.2.2 | Manual |

**Icon button pattern:**
```tsx
<button aria-label="Close dialog" type="button">
  <XIcon aria-hidden="true" />
</button>
```

---

## Section 9 — Forms & Validation (WCAG 1.3, 3.3)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 9.1 | Labels are visible (not placeholder-only) | 3.3.2 | Visual |
| 9.2 | Error messages are specific and actionable ("Email is required" not "Invalid") | 3.3.1 | Manual |
| 9.3 | On validation error, focus moves to first error or error summary | 3.3.1 | Keyboard walk |
| 9.4 | Autocomplete attributes are set for common fields (name, email, tel, address) | 1.3.5 | HTML inspection |
| 9.5 | Timeout warnings (session) give user at least 20 seconds to extend | 2.2.1 | Manual |

---

## Section 10 — Landmark Regions & Page Structure (WCAG 1.3, 2.4)

| # | Criterion | WCAG SC | Test Method |
|---|-----------|---------|-------------|
| 10.1 | Page has exactly one `<main>` landmark | 1.3.6 | axe-core |
| 10.2 | Navigation regions use `<nav>` with unique `aria-label` when multiple navs exist | 2.4.1 | axe-core |
| 10.3 | Headings are logically ordered (h1 → h2 → h3); no skipped levels within a section | 1.3.1 | axe-core |
| 10.4 | Skip-navigation link is the first focusable element on the page | 2.4.1 | Keyboard walk |
| 10.5 | Page `<title>` is unique and describes current context | 2.4.2 | Manual |

---

## Quick Reference — Test Commands

```bash
# Run axe-core via jest-axe (all component unit tests)
pnpm test

# Type-check (catches missing aria-* prop types)
pnpm type-check

# Full lint (includes jsx-a11y rules from eslint-config)
pnpm lint
```

### Manual test checklist (per component)

- [ ] Tab through without mouse — every interactive element is reachable
- [ ] Shift+Tab works in reverse
- [ ] Enter/Space activates buttons and checkboxes
- [ ] Escape closes modals, dropdowns, tooltips
- [ ] Screen reader announces element role, name, and state
- [ ] Colour contrast passes with Colour Contrast Analyzer
- [ ] Zoom to 200% — no content lost or overlapping
- [ ] `prefers-reduced-motion: reduce` emulated — no animations fire

---

## WCAG 2.2 Reference Map

| Success Criterion | Level | Topic |
|---|---|---|
| 1.1.1 Non-text Content | A | Alt text |
| 1.3.1 Info and Relationships | A | Semantics |
| 1.3.5 Identify Input Purpose | AA | Autocomplete |
| 1.4.1 Use of Colour | A | Colour alone |
| 1.4.3 Contrast (Minimum) | AA | Text contrast |
| 1.4.11 Non-text Contrast | AA | UI component contrast |
| 2.1.1 Keyboard | A | Keyboard access |
| 2.1.2 No Keyboard Trap | A | Focus trap prevention |
| 2.2.2 Pause, Stop, Hide | A | Moving content |
| 2.3.1 Three Flashes | A | Seizure prevention |
| 2.4.3 Focus Order | A | Tab order |
| 2.4.7 Focus Visible | AA | Visible focus |
| 2.4.11 Focus Appearance | AA | Focus indicator quality |
| 2.4.12 Focus Not Obscured | AA | Focus not hidden |
| 2.5.7 Dragging Movements | AA | Drag alternatives |
| 2.5.8 Target Size (Minimum) | AA | 24×24 px touch targets |
| 3.3.1 Error Identification | A | Form errors |
| 3.3.2 Labels or Instructions | A | Form labels |
| 4.1.2 Name, Role, Value | A | ARIA correctness |
| 4.1.3 Status Messages | AA | Live regions |
