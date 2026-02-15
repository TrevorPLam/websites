# Accessibility Audit (Task 0.7)

**Status:** In progress (automated scan plan written; execution pending)

**Last Updated:** 2026-02-15

## Scope

- Template: `templates/hair-salon`
- Target pages: `/` (home), `/services`, `/services/haircuts`, `/services/coloring`, `/services/treatments`,
  `/services/special-occasions`, `/services/bridal`, `/pricing`, `/gallery`, `/team`, `/about`, `/blog`,
  `/contact`, `/book`, `/search`, `/privacy`, `/terms`
- Components: @repo/ui primitives (focus states, ARIA), modals/dialogs, forms (booking/contact), navigation,
  search dialog.

## Tooling

- Automated: `pa11y` (CLI) + `axe-core` via `@axe-core/playwright` (recommended to add to devDependencies for
  repeatable runs)
- Manual checks: keyboard-only navigation, focus visibility, modal focus trap, form error annunciation, target
  sizes, color contrast (WCAG 2.2 AA)

## Proposed commands (non-destructive)

```bash
# Install dev deps if not present
pnpm add -D pa11y @axe-core/playwright playwright chromium

# Example pa11y sweep (desktop viewport)
pa11y http://localhost:3100/ --standard WCAG2AA --viewport 1280x720

# Axe via Playwright (headless) — script to create later
node scripts/a11y-scan.js
```

## Current results

- 2026-02-15 (home page, desktop): pa11y (WCAG2AA) — **PASS** after contrast fix (primary color darkened to
  `hsl(174 100% 26%)`).
- Prior failure: contrast ratio 3.41:1 on “Learn More” links and primary CTA; resolved by updating `theme.colors.primary`
  in `templates/hair-salon/site.config.ts`.
- 2026-02-15 route sweep (desktop): **PASS** on `/services`, `/services/haircuts`, `/services/coloring`,
  `/services/treatments`, `/services/special-occasions`, `/services/bridal`, `/pricing`.
- `/gallery`: initial fail (contrast on hero h1). Fixed by switching heading to `text-white`; now **PASS**.

## Checklist (WCAG 2.2 AA)

- [ ] Keyboard: All interactive elements reachable and operable via keyboard
- [ ] Focus: Visible focus states, focus order logical, focus trap in dialogs/search
- [ ] Forms: Labels, descriptions, error messaging, `aria-invalid`, success/failure annunciation
- [ ] Color/contrast: Text, icons, focus indicators meet AA
- [ ] Media: Images have alt; decorative images are `aria-hidden`
- [ ] Motion: Reduced motion respected (if animations present)
- [ ] Landmarks: Proper use of `main`, `nav`, `header`, `footer`, `section`
- [ ] Headings: Logical hierarchy
- [ ] Tables: Proper header associations (if any)
- [ ] ARIA: No `aria-*` misuse; names/roles/values correct
- [ ] Responsiveness: Touch targets ≥44x44 px; no horizontal scroll on mobile

## Next actions

- Spin up the app locally (`pnpm --filter @templates/websites dev --port 3100`) and run pa11y against the route list.
- Capture findings per page and log issues in this doc with severity/criterion.
- Propose code fixes for any critical blockers (especially forms, navigation, modal focus).

## Deliverables for completion

- Completed checklist with noted gaps (if any)
- Stored scan outputs (pa11y/axe) or summarized findings
- Recommendations and follow-up fixes (or confirmation of clean pass)
