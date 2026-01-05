# Accessibility Audit - 2026-01-05

## Summary

Performed an accessibility review focused on navigation, search, and interactive UI components. The audit concentrated on keyboard accessibility, focus handling, labels, and ARIA semantics.

## Scope

- Global navigation (desktop + mobile)
- Search modal and `/search` page
- Contact form inputs
- Accordion UI component
- Primary marketing pages

## Checks Performed

- **Keyboard navigation:** Verified focusable controls and focus styles across navigation, search, and forms.
- **Focus management:** Confirmed modal search focuses the input on open and closes on Escape.
- **Labels & ARIA:** Reviewed form labels and added explicit ARIA attributes for accordions.
- **Color contrast:** Reviewed key text/background combinations for high-contrast themes.

## Fixes Applied

- Added `aria-expanded`, `aria-controls`, and labeled regions for accordion panels to improve screen reader navigation.
- Ensured the search modal maintains a clear focus entry point and descriptive labels.

## Follow-Up

- Run axe DevTools scans and screen reader checks in a live preview environment to validate against WCAG 2.1 AA.
- Capture any contrast or focus issues discovered in TODO.md if they require new remediation work.
