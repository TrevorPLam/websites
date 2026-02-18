# Marketing Website Monorepo — Master TODO

**Last Updated:** February 17, 2026
**Goal:** Transform from template-based to feature-based, industry-agnostic marketing website platform
**Timeline:** 12 weeks | **Current State:** Single hair-salon template → **Target:** 12 industries, 20+ components, config-driven

---

## Normalized Task Specifications

Each task has a **normalized spec** in `docs/task-specs/` with the strict 15-section format:

| Spec File | Tasks |
|-----------|-------|
| [01-ui-primitives](docs/task-specs/01-ui-primitives.md) | 1.2–1.6 (Toast, Tabs, Dropdown, Tooltip, Popover) |
| [02-marketing-components](docs/task-specs/02-marketing-components.md) | 1.7, 2.1–2.10 |
| [03-feature-breadth](docs/task-specs/03-feature-breadth.md) | 2.16–2.19 |
| [04-page-templates](docs/task-specs/04-page-templates.md) | 3.1–3.8 |
| [05-integrations](docs/task-specs/05-integrations.md) | 4.1–4.6 |
| [06-client-factory](docs/task-specs/06-client-factory.md) | 5.1–5.6 |
| [07-cleanup-scripts](docs/task-specs/07-cleanup-scripts.md) | 6.1–6.10 |
| [08-governance](docs/task-specs/08-governance.md) | C.1–D.8 |
| [09-innovation-future](docs/task-specs/09-innovation-future.md) | E, F, Phase 7+ |

**Use these specs for:** objective clarification, dependency check, file paths, API design, data contracts, implementation checklist, done criteria, and anti-overengineering guardrails. See [00-OVERVIEW](docs/task-specs/00-OVERVIEW.md) for conventions.

---

## AI Agent Usage Instructions

Each task uses the following status convention:

- `[ ]` TODO/Pending
- `[🔄]` IN_PROGRESS
- `[x]` COMPLETED
- `[🚫]` BLOCKED
- `[⏸️]` PAUSED

**To update a task:** change its status line and fill in Assigned To / Completed date.

```markdown
**Status:** [🔄] IN_PROGRESS | **Assigned To:** [AgentName] | **Completed:** [ ]
**Status:** [x] COMPLETED | **Assigned To:** [AgentName] | **Completed:** [2026-02-14]
```

---

## Architecture Context

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)    │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)        │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)             │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)       │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│ ← @repo/infra exists
└─────────────────────────────────────────────────────────────────────────────┘
```

| Layer  | Package                      | Status         | Scope                                        |
| ------ | ---------------------------- | -------------- | -------------------------------------------- |
| **--** | Housekeeping (Wave 0)        | 🟢 Complete    | Config fixes, tooling, CI, bug fixes done    |
| **L2** | `@repo/ui`                   | 🟡 9 of 14     | +5 UI primitives (Dialog, ThemeInjector)     |
| **L2** | `@repo/marketing-components` | 🔴 Package does not exist | Create per 1.7, then 2.1–2.10 (10 component families) |
| **L2** | `@repo/features`             | 🟡 5 of 9      | booking, contact, blog, services, search     |
| **L2** | `@repo/types`                | 🟢 In packages | Moved from templates/shared; extended        |
| **L3** | `@repo/page-templates`       | 🔴 Scaffolded only (no src/) | 0 of 7 templates; add 3.1 then 3.2–3.8     |
| **L3** | `clients/`                   | 🔴 Not Started | Only README; add 5.1 (starter) then 5.2–5.6 |
| **L0** | `@repo/infra`                | 🟢 Exists      | Security, middleware, logging, 7 env schemas |
| **L0** | `@repo/integrations`         | 🟡 Partial     | 3 exist, 6 more planned                      |

---

## Execution Strategy

### Vision: Configuration-as-Code Architecture (CaCA)

Every aspect of a client website — theming, page composition, feature selection, SEO schema — is driven by a single validated `site.config.ts`. No code changes required to launch a new client. Config is the product. Code is the escape hatch.

### Wave Plan (Critical Path)

```text
Wave 0 (Repo Integrity) ────────────────────────────────────────────────────────┐
├── Batch A (config fixes)         ───── parallel ─────┐                        │
├── Batch B (code fixes)           ───── parallel ─────┤                        │
├── Batch C (tooling)              ───── after A ──────┘                        │
└── Batch D (upgrades + CI)        ───── after A+B+C ──────────────────────────┘
    │
    ├──→ Wave 1 Track A: Config + Types (0.8 → 1.8 → 1.9)
    ├──→ Wave 1 Track B: Feature Extraction (2.11 → 2.12-2.20)
    ├──→ Wave 1 Track C: Testing (2.21 → 2.22)
    │
    └──→ Wave 2: Page Templates (3.1-3.8)
         │
         └──→ Wave 3: Client Factory (5.1-5.7, 6.10)
```

### Parallelization Model

| Track                            | Tasks                           | Outcome                        |
| -------------------------------- | ------------------------------- | ------------------------------ |
| **Track A (Core Platform)**      | 0.x → Config/Types → CI/release | Stable monorepo + typed config |
| **Track B (Feature Extraction)** | 2.11-2.22 + parity tests        | Reusable feature spine         |
| **Track C (Template Assembly)**  | 3.1-3.8 → starter client        | Launch-ready page assembly     |

### Dependency Health Matrix

| Dependency Path         | Execution Rule                                            |
| ----------------------- | --------------------------------------------------------- |
| `0.3 → 0.13`            | Ship CI gate immediately after Turbo upgrade              |
| `0.8 → 1.8 → 1.9`       | Finish package move before config/industry expansion      |
| `1.7 → 2.1-2.10`        | Create marketing-components package (1.7) before any marketing component |
| `2.11 → 2.12/13/15/20`  | Do not start extraction before feature skeleton exists    |
| `2.21 → 2.22`           | Establish strategy first, then parity suite               |
| `2.12-2.20 → 2.22`      | Add parity tests per extracted feature                    |
| `3.1 → 3.2-3.8`         | Registry and package scaffold (3.1) before any page template |
| `3.2/3.3/3.5/3.8 → 5.1` | Only start starter after minimum page set done            |
| `5.1 → 5.2/5.3/5.7`     | Use starter as single source for first launch factory     |
| `6.1/5.2-5.6 → 6.3`     | Never delete `templates/` until migration matrix complete |
| `6.3/6.9/5.7 → 6.10`    | Require rollback rehearsal before cutover sign-off        |

**Fast blocker checks before starting any task:**

1. Confirm all listed dependencies are marked complete
2. Confirm no dependency points to deferred NEXT/LATER work
3. Confirm CI gate requirements for the task's wave are already green
4. Confirm rollback path exists for any destructive or migration task

### Batching and Streamlining

Tasks that share the same pattern or output can be batched to reduce repetition. Use the following batches and references:

| Batch | Tasks | Streamline approach |
| ----- | ----- | -------------------- |
| **A** | 1.2–1.6 (UI primitives) | Use **Component Pattern Template** (below). Implement 1.3 Tabs first as reference; scaffold Toast, Dropdown, Tooltip, Popover from same template. Optional: `scripts/scaffold-ui-component.js` to generate Component.tsx + index.ts export. |
| **B** | 2.1–2.10 (marketing components) | Shared types first (2.1a, 2.2a); same folder structure per domain: `index.ts`, `types.ts`, variants, barrel in marketing-components. 2.7 + 2.8 can be one session. |
| **C** | 3.2–3.8 (page templates) | After 3.1, build 3.2 HomePageTemplate as reference; copy structure for 3.3, 3.5, 3.8, 3.4, 3.6, 3.7; swap section keys and feature imports. |
| **D** | 5.2–5.6 (example clients) | **Script:** `scripts/create-example-client.js <name> [industry]` copies starter-template → `clients/<name>`, optionally seeds `site.config.ts`. Checklist: industry, conversion flows, layout options; then run validate-client. |
| **E** | 2.16–2.19 (new features) | Use **Feature Package Structure** template (below). Copy existing feature (e.g. contact/booking), find-replace name, then implement domain logic. |
| **F** | 4.1–4.5 (integrations) | Adapter contract first (4.1a, 4.2a); reuse adapter + retry/timeout pattern. Optional: script to scaffold `packages/integrations/<name>/` with adapter + provider stub. |
| **G** | 6.10a–6.10c (scripts) | Do 6.10b (health) then 6.10a (validate-client); then 6.10c (program:wave*). One script sprint, shared style. |
| **H** | 6.4, 6.5, 6.6, 6.7 (documentation) | 6.4a (Storybook setup) once; then doc sprint with shared template (purpose, usage, examples). |
| **I** | C.1–C.18, D.x (governance) | Script-heavy: single `scripts/` or `scripts/architecture/` convention; one pass to add check scripts + CI. Doc-heavy: batch policy/runbook docs. Optional: RUNBOOK.md table (Script → purpose → CI vs. manual). |

**Parent tasks with subtasks:** Mark parent complete only when all subtasks (e.g. 2.1a–2.1e) are done.

---

## Verified Findings (February 14, 2026 Audit)

> These corrections from 3 audit passes are **folded into the tasks below** rather than kept separate. This section is the reference log.

### Corrections to Prior Analysis

| Claim                               | Actual                                                         | Impact                       |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------- |
| "7 packages"                        | 5 top-level dirs → ~10 workspace packages                      | Package count was misleading |
| Search feature "no components"      | Has SearchDialog (6.3KB) + SearchPage (3.5KB)                  | Less extraction work         |
| Services feature "1 component"      | Has ServicesOverview + ServiceDetailLayout (8KB)               | Less extraction work         |
| Booking lib "4 files incl utils.ts" | 3 files (no utils.ts) + 1 test dir                             | Minor                        |
| navLinks "7 items"                  | 6 items (no Contact in nav)                                    | Minor                        |
| @repo/utils "zero dependencies"     | Has clsx + tailwind-merge as runtime deps                      | Incorrect claim              |
| conversionFlow "only booking"       | SiteConfig supports 4 flows: booking, contact, quote, dispatch | **Reduces Task 1.8 scope**   |
| "No tests in template features"     | 4 test files in template (blog, booking, env, search)          | Better test baseline         |
| Turbo "v2.8.4 available"            | Latest stable is v2.8.7+                                       | Gap is larger                |
| INP "replaces FID March 2026"       | INP replaced FID in **March 2024**                             | Already in effect            |

### Key Discoveries

- **@repo/types** (was `templates/shared/`): Now in `packages/types/`. Defines `SiteConfig` with 4 conversion flow types. `templates/shared/` removed (Task 0.8).
- **7 env validation schemas** in `packages/infra/env/schemas/` (base, booking, hubspot, public, rate-limit, sentry, supabase).
- **Config conflict**: Fixed (Task 0.1). `.npmrc` no longer sets node-linker; `.pnpmrc` is authoritative.
- **Workspace glob mismatch**: Fixed (Task 0.2). `package.json` workspaces now match `pnpm-workspace.yaml`.
- **Broken infra export**: Fixed (Task 0.10). Export path points to `./middleware/create-middleware`.
- **Theme config**: Fixed (Task 0.14). ThemeInjector generates CSS vars from `site.config.ts` theme.
- **Sentry DSN**: Fixed (Task 0.15). Schema and `.env.example` use `NEXT_PUBLIC_SENTRY_DSN`.
- **Dockerfile references standalone output** which is commented out in `next.config.js`.
- **Booking providers**: ~300 lines of duplicated code across 4 provider classes.
- **Broken Tailwind class**: `hover:bg-primary/90-50` in SearchDialog.
- **Node.js engine >=24.0.0** blocks contributors on LTS versions (20, 22).
- **turbo.json missing globalEnv** — env changes can produce incorrect cache hits.
- **Template deps not using pnpm catalog** — version drift between packages.

---

# NOW — Waves 0-3: Launch 2 Client Sites Fast

---

## Wave 0: Repo Integrity (Day 0-2) — COMPLETED

> All Wave 0 tasks completed. See [ARCHIVE.md](ARCHIVE.md) for full records.

---

## Wave 1: Config + Feature Spine (Day 2-6) — COMPLETED

> All Wave 1 tasks completed. See [ARCHIVE.md](ARCHIVE.md) for full records.

---

# NEXT — Expand Market Readiness (After First 2 Live Clients)

---

## UI Primitives Completion

#### 1.2 Create Toast Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Non-blocking notification banners that auto-disappear.

**Technical Requirements:**

- Auto-dismiss with pause on hover
- Stacking (multiple toasts)
- Variants: success, error, warning, info
- Positioning: top-right, top-center, bottom-right
- ARIA live regions, dedupe key support
- Dependencies: `sonner` (already in template)

**Files:**

- Create: `packages/ui/src/components/Toast.tsx`
- Create: `packages/ui/src/components/Toaster.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.3 Create Tabs Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Content organization with clickable tab headers. ARIA tablist pattern with roving focus.

**Technical Requirements:**

- Horizontal and vertical variants
- Controlled and uncontrolled modes
- `activationMode` (automatic/manual)
- Smooth content transitions respecting `prefers-reduced-motion`
- Dependencies: `@radix-ui/react-tabs`

**Files:**

- Create: `packages/ui/src/components/Tabs.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.4 Create Dropdown Menu Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Clickable button revealing action list. Full keyboard semantics and nested menu support.

**Technical Requirements:**

- Keyboard navigation (arrow keys, Enter, Escape)
- Nested submenus, separators, checkbox/radio items
- Alignment and collision handling
- Dependencies: `@radix-ui/react-dropdown-menu`

**Files:**

- Create: `packages/ui/src/components/DropdownMenu.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.5 Create Tooltip Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Small popup on hover/focus showing help text.

**Technical Requirements:**

- Hover and focus triggers
- Positioning: top, bottom, left, right
- Global provider for delay defaults
- Dependencies: `@radix-ui/react-tooltip`

**Files:**

- Create: `packages/ui/src/components/Tooltip.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.6 Create Popover Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Rich interactive overlay (more complex than tooltip). Click-outside dismissal, focus management.

**Technical Requirements:**

- Click-outside dismissal
- Focus management
- Anchored positioning with collision padding
- Dependencies: `@radix-ui/react-popover`

**Files:**

- Create: `packages/ui/src/components/Popover.tsx`
- Update: `packages/ui/src/index.ts`

---

## Marketing Components Package + Components

#### 1.7 Create @repo/marketing-components Package Scaffold | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Create the `@repo/marketing-components` package so 2.1–2.10 have a target. Package does not exist today.

**Technical Requirements:**

- Create `packages/marketing-components/package.json` (name: `@repo/marketing-components`, deps: `@repo/ui`, `@repo/utils`, `@repo/types`, catalog for react)
- Create `packages/marketing-components/tsconfig.json`
- Create `packages/marketing-components/src/index.ts` (barrel export; empty or placeholder)
- Ensure workspace includes the package (packages/* already covers it)

**Files:**

- Create: `packages/marketing-components/package.json`
- Create: `packages/marketing-components/tsconfig.json`
- Create: `packages/marketing-components/src/index.ts`

**Dependency:** 1.7 must be complete before any of 2.1–2.10.

---

#### 2.1 Build HeroVariants Components | **Effort:** 6 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

4 variants: HeroCentered, HeroSplit, HeroVideo, HeroCarousel. Shared `HeroProps` interface. Prioritize fast LCP.

**Subtasks (parent complete when all done):**

- **2.1a** Shared `HeroProps` + types
- **2.1b** HeroCentered
- **2.1c** HeroSplit
- **2.1d** HeroVideo
- **2.1e** HeroCarousel

**Files:** `packages/marketing-components/src/hero/`

---

#### 2.2 Build ServiceShowcase Components | **Effort:** 6 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

4 layouts: ServiceGrid, ServiceList, ServiceTabs (uses 1.3), ServiceAccordion. Single normalized data shape.

**Subtasks (parent complete when all done):**

- **2.2a** Normalized data shape (shared types)
- **2.2b** ServiceGrid
- **2.2c** ServiceList
- **2.2d** ServiceTabs
- **2.2e** ServiceAccordion

**Files:** `packages/marketing-components/src/services/`

---

#### 2.3 Build TeamDisplay Components | **Effort:** 5 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 layouts: TeamGrid, TeamCarousel, TeamDetailed. Profile data model supports cross-industry staffing.

**Files:** `packages/marketing-components/src/team/`

---

#### 2.4 Build Testimonial Components | **Effort:** 5 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: TestimonialCarousel, TestimonialGrid, TestimonialMarquee. Motion respects `prefers-reduced-motion`.

**Files:** `packages/marketing-components/src/testimonials/`

---

#### 2.5 Build Pricing Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.3 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: PricingTable, PricingCards, PricingCalculator. Supports one-time, recurring, and "contact us" tiers.

**Files:** `packages/marketing-components/src/pricing/`

---

#### 2.6 Build Gallery Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.1 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: ImageGrid, ImageCarousel, LightboxGallery. Progressive image quality, lightbox keyboard controls.

**Files:** `packages/marketing-components/src/gallery/`

---

#### 2.7 Build Stats Counter Component | **Effort:** 3 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Animated number counting on scroll. SSR-safe, reduced-motion fallback.

**Files:** `packages/marketing-components/src/stats/`

---

#### 2.8 Build CTA Section Components | **Effort:** 3 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

2 variants: CTABanner (full-width), CTASplit (image + text). Primary + secondary action with analytics hooks.

**Files:** `packages/marketing-components/src/cta/`

---

#### 2.9 Build FAQ Section Component | **Effort:** 4 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Accordion-style Q&A with optional search/filter. Schema.org FAQPage output mapping.

**Files:** `packages/marketing-components/src/faq/`

---

#### 2.10 Build Contact Form Variants | **Effort:** 4 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

3 variants: SimpleContactForm, MultiStepContactForm, BookingContactForm. Normalized submission contract, configurable consent.

**Files:** `packages/marketing-components/src/contact/`

---

## Feature Breadth (New Features)

#### 2.16 Create Testimonials Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.4 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Build from scratch. Data sources: config, CMS, or API (Google Reviews, Yelp). Source adapters normalize external payloads.

**Files:** `packages/features/src/testimonials/`

---

#### 2.17 Create Team Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.3 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Member profiles with social links, configurable layouts. Reusable profile card schema.

**Files:** `packages/features/src/team/`

---

#### 2.18 Create Gallery Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.6 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Image optimization, lightbox integration using Dialog. Transform preset profiles by use case.

**Files:** `packages/features/src/gallery/`

---

#### 2.19 Create Pricing Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.5 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Data-driven pricing tables, cards, calculators. Currency/locale formatting strategy centralized.

**Files:** `packages/features/src/pricing/`

---

## Page Templates (Wave 2) — Foundation and Core

> `packages/page-templates` currently has only package.json; no `src/`. These tasks create the registry and minimum page set required for 5.1 (starter-template).

#### 3.1 Create Page-Templates Registry and Package Scaffold | **Effort:** 3 hrs | **Dependencies:** None | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Add `src/` to `@repo/page-templates`: section registry (Map of section id → component), barrel export, and `templates/` directory. Composable assembly — no switch statements; config-driven section composition.

**Technical Requirements:**

- Create `packages/page-templates/src/registry.ts` — registry Map<string, Component>
- Create `packages/page-templates/src/index.ts` — barrel exporting registry and template types
- Create `packages/page-templates/src/templates/` directory (templates 3.2–3.8 go here)
- Dependencies: `@repo/types` (already in package.json); add `@repo/ui`, `@repo/features`, `@repo/marketing-components` as needed when building templates

**Files:** `packages/page-templates/src/`

**Dependency:** 3.1 must be complete before 3.2–3.8.

---

#### 3.2 Build HomePageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.1 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Config-driven section composition. Home page assembled from registry by section keys in config; hero, services, CTA, etc. from marketing-components.

**Files:** `packages/page-templates/src/templates/HomePageTemplate.tsx`

---

#### 3.3 Build ServicesPageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.2 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Grid/list/tabs layout driven by config; URL-synced filters. Uses ServicesOverview and ServiceDetailLayout from features.

**Files:** `packages/page-templates/src/templates/ServicesPageTemplate.tsx`

---

#### 3.5 Build ContactPageTemplate | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.10, 2.13 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Form + business info + optional map. Uses contact form variants and @repo/features/contact.

**Files:** `packages/page-templates/src/templates/ContactPageTemplate.tsx`

---

#### 3.8 Build BookingPageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.12 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Booking form with pre-fill context. Uses @repo/features/booking.

**Files:** `packages/page-templates/src/templates/BookingPageTemplate.tsx`

---

## Template Breadth

#### 3.4 Build AboutPageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.3, 2.17 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Configurable sections: Story, Team, Mission, Values, Timeline. Trust modules (certs, awards, press).

---

#### 3.6 Build BlogIndexTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.14 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Blog listing with filters, categories, tags, SEO-friendly pagination.

---

#### 3.7 Build BlogPostTemplate | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.14 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Individual post layout with metadata, related posts, inline CTA slots, structured data hooks.

---

## Integrations Expansion

#### 4.1 Email Marketing Integrations | **Effort:** 6 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | Mailchimp, SendGrid, ConvertKit. Provider adapter contracts with retry/timeout behavior.

**Subtasks (parent complete when all done):**

- **4.1a** Provider adapter contract (retry/timeout)
- **4.1b** Mailchimp
- **4.1c** SendGrid
- **4.1d** ConvertKit

#### 4.2 Scheduling Integrations | **Effort:** 6 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | Calendly, Acuity, Cal.com. Abstracted behind one scheduling interface. Consent-based lazy loading.

**Subtasks (parent complete when all done):**

- **4.2a** Scheduling interface + consent/lazy-load
- **4.2b** Calendly
- **4.2c** Acuity
- **4.2d** Cal.com

#### 4.3 Chat Support Integrations | **Effort:** 5 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | Intercom, Crisp, Tidio. Lazy loading, consent-gated, provider-neutral API.

#### 4.4 Review Platform Integrations | **Effort:** 5 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | Google Reviews, Yelp, Trustpilot. Normalized schema with source/moderation flags.

#### 4.5 Maps Integration | **Effort:** 3 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | Google Maps embed. Progressive enhancement, static-map preview for LCP.

#### 4.6 Industry Schemas Package | **Effort:** 6 hrs | **Deps:** None

**Status:** [ ] TODO | JSON-LD structured data generators for SEO. Typed, snapshot-tested, per-industry.

**Subtasks (parent complete when all done):**

- **4.6a** JSON-LD generator base + types
- **4.6b** Per-industry schema implementations
- **4.6c** Snapshot tests

---

## Client Factory (Wave 3) — Starter and First Example Clients

> `clients/` currently has only README.md. These tasks create the golden-path starter and first two example clients. Until 6.8 (CLI) exists, new clients are created by copying the starter; optional: document "clone/copy starter" in 5.1.

#### 5.1 Create Starter-Template in clients/ | **Effort:** 6 hrs | **Dependencies:** 3.1, 3.2, 3.3, 3.5, 3.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**What:** Thin Next.js shell in `clients/starter-template/`: root layout (ThemeInjector + providers), page routes that use HomePageTemplate, ServicesPageTemplate, ContactPageTemplate, BookingPageTemplate; `site.config.ts` as the only file a client changes. No business logic in the client — everything from packages.

**Subtasks (parent complete when all done):**

- **5.1a** Next.js shell (layout, ThemeInjector, providers)
- **5.1b** Routes (home, services, contact, book, about, blog) + page templates
- **5.1c** `site.config.ts` validation + README/setup

**Technical Requirements:**

- `app/layout.tsx`, `app/page.tsx` (HomePageTemplate), `app/about/`, `app/services/`, `app/contact/`, `app/blog/`, `app/book/`, `app/api/` (health, OG)
- `site.config.ts` — validated with siteConfigSchema at build
- `middleware.ts`, `next.config.js`, `tailwind.config.js`, `package.json` (deps: @repo/page-templates, @repo/features, @repo/ui, @repo/marketing-components)
- README with setup, deploy, customization quickstart

**Files:** `clients/starter-template/`

**Dependency:** Minimum page set (3.2, 3.3, 3.5, 3.8) must be done before 5.1. 5.2, 5.3 use this as single source.

---

#### 5.2 Luxe-Salon Example Client | **Effort:** 3 hrs | **Dependencies:** 5.1 | **Batch:** D

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Example: salon industry. Copy starter-template to `clients/luxe-salon/`; `site.config.ts`: industry `salon`, booking true, team `grid`. Validates config-driven assembly.

**Files:** `clients/luxe-salon/`

---

#### 5.3 Bistro-Central Example Client | **Effort:** 3 hrs | **Dependencies:** 5.1 | **Batch:** D

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Example: restaurant industry. Copy starter-template to `clients/bistro-central/`; `site.config.ts`: industry `restaurant`, booking true. Validates multi-industry config.

**Files:** `clients/bistro-central/`

---

## More Client Examples

#### 5.4 Law Firm Client Example | **Effort:** 4 hrs | **Deps:** 5.1 | **Batch:** D

**Status:** [ ] TODO | `clients/chen-law/`. Practice Areas, Attorneys, Case Results. Legal disclaimers.

#### 5.5 Medical Client Example | **Effort:** 4 hrs | **Deps:** 5.1 | **Batch:** D

**Status:** [ ] TODO | `clients/sunrise-dental/`. Services, Doctors, Insurance, Booking.

#### 5.6 Retail Client Example | **Effort:** 4 hrs | **Deps:** 5.1 | **Batch:** D

**Status:** [ ] TODO | `clients/urban-outfitters/`. Products, Locations, Lookbook.

---

# LATER — Scale, Harden, and Differentiate

---

## Cleanup & Documentation (Priority 6)

#### 6.1 Migrate Template Content | **Effort:** 4 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Move reusable hair-salon components to `@repo/marketing-components`. Define reusability rubric.

#### 6.2 Create Migration Guide | **Effort:** 3 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Document template-to-client migration: steps, breaking changes, common pitfalls. File: `docs/migration/template-to-client.md`

#### 6.2a Update clients/README for CaCA and Starter-Template | **Effort:** 1 hr | **Deps:** 5.1

**Status:** [ ] TODO | Update `clients/README.md` for Configuration-as-Code workflow: remove references to `templates/shared` and manual copy-from-template; document starter-template as golden path and site.config.ts–only customization. Align with 5.1 (starter) and 5.2/5.3 examples.

#### 6.3 Remove Templates Directory | **Effort:** 2 hrs | **Deps:** 6.1, 5.2-5.6

**Status:** [ ] TODO | Delete `templates/` after all clients migrated. Require migration matrix sign-off + final grep for template references.

#### 6.4 Create Component Library Documentation | **Effort:** 6 hrs | **Deps:** 1.1-1.6, 2.1-2.10 | **Batch:** H

**Status:** [ ] TODO | Storybook or Markdown docs. Per-component: usage, props, accessibility, live demos, dos/don'ts.

**Subtasks (parent complete when all done):**

- **6.4a** Storybook (or doc tool) setup
- **6.4b** Per-component docs (usage, props, a11y, demos)

#### 6.5 Create Configuration Reference | **Effort:** 4 hrs | **Deps:** 1.8 | **Batch:** H

**Status:** [ ] TODO | Complete `site.config.ts` docs. All fields: type, default, required, examples. File: `docs/configuration/`

#### 6.6 Create Feature Documentation | **Effort:** 4 hrs | **Deps:** 2.12-2.19 | **Batch:** H

**Status:** [ ] TODO | Per-feature: usage guide, config options, integration guides, API reference. State diagrams for workflows. File: `docs/features/`

#### 6.7 Create Architecture Decision Records | **Effort:** 3 hrs | **Deps:** All above | **Batch:** H

**Status:** [ ] TODO | ADRs: feature-based architecture, Radix UI, pnpm catalog, industry-agnostic design. File: `docs/adr/`

#### 6.8 Create CLI Tooling | **Effort:** 8 hrs | **Deps:** 6.3

**Status:** [ ] TODO | `pnpm create-client`, `pnpm validate-config`, `pnpm generate-component`. Scaffold tools that encode architecture standards.

**Subtasks (parent complete when all done):**

- **6.8a** `pnpm create-client` (scaffold from starter)
- **6.8b** `pnpm validate-config`
- **6.8c** `pnpm generate-component` (optional)

#### 6.9 Remove Dead Code and Unused Dependencies | **Effort:** 3 hrs | **Deps:** 6.1, 6.3

**Status:** [ ] TODO | Post-migration hygiene. Use knip/depcheck. Validate no runtime deps accidentally removed.

---

## Automation / Scripts (Planned)

> Implements the commands referenced in "Scripted Execution Model (Planned)" above. Root `package.json` currently has no `program:wave*`, `health`, or `validate-client` scripts.

#### 6.10a Add validate-client Script | **Effort:** 2 hrs | **Deps:** 5.1 | **Batch:** G

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Create `scripts/validate-client.ts` (or .js): validate `site.config.ts` with siteConfigSchema, check required routes exist, metadata present, build smoke. Add root script `"validate-client": "node scripts/validate-client.js"` (or ts-node/tsx). Per THEGOAL [5.1].

---

#### 6.10b Add health-check Script | **Effort:** 2 hrs | **Deps:** None | **Batch:** G

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Create `scripts/health-check.ts`: single `pnpm health` command that runs lint, type-check, build, test (or a subset). Per THEGOAL [INNOV-3].

---

#### 6.10c Add program:wave0–wave3 Scripts | **Effort:** 1 hr | **Deps:** 6.10a, 6.10b | **Batch:** G

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

Add root scripts: `program:wave0` (repo integrity + gates), `program:wave1` (feature extraction + parity), `program:wave2` (template assembly + routes), `program:wave3` (starter/client verification). Each runs the relevant validation commands for that wave.

---

## Cross-Cutting Governance (C.1-C.18)

#### C.1 Enforce Circular Dependency and Layering Checks | **Effort:** 2 hrs | **Deps:** 0.11 | **Batch:** I

**Status:** [ ] TODO | Graph validation to block circular deps and invalid upward imports. Script: `scripts/architecture/check-dependency-graph.ts`

#### C.2 Harden pnpm Policy and Workspace Determinism | **Effort:** 2 hrs | **Deps:** 0.1, 0.2 | **Batch:** I

**Status:** [ ] TODO | Align package-management policy. Document linker, peer, and workspace rules. CI validation.

#### C.3 Enable Turborepo Remote Cache | **Effort:** 2 hrs | **Deps:** 0.3, 0.13 | **Batch:** I

**Status:** [ ] TODO | Remote caching for CI + local. Cache hit-rate tracking. Fallback behavior.

#### C.4 Add Multi-Track Release Strategy (Canary + Stable) | **Effort:** 3 hrs | **Deps:** 0.12 | **Batch:** I

**Status:** [ ] TODO | Pre-release channels. Canary TTL, promotion checklist.

#### C.5 Implement Three-Layer Design Token Architecture | **Effort:** 6 hrs | **Deps:** 1.8 | **Batch:** I

**Status:** [ ] TODO | Option/decision/component token layers. CSS files in `packages/config/tokens/`. W3C DTCG alignment. Builds on 0.14 (ThemeInjector).

**Subtasks (parent complete when all done):**

- **C.5a** Option tokens
- **C.5b** Decision tokens
- **C.5c** Component tokens (W3C DTCG)

#### C.6 Add Motion Primitives and Creative Interaction Standards | **Effort:** 4 hrs | **Deps:** 1.1-1.6, C.5 | **Batch:** I

**Status:** [ ] TODO | Reusable entrance/emphasis/page-transition primitives. Motion budget guideline per page. `prefers-reduced-motion` alternatives.

#### C.7 Make Storybook + Visual Regression Testing Mandatory | **Effort:** 5 hrs | **Deps:** 6.4 | **Batch:** I

**Status:** [ ] TODO | Component showroom + visual regression CI checks. Baseline snapshots for key components.

**Subtasks (parent complete when all done):**

- **C.7a** Storybook mandatory setup
- **C.7b** Visual regression CI + baselines

#### C.8 Build Experimentation Platform (A/B + Feature Flags) | **Effort:** 6 hrs | **Deps:** 1.8, 3.2, 5.1 | **Batch:** I

**Status:** [ ] TODO | Deterministic assignment, variant selection, outcome instrumentation, kill-switch.

#### C.9 Add Personalization Rules Engine | **Effort:** 6 hrs | **Deps:** C.8 | **Batch:** I

**Status:** [ ] TODO | Privacy-safe personalization (geo, returning visitor, campaign source). Rules-first, consent-aware.

#### C.10 Build CMS Abstraction Layer (MDX + Sanity + Storyblok) | **Effort:** 8 hrs | **Deps:** 2.14, 3.6, 3.7 | **Batch:** I

**Status:** [ ] TODO | Adapter pattern for content sources. Contract tests per adapter. Fallback priority.

**Subtasks (parent complete when all done):**

- **C.10a** Adapter contract + contract tests
- **C.10b** MDX adapter
- **C.10c** Sanity adapter
- **C.10d** Storyblok adapter

#### C.11 Implement Localization and RTL Foundation | **Effort:** 5 hrs | **Deps:** 5.1, 3.2-3.8 | **Batch:** I

**Status:** [ ] TODO | i18n routing, locale dictionaries, RTL compatibility. Pseudo-locale testing.

#### C.12 Standardize Conversion Event Taxonomy | **Effort:** 4 hrs | **Deps:** 4.1-4.5, C.8 | **Batch:** I

**Status:** [ ] TODO | Single analytics event contract (naming, payload, PII policy). Automated drift tests.

#### C.13 Add Continuous Security Program (SAST + Deps + SSRF/XSS) | **Effort:** 5 hrs | **Deps:** 0.9, 0.10 | **Batch:** I

**Status:** [ ] TODO | Continuous scanning, OWASP Top 10 regression tests, triage SLAs.

#### C.14 Add Performance and Reliability SLO Framework | **Effort:** 4 hrs | **Deps:** 0.6, 0.13 | **Batch:** I

**Status:** [ ] TODO | SLOs with CI gates, alert thresholds, per-client reporting.

#### C.15 Adopt Spec-Driven Development Workflow | **Effort:** 3 hrs | **Deps:** 6.7 | **Batch:** I

**Status:** [ ] TODO | Feature specs before implementation. Templates in `.kiro/specs/`.

#### C.16 Add AI-Assisted Delivery Playbooks | **Effort:** 3 hrs | **Deps:** C.15 | **Batch:** I

**Status:** [ ] TODO | Repeatable AI workflows for implementation, test generation, review.

#### C.17 Add Industry Compliance Feature Pack Framework | **Effort:** 4 hrs | **Deps:** 1.9, 4.6 | **Batch:** I

**Status:** [ ] TODO | Medical privacy, legal disclaimers, secure upload. Composable, jurisdiction-aware packs.

#### C.18 Add Edge Personalization and Experiment Routing | **Effort:** 4 hrs | **Deps:** C.8, C.9 | **Batch:** I

**Status:** [ ] TODO | Edge middleware for variant selection. Deterministic hashing, cache-aware keys.

---

## Advanced Recommendations (D.1-D.8)

#### D.1 Create Schema Governance Program | **Effort:** 4 hrs | **Deps:** C.12 | **Batch:** I

**Status:** [ ] TODO | Schema versioning, compatibility classes, deprecation policy. Validation tooling.

#### D.2 Add Experimentation Statistics and Guardrails | **Effort:** 5 hrs | **Deps:** C.8 | **Batch:** I

**Status:** [ ] TODO | SRM checks, minimum run windows, guardrail metrics. Standard report format.

#### D.3 Create Editorial Workflow and Preview Governance | **Effort:** 4 hrs | **Deps:** C.10 | **Batch:** I

**Status:** [ ] TODO | Content lifecycle states, secure preview access, emergency rollback.

#### D.4 Create Tenant Operations and Capacity Playbook | **Effort:** 4 hrs | **Deps:** 5.1, C.17 | **Batch:** I

**Status:** [ ] TODO | Onboarding/offboarding runbooks, quotas, capacity planning.

#### D.5 Establish Incident Management and Error Budget Policy | **Effort:** 4 hrs | **Deps:** C.14 | **Batch:** I

**Status:** [ ] TODO | Severity matrix, postmortem template, error budget release gating.

#### D.6 Add Continuous Accessibility Gates and Rubrics | **Effort:** 4 hrs | **Deps:** 0.7, 6.4 | **Batch:** I

**Status:** [ ] TODO | PR and release a11y gates, automated checks in CI, component rubric.

#### D.7 Add Ownership and Escalation Matrix | **Effort:** 2 hrs | **Deps:** None | **Batch:** I

**Status:** [ ] TODO | DRIs and escalation paths by package and domain.

#### D.8 Add Software Supply Chain Security Program | **Effort:** 4 hrs | **Deps:** C.13 | **Batch:** I

**Status:** [ ] TODO | SBOM, provenance/attestations, dependency integrity in CI.

---

## Innovation Programs (E.1-E.7, F.1-F.12)

### Round 1 — Adjacency-Derived Innovation

#### E.1 Implement Perceived Performance Standards Pack | **Effort:** 4 hrs | **Deps:** 0.6, C.14

**Status:** [ ] TODO | Latency-band response patterns. Loading feedback components.

#### E.2 Create Conversion Service Blueprints | **Effort:** 4 hrs | **Deps:** 2.12, 2.13, 2.20

**Status:** [ ] TODO | Frontstage/backstage maps for booking, contact, quote, search flows.

#### E.3 Add Error-Budget Release Gate | **Effort:** 4 hrs | **Deps:** C.14, D.5

**Status:** [ ] TODO | Gate release velocity on SLO/error-budget burn. Freeze criteria.

#### E.4 Build Internal Platform Golden Paths | **Effort:** 5 hrs | **Deps:** 6.8, D.7

**Status:** [ ] TODO | Productized developer workflows with DevEx metrics.

#### E.5 Add PR/FAQ + JTBD Intake for Major Features | **Effort:** 3 hrs | **Deps:** C.15

**Status:** [ ] TODO | Customer-outcome framing before implementation.

#### E.6 Create Progressive Conversion UX Primitives | **Effort:** 4 hrs | **Deps:** C.6, 2.10, 3.5

**Status:** [ ] TODO | Step confidence, progress pacing, decision support components.

#### E.7 Add Queueing and Async Pipeline Governance | **Effort:** 4 hrs | **Deps:** E.2

**Status:** [ ] TODO | Queue fairness rules, timeout/retry policies, observability.

### Round 2 — Non-Direct-Domain Innovation

#### F.1 Create High-Reliability Preflight Checklist Program | **Effort:** 3 hrs | **Deps:** 0.13, C.13

**Status:** [ ] TODO | HRO-style preflights + near-miss capture for high-risk changes.

#### F.2 Apply Cynefin-Based Execution Modes | **Effort:** 3 hrs | **Deps:** D.7

**Status:** [ ] TODO | Classify backlog by domain (clear/complicated/complex/chaotic).

#### F.3 Add Leverage-Point Scoring for Prioritization | **Effort:** 3 hrs | **Deps:** C.1, C.12

**Status:** [ ] TODO | System leverage scoring for durable interventions over local optimizations.

#### F.4 Add Peak-End Journey Optimization Track | **Effort:** 4 hrs | **Deps:** E.6, C.12

**Status:** [ ] TODO | Instrument high-emotion peaks and completion endings.

#### F.5 Create Framing Experiment Library | **Effort:** 4 hrs | **Deps:** C.8, D.2

**Status:** [ ] TODO | Reusable, ethically bounded framing variants for offers/CTAs.

#### F.6 Add Participatory Personalization Patterns | **Effort:** 4 hrs | **Deps:** C.9

**Status:** [ ] TODO | Low-friction co-creation moments (IKEA effect).

#### F.7 Create Wayfinding and Information Hierarchy Standards | **Effort:** 3 hrs | **Deps:** 3.2, 3.3, 3.5

**Status:** [ ] TODO | Urban wayfinding principles applied to route architecture and navigation.

#### F.8 Add Statistical Process Control for Delivery Quality | **Effort:** 5 hrs | **Deps:** C.14

**Status:** [ ] TODO | Control-chart monitoring for build variance, flake rate, regressions.

#### F.9 Add Mission-Command Governance for Parallel Execution | **Effort:** 3 hrs | **Deps:** D.7, C.16

**Status:** [ ] TODO | Centralized intent + decentralized execution model.

#### F.10 Add Portfolio Kanban WIP Policy | **Effort:** 3 hrs | **Deps:** C.1, D.7

**Status:** [ ] TODO | WIP limits and classes of service across refactor lanes.

#### F.11 Add Knowledge-Conversion System | **Effort:** 3 hrs | **Deps:** 6.4, 6.6, 6.7

**Status:** [ ] TODO | Tacit-to-explicit knowledge conversion (patterns, playbooks, ADRs).

#### F.12 Add Service Recovery and Failure-Response UX Standard | **Effort:** 4 hrs | **Deps:** E.1, F.1

**Status:** [ ] TODO | Trust recovery after failed interactions. Message templates by severity.

---

## Future AOS Layers (Phase 7+)

### Phase 7: AI & Intelligence Layer (Weeks 13-16)

#### 7.1 AI Content Engine | **Effort:** 12 hrs | **Deps:** 1.8

**Status:** [ ] TODO | Generative AI for content creation/optimization. SEO descriptions, image generation, A/B variants. Uses OpenAI API, Vercel AI SDK.

**Subtasks (parent complete when all done):**

- **7.1a** SEO/description generation
- **7.1b** Image generation
- **7.1c** A/B variants pipeline

#### 7.2 LLM Gateway | **Effort:** 8 hrs | **Deps:** None

**Status:** [ ] TODO | Unified multi-provider interface (OpenAI, Anthropic, Google). Automatic fallback, token tracking.

#### 7.3 Agent Orchestration (MVP) | **Effort:** 16 hrs | **Deps:** 7.2

**Status:** [ ] TODO | Simple trigger-based agents. Content SEO optimization on draft, structured data on publish.

**Subtasks (parent complete when all done):**

- **7.3a** Trigger + agent registry
- **7.3b** Content SEO on draft
- **7.3c** Structured data on publish

### Phase 8: Content & Asset Layer (Weeks 17-20)

#### 8.1 Visual Page Builder | **Effort:** 20 hrs | **Deps:** 3.2

**Status:** [ ] TODO | Storyblok-like visual editor. Drag-drop, real-time preview, save/restore layouts.

**Subtasks (parent complete when all done):**

- **8.1a** Drag-drop + layout model
- **8.1b** Real-time preview
- **8.1c** Save/restore + persistence

#### 8.2 Digital Asset Management (DAM) | **Effort:** 12 hrs | **Deps:** None

**Status:** [ ] TODO | Asset management with AI tagging, format conversion (WebP, AVIF), rights tracking.

### Phase 9: Marketing Operations (Weeks 21-24)

#### 9.1 Campaign Orchestration (MVP) | **Effort:** 24 hrs | **Deps:** 1.8, 7.3

**Status:** [ ] TODO | Campaign workflow automation. Task dependencies, approval chains, resource allocation.

**Subtasks (parent complete when all done):**

- **9.1a** Workflow + task dependencies
- **9.1b** Approval chains
- **9.1c** Resource allocation

### Phase 10: Infrastructure & Multi-Tenancy (Weeks 25-28)

#### 10.1 Advanced Multi-Tenancy | **Effort:** 16 hrs | **Deps:** 5.1

**Status:** [ ] TODO | Full SaaS multi-tenant isolation. Automated provisioning, per-tenant feature flags, custom domain SSL.

---

# Reference Material

---

## Code Patterns & Templates

### Metaheader Template (Use for EVERY new file)

```typescript
// File: [FILE_PATH]  [TRACE:FILE=[DOT_NOTATION_PATH]]
// Purpose: [One sentence describing what this file does]
//
// Exports / Entry: [What this file exports]
// Used by: [What uses this file]
//
// Invariants:
// - [Rule 1]
// - [Rule 2]
//
// Status: @public or @internal
// Features:
// - [FEAT:CATEGORY] Description
```

### Component Pattern Template

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as RadixComponent from '@radix-ui/react-[component]';
import { cn } from '@repo/utils';
import { forwardRef } from 'react';

const [component]Variants = cva("base-classes", {
  variants: {
    variant: { default: "variant-classes" },
    size: { default: "size-classes" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface [Component]Props
  extends React.ComponentPropsWithoutRef<typeof RadixComponent.Root>,
    VariantProps<typeof [component]Variants> {}

export const [Component] = forwardRef<
  React.ElementRef<typeof RadixComponent.Root>,
  [Component]Props
>(({ className, variant, size, ...props }, ref) => (
  <RadixComponent.Root
    ref={ref}
    className={cn([component]Variants({ variant, size }), className)}
    {...props}
  />
));
[Component].displayName = "[Component]";
```

### Package.json Template

```json
{
  "name": "@repo/[package-name]",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/utils": "workspace:*",
    "@repo/config": "workspace:*"
  },
  "peerDependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "catalog:"
  }
}
```

### Feature Package Structure

```typescript
// packages/features/src/[feature]/index.ts
export { [Feature]Form } from './components/[Feature]Form';
export { [feature]Schema, type [Feature]Data } from './lib/schema';
export { submit[Feature] } from './lib/actions';
export { [FEATURE]_PROVIDERS } from './lib/providers';
```

---

## File Reference Guide

| Task                   | Must Read Files                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **UI Components**      | `packages/ui/src/components/Button.tsx`, `Input.tsx`, `Accordion.tsx`                                        |
| **Configuration**      | `packages/types/src/site-config.ts` (post-0.8; Zod schema `siteConfigSchema` in same file, no separate site-config.schema.ts), `templates/hair-salon/site.config.ts`, `pnpm-workspace.yaml` |
| **Feature Extraction** | Source of truth: `packages/features/src/` (booking, contact, blog, services, search). Template `templates/hair-salon/features/` re-exports from @repo/features. For booking (schema+actions+providers+test): `packages/features/src/booking/`. |
| **Search Feature**     | `packages/features/src/search/` (SearchDialog, SearchPage), `templates/hair-salon/lib/search.ts` (adapter over feature) |
| **Services Feature**   | `packages/features/src/services/` (ServicesOverview, ServiceDetailLayout)                                     |
| **Metaheaders**        | Any file in `packages/ui/src/components/`                                                                    |
| **Package Setup**      | `packages/ui/package.json`, `packages/infra/package.json`                                                    |
| **Testing**            | `packages/infra/__tests__/` (9 files), `templates/hair-salon/lib/__tests__/` (2 files)                       |
| **Env Validation**     | `packages/infra/env/schemas/` (7 Zod schemas)                                                                |
| **Security**           | `packages/infra/security/csp.ts` (nonce generation)                                                          |
| **Shared Types**       | `packages/types/src/site-config.ts` (SiteConfig, ConversionFlowConfig)                                       |

### Radix UI Primitives

> shadcn/ui now uses the unified `radix-ui` package. Consider for fewer deps/simpler imports. Decision should be documented in ADR.

| Component | Individual Package              | Unified    | Used For        |
| --------- | ------------------------------- | ---------- | --------------- |
| Dialog    | `@radix-ui/react-dialog`        | `radix-ui` | Modal, Lightbox |
| Toast     | `sonner` (already installed)    | —          | Notifications   |
| Tabs      | `@radix-ui/react-tabs`          | `radix-ui` | Tabbed content  |
| Dropdown  | `@radix-ui/react-dropdown-menu` | `radix-ui` | Menus           |
| Tooltip   | `@radix-ui/react-tooltip`       | `radix-ui` | Help text       |
| Popover   | `@radix-ui/react-popover`       | `radix-ui` | Rich overlays   |

### Existing Dependencies (Already in Template)

- `react-hook-form` + `@hookform/resolvers` (3.9.1) — Forms with Zod
- `zod` (3.22.4) — Validation schemas
- `sonner` (^2.0.7) — Toast notifications
- `lucide-react` (0.344.0) — Icons
- `clsx` (2.1.1) + `tailwind-merge` (2.6.1) — Class merging (in @repo/utils)
- `@upstash/ratelimit` (2.0.5) + `@upstash/redis` (1.34.3) — Rate limiting
- `next-mdx-remote` (5.0.0) — MDX rendering
- `gray-matter` (4.0.3) — Frontmatter parsing
- `date-fns` (^4.1.0) — Date formatting
- `reading-time` (1.5.0) — Blog read time
- `rehype-pretty-code` (0.14.1) + `rehype-slug` (6.0.0) + `remark-gfm` (4.0.0) — MDX plugins
- `@sentry/nextjs` (10.38.0) — Error tracking

---

## Success Criteria

### Phase Gates

**After Wave 0 (Day 2):**

- [ ] No config file conflicts (.npmrc/.pnpmrc reconciled)
- [ ] Workspace globs synced
- [ ] Turborepo upgraded to latest stable
- [ ] All known bugs fixed (0.14-0.32)
- [ ] Tooling installed (knip, syncpack, export validation)
- [ ] CI quality gates enforced
- [ ] `pnpm install && pnpm turbo lint type-check build test` green

**After Wave 1 (Day 6):**

- [ ] @repo/types with enhanced SiteConfig + 12 industry configs
- [ ] Core features extracted (booking, contact, services, search)
- [ ] Testing strategy established with parity suite
- [ ] Feature packages build and type-check independently

**After Wave 2 (Day 9):**

- [ ] 3.1 registry implemented (page-templates src/ and section registry)
- [ ] Minimum page template set: 3.2 HomePageTemplate, 3.3 ServicesPageTemplate, 3.5 ContactPageTemplate, 3.8 BookingPageTemplate (plus 3.4, 3.6, 3.7 as needed)
- [ ] Config-driven section composition working
- [ ] Templates pass a11y and performance smoke checks

**After Wave 3 (Day 12):**

- [ ] 5.1 starter-template in `clients/starter-template/`; thin Next.js shell using page-templates
- [ ] At least 5.2 and 5.3 (or two example clients) validated end-to-end
- [ ] New client = copy starter and edit only `site.config.ts` (CLI `turbo gen new-client` optional, see 6.8)
- [ ] Migration validation matrix complete; cutover/rollback runbook documented

### Definition of Done (End of Week 12)

- [ ] **No templates directory exists**
- [ ] **At least 5 example clients** demonstrating different industries
- [ ] **All features extracted** to `packages/features/` (9 features)
- [ ] **Component library has 20+ components** (14 UI + 10 marketing + variants)
- [ ] **Configuration-driven** — new client requires only `site.config.ts`
- [ ] **Documentation complete** — onboard new developer in < 30 minutes
- [ ] **All tests passing** — `pnpm build && pnpm test` green
- [ ] **No performance regression** — CWV scores equal or better than baseline

### Quality Gates

- [ ] **Accessibility:** WCAG 2.2 AA (automated + manual)
- [ ] **Performance:** LCP < 2.5s, INP < 200ms, CLS < 0.1 (INP is the standard responsiveness metric; it replaced FID in March 2024)
- [ ] **Security:** CSP with nonce, security headers, privacy compliance
- [ ] **Type Safety:** TypeScript strict mode, no `any` types, all exports typed
- [ ] **Test Coverage:** > 50% Phase 1, > 80% packages/ui + packages/features by Phase 6
- [ ] **Bundle Size:** JS < 200KB, CSS < 50KB per client page

---

## Risk Mitigation

> For 2026 stack choices, tooling landscape, and methodology (design tokens, spec-driven dev, AOS layers), see [RESEARCH_ENHANCED.md](RESEARCH_ENHANCED.md).

| Risk                        | Mitigation                                                |
| --------------------------- | --------------------------------------------------------- |
| **Migration Risk**          | Keep template functional until all clients migrated       |
| **Breaking Changes**        | Semantic versioning for packages (changesets)             |
| **Scope Creep**             | Strict wave adherence, defer nice-to-haves to NEXT/LATER  |
| **Testing Gap**             | Add tests during extraction; 50% target for Phase 1       |
| **Tailwind v4 Churn**       | Evaluate in 0.4; defer if high risk, document ADR         |
| **Next.js 16 Compat**       | Evaluate in 0.5; stay on 15 LTS if stability is priority  |
| **Config Drift**            | Wave 0 fixes + syncpack + catalog codemod                 |
| **Dep Misplacement**        | Audit all package.json during extraction (0.9 pattern)    |
| **Performance Regression**  | Baseline in 0.6; measure after each wave                  |
| **Theme Not Wired**         | 0.14 (ThemeInjector) fixes the broken config→CSS pipeline |
| **Turbo Cache Correctness** | 0.29 (globalEnv) prevents incorrect cache hits            |
| **Node Version Lock**       | 0.28 relaxes engine to >=22 (LTS)                         |

---

## Scripted Execution Model (Planned)

> **Note:** The commands below are **not yet implemented** in root `package.json`. Add them via the Automation / scripts tasks in LATER (see below).

```bash
# Wave gate validation commands (planned)
pnpm program:wave0    # validates repo integrity tasks and gates
pnpm program:wave1    # runs feature extraction checks + parity tests
pnpm program:wave2    # validates template assembly and route integrity
pnpm program:wave3    # spins starter/client verification and smoke tests

# Health check (after Wave 0) (planned)
pnpm health           # runs all validation checks in one command

# Client operations
turbo gen new-client  # scaffold new client from starter template (see 6.8)
pnpm validate-client <path>  # config schema + route + metadata + build smoke (planned)
```

---

## Quick Command Reference

```bash
pnpm install                              # Install all dependencies
pnpm --filter @repo/ui add @radix-ui/react-dialog  # Add dep to specific package
pnpm -r run build                         # Run build in all packages
pnpm --filter "...[origin/main]" run build # Build changed packages only
pnpm turbo build                          # Build with Turborepo
pnpm turbo lint type-check test build     # Full CI check locally
```

---

## Program Cadence

- **Daily:** Execute NOW lanes with WIP limit of 1 in-progress task per lane
- **Twice weekly:** Unblock review + dependency review across lanes
- **Weekly release train:** Ship from completed NOW tasks only; defer NEXT/LATER unless blocking

---

_TODO Last Updated: February 17, 2026_
_Completed tasks moved to ARCHIVE.md. This file contains only open tasks._
