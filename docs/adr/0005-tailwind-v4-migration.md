# ADR 0005: Tailwind CSS v4 Migration

**Status:** Accepted  
**Date:** 2026-02-15  
**Task:** 0.4 (user override — migrate now)

## Context

Tailwind CSS v4.0 (January 2025) is a ground-up rewrite with CSS-first configuration, removal of `tailwind.config.js`, and `@theme` directive replacing presets. Evaluation doc (docs/evaluation/tailwind-v4-migration.md) recommended DEFER, but user requested immediate migration.

## Decision

1. **Upgrade to Tailwind v4.1** across `templates/hair-salon` and `packages/config`.
2. **Replace `tailwind-preset.js`** with `packages/config/tailwind-theme.css` using `@theme` block. Preset file retained with deprecation notice.
3. **Update PostCSS** to use `@tailwindcss/postcss` only; remove `autoprefixer` (v4 handles prefixing).
4. **Add `@tailwindcss/typography`** for `prose` classes used in blog, about, privacy, terms pages.
5. **Fix deprecated utilities:** `outline-none` → `outline-hidden`, `shadow-sm` → `shadow-xs`, `flex-shrink-0` → `shrink-0`.
6. **Use `@source`** for `packages/ui` to ensure workspace package classes are detected.

## Consequences

### Positive
- Full builds ~5× faster; incremental builds 100×+ faster.
- CSS-first configuration aligns with modern tooling.
- Vendor prefixing handled by Tailwind; one fewer dependency (autoprefixer).
- Prose styling now functional via typography plugin.

### Neutral
- **Browser support:** v4 targets Safari 16.4+, Chrome 111+, Firefox 128+. Older Safari users no longer supported.
- **ThemeInjector:** Unchanged; still injects `--primary`, etc. into `:root`. `@theme` references these vars.

### Risks
- Visual density of `shadow-xs` may differ slightly from previous `shadow-sm`; monitor for feedback.
- Windows standalone build (EPERM symlinks) remains a known issue; unrelated to Tailwind.

## Verification

- `pnpm install` succeeds
- `pnpm turbo run build --filter=./templates/hair-salon` compiles and generates pages (standalone copy fails on Windows — pre-existing)
- `npx next dev` serves the app

## References

- docs/evaluation/tailwind-v4-migration.md
- packages/config/tailwind-theme.css
- templates/hair-salon/app/globals.css
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
