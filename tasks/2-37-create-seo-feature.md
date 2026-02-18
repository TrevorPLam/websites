# 2.37 Create SEO Feature

## Metadata

- **Task ID**: 2-37-create-seo-feature
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: (Add if applicable)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2.11
- **Downstream Tasks**: (Tasks that consume this output)

## Context

SEO feature with 5+ implementation patterns, structured data, and sitemap generation.

**Implementation Patterns:** Config-Based, Schema-Based, Sitemap-Based, Analytics-Based, Hybrid (5+ total)

## Dependencies

- **Upstream Task**: 2.11 – required – prerequisite
- **Package**: @repo/features – modify – target package

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2.11
- **Parallel Work**: (Tasks to coordinate with)
- **Downstream**: (Work that will consume this output)

## Research & Evidence (Date-Stamped)

- **Derived from Related Research** – §5.1 (Spec-driven), SEO best practices, structured data

## Related Files

- `packages/features/src/seo/index` – create – (see task objective)
- `packages/features/src/seo/lib/schema` – create – (see task objective)
- `packages/features/src/seo/lib/adapters` – create – (see task objective)
- `packages/features/src/seo/lib/seo-config.ts` – create – (see task objective)
- `packages/features/src/seo/lib/structured-data.ts` – create – (see task objective)
- `packages/features/src/seo/lib/sitemap.ts` – create – (see task objective)
- `packages/features/src/seo/components/SEOSection.tsx` – create – (see task objective)
- `packages/features/src/seo/components/SEOConfig.tsx` – create – (see task objective)
- `packages/features/src/seo/components/SEOSchema.tsx` – create – (see task objective)
- `packages/features/src/seo/components/SEOSitemap.tsx` – create – (see task objective)
- `packages/features/src/seo/components/SEOAnalytics.tsx` – create – (see task objective)
- `packages/features/src/seo/components/SEOHybrid.tsx` – create – (see task objective)

## Code Snippets / Examples

```typescript
// API surface (from task)
// `SEOSection`, `seoSchema`, `createSEOConfig`, `generateStructuredData`, `generateSitemap`, `analyzeSEO`, `SEOConfig`, `SEOSchema`, `SEOSitemap`, `SEOAnalytics`, `SEOHybrid`

// Add usage examples per implementation
```

## Acceptance Criteria

- [ ] Schema; adapters; structured data; sitemap; analytics; implementation patterns; export.
- [ ] Builds
- [ ] all patterns work
- [ ] structured data functional
- [ ] sitemap works
- [ ] analytics work.

## Technical Constraints

- No custom SEO engine
- standard practices only.

## Accessibility & Performance Requirements

- Accessibility: Reference [docs/accessibility/component-a11y-rubric.md](docs/accessibility/component-a11y-rubric.md) for UI tasks; (N/A for non-UI)
- Performance: (Add target metrics: LCP, INP, bundle size per task scope)

## Implementation Plan

- [ ] (Add implementation steps)

## Testing Requirements

- Unit tests for new code
- Integration tests where applicable
- Run `pnpm test`, `pnpm type-check`, `pnpm lint` to verify

## Documentation Updates

- [ ] Update relevant docs (add specific paths per task)
- [ ] Add JSDoc for new exports

## Design References

- (Add links to mockups or design assets if applicable)

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Build passes

