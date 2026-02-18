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
3. Run `pnpm lint` and `pnpm format` before committing
4. Commit with clear, descriptive messages
5. Push and open a Pull Request

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] `pnpm lint` passes without errors
- [ ] `pnpm type-check` passes
- [ ] `pnpm format:check` passes
- [ ] Changes are documented (comments, README updates if needed)
- [ ] No breaking changes without discussion
- [ ] Documentation changes: `pnpm validate-docs` passes
- [ ] Documentation follows [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)

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
