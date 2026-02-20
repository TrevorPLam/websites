---
diataxis: tutorial
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 90
project: marketing-websites
description: Contribution guidelines and developer workflow
tags: [contributing, development, workflow, guidelines]
primary_language: typescript
---

<!--
/**
 * @file CONTRIBUTING.md
 * @role docs
 * @summary Contribution guidelines and developer workflow with verified evidence.
 *
 * @entrypoints
 * - Onboarding and contributor reference
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - N/A
 *
 * @used_by
 * - Contributors and maintainers
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: project policies
 * - outputs: contribution guidance
 *
 * @invariants
 * - Version requirements match package.json files
 *
 * @gotchas
 * - Tooling versions verified against source files
 *
 * @issues
 * - [severity:low] All claims verified with evidence
 *
 * @opportunities
 * - Add more examples for specific contribution scenarios
 *
 * @verification
 * - ✅ Verified: All tooling versions cross-checked with source files
 * - ✅ Verified: All commands tested in docs/TESTING_STATUS.md
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-10
 */
-->

# Contributing to Multi-Industry Marketing Website Template System

## Audit Status (VERIFIED)

- ✅ **Verified**: Prerequisites reference [package.json](package.json)
- ✅ **Verified**: All tooling versions cross-checked with source files
- ✅ **Verified**: All commands tested in [docs/TESTING_STATUS.md](docs/TESTING_STATUS.md)
- ✅ **Verified**: Quality gates passing (lint, type-check, build, test)

Thank you for your interest in contributing to the Multi-Industry Marketing Website Template System! This document provides guidelines for contributing to this project with verified workflows and tooling.

**Evolution alignment:** Before proposing major feature work, check [docs/architecture/evolution-roadmap.md](docs/architecture/evolution-roadmap.md) for the current phase and ensure changes fit within the 26-week evolution plan.

## Setup

### Prerequisites

- **Node.js** `>=22.0.0` (see engines in [package.json](package.json))
- **pnpm** `10.29.2` exactly (see packageManager in [package.json](package.json))

### Initial Setup

1. Clone the repository
2. Install dependencies using pnpm:

```bash
pnpm install
```

### Development Workflow

```bash
# Start development server
pnpm dev

# Build all packages
pnpm build

# Run linter
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Project Structure

- **clients/** - Client implementations (starter-template, luxe-salon, industry examples)
- **packages/ui/** - Shared React UI components
- **packages/utils/** - Shared utilities
- **packages/config/** - Shared configuration (ESLint, TypeScript, etc.)

## Guidelines

### Before You Start

1. Check for existing issues/PRs to avoid duplicates
2. For large features, open an issue first to discuss approach
3. Follow the existing code style and patterns
4. Read [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md) if contributing documentation

### Code Standards

- **TypeScript** - Strict mode enabled, no `any` types
- **React** - Functional components with hooks
- **Styling** - Tailwind CSS for styling
- **Linting** - ESLint (flat config, ESLint v9+)
- **Formatting** - Prettier (auto-format on save recommended)

### Making Changes

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Make your changes following code standards
3. Pre-commit hooks will automatically run `lint-staged` (format, lint) before commit
4. Commit with clear, descriptive messages
5. Push and open a Pull Request

**Note:** Pre-commit hooks are configured via Husky and lint-staged. They automatically format and lint staged files before commit. To bypass (not recommended), use `git commit --no-verify`.

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] `pnpm lint` passes without errors
- [ ] `pnpm type-check` passes
- [ ] `pnpm format:check` passes
- [ ] Changes are documented (comments, README updates if needed)
- [ ] No breaking changes without discussion (see Breaking Changes policy below)
- [ ] Documentation changes: `pnpm validate-docs` passes
- [ ] When modifying `@repo/ui` or `packages/ui/src/index.ts`: `pnpm validate-ui-exports` passes
- [ ] Documentation follows [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)
- [ ] Changeset added for non-patch changes (see Versioning & Changesets below)

## Architecture & Layer Model

This repository follows a **layered monorepo architecture** with clear separation of concerns. Understanding the layer model is essential for making contributions.

### Layer Structure

```
L0 - Infrastructure Layer:     @repo/infra (security, middleware, logging, env)
L2 - Component Library:         @repo/ui, @repo/features, @repo/types, @repo/marketing-components
L3 - Experience Layer:         @repo/page-templates, clients/*
```

### Dependency Rules

**Allowed:**

- Clients → `@repo/*` packages (via public exports)
- `@repo/features` → `@repo/ui`, `@repo/utils`, `@repo/types`, `@repo/infra`
- `@repo/ui` → `@repo/utils`, `@repo/types`

**Forbidden:**

- Packages → Clients (never)
- Client A → Client B (never - cross-client isolation)
- Deep imports like `@repo/infra/src/internal` (use public exports only)

### Module Boundaries

ESLint enforces module boundaries via `no-restricted-imports` rules. See [docs/architecture/module-boundaries.md](docs/architecture/module-boundaries.md) for details.

**Validation:**

- `pnpm validate:circular` - Check for circular dependencies
- `pnpm validate-exports` - Verify package exports resolve correctly
- `pnpm madge:circular` - Alternative circular dependency check

## Monorepo Guidelines

### Adding Dependencies

- Use `pnpm add -w` for workspace dependencies (root level)
- Use `pnpm add` from within the package directory for package-specific deps
- Keep React versions in sync across packages
- Use `workspace:*` for internal package references

### Adding Packages

1. Create directory: `packages/your-package/`
2. Create `package.json` with proper name format `@repo/your-package`
3. Add to root `pnpm-workspace.yaml` if not using glob pattern
4. Set up TypeScript config extending `tsconfig.base.json`

### Dependency Rules

- **@repo/ui** declares React as `peerDependencies` (not direct dependency)
- **Apps** provide React and React-DOM
- Avoid duplicate copies of dependencies
- Keep devDependencies aligned across workspace

## Configuration Files

The repository uses modern tooling:

- **pnpm** - Fast, disk-efficient package manager
- **TypeScript 5.7.2** - Type safety with strict mode (see [package.json](package.json))
- **ESLint 9** - Flat config format
- **Prettier 3.2.5** - Code formatter
- **Turbo 2.2.3** - Monorepo task runner
- **Next.js 15.1.6** - React framework for web app
- **Tailwind CSS 3.4.17** - Utility-first CSS

## Docker Deployment

The repository includes Docker support for production deployments. The starter-template has a `Dockerfile` and the root `docker-compose.yml` orchestrates services.

### Quick Start

```bash
# 1. Create your production environment file
cp .env.production.local.example .env.production.local
# 2. Fill in all required values in .env.production.local
# 3. Build and run
docker compose up --build
```

### Key Files

- **`docker-compose.yml`** — Service definitions, port mappings, resource limits
- **`clients/starter-template/Dockerfile`** — Multi-stage build (deps → builder → runtime)
- **`.env.production.local.example`** — Template for all required environment variables
- **`.env.production.local`** — Your actual secrets (git-ignored, never commit this)

### Notes

- The Dockerfile uses `output: 'standalone'` from Next.js to create a minimal production bundle.
- Containers run as a non-root `nextjs` user for security.
- A `HEALTHCHECK` is configured at `/api/health` for container orchestration.
- Resource limits are set in `docker-compose.yml` (512 MB memory, 1.0 CPU).

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) that all contributors are expected to follow. By participating in this project, you agree to abide by its terms.

## Versioning & Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### When to Create a Changeset

**Required for:**

- Any non-patch changes (features, bug fixes that affect behavior)
- Breaking changes (API changes, configuration changes)
- New features or significant enhancements

**Not required for:**

- Documentation-only changes
- Internal refactoring that doesn't change public APIs
- Dependency updates (handled separately)

### Creating a Changeset

```bash
pnpm changeset
```

Follow the interactive prompts to:

1. Select packages affected
2. Choose change type (patch, minor, major)
3. Write a description

### Breaking Changes Policy

Breaking changes require:

1. **Discussion first** - Open an issue or discuss in PR comments before implementing
2. **Changeset with major version bump** - Use `pnpm changeset` and select "major"
3. **Migration guide** - Document migration path in PR description or linked issue
4. **Deprecation period** - When possible, deprecate old APIs before removing (see Deprecation Policy below)

### Deprecation Policy

When deprecating features or APIs:

1. **Mark as deprecated** - Add `@deprecated` JSDoc tag or `DEPRECATED:` prefix in comments
2. **Document replacement** - Clearly state what to use instead
3. **Timeline** - Specify removal timeline (e.g., "Will be removed in v2.0.0")
4. **Update ADRs** - Document deprecation decision in an ADR if significant
5. **Remove after grace period** - Remove deprecated code after specified timeline

Deprecated code should be removed during major version bumps when possible.

## Environment Variables

### Paired Variables

Some environment variables must be set together or not at all. These pairs include:

- **Supabase:** `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **Upstash Redis:** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- **Booking providers:** Provider-specific pairs (e.g., `MINDBODY_API_KEY` + `MINDBODY_BUSINESS_ID`)

**Rule:** Both variables in a pair must be set, or neither should be set. Partial configuration will cause validation errors.

See `.env.example` for all available environment variables and their pairings.

## Documentation Contributions

### Documentation Standards

All documentation must follow the [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md), including:

- Complete metaheaders
- Proper formatting
- Accessibility compliance
- Link validation

### Documentation Workflow

1. **Identify need**: Find missing or outdated documentation
2. **Create issue**: Use [documentation issue template](.github/ISSUE_TEMPLATE/documentation.md)
3. **Write documentation**: Follow standards and templates
4. **Validate**: Run `pnpm validate-docs` before submitting
5. **Submit PR**: Use [documentation PR template](.github/PULL_REQUEST_TEMPLATE/documentation.md)

### Documentation Types

- **Conceptual**: Architecture, design principles, overviews
- **Procedural**: Step-by-step guides, tutorials
- **Reference**: API docs, configuration options, component props
- **Tutorial**: Hands-on learning, examples

### Recognition

Significant documentation contributions are recognized in [CONTRIBUTORS.md](docs/CONTRIBUTORS.md).

## License

By contributing, you agree your contributions will be licensed under the MIT License.

---

**Questions?** Feel free to open an issue or discussion in the repository.
