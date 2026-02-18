# Marketing Website Monorepo — Research Digest

_Last updated:_ February 18, 2026  
_Purpose:_ single-source research summary for the marketing-websites monorepo. Task specs live under `tasks/*.md`; only keep cross-cutting research here.

---

## 1. Repository Snapshot

### 1.1 Workspace Overview

```
packages/
  ai-platform/         # LLM + agent orchestration experiments
  config/              # Shared ESLint/TS/Tailwind configs
  content-platform/    # CMS tooling research
  features/            # Booking, contact, blog, etc.
  industry-schemas/    # JSON-LD generator scaffold (needs schema content)
  infra/               # Legacy env/security helpers
  infrastructure/      # Tenant/edge/observability experiments
  integrations/        # Calendly/Acuity, chat, reviews, maps, etc.
  marketing-components/# Organisms + sections (package.json already present)
  marketing-ops/       # Agency Operating System (AOS) research
  page-templates/      # Registry scaffold (no prod templates yet)
  types/               # Shared types
  ui/                  # Radix-based primitives
  utils/               # Utility helpers
apps/
clients/               # Client implementations (starter-template, luxe-salon, etc.)
tooling/               # Internal CLIs + scripts
```

### 1.2 Toolchain

| Layer           | Current Choice                  | Notes                                            |
| --------------- | ------------------------------- | ------------------------------------------------ |
| Runtime         | Node 22+                        | Matches pnpm/Turbo requirements                  |
| Package manager | pnpm 10.x                       | Catalog pins React/Next/TS                       |
| Task runner     | Turborepo 2.x                   | Remote caching enforced via `TURBO_TOKEN`        |
| Framework       | Next.js 16.1 + React 19         | App Router + RSC + Server Actions                |
| Styling         | Tailwind CSS 3.4                | v4 migration optional; document if pursued       |
| Testing         | Vitest (unit), Playwright (e2e) | Jest references should be removed from new specs |

---

## 2. Architecture Highlights

- Dependency order: `config → utils → ui/types/infra → features → marketing-components → page-templates → clients`.
- All new UI work uses Radix + shadcn patterns (copy/paste). Base UI allowed if trade-offs documented.
- `marketing-components` now has proper exports; tasks claiming “needs package.json” are obsolete.
- `industry-schemas` package exists; next steps focus on adding schema coverage rather than scaffolding.
- INP replaced FID in March 2024; all performance language should mention INP, not FID.
- WCAG 2.2 AA touch-target and focus requirements apply to every UI task — reference `docs/accessibility/component-a11y-rubric.md`.
- AI/agent work happens in `packages/ai-platform` and `packages/marketing-ops`; cite these paths when referencing automation research.

---

## 3. Technology Reference (Condensed)

### 3.1 Next.js & React

- App Router, Server Components, Server Actions by default.
- Partial prerendering optional via `ppr: true` (experimental).
- Turbopack dev server, remote caching in CI.

### 3.2 Styling & Design Tokens

- Tailwind 3.4 with CSS custom properties layering (foundation → semantic → component).
- v4 migration note retained but marked as “evaluate before acting”.
- Tokens live in `packages/ui/tokens`; keep W3C Design Token alignment.

### 3.3 Validation & Forms

- Zod + React Hook Form recommended stack (see snippet in `packages/features/*` specs).
- Validation schemas co-located with feature packages.

### 3.4 Security & Privacy

- Strict CSP (nonce-based) + modern security headers.
- Privacy-first analytics: Plausible/Umami/PostHog recommended; gating handled in future consent service.
- Consent lifecycle work planned under `packages/infra/consent` (status: TBD).

### 3.5 Performance Targets

| Metric | Target                     |
| ------ | -------------------------- |
| LCP    | < 2.5s                     |
| INP    | < 200 ms                   |
| CLS    | < 0.1                      |
| Bundle | < 250 KB gz per page shell |

Configure budgets in `next.config.js` (`performanceBudgets` field) and track via Lighthouse CI/WebPageTest.

---

## 4. Industry & Feature Research

- Industry sections (services, restaurants, professional services, retail, etc.) remain accurate; implementation details now live in task files (`tasks/6-x-*.md`).
- Integrations research (Calendly/Acuity, Intercom/Crisp, reviews, maps) maps to `packages/integrations/*` and tasks `4.2`–`4.6`.
- Feature breadth, infrastructure systems, and innovation tracks now live per-task; this digest only links the themes.

---

## 5. Strategic Initiatives (Pointers)

| Theme                       | Repo Touchpoints                                    |
| --------------------------- | --------------------------------------------------- |
| Consent & sustainability    | `packages/infra/consent`, `docs/sustainability/`    |
| Developer telemetry & DevEx | `apps/internal-dashboard`, `tooling/` CLI telemetry |
| Real-time feedback loops    | Planned `packages/realtime/` + BullMQ/Redis pattern |
| Edge-first personalization  | Middleware + `packages/marketing-ops/` research     |
| AI / Agent orchestration    | `packages/ai-platform/agent-orchestration/`         |

Each initiative has work items in `tasks/*.md`; update those files for tactical work.

---

## 6. Research Sources

- Next.js 16 docs, React 19 release notes
- pnpm + Turborepo documentation
- WCAG 2.2, Web Sustainability Guidelines (Jan 2026)
- web.dev INP guidance, Lighthouse CI, WebPageTest
- shadcn/ui + Radix UI patterns
- G2 Headless CMS rankings, Sanity/Strapi docs

---

## 7. Usage Guidance

1. Keep this file high-signal; move implementation details into `tasks/*.md`.
2. When architecture/tooling changes, update RESEARCH.md _and_ the task template in `tasks/prompt.md`.
3. Remove or rewrite sections as soon as they become stale; duplication with task specs should be avoided.

_For questions ping @research-leads or open a PR touching this file._

#### 6.5.2 Feature-Sliced Design (FSD)

**Note:** FSD organizes by business domain; [steiger](https://feature-sliced.design/) enforces architecture.

| Step | Implementation    |
| ---- | ----------------- | --------------------------------------------------------- |
| 1    | Refactor features | `booking/{ui,api,model,lib,config}/`; unidirectional flow |
| 2    | Add steiger to CI | Prevent cross-import violations                           |
| 3    | Document          | `docs/architecture/feature-sliced-design.md`              |

#### 6.5.3 Digital Twin Learning Layer (Future Phase)

| Step | Implementation           |
| ---- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| 1    | Data schema              | Anonymized aggregates: page views, conversions, component usage; warehouse (BigQuery/Snowflake) |
| 2    | Insights Engine          | `packages/intelligence/insights-engine` — scheduled pattern detection                           |
| 3    | Auto suggestions         | Create issues/PRs for affected clients                                                          |
| 4    | A/B Testing as a Service | Integrate C.8; deploy winning variants across clients                                           |

---

### 6.6 Strategic Enhancement Roadmap

| Priority                     | Enhancement                       | Existing Task | New Work                                            | Effort |
| ---------------------------- | --------------------------------- | ------------- | --------------------------------------------------- | ------ |
| **Immediate (2 weeks)**      |                                   |               |                                                     |        |
| 1                            | AEO Audit Tool                    | 6.10a         | `scripts/aeo-audit.ts`, validate-client integration | 8h     |
| 2                            | Green Code Linting                | C.13          | Custom ESLint rules                                 | 6h     |
| 3                            | Consent Service MVP               | C.13          | `packages/infra/consent/`, adapter changes          | 16h    |
| 4                            | CLI Telemetry                     | 6.8           | Add telemetry to CLI tools                          | 8h     |
| **Short-Term (3–6 weeks)**   |                                   |               |                                                     |        |
| 5                            | FSD Refactor & Linter             | —             | Refactor features, add steiger to CI                | 20h    |
| 6                            | Developer Satisfaction Scorecard  | E.4           | Survey script, dashboard                            | 12h    |
| 7                            | Sustainability Component Variants | 2.x           | `sustainable` variants                              | 16h    |
| 8                            | Content Refresher Agent MVP       | 7.3           | `content-optimizer` agent                           | 24h    |
| **Medium-Term (7–12 weeks)** |                                   |               |                                                     |        |
| 9                            | Everything-as-Code (Docs, Blog)   | 6.6           | Docs in packages, build docs site                   | 20h    |
| 10                           | SRR Automation                    | C.13          | `scripts/srr-handler.ts`                            | 12h    |
| 11                           | Real-Time Signal Processing       | C.9, C.18     | `signal-processor`, edge integration                | 24h    |
| 12                           | Privacy Pro Compliance Pack       | C.17          | Enhanced consent, anonymization                     | 16h    |
| **Long-Term (Post–Wave 3)**  |                                   |               |                                                     |        |
| 13                           | Digital Twin Insights Engine      | —             | Warehouse, pattern detection                        | 40h    |
| 14                           | Intent Marketplace APIs           | C.9           | `intent-receiver` package                           | 16h    |
| 15                           | A/B Testing as a Service          | C.8           | Integration with insights engine                    | 32h    |

---

## 10. UI Primitives Deep Dive (NEW)

> Applies to `packages/ui`, `packages/features`, and template consumers. Use Radix/Base UI primitives copied into @repo/ui (shadcn pattern) with Tailwind tokens.

### 10.1 Advanced Form Components

| Primitive             | 2026 Patterns                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Command Palette**   | `cmdk` + fuzzy search (Fuse.js/TanStack Match Sorter), <kbd>⌘/Ctrl</kbd>+<kbd>K</kbd> binding, keyboard-only navigation, action registry living beside feature adapters, optimistic optimistic updates for AI actions (LogRocket Linear clone ref, Feb 2026). |
| **Form System**       | React Hook Form 7 + Zod 3 (`@hookform/resolvers/zod`) for field-level validation, `useFormState` for async errors, `useFieldArray` for dynamic blocks, schema-driven form builder for Feature 2.31.                                                           |
| **Date/Time Pickers** | React Aria DatePicker or `react-day-picker@^9` with timezone normalization (Luxon/Temporal polyfill), locale-aware parsing, keyboard grid navigation, screen-reader hints for range selection.                                                                |
| **File Upload**       | `react-dropzone` or Uploady for drag/drop, chunked uploads, pause/resume (Tus), progress events, virus scanning hook (Cloudflare R2/S3).                                                                                                                      |
| **Color Picker**      | `react-colorful` + accessible presets, color-blind safe palettes (WCAG 2.2 contrast), Oklch token export to Tailwind.                                                                                                                                         |

### 10.2 Data Display Components

- **Table**: TanStack Table v8 headless core + TanStack Virtual for 10k+ rows, server-driven pagination/sorting for CMS adapters, row selection synced to Zustand store.
- **Tree View**: Roving tabindex, aria-expanded states, virtualization for deep hierarchies (docs navigation, schema explorer).
- **Timeline / Stepper**: Use CSS Scroll Snap + IntersectionObserver to pin progress, INP-friendly transitions (<100 ms).

### 10.3 Navigation & Layout

- **Breadcrumbs**: JSON-LD `BreadcrumbList`, Next.js `generateMetadata` hook integration, aria-label="breadcrumb".
- **Pagination**: SEO-friendly pattern (Strapi case study) limiting to two clicks from landing page, `rel="prev"/"next"`, canonical URLs.
- **Carousel/Masonry**: Prefers-reduced-motion support, pointer/keyboard controls, CSS masonry via `grid-template-rows: masonry` fallback to JS layout for Safari.

### 10.4 Interaction & Utility

- **Drag & Drop**: `@dnd-kit` sortable contexts, custom collision detection for multi-column marketing layouts, pointer + keyboard sensors.
- **Resizable Panels / Virtual Lists / Infinite Scroll**: TanStack Virtual headless virtualization, suspense-friendly loaders, loader rows for chat-like experiences.
- **Skeleton / Progress / Status**: Component-level performance budgets (skeleton widths mirror final layout), optimistic UI defaults per Part E.6.

### 10.5 Accessibility Guarantees

- Minimum 24×24 px hit targets, focus outlines ≥2px w/ 3:1 contrast, ARIA live regions for alerts/rating updates, `prefers-reduced-motion` fallbacks.

## 11. Marketing Component Patterns (NEW)

> Scope: `packages/marketing-components` (Task 1.7) and downstream template registries. Each family ships registry metadata (variants, industries, metrics) plus analytics hooks.

| Family                                      | Key Research Items                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Navigation Systems**                      | Responsive mega menu (LogRocket 2026): desktop hover panels + mobile drawer (Sheet) with focus trapping, analytics on menu depth, TTL caching of nav config. |
| **Footers**                                 | Multi-column grid, CTA slot, newsletter embed (ConvertKit/Mailchimp), trust badges, legal links (WCAG link contrast).                                        |
| **Blog / Portfolio / Case Studies**         | Pagination with canonical URLs, facet filters, MDX + CMS adapters, lightbox using `next/image` blur placeholders, downloadable PDFs tracked via events.      |
| **Product / E-commerce**                    | Comparison tables, quick-view modals with Suspense streaming, cart badges tied to Zustand store, price localization (Intl.NumberFormat).                     |
| **Event / Location**                        | Calendar sync (ICS), ticket tiers, Mapbox/Google Maps w/ IntersectionObserver lazy loading + WebP tiles, structured data (`Event`, `Place`).                 |
| **Menu (Restaurant)**                       | Dietary/allergen chips, filtering, photo galleries, ordering CTAs hooking into Feature 2.28.                                                                 |
| **Education / Course / Resource**           | Progress meters, curriculum accordions, certificate CTA, download tracking with signed URLs.                                                                 |
| **Jobs / Careers**                          | Search & filters (location, department), ATS webhook integration (Greenhouse/Lever), algorithmic sorting by freshness.                                       |
| **Interactive / Widgets**                   | Quiz/calculator frameworks using Zod validation + optimistic updates, poll results w/ SSE fallback, embedding guardrails (TCF v2.3).                         |
| **Social Proof / Media / Gallery Enhanced** | Logo walls, testimonial sliders, review aggregation (Trustpilot/Yelp quotas), video playlists with transcript sync.                                          |
| **Search / Filter / Comparison**            | Autocomplete w/ semantic ranking, multi-select filter chips, saved filter presets (URL state), comparison matrices with tooltip clarifications.              |

## 12. Feature Implementation Patterns (NEW)

- **Search (2.20)**: AI semantic search pipeline (Encore + OpenAI embeddings + Qdrant) w/ vector cache per client, hybrid keyword reranking, analytics on zero-result queries.
- **Newsletter (2.21)**: ConvertKit/Mailchimp adapters using OAuth 2.1 + PKCE, double opt-in flows, CMP gating before script load, segmentation metadata stored in `features/newsletter`.
- **Chat (2.26)**: Live chat provider abstraction + AI co-pilot; optimistic message queue, typing indicators, ARIA live updates, consent-first SDK loading.
- **Analytics / A/B / Personalization (2.23-2.25)**: Privacy-first trackers (Plausible, Umami, custom warehouse), server actions to enqueue experiments, edge flag resolution (Vercel Edge Config / Cloudflare KV).
- **E-commerce / Payment / Reviews (2.28-2.32)**: Headless commerce connectors (Shopify Storefront API, Commerce.js), PCI-scoped webhook relays, review ingestion with moderation queue.
- **Automation / Webhook / Integration (2.44-2.46)**: Durable workflows (Temporal/Trigger.dev) for CRM sync, signed webhook verification (Stripe-style), retry/backoff policies.
- **Security / Monitoring / Performance (2.38-2.40)**: SLO dashboards, INP monitors, synthetic checks via Playwright, CSP/report-to endpoints.

Each feature spec includes: adapter interfaces (`packages/features/src/*/adapters`), server action contract, analytics taxonomy, performance budget (component + endpoint), regression tests (Vitest + Playwright).

## 13. Infrastructure Systems Research (NEW)

| System                                            | 2026 Guidance                                                                                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slot / Render Prop / Provider Systems**         | Slot-based composition for page templates (named slots w/ TypeScript generics), render-prop fallbacks for legacy clients, provider tree optimizer (Context memoization + React Compiler hints). |
| **Variant / Theme / Style**                       | CVA for variants, Design Token pipeline (DTCG v1.0) exporting to Tailwind v4 + CSS vars, multi-brand theming with CSS cascade layers.                                                           |
| **Layout / Grid / Responsive / Spacing**          | Container queries (`@container`), logical properties for RTL, spacing scales tied to tokens, `packages/config/tailwind-theme.css`.                                                              |
| **Typography / Color / Shadow / Border**          | Variable fonts (Inter Variable fallback), display-P3 colors, shadow elevation levels, border radius matrices per brand.                                                                         |
| **Media / Icon / Image**                          | Lucide icon registry, Next.js Image CDN presets, video streaming via Mux/site CDN, audio waveform visualizers.                                                                                  |
| **State / Form / Validation**                     | Zustand slices per feature; Jotai for fine-grained states (e.g., Command Palette), Zod schemas shared between server actions + client forms.                                                    |
| **Error / Loading / Accessibility**               | Error boundaries per route group, Suspense skeleton registry, accessibility checklist automation (axe-core CI).                                                                                 |
| **Performance / Testing / Documentation**         | Performance budgets enforced via `scripts/validate-performance.ts`, Vitest component suites, Playwright smoke tests, Storybook/MDX docs.                                                        |
| **Development / Build / Deployment / Monitoring** | Turborepo pipelines w/ remote cache, Next.js partial prerendering, Skott for dependency graphs (C.1), Sentry/Datadog instrumentation, IaC via Terraform modules.                                |
| **Configuration / Plugin / Extension**            | Zod-validated config loader, plugin architecture for feature packs (e.g., industries), feature-flag SDK (LaunchDarkly, Statsig) wrapping edge middleware.                                       |

## 14. Advanced Component Patterns

1. **Animation & Motion**: Framer Motion 11 presets, reduced-motion guards, Activity component gating expensive renders.
2. **Composition**: Compound components with context selectors, controlled/uncontrolled hybrids for Select/Combobox.
3. **Performance**: Code-splitting via `next/dynamic`, React Compiler auto-memoization adoption, virtualization checklists.
4. **Accessibility**: ARIA live regions, roving tabindex utilities, Escape key + inert overlays for sheets/menus.

## 15. Industry-Specific Research Expansion

- **Fitness & Wellness**: Class schedulers (Calendly/Mindbody adapters), progress dashboards, FitnessCenter schema, trainer bios.
- **Real Estate**: MLS ingestion, mortgage calculators, 3D tour embeds, RealEstateAgent + Offer schemas.
- **Construction & Trades**: Project timelines, license verification banners, service area maps, integration with Jobber/ServiceTitan.
- **Education & Training**: Course catalogs, instructor credentials, SCORM/LMS webhooks.
- **Healthcare & Medical**: HIPAA-safe contact forms (BAA storage), telehealth CTAs, schema for MedicalProcedure, location-based provider filters.
- **Non-Profit & Organizations**: Donation widgets (Stripe Giving, GiveWP), volunteer CRM sync, impact metrics showcases.
- **Technology & SaaS**: Product tour components, ROI calculators, API docs teasers, SOC2/compliance trust stamps.

## 16. Emerging Technologies & Advanced Patterns

1. **AI Integration**: Multi-provider LLM orchestration (Vercel AI SDK router) with fallback tiers, Retrieval-Augmented Generation for search/personalization, cost telemetry per tenant.
2. **Edge Computing**: Vercel Edge Functions / Cloudflare Workers for personalization, edge A/B tests, predictive prefetchers using Network Information API.
3. **WebAssembly**: Wasm modules for image processing (Squoosh pipeline), crypto, heavy analytics, loaded via dynamic import with feature detection.
4. **PWA**: Workbox recipes for offline caching, background sync for forms, push notifications gated by CMP.
5. **Web Components & Micro Frontends**: Module Federation for vendor widgets, custom elements bridging to Next.js via `use client` wrappers.
6. **Real-Time Tech**: WebSockets (Socket.IO), Server-Sent Events for analytics dashboards, GraphQL subscriptions for booking availability.
7. **Advanced Performance**: Resource hints (preload/prefetch), HTTP/3 adoption, streaming server components with Suspense boundaries.

## 17. Security & Privacy Advanced

- **Authentication**: OAuth 2.1 + PKCE, OIDC clients, passkey/passwordless options, biometric fallbacks on mobile.
- **Authorization**: RBAC/ABAC policies via `@repo/infra/authz`, policy-as-code (Cedar/Oso) for tenant isolation.
- **API Security**: HMAC-signed webhooks, rate limiting via edge middleware, schema validation for inbound payloads.
- **Privacy Compliance**: GDPR/CCPA/LGPD checklists, CMP integration (TCF v2.3), consent-first third-party embeds, data deletion workflows.
- **Security Monitoring**: SIEM integrations, dependency scanning (GitHub Advanced Security/OWASP Dependency-Track), threat modeling playbooks.

## 18. Testing & Quality Assurance

| Layer                 | Tooling & Patterns                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Unit / Component**  | Vitest + React Testing Library, MSW for network stubs, Storybook interaction tests.                         |
| **Integration**       | Playwright component tests (experimental) + Next.js app router harness, contract tests for adapters (Pact). |
| **E2E**               | Playwright/Cypress suites per template, Lighthouse CI for performance budgets, synthetic user journeys.     |
| **Visual Regression** | Chromatic/Applitools with UI tokens, gating merges for marketing components.                                |
| **Accessibility**     | axe-core CI, manual screen-reader checklists, focus management tests.                                       |
| **Performance**       | WebPageTest + Lighthouse, Next.js `next/script` timings, custom INP logger.                                 |

## 19. Deployment & DevOps Advanced

- **Strategies**: Blue/green + canary on Vercel/Netlify, feature flags for progressive delivery, rollback scripts.
- **CI/CD**: Turborepo pipeline stages (lint → test → build → deploy), remote cache, selective package builds via `turbo run build --filter`.
- **Observability**: OpenTelemetry tracing, Datadog/Sentry/LogRocket for errors + INP, dashboards per client.
- **IaC / Containers**: Terraform modules for shared infra, Dockerized preview environments, container security scans, edge config automation.

## 20. Documentation & Developer Experience

- **Docs**: MDX handbooks per package, Docusaurus or Next.js docs site fed by `scripts/build-docs-site.ts`, auto-generated prop tables via TS compiler API.
- **DevEx**: pnpm workspace scripts (`pnpm new:feature`), scaffolding templates, internal developer portal (Backstage) tracking golden paths + DX Core metrics.

---

## Part 3: Architecture & Execution — Expanded

### 3.1 Package Dependency Graph

- Adopt Skott for graph generation (`scripts/analyze-deps.ts`) covering new UI primitives, marketing families, features, and infra systems.
- Enforce layered graph: config → utils → ui → features → marketing-components → page-templates → clients; integrations shared at L0.

### 3.2 Implementation Patterns Reference

- Provide code samples for Adapter, Factory, Strategy, Observer, Composition patterns in `docs/architecture/patterns.md` referencing current packages.
- Tag each feature task with required pattern(s) to speed onboarding.

### 3.3 Testing Strategy

- Testing pyramid per package (unit 60%, integration 30%, e2e 10%), coverage gates in CI, shared fixtures in `packages/test-utils`.

### 3.4 Performance Budgets

- Component budgets (e.g., hero <40 KB JS), feature-level budgets (Search <120 KB), page budgets (<250 KB JS gz). Track via Lighthouse CI + custom `scripts/check-bundlesize.ts`.

### 3.5 Accessibility Standards

- WCAG 2.2 AA checklist template, component-level a11y specs, keyboard navigation requirements, screen-reader smoke tests recorded in Playwright.

---

_Consolidated from TODO.md, RESEARCH_ENHANCED.md, docs/task-specs/, RESEARCH_GAPS.md analysis, and Strategic Enhancement Report — February 18, 2026_
