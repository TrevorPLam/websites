---
doc_id: "WEB-2026-APP-README"
doc_version: "2.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "web-team@marketing-websites.com"

# Bimodal Classification
ai_readiness_score: 0.89
human_ttv_seconds: 18
bimodal_grade: "A"

# Technical Context
type: application
language: typescript
framework: nextjs
runtime: node-22
complexity: enterprise

# Compliance & Governance
compliance_frameworks:
- "SOC2-Type-II"
- "GDPR-Article-32"
- "ISO-27001"
- "EU-AI-Act-High-Risk"
risk_classification: "medium-risk"
data_governance: "PII-Encrypted"

# AI Retrieval Optimization
rag_optimization:
  chunk_strategy: "recursive-headers"
  chunk_size: 800
  chunk_overlap: 120
  late_chunking: true
  embedding_model: "text-embedding-3-large"
  hybrid_search: true

# Executable Documentation
executable_status: true
ci_validation: true
last_executed: "2026-02-27T13:45:00Z"

# Maintenance & Quality
maintenance_mode: "active"
stale_threshold_days: 90
audit_trail: "github-actions"
---

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

- [Feature-Sliced Design Guide](../../docs/guides/best-practices/feature-sliced-design-docs.md)
- [Multi-tenant Architecture](../../docs/guides/multi-tenant/)
- [Platform Documentation](../../README.md)
