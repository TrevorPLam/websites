---
diataxis: reference
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 90
project: marketing-websites
description: Multi-industry template system with configuration-as-code architecture
tags: [architecture, monorepo, react, nextjs, templates]
primary_language: typescript
---

# Architecture

This document provides an overview of the marketing-websites platform architecture. For detailed documentation, see the complete architecture guide.

## Quick Overview

The marketing-websites platform is a **multi-industry template system** built on a **layered monorepo architecture**. The system enables rapid deployment of client websites through reusable templates, shared components, and configuration-as-code patterns.

### Key Concepts

- **Configuration-as-Code Architecture (CaCA):** Every aspect driven by `site.config.ts`
- **Layered Architecture:** Clear separation of concerns across 7 layers
- **Template-Based Composition:** Industry-specific templates with shared components
- **Multi-Tenancy:** Single codebase serving multiple clients

## System Layers

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5: Orchestration Layer          (Campaign management, MRM, CDP)    │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)        │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)             │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)       │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│ ← @repo/infra exists
└─────────────────────────────────────────────────────────────────────────────┘
```

## Repository Structure

```text
marketing-websites/
├── clients/                # Client implementations (6 clients)
├── packages/               # Shared libraries (@repo/ui, @repo/features, etc.)
├── tooling/                # Development tools and generators
├── docs/                   # Comprehensive documentation
└── scripts/                # Build and validation scripts
```

## Technology Stack

- **Node.js** >=22.0.0
- **Next.js** 16.1.5 with App Router
- **React** 19.0.0
- **TypeScript** 5.9.3
- **Tailwind CSS** 4.1.0
- **pnpm** 10.29.2 for package management

## Design Principles

1. **Configuration-Driven Development:** Single source of truth in `site.config.ts`
2. **Layered Architecture:** Clear boundaries and dependency direction
3. **Template-Based Composition:** Industry-focused reusable templates
4. **Modern Web Standards:** Latest React, Next.js, and TypeScript features

## Current Status

| Layer | Package | Status |
| ----- | ------- | ------ |
| **L2** | `@repo/ui` | 🟡 9 of 14 primitives complete |
| **L2** | `@repo/marketing-components` | 🟡 Partial implementation |
| **L2** | `@repo/features` | 🟡 5 of 9 features complete |
| **L3** | `@repo/page-templates` | 🔴 Scaffolded only |
| **Clients** | 6 implementations | 🟢 Active |

## Complete Documentation

For comprehensive architecture documentation, including:

- Detailed system architecture and data flows
- Component hierarchy and dependency graphs
- Security and performance architecture
- Deployment patterns and infrastructure
- Evolution roadmap and design decisions

**See:** [docs/architecture/README.md](docs/architecture/README.md)

## Related Documentation

- **[Module Boundaries](docs/architecture/module-boundaries.md)** - Dependency rules
- **[TASKS.md](TASKS.md)** - Implementation details
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

*This is a high-level architecture overview. See [docs/architecture/README.md](docs/architecture/README.md) for the complete architecture documentation.*
