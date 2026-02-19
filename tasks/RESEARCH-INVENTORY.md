# Research Topic Inventory

_Last updated:_ 2026-02  
_Purpose:_ Complete topic map and task→topic mapping for Task Research Audit. Research findings (Phase 2) fill the placeholder sections below. Refreshed 2026-02 for active-task standardization (0-_, 6-8_, 6-9*, api-*, c-_, d-_, docs-_, e-_, inf-_, integration-_, scripts-_, f-_).

**Relationship to RESEARCH.md:** This file is the **topic index** (R-UI, R-A11Y, R-PERF, etc.) and task→topic mapping. Use root [RESEARCH.md](../RESEARCH.md) for the **content digest** and §-section references (e.g. §2.1, §4.2).

---

## Topic Index

| Topic ID                  | Topic                                                                                 | Task Count                        |
| ------------------------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| R-UI                      | Radix UI primitives, React 19 patterns, ComponentRef                                  | 1.xx                              |
| R-A11Y                    | WCAG 2.2 AA, ARIA, touch targets (24×24), keyboard nav                                | 1.xx, 2.xx, f-23                  |
| R-PERF                    | LCP, INP, CLS, bundle budgets, Core Web Vitals                                        | 2.xx, f-24, f-28                  |
| R-RADIX                   | Radix Slider, Label, Select, Tabs, Accordion, etc.                                    | 1.xx                              |
| R-FORM                    | React Hook Form, Zod, validation, form builders                                       | 2.xx (forms), f-19, f-20          |
| R-MARKETING               | Hero, menu/dietary, pricing, testimonials, FAQ, sections                              | 2.1–2.62                          |
| R-INTEGRATION             | Calendly/Acuity/Cal.com, OAuth 2.1, TCF v2.3                                          | 4.1–4.6                           |
| R-INDUSTRY                | JSON-LD schemas, industry-specific patterns                                           | 4.6, 5.xx, 2.49                   |
| R-NEXT                    | App Router, RSC, Server Actions, PPR                                                  | 3.xx, 5.1, 2.xx                   |
| R-INFRA                   | Slot, Provider, Context, Theme, CVA, design tokens                                    | f-1–f-40                          |
| R-CMS                     | Content adapters, MDX, pagination, canonical URLs                                     | 2.13, 2.16, 2.19, 2.20, 3.xx      |
| R-TEST                    | Jest, axe-core, Playwright, coverage                                                  | All                               |
| R-DOCS                    | ADRs, config reference, migration guides                                              | 6.1–6.10                          |
| R-AI                      | AI Platform: LLM gateway, content engine, agent orchestration                         | 7.x (future), 2.20 (search AI)    |
| R-CONTENT-PLATFORM        | Visual editor, DAM, asset management                                                  | 8.x (future)                      |
| R-MARKETING-OPS           | Campaign orchestration, workflow automation                                           | 9.x (future), 2.46                |
| R-TENANT                  | Multi-tenancy, tenant-core, SaaS architecture                                         | 10.x (future)                     |
| R-DESIGN-TOKENS           | Three-layer tokens (option/decision/component), DTCG v1.0                             | f-12, f-13, f-14, f-11, C.5       |
| R-MOTION                  | Animation primitives, Framer Motion, reduced-motion                                   | f-6, f-7, C.6                     |
| R-EXPERIMENTATION         | A/B testing, feature flags, guardrails, SRM checks                                    | 2.24, C.8, D.2, infra/experiments |
| R-EDGE                    | Edge middleware, personalization, variant selection                                   | C.18, C.9, 2.25                   |
| R-OPS                     | Operational governance, queue policies, retry/timeout                                 | E.7, infra/ops                    |
| R-SECURITY-ADV            | Security regression, SSRF/XSS/injection, threat modeling                              | C.13, 2.39                        |
| R-COMPLIANCE              | Industry compliance packs, HIPAA, legal disclaimers                                   | C.17, 5.xx                        |
| R-PERSONALIZATION         | Personalization engine, behavioral tracking, co-creation                              | 2.25, C.9, F.6                    |
| R-LOCALIZATION            | i18n, RTL, locale routing, translation                                                | 2.36, C.11                        |
| R-VISUAL-REG              | Visual regression testing, Storybook, Chromatic                                       | C.7                               |
| R-SPEC-DRIVEN             | Spec-driven development, feature specs, ADRs                                          | C.15, 6.7                         |
| R-AI-AGENTS               | AI agent playbooks, workflow automation                                               | C.16, 2.46                        |
| R-SERVICE-BLUEPRINT       | Service blueprints, user journey mapping                                              | E.2                               |
| R-UX-PATTERNS             | Progressive conversion, peak-end, participatory UX, wayfinding, service recovery      | E.6, F.4, F.6, F.7, F.12          |
| R-STRATEGY                | Cynefin model, leverage points, portfolio kanban                                      | F.2, F.3, F.10                    |
| R-KNOWLEDGE               | SECI-inspired knowledge flow, pattern capture                                         | F.11                              |
| R-GOLDEN-PATH             | Golden paths, DevEx metrics, adoption tracking                                        | E.4                               |
| R-ERROR-BUDGET            | Error budgets, SLOs, release gates                                                    | E.3, C.14, D.5                    |
| R-SPC                     | Statistical process control, delivery metrics                                         | F.8                               |
| R-SEARCH-AI               | AI semantic search, vector embeddings, Qdrant, RAG                                    | 2.20                              |
| R-E-COMMERCE              | Headless commerce, payment gateways, PCI compliance                                   | 2.29, 2.32                        |
| R-WORKFLOW                | Durable workflows, Temporal/Trigger.dev, retry policies                               | 2.44, 2.46                        |
| R-MONITORING              | SLO dashboards, INP monitors, synthetic checks                                        | 2.40, C.14                        |
| R-CLI                     | CLI tooling, generators, scaffolding                                                  | 6.8                               |
| R-VERSIONING              | Changesets, versioning strategy, release channels                                     | 0.12, C.4                         |
| R-PARITY                  | Parity testing, refactor validation                                                   | 2.22                              |
| R-CONFIG-VALIDATION       | Config schema validation, Zod runtime checks                                          | 6.10a, 5.1                        |
| R-MIGRATION               | Template-to-client migration, cutover runbooks                                        | 6.1, 6.2                          |
| R-CLEANUP                 | Dead code removal, dependency pruning                                                 | 6.9                               |
| R-SECURITY-SERVER-ACTIONS | Server action security, IDOR mitigation, secureAction wrapper                         | security-1, 0-5                   |
| R-SECURITY-RLS            | Multi-tenant RLS, tenant isolation, JWT claims                                        | security-2                        |
| R-SECURITY-WEBHOOKS       | Webhook signature verification, idempotency, replay protection                        | security-3                        |
| R-SECURITY-CONSENT        | Third-party script consent management, GDPR/CCPA compliance                           | security-4                        |
| R-OBSERVABILITY           | OpenTelemetry, distributed tracing, tenant-aware logging                              | infrastructure-1                  |
| R-E2E-TESTING             | Playwright E2E testing, multi-tenant test strategy, visual regression                 | infrastructure-2                  |
| R-INTEGRATION-RESILIENCE  | Retry logic, circuit breaker, DLQ for integrations                                    | infrastructure-3                  |
| R-PNPM-SECURITY           | pnpm 10 security features (allowBuilds, blockExoticSubdeps, integrityHash)            | security-5                        |
| R-REACT-TAINT-API         | React Taint API for data leakage prevention (experimental_taintObjectReference)       | security-6                        |
| R-MIDDLEWARE-BYPASS       | CVE-2025-29927 mitigation, multi-layered authentication, DAL verification             | security-7                        |
| R-PARTYTOWN               | Third-party script offloading to Web Workers, Core Web Vitals optimization            | infrastructure-4                  |
| R-CONTRACT-TESTING        | Pact contract testing, consumer-driven contracts, API reliability                     | infrastructure-5                  |
| R-SCAFFOLD-MCP            | AI-assisted development governance, scaffold.yaml patterns, architectural consistency | infrastructure-6                  |
| R-CCPA-2026               | CCPA 2026 compliance (DROP integration, expanded lookback, minor rights)              | compliance-1                      |
| R-EU-AI-ACT               | EU AI Act compliance (governance framework, human review, risk assessment)            | compliance-2                      |
| R-CACHE-COMPONENTS        | Next.js 16 Cache Components/PPR (use cache directive, cacheLife)                      | (future)                          |
| R-APCA                    | Advanced Perceptual Contrast Algorithm (WCAG 3.0 preparation)                         | (future)                          |
| R-OKLCH                   | OKLCH color space, color-mix() function, perceptual uniformity                        | (future)                          |

---

## Task IDs by Topic

### R-UI (Radix UI primitives, React 19, ComponentRef)

All 1.xx: 1-12, 1-13, 1-14, 1-15, 1-16, 1-17, 1-18, 1-19, 1-20, 1-21, 1-22, 1-23, 1-24, 1-25, 1-26, 1-27, 1-28, 1-29, 1-30, 1-31, 1-32, 1-33, 1-34, 1-35, 1-36, 1-37, 1-38, 1-39, 1-40, 1-41, 1-42, 1-43, 1-44, 1-45, 1-46, 1-47, 1-48, 1-49, 1-50.

### R-A11Y (WCAG 2.2 AA, ARIA, touch targets, keyboard)

1.xx (all), 2.1–2.62 (all marketing/UI), f-23-accessibility-system.

### R-PERF (LCP, INP, CLS, bundle budgets)

2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.11–2.62, f-24-performance-system, f-28-build-system.

### R-RADIX (Radix component APIs)

Same as R-UI for 1.xx.

### R-FORM (React Hook Form, Zod, validation)

2.10, 2.31, f-19-form-system, f-20-validation-system, 1-23-form-component.

### R-MARKETING (Hero, menu, pricing, testimonials, FAQ, sections)

2.1–2.62 (all build-_ and create-_-feature that are section/component families).

### R-INTEGRATION (Scheduling, OAuth, TCF)

4.1, 4.2, 4.3, 4.4, 4.5, 4.6.

### R-INDUSTRY (JSON-LD, industry patterns)

4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 2.49.

### R-NEXT (App Router, RSC, Server Actions)

3.1–3.8, 5.1, 2.16, 2.17, 2.18, 2.19, 2.20.

### R-INFRA (Slot, Provider, Context, Theme, CVA)

f-1 through f-40.

### R-CMS (Content adapters, MDX, pagination)

2.13, 2.16, 2.19, 2.20, 3.1–3.8.

### R-TEST (Jest, axe-core, Playwright)

All open tasks.

### R-DOCS (ADRs, config reference, migration)

6.1, 6.2, 6.2a, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10a.

### R-AI (AI Platform: LLM gateway, content engine, agents)

7.x (future Phase 7), 2.20 (AI search), 2.46 (automation), C.16 (AI agents).

### R-CONTENT-PLATFORM (Visual editor, DAM)

8.x (future Phase 8).

### R-MARKETING-OPS (Campaign orchestration)

9.x (future Phase 9), 2.46 (automation).

### R-TENANT (Multi-tenancy, SaaS)

10.x (future Phase 10), infrastructure/tenant-core.

### R-DESIGN-TOKENS (Three-layer token architecture)

f-12-color-system, f-13-shadow-system, f-14-border-system, f-11-typography-system, C.5.

### R-MOTION (Animation/motion primitives)

f-6-animation-system, f-7-interaction-system, C.6, packages/ui/motion.

### R-EXPERIMENTATION (A/B testing, feature flags, guardrails)

2.24, C.8, D.2, packages/infra/experiments, packages/infra/edge.

### R-EDGE (Edge middleware, personalization)

C.18, C.9, 2.25, packages/infra/edge.

### R-OPS (Operational governance, queue policies)

E.7, packages/infra/ops, 2.44 (webhooks), 2.46 (automation).

### R-SECURITY-ADV (Security regression, threat modeling)

C.13, 2.39, packages/infra/**tests**/security-regression.

### R-COMPLIANCE (Industry compliance packs)

C.17, 5.xx (client migrations), packages/features/compliance.

### R-PERSONALIZATION (Personalization engine, behavioral tracking)

2.25, C.9, F.6, packages/features/personalization.

### R-LOCALIZATION (i18n, RTL, translation)

2.36, C.11, packages/features/localization.

### R-VISUAL-REG (Visual regression testing)

C.7, Storybook, Chromatic.

### R-SPEC-DRIVEN (Spec-driven development)

C.15, 6.7, .kiro/specs.

### R-AI-AGENTS (AI agent playbooks)

C.16, .windsurf/workflows, 2.46.

### R-SERVICE-BLUEPRINT (Service blueprints, journey mapping)

E.2, docs/service-blueprints.

### R-UX-PATTERNS (Progressive conversion, peak-end, participatory UX)

E.6, F.4, F.6, F.7, F.12, docs/ux.

### R-STRATEGY (Cynefin, leverage points, portfolio kanban)

F.2, F.3, F.10, docs/strategy.

### R-KNOWLEDGE (SECI-inspired knowledge flow)

F.11, docs/knowledge.

### R-GOLDEN-PATH (Golden paths, DevEx metrics)

E.4, docs/platform.

### R-ERROR-BUDGET (Error budgets, SLOs, release gates)

E.3, C.14, D.5, docs/reliability.

### R-SPC (Statistical process control, delivery metrics)

F.8, docs/operations.

### R-SEARCH-AI (AI semantic search, vector embeddings, RAG)

2.20, RESEARCH.md §12.

### R-E-COMMERCE (Headless commerce, payment gateways)

2.29, 2.32, RESEARCH.md §12.

### R-WORKFLOW (Durable workflows, Temporal/Trigger.dev)

2.44, 2.46, RESEARCH.md §12.

### R-MONITORING (SLO dashboards, INP monitors, synthetic checks)

2.40, C.14, docs/observability.

### R-CLI (CLI tooling, generators, scaffolding)

6.8, tooling/create-client, tooling/generate-component.

### R-VERSIONING (Changesets, versioning strategy)

0.12, C.4, .changeset/, docs/release.

### R-PARITY (Parity testing, refactor validation)

2.22, docs/testing.

### R-CONFIG-VALIDATION (Config schema validation, Zod)

6.10a, 5.1, tooling/validation, packages/types/site-config.schema.ts.

### R-MIGRATION (Template-to-client migration, cutover)

6.1, 6.2, docs/migration.

### R-CLEANUP (Dead code removal, dependency pruning)

6.9, knip, docs/cleanup.

---

## Research Findings

### R-UI (Radix UI primitives, React 19, ComponentRef)

- **[2026-02] React 19**: Use `React.ComponentRef<typeof Primitive.Root>` (not `ElementRef`) for forwardRef; React 19 release notes (react.dev/blog).
- **[2026-02] Radix**: All 1.xx components are thin wrappers; use Radix primitives from catalog (radix-ui 1.0.0); tree-shakeable, Server Component safe when no client interactivity.
- **[2026-02] Sonner (toast)**: Repo uses Sonner 2.0.7 (CLAUDE.md). `toast.custom(render, options)` expects render to return `React.ReactElement` (not just ReactNode); `toast.promise(promise, messages, options)` — check current Sonner API for exact signature (1–2 vs 3 args). Fix type assertions or callback return type to satisfy consumers (0-4).
- Implications: Every 1.xx task must use ComponentRef and follow existing Button/Dialog patterns in packages/ui.

#### Code Snippets

- **React 19 component with ref**: Thin wrapper pattern for Radix primitives.

  ```typescript
  import * as React from 'react';
  import { cn } from '@repo/utils';

  export function MyPrimitive({ ref, className, ...props }: MyPrimitiveProps) {
    return (
      <Primitive.Root
        ref={ref}
        className={cn('base-styles', className)}
        {...props}
      />
    );
  }
  ```

- **ComponentRef type**: Use for type-safe ref forwarding.
  ```typescript
  type MyPrimitiveRef = React.ComponentRef<typeof Primitive.Root>;
  ```

### R-A11Y (WCAG 2.2 AA, ARIA, touch targets, keyboard)

- **[2026-02-18] WCAG 2.2 AA**: Touch targets minimum 24×24 CSS px (2.5.8); focus visible ≥2px, 3:1 contrast; dragging movements require keyboard alternative (2.5.7).
- **[2026-02-18] WAI-ARIA**: Use ARIA live regions for dynamic content (alerts, slider value); roving tabindex for composite widgets; proper roles (slider, tablist, etc.).
- **[2026-02-18] prefers-reduced-motion**: Honor for animations; provide static fallbacks.
- Repo: docs/accessibility/component-a11y-rubric.md must be populated (task created in Phase 6).

#### Code Snippets

- **Touch target minimum (2.5.8)**: Ensure interactive elements meet 24×24 CSS px.
  ```css
  .touch-target {
    min-width: 24px;
    min-height: 24px;
  }
  ```
- **Reduced motion**: Honor user preference.
  ```typescript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```

### R-PERF (LCP, INP, CLS, bundle budgets)

- **[2026-02-18] Core Web Vitals**: LCP < 2.5s, INP ≤ 200 ms (replaced FID March 2024), CLS < 0.1; web.dev and Lighthouse.
- **[2026-02-18] Bundle**: Page shell < 250 KB gzipped; component-level budgets (e.g. hero < 40 KB); track via Lighthouse CI / next.config performanceBudgets.

### R-RADIX (Radix component APIs)

- **[2026-02-18] Radix primitives**: Slider, Label, Select, Tabs, Accordion, etc. — follow radix-ui.com docs; version in pnpm catalog (radix-ui ^1.0.0).
- **[2026-02-18] shadcn/ui**: Copy/paste pattern; Tailwind + cn(); no runtime dependency on shadcn.

#### Code Snippets

- **Radix primitive wrapper**: Standard pattern for 1.xx components.

  ```typescript
  import * as Primitive from '@radix-ui/react-primitive';
  import { cn } from '@repo/utils';

  const Root = React.forwardRef<
    React.ComponentRef<typeof Primitive.Root>,
    React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
  >(({ className, ...props }, ref) => (
    <Primitive.Root ref={ref} className={cn('primitive-root', className)} {...props} />
  ));
  ```

### R-FORM (React Hook Form, Zod, validation)

- **[2026-02-18] Stack**: React Hook Form + Zod; use `@hookform/resolvers/zod`; schema co-located in feature packages (packages/features).
- **[2026-02-18] Patterns**: useFormState for async errors; useFieldArray for dynamic fields; ref docs/architecture and existing ContactForm/BookingForm.

#### Code Snippets

- **Form with Zod resolver**:

  ```typescript
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';

  const schema = z.object({ name: z.string().min(1), email: z.string().email() });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });
  ```

### R-MARKETING (Hero, menu, pricing, testimonials, FAQ, sections)

- **[2026-02-18] RESEARCH.md §11**: Hero variants, menu/dietary chips, pricing tables, testimonial sliders, FAQ; navigation mega menu + mobile Sheet; canonical URLs for blog/pagination.
- **[2026-02-18] Package**: packages/marketing-components; existing hero, services, team, testimonials, pricing, gallery, stats, cta, faq, contact; add new families per task (e.g. menu under src/menu).

#### Code Snippets

- **Section with slots**: Composition pattern for marketing sections.
  ```typescript
  interface HeroProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
  }
  export function HeroSection({ title, subtitle, children }: HeroProps) {
    return (
      <section>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </section>
    );
  }
  ```

### R-INTEGRATION (Scheduling, OAuth, TCF)

- **[2026-02-18] Scheduling**: Calendly, Acuity, Cal.com adapters in packages/integrations; adapter contract first; consent gate before loading third-party scripts.
- **[2026-02-18] OAuth/Privacy**: OAuth 2.1 + PKCE for email/CRM; TCF v2.3 for consent; CMP before third-party embeds.

### R-INDUSTRY (JSON-LD, industry patterns)

- **[2026-02-18] JSON-LD**: packages/industry-schemas; limit 12 industries; Event, Place, LocalBusiness, etc.; validators for output.
- **[2026-02-18] Industries**: Services, restaurant, legal, medical, retail, etc.; implementation details in task files.

### R-NEXT (App Router, RSC, Server Actions)

- **[2026-02] Next.js 16**: App Router, Server Components, Server Actions by default; PPR optional (ppr: true); Turbopack dev; see RESEARCH.md §3.1.
- **[2026-02] Server Actions — IDOR prevention**: For actions that fetch/update by ID (e.g. booking confirm/cancel/getDetails), require verification params (e.g. `confirmationNumber` + `email`) so the server can reject requests when the caller cannot prove ownership. Pattern: `confirmBooking(bookingId, { confirmationNumber, email })`; reject when mismatch. Align tests with this design (0-5).

#### Code Snippets (R-NEXT — IDOR)

- **Server Action with verification** — packages/features/src/booking/lib/booking-actions.ts:
  ```typescript
  export async function confirmBooking(
    bookingId: string,
    verification: { confirmationNumber: string; email: string }
  ) {
    const booking = await getBooking(bookingId);
    if (
      !booking ||
      booking.confirmationNumber !== verification.confirmationNumber ||
      booking.email !== verification.email
    )
      return { success: false, error: 'Verification failed' };
    // ... perform confirm
  }
  ```

### R-INFRA (Slot, Provider, Context, Theme, CVA)

- **[2026-02-18] Patterns**: CVA for variants; design tokens (packages/config/tailwind-theme.css); Slot/Provider/Context; RESEARCH.md §13 infrastructure systems.
- **[2026-02-18] Layer**: config → utils → ui/types/infra → features → marketing-components → page-templates → clients; no packages → clients.

### R-CMS (Content adapters, MDX, pagination)

- **[2026-02-18] Adapters**: CMS-agnostic adapters; MDX for content; pagination with rel=prev/next and canonical URLs for SEO.

### R-TEST (Jest, axe-core, Playwright)

- **[2026-02-18] Jest**: Repo uses Jest 30 (root jest.config.js, package.json); node + jsdom projects; jest-axe for a11y; run pnpm test / pnpm test:coverage.
- **[2026-02-18] E2E**: Playwright for e2e; Vitest mentioned in RESEARCH.md as optional future — use Jest in task specs.

### R-DOCS (ADRs, config reference, migration)

- **[2026-02-18] ADRs**: Architecture Decision Records in docs/; standard format (context, decision, consequences).
- **[2026-02-18] Config reference**: docs/configuration/site-config-reference.md; migration in 6.2.

### R-AI (AI Platform: LLM gateway, content engine, agents)

- **[2026-02-18] THEGOAL.md Phase 7**: AI Platform (content-engine, llm-gateway, agent-orchestration); multi-provider LLM routing with fallback; Vercel AI SDK router; cost telemetry per tenant.
- **[2026-02-18] RESEARCH.md §16**: Retrieval-Augmented Generation for search/personalization; agent orchestration with Trigger-based agents; generative content tools.

### R-CONTENT-PLATFORM (Visual editor, DAM)

- **[2026-02-18] THEGOAL.md Phase 8**: Visual editor (drag-drop page builder), DAM-core (asset ingestion, AI tagging, variant generation); Canvas + ComponentPalette patterns.

### R-MARKETING-OPS (Campaign orchestration)

- **[2026-02-18] THEGOAL.md Phase 9**: Campaign orchestration, workflow automation; campaign planning + workflow automation patterns.

### R-TENANT (Multi-tenancy, SaaS)

- **[2026-02-18] THEGOAL.md Phase 10**: Full SaaS multi-tenancy; tenant-context, tenant-provisioning, feature flags per tenant; packages/infrastructure/tenant-core.

### R-DESIGN-TOKENS (Three-layer token architecture)

- **[2026-02-18] THEGOAL.md C.5**: Three-layer architecture: option-tokens.css (raw values), decision-tokens.css (semantic aliases), component-tokens.css (component-specific); DTCG v1.0 alignment; packages/config/tokens/.
- **[2026-02-18] RESEARCH.md §13**: Design Token pipeline exporting to Tailwind v4 + CSS vars; multi-brand theming with CSS cascade layers.

### R-MOTION (Animation/motion primitives)

- **[2026-02-18] THEGOAL.md C.6**: Motion primitives (entrance, emphasis, page transitions); Framer Motion 11 presets; packages/ui/motion/primitives.ts, presets.ts.
- **[2026-02-18] RESEARCH.md §14**: Reduced-motion guards; Activity component gating expensive renders.

### R-EXPERIMENTATION (A/B testing, feature flags, guardrails)

- **[2026-02-18] THEGOAL.md infra/experiments**: Feature flags (deterministic evaluation + kill-switch), A/B testing (variant assignment + exposure logging), guardrails (SRM checks, minimum run validation).
- **[2026-02-18] RESEARCH.md §12**: Server actions to enqueue experiments; edge flag resolution (Vercel Edge Config / Cloudflare KV); statistical analysis standards (D.2).

### R-EDGE (Edge middleware, personalization)

- **[2026-02-18] THEGOAL.md infra/edge**: Edge middleware primitives; tenant-experiment-context (edge variant selection + cache-safe keys).
- **[2026-02-18] RESEARCH.md §16**: Vercel Edge Functions / Cloudflare Workers for personalization; edge A/B tests; predictive prefetchers using Network Information API.

### R-OPS (Operational governance, queue policies)

- **[2026-02-18] THEGOAL.md infra/ops**: Operational governance; queue-policy.ts (queue fairness, retry budgets, timeout rules).
- **[2026-02-18] RESEARCH.md §12**: Durable workflows (Temporal/Trigger.dev) for CRM sync; retry/backoff policies; async queue governance (E.7).

### R-SECURITY-ADV (Security regression, threat modeling)

- **[2026-02-18] THEGOAL.md infra/**tests**/security-regression**: SSRF/XSS/injection scenario tests; continuous security program (C.13).
- **[2026-02-18] RESEARCH.md §17**: SIEM integrations; dependency scanning (GitHub Advanced Security/OWASP Dependency-Track); threat modeling playbooks.

### R-COMPLIANCE (Industry compliance packs)

- **[2026-02-18] THEGOAL.md C.17**: Industry compliance renderers; medical privacy, legal disclaimers; packages/features/compliance/renderers.
- **[2026-02-18] RESEARCH.md §17**: GDPR/CCPA/LGPD checklists; HIPAA-safe contact forms (BAA storage); compliance packs per industry.

### R-PERSONALIZATION (Personalization engine, behavioral tracking)

- **[2026-02-18] THEGOAL.md features/personalization**: Rules engine (privacy-safe, allowlist-only signals), segments (geo, returning visitor, campaign source), co-creation patterns (IKEA-effect participatory UX).
- **[2026-02-18] RESEARCH.md §12**: Privacy-first behavioral tracking; edge personalization; participatory personalization (F.6).

### R-LOCALIZATION (i18n, RTL, translation)

- **[2026-02-18] THEGOAL.md features/localization**: i18n-config.ts (locale routing + fallback chains), dictionaries (per-locale translation files).
- **[2026-02-18] RESEARCH.md §12**: next-intl integration; RTL support; AI translation options; C.11 i18n/RTL guide.

### R-VISUAL-REG (Visual regression testing)

- **[2026-02-18] THEGOAL.md C.7**: Visual regression checks; Storybook visual regression config; Chromatic/Applitools integration.
- **[2026-02-18] RESEARCH.md §18**: Visual regression gating merges for marketing components; UI tokens alignment.

### R-SPEC-DRIVEN (Spec-driven development)

- **[2026-02-18] THEGOAL.md C.15**: Spec-driven development; .kiro/specs (feature spec templates, ADR templates).
- **[2026-02-18] RESEARCH.md §12**: Spec-driven features; adapter interfaces; server action contracts; analytics taxonomy.

### R-AI-AGENTS (AI agent playbooks)

- **[2026-02-18] THEGOAL.md C.16**: AI-assisted delivery playbooks; .windsurf/workflows (implement-feature-from-spec.md, refactor-with-parity-checks.md).
- **[2026-02-18] RESEARCH.md §16**: Agent orchestration; Trigger-based agents; content-agent, seo-agent patterns.

### R-SERVICE-BLUEPRINT (Service blueprints, journey mapping)

- **[2026-02-18] THEGOAL.md E.2**: Service blueprints (booking-flow.md, contact-flow.md, lead-routing-map.md); user journey mapping.
- **[2026-02-18] docs/service-blueprints**: Blueprint templates; touchpoint identification; frontstage/backstage separation.

### R-UX-PATTERNS (Progressive conversion, peak-end, participatory UX)

- **[2026-02-18] THEGOAL.md E.6, F.4, F.6, F.7, F.12**: Progressive conversion patterns; peak-end journey guidelines; participatory personalization; wayfinding standards; service recovery patterns.
- **[2026-02-18] RESEARCH.md §12**: Progressive conversion UX primitive (ProgressStepper, StepConfidenceHint); latency-band response behavior; trust recovery after failures.

### R-STRATEGY (Cynefin, leverage points, portfolio kanban)

- **[2026-02-18] THEGOAL.md F.2, F.3, F.10**: Cynefin execution model; leverage-point scoring; portfolio kanban policy; WIP limits by lane.
- **[2026-02-18] docs/strategy**: Strategic frameworks; decision-making models; portfolio management.

### R-KNOWLEDGE (SECI-inspired knowledge flow)

- **[2026-02-18] THEGOAL.md F.11**: SECI-inspired knowledge flow; pattern capture templates.
- **[2026-02-18] docs/knowledge**: Knowledge management patterns; explicit/tacit knowledge conversion; pattern library.

### R-GOLDEN-PATH (Golden paths, DevEx metrics)

- **[2026-02-18] THEGOAL.md E.4**: Golden path new client; golden path new feature; DevEx adoption metrics.
- **[2026-02-18] docs/platform**: Developer experience standards; onboarding flows; success metrics.

### R-ERROR-BUDGET (Error budgets, SLOs, release gates)

- **[2026-02-18] THEGOAL.md E.3, C.14, D.5**: Error-budget release gate logic; SLO dashboards; error budget policy; postmortem templates.
- **[2026-02-18] RESEARCH.md §12**: SLO dashboards; error budget release policy; incident severity matrix.

### R-SPC (Statistical process control, delivery metrics)

- **[2026-02-18] THEGOAL.md F.8**: SPC control charts; delivery quality monitoring; process control thresholds.
- **[2026-02-18] docs/operations**: Statistical process control; delivery metrics; quality gates.

### R-SEARCH-AI (AI semantic search, vector embeddings, RAG)

- **[2026-02-18] RESEARCH.md §12**: AI semantic search pipeline (Encore + OpenAI embeddings + Qdrant) with vector cache per client; hybrid keyword reranking; analytics on zero-result queries.
- **[2026-02-18] RESEARCH.md §16**: Retrieval-Augmented Generation for search; vector embeddings; semantic ranking.

### R-E-COMMERCE (Headless commerce, payment gateways)

- **[2026-02-18] RESEARCH.md §12**: Headless commerce connectors (Shopify Storefront API, Commerce.js); PCI-scoped webhook relays; review ingestion with moderation queue.
- **[2026-02-18] RESEARCH.md §15**: Product tour components; ROI calculators; e-commerce patterns.

### R-WORKFLOW (Durable workflows, Temporal/Trigger.dev)

- **[2026-02-18] RESEARCH.md §12**: Durable workflows (Temporal/Trigger.dev) for CRM sync; signed webhook verification (Stripe-style); retry/backoff policies.
- **[2026-02-18] THEGOAL.md 2.44, 2.46**: Webhook feature; automation feature; workflow builder patterns.

### R-MONITORING (SLO dashboards, INP monitors, synthetic checks)

- **[2026-02-18] RESEARCH.md §12**: SLO dashboards; INP monitors; synthetic checks via Playwright; CSP/report-to endpoints.
- **[2026-02-18] THEGOAL.md 2.40, C.14**: Monitoring feature; performance SLOs; client-slo-dashboard-spec.

### R-CLI (CLI tooling, generators, scaffolding)

- **[2026-02] THEGOAL.md 6.8**: CLI tooling; create-client (turbo gen new-client), generate-component, validate-site-config.
- **[2026-02] Plop**: Use Plop 3.x; `setGenerator(name, { description, prompts, actions })`; actions can use `templateFiles` or custom `type: 'add'` with path templates; integrate with Turbo via root package.json script (e.g. `gen`: `plop --plopfile turbo/generators/config.ts`). Repo stub: turbo/generators/config.ts.
- **[2026-02] Turborepo generators**: Turbo can run generators via `turbo gen <generator>` if wired in turbo.json; alternatively `pnpm gen new-client` calling Plop. Source of truth for new client: copy from clients/starter-template; update package.json name to @clients/<name>; update site.config.ts id/name; run pnpm validate-client.
- **[2026-02] create-\*-app UX**: Optional --industry=X; config-driven; no hardcoded industry logic. Active tasks: 6-8a (Plop new-client), 6-8b (create-client CLI), 6-8c (validate-site-config), 6-8d (generate-component), 6-8e (wire pnpm health).

#### Code Snippets (R-CLI)

- **Plop new-client generator (conceptual)** — implement in turbo/generators/config.ts:
  ```javascript
  export default function (plop) {
    plop.setGenerator('new-client', {
      description: 'Scaffold a new client from starter-template',
      prompts: [
        { type: 'input', name: 'name', message: 'Client name (kebab-case):' },
        { type: 'input', name: 'industry', message: 'Industry (optional):' },
      ],
      actions: [
        // Copy clients/starter-template to clients/{{name}}/ then transform package.json, site.config.ts
      ],
    });
  }
  ```
- **Package.json script**: `"gen": "plop --plopfile turbo/generators/config.ts"` or wire via turbo.json.

### R-VERSIONING (Changesets, versioning strategy)

- **[2026-02-18] THEGOAL.md 0.12, C.4**: Changesets versioning; release channels (stable + canary); version-packages script.
- **[2026-02-18] RESEARCH.md**: Changeset workflow; release automation; versioning strategy docs.

### R-PARITY (Parity testing, refactor validation)

- **[2026-02-18] THEGOAL.md 2.22**: Parity tests vs original template; refactor-parity-matrix.md.
- **[2026-02-18] docs/testing**: Parity testing strategy; validation against original implementations; regression prevention.

### R-CONFIG-VALIDATION (Config schema validation, Zod)

- **[2026-02-18] THEGOAL.md 6.10a, 5.1**: Config schema validation; Zod runtime validator; validate-client script; site-config.schema.ts.
- **[2026-02-18] tooling/validation**: Config validation tooling; schema versioning; compatibility checks.

### R-MIGRATION (Template-to-client migration, cutover)

- **[2026-02-18] THEGOAL.md 6.1, 6.2**: Template-to-client migration; cutover-runbook.md; rollback-plan.md; client-go-live-checklist.md.
- **[2026-02-18] docs/migration**: Migration guides; validation matrix; cutover procedures.

### R-CLEANUP (Dead code removal, dependency pruning)

- **[2026-02-18] THEGOAL.md 6.9**: Dead code removal; dependency pruning; knip config; dependency-pruning-report.md.
- **[2026-02-18] knip**: Dead code detection; unused dependency identification; cleanup automation.

---

## Toolchain Reconciliation (Phase 2)

| Item     | RESEARCH.md                     | Repo reality                       | Action                                                   |
| -------- | ------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| Tailwind | 3.4                             | 4.1.0 (clients, config)            | Update RESEARCH.md to 4.1.0                              |
| Testing  | Vitest (unit), Playwright (e2e) | Jest 30 (package.json), Playwright | Update RESEARCH.md to Jest; note Vitest as future option |
| Node     | 22+                             | package.json engines ">=22.0.0"    | OK                                                       |

---

## Open Task List (excludes archive, prompt, meta)

1.xx: 1-12, 1-13, 1-14, 1-15, 1-16, 1-17, 1-18, 1-19, 1-20, 1-21, 1-22, 1-23, 1-24, 1-25, 1-26, 1-27, 1-28, 1-29, 1-30, 1-31, 1-32, 1-33, 1-34, 1-35, 1-36, 1-37, 1-38, 1-39, 1-40, 1-41, 1-42, 1-43, 1-44, 1-45, 1-46, 1-47, 1-48, 1-49, 1-50.  
2.xx: 2-1 through 2-62 (all non-archived).  
3.xx: 3-1 through 3-8.  
4.xx: 4-1 through 4-6.  
5.xx: 5-1 through 5-6.  
6.xx: 6-1, 6-2, 6-2a, 6-3, 6-4, 6-5, 6-6, 6-7, 6-8, 6-9, 6-10a.  
f.xx: f-1 through f-40.

_Meta files excluded:_ prompt.md, c-1-c-18-d-1-d-8.md, 6-10b-health-check.md, 6-10c-program-wave.md.

_Research-driven tasks (Phase 6):_ 0-1-populate-component-a11y-rubric, 0-2-fix-toast-sonner-api, 0-3-validate-task-file-paths.

---

## Coverage Verification

**Total research topics:** 44 topics (13 original + 31 from THEGOAL.md analysis)

**Task coverage:**

- ✅ All 1.xx UI primitives → R-UI, R-RADIX, R-A11Y
- ✅ All 2.xx marketing/features → R-MARKETING, R-A11Y, R-PERF, plus feature-specific topics (R-SEARCH-AI, R-E-COMMERCE, R-WORKFLOW, etc.)
- ✅ All 3.xx page templates → R-NEXT, R-CMS, R-MARKETING
- ✅ All 4.xx integrations → R-INTEGRATION, R-INDUSTRY
- ✅ All 5.xx client migrations → R-INDUSTRY, R-MIGRATION, R-CONFIG-VALIDATION, R-COMPLIANCE
- ✅ All 6.xx docs/cleanup → R-DOCS, R-CLI, R-MIGRATION, R-CLEANUP, R-CONFIG-VALIDATION
- ✅ All f.xx infrastructure → R-INFRA, plus system-specific topics (R-DESIGN-TOKENS, R-MOTION, R-EXPERIMENTATION, R-EDGE, R-OPS, etc.)

**THEGOAL.md-derived topics added:**

- AI Platform (R-AI) — Phase 7 future work
- Content Platform (R-CONTENT-PLATFORM) — Phase 8 future work
- Marketing Ops (R-MARKETING-OPS) — Phase 9 future work
- Tenant/Multi-tenancy (R-TENANT) — Phase 10 future work
- Design Tokens (R-DESIGN-TOKENS) — Three-layer architecture
- Motion/Animation (R-MOTION) — Animation primitives
- Experimentation (R-EXPERIMENTATION) — A/B testing, feature flags
- Edge Computing (R-EDGE) — Edge middleware, personalization
- Operational Governance (R-OPS) — Queue policies, retry/timeout
- Advanced Security (R-SECURITY-ADV) — Regression testing, threat modeling
- Compliance (R-COMPLIANCE) — Industry compliance packs
- Personalization (R-PERSONALIZATION) — Behavioral tracking, co-creation
- Localization (R-LOCALIZATION) — i18n, RTL
- Visual Regression (R-VISUAL-REG) — Storybook, Chromatic
- Spec-Driven Development (R-SPEC-DRIVEN) — Feature specs, ADRs
- AI Agents (R-AI-AGENTS) — Workflow automation
- Service Blueprints (R-SERVICE-BLUEPRINT) — Journey mapping
- UX Patterns (R-UX-PATTERNS) — Progressive conversion, peak-end, participatory UX
- Strategy (R-STRATEGY) — Cynefin, leverage points, portfolio kanban
- Knowledge Management (R-KNOWLEDGE) — SECI-inspired flow
- Golden Paths (R-GOLDEN-PATH) — DevEx metrics
- Error Budgets (R-ERROR-BUDGET) — SLOs, release gates
- Statistical Process Control (R-SPC) — Delivery metrics
- AI Search (R-SEARCH-AI) — Vector embeddings, RAG
- E-commerce (R-E-COMMERCE) — Headless commerce, payments
- Workflows (R-WORKFLOW) — Durable workflows, Temporal/Trigger.dev
- Monitoring (R-MONITORING) — SLO dashboards, synthetic checks
- CLI Tooling (R-CLI) — Generators, scaffolding
- Versioning (R-VERSIONING) — Changesets, release channels
- Parity Testing (R-PARITY) — Refactor validation
- Config Validation (R-CONFIG-VALIDATION) — Schema validation, Zod
- Migration (R-MIGRATION) — Template-to-client cutover
- Cleanup (R-CLEANUP) — Dead code, dependency pruning

**Next steps:** Each topic section above contains dated (2026-02-18) research findings. Tasks should reference these topics in their Research & Evidence sections for accurate, up-to-date guidance.
