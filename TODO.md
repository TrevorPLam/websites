# Advanced Patterns Implementation Game Plan

**Source:** [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md)  
**Last Updated:** 2026-02-19  
**Status:** Implementation roadmap with research-backed refinements and corrected task dependencies.

---

## Research Findings Applied

- **Task dependencies:** Theme presets (inf-12) require C-5 and inf-4. Correct order: C-5 → inf-4 → inf-12.
- **Error boundaries:** Must be class components; `componentDidCatch` should call `logError` from `@repo/infra/client` for Sentry.
- **Layout structure:** Root layout has ConsentProvider; [locale] layout has NextIntlClientProvider. Provider composition applies to [locale] only; root unchanged.
- **Dynamic loading:** Requires section adapter file split first (one adapter per file) for per-section code-splitting.
- **Next 16:** Already in catalog (16.1.5); add `cacheComponents: true` to enable `use cache`.
- **SlotProvider:** In `@repo/infrastructure-ui`; add dependency to page-templates.
- **Skeleton:** Add `@repo/ui` to page-templates for Suspense fallbacks.
- **Tailwind v4:** Already migrated (ADR 0005).

---

## Wave 1: Quick Wins (1–2 days each)

### [ ] 1.1 Implement withErrorBoundary HOC

- **Target:** `packages/infra/composition/hocs.ts`
- Create inner class component `ErrorBoundary` with `getDerivedStateFromError` and `componentDidCatch`.
- In `componentDidCatch`: call `logError(error)` from `@repo/infra/client` (Sentry).
- API: `withErrorBoundary<P>(Component, fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode))`.
- Add `__tests__/withErrorBoundary.test.tsx`; export from composition/index.ts.
- **Verify:** `pnpm --filter @repo/infra test`

### [ ] 1.2 Provider Composition in Layout

- **Target:** `clients/starter-template/app/[locale]/layout.tsx`
- **Scope:** [locale] layout only; root layout unchanged.
- Import `ProviderComposer` from `@repo/infra/composition`.
- Create wrapper: `LocaleProvider({ children, messages }) => <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>`.
- Use `ProviderComposer` when multiple providers exist (e.g. TooltipProvider); with one provider, minimal change establishes pattern.
- **Verify:** `pnpm --filter @clients/starter-template dev`

### [ ] 1.3 CVA Migration for Button

- **Target:** `packages/ui/src/components/Button.tsx`
- **Dependency:** Add `@repo/infra` to `packages/ui/package.json`.
- Import `cva` from `@repo/infra/variants`; replace Record maps with single `cva()` definition.
- Preserve variants and sizes; add `compoundVariants` where applicable.
- **Verify:** `pnpm --filter @repo/ui test`; manual check in starter-template.

---

## Wave 2: Short-Term (1–2 weeks)

### [ ] 2.1 Section Registry Typed Schema

- **Targets:** `packages/page-templates/src/registry.ts`, `packages/page-templates/src/types.ts`
- **Aligns with:** tasks/inf-1-dynamic-section-registry.md
- Define `SectionType` union; add `SectionDefinition<Cfg>` with optional `configSchema`.
- Extend `registerSection`; in `composePage` validate when schema present; `console.warn` for unknown IDs.

### [ ] 2.2 Section Adapter File Split

- **Targets:** `packages/page-templates/src/sections/`
- **Purpose:** Prerequisite for per-section code-splitting.
- Split `sections/home.tsx` into `sections/home/hero-split.tsx`, `hero-centered.tsx`, `services-preview.tsx`, `cta.tsx`, etc.
- Add `sections/home/index.ts` for backward compatibility.
- Apply similarly to services.tsx, blog.tsx, about.tsx, contact.tsx, booking.tsx, industry.tsx, features.tsx.
- **Effort:** ~1–2 days.

### [ ] 2.3 CVA Batch Migration

- **Targets:** `packages/ui/src/components/`
- **Order:** Badge, Toggle, Tabs, Switch, Skeleton, Sheet, Rating, Progress, RadioGroup, Checkbox, Card, Container, Alert, Avatar
- Use Button as reference; replace Record maps with `cva()`; run tests after each.

### [ ] 2.4 Dynamic Section Loading

- **Targets:** `packages/page-templates/src/registry.ts`, composePage
- **Prerequisite:** 2.1, 2.2.
- **Dependency:** Add `@repo/ui` to `packages/page-templates/package.json` for Skeleton.
- Registry stores lazy factories or `React.lazy()` components.
- composePage wraps each section in `<Suspense fallback={<Skeleton className="h-32" />}>`.

---

## Wave 3: Medium-Term (1–2 months)

### [ ] 3.1 Design Tokens (C-5)

- **Targets:** New `packages/config/tokens/` (option-tokens.css, decision-tokens.css, component-tokens.css)
- **Aligns with:** tasks/c-5-design-tokens.md
- Per C-5 and DTCG 2025.10; wire tokens into tailwind-theme.css.

### [ ] 3.2 Token Overrides (inf-4)

- **Targets:** `packages/types/src/site-config.ts`, `packages/ui/src/components/ThemeInjector.tsx`
- **Prerequisite:** 3.1 (C-5).
- **Aligns with:** tasks/inf-4-design-token-overrides.md
- site.config.theme partial overrides; merge with base in ThemeInjector.

### [ ] 3.3 Theme Presets (inf-12)

- **Targets:** `packages/config/tokens/presets/`, ThemeInjector, site.config.ts
- **Prerequisite:** 3.1, 3.2.
- **Aligns with:** tasks/inf-12-theme-preset-library.md
- Presets: minimal, bold, professional; theme.preset or theme.extend in site.config.

### [ ] 3.4 Slot-Based Page Templates

- **Targets:** `packages/page-templates/src/templates/`
- **Prerequisite:** 1.2.
- **Dependency:** Add `@repo/infrastructure-ui` to `packages/page-templates/package.json`.
- Import SlotProvider, Slot, useSlot from `@repo/infrastructure-ui/composition`.
- Slots: header, footer, above-fold; document in docs/configuration.

### [ ] 3.5 Booking Provider Registry

- **Targets:** `packages/features/src/booking/lib/booking-providers.ts`
- **Aligns with:** tasks/inf-10-integration-adapter-registry.md
- Add `registerBookingProvider(id, factory)`; BookingProviders reads registry; provider modules register on load.

---

## Wave 4: Long-Term (3+ months)

### [ ] 4.1 use cache / cacheLife (Next 16)

- **Targets:** `clients/starter-template/next.config.js`, page templates
- **Prerequisite:** Add `cacheComponents: true` to next.config.js.
- Identify static vs dynamic sections; mark static with `use cache`; wrap dynamic in Suspense; configure cacheLife if needed.

### [ ] 4.2 React Compiler

- Add babel-plugin-react-compiler or Next.js config; start with `compilationMode: 'annotation'`; migrate to infer when stable.

### [ ] 4.3 Light/Dark Theme

- **Targets:** ThemeInjector, new ThemeProvider + useTheme (client)
- ThemeProvider + useTheme; toggle sets data-theme or --color-scheme; ThemeInjector respects current scheme.

---

## Task Dependencies

| Task                  | Depends On                                     | Blocks               |
| --------------------- | ---------------------------------------------- | -------------------- |
| withErrorBoundary     | None                                           | —                    |
| Provider composition  | None                                           | Slot-based templates |
| CVA for Button        | None                                           | CVA batch            |
| Section registry      | None                                           | Dynamic loading      |
| Section adapter split | None                                           | Dynamic loading      |
| CVA batch             | CVA for Button                                 | —                    |
| Dynamic loading       | Section registry schema, Section adapter split | —                    |
| Design tokens (C-5)   | None                                           | inf-4, inf-12        |
| Token overrides       | C-5                                            | inf-12               |
| Theme presets         | C-5, inf-4                                     | —                    |
| Slot-based templates  | Provider composition                           | —                    |
| Booking registry      | None                                           | inf-10               |
| use cache             | cacheComponents: true                          | —                    |
| React Compiler        | None                                           | —                    |
| Light/dark theme      | None                                           | —                    |

---

## Quality Gates (Per Task)

1. **File headers:** Update per .context/RULES.md
2. **Tests:** Add or update unit tests
3. **Documentation:** Update docs as noted
4. **Validation:**
   - `pnpm lint`
   - `pnpm type-check`
   - `pnpm test`
   - `pnpm validate-exports`
   - Client changes: `pnpm validate-client clients/starter-template`
   - Full build: `pnpm build`

---

## Recommended Execution Order

- **Week 1:** 1.1 withErrorBoundary, 1.2 Provider composition, 1.3 CVA for Button
- **Week 2:** 2.1 Section registry schema, 2.2 Section adapter split
- **Week 3–4:** 2.3 CVA batch migration, 2.4 Dynamic section loading
- **Month 2:** 3.1 C-5 design tokens, 3.2 inf-4 token overrides, 3.3 inf-12 theme presets
- **Month 2–3:** 3.4 Slot-based templates, 3.5 Booking registry
- **Month 3+:** 4.1 use cache, 4.2 React Compiler, 4.3 Light/dark theme

---

## Task References

- inf-1: [tasks/inf-1-dynamic-section-registry.md](tasks/inf-1-dynamic-section-registry.md)
- inf-4: [tasks/inf-4-design-token-overrides.md](tasks/inf-4-design-token-overrides.md)
- inf-10: [tasks/inf-10-integration-adapter-registry.md](tasks/inf-10-integration-adapter-registry.md)
- inf-12: [tasks/inf-12-theme-preset-library.md](tasks/inf-12-theme-preset-library.md)
- c-5: [tasks/c-5-design-tokens.md](tasks/c-5-design-tokens.md)
