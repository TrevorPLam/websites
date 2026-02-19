<!--
  @file docs/analysis/ADVANCED-CODE-PATTERNS-ANALYSIS.md
  @role docs
  @summary Comprehensive analysis of existing code patterns and advanced upgrade opportunities.
  @status draft
  @last_audited 2026-02-19
  @verification pnpm validate-docs
-->

# Advanced Code Patterns — Comprehensive Analysis and Recommendations

**Purpose:** Complete inventory of all existing code patterns in the marketing-websites monorepo, research-backed identification of advanced upgrade opportunities, and reasoning over highly advanced patterns applicable now and in the future.

**Scope:** Entire codebase — packages, clients, integrations, infrastructure, features.

**Sources:**

- Codebase exploration (packages/, clients/, docs/, tasks/)
- docs/archive/research (qwen1.md, perplexity1.md, gemini, chatgpt)
- RESEARCH.md, RESEARCH-INVENTORY.md, THEGOAL.md
- Web research (Next.js 16, React 19, RSC, CVA, design tokens, monorepo, 2025–2026)

---

## Part I — Complete Pattern Inventory

A full catalog of implemented patterns with location, maturity, and upgrade potential.

### 1. Architecture

| Pattern                      | Location                               | Implementation                                                                                    | Maturity | Upgrade Potential                               |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| Layer model (L0/L2/L3)       | docs/architecture/, module-boundaries  | L0=infra+integrations; L2=ui+features+types+utils+marketing-components; L3=clients+page-templates | Standard | Enforce via Skott/madge; layer-aware generators |
| CaCA (Configuration-as-Code) | site.config.ts per client              | Single config drives theme, nav, features, integrations, SEO, conversion flow                     | Standard | Schema-driven UI, preset library, validation CI |
| Dependency direction         | eslint-config, module-boundaries       | clients→packages; no cross-client; no deep imports                                                | Standard | Automated boundary checks in CI                 |
| Package structure            | pnpm-workspace.yaml                    | packages/_, clients/_; catalog: versions; workspace:\*                                            | Standard | Path-based CI triggers; Turborepo remote cache  |
| Route registry               | clients/starter-template/lib/routes.ts | Canonical static routes for sitemap, search, breadcrumbs                                          | Standard | Config-driven route discovery; locale-aware     |

### 2. Component Patterns

| Pattern             | Location                                                                                                                     | Implementation                                                                                               | Maturity                | Upgrade Potential                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------- | ------------------------------------- |
| UI primitives       | packages/ui/components/                                                                                                      | Button, Card, Input, Accordion, Tabs, Dialog, DropdownMenu, Popover, Tooltip, Select, Textarea, Slider, etc. | Standard                | CVA migration; compound variants      |
| Variant styling     | Button, Badge, Toggle, Tabs, Switch, Skeleton, Sheet, Rating, Progress, RadioGroup, Checkbox, Card, Container, Alert, Avatar | Record<string, string> + cn()                                                                                | Basic                   | Migrate to CVA                        |
| CVA                 | packages/infra/variants/cva.ts                                                                                               | cva(), composeVariants, compose.ts                                                                           | Standard (unused by UI) | Adopt in @repo/ui                     |
| Compound components | Tabs, Accordion, Form, Popover                                                                                               | Radix + shared Context                                                                                       | Standard                | Slot-based API; render-prop fallbacks |
| Hero slots          | marketing-components/hero                                                                                                    | HeroSlots: header, content, footer, background, overlay, ctaArea                                             | Standard                | Page-level slot composition           |
| Slot (Radix-style)  | packages/infra/composition/slots.ts                                                                                          | Slot merges props onto child; asChild pattern                                                                | Standard                | —                                     |
| Slot (named)        | packages/infrastructure/ui/composition/slots.ts                                                                              | SlotProvider, Slot, useSlot — named child injection                                                          | Standard                | Apply to page templates               |
| Render-props        | infrastructure/ui composition/render-props.ts                                                                                | Available                                                                                                    | Standard                | Use for section fallbacks             |
| Radix primitives    | packages/ui                                                                                                                  | Tabs, Dialog, Select, Slider, etc.                                                                           | Standard                | —                                     |

### 3. Data / State

| Pattern           | Location                                            | Implementation                                                     | Maturity | Upgrade Potential                               |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------------ | -------- | ----------------------------------------------- |
| Server actions    | features/booking, contact                           | 'use server', submitBookingRequest, submitContactForm              | Standard | secureAction wrapper; IDOR hardening            |
| React Hook Form   | features (BookingForm, ContactForm), ui/Form        | useForm, zodResolver                                               | Standard | —                                               |
| Zod schema        | types/site-config, features/_/lib/_-schema          | siteConfigSchema, createBookingFormSchema, createContactFormSchema | Standard | Schema-driven config UI                         |
| Context           | ui (Consent, Tabs, Form), infra composition/context | createSafeContext, createOptionalContext, useContextSelector       | Standard | Context selector optimization                   |
| React Query / SWR | —                                                   | Not used                                                           | —        | Consider for client data (availability, search) |
| Zustand / Jotai   | —                                                   | Not used                                                           | —        | RESEARCH: fine-grained state (Command Palette)  |

### 4. Integration Patterns

| Pattern                | Location                                      | Implementation                                                          | Maturity | Upgrade Potential                    |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------------------- | -------- | ------------------------------------ |
| Adapter (booking)      | features/booking/lib/booking-provider-adapter | BookingProviderAdapter, BaseBookingProviderAdapter                      | Standard | Registry-based registration          |
| Provider factory       | booking-providers.ts                          | BookingProviders class, getBookingProviders() lazy                      | Standard | registerBookingProvider(id, factory) |
| Content source adapter | features/blog/lib/blog-content-source         | BlogContentSource interface; MDX adapter                                | Standard | Sanity, Storyblok adapters           |
| Config-based adapters  | features/testimonials, team, pricing, gallery | getTestimonialsFromConfig, getTeamFromConfig, etc.                      | Standard | —                                    |
| Integration packages   | packages/integrations/\*                      | Calendly, Acuity, Cal.com, HubSpot, Supabase, Mailchimp, SendGrid, etc. | Standard | inf-10 integration adapter registry  |

### 5. Composition & Registry

| Pattern          | Location                       | Implementation                                                       | Maturity | Upgrade Potential                                      |
| ---------------- | ------------------------------ | -------------------------------------------------------------------- | -------- | ------------------------------------------------------ |
| Section registry | page-templates/registry.ts     | Map<string, Component>, registerSection(), composePage()             | Standard | Typed SectionType; configSchema per section; lazy load |
| composePage      | registry.ts                    | Resolves sections from config; React.createElement                   | Standard | Suspense boundaries; dynamic import                    |
| Section adapters | page-templates/sections/\*.tsx | Map SiteConfig → marketing-component props; side-effect registration | Standard | Schema validation; typed adapters                      |
| Page templates   | page-templates/templates/      | HomePage, Services, About, Contact, BlogIndex, BlogPost, Booking     | Standard | SlotProvider for overrides                             |

### 6. Forms & Validation

| Pattern         | Location                | Implementation                               | Maturity | Upgrade Potential                      |
| --------------- | ----------------------- | -------------------------------------------- | -------- | -------------------------------------- |
| React Hook Form | ui/Form, features       | useForm, zodResolver                         | Standard | —                                      |
| Zod schema      | types, features         | siteConfigSchema, create\*FormSchema(config) | Standard | Dynamic schema factories; shared types |
| zodResolver     | @hookform/resolvers/zod | —                                            | Standard | —                                      |

### 7. Routing & Middleware

| Pattern        | Location                        | Implementation                       | Maturity | Upgrade Potential             |
| -------------- | ------------------------------- | ------------------------------------ | -------- | ----------------------------- |
| App Router     | clients/\*/app/                 | Next.js 16 App Router                | Standard | —                             |
| Dynamic routes | app/[locale]/blog/[slug]        | Locale + slug                        | Standard | —                             |
| Middleware     | create-middleware.ts, next-intl | CSP, headers, CVE mitigation, locale | Standard | Edge runtime; personalization |
| Locale routing | starter-template                | next-intl, app/[locale]/             | Standard | RTL (C.11); fallback chains   |

### 8. API & Server

| Pattern        | Location                         | Implementation       | Maturity | Upgrade Potential                       |
| -------------- | -------------------------------- | -------------------- | -------- | --------------------------------------- |
| Route handlers | app/api/health                   | GET { status: 'ok' } | Basic    | Catch-all api/[...routes]; OG, webhooks |
| Server actions | booking-actions, contact-actions | 'use server'         | Standard | secureAction; authz checks              |
| Edge runtime   | —                                | Not used in routes   | —        | RESEARCH: edge for personalization, A/B |

### 9. Styling

| Pattern       | Location             | Implementation                    | Maturity | Upgrade Potential                    |
| ------------- | -------------------- | --------------------------------- | -------- | ------------------------------------ |
| Tailwind CSS  | config, clients      | Tailwind 4, utility classes       | Standard | @theme; CSS-first (v4 migration)     |
| ThemeInjector | ui/ThemeInjector.tsx | Server; CSS vars from site.config | Standard | Presets; light/dark; DTCG tokens     |
| cn()          | utils                | clsx + tailwind-merge             | Standard | —                                    |
| Design tokens | THEGOAL C.5          | Planned three-layer               | —        | option/decision/component; DTCG v1.0 |

### 10. Build & Deploy

| Pattern        | Location                    | Implementation                                  | Maturity | Upgrade Potential          |
| -------------- | --------------------------- | ----------------------------------------------- | -------- | -------------------------- |
| Turborepo      | turbo.json                  | build, dev, lint, type-check, test; ^build deps | Standard | Remote cache; path filters |
| pnpm workspace | pnpm-workspace.yaml         | catalog:; workspace:\*                          | Standard | —                          |
| Docker         | starter-template/Dockerfile | Multi-stage; standalone; non-root               | Standard | —                          |
| CI             | .github/workflows/ci.yml    | lint, type-check, build, test; affected filter  | Standard | —                          |
| Changesets     | .changeset/                 | Versioning                                      | Standard | —                          |

### 11. Testing

| Pattern                 | Location                                | Implementation                    | Maturity | Upgrade Potential       |
| ----------------------- | --------------------------------------- | --------------------------------- | -------- | ----------------------- |
| Jest                    | jest.config.js                          | node + jsdom projects             | Standard | —                       |
| Testing Library         | packages/\*/**tests**/                  | @testing-library/react, userEvent | Standard | —                       |
| jest-axe                | UI tests                                | Accessibility                     | Standard | axe-core CI gate        |
| Parity tests            | refactor-parity/, features/\*\*/parity/ | booking, search, contact parity   | Advanced | Extend to more features |
| ResizeObserver polyfill | jest.setup.js                           | For Radix Slider                  | Standard | —                       |

### 12. Error Handling & Observability

| Pattern                  | Location                  | Implementation                          | Maturity | Upgrade Potential           |
| ------------------------ | ------------------------- | --------------------------------------- | -------- | --------------------------- |
| error.tsx / global-error | clients                   | Next.js convention                      | Basic    | Sentry integration verified |
| withErrorBoundary        | infra composition/hocs.ts | Documented, **not implemented**         | Absent   | Implement                   |
| Sentry                   | infra/sentry              | setSentryUser, withSentrySpan, logError | Standard | —                           |
| Structured logging       | infra/logger              | logInfo, logWarn, logError              | Standard | —                           |

### 13. Security

| Pattern          | Location                  | Implementation                            | Maturity | Upgrade Potential             |
| ---------------- | ------------------------- | ----------------------------------------- | -------- | ----------------------------- |
| CSP              | infra/security/csp.ts     | Nonce-based; buildCSP                     | Standard | Integration-aware CSP (inf-8) |
| Rate limiting    | infra/security/rate-limit | Upstash or in-memory                      | Standard | —                             |
| Sanitization     | infra/security/sanitize   | sanitizeName, sanitizeEmail, sanitizeHtml | Standard | —                             |
| Env validation   | infra/env/schemas/        | Zod per domain                            | Standard | —                             |
| createMiddleware | infra/middleware          | CSP, headers, CVE                         | Standard | —                             |

### 14. i18n & Accessibility

| Pattern      | Location               | Implementation                       | Maturity | Upgrade Potential    |
| ------------ | ---------------------- | ------------------------------------ | -------- | -------------------- |
| next-intl    | starter-template       | i18n/routing, NextIntlClientProvider | Standard | RTL; fallback chains |
| ARIA         | Radix-based components | aria-expanded, role, tablist         | Standard | —                    |
| Keyboard nav | Radix                  | Roving focus                         | Standard | —                    |
| Skip link    | layout.tsx             | getTranslations('skipToContent')     | Basic    | —                    |

### 15. Performance

| Pattern           | Location               | Implementation           | Maturity | Upgrade Potential                     |
| ----------------- | ---------------------- | ------------------------ | -------- | ------------------------------------- |
| Code splitting    | page-templates         | None; static imports     | Basic    | next/dynamic for sections             |
| next/image        | marketing-components   | Uses <img> (no Next dep) | Basic    | next/image where possible             |
| Server Components | ThemeInjector, layouts | Default RSC              | Standard | Maximize RSC; minimize client islands |
| Caching           | blog-mdx-source        | Basic                    | Basic    | use cache; cacheLife (Next 16)        |
| React Compiler    | —                      | Not adopted              | —        | RESEARCH: auto-memoization            |

### 16. use client / use server Distribution

| Directive    | Count | Typical Locations                                                                     |
| ------------ | ----- | ------------------------------------------------------------------------------------- |
| 'use client' | 30+   | BookingForm, ContactForm, SearchDialog, ConsentContext, Accordion, navigation, layout |
| 'use server' | 3     | booking-actions, contact-actions                                                      |

---

## Part II — Research Synthesis (2025–2026)

### Next.js 16 & React 19

- **RSC default:** Server Components are default; push Client Components down as leaf nodes to minimize bundle.
- **Cache Components / PPR:** `use cache` directive + `cacheLife` for explicit static/dynamic boundaries; static shell + streaming dynamic content.
- **Streaming + Suspense:** Multiple RSC fetch in parallel; page streams as data becomes ready.
- **RSC payload optimization:** Reduce unique client component references; minimize props across server/client boundary.

### Component Design Systems

- **Compound components:** Parent manages state via Context; children consume; declarative composition like Radix.
- **Slot-based APIs:** Named placeholders (header, body, footer) for content injection; type-safe props; useSlotProps for child access.
- **CVA:** Compound variants, default variants, type inference; industry standard for variant-heavy components.

### Configuration & Schema

- **Zod 4:** Stable; schema-driven config with runtime validation and type inference.
- **zod-config-builder:** Build type-safe configs from schemas; CLI for config generation.
- **Schema-driven UI:** Config (pages, sections) drives UI composition; single source of truth.

### Design Tokens (DTCG 2025.10)

- **Three-layer:** Base (primitives) → Semantic → Component.
- **Tailwind v4:** CSS-first; `@theme`; tokens as CSS variables; 5x faster builds.
- **OKLCH:** Perceptually uniform colors; future WCAG 3.0 readiness.

### Monorepo & Build

- **pnpm:** Faster installs; strict node_modules; workspace support.
- **Turborepo:** Task dependencies; remote cache; path-based filters.
- **Dependency placement:** Install where used; workspace:\* for internal; catalog for versions.

### Adapter & Plugin Patterns

- **component-registry:** Global registry; Adapters; Utilities; decoupled composition.
- **plug-and-play:** Extension points; hook-based; sync/async; dependency management.
- **PluginRegistration:** module + create() pattern for plugin instantiation.

### Marketing Site Patterns (Headless CMS)

- **Slice-based composition:** Reusable blocks (hero, features, testimonials, FAQ); ordered arrays; section-specific fields.
- **Component-first:** Designers create guardrails; editors assemble; live preview, AI translation.

### React Compiler (2025)

- **Automatic memoization:** Build-time; no useMemo/useCallback needed.
- **Compilation modes:** infer, annotation ("use memo"), all.
- **De-opts:** Mutating props; non-deterministic (Math.random); mutable variables between renders.

---

## Part III — Highly Advanced Opportunities (Reasoning)

### Tier 1: High-Impact, Proven Patterns (Adopt Soon)

1. **CVA for UI Variants** — CVA exists in infra; 15+ components use Record maps. Migration yields compound variants, better DX, and consistency. **Effort:** Low–Medium. **Risk:** Low.

2. **Section Registry Typed Schema** — Research (perplexity1, qwen1) and Prismic/Storyblok patterns show section defs with configSchema. Enables validation, CMS alignment, and typed section IDs. **Effort:** Medium. **Risk:** Low.

3. **Dynamic Section Loading** — No code splitting in page-templates. next/dynamic + Suspense reduces initial JS; aligns with RSC payload optimization. **Effort:** Medium. **Risk:** Low.

4. **withErrorBoundary HOC** — Documented but missing. Completes infra composition API; enables component-level fallbacks. **Effort:** Low. **Risk:** None.

5. **Provider Composition in Layout** — composeProviders/ProviderStack exist; layouts use manual nesting. Reduces boilerplate, clarifies order. **Effort:** Low. **Risk:** None.

### Tier 2: Research-Backed, Medium-Term

6. **use cache / cacheLife** — Next 16 Cache Components. Marketing homepages: static shell + streaming personalized content. RESEARCH-INVENTORY: R-CACHE-COMPONENTS. **Effort:** Medium. **Risk:** Medium (config, invalidation).

7. **React Compiler** — Automatic memoization; Next.js supports. Reduces manual useMemo/useCallback. **Effort:** Low (enable). **Risk:** Low (de-opts to full render).

8. **Three-Layer Design Tokens** — DTCG 2025.10; Tailwind v4 @theme. Aligns with C-5, inf-4, inf-12. **Effort:** High. **Risk:** Medium (migration).

9. **Theme Presets + Light/Dark** — Theme registry; ThemeProvider; next-themes or custom. **Effort:** Medium. **Risk:** Low.

10. **Slot-Based Page Templates** — SlotProvider in templates; named slots for header/footer/sidebar. Enables client overrides without fork. **Effort:** Medium. **Risk:** Low.

### Tier 3: Integration & Extensibility

11. **Booking Provider Registry** — registerBookingProvider(id, factory). Enables Calendly, Acuity, Cal.com without editing BookingProviders. Aligns with inf-10. **Effort:** Medium. **Risk:** Low.

12. **Integration Adapter Registry** — Generalized pattern for email, chat, reviews, maps. Single registry pattern. **Effort:** High. **Risk:** Medium.

13. **Content Source Adapter Expansion** — Sanity, Storyblok adapters per C.10. **Effort:** Medium per adapter. **Risk:** Low.

### Tier 4: Emerging / Theoretical

14. **Edge Personalization** — Variant selection at edge; cache-safe keys (C.18). **Effort:** High. **Risk:** Medium.

15. **AI Semantic Search** — Vector embeddings, RAG (R-SEARCH-AI, 2.20). **Effort:** Very High. **Risk:** High.

16. **Partial Prerendering (PPR)** — Static shell + dynamic islands. Overlaps with use cache. **Effort:** Medium. **Risk:** Medium.

17. **OKLCH Color Space** — Perceptual uniformity; WCAG 3.0 prep (R-OKLCH). **Effort:** Medium. **Risk:** Low.

18. **Module Federation** — Vendor widgets; micro frontends (RESEARCH §16). **Effort:** Very High. **Risk:** High.

19. **PartyTown / Web Workers** — Third-party script offloading (infrastructure-4). **Effort:** High. **Risk:** Medium.

20. **React Taint API** — Data leakage prevention (security-6). **Effort:** Medium. **Risk:** Low.

---

## Part IV — Pattern-by-Pattern Analysis (Enhanced)

### Section Registry

**Current:** Map<string, Component>; no schema; silent skip for unknown IDs.

**Advanced:**

```typescript
type SectionType = 'hero-centered' | 'services-grid' | 'cta-banner';
interface SectionDefinition<Cfg> {
  component: React.ComponentType<SectionProps & Cfg>;
  configSchema: z.ZodType<Cfg>;
}
const sectionRegistry = new Map<SectionType, SectionDefinition<any>>();
// composePage: validate config per section; lazy load component
```

**Research:** Prismic slices, Storyblok blocks, perplexity1 section def with configSchema.

---

### Theme Injection

**Current:** Server-only; single theme; CSS vars from site.config.

**Advanced:** Theme registry; ThemeProvider + useTheme; presets (minimal, bold); DTCG three-layer tokens.

---

### UI Variants (CVA)

**Current:** Record maps in 15+ components.

**Advanced:** cva() from @repo/infra; compoundVariants; defaultVariants.

---

### Code Splitting

**Current:** Static imports; all sections bundled.

**Advanced:**

```tsx
const HeroSection = dynamic(() => import('./sections/hero'), {
  loading: () => <SectionSkeleton />,
});
// composePage: wrap each section in Suspense
```

---

### Cache Components (use cache)

**Current:** Implicit caching; no explicit boundaries.

**Advanced (Next 16):**

```tsx
// Static shell
export default function HomePage() {
  return (
    <>
      <CachedHero /> {/* use cache */}
      <Suspense fallback={<Skeleton />}>
        <DynamicPricing /> {/* request-time */}
      </Suspense>
    </>
  );
}
```

---

### Provider Composition

**Current:** Manual nesting in layout.

**Advanced:**

```tsx
const AppProviders = composeProviders([
  ThemeInjector,
  NextIntlClientProvider,
  ConsentProvider,
  TooltipProvider,
]);
<AppProviders>{children}</AppProviders>;
```

---

## Part V — Theoretical / Future Patterns (THEGOAL Phases 7–10)

| Phase | Pattern             | Description                                                              |
| ----- | ------------------- | ------------------------------------------------------------------------ |
| 7     | AI Platform         | LLM gateway, content engine, agent orchestration; multi-provider routing |
| 8     | Content Platform    | Visual editor (drag-drop); DAM (asset ingestion, AI tagging)             |
| 9     | Marketing Ops       | Campaign orchestration; workflow automation                              |
| 10    | Tenant Core         | Multi-tenancy; tenant provisioning; feature flags per tenant             |
| —     | Visual regression   | Storybook + Chromatic; gating merges                                     |
| —     | Pact contract tests | Consumer-driven contracts for adapters                                   |
| —     | Scaffold/MCP        | AI-assisted scaffold patterns; architectural consistency                 |

---

## Part VI — Summary & Execution Roadmap

### Inventory Summary

| Maturity       | Count | Examples                                                             |
| -------------- | ----- | -------------------------------------------------------------------- |
| Basic          | 8+    | Record variants, flat routing, no code split, next/image             |
| Standard       | 55+   | Layers, CaCA, server actions, RHF+Zod, adapters, registry, CSP, Jest |
| Advanced       | 1     | Parity tests                                                         |
| Absent/Planned | 15+   | CVA in UI, withErrorBoundary, use cache, design tokens, RTL          |

### Recommended Execution Order

1. **Quick wins (1–2 days each):** withErrorBoundary; Provider composition in layout; CVA for Button
2. **Short-term (1–2 weeks):** Section registry schema; CVA batch migration; Dynamic section loading
3. **Medium-term (1–2 months):** Theme presets + context; Slot-based templates; Booking provider registry
4. **Long-term (3+ months):** use cache / PPR; Design tokens; React Compiler; Edge personalization

### Files to Update (Consolidated)

| Pattern           | Primary                         | Secondary                            |
| ----------------- | ------------------------------- | ------------------------------------ |
| Section registry  | registry.ts, types.ts           | sections/\*.tsx                      |
| Theme             | ThemeInjector.tsx               | infrastructure/ui/theme, site.config |
| CVA               | ui/components/\*.tsx            | ui/package.json                      |
| Slots             | page-templates/templates/\*.tsx | —                                    |
| Booking registry  | booking-providers.ts            | booking-provider-adapter.ts          |
| Dynamic imports   | registry.ts, composePage        | —                                    |
| withErrorBoundary | infra/composition/hocs.ts       | —                                    |
| Providers         | clients/\*/app/\*\*/layout.tsx  | —                                    |
| use cache         | page.tsx, templates             | next.config                          |
| Design tokens     | packages/config/tokens/         | ThemeInjector, tailwind              |

---

## References

- [RESEARCH.md](../../RESEARCH.md) §14, §16
- [RESEARCH-INVENTORY.md](../../tasks/RESEARCH-INVENTORY.md)
- [docs/archive/research/qwen1.md](../archive/research/qwen1.md) §15
- [docs/archive/research/perplexity1.md](../archive/research/perplexity1.md)
- [THEGOAL.md](../../THEGOAL.md)
- [TASKS.md](../../tasks/TASKS.md)
- React Server Components: react.dev/reference/rsc/server-components
- Next.js use cache: nextjs.org/docs/app/api-reference/directives/use-cache
- DTCG Design Tokens: designtokens.org/TR/2025.10/
- React Compiler: react.dev/learn/react-compiler/introduction
