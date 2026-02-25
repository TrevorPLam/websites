# apps/web

Main marketing website application for multi-tenant SaaS platform.

## Overview

This is the primary marketing website application that serves as the public-facing entry point for all tenant sites. Built with Next.js 16 and React 19, it implements Feature-Sliced Design (FSD) v2.1 architecture for scalable component organization.

## Key Features

- **Multi-tenant Architecture**: Supports 1000+ client sites with isolated configurations
- **Marketing Components**: Reusable UI components for landing pages, pricing, and contact forms
- **SEO Optimization**: Dynamic metadata generation and sitemap creation
- **Performance**: Core Web Vitals optimization with PWA capabilities
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4

## Technology Stack

- **Framework**: Next.js 16.1.5 with App Router
- **UI**: React 19.0.0 with Server Components
- **Styling**: Tailwind CSS v4 with design tokens
- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **Build**: Turborepo with pnpm workspaces

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Structure

```text
apps/web/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                # Utility functions
└── public/             # Static assets
```

## Configuration

Site-specific configuration is managed through `site.config.ts` following the configuration-as-code pattern defined in DOMAIN-2.

## Related Documentation

- [Feature-Sliced Design Guide](../../docs/guides/architecture/feature-sliced-design-docs.md)
- [Multi-tenant Architecture](../../docs/guides/multi-tenant/)
- [Marketing Components](../../packages/marketing-components/README.md)
