# Advanced Patterns Implementation Game Plan

**Source:** [docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md](docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md)
**Last Updated:** 2026-02-20 (session: claude/review-goals-update-tasks-zRee6)
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

## Wave 1: Quick Wins ✅ COMPLETE

### [x] 1.1 Implement withErrorBoundary HOC

- **Status: COMPLETE** — `packages/infra/composition/hocs.ts` exists with full `withErrorBoundary` HOC,
  inner `ErrorBoundary` class component, `getDerivedStateFromError`, `componentDidCatch` → `logError` (Sentry).
  Also exports `withDisplayName`, `withConditionalRender`, `withDefaultProps`.
  Tests at `__tests__/withErrorBoundary.test.tsx`. Exported from `composition/index.ts`.

### [x] 1.2 Provider Composition in Layout

- **Status: COMPLETE** — `clients/starter-template/app/[locale]/layout.tsx` uses `LocaleProviders` client
  component which wraps `ProviderComposer` from `@repo/infra/composition`. `ProviderComposer` and
  `composeProviders` live in `packages/infra/composition/provider.ts` (uses `reduceRight` to nest providers).

### [x] 1.3 CVA Migration for Button

- **Status: COMPLETE** — `packages/ui/src/components/Button.tsx` uses `cva` from `@repo/infra/variants`
  with 6 variants (primary, secondary, outline, ghost, destructive, text) and 3 sizes (small, medium, large).
  Badge and Alert also migrated to CVA.

---

## Wave 2: Short-Term

### [x] 2.1 Section Registry Typed Schema

- **Status: COMPLETE** — `packages/page-templates/src/types.ts` defines `SectionType` union (37 IDs),
  `SectionDefinition<Cfg>` with optional `configSchema?: ZodType`. `packages/page-templates/src/registry.ts`
  implements `registerSection`, `composePage`, `getSectionsForPage`.

### [x] 2.2 Section Adapter File Split

- **Status: COMPLETE** — `packages/page-templates/src/sections/` contains 8 family directories
  (about/, blog/, booking/, contact/, features/, home/, industry/, services/) with 50+ section
  components. Each family has `shared.ts` utilities and `index.ts` barrel export.

### [ ] 2.3 CVA Batch Migration

- **Status: PARTIAL** — Button ✅, Badge ✅, Alert ✅ migrated. Tabs still uses manual Record<> style maps.
  ~57 other components (Card, Container, Input, Checkbox, Switch, Skeleton, etc.) still use manual `cn()`.
- **Remaining:** Tabs, Toggle, Switch, Skeleton, Sheet, Rating, Progress, RadioGroup, Checkbox, Card,
  Container, Avatar, Input, Select, Textarea — use Button as pattern reference.
- **Order:** Tabs (priority — complex context pattern), then remaining list.

### [x] 2.4 Dynamic Section Loading

- **Status: COMPLETE** — `registry.ts` wraps each section in `<Suspense fallback={<Skeleton />}>` in
  `composePage()`. Achieves per-section lazy loading effect via streaming. Registry stores component
  references; sections lazy-load via webpack code splitting on import.

---

## Wave 3: Medium-Term

### [x] 3.1 Design Tokens (C-5)

- **Status: COMPLETE** — `packages/config/tokens/` has three-layer CSS token architecture:
  - `option-tokens.css` — Layer 1: Raw DTCG 2025.10 values (color primitives, spacing scale, type scale)
  - `decision-tokens.css` — Layer 2: Semantic aliases (--color-primary, --color-background, etc.) + backward compat
  - `component-tokens.css` — Layer 3: Component-specific (--button-bg, --card-radius, --input-border, etc.)

### [x] 3.2 Token Overrides (inf-4)

- **Status: COMPLETE** — `packages/ui/src/components/ThemeInjector.tsx` accepts `theme: ThemeColors`
  (partial), merges with `DEFAULT_THEME_COLORS` from `@repo/types`, generates CSS custom properties, and
  renders a server-side `<style>` tag. Bare HSL values are wrapped in `hsl()` automatically.

### [x] 3.3 Theme Presets (inf-12)

- **Status: COMPLETE** — `packages/types/src/theme-presets.ts` defines 3 presets (minimal, bold,
  professional) each as `Partial<ThemeColors>`, exports `getThemePreset`, `resolveThemeColors`, and
  `ThemePresetName`. `SiteConfig.theme` already had `preset?: ThemePresetName`. `ThemeInjector.tsx`
  updated to accept optional `preset` prop; resolution order: DEFAULT_THEME_COLORS → preset → per-site
  overrides. All 5 client layouts pass `preset={siteConfig.theme.preset}` to ThemeInjector.

### [ ] 3.4 Slot-Based Page Templates

- **Targets:** `packages/page-templates/src/templates/`
- **Prerequisite:** 1.2 ✅.
- **Note (research correction):** `@repo/infrastructure-ui` is not yet a real package in the codebase.
  Implement Slot/SlotProvider in `packages/infra/composition/slots.ts` instead, then add dependency.
- Slots: header, footer, above-fold; document in `docs/configuration/slot-based-templates.md`.

### [x] 3.5 Booking Provider Registry

- **Status: COMPLETE** — `packages/features/src/booking/lib/booking-providers.ts` exports
  `BookingProviderFactory` type, `registerBookingProvider(id, factory)`, and `getBookingProviderRegistry()`.
  Module-level `BOOKING_PROVIDER_REGISTRY` Map holds third-party factories; `BookingProviders` constructor
  iterates it on instantiation. `registerBookingProvider` invalidates the cached singleton so the next
  `getBookingProviders()` call picks up the new provider. `createBookingWithAllProviders` covers both
  built-in and registered adapters. Tests in `booking/lib/__tests__/booking-providers-registry.test.ts`
  use `jest.isolateModules()` for singleton isolation.
- **Aligns with:** tasks/inf-10-integration-adapter-registry.md

---

## Wave 4: Long-Term

### [ ] 4.1 use cache / cacheLife (Next 16)

- **Targets:** `clients/starter-template/next.config.js`, page templates
- **Prerequisite:** Add `cacheComponents: true` to next.config.js.
- Identify static vs dynamic sections; mark static with `use cache`; wrap dynamic in Suspense; configure cacheLife if needed.

### [ ] 4.2 React Compiler

- Add babel-plugin-react-compiler or Next.js config; start with `compilationMode: 'annotation'`; migrate to infer when stable.

### [ ] 4.3 Light/Dark Theme

- **Targets:** ThemeInjector, new ThemeProvider + useTheme (client)
- ThemeProvider + useTheme; toggle sets data-theme or --color-scheme; ThemeInjector respects current scheme.
- **Prerequisite:** 3.3 (Theme Presets) for preset switching infrastructure.

---

## Task Dependencies

| Task                  | Depends On                                   | Blocks                  |
| --------------------- | -------------------------------------------- | ----------------------- |
| withErrorBoundary     | None                                         | — ✅                    |
| Provider composition  | None                                         | Slot-based templates ✅ |
| CVA for Button        | None                                         | CVA batch ✅            |
| Section registry      | None                                         | Dynamic loading ✅      |
| Section adapter split | None                                         | Dynamic loading ✅      |
| CVA batch             | CVA for Button ✅                            | — (partial)             |
| Dynamic loading       | Section registry schema ✅, adapter split ✅ | — ✅                    |
| Design tokens (C-5)   | None                                         | inf-4, inf-12 ✅        |
| Token overrides       | C-5 ✅                                       | inf-12 ✅               |
| Theme presets         | C-5 ✅, inf-4 ✅                             | Light/dark theme ✅     |
| Slot-based templates  | Provider composition ✅                      | —                       |
| Booking registry      | None                                         | inf-10 ✅               |
| use cache             | cacheComponents: true                        | —                       |
| React Compiler        | None                                         | —                       |
| Light/dark theme      | Theme presets                                | —                       |

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

- **Immediate (complete):** 2.3 Tabs CVA ✅, 3.3 Theme presets ✅, 3.5 Booking registry ✅
- **Next:** 3.4 Slot-based templates, remaining CVA batch (Card, Input, Switch, etc.)
- **Month 2:** 4.1 use cache, 4.3 Light/dark theme
- **Month 3+:** 4.2 React Compiler

---

## Task References

- inf-1: [tasks/inf-1-dynamic-section-registry.md](tasks/inf-1-dynamic-section-registry.md)
- inf-4: [tasks/inf-4-design-token-overrides.md](tasks/inf-4-design-token-overrides.md)
- inf-10: [tasks/inf-10-integration-adapter-registry.md](tasks/inf-10-integration-adapter-registry.md)
- inf-12: [tasks/inf-12-theme-preset-library.md](tasks/inf-12-theme-preset-library.md)
- c-5: [tasks/c-5-design-tokens.md](tasks/c-5-design-tokens.md)
