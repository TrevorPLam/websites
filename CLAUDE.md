# CLAUDE.md — AI Assistant Guide for marketing-websites

This file provides context for AI assistants (Claude Code and others) working in this repository.

**Last Updated:** 2026-02-18

---

## Repository Overview

**marketing-websites** is a **pnpm monorepo** for building multi-industry marketing websites. It uses a configuration-as-code (CaCA) architecture where a single `site.config.ts` drives all client-site behavior — theming, page composition, feature flags, SEO schema, and integrations.

- **Current phase:** Wave 0 complete → Wave 1 in progress
- **Starter template:** `clients/starter-template` (package `@clients/starter-template`, port 3101)
- **Package manager:** pnpm 10.29.2 (strictly enforced via `packageManager` field)
- **Node.js:** >=22.0.0 (enforced via `engines`)

---

## Key Commands

### Root-level (run from `/home/user/websites`)

```bash
pnpm install               # Install all workspace dependencies
pnpm build                 # Build all packages (via Turbo)
pnpm dev                   # Start all dev servers (via Turbo)
pnpm lint                  # ESLint across workspace
pnpm type-check            # TypeScript type checking
pnpm test                  # Jest tests (all packages, --maxWorkers=50%)
pnpm test:coverage         # Jest with coverage report
pnpm format                # Prettier write
pnpm format:check          # Prettier check (no writes)
pnpm validate-exports      # Validate package.json export maps
pnpm validate-ui-exports   # Validate @repo/ui index.ts → component files exist
pnpm validate-marketing-exports   # Validate @repo/marketing-components index.ts → families exist
pnpm validate-client [path]      # Validate single client (CaCA contract; e.g. clients/luxe-salon)
pnpm validate-all-clients         # Validate all clients in clients/ (runs in CI)
pnpm validate-docs         # Validate documentation
pnpm knip                  # Dead code / unused dependency detection
pnpm syncpack:check        # Check for cross-workspace version drift
pnpm syncpack:fix          # Auto-fix version drift
```

### Targeting specific packages

```bash
pnpm --filter @clients/starter-template dev     # Starter template dev server (port 3101)
pnpm --filter @clients/starter-template build   # Build starter template
pnpm --filter @repo/ui lint               # Lint UI package only
pnpm --filter "@clients/*" build          # Build all clients
```

### Bundle analysis

```bash
ANALYZE=true pnpm --filter @clients/starter-template build
```

---

## Monorepo Structure

```
marketing-websites/
├── clients/                 # Client projects
│   └── starter-template/    # Golden-path template — @clients/starter-template, port 3101
│       ├── app/             # Next.js App Router (layout.tsx, page.tsx, route dirs)
│       ├── components/      # Client-local components
│       ├── site.config.ts   # THE central config — drives everything
│       ├── next.config.js   # Next.js config (standalone output)
│       └── Dockerfile       # Production container
│
├── packages/
│   ├── infra/               # @repo/infra — L0: security, middleware, logging, env schemas
│   ├── ui/                  # @repo/ui   — L2: React UI primitives (Button, Card, Dialog…)
│   ├── features/            # @repo/features — L2: domain feature modules
│   ├── types/               # @repo/types — shared TypeScript types/interfaces
│   ├── utils/               # @repo/utils — utility functions (cn, etc.)
│   ├── page-templates/      # @repo/page-templates — L3 page layouts (section registry)
│   ├── integrations/
│   │   ├── analytics/       # @repo/integrations-analytics
│   │   ├── hubspot/         # @repo/integrations-hubspot
│   │   ├── supabase/        # @repo/integrations-supabase
│   │   ├── scheduling/      # @repo/integrations-scheduling (Calendly, Acuity, Cal.com)
│   │   ├── email/           # @repo/integrations-* (Mailchimp, SendGrid, ConvertKit)
│   │   ├── chat/            # @repo/integrations-chat (Intercom, Crisp, Tidio)
│   │   ├── reviews/        # @repo/integrations-reviews (Google, Yelp, Trustpilot)
│   │   └── maps/            # @repo/integrations-maps (Google Maps static + interactive)
│   ├── industry-schemas/   # @repo/industry-schemas — JSON-LD per industry (limit 12)
│   └── config/
│       ├── eslint-config/   # @repo/eslint-config
│       ├── typescript-config/ # @repo/typescript-config
│       └── tailwind-preset.js / tailwind-theme.css
│
├── docs/                    # Documentation hub (architecture, tutorials, ADRs, etc.)
├── scripts/                 # Utility scripts (validate-workspaces, validate-exports…)
├── .github/workflows/       # CI: ci.yml (quality-gates), nightly, release, etc.
├── turbo.json               # Turborepo pipeline config
├── pnpm-workspace.yaml      # Workspace globs + version catalog
├── jest.config.js           # Root Jest config (projects: node + jsdom environments)
├── tsconfig.base.json       # Base TypeScript config extended by all packages
└── package.json             # Root scripts, devDependencies, packageManager
```

---

## Architecture & Dependency Rules

### Layer model (current layers only)

| Layer               | Packages                                                   | Status           |
| ------------------- | ---------------------------------------------------------- | ---------------- |
| L0 — Infrastructure | `@repo/infra`, `@repo/integrations-*`                      | Complete         |
| L2 — Components     | `@repo/ui`, `@repo/features`, `@repo/types`, `@repo/utils` | Partial          |
| L3 — Experience     | `clients/*` (e.g. starter-template, luxe-salon)            | Multiple clients |

### Allowed dependency direction

- **clients/** → `@repo/*` packages — OK via public package exports
- **@repo/features** → `@repo/ui`, `@repo/utils`, `@repo/types`, `@repo/infra` — OK
- **@repo/ui** → `@repo/utils`, `@repo/types` — OK
- **packages/** → **clients/** — **NEVER**
- **clients/A** → **clients/B** — **NEVER** (cross-client isolation)
- Deep imports like `@repo/infra/src/internal` — **NEVER** (use public export paths only)

### Version catalog

Central versions live in `pnpm-workspace.yaml` under `catalog:`. Always use `catalog:` instead of pinning versions directly when a catalog entry exists (Next.js, React, TypeScript, Zod, ESLint, Sentry, etc.).

---

## Technology Stack

| Category            | Technology           | Version              |
| ------------------- | -------------------- | -------------------- |
| Framework           | Next.js (App Router) | 16.1.5               |
| UI                  | React                | 19.0.0               |
| Styling             | Tailwind CSS         | 4.1.0                |
| Language            | TypeScript           | 5.9.3                |
| Build orchestration | Turborepo            | 2.8.9                |
| Package manager     | pnpm                 | 10.29.2              |
| Linting             | ESLint               | 9.18.0 (flat config) |
| Formatting          | Prettier             | 3.8.1                |
| Testing             | Jest                 | 30.2.0               |
| Error tracking      | Sentry               | 10.38.0              |
| DB/auth             | Supabase             | —                    |
| UI primitives       | Radix UI             | 1.0.0                |
| Icons               | Lucide React         | 0.344.0              |
| Toasts              | Sonner               | 2.0.7                |

---

## Code Conventions

### TypeScript

- **Strict mode** is on. No `any`. All compiler flags in `tsconfig.base.json`:
  - `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`
- Target: `ES2022`, module resolution: `bundler`
- Every package extends `@repo/typescript-config` or `tsconfig.base.json`

### React

- **Functional components with hooks only** — no class components
- React 19 — use Server Components where possible in templates
- `@repo/ui` declares React as `peerDependencies`, never direct dependencies

### Styling

- Tailwind CSS 4 utility classes
- `cn()` from `@repo/utils` for conditional class merging (wraps `clsx` + `tailwind-merge`)
- Theme colors defined in `site.config.ts` → injected via `ThemeInjector` from `@repo/ui`
- Colors use HSL format without `hsl()` wrapper: `"174 100% 26%"`

### ESLint

- ESLint 9 **flat config** format (`.eslintrc.*` is NOT used — use `eslint.config.mjs`)
- Packages with `eslint.config.mjs`: `ui`, `infra`, `features`, `utils`. Many others (integrations, ai-platform, tooling, etc.) lack it and fail lint.
- Run via Turbo: `pnpm lint` or per-package `pnpm --filter @repo/ui lint`

### Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### Imports

- Use package public exports — never deep internal paths:
  ```ts
  // OK
  import { Button } from '@repo/ui';
  import { cn } from '@repo/utils';
  // NOT OK
  import { Button } from '@repo/ui/src/components/Button';
  ```
- Internal workspace packages use `workspace:*` in `package.json`
- Client-local aliases: each client's `@/` maps to its own root (e.g. `clients/starter-template/`)

### File headers

Source files use a structured comment block at the top documenting purpose, exports, dependencies, and invariants. Follow this pattern when adding new files to packages.

---

## Testing

### Test environments

Jest uses two projects (defined in root `jest.config.js`):

| Environment | Used for                                      | Test patterns                                                           |
| ----------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| `node`      | Server utilities, infra, server actions, lib/ | `packages/utils/**`, `packages/infra/**`, `packages/features/**/lib/**` |
| `jsdom`     | React components, UI primitives               | `packages/ui/**`, `packages/features/**/components/**`                  |

### Running tests

```bash
pnpm test                  # All tests
pnpm test:watch            # Watch mode
pnpm test:coverage         # With coverage
pnpm --filter @repo/ui test   # Package-level
```

### Test file location

- Unit tests: `__tests__/` subdirectory next to the code being tested, or co-located as `*.test.ts`
- Test naming: `ComponentName.test.tsx` or `functionName.test.ts`

### Module aliases in tests

Jest `moduleNameMapper` resolves `@repo/*` to actual source files. No need to build packages before running tests.

### UI component tests and jsdom

- **Component tests:** `packages/ui/src/components/__tests__/` — Button, Dialog, Input, Label, Slider, Alert, Checkbox (and more as added). Use `@testing-library/react`, `jest-axe` for a11y, `userEvent` for interactions.
- **ResizeObserver:** Root `jest.setup.js` defines a minimal `ResizeObserver` polyfill for jsdom so Radix-based components (e.g. Slider) run without `ResizeObserver is not defined`.

---

## Environment Variables

All environment variables are optional for local development — the app runs with sensible defaults.

Copy `.env.example` to `.env.local` in the client directory:

```bash
cp .env.example clients/starter-template/.env.local
```

Key variables (all optional locally):

| Variable                                              | Description                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                | Public site URL (default: `http://localhost:3101` for starter-template) |
| `NEXT_PUBLIC_SENTRY_DSN`                              | Sentry error tracking DSN                                               |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`          | Must be set together (pair)                                             |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Rate limiting (pair; falls back to in-memory)                           |
| `HUBSPOT_PRIVATE_APP_TOKEN`                           | CRM integration                                                         |
| `MINDBODY_API_KEY` + `MINDBODY_BUSINESS_ID`           | Booking provider (pair)                                                 |

Environment schemas are defined in `packages/infra/env/schemas/*.ts`.

---

## `site.config.ts` — Configuration-as-Code

The `site.config.ts` file in each template/client root is the **single source of truth** for all site behavior. It is typed by `SiteConfig` from `@repo/types`.

Key sections:

- `features` — toggle/configure page sections (hero layout, services grid, booking, blog…)
- `integrations` — analytics, CRM, booking, email, chat provider selections
- `navLinks` / `footer` — navigation structure
- `contact` — business info, hours
- `seo` — title template, OG image, schema type
- `theme` — color palette (HSL), fonts, border radius, shadows
- `conversionFlow` — booking service categories and time slots

When creating a new client, copy the template and update `site.config.ts` — no code changes should be needed for basic customization.

---

## Adding New Packages

1. Create `packages/your-package/` directory
2. Create `package.json` with name `@repo/your-package`
3. The `packages/*` glob in `pnpm-workspace.yaml` auto-includes it
4. Create `tsconfig.json` extending `@repo/typescript-config` or `tsconfig.base.json`
5. Export from `src/index.ts` (main entry point)
6. Add `eslint.config.mjs` extending `@repo/eslint-config`
7. Declare `react` as `peerDependencies` if the package uses React (not direct)

---

## Adding New Templates / Clients

```bash
# Copy the starter-template as a starting point
cp -r clients/starter-template clients/my-client

# Update package name in package.json
# Update site.config.ts with client-specific settings
# Copy and fill in environment variables
cp .env.example clients/my-client/.env.local

# Install (from root — clients/ glob already in pnpm-workspace.yaml)
pnpm install

# Run on a unique port
pnpm --filter @clients/my-client dev -- --port 3001
```

Client package names use the format `@clients/my-client`.

---

## CI / Quality Gates

CI is defined in `.github/workflows/ci.yml`. Two jobs run on push to `main`/`develop` and on all PRs:

### `quality-gates` (blocking — must pass for merge)

1. `pnpm lint` — ESLint (PR: affected packages only via `--filter="...[origin/main]"`) — _many packages lack eslint.config.mjs_
2. `pnpm type-check` — TypeScript — _fails in @repo/marketing-components_
3. `pnpm validate-exports` — Package export map validation
4. `pnpm madge:circular` — Circular dependency detection
5. `pnpm syncpack:check` — Dependency version consistency
6. `pnpm build` — Full build — _fails due to Toast.tsx type errors_
7. `pnpm test:coverage` — Jest test suite — _4 booking-actions tests fail_

**Known issues:** Previously documented in [docs/archive/ISSUES.md](docs/archive/ISSUES.md) (archived); refer to CI output and current codebase state.

### `quality-audit` (non-blocking, informative)

- `pnpm knip` — Dead code detection
- SBOM generation (Anchore)
- `pnpm audit` — Dependency vulnerability scan

### Turbo optimization

On PRs, Turbo uses `--filter="...[origin/main]"` to run only affected packages. On push to main, the full pipeline runs.

---

## Changesets (Versioning)

This repo uses `@changesets/cli` for versioning and releases.

```bash
pnpm changeset              # Create a changeset (interactive)
pnpm version-packages       # Apply changesets → bump versions
pnpm release                # Publish packages
```

Config in `.changeset/config.json` — base branch is `main`.

---

## Docker

```bash
docker-compose up -d        # Start starter-template on http://localhost:3101
docker-compose logs -f
docker-compose down
```

The Dockerfile uses `output: 'standalone'` (Next.js) for minimal image size. Containers run as non-root `nextjs` user. Health check at `/api/health`.

For production: copy `.env.production.local.example` to `.env.production.local` and fill in secrets before building.

---

## Documentation Standards

All markdown files in `docs/` use a structured HTML comment header with `@file`, `@role`, `@summary`, `@invariants`, `@gotchas`, `@verification`, and `@status` fields. Validate documentation with:

```bash
pnpm validate-docs           # Standard validation
pnpm validate-docs:strict    # Strict mode
```

Key docs:

- `docs/architecture/README.md` — Layer model and design principles
- `docs/architecture/module-boundaries.md` — Allowed dependency directions
- `docs/getting-started/onboarding.md` — Developer setup guide
- `docs/archive/ISSUES.md` — Archived codebase analysis (historical)
- `TODO.md` — Research update tasks
- `TASKS.md` — Implementation backlog (if present)
- `THEGOAL.md` — Vision and roadmap
- `CONTRIBUTING.md` — Contribution workflow

---

## Common Pitfalls

- **pnpm version is strictly enforced.** Use exactly `pnpm@10.29.2`. Running with a different version will fail.
- **Do not import deep internal package paths.** Always use the package's public export (e.g., `@repo/infra`, not `@repo/infra/src/security/csp`).
- **Cross-template imports are forbidden.** Templates are isolated — never import from another template.
- **`@repo/ui` does not include React as a direct dependency** — it uses `peerDependencies`. Apps provide React.
- **`noUncheckedIndexedAccess` is enabled.** Array/object index access returns `T | undefined` — handle it.
- **Server-only modules in `@repo/infra`.** The package uses `server-only`. Client-safe exports live in `index.client.ts`.
- **Starter-template dev port is 3101.** Each client uses a unique port (e.g. luxe-salon: 3102).
- **Paired environment variables.** Supabase, Upstash Redis, and booking providers require both variables in a pair or neither.
- **TypeScript build errors block CI.** `typescript.ignoreBuildErrors: false` is set in `next.config.js`.
- **Workspace sync.** `package.json` workspaces must match `pnpm-workspace.yaml` (run `pnpm validate:workspaces`). Currently out of sync.
