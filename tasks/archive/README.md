# Task Archive

**Purpose:** Retired task files preserved for reference. Implementation complete or superseded.

## 3.1–3.3 Page Templates (Retired 2026-02-18)

Tasks 3.1, 3.2, and 3.3 (page-templates registry, HomePageTemplate, ServicesPageTemplate) were implemented. Output includes:

- **@repo/page-templates:** Registry with `registerSection`, `composePage`, `getSectionsForPage`; extended types (SectionProps, TemplateConfig, PageTemplateProps); HomePageTemplate and ServicesPageTemplate composing config-driven sections from `@repo/marketing-components` and `@repo/features`; section adapters in `src/sections/home.tsx` and `src/sections/services.tsx`; starter-template services page passes `searchParams` to template.

**Follow-on:** 3.4–3.8 (About, Contact, BlogIndex, BlogPost, Booking templates); [3.9 wire 2- tasks output into templates](../3-9-wire-2-tasks-output-into-templates.md).

---

## 2- Tasks (Retired 2026-02-18)

All 62 marketing component and feature tasks (2-1 through 2-62) were implemented in the 2026-02-18 session. Output includes:

- **@repo/features:** Analytics, A/B Testing, Chat; e-commerce, auth, payment, CMS, notification stubs; Team, Testimonials, Gallery, Pricing, Newsletter, Social Media, Reviews, Booking, Contact, Blog, Search
- **@repo/marketing-components:** Location, Menu, Portfolio, Case Study, Job Listing, Course, Resource, Comparison, Filter, Search, Social Proof, Video, Audio, Interactive, Widget; plus Hero, Services, Team, Testimonials, Pricing, Gallery, Stats, CTA, FAQ, Navigation, Footer, Blog, Product, Event

**Follow-on:** See [tasks/3-9-wire-2-tasks-output-into-templates.md](../3-9-wire-2-tasks-output-into-templates.md) for wiring into templates and site.config.

**Reference:** [docs/qa/qa-analysis-2-tasks-implementation.md](../../docs/qa/qa-analysis-2-tasks-implementation.md)

---

## Historic process / meta (archived 2026-02)

The following files are process, gameplan, or prompt documentation—not task specs. They were moved here so only actionable task files remain at `tasks/` root.

- **TASK-UPDATE-PROGRESS.md** — Progress log for batch-updating task files with research/snippets.
- **TASK-UPDATE-GAMEPLAN.md** — Game plan for systematically updating all task files.
- **prompt.md** — Guide to task documentation (template and best practices for Cursor AI).
