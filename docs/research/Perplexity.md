# 2026 Comprehensive Strategic Roadmap: Marketing‑Websites Monorepo

**Date:** February 2026  
**Status:** Unified Strategic Blueprint (v2.2, research‑validated)  
**Philosophy:** Configuration‑as‑Code (CaCA), Everything‑as‑Code (EaC), and Autonomous Platform Engineering.

---

## 0. Research Themes & Strategic Assumptions

This roadmap is organized around a set of long‑lived research axes:

- **Front‑End Architecture:** Feature‑Sliced Design 2.1, pages‑first decomposition, and architecture linting with Steiger.[1][2][3]
- **Monorepo & Platform Engineering:** pnpm workspaces, Turborepo 2.x, composable CI, and Remote Caching.
- **Next.js 16 & React 19.2:** Turbopack, Cache Components (`use cache`), stable Partial Prerendering (PPR), and React Compiler integration.[4][5][6][7]
- **Crypto‑Agility & PQC:** Transition to ML‑DSA (FIPS 204) and HQC KEMs on a crypto‑agile foundation.[8][9][10]
- **Zero‑Trust & Supply‑Chain Security:** Signed commits, SBOM‑every‑build, hardened Supabase, and minimal PII.
- **Accessibility & Regulation:** ADA Title II web rule, HHS Section 504, and Washington WCAG 2.2 AA deadlines.[11][12][13]
- **Local‑First & Data Sovereignty:** PGlite/ElectricSQL local‑first data, DSAR automation, and AI Act‑aligned transparency.[14][15][16]
- **Analytics & GEO:** Self‑hosted analytics (ClickHouse/Tinybird) and Generative Engine Optimization (GEO) for AI‑driven discovery.[17][18][19]
- **Sustainability:** Software Carbon Intensity (SCI) and carbon budgets at CI level.[20][21]
- **Observability‑as‑Code:** OpenTelemetry as a first‑class artifact plus CI‑level performance regression gates.[22][23][24]

Each section below ties back to these themes with concrete implementation steps and guardrails.

---

## 1. Architecture & Code Organization

### 1.1 Feature‑Sliced Design (FSD) 2.1 — Pages‑First, Linted

**Goal:** High‑cohesion front‑end architecture aligned with FSD v2.1 “pages‑first” mental model and enforced by automated linting.[2][25][1]

**Core principles**

- **Layered separation with unidirectional dependencies:**

  `shared → entities → features → widgets → pages → app (routing only)`
  - `app/` is routing, layout, and metadata only.
  - All business logic and UI state lives under `src/` layers, not `app/`.[26]

- **Pages‑first decomposition:**
  - Keep most UI and logic inside the page slice by default.
  - Only extract to `entities` / `features` when:
    - Logic or UI is reused across **2+ pages**; and
    - The slice is semantically meaningful (not a “utils graveyard”).[1][2]
  - Widgets are no longer just composition layers; they can own their own state, API calls, and stores as long as they are not reused elsewhere.[2]

- **Standardized cross‑imports via `@x` notation:**
  - Use FSD 2.1 `@x` convention for explicit cross‑slice imports, e.g.:

    ```ts
    import type { EntityA } from 'entities/A/@x/B';
    ```

  - This makes architectural violations toolable and refactor‑friendly.[25][1]

**Implementation plan**

1. **Directory layout**
   - `src/shared/*` – design system, generic infra (modal manager, date utils, HTTP clients).
   - `src/entities/*` – reusable business objects with stable semantics (Customer, Booking, Plan).
   - `src/features/*` – multi‑entity flows (Checkout, Auth, Onboarding).
   - `src/widgets/*` – reusable page‑level composites (Hero, PricingGrid).
   - `src/pages/*` – page slices in the FSD sense, _not_ Next.js pages (Next pages live in `app/` and import from here).

2. **Steiger + ESLint integration**
   - Add `steiger` and `@feature-sliced/steiger-plugin`.[3][26]
   - Configure rules emphasizing v2.1:
     - `insignificant-slice` → suggests merging slices used only by a single page.[1]
     - `excessive-slicing` → flags over‑fragmented layers.[1]
     - Public API / cross‑layer import rules enforcing `shared → entities → features → widgets → pages`.

   - CI job:

     ```bash
     npx steiger ./src
     pnpm lint
     ```

     PRs fail on any boundary or public API violation.

3. **Phased migration**
   - **Phase 0 – Architectural audit (P0)**
     - Run `npx steiger ./src` and capture:
       - Slices only referenced from one page (`insignificant-slice`).
       - Layers with too many slices (`excessive-slicing`).[1]
     - Produce ADR‑backed proposals to:
       - Merge trivial entities/features back into the owning page slice.
       - Consolidate over‑fragmented slices into fatter, more navigable modules.

   - **Phase 1 – High‑churn flows**
     - Migrate **booking, contact, and checkout** to the new model first:
       - All flow‑specific state & handlers stay in the `pages/*` slice.
       - Extract only when reused in a second flow.

   - **Phase 2 – Org‑wide adoption**
     - Enforce `@x` imports for all cross‑slice links.
     - Require FSD layout for any new package created by internal scaffolding (`pnpm create-site`).

4. **Architecture Decision Records (ADRs)**
   - Every structural change (new slice, merge, re‑layering) must ship with:
     - `docs/adr/NNNN-title.md` summarizing:
       - Context, decision, alternatives, impact.
     - Link from PR description to its ADR.

   - ADRs become mandatory for:
     - Adding or removing FSD layers.
     - Changing cross‑layer dependency rules.
     - Introducing new shared infrastructure (e.g. global modal manager).

**Success indicators**

- ≤ 10% of entities/features flagged as “insignificant” by Steiger.
- Median “files touched per user flow change” decreases over time (cohesion improvement).

---

### 1.2 Everything‑as‑Code (EaC) Extension

**Goal:** Treat all business‑critical assets as code: versioned, reviewable, testable.

**Scope**

- **Non‑code assets in `packages/org-assets/`:**
  - **Legal & privacy docs:**
    - Markdown/MDX or structured YAML/JSON canonical versions.
    - CI checks for:
      - Broken cross‑links.
      - Missing mandatory clauses per jurisdiction.
      - Diff‑based change logs to ease legal review.

  - **Brand system:**
    - SVG logos, icons, and illustrations.
    - Design tokens exported from Figma → TypeScript constants or CSS vars.
      - Use token pipelines (e.g., Style Dictionary) to generate:
        - `tokens.ts` for React components.
        - `tokens.css` for Tailwind/custom CSS.

  - **Infrastructure as Code:**
    - OpenTofu / Terraform modules describing:
      - Vercel projects & environments.
      - AWS account resources (Route53, CloudFront, S3, Lambda, RDS/Supabase).
      - Supabase projects, role configurations, and network restrictions where possible.[27]

- **pnpm workspace optimization**
  - Use `catalog:` protocol in `pnpm-workspace.yaml` to centralize dependency versions and avoid drift across packages.[28]
  - Use `pnpm deploy` from the root with `--filter` to produce slimmed deployment bundles for individual apps/services, ensuring `catalog:` and `workspace:` references are resolved correctly.[29][30]
  - Encourage `pnpm --filter` usage patterns (mirror Turborepo’s `--affected`) for targeted local builds and tests.[31]

**Implementation practices**

- Treat `packages/org-assets` as a **first‑class package**:
  - It has its own tests:
    - Type‑checked token exports.
    - Snapshot tests for critical legal markup (e.g., required headings/sections per regulation).
  - Changes to assets require PR review from:
    - Design (for brand).
    - Legal/compliance (for contracts & policies).

- Align infra state with code:
  - Enforce a rule: **no manual mutations in consoles** except via emergency break‑glass, documented in ADRs.
  - Drift detection:
    - Scheduled pipeline compares live AWS/Vercel/Supabase state against Terraform/OpenTofu plans and alarms on drift.

---

## 2. Framework & Performance (Next.js 16 & React 19)

### 2.1 Next.js 16 Upgrade & Runtime Profile

**Goal:** Standardize on Next.js 16 and React 19.2 with Cache Components, stable Partial Prerendering, and React Compiler support.[7][32][4]

**Core capabilities**

- **Turbopack as default:**
  - Next.js 16 makes Turbopack the standard dev bundler; configure it explicitly for builds where needed.[33][7]
  - Take advantage of:
    - Faster cold builds and HMR vs webpack (2–5x is a typical range).[4]

- **Cache Components + `use cache`:**
  - Enable in `next.config.ts`:

    ```ts
    import type { NextConfig } from 'next';

    const nextConfig: NextConfig = {
      cacheComponents: true,
    };

    export default nextConfig;
    ```

  - Use the `use cache` directive to cache components or functions at:
    - File level (entire module).
    - Component level.
    - Function level (e.g., a data loader).[5][34]

  - Use `cacheTag` + `revalidateTag` / `updateTag`:
    - Tag cached work (`cacheTag('products')`) and have Server Actions call:

      ````ts
      import { revalidateTag, updateTag } from "next/cache"

      // eventual consistency, stale‑while‑revalidate
      await revalidateTag("products", "max")

      // read‑your‑writes behavior
      await updateTag("user-profile")
      ```[35][36][37]

      ````

    - `revalidateTag(tag, profile)` provides SWR behavior; `updateTag(tag)` forces caches to block until fresh data resolves.[35][36]

- **Partial Prerendering (PPR) – now stable:**
  - Next.js 16 ships PPR as a stable capability built on top of Suspense and Cache Components.[38][39][6]
  - Configuration:

    ```ts
    const nextConfig: NextConfig = {
      experimental: {
        ppr: 'incremental', // opt‑in per route
      },
    };
    ```

    ```ts
    // app/marketing/[slug]/page.tsx
    export const experimental_ppr = true

    export default async function Page() {
      return (
        <main>
          {/* Static shell */}
          <Hero />

          {/* Dynamic “hole” */}
          <Suspense fallback={<Skeleton />}>
            <PersonalizedOffers />
          </Suspense>
        </main>
      )
    }
    ```

  - Design rules:
    - Everything **outside** Suspense boundaries is part of a static shell served from the edge cache.
    - Everything **inside** can:
      - Access cookies/headers.
      - Use dynamic data and stream in late.[40][41][42]

- **`after()` API for post‑response work**
  - Use `after` from `next/server` to offload non‑critical background tasks: logging, analytics, email sending, etc.[43][44]

    ```ts
    'use server';

    import { after } from 'next/server';

    export async function submitForm(data: FormData) {
      const email = data.get('email') as string;
      // Fast path – persist data
      await saveLead(email);

      // Slow path – background email
      after(async () => {
        await sendWelcomeEmail(email);
      });

      return { success: true };
    }
    ```

  - This preserves TTFB while still running side effects reliably.

- **OpenTelemetry integration**
  - Prefer `@vercel/otel` for zero‑config tracing in Vercel environments or any OTel‑compatible backend.[45][22]
  - Add `instrumentation.ts`:

    ```ts
    import { registerOTel } from '@vercel/otel';

    export function register() {
      registerOTel({
        serviceName: 'marketing-web',
        instrumentations: {
          fetch: true,
        },
        attributes: {
          'deployment.environment': process.env.NODE_ENV,
        },
      });
    }
    ```

  - For custom exporters (Grafana, SigNoz, etc.), set standard OTLP env vars; `@vercel/otel` will respect them.[46][45]

- **Build Adapters API (Alpha)**
  - For multi‑cloud builds, use Next.js 16’s Build Adapters API:

    ````ts
    const nextConfig: NextConfig = {
      experimental: {
        adapterPath: require.resolve("./next-aws-adapter.js"),
      },
    }
    ```[47][48][49][50]

    ````

  - Adapter responsibilities:
    - Map Next.js build output to AWS Lambda, Cloudflare Workers, or other runtimes.
    - Integrate with OpenNext or platform‑specific deployment flows.[51][52]
  - Use this only for platforms where existing adapters (like OpenNext + Cloudflare) are insufficient or bespoke behavior is required.[51]

**Upgrade strategy**

- **Phase 1 (P0):** Get on Next.js 16 with Turbopack in dev, webpack or Turbopack in build depending on maturity.
- **Phase 2 (P0/P1):** Enable `cacheComponents`, adopt `use cache` on:
  - Navigation shells.
  - Marketing content pages.
  - Reusable query components (e.g. product listings).
- **Phase 3 (P1):** Apply PPR to:
  - Pricing pages.
  - Product detail + personalization blocks.
  - Logged‑in dashboards with heavy static chrome.

---

### 2.2 React Compiler & High‑Performance Execution

**Goal:** Achieve “performance by default” via React Compiler and compute placement.

**React Compiler**

- React Compiler v1.0 is stable and works with React 19.x.[53][32]
- Next.js 16 exposes a stable `reactCompiler` config flag:[54][7]

  ```ts
  import type { NextConfig } from 'next';

  const nextConfig: NextConfig = {
    reactCompiler: true,
  };

  export default nextConfig;
  ```

- Required tooling:

  ```bash
  pnpm add -D babel-plugin-react-compiler
  ```

- Recommended rollout:
  1. **Lint‑only first:**
     - Enable `eslint-plugin-react-compiler` or the integrated React lint rules in `eslint-plugin-react-hooks` that surface compiler issues.[55][56]
     - Fix violations (impure render logic, mutable refs, etc.) until lints are clean.

  2. **Compiler opt‑in:**
     - Enable `reactCompiler: true` in `next.config.ts` for the monorepo or per‑app.
     - For hot‑spot modules, consider `compilationMode: 'annotation'` and explicitly mark components with `"use memo"`.[54]

  3. **Monitoring:**
     - Track bundle size and Sentry/Grafana performance metrics before/after enabling.

**Wasm‑Core & runtime placement**

- **Wasm core in `packages/wasm-core`:**
  - Implement CPU‑heavy routines (image manipulation, animation math, PDF transformations) in Rust and ship as WASM to both server and client.
  - Keep the JS/TS surface area small and stable.

- **Edge‑first strategy:**
  - Default to edge runtime for:
    - Static + ISR routes.
    - PPR shells.
    - Geographically sensitive content (e.g. locale banners).
  - Use Node.js runtime only when:
    - You need heavy server‑side aggregation or access to Node‑only APIs.
    - You depend on libraries incompatible with edge runtimes.

---

## 3. Security & Identity

### 3.1 Post‑Quantum Cryptography (PQC) & Crypto‑Agility

**Goal:** Build a crypto‑agile platform that can smoothly transition from classical algorithms (RSA/ECC) to PQC (ML‑DSA, HQC) on NIST timelines.[9][10][8]

**Context**

- NIST standardized ML‑DSA (formerly CRYSTALS‑Dilithium) in FIPS 204 as a general‑purpose post‑quantum signature algorithm.[10][9]
- AWS and others are already exposing ML‑DSA key types (e.g., ML_DSA_44, 65, 87) via AWS KMS and Private CA for code signing and mTLS.[57][58][59]
- NIST selected HQC as a complementary KEM to Kyber, broadening the diversity of PQC primitives.[60][61][8]

**Strategy**

1. **P0 – Crypto inventory & risk classification**
   - Build and maintain a **machine‑readable registry** of:
     - All machine identities (certificates, keys, signing profiles).
     - Algorithms, key sizes, validity periods, and rotation policies.
     - Protocol usage (TLS, mTLS, JWT signing, webhooks).

   - Mark systems handling **long‑lived or high‑value data** as P0:
     - Audit logs.
     - Identity records.
     - Signed legal documents.

2. **P0/P1 – Crypto‑agility abstraction**
   - Introduce a **crypto provider interface** in Node 22/24:

     ```ts
     export type SignatureAlgorithm = 'rsa-pss' | 'ecdsa' | 'ml-dsa-65' | 'hybrid-rsa-ml-dsa-65';

     export interface CryptoProvider {
       sign(
         payload: Uint8Array,
         algorithm: SignatureAlgorithm,
         keyRef: string
       ): Promise<Uint8Array>;
       verify(
         payload: Uint8Array,
         signature: Uint8Array,
         algorithm: SignatureAlgorithm,
         keyRef: string
       ): Promise<boolean>;
     }
     ```

   - Configure algorithms and keyRefs via environment/runtime config, not hard‑coded strings.

   - Where possible, use AWS‑LC or upstream libraries that already embed PQC (ML‑KEM, ML‑DSA) for crypto primitives.[59][62]

3. **Hybrid pilot (Q3–Q4 2026)**
   - For internal mTLS:
     - Use hybrid certs: RSA‑3072 + ML‑DSA‑65 signatures (where supported) or parallel auth channels combining classical and PQC.[58][57]
     - Limit pilot scope to:
       - Internal APIs with moderate QPS.
       - Non‑customer‑facing, high‑value flows.

   - Deliverables:
     - Benchmarks (handshake latency, CPU).
     - Playbook for deployment / rollback per service.

4. **2027–2028 – Production rollout**
   - Prioritize systems by:
     - Data longevity.
     - Exposure surface (internet‑facing vs internal).
   - Expand hybrid adoption according to AWS/NIST migration guidance and commercial PKI/vendor readiness.[63][59]

5. **2030–2035 – Classical deprecation**
   - Align with NIST guidance that organizations should transition away from RSA/ECC to PQC by ~2030 and treat post‑quantum cryptography as mandatory by ~2035.[10]
   - Target milestone:
     - No long‑lived signatures (code signing, document signing) remain on RSA/ECC by 2030.
     - No non‑hybrid TLS endpoints for high‑risk systems by 2035.

---

### 3.2 Zero‑Trust & Hardening

**Goal:** Treat every environment (including marketing) as untrusted; enforce integrity, traceability, and minimum privilege.

**Key controls**

- **Signed commits & strong identity**
  - Require GPG or SSH signing for all commits to protected branches.
  - Favor:
    - Hardware‑backed keys or TPM‑driven signing where possible for SLSA‑aligned provenance.[64]
  - CI rejects unsigned or unverified commits (via `git verify-commit` / Git provider APIs).[65][66][67]

- **SBOM generation per build**
  - Generate CycloneDX or SPDX SBOMs for every build artifact, integrated into CI.[68][69][70]
  - Store SBOMs in artifact storage and attach references to deployed images.
  - Hook vulnerability scanners into SBOMs for proactive patching and incident response.[71][72]

- **Supabase hardening**
  - Enforce:
    - SSL for all Postgres connections, ideally `verify-full` for production.[73]
    - MFA mandatory for org access.[74][75]
    - Network restrictions to lock database to allowed IP ranges or VPC peers.[27]
    - Auth rate limits, especially for login/reset flows.[76]

  - Apply strict Row Level Security (RLS) for any table carrying PII.

- **PII scrubbing and logging**
  - Route external API calls through a BFF/proxy layer that:
    - Strips PII from logs before they leave the trust boundary.
    - Appends non‑identifying correlation IDs instead of raw IDs/emails.

---

## 4. Compliance & Data Governance

### 4.1 Accessibility (WCAG 2.1 / 2.2 AA)

**Regulatory deadlines**

- **ADA Title II (US State & Local Governments)**
  - Rule published April 24, 2024; requires WCAG 2.1 AA for web & mobile.[13]
  - Compliance deadlines:
    - Public entities ≥ 50,000 population: **April 24, 2026**.[77][13]
    - Smaller entities & special districts: **April 26, 2027**.[78][13]

- **HHS Section 504 (Healthcare & HHS‑funded orgs)**
  - Requires WCAG 2.1 AA for web, apps, and kiosks.[79][11]
  - Deadlines:
    - Recipients with ≥ 15 employees: **May 11, 2026**.[80][11]
    - < 15 employees: **May 10, 2027**.[81][11][79]

- **Washington State digital accessibility**
  - State agencies must meet WCAG 2.2 AA by **July 1, 2026** for state‑presented technology; WCAG 2.1 AA remains baseline under ADA Title II.[12][82][83]

**Policy: “No overlay”**

- No third‑party accessibility overlays or widgets; compliance is achieved **directly in the DOM** and via semantic HTML, ARIA, and proper UX patterns.[84]

**Operational WCAG 2.2 mapping**

New WCAG 2.2 AA criteria especially relevant for marketing flows:

| Criterion                               | Requirement (WCAG)                                                                           | Implementation Defaults                                                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **2.4.11 Focus Not Obscured (Minimum)** | Focused components must not be entirely hidden by author‑created content.[85][86]            | Use `scroll-padding-top` equal to or larger than sticky header height; ensure modals/dialogs capture focus; avoid persistent overlays that can cover focused elements.   |
| **2.5.7 Dragging Movements**            | Any drag interaction must have an alternative single‑pointer (click/tap) mechanism.[87][88]  | For carousels, sortable lists, sliders: provide buttons or input fields to perform the same actions without dragging.                                                    |
| **2.5.8 Target Size (Minimum)**         | Pointer targets at least 24×24 CSS px or sufficient spacing between smaller targets.[89][90] | Default tap targets ≥ 32×32 px; where visually smaller, expand via pseudo‑elements and ensure 24px min hit box; provide ≥ 24px spacing between adjacent inline controls. |

**Process**

- Add **accessibility checklists** to the Golden Path CLI (`pnpm create-site`) scaffolding:
  - Required ARIA patterns, keyboard navigation, reduced motion support.
  - Default focus styles that meet WCAG 2.1 1.4.11 (non‑text contrast) in addition to 2.4.11.[86][91]
- Integrate automated checks:
  - axe‑core / Playwright a11y audits in CI for critical flows.
- Require **manual testing** for:
  - Keyboard‑only nav.
  - Screen reader (NVDA/JAWS/VoiceOver) smoke tests.
  - High zoom (>200%) scenarios.

---

### 4.2 Data Sovereignty & AI Transparency

**Local‑first data**

- Use WASM Postgres (PGlite) or ElectricSQL for local state and PII where possible:[92][15][93][14]
  - For marketing forms and personalization:
    - Persist raw PII locally (IndexedDB) where legally appropriate.
    - Sync only aggregated or pseudonymized data upstream.

- ElectricSQL / PGlite stack:
  - Electric syncs subsets (“shapes”) of Postgres into local SQLite/Postgres‑WASM for reactive, offline‑friendly UX.[94][14][92]
  - PGlite provides on‑device Postgres with pgvector support, enabling local RAG indexes for on‑device AI features.[95][15][93][14]

**Automated governance**

- **DSAR automation:**
  - `packages/legal-service` should:
    - Aggregate user‑linked data across services.
    - Generate a time‑stamped, signed PDF or digital bundle for DSAR export.
    - Trigger deletion workflows according to retention policies.

- **Retention & minimization:**
  - Define per‑table retention (e.g., leads, analytics events).
  - Nightly jobs enforce deletions; logs contain anonymized aggregates only.

**AI Act transparency & model cards**

- For any **high‑risk** or material AI features (e.g., eligibility scoring, individualized pricing):
  - Maintain Model Cards that describe:
    - Intended use, limitations, training data summary, metrics, and known biases.[96][97][98]
  - Align documentation with EU AI Act requirements for transparency and technical documentation for high‑risk systems.[99][100][101]

- Implementation:
  - Store `model-card.yaml` / `model-card.md` alongside model code.
  - Generate **public‑facing disclosure pages** from these artifacts (e.g., `/ai/model-cards/<id>`).
  - Ensure disclosures:
    - Are accessible and written in plain language.
    - Clearly mark when users are interacting with AI systems, per EU AI Act transparency requirements.[100][102]

---

## 5. Developer Experience (DX) & Platform Engineering

### 5.1 CI/CD Efficiency with Turborepo & pnpm

**Goals:** Shorten feedback loops by 60–80% using change‑aware pipelines and Remote Caching.

**Practices**

- **Turborepo `--affected`**
  - Use `turbo run ... --affected` to run tasks only in packages changed vs base branch, plus their dependents.[103][104][105]
  - Configure `--affected-base` where CI uses detached HEAD (GitLab, etc.).[104]

- **Composable configuration (Turborepo 2.7+)**
  - Use `turbo.jsonc` and package‑level configs with `extends: ["//"]` to define reusable pipelines and then extend/append with `$TURBO_EXTENDS$`.[106][107]
  - Extract common pipelines:
    - `build`, `lint`, `test`, `typecheck`.
  - Maintain per‑app overrides for outputs, env, and concurrency.

- **Remote Caching**
  - Use Vercel Remote Cache (now free) for all Turborepo tasks in CI and local dev.[108][109][110][111]
  - For external CI:
    - Set `TURBO_TOKEN` and `TURBO_TEAM` env vars.[109][112]

- **pnpm filtering & deploy**
  - Use `pnpm --filter` patterns to mirror CI scoping locally (e.g., `pnpm --filter "./apps/marketing/**" test`).[31]
  - Use `pnpm --filter app-name deploy ./out` to create self‑contained deploy directories with localized virtual stores.[30]
  - Use catalogs to keep dependency versions centralized and consistent workspace‑wide.[28]

**Success metrics**

- CI total time reduced by ≥ 60% vs baseline measured prior to Turborepo adoption.[111]
- Median PR time‑to‑green < 10 minutes for typical changes.

---

### 5.2 Internal Developer Portal (IDP) & Golden Paths

**Goals:** Make “the right way” (FSD + accessibility + infra) the fastest way.

**Golden Path CLI (`pnpm create-site`)**

- Responsibilities:
  - Scaffold:
    - FSD 2.1‑aligned structure (`shared`, `entities`, `features`, `widgets`, `pages`).
    - Preconfigured Next.js 16 app with:
      - Turbopack.
      - `cacheComponents: true`.
      - React Compiler support (lint enabled by default).
      - `@vercel/otel` instrumentation stub.
    - Default compliance boilerplate:
      - Accessibility baseline components (skip links, focus outlines, generic dialog).
      - Legal pages pulling from `packages/org-assets` (privacy, terms).
    - Turborepo + pnpm wiring along with recommended `turbo.jsonc`.

- **AI‑assisted discovery**
  - Index component metadata:
    - Props, descriptions, usage notes, FSD layer, and tags.
  - Store as embeddings in a small vector index (e.g., PGlite + pgvector or a light external vector store).[15][93]
  - Expose a CLI & web UI:
    - “Find me a responsive, WCAG‑ready Hero for a product marketing page.”
    - “Show features that integrate with Supabase Auth.”

---

## 6. Analytics & “GEO” (Generative Engine Optimization)

### 6.1 Analytics: From SaaS to Self‑Hosted

**Goals:** Reduce analytics SaaS spend, improve data sovereignty, and prepare for privacy‑preserving analytics.

**Architecture**

- **ClickHouse‑backed event analytics**
  - Use ClickHouse either:
    - Directly self‑hosted; or
    - Via Tinybird (managed ClickHouse with API‑first analytics).[113][114][115][17]
  - Use Tinybird or equivalent to:
    - Turn SQL queries into authenticated REST APIs for dashboards and feature flags.[116][17][113]

- **Migration strategy**
  - Mirror tracking from current SaaS analytics into ClickHouse/Tinybird.
  - Migrate downstream reports and dashboards.
  - Decommission legacy trackers only after validation parity.

**Zero‑knowledge analytics R&D**

- Explore differential privacy and MPC‑based aggregation for highly sensitive analytics:
  - DP for aggregate reporting with noise injection; MPC/FHE for multi‑party compute where multiple tenants contribute data without revealing raw records.[117][118][119][120]
  - Scope initial experiments to:
    - High‑volume but low‑sensitivity metrics (e.g., scroll depth, generic funnel steps) with DP.
    - Potential future use of MPC for cross‑org analytics if product direction demands.

---

### 6.2 GEO & AI‑Native Discovery

**Goals:** Optimize site content and structure to be consumable and “citable” by AI systems (ChatGPT, Gemini, Perplexity, etc.).[18][121][19][122]

**Technical GEO tactics**

- **Machine‑readable endpoints**
  - Support emerging AI discovery conventions, including:
    - `/.well-known/llms.txt` or equivalent index for AI crawlers.[123][124]
    - `/.well-known/ai-context.json` describing site structure, entities, and preferred canonical URLs, even though this is not (yet) a formal standard but is used by some GEO tools.[125][124][126][127]

- **Schema‑heavy components**
  - Use JSON‑LD for:
    - `Article`, `FAQPage`, `HowTo`, `Product`, `Organization`, etc.
  - Ensure schema is:
    - Validated in CI (schema tests).
    - Versioned in a shared package and re‑used across services.[121][128][129]

- **Answer‑box‑ready content**
  - Structure pages so that key paragraphs are:
    - Self‑contained (no “as mentioned above”).[130][19]
    - BLUF (Bottom Line Up Front): first sentence directly answers the query.[131][122]
    - 40–120 words per answer block depending on question type to maximize extraction likelihood.[19][130]

---

## 7. Sustainability & Green Engineering (P2)

**Goal:** Quantify and then constrain carbon impact of builds and traffic using SCI.

**SCI‑based measurement**

- Follow the Green Software Foundation’s SCI spec:[21][132][20]
  - Establish per‑service SCI:

    \[
    \text{SCI} = \frac{(E \cdot I) + M}{R}
    \]

    where:
    - \(E\): energy consumed.
    - \(I\): region‑specific carbon intensity.
    - \(M\): embodied emissions.
    - \(R\): functional unit (e.g. per 1,000 page views).[133][20]

- Integrate SCI estimation in CI:
  - Approximate `E` using:
    - Cloud provider telemetry / cost per resource \* energy factors.
  - Use public grid carbon intensity APIs per region for `I`.
  - Use rough device LCAs for `M` where feasible.

**Carbon budgets**

- Define budgets per key path (e.g., homepage, pricing, checkout):
  - Page weight thresholds; PRs that increase weight by >10% fail or require explicit waiver.[20][21]
  - Track SCI trends over releases, not just absolute values.

---

## 8. Testing & Observability

### 8.1 Testing in a PPR & Streaming World

**Goal:** Ensure E2E tests remain stable despite streaming and PPR.

**Playwright configuration**

- Avoid `networkidle` as the main readiness mechanism, as it is explicitly discouraged and can be flaky in streaming scenarios.[134][135][136]
- Prefer:
  - Assertions on visible UI and specific locators.
  - `waitForResponse` for known API endpoints.
  - `await page.getByRole("heading", { name: /pricing/i }).isVisible()` patterns for shells.

- For PPR pages:
  - Test patterns:
    - Assert static shell content appears quickly.
    - Assert dynamic region (wrapped in Suspense) eventually resolves to the right content.
    - Use separate timeouts for shell vs. dynamic content.

---

### 8.2 Observability‑as‑Code (OaC) & CI Gating

**Goal:** Make observability configuration versioned, repeatable, and enforced in CI; fail builds on meaningful regressions.[23][137][138][24]

**Practices**

- **OaC baseline**
  - Store:
    - OpenTelemetry Collector configs.
    - Dashboards (Grafana) and alert rules.
    - SLO definitions.
  - All in Git, alongside application code.[137][24][139][140]

- **CI performance gates**
  - For each PR:
    - Deploy to ephemeral environment.
    - Run a focused performance test suite while collecting OTel traces/metrics.
    - Compare:
      - Latency distributions (p50, p95, p99) per endpoint.
      - Error rates, throughput, and key SLIs to previous baseline.[138][141][23]

  - If regression exceeds thresholds (e.g., > 5 ms increase on critical SLI, or > X% error increase):
    - Fail the pipeline, attach traces/metrics to PR as artifacts.
    - Require explicit override to merge.

---

## 9. Prioritized Roadmap

### 9.1 Priority & Timeline Summary

| Priority | Timeline          | Focus Areas                                                                                                         | Primary Success Metrics                                                                                                                                       |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0**   | Immediate–6 weeks | Next.js 16 upgrade, Remote Caching, WCAG 2.1 AA, React Compiler lint, FSD Phase 1 inventory                         | 0 ADA Title II violations; CI time ↓ ≥ 60%; complete machine identity catalog; no new FSD violations                                                          |
| **P1**   | Next 90 days      | PPR implementation for key pages, `--affected` pipelines, crypto‑agility governance, GEO baseline                   | < 100 ms TTFB for PPR’d marketing pages; CI time ↓ ≥ 80%; documented crypto change/runbooks; baseline GEO instrumentation & schema coverage                   |
| **P2**   | Q3 2026           | Hybrid PQC mTLS pilot, WCAG 2.2 AA for WA State, local‑first data pilot, Turborepo composable configs, SCI tracking | Successful pilot mTLS with ML‑DSA in defined scope; WA State WCAG 2.2 AA conformance where applicable; SCI baselines for key paths                            |
| **P3**   | 2027+             | MPC/DP analytics, Autonomous Janitor bots, full PQC migration, advanced OaC                                         | Zero long‑lived PII where not strictly required; autonomous pipelines maintaining SLO + cost/SCI targets; classical crypto fully deprecated per NIST timeline |

### 9.2 P3 “Autonomous Janitor” Direction (Forward‑Looking)

**Concept:** Lightweight agent(s) operating over the monorepo and observability data to:

- Auto‑triage flaky tests and open issues with suspected root causes.
- Auto‑close stale branches/PRs after policy windows.
- Auto‑propose:
  - Cache hints (`use cache`, `cacheLife`) for frequently accessed but stable data.
  - Accessibility fixes surfaced from a11y scanners.
  - GEO/schema improvements where schema validation fails or coverage is low.

This is intentionally later‑stage (P3); the prerequisite is solid instrumentation, clean architecture boundaries, and strong IaC/EaC discipline.

---

### Closing Note

This roadmap reflects **current** Next.js 16, React 19.2, PQC, accessibility, and AI regulatory guidance as of early 2026.[101][9][13][7][4]

Each initiative is designed to be:

- **Configurable:** driven by code and configuration, not console clicks.
- **Observable:** measurable through logs, metrics, traces, and compliance reports.
- **Reversible:** guarded by ADRs and feature flags to make experimentation safe.

The recommended execution pattern is **thin vertical slices**: pick one representative flow (e.g., marketing homepage + lead capture), run it end‑to‑end through FSD, PPR, security, a11y, analytics, and OaC practices, and then template that solution across the monorepo via the Golden Path tooling.
