---
diataxis: tutorial
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 60
project: marketing-websites
description: Development environment setup and workflows
tags: [development, setup, workflow, debugging]
primary_language: typescript
---

# Development

This guide covers development environment setup, build processes, and debugging for the marketing-websites platform.

## Quick Start

### Prerequisites

- **Node.js** >=22.0.0 (strictly required)
- **pnpm** 10.29.2+ (package manager)
- **Git** 2.30.0+ (version control)

### Setup Commands

```bash
# Clone repository
git clone https://github.com/your-org/marketing-websites.git
cd marketing-websites

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Verify setup
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

## Development Workflows

### Client Development

```bash
# Start a client (e.g., starter-template)
cd clients/starter-template
pnpm dev  # http://localhost:3101

# Client commands
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

### Package Development

```bash
# Work on UI package
cd packages/ui
pnpm dev

# Or from workspace root
pnpm --filter @repo/ui dev
pnpm --filter @repo/ui build
```

### Quality Checks

```bash
# Run all quality checks
pnpm lint          # ESLint
pnpm type-check    # TypeScript
pnpm test          # Jest tests
pnpm build         # Build verification
pnpm format        # Prettier formatting

# Package-specific checks
pnpm --filter @repo/ui lint
```

## Repository Structure

```text
marketing-websites/
├── clients/                # Client implementations
│   ├── starter-template/   # Golden path (clone for new clients)
│   └── [client-name]/      # Production sites
├── packages/               # Shared libraries
│   ├── ui/                 # React components
│   ├── features/           # Business logic
│   ├── utils/              # Utilities
│   ├── types/              # TypeScript definitions
│   └── infra/              # Infrastructure
├── docs/                   # Documentation
├── scripts/                # Build/validation scripts
└── tooling/                # Development tools
```

## Common Tasks

### Create New Client

```bash
# Copy starter template
cp -r clients/starter-template clients/my-client
cd clients/my-client

# Configure
cp .env.example .env.local
# Edit site.config.ts and .env.local

# Start development
pnpm dev --port 3001
```

### Add UI Component

```bash
cd packages/ui
mkdir -p src/components/NewComponent
# Create component files
# Add to src/index.ts exports
pnpm validate-ui-exports
```

### Update Dependencies

```bash
# Update all
pnpm update

# Package-specific
pnpm --filter @repo/ui add new-package
```

## Debugging

### Common Issues

```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install

# Clear build cache
pnpm clean
pnpm build

# TypeScript issues
pnpm type-check --clearCache
```

### Development Tools

- **VS Code** with TypeScript, Tailwind, ESLint extensions
- **React DevTools** for component inspection
- **Browser DevTools** for debugging

## Code Quality

### Standards

- **ESLint** with flat config for linting
- **Prettier** for code formatting
- **TypeScript** strict mode enabled
- **Jest** for unit testing
- **Conventional Commits** for commit messages

### Pre-commit Checks

Run before committing:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm validate-client [client-path]  # For client changes
```

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# Package-specific
pnpm --filter @repo/ui test
```

## Complete Documentation

For comprehensive development guidance, including:

- Detailed environment setup
- Architecture understanding
- Advanced workflows
- Contribution process
- Troubleshooting guide
- Learning resources

**See:** [docs/getting-started/onboarding.md](docs/getting-started/onboarding.md)

## Related Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[TESTING.md](TESTING.md)** - Testing strategy
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[TASKS.md](TASKS.md)** - Implementation tasks

---

_This is a quick development reference. See [docs/getting-started/onboarding.md](docs/getting-started/onboarding.md) for the complete development guide._
