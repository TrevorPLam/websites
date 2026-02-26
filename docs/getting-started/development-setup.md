---
title: Development Setup
description: Complete development environment setup for optimal productivity
last_updated: 2026-02-26
tags: [#getting-started #setup #development #environment]
estimated_read_time: 15 minutes
difficulty: beginner
---

# Development Setup

## Overview

Set up your complete development environment for the marketing websites monorepo with all recommended tools, extensions, and configurations.

## Prerequisites

### Required Software

- **Node.js 20.9.0+** - [Download](https://nodejs.org/)
- **pnpm 9.0+** - `npm install -g pnpm`
- **Git 2.30+** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)

### VS Code Extensions

Install these extensions for optimal development:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-playwright.playwright",
    "ms-vscode.test-adapter-converter"
  ]
}
```

## Environment Configuration

### 1. Environment Variables

```bash
# Copy and configure environment
cp .env.template .env.local
```

Required variables:
```env
# Database
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# External Services
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Database Setup

```bash
# Start local database (Docker required)
pnpm db:start

# Run migrations
pnpm db:migrate

# Seed development data
pnpm db:seed
```

## Development Workflow

### Commands Overview

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:web          # Web app only
pnpm dev:portal       # Portal app only

# Building
pnpm build            # Build all packages
pnpm build:web        # Web app only

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only
pnpm test:e2e         # End-to-end tests

# Linting & Type Checking
pnpm lint             # Lint all files
pnpm type-check       # TypeScript validation
pnpm format           # Format with Prettier
```

### Git Hooks

The repository includes pre-commit hooks that run:
- TypeScript type checking
- ESLint validation
- Prettier formatting
- Test execution

## Performance Optimization

### pnpm Configuration

```json
// .pnpmrc
shamefully-hoist=true
strict-peer-dependencies=false
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### Common Issues

**TypeScript errors after install:**
```bash
pnpm type-check --force
```

**Port conflicts:**
```bash
# Check what's using ports 3000-3010
netstat -an | grep ":300[0-9]"
```

**Database connection issues:**
```bash
# Reset database
pnpm db:reset
pnpm db:migrate
pnpm db:seed
```

## Next Steps

- [First Project](./first-project.md) - Create your first site
- [Development Patterns](../guides-new/development/) - Learn best practices
- [Architecture Overview](../guides-new/architecture/) - Understand the system

## Related Resources

- [pnpm Workspaces Guide](../guides-new/build-monorepo/pnpm-workspaces.md)
- [Next.js 16 Documentation](../guides-new/development/nextjs-16.md)
- [Database Setup](../guides-new/backend-data/database-setup.md)
