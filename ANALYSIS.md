# Codebase Analysis

## Executive Summary

The `hair-salon` project is a modern, monorepo-based web application designed for a hair salon business. It utilizes **Next.js 15** (App Router) and **React 19**, managed via **pnpm workspaces** and **Turbo**. The architecture is modular, separating core UI logic and utilities into shared packages (`@repo/ui`, `@repo/utils`) while the main application (`apps/web`) adopts a feature-based folder structure.

Overall, the codebase demonstrates high-quality engineering standards with strict TypeScript configuration, centralized tooling, and a focus on component reusability. However, there are configuration mismatches (Node/pnpm versions) and technical debt (duplicate components) that require attention.

---

## 1. Architecture Overview

### Monorepo Structure

The project follows a standard Turbo monorepo layout:

- **`apps/`**: Contains deployable applications.
  - `web`: The main Next.js website.
- **`packages/`**: Shared libraries.
  - `ui`: Reusable UI components (buttons, cards, inputs) built with Tailwind CSS and Radix UI primitives (implied by class names/structure).
  - `utils`: Shared utility functions.
  - `config`: Shared configurations for ESLint, TypeScript, etc.

### Dependency Graph

- `apps/web` depends on `@repo/ui` and `@repo/utils`.
- `@repo/ui` depends on `@repo/utils`.
- All packages consume shared configurations from `packages/config`.

### Application Structure (`apps/web`)

The web application uses the **Next.js App Router** (`app/` directory) for routing and layouts.

- **`app/`**: Route definitions, layouts, and page components.
- **`features/`**: Domain-specific logic, collocated to keep the codebase scalable.
  - Examples: `services`, `blog`, `contact`, `analytics`, `search`.
  - Each feature folder typically contains:
    - `components/`: Feature-specific UI.
    - `lib/`: Business logic, hooks, or API clients.
    - `index.ts`: Public API export for the feature.
- **`lib/`**: Global utilities and actions (e.g., `actions.ts`, `env.ts`).
- **`components/`**: App-wide shared components (layout, navigation) that don't fit into a specific feature or the generic UI library.

---

## 2. Technology Stack

| Category            | Technology   | Version    | Notes                            |
| :------------------ | :----------- | :--------- | :------------------------------- |
| **Framework**       | Next.js      | 15.1.6     | App Router enabled               |
| **UI Library**      | React        | 19.0.0     | Latest RC/Stable                 |
| **Styling**         | Tailwind CSS | 3.4.17     | With `clsx` and `tailwind-merge` |
| **Language**        | TypeScript   | 5.7.2      | Strict mode enabled              |
| **Package Manager** | pnpm         | 10.29.2    | Workspaces enabled               |
| **Build System**    | Turbo        | Latest     | Caching & Pipeline               |
| **Validation**      | Zod          | 3.22.4     | Runtime schema validation        |
| **Icons**           | Lucide React | 0.344.0    |                                  |
| **Monitoring**      | Sentry       | 8.0.0      | Error tracking                   |
| **Testing**         | Jest         | Configured | Unit/Integration testing         |

---

## 3. Detailed File Inventory & Analysis

### 3.1 Root Configuration & Documentation

| File                       | Purpose                     | Key Observations                                                                                    |
| :------------------------- | :-------------------------- | :-------------------------------------------------------------------------------------------------- |
| `CONFIG.md`                | Configuration documentation | Detailed overview of tools, package structure, and key config files. Excellent onboarding resource. |
| `CONTRIBUTING.md`          | Dev workflow guide          | **Mismatch**: Claims pnpm `9.15.4` but project uses `10.29.2`. Enforces Node >=20.                  |
| `SECURITY.md`              | Security policy             | Standard template. Mentions supported versions and reporting SLA.                                   |
| `package.json`             | Root dependency manifest    | Defines workspaces, enforces pnpm/Node versions via `engines`.                                      |
| `turbo.json`               | Turbo pipeline config       | Defines `build`, `dev`, `lint` pipelines. `dev` is persistent. `build` depends on `^build`.         |
| `tsconfig.base.json`       | Shared TS config            | Target ES2022, Strict Mode enabled. Excludes build artifacts.                                       |
| `.github/workflows/ci.yml` | CI Pipeline                 | Uses Node 20.x, pnpm 10.29.2. Runs lint, type-check, build, test.                                   |
| `docker-compose.yml`       | Local Dev Env               | Defines `web` service. Pins Node 20.                                                                |

### 3.2 Shared Packages (`packages/`)

#### `@repo/ui` (`packages/ui`)

- **Purpose**: Shared UI component library.
- **Structure**: `src/components/*.tsx`.
- **Key Components**:
  - **`Button.tsx`**: Uses `forwardRef`. Variants: primary (teal), secondary (outline), text. Accessible focus rings.
  - **`Card.tsx`**: Variants for default, service (hover lift), and testimonial.
  - **`Input.tsx` / `Textarea.tsx` / `Select.tsx`**: Consistent form fields with label, error, and valid state styling. Uses `useId` for accessibility.
  - **`Accordion.tsx`**: Accessible, single-open state FAQ component.
  - **`Skeleton.tsx`**: Loading state placeholder with pulse animation.
- **Observation**:
  - **Issue**: `apps/web/components/ui/Button.tsx` duplicates this logic but with different classes (blue vs teal).

#### `@repo/utils` (`packages/utils`)

- **Purpose**: Shared utility functions.
- **Key Export**: `cn()` (classnames merge).
- **Implementation**: Combines `clsx` and `tailwind-merge`. Standard pattern for Tailwind projects.

#### `@repo/config` (`packages/config`)

- **Purpose**: Centralized linting and TS configs.
- **Key File**: `eslint-config/next.js`.
  - Extends `next/core-web-vitals` and `next/typescript`.
  - Uses Flat Config (ESLint 9) with `FlatCompat`.

### 3.3 Web App Core (`apps/web`)

#### Configuration

- **`next.config.js`**: Transpiles `@repo/ui` and `@repo/utils`. Enforces lint/TS checks during build.
- **`tailwind.config.js`**: Scans content in `app`, `components`, `features`, and `packages/ui`.
- **`middleware.ts`**: Handles CSP (Content Security Policy) and Security Headers. Adds nonces to requests.

#### Core Libraries (`apps/web/lib`)

- **`env.ts`**: **Server-only** env validation. Uses Zod. Fails fast on missing keys.
  - **Critical**: Separates `NEXT_PUBLIC_` vars from secrets.
- **`actions.ts`**: Server Actions entry point.
  - **Pattern**: Re-exports from `actions/*.ts` (modularized).
  - **Features**: Rate limiting (Upstash/Memory), Sanitization, HubSpot/Supabase sync.
- **`csp.ts`**: Content Security Policy generation.
- **`security-headers.ts`**: HTTP security headers configuration.

### 3.4 Web App Features (`apps/web/features`)

Feature-based architecture isolates domain logic.

| Feature       | Components                                | Libs                                   | Notes                                   |
| :------------ | :---------------------------------------- | :------------------------------------- | :-------------------------------------- |
| **Services**  | `ServicesOverview`, `ServiceDetailLayout` | -                                      | Displays service catalog.               |
| **Blog**      | `BlogPostContent`                         | `blog.ts`, `blog-images.ts`            | Blog post rendering and image handling. |
| **Contact**   | `ContactForm`                             | `contact-form-schema.ts`               | Form UI and Zod schema.                 |
| **Analytics** | -                                         | `analytics.ts`, `analytics-consent.ts` | Consent management and tracking logic.  |

### 3.5 Web App Routes & Components (`apps/web/app` & `components`)

#### App Router (`app/`)

- **`layout.tsx`**: Root layout. Wraps `Providers`, `Navigation`, `Footer`. Configures fonts (Inter, IBM Plex Sans).
- **`providers.tsx`**: Client-side wrapper. Contains `ErrorBoundary` and `Breadcrumbs`.
- **`page.tsx`**: Homepage. Uses Dynamic Imports for below-fold content (`SocialProof`, `FinalCTA`) to optimize LCP.
- **Structure**: Feature-based routes (e.g., `services/haircuts/page.tsx`).

#### Shared Components (`components/`)

- **`Navigation.tsx`**: Responsive header. Handles mobile menu state and Search integration.
- **`Hero.tsx`**, **`Footer.tsx`**: Standard layout components.
- **`SearchDialog.tsx`**: Search modal.
- **`ui/`**: **Warning**: Contains `Button.tsx`. Should verify if this duplicates `@repo/ui`.

### 3.6 Strategic Documentation (`.kiro/`)

The `.kiro` directory contains strategic steering documents and specifications for future enhancements.

- **`steering/`**:
  - `product.md`: Defines the "Marketing-First" vision. Target users: Salons.
  - `tech.md`: Technical constraints (Node 24 recommended, Next.js 15).
  - `structure.md`: Explains the monorepo and feature-based architecture.
- **`specs/marketing-first-enhancements/`**:
  - `requirements.md`: Detailed requirements for Social Proof, Before/After Gallery, Trust Badges, and Conversion Elements.
  - `design.md`: Technical design for implementing the requirements. Proposes new features (`testimonials`, `portfolio`, `trust-indicators`) and data flows.

---

## 4. Key Findings & Mismatches

### Critical Mismatches

1.  **Node Version**:
    - Requirements (`.kiro/steering/tech.md`) recommend **Node 24**.
    - CI and Dockerfile use **Node 20**.
    - **Action**: Align Dockerfile and CI to use Node 20 (LTS) or upgrade to 22/24 if strictly required, but Node 20 is the current safe LTS choice.
2.  **pnpm Version**:
    - `CONTRIBUTING.md` suggests `9.15.4`.
    - `package.json` pins `10.29.2`.
    - **Action**: Update `CONTRIBUTING.md` to reflect the actual used version.

### Codebase Health

- **Linting**: ESLint 9 is used, which is the latest major version (Flat Config).
- **Deprecations**:
  - Lockfile contains deprecated packages (`glob`, `inflight`).
  - Next.js 15.1.6 might have minor updates available.
- **Security**:
  - `SECURITY.md` exists but lacks specific contacts/PGP.
  - Dependencies are generally up to date.

### Architectural Observations

- **Duplicate Buttons**:
  - `apps/web/components/ui/Button.tsx`: Blue styling.
  - `packages/ui/src/components/Button.tsx`: Teal styling (Brand).
  - **Recommendation**: Delete `apps/web` version and use `@repo/ui` to enforce brand consistency.
- **Consent Model**: The current implementation is single-category, while specs call for multi-category.
- **Navigation**: References a `SearchDialog` path that might be misaligned with the feature location.

---

## 5. Roadmap & Recommendations

### Immediate Actions

1.  **Fix Version Mismatches**: Update `CONTRIBUTING.md` and standardise on Node 20 (LTS) across docs and CI.
2.  **Consolidate UI Components**: Audit `apps/web/components/ui` and migrate reusable components to `packages/ui`.
3.  **Address Deprecations**: Run `pnpm audit` and upgrade deprecated transitive dependencies where possible.

### Strategic Improvements

1.  **Marketing Enhancements Implementation**:
    - Execute the plan in `.kiro/specs/marketing-first-enhancements/design.md`.
    - Create new features: `testimonials`, `portfolio`, `trust-indicators`.
2.  **Enhanced Testing**:
    - Ensure `apps/web/features` have dedicated test suites.
    - Add E2E testing (e.g., Playwright) to cover critical user flows (Booking, Contact).
3.  **Documentation**:
    - Generate a Storybook for `@repo/ui` to visualize components.
    - Add `README.md` files inside each `packages/*` and `features/*` directory to explain specific domain logic.
