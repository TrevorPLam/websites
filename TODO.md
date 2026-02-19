# Marketing Website Monorepo — Master TODO

**Last Updated:** February 17, 2026
**Goal:** Transform from template-based to feature-based, industry-agnostic marketing website platform
**Timeline:** 12 weeks | **Current State:** Single hair-salon template → **Target:** 12 industries, 20+ components, config-driven

---

## Normalized Task Specifications

Each task has a **normalized spec** in `docs/task-specs/` with the strict 15-section format:

| Spec File                                                             | Tasks                                             |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| [01-ui-primitives](docs/task-specs/01-ui-primitives.md)               | 1.2–1.6 (Toast, Tabs, Dropdown, Tooltip, Popover) |
| [02-marketing-components](docs/task-specs/02-marketing-components.md) | 1.7, 2.1–2.10                                     |
| [03-feature-breadth](docs/task-specs/03-feature-breadth.md)           | 2.16–2.19                                         |
| [04-page-templates](docs/task-specs/04-page-templates.md)             | 3.1–3.8                                           |
| [05-integrations](docs/task-specs/05-integrations.md)                 | 4.1–4.6                                           |
| [06-client-factory](docs/task-specs/06-client-factory.md)             | 5.1–5.6                                           |
| [07-cleanup-scripts](docs/task-specs/07-cleanup-scripts.md)           | 6.1–6.10                                          |
| [08-governance](docs/task-specs/08-governance.md)                     | C.1–D.8                                           |
| [09-innovation-future](docs/task-specs/09-innovation-future.md)       | E, F, Phase 7+                                    |

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

| Layer  | Package                      | Status                       | Scope                                                 |
| ------ | ---------------------------- | ---------------------------- | ----------------------------------------------------- |
| **--** | Housekeeping (Wave 0)        | 🟢 Complete                  | Config fixes, tooling, CI, bug fixes done             |
| **L2** | `@repo/ui`                   | 🟡 9 of 14                   | +5 UI primitives (Dialog, ThemeInjector)              |
| **L2** | `@repo/marketing-components` | 🔴 Package does not exist    | Create per 1.7, then 2.1–2.10 (10 component families) |
| **L2** | `@repo/features`             | 🟡 5 of 9                    | booking, contact, blog, services, search              |
| **L2** | `@repo/types`                | 🟢 In packages               | Moved from templates/shared; extended                 |
| **L3** | `@repo/page-templates`       | 🔴 Scaffolded only (no src/) | 0 of 7 templates; add 3.1 then 3.2–3.8                |
| **L3** | `clients/`                   | 🔴 Not Started               | Only README; add 5.1 (starter) then 5.2–5.6           |
| **L0** | `@repo/infra`                | 🟢 Exists                    | Security, middleware, logging, 7 env schemas          |
| **L0** | `@repo/integrations`         | 🟡 Partial                   | 3 exist, 6 more planned                               |

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

| Dependency Path         | Execution Rule                                                           |
| ----------------------- | ------------------------------------------------------------------------ |
| `0.3 → 0.13`            | Ship CI gate immediately after Turbo upgrade                             |
| `0.8 → 1.8 → 1.9`       | Finish package move before config/industry expansion                     |
| `1.7 → 2.1-2.10`        | Create marketing-components package (1.7) before any marketing component |
| `2.11 → 2.12/13/15/20`  | Do not start extraction before feature skeleton exists                   |
| `2.21 → 2.22`           | Establish strategy first, then parity suite                              |
| `2.12-2.20 → 2.22`      | Add parity tests per extracted feature                                   |
| `3.1 → 3.2-3.8`         | Registry and package scaffold (3.1) before any page template             |
| `3.2/3.3/3.5/3.8 → 5.1` | Only start starter after minimum page set done                           |
| `5.1 → 5.2/5.3/5.7`     | Use starter as single source for first launch factory                    |
| `6.1/5.2-5.6 → 6.3`     | Never delete `templates/` until migration matrix complete                |
| `6.3/6.9/5.7 → 6.10`    | Require rollback rehearsal before cutover sign-off                       |

**Fast blocker checks before starting any task:**

1. Confirm all listed dependencies are marked complete
2. Confirm no dependency points to deferred NEXT/LATER work
3. Confirm CI gate requirements for the task's wave are already green
4. Confirm rollback path exists for any destructive or migration task

### Batching and Streamlining

Tasks that share the same pattern or output can be batched to reduce repetition. Use the following batches and references:

| Batch | Tasks                              | Streamline approach                                                                                                                                                                                                                         |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | 1.2–1.6 (UI primitives)            | Use **Component Pattern Template** (below). Implement 1.3 Tabs first as reference; scaffold Toast, Dropdown, Tooltip, Popover from same template. Optional: `scripts/scaffold-ui-component.js` to generate Component.tsx + index.ts export. |
| **B** | 2.1–2.10 (marketing components)    | Shared types first (2.1a, 2.2a); same folder structure per domain: `index.ts`, `types.ts`, variants, barrel in marketing-components. 2.7 + 2.8 can be one session.                                                                          |
| **C** | 3.2–3.8 (page templates)           | After 3.1, build 3.2 HomePageTemplate as reference; copy structure for 3.3, 3.5, 3.8, 3.4, 3.6, 3.7; swap section keys and feature imports.                                                                                                 |
| **D** | 5.2–5.6 (example clients)          | **Script:** `scripts/create-example-client.js <name> [industry]` copies starter-template → `clients/<name>`, optionally seeds `site.config.ts`. Checklist: industry, conversion flows, layout options; then run validate-client.            |
| **E** | 2.16–2.19 (new features)           | Use **Feature Package Structure** template (below). Copy existing feature (e.g. contact/booking), find-replace name, then implement domain logic.                                                                                           |
| **F** | 4.1–4.5 (integrations)             | Adapter contract first (4.1a, 4.2a); reuse adapter + retry/timeout pattern. Optional: script to scaffold `packages/integrations/<name>/` with adapter + provider stub.                                                                      |
| **G** | 6.10a–6.10c (scripts)              | Do 6.10b (health) then 6.10a (validate-client); then 6.10c (program:wave\*). One script sprint, shared style.                                                                                                                               |
| **H** | 6.4, 6.5, 6.6, 6.7 (documentation) | 6.4a (Storybook setup) once; then doc sprint with shared template (purpose, usage, examples).                                                                                                                                               |
| **I** | C.1–C.18, D.x (governance)         | Script-heavy: single `scripts/` or `scripts/architecture/` convention; one pass to add check scripts + CI. Doc-heavy: batch policy/runbook docs. Optional: RUNBOOK.md table (Script → purpose → CI vs. manual).                             |

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

### February 17, 2026 (Sub-Agent Roster + Task Verification)

- **Sub-Agent Roster:** `docs/SUB-AGENT-ROSTER.md` created; each task is a discrete work unit with four-step instructions (verify local info, add missing info, research, update task + repo).
- **Sonner catalog:** `sonner: '^2.0.7'` added to `pnpm-workspace.yaml` catalog so @repo/ui can use `catalog:` when implementing Task 1.2. (Verified 2026-02-17: catalog entry present.)
- **Task 1.2 accuracy:** Sonner is not in @repo/ui today; it lives in `packages/features` and `templates/hair-salon`. Checklist: add sonner to @repo/ui deps via catalog; `packages/features/src/booking/components/BookingForm.tsx` line 29 is the single current usage to migrate to `@repo/ui`.
- **Research applied (2026-02-17):** Sonner 2.0.7 React 19–ready; use with Server Actions/useTransition for async feedback; known issues (memory leaks with dismissed toasts, timing). Vitest preferred over Jest for new unit tests (faster, ESM/TS native). WCAG 2.2 is W3C Rec (Dec 2024); 24×24 CSS px AA, 44×44 AAA; WCAG 3.0 Editor's Draft (Feb 2026). Radix UI unified package `radix-ui` v1.4.3; import from `radix-ui` (no per-primitive packages).

**Research summary (2026-02-17) — use for task updates:**

- **Sonner:** React 19 compatible; pair with useTransition/Server Actions for async toasts; avoid for long copy or critical errors (use Alert). Added to pnpm catalog (`sonner: '^2.0.7'`).
- **Radix UI:** Single `radix-ui` package (v1.4.3); import e.g. `import { Dialog, Popover, Tabs } from 'radix-ui'`; no @radix-ui/react-\* packages. Unified package confirmed in Dialog.tsx.
- **WCAG:** 2.2 current standard (24×24 px AA, 44×44 AAA); 3.0 in Editor's Draft (outcomes-based, Feb 2026).
- **Core Web Vitals:** INP replaced FID (March 2024); target INP ≤200ms (75th %). Updated all FID references to INP.
- **Testing:** Vitest preferred for new React unit tests (faster, ESM/TS native); Playwright for E2E; axe-core for a11y.
- **OAuth 2.1:** Draft status (draft-ietf-oauth-v2-1-14, Oct 2025; expires Apr 2026); PKCE required (was optional in 2.0).
- **TanStack Query:** Not in dependencies; optional for client-side caching if needed; React Server Components + Server Actions preferred.

**Verification updates (2026-02-17):**

- **Task 1.2:** Sonner catalog entry added; BookingForm.tsx line 29 confirmed as current usage.
- **Task 1.6:** Fixed dependency reference to radix-ui unified package; checklist updated.
- **Task 3.1:** Added types.ts to file system plan (was referenced but missing).
- **Task 3.8:** Added missing BookingPageTemplate task definition (was referenced in dependencies but not defined).
- **Task 5.1:** Fixed layer reference (L3, not L4).
- **Tasks 2.16-2.19:** Added local verification note that feature skeleton (2.11) exists (booking, contact, blog, services, search in packages/features/src/).
- **Task 2.16:** Updated TanStack Query references to note it's optional (not in dependencies).
- **Tasks 4.1, 4.2:** Added OAuth 2.1 draft status notes.
- **All tasks:** Updated FID → INP, WCAG 3.0 → WCAG 2.2 (current) + 3.0 (draft) where applicable.

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

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: No non-blocking notification system; users need feedback without modal blocking
- Layer: L2 (@repo/ui)
- Introduces: UI runtime (Toaster provider), sonner integration
- Uses `sonner` v2.0.7 already in pnpm catalog; confirmed React 19 compatible
- Current usage: `packages/features/src/booking/components/BookingForm.tsx` imports `toast` from sonner directly
- **Repository Status:** sonner catalog entry exists; @repo/ui dependency added

**2️⃣ Dependency Check:**

- **Completed:** None required
- **Packages:** `sonner` v2.0.7 (React 19 compatible: `'^18.0.0 || ^19.0.0 || ^19.0.0-rc'`)
- **Environment:** Client-only; must run in browser
- **CI:** `pnpm --filter @repo/ui build` green
- **Blockers:** None
- **2026 Notes:** Sonner v2.0.7 fully compatible with React 19.2; no useEffectEvent needed for toast logic.
  Optional: use with React 19 Actions/useTransition for async feedback. React Server Components compatible
  with client boundary. Performance: optimized for INP metric (<200ms target).

**3️⃣ File System Plan:**

- **Create:** `packages/ui/src/components/Toast.tsx` (wrapper/re-export of sonner), `packages/ui/src/components/Toaster.tsx` (Toaster placement)
- **Update:** `packages/ui/src/index.ts` — add `Toaster`, `toast` export
- **Delete:** None

**4️⃣ Public API Design:**

```ts
export function Toaster(props?: ToasterProps): JSX.Element;
export const toast: ToastFn; // success, error, warning, info, loading
interface ToasterProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  visibleToasts?: number;
  duration?: number;
}
```

- `toast.success(msg, { description?, duration?, id?, action? })` — id for dedupe, action for CTA
- `toast.promise(promise, { loading, success, error })` — async operations with loading states

**5️⃣ Data Contracts & Schemas:**

- No new schema. Sonner handles variants. Optional: typed event payload for analytics.

**6️⃣ Internal Architecture:**

- Toaster: single provider at root; stacks toasts; pause-on-hover via sonner
- toast(): imperative API; no controlled mode needed
- ARIA: `aria-live="polite"` via sonner
- **2026:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React 19.2 optimizations with Activity component potential for background toasts
- **React Compiler:** Auto-memoization ready (no manual useMemo/useCallback needed)

**7️⃣ Performance & SEO:**

- LCP: No impact (lazy render when first toast fires)
- Bundle: sonner already in deps; no extra split (< 10KB gzipped)
- SEO: Not relevant
- **2026 Optimizations:** React 19.2 rendering improvements; potential Activity component integration for background toast pre-rendering
- **Bundle Strategy:** Tree-shaking friendly; sonner v2.0.7 < 10KB gzipped; optimized for React 19
- **INP Optimization:** Minimal main thread impact; lazy render on first toast; respects React 19 rendering optimizations

**8️⃣ Accessibility:**

- ARIA live regions (sonner default)
- Focus not trapped; non-intrusive
- `prefers-reduced-motion`: respect via sonner/duration
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets not applicable to toasts); WCAG 3.0 preparation (Bronze level targeting)
- **Screen Readers:** Proper announcements via aria-live="polite"
- **Focus Management:** Non-intrusive; no focus trap (accessibility-first design)

**9️⃣ Analytics:**

- None by default. Future: optional `onToast` callback for conversion events.

**🔟 Testing Strategy:**

- Unit: `packages/ui/src/components/__tests__/Toast.test.tsx` — render Toaster, call toast.success, assert DOM
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** render + variant assertions + accessibility testing
- **E2E:** Critical path validation with Playwright

**1️⃣1️⃣ Example Usage:**

```tsx
import { Toaster, toast } from '@repo/ui';
// In layout/root
<Toaster position="top-right" richColors closeButton />;
// Usage examples
toast.success('Booking confirmed', {
  description: 'Check your email for details',
  action: { label: 'View Booking', onClick: () => router.push('/booking') },
});
// Promise integration
const savePromise = fetch('/api/save', { method: 'POST' });
toast.promise(savePromise, {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save',
});
```

**1️⃣2️⃣ Failure Modes:**

- Sonner version mismatch → pin in catalog at v2.0.7
- SSR: Toaster must be client-only; wrap in dynamic import if needed

**1️⃣3️⃣ AI Implementation Checklist:**

1. Add sonner to @repo/ui dependencies via catalog (`sonner: '^2.0.7'` is in `pnpm-workspace.yaml` catalog as of 2026-02-17)
2. Create `Toaster.tsx` wrapping `<Toaster />` from sonner with theme props
3. Create `Toast.tsx` re-exporting toast functions from sonner
4. Add exports to `packages/ui/src/index.ts`
5. Run `pnpm --filter @repo/ui type-check build`
6. Add smoke test (Vitest + RTL preferred per 2026 tooling)
7. Update existing sonner import in `packages/features/src/booking/components/BookingForm.tsx` (line 29) to use `@repo/ui`

**1️⃣4️⃣ Done Criteria:**

- Builds without warnings; Toaster renders; toast.success/error/warning/info work; no circular imports; existing BookingForm.tsx can be updated to use @repo/ui toast

**1️⃣5️⃣ Anti-Overengineering:**

- Do NOT add custom queue logic; sonner handles stacking
- Do NOT add persistence (localStorage)
- Stop at sonner integration; no custom toast component
- Do NOT add Activity component optimization yet (future enhancement)

**Related Files:**

- Task spec: `docs/task-specs/01-ui-primitives.md` (sections 1.2)
- Research: `RESEARCH_ENHANCED.md` (React 19, Sonner compatibility)
- Architecture: `THEGOAL.md` (UI layer structure)
- Dependencies: `packages/ui/package.json`, `pnpm-workspace.yaml` catalog
- Current usage: `packages/features/src/booking/components/BookingForm.tsx` (line 29)

---

#### 1.3 Create Tabs Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Tabbed content needs accessible tablist with roving focus
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Tabs wrapper
- Current state: Dialog.tsx already uses unified radix-ui package (line 30)

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Migration:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { Tabs as TabsPrimitive } from 'radix-ui'`
- **Repository Status:** radix-ui catalog entry exists; unified package already in use

**3️⃣ File System Plan:**

- **Create:** `packages/ui/src/components/Tabs.tsx`
- **Update:** `packages/ui/src/index.ts`

**4️⃣ Public API Design:**

```ts
interface TabsProps extends Omit<TabsPrimitive.RootProps, 'orientation'> {
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  variant?: 'default' | 'pills';
  size?: 'sm' | 'md';
  className?: string;
}
interface TabsListProps { children: ReactNode; className?: string; }
interface TabsTriggerProps { value: string; children: ReactNode; className?: string; }
interface TabsContentProps { value: string; children: ReactNode; className?: string; }
export const Tabs: React.ForwardRefExoticComponent<TabsProps>;
export const TabsList, TabsTrigger, TabsContent: ...
```

**5️⃣ Data Contracts:**

- No new schema. Value strings must be unique per tabs instance.

**6️⃣ Internal Architecture:**

- Radix Tabs + CVA variants; controlled/uncontrolled via `value` + `defaultValue`
- `activationMode`: automatic (default) vs manual (keyboard only)
- Transitions: use `prefers-reduced-motion: reduce` media query; disable animations when set
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)

**7️⃣ Performance & SEO:**

- LCP: Lazy content OK if not visible initially
- SEO: All tab content in DOM (not hidden from crawlers if rendered)
- **Bundle Strategy:** Tree-shaking friendly; radix-ui optimized for React 19
- **INP Optimization:** Efficient keyboard navigation; minimal main thread impact

**8️⃣ Accessibility:**

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Arrow key roving focus
- `aria-selected`, `aria-controls`, `aria-labelledby`
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets); WCAG 3.0 preparation (Bronze level targeting)
- **Focus Management:** Radix handles roving focus; respects user preferences
- **Screen Readers:** Proper semantic structure maintained with WAI-ARIA authoring practices

**9️⃣ Analytics:**

- None by default

**🔟 Testing Strategy:**

- `packages/ui/src/components/__tests__/Tabs.test.tsx` — keyboard nav, controlled/uncontrolled
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Accessibility:** Automated a11y testing with axe-core
- **Visual Regression:** Storybook/Chromatic integration optional

**1️⃣1️⃣ Example Usage:**

```tsx
<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">Tab A</TabsTrigger>...
  </TabsList>
  <TabsContent value="a">Content A</TabsContent>
</Tabs>
```

**1️⃣2️⃣ Failure Modes:**

- Radix version mismatch → pin in catalog at v1.4.3
- Duplicate values → runtime error

**1️⃣3️⃣ AI Implementation Checklist:**

1. Import Tabs primitive from unified radix-ui package
2. Create Tabs.tsx following Dialog.tsx pattern
3. Add CVA variants (horizontal/vertical, size)
4. Respect prefers-reduced-motion in transitions
5. Export; type-check; build
6. Add accessibility tests (axe-core integration)

**1️⃣4️⃣ Done Criteria:**

- Builds; keyboard nav works; controlled/uncontrolled modes; no Radix warnings

**1️⃣5️⃣ Anti-Overengineering:**

- No URL-synced tabs (that belongs in page-templates)
- No animations beyond CSS transition; no framer-motion
- Follow existing Dialog.tsx patterns for consistency

**Related Files:**

- Task spec: `docs/task-specs/01-ui-primitives.md` (sections 1.3)
- Research: `RESEARCH_ENHANCED.md` (Radix UI unified package, React 19)
- Architecture: `THEGOAL.md` (UI primitives layer)
- Dependencies: `packages/ui/package.json`, `pnpm-workspace.yaml` catalog
- Pattern reference: `packages/ui/src/components/Dialog.tsx` (unified radix-ui usage)

**Technical Requirements:**

- Horizontal and vertical variants
- Controlled and uncontrolled modes
- `activationMode` (automatic/manual)
- Smooth content transitions respecting `prefers-reduced-motion`
- Dependencies: `radix-ui` (unified package)

**Files:**

- Create: `packages/ui/src/components/Tabs.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.4 Create Dropdown Menu Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 4 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Clickable button revealing action list. Full keyboard semantics and nested menu support.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix DropdownMenu wrapper
- Current state: Select.tsx exists but is native HTML select (not Radix dropdown)

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { DropdownMenu } from 'radix-ui'`
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

**3️⃣ File System Plan:**

- **Create:** `packages/ui/src/components/DropdownMenu.tsx`
- **Update:** `packages/ui/src/index.ts`

**4️⃣ Public API Design:**

```ts
export const DropdownMenu: typeof DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger: typeof DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent: typeof DropdownMenuPrimitive.Content;
export const DropdownMenuItem: typeof DropdownMenuPrimitive.Item;
export const DropdownMenuCheckboxItem: typeof DropdownMenuPrimitive.CheckboxItem;
export const DropdownMenuRadioGroup: typeof DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem: typeof DropdownMenuPrimitive.RadioItem;
export const DropdownMenuLabel: typeof DropdownMenuPrimitive.Label;
export const DropdownMenuSeparator: typeof DropdownMenuPrimitive.Separator;
export const DropdownMenuSub: typeof DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger: typeof DropdownMenuPrimitive.SubTrigger;
export const DropdownMenuSubContent: typeof DropdownMenuPrimitive.SubContent;
export const DropdownMenuArrow: typeof DropdownMenuPrimitive.Arrow;
export const DropdownMenuItemIndicator: typeof DropdownMenuPrimitive.ItemIndicator;
```

**5️⃣ Data Contracts:**

- No new schema. Item selection handled by callbacks.

**6️⃣ Internal Architecture:**

- Radix DropdownMenu + CVA variants for styling
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)
- **Styling:** Tailwind v4 container queries, CSS cascade layers
- **Features:** Submenus, checkbox/radio items, collision handling, typeahead

**7️⃣ Performance & SEO:**

- LCP: No impact (lazy render on interaction)
- Bundle: Tree-shaking friendly, < 15KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Radix optimized for tree-shaking
- **INP Optimization:** Efficient keyboard navigation; minimal main thread impact; portal rendering prevents layout shift

**8️⃣ Accessibility:**

- Full keyboard navigation (arrow keys, Enter, Escape, typeahead)
- ARIA attributes handled by Radix (Menu Button WAI-ARIA pattern)
- Focus management and trap with roving tabindex
- **2026 Standards:** WCAG 2.2 AA compliance (24×24px minimum for touch targets), WCAG 3.0 preparation (Bronze level targeting)
- **Screen Readers:** Proper semantic structure maintained with WAI-ARIA authoring practices
- **Focus Management:** Non-intrusive; no focus trap (accessibility-first design)
- **Reduced Motion:** Respect prefers-reduced-motion for all animationspects user preferences

**9️⃣ Analytics:**

- None by default. Optional: onItemClick callback for tracking

**🔟 Testing Strategy:**

- `packages/ui/src/components/__tests__/DropdownMenu.test.tsx`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** Keyboard nav, nested menus, checkbox/radio items, collision handling

**1️⃣1️⃣ Example Usage:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => copy()}>Copy</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => delete()}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**1️⃣2️⃣ Failure Modes:**

- Radix version mismatch → pin in catalog at v1.4.3
- Z-index conflicts → ensure proper stacking context

**1️⃣3️⃣ AI Implementation Checklist:**

1. Import DropdownMenu primitives from unified radix-ui package
2. Create DropdownMenu.tsx with all sub-components
3. Add CVA variants for positioning/styling
4. Test keyboard navigation thoroughly (including typeahead)
5. Export all components; type-check; build
6. Add accessibility tests (axe-core integration)

**1️⃣4️⃣ Done Criteria:**

- Builds; keyboard nav works; nested menus function; no Radix warnings

**1️⃣5️⃣ Anti-Overengineering:**

- No custom positioning logic (Radix handles collision detection)
- No animations beyond CSS transitions
- Stop at Radix integration; no custom dropdown logic

**Related Files:**

- Task spec: `docs/task-specs/01-ui-primitives.md` (sections 1.4)
- Research: `RESEARCH_ENHANCED.md` (Radix UI unified package)
- Architecture: `THEGOAL.md` (UI primitives layer)
- Dependencies: `packages/ui/package.json`, `pnpm-workspace.yaml` catalog
- Pattern reference: `packages/ui/src/components/Dialog.tsx` (unified radix-ui usage)
- Existing pattern: `packages/ui/src/components/Select.tsx` (native select for comparison)

**Technical Requirements:**

- Keyboard navigation (arrow keys, Enter, Escape, typeahead)
- Nested submenus, separators, checkbox/radio items
- Alignment and collision handling
- Dependencies: `radix-ui` (unified package)

**Files:**

- Create: `packages/ui/src/components/DropdownMenu.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.5 Create Tooltip Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Small popup on hover/focus showing help text.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Tooltip wrapper
- Current state: No existing tooltip components in UI package

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** `radix-ui` v1.4.3 (includes Tooltip in unified package)
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx)
- **Import Pattern:** `import { Tooltip } from 'radix-ui'`

**3️⃣ File System Plan:**

- **Create:** `packages/ui/src/components/Tooltip.tsx`
- **Update:** `packages/ui/src/index.ts`

**4️⃣ Public API Design:**

```ts
interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}
export const Tooltip: React.ForwardRefExoticComponent<TooltipProps>;
export const TooltipProvider: typeof TooltipPrimitive.Provider;
```

**5️⃣ Data Contracts:**

- No new schema. Content can be string or ReactNode.

**6️⃣ Internal Architecture:**

- Radix Tooltip + global provider for delay defaults
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready
- **Styling:** CSS custom properties for transform origin and collision data
- **Features:** Collision handling, arrow positioning, portal rendering

**7️⃣ Performance & SEO:**

- LCP: No impact (renders on hover/focus)
- Bundle: < 5KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Tree-shaking friendly; lazy rendering

**8️⃣ Accessibility:**

- ARIA attributes handled by Radix (Tooltip WAI-ARIA pattern)
- Keyboard and screen reader support
- **2026 Standards:** WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets)
- **WCAG 1.4.13:** Content on Hover or Focus compliance (disableHoverableContent prop)
- **Focus Management:** Radix handles focus trapping and escape key

**9️⃣ Analytics:**

- None by default

**🔟 Testing Strategy:**

- `packages/ui/src/components/__tests__/Tooltip.test.tsx`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **Coverage:** hover/focus behavior, delay timing, collision handling, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<Tooltip content="Save changes">
  <Button>Save</Button>
</Tooltip>
```

**1️⃣2️⃣ Failure Modes:**

- Z-index conflicts
- Delay timing issues
- WCAG 1.4.13 violations (content disappears on hover)

**1️⃣3️⃣ AI Implementation Checklist:**

1. Import Tooltip primitives from unified radix-ui package
2. Create Tooltip.tsx with provider setup
3. Add delay configuration with proper defaults
4. Test hover/focus behavior thoroughly
5. Export; type-check; build

**1️⃣4️⃣ Done Criteria:**

- Builds; hover/focus works; proper delays; no Radix warnings

**1️⃣5️⃣ Anti-Overengineering:**

- No custom positioning (Radix handles)
- No complex animations
- Stop at Radix integration; no custom tooltip logic

**Related Files:**

- Task spec: `docs/task-specs/01-ui-primitives.md` (sections 1.5)
- Research: `RESEARCH_ENHANCED.md` (Radix UI unified package)
- Architecture: `THEGOAL.md` (UI primitives layer)
- Dependencies: `packages/ui/package.json`, `pnpm-workspace.yaml` catalog
- Pattern reference: `packages/ui/src/components/Dialog.tsx` (unified radix-ui usage)

**Technical Requirements:**

- Hover and focus triggers
- Positioning: top, bottom, left, right with collision handling
- Global provider for delay defaults
- Dependencies: `radix-ui` (unified package)

**Files:**

- Create: `packages/ui/src/components/Tooltip.tsx`
- Update: `packages/ui/src/index.ts`

---

#### 1.6 Create Popover Component | **Batch:** A

**Priority:** CRITICAL | **Effort:** 3 hrs | **Dependencies:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Rich interactive overlay (more complex than tooltip). Click-outside dismissal, focus management.
- Layer: L2 (@repo/ui)
- Introduces: UI component, Radix Popover wrapper
- Current state: No existing popover components in UI package
- **Repository Status**: radix-ui catalog entry exists; unified package already in use
- **2026 Requirements**: WCAG 2.2 AA compliance with Dialog WAI-ARIA pattern

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** `radix-ui: '^1.0.0'` in pnpm catalog (React 19 compatible: `'^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc'`)
- **CI:** @repo/ui build green
- **2026 Update:** Already using unified radix-ui package (confirmed in Dialog.tsx line 30)
- **Import Pattern:** `import { Popover } from 'radix-ui'`
- **Repository Status**: radix-ui catalog entry exists; unified package already in use

**3️⃣ File System Plan:**

- **Create:** `packages/ui/src/components/Popover.tsx`
- **Update:** `packages/ui/src/index.ts`

**4️⃣ Public API Design:**

```ts
export const Popover: typeof PopoverPrimitive.Root;
export const PopoverTrigger: typeof PopoverPrimitive.Trigger;
export const PopoverContent: typeof PopoverPrimitive.Content;
export const PopoverAnchor: typeof PopoverPrimitive.Anchor;
export const PopoverArrow: typeof PopoverPrimitive.Arrow;
export const PopoverClose: typeof PopoverPrimitive.Close;
```

- **Positioning**: side (top|right|bottom|left), align, collisionPadding
- **Modal Mode**: modal boolean for focus trapping behavior
- **Focus Management**: Fully managed and customizable

**5️⃣ Data Contracts:**

- No new schema. Open state controlled/uncontrolled.
- **2026 Features:** Support for rich content with proper ARIA semantics

**6️⃣ Internal Architecture:**

- Radix Popover + CVA variants for styling
- **2026 Features:** React 19 Server Components compatible (client-only boundary)
- **Performance:** React Compiler auto-memoization ready; minimal re-renders; INP optimization (<200ms target)
- **Styling:** Tailwind v4 container queries support; CSS cascade layers ready
- **Accessibility:** WCAG 2.2 Dialog WAI-ARIA pattern compliance
- **Features:** Modal/non-modal modes, collision handling, arrow positioning, portal rendering

**7️⃣ Performance & SEO:**

- LCP: No impact (lazy render on trigger)
- Bundle: Tree-shaking friendly, < 15KB gzipped
- SEO: Not relevant
- **Bundle Strategy:** Radix optimized for tree-shaking
- **INP Optimization:** Efficient trigger handling; minimal main thread impact; portal rendering prevents layout shift

**8️⃣ Accessibility:**

- WCAG 2.2 Dialog WAI-ARIA pattern compliance
- ARIA attributes handled by Radix (role="dialog", aria-modal)
- Focus management with trap (modal mode) and proper restoration
- **2026 Standards:** 24×24 CSS pixels minimum for touch targets
- **Screen Readers:** Proper semantic structure with dialog role
- **Focus Management:** Escape key dismissal; focus restoration on close

**9️⃣ Analytics:**

- None by default

**🔟 Testing Strategy:**

- `packages/ui/src/components/__tests__/Popover.test.tsx`
- **2026 Tools:** Playwright component testing

**1️⃣1️⃣ Example Usage:**

```tsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Rich content here</PopoverContent>
</Popover>
```

**1️⃣2️⃣ Failure Modes:**

- Focus management issues
- Click-outside not working

**1️⃣3️⃣ AI Implementation Checklist:**

1. Import Popover primitives from unified radix-ui package
2. Create Popover.tsx with Root, Trigger, Content, Anchor, Arrow, Close
3. Add CVA variants for positioning/styling
4. Test modal/non-modal modes and focus management
5. Export all components; type-check; build
6. Add accessibility tests (axe-core integration)

**1️⃣4️⃣ Done Criteria:**

- Builds; focus trap works; click-outside dismisses

**1️⃣5️⃣ Anti-Overengineering:**

- No custom positioning (Radix handles collision detection)
- No complex animations

**Related Files:**

- Task spec: `docs/task-specs/01-ui-primitives.md` (sections 1.6)
- Research: `RESEARCH_ENHANCED.md` (Radix UI unified package); pattern reference: `packages/ui/src/components/Dialog.tsx`

**Technical Requirements:**

- Click-outside dismissal
- Focus management
- Anchored positioning with collision padding
- Dependencies: `radix-ui` (unified package; already a dependency of @repo/ui — import Popover from `radix-ui`)

**Files:**

- Create: `packages/ui/src/components/Popover.tsx`
- Update: `packages/ui/src/index.ts`

---

## Marketing Components Package + Components

#### 1.7 Create @repo/marketing-components Package Scaffold | **Effort:** 2 hrs | **Dependencies:** None

**Status:** [x] COMPLETED | **Assigned To:** Assistant | **Completed:** [2026-02-19]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: No target package for 2.1–2.10 marketing components
- Layer: L2 (new package)
- Introduces: Package scaffold, no runtime logic yet
- Current state: Package does not exist; workspace ready
- **Repository Status**: pnpm-workspace.yaml includes `packages/*`; ready for new package
- **2026 Requirements**: React 19 Server Components ready, TypeScript strict mode

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** pnpm workspace; react from catalog; @repo/ui, @repo/utils, @repo/types
- **Blockers:** None
- **Repository Status**: Workspace configured; catalog dependencies available
- **2026 Update**: React 19.2 compatibility; Server Components preparation

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/package.json`, `tsconfig.json`, `src/index.ts`
- **Update:** None (workspace `packages/*` already includes it)
- **Delete:** None

**4️⃣ Public API Design:**

```ts
// src/index.ts — barrel export; empty for now
export {};

// Future structure for Server Components:
// src/client.ts — client-only components
// src/server.ts — server components
```

**5️⃣ Data Contracts:**

- No new schema

**6️⃣ Internal Architecture:**

- package.json: name `@repo/marketing-components`, deps: `@repo/ui`, `@repo/utils`, `@repo/types`; peer: react, react-dom (catalog)
- **2026 React 19.2 Features:** Prepare conditional exports for Server Components
- **Package Structure:**
  ```json
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts"
  }
  ```
- **Performance:** Tree-shaking friendly exports, side-effects free
- **TypeScript:** Strict mode with advanced patterns for component interfaces
- **2026 Standards:** Component library best practices with accessibility built-in

**7️⃣ Performance & SEO:**

- No impact (empty package)
- **Bundle Strategy:** Tree-shaking ready; minimal footprint
- **Performance Standards:** Ready for Core Web Vitals optimization

**8️⃣ Accessibility:**

- Not applicable for scaffold
- **2026 Preparation**: WCAG 2.2 AA compliance ready for future components

**9️⃣ Analytics:**

- None

**🔟 Testing Strategy:**

- Build succeeds; no tests for empty package
- **2026 Tools:** Vitest (replacing Jest for performance) ready for future components
- **Testing Strategy:** Accessibility testing with axe-core integration planned

**1️⃣1️⃣ Example Usage:**

- N/A (scaffold only)

**1️⃣2️⃣ Failure Modes:**

- Workspace not including new package
- Dependency conflicts

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create package.json with correct name and dependencies
2. Create tsconfig.json extending base config with strict mode
3. Create src/index.ts barrel export (empty for now)
4. Create src/client.ts and src/server.ts placeholders for RSC readiness
5. Verify workspace includes the package
6. Run `pnpm --filter @repo/marketing-components build`
7. **2026 Update:** Configure conditional exports for future Server Components
8. **2026 Standards:** Ensure accessibility and performance compliance ready

**1️⃣4️⃣ Done Criteria:**

- Package builds successfully; workspace recognizes it
- **2026 Requirements:** React 19 compatibility; TypeScript strict mode; Server Components ready

**1️⃣5️⃣ Anti-Overengineering:**

- No components yet (that's 2.1–2.10)
- No complex build setup
- **2026 Guidelines:** Follow component library best practices with accessibility built-in

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 1.7)
- Research: `RESEARCH_ENHANCED.md` (Monorepo structure, package management)
- Architecture: `THEGOAL.md` (Marketing components layer)

**Local verification (2026-02-17):** Package `packages/marketing-components` does not exist; `pnpm-workspace.yaml` includes `packages/*`, so the new package will be included when created.

**Technical Requirements:**

- Create `packages/marketing-components/package.json` (name: `@repo/marketing-components`, deps: `@repo/ui`, `@repo/utils`, `@repo/types`, catalog for react)
- Create `packages/marketing-components/tsconfig.json` extending `../config/typescript-config/react.json`
- Create `packages/marketing-components/src/index.ts` (barrel export; empty or placeholder)
- Ensure workspace includes the package (packages/\* already covers it)
- **2026 Update:** Prepare exports structure for future React Server Components compatibility

**Files:**

- Create: `packages/marketing-components/package.json`
- Create: `packages/marketing-components/tsconfig.json`
- Create: `packages/marketing-components/src/index.ts`

**Dependency:** 1.7 must be complete before any of 2.1–2.10.

---

#### 2.1 Build HeroVariants Components | **Effort:** 6 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need flexible hero section variants for different industries and use cases
- Layer: L2 (@repo/marketing-components)
- Introduces: 4 hero variants with shared interface, LCP-optimized

**2️⃣ Dependency Check:**

- **Completed:** ❌ 1.7 (package scaffold NOT created - status IN_PROGRESS but package missing)
- **Packages:** @repo/ui (Button, Container - verified in src/index.ts), @repo/types, @repo/utils
- **Current Hero Implementation:** `templates/hair-salon/components/Hero.tsx` (81 lines, uses @repo/ui Button/Container, next/image)
- **Blockers:** 1.7 must be complete - @repo/marketing-components package does not exist

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/hero/` directory
- **Create:** `types.ts`, `HeroCentered.tsx`, `HeroSplit.tsx`, `HeroVideo.tsx`, `HeroCarousel.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: { text: string; href: string };
  secondaryAction?: { text: string; href: string };
  backgroundImage?: string;
  videoSrc?: string;
  slides?: HeroSlide[];
  variant?: 'centered' | 'split' | 'video' | 'carousel';
  className?: string;
}
export const HeroCentered: React.FC<HeroProps>;
export const HeroSplit: React.FC<HeroProps>;
export const HeroVideo: React.FC<HeroProps>;
export const HeroCarousel: React.FC<HeroProps>;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const heroPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryAction: z.object({ text: z.string(), href: z.string() }).optional(),
  secondaryAction: z.object({ text: z.string(), href: z.string() }).optional(),
  backgroundImage: z.string().optional(),
  videoSrc: z.string().optional(),
  slides: z.array(heroSlideSchema).optional(),
  variant: z.enum(['centered', 'split', 'video', 'carousel']).optional(),
});
```

**6️⃣ Internal Architecture:**

- Shared `HeroProps` interface for all variants
- **2026 Features:** React 19 Server Components compatible (static content as Server Components), React Compiler v1.0 automatic memoization
- **Performance:** LCP optimization with priority hints (< 2.5s target), INP optimization (<200ms), lazy loading for non-critical assets
- **Styling:** Tailwind v4 container queries, CSS cascade layers
- **Accessibility:** WCAG 2.2 AA compliance (24×24px touch targets), WCAG 3.0 preparation (Bronze level targeting)

**7️⃣ Performance & SEO:**

- **LCP:** Prioritize above-the-fold content, preload critical images (target < 2.5s per Core Web Vitals)
- **Bundle:** Code-split per variant, < 25KB gzipped each
- **SEO:** Semantic heading structure (h1, h2), structured data support
- **2026 Optimizations:** React 19.2 rendering improvements, React Compiler automatic memoization, edge caching strategies, INP optimization (<200ms target)

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance (24×24px touch targets)
- Semantic HTML: `<header>`, `<main>`, `<section>` landmarks
- ARIA labels for decorative images
- Keyboard navigation for carousel
- **2026 Standards:** WCAG 3.0 preparation (Bronze level)

**9️⃣ Analytics:**

- Component-level tracking for hero interactions
- CTA click tracking with variant attribution
- Scroll depth for hero visibility

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/hero/__tests__/Hero*.test.tsx`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library, Playwright for E2E
- **Coverage:** All variants, responsive behavior, accessibility with axe-core integration
- **Visual Regression:** Storybook screenshots for each variant
- **Type Safety:** Discriminated union validation in tests

**1️⃣1️⃣ Example Usage:**

```tsx
<HeroCentered
  title="Transform Your Business"
  subtitle="Digital Marketing Solutions"
  description="We help businesses grow with data-driven strategies"
  primaryAction={{ text: 'Get Started', href: '/contact' }}
  secondaryAction={{ text: 'Learn More', href: '/about' }}
  backgroundImage="/hero-bg.jpg"
/>
```

**1️⃣2️⃣ Failure Modes:**

- Image optimization issues → use next/image with proper sizing
- Video loading performance → implement poster images and lazy loading
- Carousel accessibility → ensure proper ARIA labels and keyboard controls

**1️⃣3️⃣ AI Implementation Checklist:**

⚠️ **BLOCKED until 1.7 is completed**

1. Verify 1.7 is complete and @repo/marketing-components package exists
2. Create shared types.ts with HeroProps interface (discriminated unions)
3. Implement HeroCentered with responsive design (baseline for LCP)
4. Implement HeroSplit with image/content layout
5. Implement HeroVideo with optimization and fallback (respect prefers-reduced-motion)
6. Implement HeroCarousel with accessibility controls
7. Add barrel export in index.ts
8. Create comprehensive tests (Vitest + RTL) for each variant
9. Add Storybook documentation
10. Verify React Compiler optimization working (no manual useMemo needed)

**1️⃣4️⃣ Done Criteria:**

- ✅ @repo/marketing-components package exists (dependency 1.7)
- All 4 variants render correctly
- Shared TypeScript interface works across variants (discriminated unions)
- LCP performance meets targets (< 2.5s)
- INP optimization meets targets (<200ms)
- Accessibility passes axe-core testing (WCAG 2.2 AA)
- Responsive design works on all breakpoints
- React Compiler automatic memoization working

**1️⃣5️⃣ Anti-Overengineering:**

- No complex animation libraries (CSS transitions only)
- No custom video players (use HTML5 video element)
- No carousel libraries (simple React state management)
- No manual memoization (React Compiler handles this automatically)
- No CMS adapters (keep 4 variants only)

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.1)
- Research: `RESEARCH_ENHANCED.md` (Performance optimization, accessibility)
- Architecture: `THEGOAL.md` (Marketing components layer)
- Dependencies: `packages/ui/src/index.ts` (Button, Container verified)
- Current Implementation: `templates/hair-salon/components/Hero.tsx` (reference pattern)
- Performance: Core Web Vitals targets (LCP < 2.5s, INP < 200ms)

**Subtasks (parent complete when all done):**

- **2.1a** Shared `HeroProps` + types
- **2.1b** HeroCentered
- **2.1c** HeroSplit
- **2.1d** HeroVideo
- **2.1e** HeroCarousel

**Files:** `packages/marketing-components/src/hero/`

---

#### 2.2 Build ServiceShowcase Components | **Effort:** 6 hrs | **Dependencies:** 1.7, 1.3 | **Batch:** B

**Status:** [🚫] BLOCKED | **Assigned To:** [ ] | **Completed:** [ ]

**BLOCKER:** Task 1.3 must be completed first - Tabs component missing

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need flexible service display layouts for different business types
- Layer: L2 (@repo/marketing-components)
- Introduces: 4 service layouts with normalized data shape, uses Tabs component

**2️⃣ Dependency Check:**

- **Completed:** ❌ 1.7 (package scaffold NOT created - status IN_PROGRESS but package missing)
- **Completed:** ❌ 1.3 (Tabs component NOT created - missing from @repo/ui)
- **Packages:** @repo/ui (Card, Container verified, Tabs missing), @repo/types, @repo/utils
- **Current Service Implementation:** `packages/features/src/services/components/ServicesOverview.tsx` (67 lines, uses @repo/ui Card/Container/Section)
- **Service Types:** `packages/features/src/services/types.ts` defines ServiceOverviewItem
- **Blockers:** 1.7 and 1.3 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/services/` directory
- **Create:** `types.ts`, `ServiceGrid.tsx`, `ServiceList.tsx`, `ServiceTabs.tsx`, `ServiceAccordion.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
  image?: string;
  features?: string[];
  category?: string;
}
interface ServicesProps {
  services: Service[];
  layout?: 'grid' | 'list' | 'tabs' | 'accordion';
  columns?: 2 | 3 | 4;
  showPricing?: boolean;
  className?: string;
}
export const ServiceGrid: React.FC<ServicesProps>;
export const ServiceList: React.FC<ServicesProps>;
export const ServiceTabs: React.FC<ServicesProps>;
export const ServiceAccordion: React.FC<ServicesProps>;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string().optional(),
  duration: z.string().optional(),
  image: z.string().optional(),
  features: z.array(z.string()).optional(),
  category: z.string().optional(),
});
const servicesPropsSchema = z.object({
  services: z.array(serviceSchema),
  layout: z.enum(['grid', 'list', 'tabs', 'accordion']).optional(),
  columns: z.enum([2, 3, 4]).optional(),
  showPricing: z.boolean().optional(),
});
```

**6️⃣ Internal Architecture:**

- Normalized Service interface across all layouts
- **2026 Features:** React 19 Server Components compatible (static layouts as Server Components), React Compiler v1.0 automatic memoization
- **Performance:** Lazy loading for images with next/image, virtualization for large lists (optional)
- **Styling:** Tailwind v4 container queries, CSS cascade layers
- **Accessibility:** WCAG 2.2 AA compliance (24×24px touch targets), semantic markup, ARIA labels, keyboard navigation
- **RSC Strategy:** ServiceGrid/List as Server Components, ServiceTabs/Accordion as Client Components (interactivity)

**7️⃣ Performance & SEO:**

- **LCP:** Image optimization with next/image priority for above-fold, lazy loading below fold (target < 2.5s)
- **Bundle:** Code-split per layout, < 20KB gzipped each
- **SEO:** Structured data for Service schema.org, semantic HTML hierarchy
- **2026 Optimizations:** React 19.2 rendering improvements, React Compiler automatic memoization, intersection observer for lazy loading, INP optimization (<200ms target)
- **RSC Benefits:** 63% bundle size reduction, streaming HTML, eliminated client-server waterfalls

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance (24×24px touch targets)
- Semantic HTML: `<section>`, `<article>`, `<h3>` headings
- ARIA labels for pricing and duration information
- Keyboard navigation for accordion and tabs
- **2026 Standards:** WCAG 2.2 AA compliance (24×24px minimum for touch targets), WCAG 3.0 preparation (Bronze level - outcomes-based approach)
- **Screen Readers:** Proper semantic structure maintained with WAI-ARIA authoring practices
- **Focus Management:** Radix handles roving tabindex for tabs/accordion; respects user preferences
- **Reduced Motion:** Respect prefers-reduced-motion for all animations and transitions

**9️⃣ Analytics:**

- Service click tracking with service ID attribution
- Layout performance monitoring
- Filter/category interaction tracking

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/services/__tests__/Service*.test.tsx`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library, Playwright for E2E
- **Coverage:** All layouts, responsive behavior, accessibility with axe-core integration
- **Visual Regression:** Storybook screenshots for each layout
- **Type Safety:** Discriminated union validation in tests
- **Performance Testing:** LCP and INP metrics validation

**1️⃣1️⃣ Example Usage:**

```tsx
<ServiceGrid
  services={services}
  columns={3}
  showPricing={true}
/>
<ServiceTabs
  services={services}
  category="category"
/>
```

**1️⃣2️⃣ Failure Modes:**

- Inconsistent service data → validate with Zod schema
- Performance with large service lists → implement virtualization
- Accessibility issues with tabs/accordion → test with screen readers

**1️⃣3️⃣ AI Implementation Checklist:**

⚠️ **BLOCKED until 1.7 and 1.3 are completed**

1. Verify 1.7 is complete and @repo/marketing-components package exists
2. Verify 1.3 is complete and Tabs component exists in @repo/ui
3. Create shared types.ts with Service interface (discriminated unions)
4. Implement ServiceGrid with responsive columns (baseline for LCP)
5. Implement ServiceList with vertical layout
6. Implement ServiceTabs using Tabs component (1.3) - Client Component
7. Implement ServiceAccordion with Accordion from @repo/ui - Client Component
8. Add barrel export in index.ts
9. Create comprehensive tests (Vitest + RTL) for each layout
10. Add Storybook documentation
11. Verify React Compiler optimization working (no manual useMemo needed)

**1️⃣4️⃣ Done Criteria:**

- ✅ @repo/marketing-components package exists (dependency 1.7)
- ✅ Tabs component exists in @repo/ui (dependency 1.3)
- All 4 layouts render correctly
- Shared Service interface works across layouts (discriminated unions)
- LCP performance meets targets (< 2.5s)
- INP optimization meets targets (<200ms)
- Accessibility passes axe-core testing (WCAG 2.2 AA)
- Responsive design works on all breakpoints
- React Compiler automatic memoization working
- RSC boundaries properly defined

**1️⃣5️⃣ Anti-Overengineering:**

- No complex filtering (use simple category grouping)
- No search functionality (belongs in features layer)
- No manual memoization (React Compiler handles this automatically)
- No CMS adapters (keep 4 layouts only)
- No heavy virtualization unless service count > 100
- No custom state management (React state is sufficient)

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.2)
- Research: `RESEARCH_ENHANCED.md` (Performance optimization, accessibility)
- Architecture: `THEGOAL.md` (Marketing components layer)
- Dependencies: Check @repo/ui for Tabs, Card components

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

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need team member display layouts for different industries
- Layer: L2 (@repo/marketing-components)
- Introduces: 3 team layouts with cross-industry staffing data model

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Card, Container), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/team/` directory
- **Create:** `types.ts`, `TeamGrid.tsx`, `TeamCarousel.tsx`, `TeamDetailed.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  credentials?: string[];
  socialLinks?: { platform: string; url: string }[];
  department?: string;
}
interface TeamProps {
  members: TeamMember[];
  layout?: 'grid' | 'carousel' | 'detailed';
  showBio?: boolean;
  showSocial?: boolean;
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string().optional(),
  image: z.string().optional(),
  credentials: z.array(z.string()).optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  department: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Cross-industry TeamMember interface
- **2026 Features:** React 19 Server Components compatible (static layouts as Server Components), React Compiler v1.0 automatic memoization
- **Performance:** Image lazy loading with next/image, carousel virtualization for large teams
- **Accessibility:** WCAG 2.2 AA compliance (24×24px touch targets), semantic markup, ARIA labels, keyboard navigation
- **RSC Strategy:** TeamGrid as Server Component, TeamCarousel/Detailed as Client Components (interactivity)
- **SEO:** Person schema.org markup for each team member

**7️⃣ Performance & SEO:**

- **LCP:** Image optimization with next/image priority for above-fold, lazy loading below fold (target < 2.5s)
- **Bundle:** < 15KB gzipped per layout
- **SEO:** Person schema.org markup with JSON-LD implementation (20-30% CTR improvement per 2026 studies)
- **2026 Optimizations:** React 19.2 rendering improvements, React Compiler automatic memoization, INP optimization (<200ms target)
- **AI Search:** Structured data critical for Google Search Generative Experience

**8️⃣ Accessibility:**

- **2026 Standards:** WCAG 2.2 AA compliance (24×24px minimum for touch targets), WCAG 3.0 preparation (Bronze level - outcomes-based approach)
- Semantic HTML: `<section>`, `<article>` with proper landmark roles
- **Carousel Accessibility:** role="region" with aria-label, proper focus management, pause-on-hover
- ARIA labels for social links and credentials
- **Screen Readers:** Proper semantic structure maintained with WAI-ARIA authoring practices
- **Reduced Motion:** Respect prefers-reduced-motion for carousel animations

**9️⃣ Analytics:**

- Team member click tracking
- Social link interaction tracking

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/team/__tests__/Team*.test.tsx`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library, Playwright for E2E
- **Coverage:** All layouts, responsive behavior, accessibility with axe-core integration
- **Visual Regression:** Storybook screenshots for each layout
- **Accessibility Testing:** Comprehensive carousel accessibility testing per Smashing Magazine 2023 guide
- **Schema Testing:** JSON-LD validation for Person schema

**1️⃣1️⃣ Example Usage:**

```tsx
<TeamGrid members={teamMembers} showBio={true} showSocial={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Image optimization issues
- Carousel accessibility

**1️⃣3️⃣ AI Implementation Checklist:**

⚠️ **BLOCKED until 1.7 is completed**

1. Verify 1.7 is complete and @repo/marketing-components package exists
2. Create shared types.ts with TeamMember interface (discriminated unions)
3. Implement TeamGrid with responsive layout (baseline for LCP)
4. Implement TeamCarousel with accessibility controls (role="region", pause-on-hover)
5. Implement TeamDetailed with Dialog modal (uses @repo/ui Dialog)
6. Add Person schema.org JSON-LD generation for SEO
7. Add barrel export in index.ts
8. Create comprehensive tests (Vitest + RTL) for each layout
9. Add Storybook documentation
10. Verify React Compiler optimization working (no manual useMemo needed)

**1️⃣4️⃣ Done Criteria:**

- ✅ @repo/marketing-components package exists (dependency 1.7)
- All 3 layouts render correctly
- Shared TeamMember interface works across layouts (discriminated unions)
- LCP performance meets targets (< 2.5s)
- INP optimization meets targets (<200ms)
- Accessibility passes axe-core testing (WCAG 2.2 AA)
- Carousel accessibility meets Smashing Magazine 2023 standards
- Person schema.org markup valid and generating rich results
- Responsive design works on all breakpoints
- React Compiler automatic memoization working

**1️⃣5️⃣ Anti-Overengineering:**

- No complex filtering (use simple department grouping)
- No custom carousel libraries (use React state with accessibility)
- No manual memoization (React Compiler handles this automatically)
- No CMS adapters (keep 3 layouts only)
- No heavy animation libraries (CSS transitions only)

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.3)
- Research: `RESEARCH_ENHANCED.md` (Accessibility, performance, schema markup)
- Architecture: `THEGOAL.md` (Marketing components layer)
- Dependencies: `packages/ui/src/index.ts` (Card, Container, Dialog verified)
- Accessibility Guide: Smashing Magazine carousel accessibility (2023)
- Schema Guide: Schema.org Person markup for SEO
- Performance: Core Web Vitals targets (LCP < 2.5s, INP < 200ms)

**Files:** `packages/marketing-components/src/team/`

---

#### 2.4 Build Testimonial Components | **Effort:** 5 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need testimonial display variants with motion respect
- Layer: L2 (@repo/marketing-components)
- Introduces: 3 testimonial variants with `prefers-reduced-motion` support

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Card, Container), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/testimonials/` directory
- **Create:** `types.ts`, `TestimonialCarousel.tsx`, `TestimonialGrid.tsx`, `TestimonialMarquee.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image?: string;
  rating?: number; // 1-5
  company?: string;
}
interface TestimonialsProps {
  testimonials: Testimonial[];
  layout?: 'carousel' | 'grid' | 'marquee';
  showRating?: boolean;
  autoPlay?: boolean;
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  image: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  company: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Motion respects `prefers-reduced-motion`
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Virtualization for large testimonial sets
- **Accessibility:** ARIA live regions for carousel

**7️⃣ Performance & SEO:**

- **LCP:** Image optimization, lazy loading
- **Bundle:** < 18KB gzipped per variant
- **SEO:** Review schema markup

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- `prefers-reduced-motion` support
- ARIA labels for carousel controls
- Screen reader announcements

**9️⃣ Analytics:**

- Testimonial interaction tracking
- Carousel slide views

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/testimonials/__tests__/Testimonial*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Motion preferences, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<TestimonialCarousel testimonials={testimonials} autoPlay={true} showRating={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Motion not respecting preferences
- Carousel accessibility issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with Testimonial interface
2. Implement TestimonialCarousel with accessibility
3. Implement TestimonialGrid with responsive layout
4. Implement TestimonialMarquee with motion respect
5. Add motion preference detection
6. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- All 3 variants render correctly
- Motion respects user preferences
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex animation libraries
- No custom carousel logic

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.4)
- Research: `RESEARCH_ENHANCED.md` (Motion preferences, accessibility)

**Files:** `packages/marketing-components/src/testimonials/`

---

#### 2.5 Build Pricing Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.3 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need pricing display variants for different business models
- Layer: L2 (@repo/marketing-components)
- Introduces: 3 pricing variants supporting one-time, recurring, and "contact us" tiers

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold), 1.3 (Tabs component)
- **Packages:** @repo/ui (Tabs, Button, Card), @repo/types, @repo/utils
- **Blockers:** 1.7, 1.3 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/pricing/` directory
- **Create:** `types.ts`, `PricingTable.tsx`, `PricingCards.tsx`, `PricingCalculator.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: 'monthly' | 'yearly' | 'onetime';
  features: string[];
  highlighted?: boolean;
  cta?: { text: string; href: string };
  description?: string;
}
interface PricingProps {
  tiers: PricingTier[];
  layout?: 'table' | 'cards' | 'calculator';
  showPeriodToggle?: boolean;
  currency?: string;
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const pricingTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  period: z.enum(['monthly', 'yearly', 'onetime']).optional(),
  features: z.array(z.string()),
  highlighted: z.boolean().optional(),
  cta: z.object({ text: z.string(), href: z.string() }).optional(),
  description: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Flexible pricing model support
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Virtualization for large pricing tables
- **Accessibility:** Semantic pricing information

**7️⃣ Performance & SEO:**

- **LCP:** Optimized for above-fold pricing display
- **Bundle:** < 22KB gzipped per variant
- **SEO:** Offer schema markup

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic pricing structure
- ARIA labels for pricing information
- Keyboard navigation for calculator

**9️⃣ Analytics:**

- Pricing tier interaction tracking
- Calculator usage analytics
- CTA conversion tracking

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/pricing/__tests__/Pricing*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** All layouts, calculator logic

**1️⃣1️⃣ Example Usage:**

```tsx
<PricingCards tiers={pricingTiers} showPeriodToggle={true} currency="$" />
```

**1️⃣2️⃣ Failure Modes:**

- Calculator logic errors
- Accessibility issues with complex tables

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with PricingTier interface
2. Implement PricingTable with responsive layout
3. Implement PricingCards with highlight support
4. Implement PricingCalculator with interactive logic
5. Add period toggle functionality
6. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- All 3 variants render correctly
- Calculator logic works accurately
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex payment integration
- No custom state management libraries

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.5)
- Research: `RESEARCH_ENHANCED.md` (Accessibility, performance)

**Files:** `packages/marketing-components/src/pricing/`

---

#### 2.6 Build Gallery Components | **Effort:** 5 hrs | **Dependencies:** 1.7, 1.1 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need image gallery variants with lightbox functionality
- Layer: L2 (@repo/marketing-components)
- Introduces: 3 gallery variants with progressive image quality and lightbox

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold), 1.1 (Dialog component)
- **Packages:** @repo/ui (Dialog, Container), @repo/types, @repo/utils
- **Blockers:** 1.7, 1.1 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/gallery/` directory
- **Create:** `types.ts`, `ImageGrid.tsx`, `ImageCarousel.tsx`, `LightboxGallery.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}
interface GalleryProps {
  images: GalleryImage[];
  layout?: 'grid' | 'carousel' | 'lightbox';
  columns?: 2 | 3 | 4;
  enableLightbox?: boolean;
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const galleryImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});
```

**6️⃣ Internal Architecture:**

- Progressive image quality loading
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Image optimization, lazy loading, virtualization
- **Accessibility:** Keyboard navigation for lightbox

**7️⃣ Performance & SEO:**

- **LCP:** Image optimization with next/image
- **Bundle:** < 20KB gzipped per variant
- **SEO:** Image schema markup

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Keyboard navigation for lightbox
- ARIA labels for gallery images
- Focus management

**9️⃣ Analytics:**

- Image interaction tracking
- Lightbox view analytics
- Gallery engagement metrics

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/gallery/__tests__/Gallery*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Lightbox functionality, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<ImageGrid images={galleryImages} columns={3} enableLightbox={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Lightbox accessibility issues
- Image loading performance

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with GalleryImage interface
2. Implement ImageGrid with responsive layout
3. Implement ImageCarousel with navigation
4. Implement LightboxGallery using Dialog (1.1)
5. Add progressive image loading
6. Add keyboard navigation for lightbox
7. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- All 3 variants render correctly
- Lightbox functionality works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex image editing features
- No custom carousel libraries

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.6)
- Research: `RESEARCH_ENHANCED.md` (Image optimization, accessibility)

**Files:** `packages/marketing-components/src/gallery/`

---

#### 2.7 Build Stats Counter Component | **Effort:** 3 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need animated number counting on scroll with reduced-motion fallback
- Layer: L2 (@repo/marketing-components)
- Introduces: Single StatsCounter component with SSR-safe animation

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Container), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/stats/` directory
- **Create:** `StatsCounter.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}
interface StatsCounterProps {
  stats: Stat[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  animate?: boolean;
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const statSchema = z.object({
  value: z.number(),
  label: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  duration: z.number().optional(),
});
```

**6️⃣ Internal Architecture:**

- SSR-safe with useEffect for animation
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Intersection Observer for scroll trigger
- **Accessibility:** Reduced motion support

**7️⃣ Performance & SEO:**

- **LCP:** No impact (lazy animation)
- **Bundle:** < 8KB gzipped
- **SEO:** Semantic markup for statistics

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- `prefers-reduced-motion` support
- ARIA labels for statistics

**9️⃣ Analytics:**

- Stat visibility tracking
- Animation completion events

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/stats/__tests__/StatsCounter.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Animation behavior, reduced motion

**1️⃣1️⃣ Example Usage:**

```tsx
<StatsCounter
  stats={[
    { value: 1000, label: 'Happy Clients', suffix: '+' },
    { value: 500, label: 'Projects Completed', suffix: '+' },
  ]}
  animate={true}
/>
```

**1️⃣2️⃣ Failure Modes:**

- Animation not respecting reduced motion
- SSR hydration mismatches

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create StatsCounter with Intersection Observer
2. Add reduced motion detection
3. Ensure SSR-safe animation
4. Add proper ARIA labels
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- Component renders correctly
- Animation works on scroll
- Reduced motion respected
- SSR-safe

**1️⃣5️⃣ Anti-Overengineering:**

- No complex animation libraries
- No custom state management

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.7)
- Research: `RESEARCH_ENHANCED.md` (Reduced motion, accessibility)

**Files:** `packages/marketing-components/src/stats/`

---

#### 2.8 Build CTA Section Components | **Effort:** 3 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need call-to-action section variants with analytics hooks
- Layer: L2 (@repo/marketing-components)
- Introduces: 2 CTA variants with primary/secondary actions

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Button, Container), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/cta/` directory
- **Create:** `types.ts`, `CTABanner.tsx`, `CTASplit.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface CTAAction {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
  analytics?: string;
}
interface CTAProps {
  title: string;
  description?: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  backgroundImage?: string;
  layout?: 'banner' | 'split';
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const ctaActionSchema = z.object({
  text: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary']).optional(),
  analytics: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Analytics integration for CTA tracking
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Optimized for conversion
- **Accessibility:** Semantic CTA structure

**7️⃣ Performance & SEO:**

- **LCP:** Optimized for above-fold CTAs
- **Bundle:** < 12KB gzipped per variant
- **SEO:** Semantic markup for actions

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic button/link structure
- ARIA labels for actions

**9️⃣ Analytics:**

- CTA click tracking with variant attribution
- Conversion event firing
- A/B test support

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/cta/__tests__/CTA*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Analytics tracking, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<CTABanner
  title="Ready to Get Started?"
  description="Join thousands of satisfied customers"
  primaryAction={{ text: 'Start Free Trial', href: '/signup' }}
  secondaryAction={{ text: 'Learn More', href: '/about' }}
/>
```

**1️⃣2️⃣ Failure Modes:**

- Analytics not firing
- Accessibility issues with actions

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with CTA interfaces
2. Implement CTABanner with full-width layout
3. Implement CTASplit with image/content layout
4. Add analytics tracking hooks
5. Ensure semantic HTML structure
6. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- Both variants render correctly
- Analytics tracking works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex A/B testing logic
- No custom analytics libraries

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.8)
- Research: `RESEARCH_ENHANCED.md` (Conversion optimization, analytics)

**Files:** `packages/marketing-components/src/cta/`

---

#### 2.9 Build FAQ Section Component | **Effort:** 4 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need FAQ section with search/filter and schema.org output
- Layer: L2 (@repo/marketing-components)
- Introduces: FAQ section with Schema.org FAQPage mapping

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Container, Accordion), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/faq/` directory
- **Create:** `types.ts`, `FAQSection.tsx`, `schema.ts`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}
interface FAQProps {
  items: FAQItem[];
  enableSearch?: boolean;
  enableFilter?: boolean;
  categories?: string[];
  className?: string;
}
export const generateFAQSchema: (items: FAQItem[]) => object;
```

**5️⃣ Data Contracts:**

```ts
const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Schema.org FAQPage generation
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Client-side search/filter
- **Accessibility:** ARIA-compliant accordion

**7️⃣ Performance & SEO:**

- **LCP:** Optimized for FAQ content
- **Bundle:** < 15KB gzipped
- **SEO:** FAQPage schema markup

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA attributes for accordion
- Keyboard navigation
- Screen reader support

**9️⃣ Analytics:**

- FAQ interaction tracking
- Search query analytics
- Category filter usage

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/faq/__tests__/FAQ*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Search functionality, schema generation

**1️⃣1️⃣ Example Usage:**

```tsx
<FAQSection
  items={faqItems}
  enableSearch={true}
  enableFilter={true}
  categories={['General', 'Billing', 'Technical']}
/>
```

**1️⃣2️⃣ Failure Modes:**

- Schema generation errors
- Search performance issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with FAQ interfaces
2. Implement FAQSection with Accordion
3. Add search functionality
4. Add filter by category
5. Create schema.org generator
6. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- FAQ section renders correctly
- Search and filter work
- Schema generates valid JSON-LD
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex search indexing
- No external search libraries

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.9)
- Research: `RESEARCH_ENHANCED.md` (Schema.org, SEO)

**Files:** `packages/marketing-components/src/faq/`

---

#### 2.10 Build Contact Form Variants | **Effort:** 4 hrs | **Dependencies:** 1.7 | **Batch:** B

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need contact form variants with normalized submission contract
- Layer: L2 (@repo/marketing-components)
- Introduces: 3 contact form variants with configurable consent

**2️⃣ Dependency Check:**

- **Completed:** 1.7 (package scaffold)
- **Packages:** @repo/ui (Button, Input, Textarea), @repo/types, @repo/utils
- **Blockers:** 1.7 must be complete

**3️⃣ File System Plan:**

- **Create:** `packages/marketing-components/src/contact/` directory
- **Create:** `types.ts`, `SimpleContactForm.tsx`, `MultiStepContactForm.tsx`, `BookingContactForm.tsx`, `index.ts`
- **Update:** `packages/marketing-components/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface ContactField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
}
interface ContactFormProps {
  fields: ContactField[];
  submitText?: string;
  consentText?: string;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  variant?: 'simple' | 'multistep' | 'booking';
  className?: string;
}
```

**5️⃣ Data Contracts:**

```ts
const contactFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Normalized submission contract
- **2026 Features:** React 19 Server Actions compatible
- **Performance:** Form validation and error handling
- **Accessibility:** Form validation and error announcements

**7️⃣ Performance & SEO:**

- **LCP:** Optimized form rendering
- **Bundle:** < 18KB gzipped per variant
- **SEO:** Semantic form structure

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Form validation announcements
- Error message accessibility
- Keyboard navigation

**9️⃣ Analytics:**

- Form submission tracking
- Field interaction analytics
- Conversion funnel events

**🔟 Testing Strategy:**

- Unit: `packages/marketing-components/src/contact/__tests__/Contact*.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Form validation, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<SimpleContactForm
  fields={[
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea' },
  ]}
  onSubmit={handleSubmit}
  consentText="I agree to the privacy policy"
/>
```

**1️⃣2️⃣ Failure Modes:**

- Form validation errors
- Submission handling issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with form interfaces
2. Implement SimpleContactForm with validation
3. Implement MultiStepContactForm with progress
4. Implement BookingContactForm with calendar
5. Add consent management
6. Add barrel export and tests

**1️⃣4️⃣ Done Criteria:**

- All 3 variants render correctly
- Form validation works
- Submission handling works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex form builders
- No custom validation libraries

**Related Files:**

- Task spec: `docs/task-specs/02-marketing-components.md` (sections 2.10)
- Research: `RESEARCH_ENHANCED.md` (Form accessibility, validation)

**Files:** `packages/marketing-components/src/contact/`

---

## Feature Breadth (New Features)

#### 2.16 Create Testimonials Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.4 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: No reusable testimonials feature; config/CMS/API sources need normalization
- Layer: L2 (@repo/features)
- Introduces: Types, runtime logic, source adapters, UI components
- Uses marketing components 2.4 (display variants)

**2️⃣ Dependency Check:**

- **Completed:** 2.11 (feature skeleton — existing features: booking, contact, blog, services, search in `packages/features/src/`), 2.4 (TestimonialCarousel, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11 (feature structure exists), 2.4 must be done
- **Local verification (2026-02-17):** `packages/features/src/` contains booking, contact, blog, services, search; follow same structure pattern for testimonials

**3️⃣ File System Plan:**

- **Create:** `packages/features/src/testimonials/index.ts`, `lib/schema.ts`, `lib/adapters.ts`, `lib/testimonials-config.ts`, `components/TestimonialsSection.tsx`
- **Update:** `packages/features/src/index.ts`

**4️⃣ Public API Design:**

```ts
export { TestimonialsSection } from './components/TestimonialsSection';
export { testimonialsSchema, type Testimonial, type TestimonialsConfig } from './lib/schema';
export { createTestimonialsConfig } from './lib/testimonials-config';
export { normalizeGoogleReviews, normalizeYelp, normalizeFromConfig } from './lib/adapters';
```

**5️⃣ Data Contracts & Schemas:**

```ts
const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  rating: z.number().min(1).max(5).optional(),
  source: z.enum(['config', 'google', 'yelp', 'trustpilot']).optional(),
  date: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Adapter pattern for different sources (config, Google Reviews, Yelp)
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Lazy loading for external API data
- **Accessibility:** Screen reader support for testimonials

**7️⃣ Performance & SEO:**

- **LCP:** Optimized testimonial loading with skeleton states
- **Bundle:** < 25KB gzipped total
- **SEO:** Review schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA labels for testimonial content
- Screen reader support for ratings

**9️⃣ Analytics:**

- Testimonial interaction tracking
- Source performance monitoring
- Conversion attribution

**🔟 Testing Strategy:**

- Unit: `packages/features/src/testimonials/__tests__/TestimonialsSection.test.tsx`
- Integration: Adapter testing with mock APIs
- **2026 Tools:** Playwright component testing + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
<TestimonialsSection config={testimonialsConfig} layout="carousel" maxItems={6} showRating={true} />
```

**1️⃣2️⃣ Failure Modes:**

- API rate limiting from external sources
- Schema validation errors
- Adapter implementation bugs

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared schema.ts with Testimonial interface
2. Implement adapters for different sources
3. Create TestimonialsSection using marketing components
4. Add configuration management
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All adapters normalize data correctly
- TestimonialsSection renders with marketing components
- External API integration works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex caching strategies
- No custom state management libraries

**Related Files:**

- Task spec: `docs/task-specs/03-feature-breadth.md` (sections 2.16)
- Research: `RESEARCH_ENHANCED.md` (Adapter patterns, performance)

**Files:** `packages/features/src/testimonials/`

---

#### 2.17 Create Team Feature | **Effort:** 5 hrs | **Dependencies:** 2.11, 2.3 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need reusable team feature with member profiles and layouts
- Layer: L2 (@repo/features)
- Introduces: Member profiles with social links, configurable layouts
- Uses marketing components 2.3 (display variants)

**2️⃣ Dependency Check:**

- **Completed:** 2.11 (feature skeleton), 2.3 (TeamGrid, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11, 2.3 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/features/src/team/index.ts`, `lib/schema.ts`, `lib/team-config.ts`, `components/TeamSection.tsx`
- **Update:** `packages/features/src/index.ts`

**4️⃣ Public API Design:**

```ts
export { TeamSection } from './components/TeamSection';
export { teamSchema, type TeamMember, type TeamConfig } from './lib/schema';
export { createTeamConfig } from './lib/team-config';
```

**5️⃣ Data Contracts & Schemas:**

```ts
const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string().optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  credentials: z.array(z.string()).optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  department: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});
```

**6️⃣ Internal Architecture:**

- Configurable team member profiles
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Lazy loading for team data
- **Accessibility:** Semantic team structure

**7️⃣ Performance & SEO:**

- **LCP:** Optimized team member images
- **Bundle:** < 20KB gzipped total
- **SEO:** Person schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA labels for team information
- Screen reader support for social links

**9️⃣ Analytics:**

- Team member interaction tracking
- Social link click analytics
- Department filtering metrics

**🔟 Testing Strategy:**

- Unit: `packages/features/src/team/__tests__/TeamSection.test.tsx`
- Integration: Social link validation
- **2026 Tools:** Playwright component testing

**1️⃣1️⃣ Example Usage:**

```tsx
<TeamSection config={teamConfig} layout="grid" showSocial={true} showBio={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Social link validation errors
- Image optimization issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared schema.ts with TeamMember interface
2. Create TeamSection using marketing components
3. Add configuration management
4. Add social link validation
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- TeamSection renders with marketing components
- Social links work correctly
- Configuration management works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex team management features
- No custom social media APIs

**Related Files:**

- Task spec: `docs/task-specs/03-feature-breadth.md` (sections 2.17)
- Research: `RESEARCH_ENHANCED.md` (Social media integration, accessibility)

**Files:** `packages/features/src/team/`

---

#### 2.18 Create Gallery Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.6 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need reusable gallery feature with image management and lightbox
- Layer: L2 (@repo/features)
- Introduces: Image optimization, lightbox integration using Dialog
- Uses marketing components 2.6 (display variants)

**2️⃣ Dependency Check:**

- **Completed:** 2.11 (feature skeleton), 2.6 (ImageGrid, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11, 2.6 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/features/src/gallery/index.ts`, `lib/schema.ts`, `lib/gallery-config.ts`, `components/GallerySection.tsx`
- **Update:** `packages/features/src/index.ts`

**4️⃣ Public API Design:**

```ts
export { GallerySection } from './components/GallerySection';
export { gallerySchema, type GalleryImage, type GalleryConfig } from './lib/schema';
export { createGalleryConfig } from './lib/gallery-config';
export { optimizeImage, generateImageSrcSet } from './lib/image-utils';
```

**5️⃣ Data Contracts & Schemas:**

```ts
const galleryImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
```

**6️⃣ Internal Architecture:**

- Image optimization utilities
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Progressive image loading, virtualization
- **Accessibility:** Keyboard navigation for lightbox

**7️⃣ Performance & SEO:**

- **LCP:** Image optimization with next/image
- **Bundle:** < 22KB gzipped total
- **SEO:** Image schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Keyboard navigation for lightbox
- ARIA labels for gallery images
- Focus management

**9️⃣ Analytics:**

- Image interaction tracking
- Lightbox view analytics
- Gallery engagement metrics

**🔟 Testing Strategy:**

- Unit: `packages/features/src/gallery/__tests__/GallerySection.test.tsx`
- Integration: Image optimization testing
- **2026 Tools:** Playwright component testing

**1️⃣1️⃣ Example Usage:**

```tsx
<GallerySection config={galleryConfig} layout="grid" columns={3} enableLightbox={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Image optimization errors
- Lightbox accessibility issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared schema.ts with GalleryImage interface
2. Create GallerySection using marketing components
3. Add image optimization utilities
4. Add lightbox integration
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- GallerySection renders with marketing components
- Image optimization works
- Lightbox functionality works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex image editing features
- No custom gallery management

**Related Files:**

- Task spec: `docs/task-specs/03-feature-breadth.md` (sections 2.18)
- Research: `RESEARCH_ENHANCED.md` (Image optimization, accessibility)

**Files:** `packages/features/src/gallery/`

---

#### 2.19 Create Pricing Feature | **Effort:** 4 hrs | **Dependencies:** 2.11, 2.5 | **Batch:** E

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need data-driven pricing tables, cards, calculators
- Layer: L2 (@repo/features)
- Introduces: Currency/locale formatting strategy centralized
- Uses marketing components 2.5 (display variants)

**2️⃣ Dependency Check:**

- **Completed:** 2.11 (feature skeleton), 2.5 (PricingCards, etc.)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components
- **Blockers:** 2.11, 2.5 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/features/src/pricing/index.ts`, `lib/schema.ts`, `lib/pricing-config.ts`, `components/PricingSection.tsx`
- **Update:** `packages/features/src/index.ts`

**4️⃣ Public API Design:**

```ts
export { PricingSection } from './components/PricingSection';
export { pricingSchema, type PricingTier, type PricingConfig } from './lib/schema';
export { createPricingConfig } from './lib/pricing-config';
export { formatCurrency, calculatePrice } from './lib/pricing-utils';
```

**5️⃣ Data Contracts & Schemas:**

```ts
const pricingTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string().default('USD'),
  period: z.enum(['monthly', 'yearly', 'onetime']).optional(),
  features: z.array(z.string()),
  highlighted: z.boolean().optional(),
  cta: z.object({ text: z.string(), href: z.string() }).optional(),
  description: z.string().optional(),
  discount: z.number().optional(),
});
```

**6️⃣ Internal Architecture:**

- Currency/locale formatting utilities
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Optimized pricing calculations
- **Accessibility:** Semantic pricing information

**7️⃣ Performance & SEO:**

- **LCP:** Optimized pricing display
- **Bundle:** < 18KB gzipped total
- **SEO:** Offer schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic pricing structure
- ARIA labels for pricing information
- Keyboard navigation for calculator

**9️⃣ Analytics:**

- Pricing tier interaction tracking
- Calculator usage analytics
- Conversion funnel events

**🔟 Testing Strategy:**

- Unit: `packages/features/src/pricing/__tests__/PricingSection.test.tsx`
- Integration: Currency formatting testing
- **2026 Tools:** Playwright component testing

**1️⃣1️⃣ Example Usage:**

```tsx
<PricingSection config={pricingConfig} layout="cards" currency="USD" showPeriodToggle={true} />
```

**1️⃣2️⃣ Failure Modes:**

- Currency formatting errors
- Calculator logic bugs

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared schema.ts with PricingTier interface
2. Create PricingSection using marketing components
3. Add currency formatting utilities
4. Add pricing calculation logic
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- PricingSection renders with marketing components
- Currency formatting works
- Calculator logic works accurately
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex payment integration
- No custom pricing algorithms

**Related Files:**

- Task spec: `docs/task-specs/03-feature-breadth.md` (sections 2.19)
- Research: `RESEARCH_ENHANCED.md` (Currency formatting, accessibility)

**Files:** `packages/features/src/pricing/`

---

## Page Templates (Wave 2) — Foundation and Core

> `packages/page-templates` currently has only package.json; no `src/`. These tasks create the registry and minimum page set required for 5.1 (starter-template).

#### 3.1 Create Page-Templates Registry and Package Scaffold | **Effort:** 3 hrs | **Dependencies:** None | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Add `src/` to `@repo/page-templates`: section registry, barrel export, and `templates/` directory
- Layer: L3 (@repo/page-templates)
- Introduces: Section registry (Map of section id → component), composable assembly — no switch statements

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types (already in package.json); add @repo/ui, @repo/features, @repo/marketing-components as needed when building templates
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/page-templates/src/registry.ts` — registry Map<string, Component>
- **Create:** `packages/page-templates/src/types.ts` — SectionConfig, PageTemplateProps (or SectionProps, TemplateConfig per spec)
- **Create:** `packages/page-templates/src/index.ts` — barrel exporting registry and template types
- **Create:** `packages/page-templates/src/templates/` directory (templates 3.2–3.8 go here)
- **Delete:** None

**4️⃣ Public API Design:**

```ts
// registry.ts
export const sectionRegistry: Map<string, React.ComponentType<any>> = new Map();

// types.ts — SectionConfig, PageTemplateProps (see docs/task-specs/04-page-templates.md for SectionProps, TemplateConfig)

// index.ts
export { sectionRegistry } from './registry';
export type { SectionConfig, PageTemplateProps } from './types';
export * from './templates';
```

**5️⃣ Data Contracts & Schemas:**

```ts
const sectionConfigSchema = z.object({
  id: z.string(),
  component: z.string(),
  props: z.record(z.any()).optional(),
  order: z.number().optional(),
});
```

**6️⃣ Internal Architecture:**

- Map-based registry for component lookup
- **2026 React 19.2 Features:** Server Components compatible with async/await, streaming with Suspense
- **Hybrid Rendering:** Server Components for static content, Client Components for interactivity
- **Lazy Loading:** React.lazy() with Suspense boundaries for heavy sections
- **Performance:** React Compiler auto-memoization ready; INP optimization (<200ms target)
- **Advanced TypeScript:** Template literal types for section keys, discriminated unions for configs
- **Conditional Rendering:** Consider <Activity /> component for performance-aware section rendering

**7️⃣ Performance & SEO:**

- **LCP:** Optimized template loading with lazy imports and React 19.2 streaming
- **Bundle:** < 10KB gzipped for registry; 20%+ reduction with RSC adoption
- **SEO:** Semantic HTML structure from templates; Core Web Vitals monitoring (LCP, INP, CLS)
- **INP Target:** ≤200ms (75th percentile) for all interactions
- **Code Splitting:** Route-based splitting with React.lazy() and Suspense boundaries

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance (24×24 CSS pixels minimum for touch targets)
- Semantic page structure from templates with proper landmarks
- Landmark navigation support
- **React 19.2:** Screen reader announcements via aria-live="polite"
- **Motion Respect:** Honor prefers-reduced-motion in transitions

**9️⃣ Analytics:**

- Template rendering analytics
- Section interaction tracking
- Page composition metrics

**🔟 Testing Strategy:**

- Unit: `packages/page-templates/src/__tests__/registry.test.ts`
- **2026 Tools:** Vitest (replacing Jest for performance) + React Testing Library
- **RSC Testing:** Server/Client component composition verification
- **Lazy Loading Tests:** React.lazy() and Suspense boundary validation
- **Accessibility Testing:** Automated axe-core integration
- **Performance Testing:** Core Web Vitals monitoring in CI/CD
- **Coverage:** Registry functionality, lazy loading, template composition

**1️⃣1️⃣ Example Usage:**

```tsx
// In template
import { sectionRegistry } from '@repo/page-templates';

const HomePageTemplate = ({ sections }: PageTemplateProps) => (
  <main>
    {sections.map(({ id, ...props }) => {
      const Component = sectionRegistry.get(id);
      return Component ? <Component key={id} {...props} /> : null;
    })}
  </main>
);

// 2026: With lazy loading and Suspense
const LazyHomePageTemplate = ({ sections }: PageTemplateProps) => (
  <main>
    {sections.map(({ id, ...props }) => {
      const LazyComponent = sectionRegistry.get(id);
      return (
        <Suspense fallback={<SectionSkeleton />}>
          {LazyComponent ? <LazyComponent key={id} {...props} /> : null}
        </Suspense>
      );
    })}
  </main>
);
```

**1️⃣2️⃣ Failure Modes:**

- Registry lookup failures → warn and skip; no crash
- Circular dependencies: registry must not import templates that import registry
- **2026:** Server/Client component boundary issues
- **Lazy Loading:** Suspense boundary failures
- **Performance:** INP degradation from heavy sections

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create registry.ts with Map<string, Component> supporting both Server and Client Components
2. Create index.ts with barrel exports and TypeScript template literal types
3. Create templates/ directory structure for future templates (3.2-3.8)
4. Add type definitions for sections with discriminated unions
5. Create comprehensive tests (Vitest + React Testing Library)
6. Add lazy loading support with React.lazy() and Suspense boundaries
7. Implement Core Web Vitals monitoring for INP optimization
8. Add accessibility testing with axe-core integration

**1️⃣4️⃣ Done Criteria:**

- Registry exports correctly with Server/Client Component support
- Templates directory structure created for 3.2-3.8
- Type definitions work with template literal types and discriminated unions
- Tests pass (Vitest + React Testing Library + axe-core)
- Lazy loading with React.lazy() and Suspense boundaries functional
- Core Web Vitals monitoring configured (INP ≤200ms target)
- Accessibility compliance verified (WCAG 2.2 AA)

**1️⃣5️⃣ Anti-Overengineering:**

- No complex routing logic (belongs in page-templates, not registry)
- No custom state management (use React Server Components and Server Actions)
- No template compilation (registry is code-only, config-driven)
- **2026:** Avoid premature <Activity /> optimization; add when performance issues identified
- **Framework First:** Use Next.js patterns instead of custom solutions

**Related Files:**

- Task spec: `docs/task-specs/04-page-templates.md` (sections 3.1)
- Research: `RESEARCH_ENHANCED.md` (Registry patterns, React 19)
- Architecture: `THEGOAL.md` (Page templates layer)

**Dependency:** 3.1 must be complete before 3.2–3.8.

---

#### 3.2 Build HomePageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.1 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Config-driven section composition for home pages
- Layer: L3 (@repo/page-templates)
- Introduces: Home page assembled from registry by section keys in config; hero, services, CTA, etc. from marketing-components

**2️⃣ Dependency Check:**

- **Completed:** 3.1 (registry), 2.1 (HeroVariants)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components, @repo/features
- **Blockers:** 3.1, 2.1 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/page-templates/src/templates/HomePageTemplate.tsx`
- **Update:** `packages/page-templates/src/index.ts` (export template)

**4️⃣ Public API Design:**

```ts
interface HomePageTemplateProps {
  sections: SectionConfig[];
  siteConfig: SiteConfig;
  className?: string;
}
export const HomePageTemplate: React.FC<HomePageTemplateProps>;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const homePageSectionsSchema = z
  .array(sectionConfigSchema)
  .refine((data) =>
    data.every((section) =>
      ['hero', 'services', 'cta', 'testimonials', 'stats'].includes(section.id)
    )
  );
```

**6️⃣ Internal Architecture:**

- Registry-based section composition
- **2026 Features:** React 19 Server Components compatible, streaming with Suspense
- **Performance:** Lazy loading per section, optimized for LCP
- **Accessibility:** Semantic HTML5 structure

**7️⃣ Performance & SEO:**

- **LCP:** Hero section prioritized, lazy loading for below-fold sections
- **Bundle:** < 15KB gzipped
- **SEO:** Semantic heading structure, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic HTML: `<main>`, `<section>`, `<header>`
- Landmark navigation support
- Skip links for keyboard navigation

**9️⃣ Analytics:**

- Section visibility tracking
- Scroll depth analytics
- CTA conversion tracking

**🔟 Testing Strategy:**

- Unit: `packages/page-templates/src/templates/__tests__/HomePageTemplate.test.tsx`
- **2026 Tools:** Playwright component testing + Visual regression
- **Coverage:** Section rendering, responsive behavior

**1️⃣1️⃣ Example Usage:**

```tsx
<HomePageTemplate
  sections={[
    { id: 'hero', component: 'HeroCentered', props: heroProps },
    { id: 'services', component: 'ServiceGrid', props: servicesProps },
    { id: 'cta', component: 'CTABanner', props: ctaProps },
  ]}
  siteConfig={siteConfig}
/>
```

**1️⃣2️⃣ Failure Modes:**

- Section registry lookup failures
- Invalid section configurations

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create HomePageTemplate using registry pattern
2. Add section composition logic
3. Implement lazy loading for sections
4. Add semantic HTML structure
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- Template renders with registry sections
- Hero section prioritized for LCP
- Semantic HTML structure
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No custom routing logic
- No complex state management
- No template compilation

**Related Files:**

- Task spec: `docs/task-specs/04-page-templates.md` (sections 3.2)
- Research: `RESEARCH_ENHANCED.md` (Registry patterns, React 19)
- Dependencies: Check marketing components for Hero variants

**Files:** `packages/page-templates/src/templates/HomePageTemplate.tsx`

---

#### 3.3 Build ServicesPageTemplate | **Effort:** 4 hrs | **Dependencies:** 3.1, 2.2 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Services page with grid/list/tabs layout and URL-synced filters
- Layer: L3 (@repo/page-templates)
- Introduces: Grid/list/tabs layout driven by config; URL-synced filters
- Uses ServicesOverview and ServiceDetailLayout from features

**2️⃣ Dependency Check:**

- **Completed:** 3.1 (registry), 2.2 (ServiceShowcase)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components, @repo/features
- **Blockers:** 3.1, 2.2 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/page-templates/src/templates/ServicesPageTemplate.tsx`
- **Update:** `packages/page-templates/src/index.ts` (export template)

**4️⃣ Public API Design:**

```ts
interface ServicesPageTemplateProps {
  sections: SectionConfig[];
  siteConfig: SiteConfig;
  category?: string;
  layout?: 'grid' | 'list' | 'tabs';
  className?: string;
}
export const ServicesPageTemplate: React.FC<ServicesPageTemplateProps>;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const servicesPageSectionsSchema = z
  .array(sectionConfigSchema)
  .refine((data) =>
    data.every((section) => ['services-overview', 'service-detail'].includes(section.id))
  );
```

**6️⃣ Internal Architecture:**

- URL-synced filtering with useSearchParams
- **2026 Features:** React 19 Server Components compatible
- **Performance:** Optimized service filtering and display
- **Accessibility:** Semantic service structure

**7️⃣ Performance & SEO:**

- **LCP:** Services overview prioritized
- **Bundle:** < 18KB gzipped
- **SEO:** Service schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic HTML: `<main>`, `<section>`, `<article>`
- Filter accessibility with ARIA labels
- Keyboard navigation for filters

**9️⃣ Analytics:**

- Service interaction tracking
- Filter usage analytics
- Category performance metrics

**🔟 Testing Strategy:**

- Unit: `packages/page-templates/src/templates/__tests__/ServicesPageTemplate.test.tsx`
- **2026 Tools:** Playwright component testing
- **Coverage:** Filter functionality, URL sync

**1️⃣1️⃣ Example Usage:**

```tsx
<ServicesPageTemplate
  sections={[
    { id: 'services-overview', component: 'ServiceGrid', props: servicesProps },
    { id: 'service-detail', component: 'ServiceDetailLayout', props: detailProps },
  ]}
  siteConfig={siteConfig}
  layout="grid"
  category="hair-services"
/>
```

**1️⃣2️⃣ Failure Modes:**

- URL sync issues with filters
- Service data loading errors

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create ServicesPageTemplate using registry pattern
2. Add URL-synced filtering with useSearchParams
3. Implement layout switching (grid/list/tabs)
4. Add semantic HTML structure
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- Template renders with registry sections
- URL filtering works correctly
- Layout switching works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex search functionality
- No custom state management

**Related Files:**

- Task spec: `docs/task-specs/04-page-templates.md` (sections 3.3)
- Research: `RESEARCH_ENHANCED.md` (URL sync, React 19)
- Dependencies: Check features for ServicesOverview, ServiceDetailLayout

**Files:** `packages/page-templates/src/templates/ServicesPageTemplate.tsx`

---

#### 3.5 Build ContactPageTemplate | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.10, 2.13 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Contact page with form + business info + optional map
- Layer: L3 (@repo/page-templates)
- Introduces: Form + business info + optional map
- Uses contact form variants and @repo/features/contact

**2️⃣ Dependency Check:**

- **Completed:** 3.1 (registry), 2.10 (ContactForm), 2.13 (contact feature)
- **Packages:** @repo/ui, @repo/types, @repo/marketing-components, @repo/features
- **Blockers:** 3.1, 2.10, 2.13 must be done

**3️⃣ File System Plan:**

- **Create:** `packages/page-templates/src/templates/ContactPageTemplate.tsx`
- **Update:** `packages/page-templates/src/index.ts` (export template)

**4️⃣ Public API Design:**

```ts
interface ContactPageTemplateProps {
  sections: SectionConfig[];
  siteConfig: SiteConfig;
  showMap?: boolean;
  mapConfig?: MapConfig;
  className?: string;
}
export const ContactPageTemplate: React.FC<ContactPageTemplateProps>;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const contactPageSectionsSchema = z
  .array(sectionConfigSchema)
  .refine((data) =>
    data.every((section) => ['contact-form', 'business-info', 'map'].includes(section.id))
  );
```

**6️⃣ Integration Architecture:**

- Form submission with @repo/features/contact
- **2026 Features:** React 19 Server Actions compatible
- **Performance:** Optimized form rendering
- **Accessibility:** Form validation and error announcements

**7️⃣ Performance & SEO:**

- **Contact form prioritized for LCP**
- **Bundle:** < 16KB gzipped
- **SEO:** Contact schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic form structure
- Error message accessibility
- Keyboard navigation

**9️⃣ Analytics:**

- Form submission tracking
- Field interaction analytics
- Conversion funnel events

**🔟 Testing Strategy:**

- Unit: `packages/page-templates/src/templates/__tests__/ContactPageTemplate.test.tsx`
- **2026 Tools:** Playwright component testing + MSW
- **Coverage:** Form functionality, accessibility

**1️⃣1️⃣ Example Usage:**

```tsx
<ContactPageTemplate
  sections={[
    { id: 'contact-form', component: 'SimpleContactForm', props: formProps },
    { id: 'business-info', component: 'BusinessInfo', props: infoProps },
    { id: 'map', component: 'LocationMap', props: mapProps },
  ]}
  siteConfig={siteConfig}
  showMap={true}
/>
```

**1️⃣2️⃣ Failure Modes:**

- Form submission errors
- Map loading issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create ContactPageTemplate using registry pattern
2. Add form integration with @repo/features/contact
3. Add business information section
4. Add optional map integration
5. Create comprehensive tests
6. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- Template renders with registry sections
- Form submission works with features
- Map integration works
- Accessibility passes testing

**1️⃣5️⃣ Anti-Overengineering:**

- No complex form builders
- No custom validation libraries

**Related Files:**

- Task spec: `docs/task-specs/04-page-templates.md` (sections 3.5)
- Research: `RESEARCH_ENHANCED.md` (Form accessibility, React 19)
- Dependencies: Check features/contact, marketing components

**Files:** `packages/page-templates/src/templates/ContactPageTemplate.tsx`

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

#### 3.8 Build BookingPageTemplate | **Effort:** 3 hrs | **Dependencies:** 3.1, 2.12 | **Batch:** C

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**Objective:** Booking page template using BookingForm from @repo/features; pre-fill from URL/context. Required for 5.1 (starter) minimum page set.

**Key details:** Full spec in `docs/task-specs/04-page-templates.md` (sections 3.8). Create `packages/page-templates/src/templates/BookingPageTemplate.tsx`; update registry. Deps: 3.1 (registry), 2.12 (booking feature).

---

## Integrations Expansion

#### 4.1 Email Marketing Integrations | **Effort:** 6 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need email marketing integrations with Mailchimp, SendGrid, ConvertKit
- Layer: L0 (@repo/integrations)
- Introduces: Provider adapter contracts with retry/timeout behavior
- Uses OAuth 2.1 with PKCE for authentication

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/email/` directory
- **Create:** `types.ts`, `adapters/`, `providers/mailchimp.ts`, `providers/sendgrid.ts`, `providers/convertkit.ts`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface EmailProvider {
  subscribe(email: string, listId: string): Promise<void>;
  unsubscribe(email: string, listId: string): Promise<void>;
  updateContact(email: string, data: Record<string, any>): Promise<void>;
}
export const createMailchimpProvider: (config: MailchimpConfig) => EmailProvider;
export const createSendGridProvider: (config: SendGridConfig) => EmailProvider;
export const createConvertKitProvider: (config: ConvertKitConfig) => EmailProvider;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const emailConfigSchema = z.object({
  apiKey: z.string(),
  listId: z.string(),
  retryAttempts: z.number().default(3),
  timeout: z.number().default(5000),
});
```

**6️⃣ Internal Architecture:**

- Provider adapter pattern with retry/timeout
- **2026 Features:** OAuth 2.1 (draft-ietf-oauth-v2-1-14, Oct 2025; PKCE required) with PKCE, enhanced security for GDPR/CCPA
- **Performance:** Circuit breaker patterns, request deduplication
- **Security:** API key management, rate limiting

**7️⃣ Performance & SEO:**

- **LCP:** No impact (backend integrations)
- **Bundle:** < 15KB gzipped total
- **SEO:** Not applicable

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance for consent forms
- ARIA labels for subscription status
- Screen reader support for error messages

**9️⃣ Analytics:**

- Subscription conversion tracking
- Provider performance monitoring
- Error rate analytics

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/email/__tests__/EmailProvider.test.ts`
- Integration: Mock Service Worker for API testing
- **2026 Tools:** Vitest + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
const mailchimpProvider = createMailchimpProvider({
  apiKey: process.env.MAILCHIMP_API_KEY,
  listId: 'abc123',
  retryAttempts: 3,
  timeout: 5000,
});

await mailchimpProvider.subscribe('user@example.com', 'abc123');
```

**1️⃣2️⃣ Failure Modes:**

- API rate limiting
- Authentication failures
- Network timeouts

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with EmailProvider interface
2. Implement Mailchimp adapter with OAuth 2.1
3. Implement SendGrid adapter with retry logic
4. Implement ConvertKit adapter with error handling
5. Add circuit breaker pattern
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All providers implement EmailProvider interface
- Retry/timeout behavior works
- OAuth 2.1 authentication works
- Tests pass with MSW mocks

**1️⃣5️⃣ Anti-Overengineering:**

- No complex email template management
- No custom analytics dashboards

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.1)
- Research: `RESEARCH_ENHANCED.md` (OAuth 2.1, security patterns)

**Subtasks (parent complete when all done):**

- **4.1a** Provider adapter contract (retry/timeout)
- **4.1b** Mailchimp
- **4.1c** SendGrid
- **4.1d** ConvertKit

**Files:** `packages/integrations/src/email/`

#### 4.2 Scheduling Integrations | **Effort:** 6 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need scheduling integrations with Calendly, Acuity, Cal.com
- Layer: L0 (@repo/integrations)
- Introduces: Abstracted behind one scheduling interface, consent-based lazy loading
- Uses CMP framework for consent management

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/scheduling/` directory
- **Create:** `types.ts`, `adapters/`, `providers/calendly.ts`, `providers/acuity.ts`, `providers/calcom.ts`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface SchedulingProvider {
  embedWidget(container: HTMLElement, config: WidgetConfig): Promise<void>;
  destroyWidget(container: HTMLElement): void;
  onBookingComplete(callback: (booking: BookingData) => void): void;
}
export const createCalendlyProvider: (config: CalendlyConfig) => SchedulingProvider;
export const createAcuityProvider: (config: AcuityConfig) => SchedulingProvider;
export const createCalComProvider: (config: CalComConfig) => SchedulingProvider;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const schedulingConfigSchema = z.object({
  apiKey: z.string(),
  embedType: z.enum(['inline', 'popup', 'widget']),
  consentRequired: z.boolean().default(true),
  lazyLoad: z.boolean().default(true),
});
```

**6️⃣ Internal Architecture:**

- Consent-first loading patterns for third-party embeds
- **2026 Features:** TCF v2.3 compliance, edge computing integration
- **Performance:** Intersection Observer API for lazy loading
- **Security:** CSP compliance, sandboxed iframes

**7️⃣ Performance & SEO:**

- **LCP:** Lazy loading prevents impact
- **Bundle:** < 12KB gzipped total
- **SEO:** Not applicable

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA labels for scheduling widgets
- Keyboard navigation support
- Focus management

**9️⃣ Analytics:**

- Scheduling interaction tracking
- Widget performance metrics
- Conversion analytics

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/scheduling/__tests__/SchedulingProvider.test.ts`
- Integration: Mock Service Worker for API testing
- **2026 Tools:** Vitest + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
const calendlyProvider = createCalendlyProvider({
  apiKey: process.env.CALENDLY_API_KEY,
  embedType: 'inline',
  consentRequired: true,
  lazyLoad: true,
});

await calendlyProvider.embedWidget(container, config);
```

**1️⃣2️⃣ Failure Modes:**

- Consent management issues
- Widget loading failures
- API authentication errors

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with SchedulingProvider interface
2. Implement consent management with CMP framework
3. Add Intersection Observer for lazy loading
4. Implement Calendly adapter
5. Implement Acuity and Cal.com adapters
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All providers implement SchedulingProvider interface
- Consent-first loading works
- Lazy loading functions correctly
- Tests pass with MSW mocks

**1️⃣5️⃣ Anti-Overengineering:**

- No custom scheduling UI
- No complex calendar management

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.2)
- Research: `RESEARCH_ENHANCED.md` (TCF v2.3, consent management)

**Subtasks (parent complete when all done):**

- **4.2a** Scheduling interface + consent/lazy-load
- **4.2b** Calendly
- **4.2c** Acuity
- **4.2d** Cal.com

**Files:** `packages/integrations/src/scheduling/`

#### 4.3 Chat Support Integrations | **Effort:** 5 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need chat support integrations with Intercom, Crisp, Tidio
- Layer: L0 (@repo/integrations)
- Introduces: Lazy loading, consent-gated, provider-neutral API
- Uses ARIA live regions for chat interfaces

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/chat/` directory
- **Create:** `types.ts`, `adapters/`, `providers/intercom.ts`, `providers/crisp.ts`, `providers/tidio.ts`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface ChatProvider {
  initialize(config: ChatConfig): Promise<void>;
  show(): void;
  hide(): void;
  onMessage(callback: (message: ChatMessage) => void): void;
  sendMessage(message: string): Promise<void>;
}
export const createIntercomProvider: (config: IntercomConfig) => ChatProvider;
export const createCrispProvider: (config: CrispConfig) => ChatProvider;
export const createTidioProvider: (config: TidioConfig) => ChatProvider;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const chatConfigSchema = z.object({
  appId: z.string(),
  consentRequired: z.boolean().default(true),
  lazyLoad: z.boolean().default(true),
  position: z.enum(['bottom-right', 'bottom-left', 'top-right']).default('bottom-right'),
});
```

**6️⃣ Internal Architecture:**

- Provider-neutral API with adapter pattern
- **2026 Features:** Enhanced security, GDPR/CCPA compliance
- **Performance:** Lazy loading, request deduplication
- **Accessibility:** ARIA live regions, focus management

**7️⃣ Performance & SEO:**

- **LCP:** Lazy loading prevents impact
- **Bundle:** < 10KB gzipped total
- **SEO:** Not applicable

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA live regions for chat messages
- Focus appearance: 2px thick perimeter with 3:1 contrast
- Keyboard navigation for chat interface

**9️⃣ Analytics:**

- Chat interaction tracking
- Message analytics
- Conversion attribution

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/chat/__tests__/ChatProvider.test.ts`
- Integration: Mock Service Worker for API testing
- **2026 Tools:** Vitest + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
const intercomProvider = createIntercomProvider({
  appId: process.env.INTERCOM_APP_ID,
  consentRequired: true,
  lazyLoad: true,
  position: 'bottom-right',
});

await intercomProvider.initialize(config);
```

**1️⃣2️⃣ Failure Modes:**

- Chat widget loading failures
- Consent management issues
- API authentication errors

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with ChatProvider interface
2. Implement consent-gated loading
3. Add ARIA live regions for accessibility
4. Implement Intercom adapter
5. Implement Crisp and Tidio adapters
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All providers implement ChatProvider interface
- Consent-gated loading works
- ARIA live regions function correctly
- Tests pass with MSW mocks

**1️⃣5️⃣ Anti-Overengineering:**

- No custom chat UI
- No complex message routing

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.3)
- Research: `RESEARCH_ENHANCED.md` (WCAG 2.2, accessibility)

**Files:** `packages/integrations/src/chat/`

#### 4.4 Review Platform Integrations | **Effort:** 5 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need review platform integrations with Google Reviews, Yelp, Trustpilot
- Layer: L0 (@repo/integrations)
- Introduces: Normalized schema with source/moderation flags
- Uses Schema.org evergreen types for SEO

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/reviews/` directory
- **Create:** `types.ts`, `adapters/`, `providers/google.ts`, `providers/yelp.ts`, `providers/trustpilot.ts`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface ReviewProvider {
  fetchReviews(businessId: string): Promise<Review[]>;
  submitReview(review: ReviewSubmission): Promise<void>;
  getBusinessInfo(businessId: string): Promise<BusinessInfo>;
}
export const createGoogleReviewsProvider: (config: GoogleConfig) => ReviewProvider;
export const createYelpProvider: (config: YelpConfig) => ReviewProvider;
export const createTrustpilotProvider: (config: TrustpilotConfig) => ReviewProvider;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const reviewSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  author: z.string(),
  date: z.string(),
  source: z.enum(['google', 'yelp', 'trustpilot']),
  moderated: z.boolean().default(false),
  verified: z.boolean().default(false),
});
```

**6️⃣ Internal Architecture:**

- Normalized review schema across providers
- **2026 Features:** AI search preparation, sentiment analysis support
- **Performance:** Caching strategies, request deduplication
- **Security:** API key management, rate limiting

**7️⃣ Performance & SEO:**

- **LCP:** No impact (backend integrations)
- **Bundle:** < 18KB gzipped total
- **SEO:** Review schema markup, structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic review structure
- ARIA labels for review content
- Screen reader support

**9️⃣ Analytics:**

- Review interaction tracking
- Source performance metrics
- Sentiment analytics

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/reviews/__tests__/ReviewProvider.test.ts`
- Integration: Mock Service Worker for API testing
- **2026 Tools:** Vitest + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
const googleProvider = createGoogleReviewsProvider({
  apiKey: process.env.GOOGLE_API_KEY,
  businessId: 'abc123',
});

const reviews = await googleProvider.fetchReviews('abc123');
```

**1️⃣2️⃣ Failure Modes:**

- API rate limiting
- Authentication failures
- Data normalization errors

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with ReviewProvider interface
2. Implement normalized review schema
3. Add Google Reviews adapter
4. Implement Yelp and Trustpilot adapters
5. Add sentiment analysis support
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All providers implement ReviewProvider interface
- Normalized schema works across providers
- Schema.org markup generates correctly
- Tests pass with MSW mocks

**1️⃣5️⃣ Anti-Overengineering:**

- No custom review UI
- No complex sentiment analysis

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.4)
- Research: `RESEARCH_ENHANCED.md` (Schema.org, AI search preparation)

**Files:** `packages/integrations/src/reviews/`

#### 4.5 Maps Integration | **Effort:** 3 hrs | **Deps:** None | **Batch:** F

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need Google Maps embed with progressive enhancement
- Layer: L0 (@repo/integrations)
- Introduces: Static-map preview for LCP, interactive map on interaction
- Uses WebP map tiles for performance

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/maps/` directory
- **Create:** `types.ts`, `GoogleMapsProvider.ts`, `StaticMapGenerator.ts`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface MapsProvider {
  generateStaticMap(config: MapConfig): Promise<string>;
  embedInteractiveMap(container: HTMLElement, config: MapConfig): Promise<void>;
  onMapReady(callback: () => void): void;
}
export const createGoogleMapsProvider: (config: GoogleMapsConfig) => MapsProvider;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const mapConfigSchema = z.object({
  apiKey: z.string(),
  center: z.object({ lat: z.number(), lng: z.number() }),
  zoom: z.number().default(15),
  markers: z.array(z.object({ lat: z.number(), lng: z.number(), title: z.string() })).optional(),
  width: z.number().default(600),
  height: z.number().default(400),
});
```

**6️⃣ Internal Architecture:**

- Progressive enhancement with static preview
- **2026 Features:** Edge computing integration, Network Information API
- **Performance:** WebP map tiles, lazy loading, adaptive loading
- **Security:** HTTPS authentication, CSP compliance

**7️⃣ Performance & SEO:**

- **LCP:** Static map preview prevents impact
- **Bundle:** < 8KB gzipped total
- **SEO:** Not applicable

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- ARIA labels for map content
- Keyboard navigation support
- Screen reader support

**9️⃣ Analytics:**

- Map interaction tracking
- Performance metrics
- User location analytics

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/maps/__tests__/MapsProvider.test.ts`
- Integration: Mock Service Worker for API testing
- **2026 Tools:** Vitest + MSW

**1️⃣1️⃣ Example Usage:**

```tsx
const mapsProvider = createGoogleMapsProvider({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
});

const staticMapUrl = await mapsProvider.generateStaticMap({
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 15,
  width: 600,
  height: 400,
});
```

**1️⃣2️⃣ Failure Modes:**

- API authentication errors
- Static map generation failures
- Interactive map loading issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with MapsProvider interface
2. Implement static map generator with WebP tiles
3. Add progressive enhancement logic
4. Implement interactive map embed
5. Add Network Information API for adaptive loading
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- Static map generation works
- Progressive enhancement functions correctly
- Interactive map loads on interaction
- Tests pass with MSW mocks

**1️⃣5️⃣ Anti-Overengineering:**

- No custom map UI
- No complex geolocation features

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.5)
- Research: `RESEARCH_ENHANCED.md` (WebP tiles, edge computing)

**Files:** `packages/integrations/src/maps/`

#### 4.6 Industry Schemas Package | **Effort:** 6 hrs | **Deps:** None

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need JSON-LD structured data generators for SEO
- Layer: L0 (@repo/integrations)
- Introduces: Typed, snapshot-tested, per-industry schema generators
- Uses Schema.org evergreen types for AI search preparation

**2️⃣ Dependency Check:**

- **Completed:** None
- **Packages:** @repo/types, @repo/utils
- **Blockers:** None

**3️⃣ File System Plan:**

- **Create:** `packages/integrations/src/schemas/` directory
- **Create:** `types.ts`, `generators/`, `schemas/`, `__tests__/`, `index.ts`
- **Update:** `packages/integrations/src/index.ts` (barrel export)

**4️⃣ Public API Design:**

```ts
interface SchemaGenerator {
  generateOrganization(data: OrganizationData): string;
  generateService(data: ServiceData): string;
  generateProduct(data: ProductData): string;
  generateArticle(data: ArticleData): string;
  generateReview(data: ReviewData): string;
}
export const createSchemaGenerator: (config: SchemaConfig) => SchemaGenerator;
```

**5️⃣ Data Contracts & Schemas:**

```ts
const organizationDataSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logo: z.string().url(),
  description: z.string(),
  address: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    addressCountry: z.string(),
  }),
  contactPoint: z.object({ telephone: z.string(), contactType: z.string() }).optional(),
});
```

**6️⃣ Internal Architecture:**

- Typed schema generators with validation
- **2026 Features:** AI search preparation, enhanced entity understanding
- **Performance:** JSON-LD generation, caching strategies
- **Security:** Input validation, XSS prevention

**7️⃣ Performance & SEO:**

- **LCP:** No impact (server-side generation)
- **Bundle:** < 12KB gzipped total
- **SEO:** Enhanced entity understanding, AI search optimization

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Semantic HTML structure
- Screen reader support for structured data

**9️⃣ Analytics:**

- Schema generation metrics
- SEO performance tracking
- AI search preparation analytics

**🔟 Testing Strategy:**

- Unit: `packages/integrations/src/schemas/__tests__/SchemaGenerator.test.ts`
- Snapshot: Visual regression testing for JSON-LD output
- **2026 Tools:** Vitest + snapshot testing

**1️⃣1️⃣ Example Usage:**

```tsx
const schemaGenerator = createSchemaGenerator();

const organizationSchema = schemaGenerator.generateOrganization({
  name: 'Business Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  description: 'Business description',
  address: {
    streetAddress: '123 Main St',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
});
```

**1️⃣2️⃣ Failure Modes:**

- Schema validation errors
- JSON-LD generation failures
- Type validation issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create shared types.ts with SchemaGenerator interface
2. Implement typed schema generators
3. Add input validation with Zod
4. Create snapshot tests for JSON-LD output
5. Add industry-specific generators
6. Create comprehensive tests
7. Add barrel export

**1️⃣4️⃣ Done Criteria:**

- All schema generators work correctly
- JSON-LD output validates against Schema.org
- Snapshot tests pass
- Type safety maintained

**1️⃣5️⃣ Anti-Overengineering:**

- No custom schema validation
- No complex entity relationship management

**Related Files:**

- Task spec: `docs/task-specs/05-integrations.md` (sections 4.6)
- Research: `RESEARCH_ENHANCED.md` (Schema.org, AI search preparation)

**Subtasks (parent complete when all done):**

- **4.6a** Core schema generators (Organization, Service, Product, Article, Review)
- **4.6b** Industry-specific generators (HairSalon, Restaurant, ProfessionalServices, Retail)
- **4.6c** Snapshot testing suite
- **4.6d** Documentation and examples

**Files:** `packages/integrations/src/schemas/`

- **4.6a** JSON-LD generator base + types
- **4.6b** Per-industry schema implementations
- **4.6c** Snapshot tests

---

## Client Factory (Wave 3) — Starter and First Example Clients

> `clients/` currently has only README.md. These tasks create the golden-path starter and first two example clients. Until 6.8 (CLI) exists, new clients are created by copying the starter; optional: document "clone/copy starter" in 5.1.

#### 5.1 Create Starter-Template in clients/ | **Effort:** 6 hrs | **Dependencies:** 3.1, 3.2, 3.3, 3.5, 3.8

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need golden-path starter template for client creation
- Layer: L3 (clients/ — Experience Layer)
- Introduces: Thin Next.js shell using page templates, configuration-as-code
- Uses site.config.ts as the only customization point

**2️⃣ Dependency Check:**

- **Completed:** 3.1 (registry), 3.2 (HomePage), 3.3 (ServicesPage), 3.5 (ContactPage), 3.8 (BookingPage)
- **Packages:** @repo/page-templates, @repo/features, @repo/ui, @repo/marketing-components
- **Blockers:** All required page templates must be complete

**3️⃣ File System Plan:**

- **Create:** `clients/starter-template/` directory
- **Create:** `app/layout.tsx`, `app/page.tsx`, `app/about/`, `app/services/`, `app/contact/`, `app/blog/`, `app/book/`, `app/api/`
- **Create:** `site.config.ts`, `middleware.ts`, `next.config.js`, `tailwind.config.js`, `package.json`, `README.md`
- **Delete:** None

**4️⃣ Public API Design:**

```tsx
// site.config.ts
interface SiteConfig {
  siteName: string;
  siteUrl: string;
  industry: string;
  theme: ThemeConfig;
  features: FeatureConfig;
  integrations: IntegrationConfig;
  seo: SEOConfig;
}
```

**5️⃣ Data Contracts & Schemas:**

```ts
const siteConfigSchema = z.object({
  siteName: z.string(),
  siteUrl: z.string().url(),
  industry: z.enum(['salon', 'restaurant', 'professional-services', 'retail']),
  theme: z.object({ primaryColor: z.string(), secondaryColor: z.string() }),
  features: z.object({ booking: z.boolean(), contact: z.boolean(), blog: z.boolean() }),
  integrations: z.object({
    googleAnalytics: z.string().optional(),
    emailMarketing: z.string().optional(),
  }),
  seo: z.object({ title: z.string(), description: z.string() }),
});
```

**6️⃣ Internal Architecture:**

- RSC-first architecture with Server Components by default
- **2026 Features:** React 19 Server Actions, streaming with Suspense boundaries
- **Performance:** Route-based code splitting, bundle size budgets
- **Security:** Security hardening following 2025 RSC vulnerabilities

**7️⃣ Performance & SEO:**

- **LCP:** Optimized with Core Web Vitals (LCP < 2.5s, INP ≤ 200ms, CLS < 0.1)
- **Bundle:** JS < 250KB gzipped, total page weight < 1MB
- **SEO:** Content accessibility as Google ranking factor (Sept 2025 update)

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance mandatory
- 24×24 CSS pixels minimum for touch targets
- Semantic HTML and landmark navigation
- Screen reader support

**9️⃣ Analytics:**

- GDPR-compliant consent management
- Component-level tracking patterns
- Performance analytics integration

**🔟 Testing Strategy:**

- Unit: React Testing Library for component tests
- **2026 Tools:** Vitest over Jest for performance
- E2E: Playwright for critical path validation
- Accessibility: axe-core integration

**1️⃣1️⃣ Example Usage:**

```tsx
// clients/starter-template/site.config.ts
export const siteConfig: SiteConfig = {
  siteName: 'Starter Template',
  siteUrl: 'https://example.com',
  industry: 'salon',
  theme: { primaryColor: '#3b82f6', secondaryColor: '#10b981' },
  features: { booking: true, contact: true, blog: false },
  integrations: { googleAnalytics: 'GA-XXXXXXXX' },
  seo: { title: 'Starter Template', description: 'A starter template for marketing websites' },
};
```

**1️⃣2️⃣ Failure Modes:**

- Configuration validation errors
- Page template import failures
- Build process issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Create Next.js shell with ThemeInjector and providers
2. Set up routes using page templates
3. Create site.config.ts with validation
4. Add middleware for security
5. Configure Next.js and Tailwind
6. Create comprehensive README
7. Validate build process

**1️⃣4️⃣ Done Criteria:**

- All pages render with page templates
- site.config.ts validation works
- Build process succeeds
- Performance budgets met

**1️⃣5️⃣ Anti-Overengineering:**

- No custom client factory CLI
- No AI coding tools required
- No complex build pipelines

**Related Files:**

- Task spec: `docs/task-specs/06-client-factory.md` (sections 5.1)
- Research: `RESEARCH_ENHANCED.md` (RSC, performance, accessibility)

**Subtasks (parent complete when all done):**

- **5.1a** Next.js shell (layout, ThemeInjector, providers)
- **5.1b** Routes (home, services, contact, book, about, blog) + page templates
- **5.1c** `site.config.ts` validation + README/setup

**Files:** `clients/starter-template/`

**Dependency:** Minimum page set (3.2, 3.3, 3.5, 3.8) must be done before 5.1. 5.2, 5.3 use this as single source.

---

#### 5.2 Luxe-Salon Example Client | **Effort:** 3 hrs | **Dependencies:** 5.1 | **Batch:** D

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need salon industry example client demonstrating config-driven assembly
- Layer: L4 (clients/luxe-salon)
- Introduces: Salon industry configuration with booking and team features
- Uses starter-template as single source

**2️⃣ Dependency Check:**

- **Completed:** 5.1 (starter-template)
- **Packages:** Inherits from starter-template
- **Blockers:** 5.1 must be complete

**3️⃣ File System Plan:**

- **Create:** `clients/luxe-salon/` directory
- **Copy:** All files from `clients/starter-template/`
- **Update:** `site.config.ts` with salon-specific configuration
- **Delete:** None

**4️⃣ Public API Design:**

```tsx
// clients/luxe-salon/site.config.ts
export const siteConfig: SiteConfig = {
  siteName: 'Luxe Salon',
  siteUrl: 'https://luxe-salon.com',
  industry: 'salon',
  theme: { primaryColor: '#ec4899', secondaryColor: '#f472b6' },
  features: { booking: true, contact: true, blog: true },
  integrations: { googleAnalytics: 'GA-XXXXXXXX', calendly: 'calendly-embed' },
  seo: {
    title: 'Luxe Salon - Premium Hair Services',
    description: 'Experience luxury hair services at Luxe Salon',
  },
};
```

**5️⃣ Data Contracts & Schemas:**

- Inherits siteConfigSchema from starter-template
- Salon-specific validation rules for industry type

**6️⃣ Internal Architecture:**

- Configuration-driven assembly from starter-template
- **2026 Features:** Industry-specific feature flags
- **Performance:** Optimized for salon industry patterns
- **Accessibility:** WCAG 2.2 AA compliance for salon services

**7️⃣ Performance & SEO:**

- **LCP:** Optimized for salon booking flows
- **Bundle:** Inherits from starter-template
- **SEO:** Salon-specific structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Salon service accessibility
- Booking form accessibility

**9️⃣ Analytics:**

- Salon-specific conversion tracking
- Booking analytics
- Service performance metrics

**🔟 Testing Strategy:**

- Unit: Configuration validation tests
- **2026 Tools:** Vitest + Playwright
- **Coverage:** Salon-specific functionality

**1️⃣1️⃣ Example Usage:**

```tsx
// Validates config-driven assembly
import { siteConfig } from './site.config';
import { validateSiteConfig } from '@repo/utils/validation';

const isValidConfig = validateSiteConfig(siteConfig);
```

**1️⃣2️⃣ Failure Modes:**

- Configuration validation errors
- Industry-specific feature failures
- Build process issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Copy starter-template to luxe-salon
2. Update site.config.ts with salon configuration
3. Validate configuration with salon-specific rules
4. Test booking functionality
5. Test team grid layout
6. Validate build process

**1️⃣4️⃣ Done Criteria:**

- Configuration validates successfully
- Salon features work correctly
- Build process succeeds
- All pages render properly

**1️⃣5️⃣ Anti-Overengineering:**

- No custom salon logic
- No industry-specific hardcoding

**Related Files:**

- Task spec: `docs/task-specs/06-client-factory.md` (sections 5.2)
- Research: `RESEARCH_ENHANCED.md` (Configuration patterns)

**Files:** `clients/luxe-salon/`

---

#### 5.3 Bistro-Central Example Client | **Effort:** 3 hrs | **Dependencies:** 5.1 | **Batch:** D

**Status:** [ ] TODO | **Assigned To:** [ ] | **Completed:** [ ]

**AI Agent Implementation Guide (15-Section Format):**

**1️⃣ Objective Clarification:**

- Problem: Need restaurant industry example client demonstrating multi-industry config
- Layer: L4 (clients/bistro-central)
- Introduces: Restaurant industry configuration with booking features
- Uses starter-template as single source

**2️⃣ Dependency Check:**

- **Completed:** 5.1 (starter-template)
- **Packages:** Inherits from starter-template
- **Blockers:** 5.1 must be complete

**3️⃣ File System Plan:**

- **Create:** `clients/bistro-central/` directory
- **Copy:** All files from `clients/starter-template/`
- **Update:** `site.config.ts` with restaurant-specific configuration
- **Delete:** None

**4️⃣ Public API Design:**

```tsx
// clients/bistro-central/site.config.ts
export const siteConfig: SiteConfig = {
  siteName: 'Bistro Central',
  siteUrl: 'https://bistro-central.com',
  industry: 'restaurant',
  theme: { primaryColor: '#dc2626', secondaryColor: '#f97316' },
  features: { booking: true, contact: true, blog: true },
  integrations: { googleAnalytics: 'GA-XXXXXXXX', opentable: 'opentable-embed' },
  seo: {
    title: 'Bistro Central - Fine Dining Experience',
    description: 'Experience fine dining at Bistro Central',
  },
};
```

**5️⃣ Data Contracts & Schemas:**

- Inherits siteConfigSchema from starter-template
- Restaurant-specific validation rules for industry type

**6️⃣ Internal Architecture:**

- Configuration-driven assembly from starter-template
- **2026 Features:** Industry-specific feature flags
- **Performance:** Optimized for restaurant industry patterns
- **Accessibility:** WCAG 2.2 AA compliance for restaurant services

**7️⃣ Performance & SEO:**

- **LCP:** Optimized for restaurant booking flows
- **Bundle:** Inherits from starter-template
- **SEO:** Restaurant-specific structured data

**8️⃣ Accessibility:**

- WCAG 2.2 AA compliance
- Restaurant service accessibility
- Menu accessibility
- Booking form accessibility

**9️⃣ Analytics:**

- Restaurant-specific conversion tracking
- Booking analytics
- Menu interaction metrics

**🔟 Testing Strategy:**

- Unit: Configuration validation tests
- **2026 Tools:** Vitest + Playwright
- **Coverage:** Restaurant-specific functionality

**1️⃣1️⃣ Example Usage:**

```tsx
// Validates multi-industry config
import { siteConfig } from './site.config';
import { validateSiteConfig } from '@repo/utils/validation';

const isValidConfig = validateSiteConfig(siteConfig);
```

**1️⃣2️⃣ Failure Modes:**

- Configuration validation errors
- Industry-specific feature failures
- Build process issues

**1️⃣3️⃣ AI Implementation Checklist:**

1. Copy starter-template to bistro-central
2. Update site.config.ts with restaurant configuration
3. Validate configuration with restaurant-specific rules
4. Test booking functionality
5. Test menu display
6. Validate build process

**1️⃣4️⃣ Done Criteria:**

- Configuration validates successfully
- Restaurant features work correctly
- Build process succeeds
- All pages render properly

**1️⃣5️⃣ Anti-Overengineering:**

- No custom restaurant logic
- No industry-specific hardcoding

**Related Files:**

- Task spec: `docs/task-specs/06-client-factory.md` (sections 5.3)
- Research: `RESEARCH_ENHANCED.md` (Configuration patterns)

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

| Task                   | Must Read Files                                                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI Components**      | `packages/ui/src/components/Button.tsx`, `Input.tsx`, `Accordion.tsx`                                                                                                                                                                          |
| **Configuration**      | `packages/types/src/site-config.ts` (post-0.8; Zod schema `siteConfigSchema` in same file, no separate site-config.schema.ts), `templates/hair-salon/site.config.ts`, `pnpm-workspace.yaml`                                                    |
| **Feature Extraction** | Source of truth: `packages/features/src/` (booking, contact, blog, services, search). Template `templates/hair-salon/features/` re-exports from @repo/features. For booking (schema+actions+providers+test): `packages/features/src/booking/`. |
| **Search Feature**     | `packages/features/src/search/` (SearchDialog, SearchPage), `templates/hair-salon/lib/search.ts` (adapter over feature)                                                                                                                        |
| **Services Feature**   | `packages/features/src/services/` (ServicesOverview, ServiceDetailLayout)                                                                                                                                                                      |
| **Metaheaders**        | Any file in `packages/ui/src/components/`                                                                                                                                                                                                      |
| **Package Setup**      | `packages/ui/package.json`, `packages/infra/package.json`                                                                                                                                                                                      |
| **Testing**            | `packages/infra/__tests__/` (9 files), `templates/hair-salon/lib/__tests__/` (2 files)                                                                                                                                                         |
| **Env Validation**     | `packages/infra/env/schemas/` (7 Zod schemas)                                                                                                                                                                                                  |
| **Security**           | `packages/infra/security/csp.ts` (nonce generation)                                                                                                                                                                                            |
| **Shared Types**       | `packages/types/src/site-config.ts` (SiteConfig, ConversionFlowConfig)                                                                                                                                                                         |

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

## Missing Research & Analysis Gaps (Added February 18, 2026)

### Documentation & Knowledge Management

- [ ] **Comprehensive API Documentation** - Auto-generated API docs for all packages (similar to Storybook Docs)
- [ ] **Migration Playbooks** - Step-by-step guides for common migration scenarios (template → client, v1 → v2)
- [ ] **Performance Benchmarking Suite** - Automated performance regression testing with Lighthouse CI
- [ ] **Security Hardening Guide** - Beyond basic security, include advanced threat models
- [ ] **Multi-tenant Architecture Patterns** - Deep dive into isolation strategies at scale
- [ ] **Edge Computing Implementation Guide** - Practical patterns for Vercel Edge, Cloudflare Workers
- [ ] **Internationalization (i18n) Strategy** - Complete i18n implementation roadmap
- [ ] **Component Variant System** - Systematic approach to component variations and theming
- [ ] **Analytics Implementation Patterns** - Advanced tracking beyond basic page views
- [ ] **Error Handling & Recovery Patterns** - Comprehensive error boundary strategies

### Technical Debt & Optimization

- [ ] **Bundle Size Analysis** - Systematic bundle optimization across all packages
- [ ] **Runtime Performance Profiling** - Identify and resolve performance bottlenecks
- [ ] **Memory Leak Detection** - Proactive memory management for long-running applications
- [ ] **Dependency Security Audit** - Automated vulnerability scanning and remediation
- [ ] **Code Splitting Strategy** - Advanced code splitting patterns for optimal loading
- [ ] **Caching Strategy Documentation** - Multi-layer caching (browser, CDN, edge, database)
- [ ] **Database Optimization Patterns** - Query optimization and connection pooling
- [ ] **Image Optimization Pipeline** - Automated image processing and delivery
- [ ] **Font Loading Strategy** - Optimize web font loading for performance
- [ ] **CSS Optimization** - Critical CSS extraction and minimization

### Developer Experience & Tooling

- [ ] **Local Development Environment** - Docker-based dev environment setup
- [ ] **Hot Module Replacement** - Optimize HMR for faster development cycles
- [ ] **Debugging Tools Integration** - Enhanced debugging capabilities
- [ ] **Code Generation Tools** - Automated boilerplate generation
- [ ] **Refactoring Tools** - Safe automated refactoring utilities
- [ ] **Testing Utilities** - Shared testing helpers and fixtures
- [ ] **Linting Rules Expansion** - Custom lint rules for project-specific patterns
- [ ] **IDE Integration** - VS Code extensions and configurations
- [ ] **Git Hooks Enhancement** - Pre-commit hooks for quality checks
- [ ] **Documentation Site** - Dedicated documentation website

### Business & Product Features

- [ ] **A/B Testing Framework** - Built-in experimentation platform
- [ ] **Feature Flag System** - Dynamic feature toggling
- [ ] **User Analytics Dashboard** - Real-time user behavior analytics
- [ ] **Conversion Rate Optimization** - CRO tools and patterns
- [ ] **Content Management Integration** - Headless CMS adapters
- [ ] **Search Engine Optimization** - Advanced SEO automation
- [ ] **Social Media Integration** - Social sharing and embedding
- [ ] **Email Marketing Integration** - Campaign management tools
- [ ] **Customer Support Integration** - Chat and help desk systems
- [ ] **Payment Processing** - E-commerce and subscription management

### Infrastructure & Operations

- [ ] **Monitoring & Alerting** - Comprehensive observability stack
- [ ] **Log Aggregation** - Centralized logging and analysis
- [ ] **Backup & Disaster Recovery** - Data protection strategies
- [ ] **Scaling Strategies** - Horizontal and vertical scaling patterns
- [ ] **Cost Optimization** - Cloud cost management
- [ ] **Compliance Automation** - GDPR, CCPA, and other regulatory compliance
- [ ] **Release Automation** - Advanced CI/CD pipelines
- [ ] **Environment Management** - Dev/staging/prod parity
- [ ] **Secrets Management** - Secure credential handling
- [ ] **Performance Monitoring** - Real-time performance metrics

### Innovation & Future-Proofing

- [ ] **WebAssembly Integration** - Performance-critical code in WASM
- [ ] **Progressive Web App** - PWA features and offline support
- [ ] **Web Components** - Framework-agnostic component strategy
- [ ] **Machine Learning Integration** - ML-powered features
- [ ] **Blockchain/Web3** - Decentralized features exploration
- [ ] **Voice Interface** - Voice command and navigation
- [ ] **Augmented Reality** - AR features for product visualization
- [ ] **Virtual Reality** - VR experiences for immersive content
- [ ] **Internet of Things** - IoT device integration
- [ ] **Quantum Computing** - Future-proofing for quantum algorithms

### Research & Analysis Tasks

- [ ] **Competitive Analysis** - Deep dive into competing platforms
- [ ] **User Research Studies** - Usability testing and user feedback
- [ ] **Market Analysis** - Industry trends and opportunities
- [ ] **Technology Radar** - Emerging technology evaluation
- [ ] **Performance Benchmarks** - Industry performance comparisons
- [ ] **Security Threat Assessment** - Proactive security analysis
- [ ] **Accessibility Audit** - Comprehensive a11y evaluation
- [ ] **SEO Strategy Review** - Search engine optimization analysis
- [ ] **Content Strategy** - Content management and delivery approach
- [ ] **Monetization Strategy** - Revenue generation models

---

_TODO Last Updated: February 18, 2026_
_Completed tasks moved to ARCHIVE.md. This file contains only open tasks._
