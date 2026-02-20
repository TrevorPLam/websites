# AI Context Map

This semantic index maps concepts to files for AI discoverability in the marketing-websites repository.

## Core Architecture

**Configuration-as-Code Architecture (CaCA)**

- Concept: Single config drives client behavior
- Files: `clients/*/site.config.ts`, `packages/types/src/config.ts`
- Docs: `docs/architecture/README.md`, `ARCHITECTURE.md`

**Layered Architecture**

- Concept: 7-layer system design
- Files: Repository structure visualization
- Docs: `docs/architecture/README.md`, `docs/architecture/module-boundaries.md`

**Multi-Tenancy**

- Concept: Single codebase, multiple clients
- Files: `clients/` directory structure
- Docs: `docs/architecture/README.md`

**Evolution Roadmap (Strangler Fig)**

- Concept: 26-week organic evolution toward capability-driven platform
- Files: `NEW.md`, `docs/architecture/evolution-roadmap.md`, `THEPLAN.md`
- Phases: Foundation (1-4) → Data Contracts (5-10) → Capability Core (11-16) → Universal Renderer (17-22) → Platform Convergence (23-26)

**Capability Registry**

- Concept: Self-declaring features; provides sections, integrations, dataContracts
- Files: `packages/infra/features` (Phase 3), `defineFeature`
- Docs: NEW.md Phase 3

**Canonical Types**

- Concept: Zod schemas + adapters; integration-swappable types
- Files: `packages/types/src/canonical/`
- Docs: ADR-012

**Universal Renderer**

- Concept: Opt-in renderer for new clients; capability-based composition
- Files: `packages/page-templates/src/universal-renderer.tsx`
- Docs: NEW.md Phase 4

**Legacy Bridge**

- Concept: Classic config → capability system; migrateLegacyConfig, ClassicPage
- Files: `packages/infra/features/src/legacy-bridge.ts`
- Docs: NEW.md Phase 5

## Package System

**UI Components (@repo/ui)**

- Concept: Atomic design system
- Files: `packages/ui/src/components/`
- Tests: `packages/ui/src/components/__tests__/`
- Docs: `packages/ui/README.md`

**Feature Modules (@repo/features)**

- Concept: Business logic extraction
- Files: `packages/features/src/booking/`, `packages/features/src/contact/`
- Tests: `packages/features/src/*/lib/__tests__/`
- Docs: Feature-specific README files

**Type Definitions (@repo/types)**

- Concept: Shared TypeScript interfaces
- Files: `packages/types/src/`
- Docs: `packages/types/README.md`

**Infrastructure (@repo/infra)**

- Concept: Security, middleware, logging
- Files: `packages/infra/src/`
- Tests: `packages/infra/src/__tests__/`
- Docs: `packages/infra/README.md`

## Client Implementation

**Starter Template**

- Concept: Golden path for new clients
- Files: `clients/starter-template/`
- Config: `clients/starter-template/site.config.ts`
- Docs: `clients/README.md`

**Industry Examples**

- Concept: Domain-specific implementations
- Files: `clients/luxe-salon/`, `clients/bistro-central/`, `clients/chen-law/`
- Config: Each `site.config.ts`

## Development Workflow

**Package Management**

- Concept: pnpm workspace monorepo
- Files: `pnpm-workspace.yaml`, `package.json`
- Scripts: Root `package.json` scripts

**Build System**

- Concept: Turborepo orchestration
- Files: `turbo.json`, `package.json` build scripts
- Docs: `DEVELOPMENT.md`

**Code Quality**

- Concept: ESLint, Prettier, TypeScript strict
- Files: `.eslintrc.json`, `prettier.config.js`, `tsconfig.json`
- Scripts: `pnpm lint`, `pnpm type-check`, `pnpm format`

## Testing Strategy

**Unit Testing**

- Concept: Jest, Testing Library
- Files: `**/__tests__/*.test.ts`, `**/__tests__/*.test.tsx`
- Config: `jest.config.js`
- Docs: `TESTING.md`, `docs/testing-strategy.md`

**Accessibility Testing**

- Concept: jest-axe integration
- Files: UI component tests with axe-core
- Docs: `docs/testing-strategy.md`

**Coverage**

- Concept: Coverage targets and reporting
- Files: `coverage/` directory output
- Config: Jest coverage settings

## Documentation Standards

**2026 Documentation Standard**

- Concept: Extended tier compliance
- Files: `repo-config.yml`, `TODO.md`
- Docs: `docs/archive/docs-standard-v2.md` (archived spec)

**Diátaxis Framework**

- Concept: Tutorial, How-to, Reference, Explanation
- Files: Frontmatter in major docs
- Docs: `docs/archive/docs-standard-v2.md` (archived spec)

**Architecture Decision Records (ADRs)**

- Concept: Decision documentation
- Files: `docs/adr/0001-*.md` through `docs/adr/0009-*.md`
- Location: `docs/adr/` (adaptation from standard root `ADRs/`)

## Integration Patterns

**Third-party Services**

- Concept: Adapter pattern for integrations
- Files: `packages/integrations/` subdirectories
- Examples: HubSpot, Supabase, Analytics

**API Patterns**

- Concept: Server Actions, rate limiting
- Files: `packages/features/src/*/lib/actions.ts`
- Infra: `packages/infra/src/rate-limiting.ts`

## Technology Stack

**React 19 + Next.js 16**

- Concept: Modern React with App Router
- Files: `app/` directories in clients
- Config: `next.config.js` files

**TypeScript 5.9**

- Concept: Strict type safety
- Files: `tsconfig.json`, `**/*.ts`, `**/*.tsx`
- Config: Workspace TypeScript settings

**Tailwind CSS 4**

- Concept: Utility-first styling
- Files: `tailwind.config.js`, CSS imports
- Components: `packages/ui/src/components/`

## Security & Performance

**Security Architecture**

- Concept: Multi-layer security
- Files: `packages/infra/src/security/`
- Docs: `SECURITY.md`, `docs/architecture/README.md`

**Performance Optimization**

- Concept: Core Web Vitals, bundle optimization
- Files: Build configurations, optimization settings
- Docs: `docs/architecture/README.md`

## AI & Context

**AI Guardrails**

- Concept: AI interaction rules, task execution non-negotiables
- Files: `.context/RULES.md` (from CLAUDE.md)
- Docs: `CLAUDE.md`
- Task checklist: 10 non-negotiables (THEGOAL, research, examples, QA, testing, docs, commit)

**Agent instructions (platform-discovered)**

| Platform    | Primary                                                        | Additional            |
| ----------- | -------------------------------------------------------------- | --------------------- |
| Cursor      | `AGENTS.md` (root)                                             | `.cursor/rules/*.mdc` |
| Codex       | `AGENTS.md` (root), `AGENTS.override.md` (clients/, packages/) | —                     |
| Windsurf    | `AGENTS.md` (root + nested)                                    | `.windsurf/rules/`    |
| Claude Code | `CLAUDE.md` (root)                                             | `.claude/rules/*.md`  |
| Qwen Code   | `QWEN.md`, `AGENTS.md` (via `.qwen/settings.json`)             | `.qwen/skills/`       |

**AI Documentation Index**

- Concept: LLM-friendly documentation
- Files: `llms.txt`
- Purpose: AI discoverability and context

## Key Configuration Files

**Repository Configuration**

- `repo-config.yml` - 2026 standard compliance
- `pnpm-workspace.yaml` - Workspace setup
- `turbo.json` - Build orchestration

**Environment Configuration**

- `.env.example` - Environment template
- `clients/*/.env.local` - Client-specific env

**Package Configuration**

- `packages/*/package.json` - Individual package configs
- `packages/*/tsconfig.json` - TypeScript settings

## Common Tasks

**Adding New Client**

1. Copy `clients/starter-template/`
2. Update `site.config.ts`
3. Configure `.env.local`
4. Update `clients/README.md`

**Adding UI Component**

1. Create in `packages/ui/src/components/`
2. Add tests in `__tests__/`
3. Export in `packages/ui/src/index.ts`
4. Run `pnpm validate-ui-exports`

**Adding Feature**

1. Create in `packages/features/src/feature/`
2. Add actions, components, types
3. Add tests
4. Update feature exports

## Validation Scripts

**Workspace Validation**

- `pnpm validate-workspaces` - Workspace structure
- `pnpm validate-exports` - Package exports
- `pnpm validate-client` - Client configuration

**Quality Gates**

- `pnpm lint` - Code style
- `pnpm type-check` - TypeScript
- `pnpm test` - Unit tests
- `pnpm build` - Build verification

---

_This map helps AI tools understand repository structure and locate relevant files for specific concepts._
