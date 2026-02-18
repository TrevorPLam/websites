# 3.9 Wire 2- Tasks Output Into Templates

## Metadata

- **Task ID**: 3-9-wire-2-tasks-output-into-templates
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: 2- tasks implementation complete (Phases 4–6)
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 2- tasks (retired to [tasks/archive](archive)), 3.1–3.8
- **Downstream Tasks**: (Tasks that consume this output)

## Context

2- tasks implementation (2026-02-18) delivered Analytics, A/B Testing, Chat features; Phase 5 stubs (e-commerce, auth, payment, CMS, notification); and Phase 6 industry components (Location, Menu, Portfolio, Case Study, Job Listing, Course, Resource, Comparison, Filter, Search, Social Proof, Video, Audio, Interactive, Widget). These are not yet wired into starter-template or page templates.

## Dependencies

- **Upstream**: 3.1 (page-templates registry), 3.2–3.8 (page templates)
- **Package**: clients/starter-template, @repo/types (SiteConfig)
- **Reference**: [docs/qa/qa-analysis-2-tasks-implementation.md](../docs/qa/qa-analysis-2-tasks-implementation.md)

## Open Work (from 2- session)

1. **Extend site.config schema** for analytics, chat, A/B testing config sections
2. **Wire industry components** (Location, Menu, Portfolio, Course, etc.) into page templates and starter-template
3. **Register new feature sections** in page-templates registry (Analytics, Chat, A/B Testing)
4. **Fix pre-existing CI issues** (optional): @repo/integrations-analytics, @repo/integrations-hubspot type-check; booking-schema.test.ts `import type` syntax; Toast.tsx types
5. **Add a11y tests** for remaining components (VideoEmbed, AudioPlayer, etc.)
6. **Storybook** (future): Interactive examples for new components

## Related Files

- `packages/types/src/site-config.ts` – extend – add analytics, chat, abTesting config
- `clients/starter-template/site.config.ts` – extend – example config
- `packages/page-templates/src/registry.ts` – extend – register new section types
- `clients/starter-template/app/**/page.tsx` – modify – compose new sections

## Cross-Task Dependencies & Sequencing

- **Upstream**: 2- tasks output (in archive); 3.1–3.8
- **Parallel Work**: May overlap with other 3- template work
- **Downstream**: Client migrations, feature documentation

## References

- [docs/qa/qa-analysis-2-tasks-implementation.md](../docs/qa/qa-analysis-2-tasks-implementation.md) — QA summary, validation methods
- [docs/components/marketing-components.md](../docs/components/marketing-components.md) — Component families
- [docs/qa/phase-analysis-2-tasks.md](../docs/qa/phase-analysis-2-tasks.md) — Phase status
