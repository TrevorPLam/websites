# Your Dedicated Marketer

Marketing website monorepo built with Next.js.

## Structure

- `apps/web-app/` - Main Next.js application
- `packages/ui/` - Shared design system components
- `packages/utils/` - Shared utilities
- `.ai/` - AI-specific configuration and context

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build all packages
pnpm build
```

## Architecture

This repository follows a monorepo structure:
- **Apps**: Applications that consume packages
- **Packages**: Shared code used across apps
- **Infrastructure**: Deployment and infrastructure configs
- **Tools**: Development tools and scripts
- **Docs**: Documentation
