# 3.1 Create Page-Templates Registry and Package Scaffold

**Status:** [ ] TODO | **Batch:** C | **Effort:** 3h | **Deps:** None

**Related Research:** §2.1 (Templates), §3.1 (React 19), §8 (AOS)

**Objective:** Registry (Map), SectionProps, TemplateConfig, composePage. No switch-based section selection. L3.

**Files:** `packages/page-templates/src/registry.ts`, `types.ts`, `index.ts`, `templates/` (empty)

**API:** `sectionRegistry`, `SectionProps`, `TemplateConfig`, `composePage(config, siteConfig)`

**Checklist:** registry.ts; types.ts; composePage; templates/; index; deps; type-check; build.
**Done:** Registry exists; composePage works with stubs; 3.2 can add HomePageTemplate.
**Anti:** No CMS section definitions; config from siteConfig only.

---
