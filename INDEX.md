# Repository Index

> **Purpose:** Multi-tenant, multi-site Next.js 16 marketing platform with Feature-Sliced Design v2.1
> **Stack:** Next.js 16, React 19, TypeScript 5.9.3, pnpm, Turborepo, Supabase, Tailwind CSS v4
> **Last Indexed:** 2026-02-26
> **Indexing Agent:** Windsurf

---

## Table of Contents

- [1. Repository Overview](#1-repository-overview)
- [2. Source Code](#2-source-code)
- [3. Documentation](#3-documentation)
- [4. Configuration & Tooling](#4-configuration--tooling)
- [5. Tests](#5-tests)
- [6. Scripts & Automation](#6-scripts--automation)
- [7. Assets & Static Files](#7-assets--static-files)
- [8. Dependency Map](#8-dependency-map)
- [9. Known Issues / Stubs / TODOs](#9-known-issues--stubs--todos)
- [10. Agent Context Notes](#10-agent-context-notes)

---

## 1. Repository Overview

### Architecture Pattern

**Feature-Sliced Design (FSD) v2.1** with multi-tenant SaaS architecture. Strict layer isolation: app → pages → widgets → features → entities → shared.

### High-Level Folder Map

```
marketing-websites/
├── apps/                    # Next.js applications (admin, portal, web)
├── packages/               # Shared libraries organized by FSD layers
├── clients/                # Tenant-specific site configurations
├── docs/                   # Comprehensive documentation suite
├── scripts/                # Automation and CLI tools
├── tooling/                # Development tooling and generators
├── agents/                 # AI agent orchestration system
├── mcp/                    # Model Context Protocol integration
├── e2e/                    # End-to-end test suite
├── database/               # Database migrations and policies
└── sites/                  # Site templates and configurations
```

### Key Entry Points

- **Main App**: `apps/web/app/page.tsx` - Marketing website template
- **Admin Portal**: `apps/admin/app/page.tsx` - Administrative dashboard
- **Client Portal**: `apps/portal/app/page.tsx` - Client management interface
- **Package Entry**: `packages/ui/src/index.ts` - UI component library
- **Feature Entry**: `packages/features/src/index.ts` - Business logic exports

---

## 2. Source Code

### Applications (`apps/`)

| Path                                                   | Purpose                         | Exports / Key Symbols | Status |
| ------------------------------------------------------ | ------------------------------- | --------------------- | ------ |
| [apps/web/app/page.tsx](./apps/web/app/page.tsx)       | Main marketing website template | HomePage component    | Active |
| [apps/admin/app/page.tsx](./apps/admin/app/page.tsx)   | Administrative dashboard        | AdminDashboard        | Active |
| [apps/portal/app/page.tsx](./apps/portal/app/page.tsx) | Client management interface     | ClientPortal          | Active |

### UI Components (`packages/ui/`)

| Path                                                                                             | Purpose                     | Exports / Key Symbols                | Status |
| ------------------------------------------------------------------------------------------------ | --------------------------- | ------------------------------------ | ------ |
| [packages/ui/src/index.ts](./packages/ui/src/index.ts)                                           | UI component barrel exports | ButtonEnhanced, ErrorBoundary, Toast | Active |
| [packages/ui/src/components/ButtonEnhanced.tsx](./packages/ui/src/components/ButtonEnhanced.tsx) | Enhanced button component   | ButtonEnhanced                       | Active |
| [packages/ui/src/components/ErrorBoundary.tsx](./packages/ui/src/components/ErrorBoundary.tsx)   | Error boundary components   | ErrorBoundary, EnhancedErrorBoundary | Active |

### Features (`packages/features/`)

| Path                                                               | Purpose                 | Exports / Key Symbols         | Status |
| ------------------------------------------------------------------ | ----------------------- | ----------------------------- | ------ |
| [packages/features/src/index.ts](./packages/features/src/index.ts) | Feature barrel exports  | auth, blog, business, content | Active |
| [packages/features/src/auth/](./packages/features/src/auth/)       | Authentication features | AuthComponents, AuthActions   | Active |
| [packages/features/src/blog/](./packages/features/src/blog/)       | Blog functionality      | BlogComponents, BlogActions   | Active |

### Infrastructure (`packages/infrastructure/`)

| Path                                                                             | Purpose                       | Exports / Key Symbols       | Status |
| -------------------------------------------------------------------------------- | ----------------------------- | --------------------------- | ------ |
| [packages/infrastructure/src/index.ts](./packages/infrastructure/src/index.ts)   | Infrastructure barrel exports | auth, security, monitoring  | Active |
| [packages/infrastructure/src/auth/](./packages/infrastructure/src/auth/)         | Authentication utilities      | authHelpers, authMiddleware | Active |
| [packages/infrastructure/src/security/](./packages/infrastructure/src/security/) | Security utilities            | rateLimit, encryption       | Active |

### Integrations (`packages/integrations/`)

| Path                                                                                             | Purpose                    | Exports / Key Symbols       | Status |
| ------------------------------------------------------------------------------------------------ | -------------------------- | --------------------------- | ------ |
| [packages/integrations/convertkit/src/index.ts](./packages/integrations/convertkit/src/index.ts) | ConvertKit email marketing | ConvertKitClient, subscribe | Active |
| [packages/integrations/supabase/src/index.ts](./packages/integrations/supabase/src/index.ts)     | Supabase database client   | SupabaseClient, dbHelpers   | Active |
| [packages/integrations/analytics/src/index.ts](./packages/integrations/analytics/src/index.ts)   | Analytics integration      | AnalyticsClient, trackEvent | Active |

### AI Agent System (`agents/`)

| Path                                                                     | Purpose                  | Exports / Key Symbols           | Status |
| ------------------------------------------------------------------------ | ------------------------ | ------------------------------- | ------ |
| [agents/core/src/index.ts](./agents/core/src/index.ts)                   | Core agent functionality | AgentCore, AgentContext         | Active |
| [agents/orchestration/src/index.ts](./agents/orchestration/src/index.ts) | Agent orchestration      | Orchestrator, WorkflowManager   | Active |
| [agents/governance/src/index.ts](./agents/governance/src/index.ts)       | Agent governance         | GovernanceEngine, PolicyManager | Active |

---

## 3. Documentation

### Core Documentation

| Path                                 | Topic                                   | Audience               | Status |
| ------------------------------------ | --------------------------------------- | ---------------------- | ------ |
| [README.md](./README.md)             | Repository overview and getting started | Developers, Architects | Active |
| [AGENTS.md](./AGENTS.md)             | AI agent context and rules              | AI Agents, Developers  | Active |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines                 | Contributors           | Active |
| [SECURITY.md](./SECURITY.md)         | Security policies and reporting         | Security Team          | Active |

### Guides (`docs/guides/`)

| Path                                                       | Topic                            | Audience      | Status |
| ---------------------------------------------------------- | -------------------------------- | ------------- | ------ |
| [docs/guides/](./docs/guides/)                             | Comprehensive technical guides   | Developers    | Active |
| [docs/guides/observability/](./docs/guides/observability/) | Observability and monitoring     | DevOps, SRE   | Active |
| [docs/guides/security/](./docs/guides/security/)           | Security implementation patterns | Security Team | Active |

### API Documentation

| Path                                                                                                     | Topic                      | Audience   | Status |
| -------------------------------------------------------------------------------------------------------- | -------------------------- | ---------- | ------ |
| [packages/integrations/convertkit-documentation.md](./packages/integrations/convertkit-documentation.md) | ConvertKit API integration | Developers | Active |
| [packages/integrations/supabase-documentation.md](./packages/integrations/supabase-documentation.md)     | Supabase database patterns | Developers | Active |

---

## 4. Configuration & Tooling

### Build Configuration

| File                                         | Tool      | What It Controls                    | Notes                |
| -------------------------------------------- | --------- | ----------------------------------- | -------------------- |
| [turbo.json](./turbo.json)                   | Turborepo | Build pipeline and caching          | Remote cache enabled |
| [package.json](./package.json)               | pnpm      | Workspace configuration and scripts | 43 workspaces        |
| [pnpm-workspace.yaml](./pnpm-workspace.yaml) | pnpm      | Workspace catalog and dependencies  | Strict mode enabled  |

### Development Tools

| File                                       | Tool       | What It Controls              | Notes            |
| ------------------------------------------ | ---------- | ----------------------------- | ---------------- |
| [tsconfig.base.json](./tsconfig.base.json) | TypeScript | Base TypeScript configuration | Strict mode      |
| [.eslintrc.json](./.eslintrc.json)         | ESLint     | Code linting rules            | FSD compliance   |
| [prettier.config.js](./prettier.config.js) | Prettier   | Code formatting               | Consistent style |

### CI/CD Configuration

| File                                       | Tool           | What It Controls        | Notes             |
| ------------------------------------------ | -------------- | ----------------------- | ----------------- |
| [.github/workflows/](./.github/workflows/) | GitHub Actions | CI/CD pipeline          | Automated testing |
| [docker-compose.yml](./docker-compose.yml) | Docker         | Development environment | Local development |

---

## 5. Tests

### Unit Tests

| Path                                                                           | Type | What It Covers        | Status |
| ------------------------------------------------------------------------------ | ---- | --------------------- | ------ |
| [packages/ui/src/**tests**/](./packages/ui/src/__tests__/)                     | Unit | UI component testing  | Active |
| [packages/features/src/**tests**/](./packages/features/src/__tests__/)         | Unit | Feature logic testing | Active |
| [packages/integrations/src/**tests**/](./packages/integrations/src/__tests__/) | Unit | Integration testing   | Active |

### End-to-End Tests

| Path                                                         | Type | What It Covers               | Status |
| ------------------------------------------------------------ | ---- | ---------------------------- | ------ |
| [e2e/tests/](./e2e/tests/)                                   | E2E  | Full application flows       | Active |
| [e2e/tests/auth.spec.ts](./e2e/tests/auth.spec.ts)           | E2E  | Authentication flows         | Active |
| [e2e/tests/marketing.spec.ts](./e2e/tests/marketing.spec.ts) | E2E  | Marketing site functionality | Active |

### Integration Tests

| Path                                       | Type        | What It Covers            | Status |
| ------------------------------------------ | ----------- | ------------------------- | ------ |
| [tests/integration/](./tests/integration/) | Integration | Cross-package integration | Active |
| [tests/unit/](./tests/unit/)               | Unit        | Isolated unit tests       | Active |

---

## 6. Scripts & Automation

### Development Scripts

| Script            | Trigger    | What It Does                    |
| ----------------- | ---------- | ------------------------------- |
| `pnpm dev`        | Manual     | Start development servers       |
| `pnpm build`      | CI/CD      | Build all packages              |
| `pnpm lint`       | Pre-commit | Run linting across all packages |
| `pnpm type-check` | Pre-commit | TypeScript type checking        |

### Automation Scripts (`scripts/`)

| Script                                                       | Trigger    | What It Does                |
| ------------------------------------------------------------ | ---------- | --------------------------- |
| [scripts/type-check-all.js](./scripts/type-check-all.js)     | CI/CD      | Type check all packages     |
| [scripts/validate-exports.js](./scripts/validate-exports.js) | Pre-commit | Validate package exports    |
| [scripts/code-health.ts](./scripts/code-health.ts)           | Manual     | Code health analysis        |
| [scripts/security-audit.js](./scripts/security-audit.js)     | CI/CD      | Security vulnerability scan |

### Generation Tools

| Script                                             | Trigger | What It Does                      |
| -------------------------------------------------- | ------- | --------------------------------- |
| [tooling/create-site/](./tooling/create-site/)     | Manual  | Generate new site template        |
| [tooling/create-client/](./tooling/create-client/) | Manual  | Generate new client configuration |
| [tooling/fsd-cli/](./tooling/fsd-cli/)             | Manual  | Generate FSD components           |

---

## 7. Assets & Static Files

### Static Assets

| Path                                         | Type         | Usage                        |
| -------------------------------------------- | ------------ | ---------------------------- |
| [apps/web/public/](./apps/web/public/)       | Static files | Public assets for web app    |
| [apps/admin/public/](./apps/admin/public/)   | Static files | Public assets for admin app  |
| [apps/portal/public/](./apps/portal/public/) | Static files | Public assets for portal app |

### Configuration Files

| Path                                       | Type        | Usage                         |
| ------------------------------------------ | ----------- | ----------------------------- |
| [.env.template](./.env.template)           | Environment | Environment variable template |
| [tailwind.config.ts](./tailwind.config.ts) | Styling     | Tailwind CSS configuration    |

---

## 8. Dependency Map

### External Packages

- **UI Framework**: React 19.0.0, Next.js 16.1.5
- **Styling**: Tailwind CSS v4.1.0, Radix UI 1.0.0
- **Type Safety**: TypeScript 5.9.3, Zod 3.25.76
- **Testing**: Vitest 4.0.18, Playwright 1.58.2
- **Database**: Supabase 2.97.0
- **Authentication**: jose 5.10.0
- **Build Tools**: Turbo 2.4.0, pnpm 10.29.2

### Internal Workspace Packages

- **@repo/ui**: UI component library
- **@repo/features**: Business logic features
- **@repo/infrastructure**: Infrastructure utilities
- **@repo/integrations**: Third-party integrations
- **@repo/config**: Configuration schemas
- **@repo/types**: Shared TypeScript types

---

## 9. Known Issues / Stubs / TODOs

| File                                                   | Issue                         | Priority |
| ------------------------------------------------------ | ----------------------------- | -------- |
| [TODO.md](./TODO.md)                                   | Task tracking and roadmap     | High     |
| [packages/ui-primitives/](./packages/ui-primitives/)   | Minimal UI primitives package | Medium   |
| [packages/security-tests/](./packages/security-tests/) | Security testing utilities    | Medium   |

---

## 10. Agent Context Notes

### Architectural Rules

- **FSD Layer Isolation**: Strict separation between app → pages → widgets → features → entities → shared
- **Server Components First**: Use Server Components by default, Client Components only for interactivity
- **Multi-Tenant Security**: All database operations must include tenant_id clause
- **TypeScript Strict**: No `any` types, explicit return types required
- **Zod Validation**: All schema validation must use Zod

### Naming Conventions

- **Components**: PascalCase with descriptive names (e.g., `ButtonEnhanced`, `ErrorBoundary`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Packages**: @repo/\* prefix for internal packages
- **Environment**: NEXT*PUBLIC*\* for client-side, server-only for backend

### Import Patterns

- **Absolute Imports**: Use @repo/\* aliases for cross-package imports
- **FSD Compliance**: Import only from lower layers (features can import from entities/shared)
- **Server/Client Separation**: Use `import type` for type-only imports

### Security Requirements

- **Tenant Isolation**: Every database query must include tenant context
- **Input Validation**: All user inputs validated with Zod schemas
- **Authentication**: OAuth 2.1 with PKCE required
- **Error Handling**: Generic error messages to prevent enumeration

### Performance Standards

- **Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1
- **Bundle Size**: JS < 250KB gzipped
- **Server Components**: Use for static content, streaming for dynamic
- **Caching**: Implement proper cache strategies with revalidation
