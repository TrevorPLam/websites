<!--
@file docs/qa/qa-analysis-2-tasks-implementation.md
@role docs
@summary QA analysis of 2- tasks implementation (Phases 4–6)
@status 2026-02-18
-->

# QA Analysis: 2- Tasks Implementation

**Created:** 2026-02-18  
**Scope:** Phases 4–6 (Analytics, A/B Testing, Chat, Phase 5 stubs, Phase 6 industry components)

---

## Summary

| Phase | Scope | Status | Risk |
|-------|-------|--------|------|
| Phase 4 remainder | Analytics, A/B Testing, Chat | Complete | Low |
| Phase 5 | E-commerce, Auth, Payment, CMS, Notification stubs | Complete | Low |
| Phase 6 | Location, Menu, Portfolio, Case Study, Job Listing, Course, Resource, Comparison, Filter, Search, Social Proof, Video, Audio, Interactive, Widget | Complete | Low |

---

## Quality Checklist

### Type Safety
- [x] `@repo/features` type-check passes
- [x] `@repo/marketing-components` type-check passes
- [x] No `any` types in new code
- [x] Proper interface exports

### Architecture
- [x] Features do not depend on marketing-components (only reverse)
- [x] Config-based adapters where applicable
- [x] Barrel exports in package.json for new features

### Consistency
- [x] Follows existing patterns (Card, Section, Container, cn)
- [x] Button variant/size uses @repo/ui API (primary, outline, small)
- [x] Types in types.ts per component family

### Accessibility
- [ ] Components need a11y tests (jest-axe)
- [ ] FilterBar uses aria-pressed for active state
- [ ] SearchBar uses aria-label
- [ ] VideoEmbed provides title
- [ ] AudioPlayer provides title

### Known Gaps
1. **Tests:** New components lack unit tests; HeroCentered.test.tsx and booking-schema.test.ts have pre-existing Jest/Babel issues
2. **Export validation:** No script yet to validate marketing-components index.ts exports
3. **Integration:** Components not yet wired into starter-template or site.config
4. **Storybook:** No interactive examples for new components

---

## Validation Methods

| Method | Script / Command | Purpose |
|--------|------------------|---------|
| Type-check | `pnpm --filter @repo/features type-check` | TypeScript validation |
| Type-check | `pnpm --filter @repo/marketing-components type-check` | TypeScript validation |
| Export map | `pnpm validate-exports` | Package.json exports resolve |
| UI exports | `pnpm validate-ui-exports` | UI index.ts → component files |
| Marketing exports | `pnpm validate-marketing-exports` | Marketing index.ts → component families |

---

## Recommendations

1. ~~**Add unit tests**~~ Done: LocationCard, FilterBar, SearchBar, ComparisonTable, ChatWidget
2. ~~**Add validate-marketing-exports.js**~~ Done: script + CI step + package.json
3. ~~**Fix pre-existing Jest config**~~ Done: `jsx: 'react-jsx'` in jest.config.js (fixes React is not defined)
4. ~~**Document new components**~~ Done: marketing-components.md, phase-analysis
5. **Wire into starter-template** once site.config schema is extended
