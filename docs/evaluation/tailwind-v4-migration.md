<!--
  File: docs/evaluation/tailwind-v4-migration.md  [TRACE:FILE=docs.evaluation.tailwindV4Migration]
  Purpose: Migration risk matrix and go/no-go decision for Tailwind CSS v3 → v4 upgrade.
           Covers browser support, shared preset migration, plugin compatibility, and
           deprecated utility migration. Recommendation: DEFER until post-Wave 3.
  Task: 0.4 | Last Updated: 2026-02-14
  Features: [FEAT:CONFIGURATION] [FEAT:EVALUATION] [FEAT:TOOLING]
-->

# Tailwind CSS v4 Migration Evaluation

**Task:** 0.4  
**Date:** 2026-02-14  
**Status:** Migrated 2026-02-15 (user override). See ADR 0005.  
**Author:** Development Team (AI-assisted)

---

## Executive Summary

Tailwind CSS v4.0 (released January 2025) is a ground-up rewrite with significant architectural changes: CSS-first configuration, removal of JavaScript `tailwind.config.js`, and `@theme` directive replacing presets. This evaluation assesses migration feasibility for the marketing-websites monorepo.

**Recommendation: DEFER** until after the first two client sites are live. Migration complexity is moderate-to-high due to the shared preset architecture, and current v3.4.17 is stable and sufficient for the critical path. A hybrid pilot on a non-critical package may be considered if early adoption becomes strategic.

---

## 1. Migration Risk Matrix

### 1.1 Browser Support Impact

| Factor | v3.4 (Current) | v4.0 Target | Risk Level | Client Impact |
|--------|----------------|-------------|------------|---------------|
| Safari | 14.1+ | 16.4+ | **MEDIUM** | Safari 14–16.3 users (~5–8% global) would lose support |
| Chrome | 87+ | 111+ | **LOW** | Chrome auto-updates; minimal impact |
| Firefox | 78+ | 128+ | **LOW** | Firefox auto-updates; minimal impact |
| Edge | 88+ | 111+ | **LOW** | Chromium-based; aligns with Chrome |

**Dependencies:** v4 requires `@property` and `color-mix()` for core framework features. No fallback for older browsers.

**Client Contract Consideration:** For service-business marketing sites (salons, law firms, dental), desktop Safari usage may include older macOS versions. Explicit browser support commitments should be confirmed before migration. If clients require "last 2 major versions" of Safari, v3.4 is safer until Safari 16.4+ adoption exceeds target threshold.

---

### 1.2 Shared Preset Migration Complexity

| Current Asset | v4 Equivalent | Migration Effort | Notes |
|--------------|---------------|------------------|-------|
| `packages/config/tailwind-preset.js` | CSS `@theme` in shared stylesheet | **HIGH** | Presets are removed in v4; no `presets: []` support |
| `theme.extend.colors` | `@theme { --color-* }` | **MEDIUM** | Semantic colors map to CSS vars; structure changes |
| `theme.extend.borderRadius` | `@theme { --radius-* }` | **LOW** | Direct mapping |
| `theme.extend.fontFamily` | `@theme { --font-* }` | **LOW** | Direct mapping |

**Architectural Impact:** The monorepo relies on a **shared preset** consumed by templates:

```
packages/config/tailwind-preset.js  →  templates/hair-salon/tailwind.config.js (presets: [sharedPreset])
```

v4 eliminates the preset system. Migration options:

1. **Option A:** Create `packages/config/tailwind-theme.css` with `@theme` block. Templates import via `@import "@repo/config/tailwind-theme.css"`. Requires package to expose a CSS entrypoint and template PostCSS/CSS to resolve workspace package paths.
2. **Option B:** Duplicate `@theme` definitions in each template's main CSS. Violates DRY; not recommended.
3. **Option C:** Use `@source` to reference `packages/ui`; keep theme in template CSS. Shared design tokens would live in a separate importable CSS file from `@repo/config`.

**Recommendation:** Option A with `packages/config` exporting `tailwind-theme.css` that defines semantic color/radius/font tokens. Requires updating PostCSS config and ensuring Next.js CSS resolution supports workspace package imports.

**ThemeInjector Compatibility:** Task 0.14 wires `site.config.ts` theme to CSS via `ThemeInjector`. v4 `@theme` uses different variable naming (`--color-primary` vs `--primary`). Coordination required to avoid duplication—ThemeInjector could override `@theme` vars at runtime, or theme could be fully CSS-driven with `@theme` only for structural tokens.

---

### 1.3 Plugin and Library Compatibility

| Tool | Current Usage | v4 Compatibility | Notes |
|------|---------------|------------------|-------|
| **@tailwindcss/typography** | `prose prose-lg` in BlogPostContent, about, privacy, terms | **Compatible** | Not installed; prose classes may be unstyled. If added: `@plugin "@tailwindcss/typography"` in CSS. |
| **Radix UI / shadcn patterns** | Planned (Tasks 1.1–1.6) | **Compatible** | Radix uses utility classes; no v4-specific issues. shadcn v4 guides exist. |
| **rehype-pretty-code** | Blog syntax highlighting | **Neutral** | Outputs HTML; Tailwind-agnostic. Prose styling (if typography added) works with v4. |
| **PostCSS + autoprefixer** | `postcss.config.js` | **Migration** | Replace `tailwindcss: {}` with `@tailwindcss/postcss`. Autoprefixer can be removed (v4 handles prefixing). |

**Prose Classes:** The codebase uses `prose prose-lg` in four files but `@tailwindcss/typography` is not in dependencies. Either (a) prose is unstyled, or (b) another source provides it. Audit recommended. For v4: add `@plugin "@tailwindcss/typography"` when/if typography is formally adopted.

---

### 1.4 Deprecated and Renamed Utilities (Codebase Audit)

**Files affected:** 8+ files across `packages/ui` and `templates/hair-salon`.

| v3 Class | v4 Replacement | Occurrences | Effort |
|----------|----------------|------------|--------|
| `outline-none` | `outline-hidden` | 8 | **LOW** — Upgrade tool handles |
| `shadow-sm` | `shadow-xs` | 12+ | **LOW** — Visual review needed |
| `flex-shrink-0` | `shrink-0` | 4 | **LOW** |
| `ring` (standalone) | `ring-3` | 0 | N/A |

The official `npx @tailwindcss/upgrade` tool automates most of these. Manual review recommended for shadow/radius scale changes, as `shadow-sm` → `shadow-xs` may alter visual density.

---

### 1.5 CSS and Config Changes

| Current | v4 | Migration Step |
|---------|-----|----------------|
| `@tailwind base;` `@tailwind components;` `@tailwind utilities;` | `@import "tailwindcss";` | Replace three directives with one import |
| `tailwind.config.js` + preset | None; `@theme` in CSS | Remove config; add `@theme` block |
| `content: [...]` | Auto-detection or `@source` | v4 auto-detects; `@source` for workspace packages |
| `postcss.config.js`: `tailwindcss`, `autoprefixer` | `@tailwindcss/postcss` only | Update PostCSS plugins |

**Content Paths:** Template uses:
```javascript
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './features/**/*.{js,ts,jsx,tsx,mdx}',
  '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
];
```
v4 auto-detection may miss `packages/ui` from template context. Use `@source "../../packages/ui/src"` or equivalent in template CSS.

---

## 2. Trigger Condition for Re-Evaluation

**Explicit trigger:** Migrate after the first two client sites are live and stable.

**Rationale:**
- Wave 0–3 focus is "Launch 2 Client Sites Fast." Introducing a major CSS framework migration adds risk and diverts effort.
- v3.4.17 is maintenance-mode but stable; no security or critical fixes blocked.
- v4 benefits (5x full build, 100x+ incremental) are valuable but not blocking for current scale.
- After two clients launch, the architecture will be proven; migration can be planned as a dedicated sprint with rollback path.

**Alternative triggers:**
- A client contract explicitly requires modern-browser-only support and demands latest tooling.
- Tailwind v3 reaches end-of-life (no security fixes).
- Performance profiling shows Tailwind build as bottleneck (unlikely at current monorepo size).

---

## 3. Decision Options

| Option | Description | Effort | Risk | Recommendation |
|--------|-------------|--------|------|-----------------|
| **Migrate Now** | Full v4 migration in Wave 0 | 8–12 hrs | High — blocks critical path | ❌ No |
| **Defer** | Stay on v3.4; re-evaluate after 2 clients live | 0 | None | ✅ **Yes** |
| **Hybrid Pilot** | Migrate one non-critical template or `packages/ui` build in isolation | 4–6 hrs | Medium — split config maintenance | ⚠️ Consider only if v4 adoption is strategic |

---

## 4. Recommended Path: DEFER

**Decision: DEFER** until post–Wave 3 (first two client sites live).

**Action items:**
1. **Document** this evaluation in `docs/evaluation/` (this file).
2. **Add to backlog** — "Tailwind v4 Migration" as post–Wave 3 task with link to this doc.
3. **Re-evaluate** when trigger condition met; run `npx @tailwindcss/upgrade` on a branch and measure build time, then decide on full adoption.

**Deferred work checklist (for future migration):**
- [ ] Create `packages/config/tailwind-theme.css` with `@theme` block
- [ ] Update `globals.css`: `@tailwind` → `@import "tailwindcss"`
- [ ] Update `postcss.config.js` to use `@tailwindcss/postcss`
- [ ] Add `@source` for `packages/ui` if auto-detection misses it
- [ ] Run `npx @tailwindcss/upgrade` and resolve any manual fixes
- [ ] Add `@tailwindcss/typography` if prose is formally adopted
- [ ] Coordinate ThemeInjector with `@theme` variable naming
- [ ] Verify browser support matrix with client contracts

---

## 5. References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) (official)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [@tailwindcss/typography v4](https://tailwindcss.com/docs/plugins#official-plugins)
- Project: `packages/config/tailwind-preset.js`, `templates/hair-salon/tailwind.config.js`, `templates/hair-salon/app/globals.css`
- RESEARCH_ENHANCED.md §3.2 (Tailwind v4 note), ANALYSIS_ENHANCED.md §2.6

---

_Last updated: 2026-02-14_  
_Next review: When trigger condition (2 clients live) is met_
