---
diataxis: tutorial
audience: user
last_reviewed: 2026-02-19
review_interval_days: 90
project: marketing-websites
description: Multi-industry template system for marketing websites
tags: [marketing, templates, react, nextjs, typescript]
primary_language: typescript
---

<!--
/**
 * @file README.md
 * @role docs
 * @summary Root project overview and quickstart instructions.
 *
 * @entrypoints
 * - First-stop documentation for users and contributors
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - N/A
 *
 * @used_by
 * - Developers and operators
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: repository configuration and tooling
 * - outputs: onboarding guidance
 *
 * @invariants
 * - Version claims must match package.json files and pnpm-workspace.yaml catalog
 * - All links must point to existing files
 * - Project structure must reflect actual directory layout
 *
 * @gotchas
 * - Quickstart commands are VERIFIED and tested
 * - Starter template: `clients/starter-template` (package `@clients/starter-template`)
 *
 * @issues
 * - Known issues were documented in docs/archive/ISSUES.md (archived)
 *
 * @opportunities
 * - Add project badges when repository is public
 * - Add screenshots/gifs for visual demonstration
 *
 * @verification
 * - Version numbers from pnpm-workspace.yaml catalog and package.json (2026-02-19)
 * - Quality gates: run `pnpm lint type-check build test` to verify
 * - Project structure reflects actual directory layout (packages, clients, tooling)
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-19
 */
-->

# Marketing Websites Platform

> **Multi-industry marketing website template system** — A modern monorepo for creating and managing client websites across all industries with configuration-driven architecture.

[![Node.js](https://img.shields.io/badge/Node.js-22.0.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.29.2-blue.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Overview

Professional multi-industry marketing website template system built with modern web technologies. This monorepo provides **ready-to-use templates** for businesses across all industries and enables you to **create and manage unlimited client projects** from a single, well-structured repository.

**Vision:** Transform from template-based to feature-based, industry-agnostic marketing website platform with configuration-as-code architecture (CaCA). Every aspect of a client website — theming, page composition, feature selection, SEO schema — is driven by a validated `site.config.ts`.

### Current Status

**Phase:** Wave 0 Complete → Wave 1 In Progress  
**Timeline:** 12 weeks | **Current State:** Config-driven clients (6 industry clients) → **Target:** 12 industries, 20+ components

> **Quality gates:** Run `pnpm lint type-check build test` to verify. Historical issue analysis is in [docs/archive/ISSUES.md](docs/archive/ISSUES.md).

| Layer  | Package                      | Status         | Progress                                                                        |
| ------ | ---------------------------- | -------------- | ------------------------------------------------------------------------------- |
| **L0** | `@repo/infra`                | 🟢 Complete    | Security, middleware, logging, 7 env schemas                                    |
| **L2** | `@repo/ui`                   | 🟡 In Progress | 9+ UI primitives (Button, Dialog, Input, Slider, Toast, etc.)                   |
| **L2** | `@repo/marketing-components` | 🟡 Partial     | Package exists; scaffolded component families                                   |
| **L2** | `@repo/features`             | 🟡 Partial     | 5 features (booking, contact, blog, services, search); all tests pass           |
| **L2** | `@repo/types`                | 🟢 Complete    | Shared TypeScript types/interfaces                                              |
| **L2** | `@repo/infrastructure-*`     | 🟡 Partial     | tenant-core, theme, layout, ui (type-check passes)                              |
| **L3** | `@repo/page-templates`       | 🟡 Wired       | 7 templates use section registry + marketing-components adapters                |
| **L3** | `clients/starter-template`   | 🟢 Active      | Golden-path template (port 3101, next-intl, Docker)                             |
| **L3** | `clients/luxe-salon`, etc.   | 🟡 Partial     | 6 industry clients (bistro-central, chen-law, sunrise-dental, urban-outfitters) |

See task specs in [tasks/](tasks/) (e.g. [tasks/archive/0-4-fix-toast-sonner-api.md](tasks/archive/0-4-fix-toast-sonner-api.md)) and [docs/architecture/README.md](docs/architecture/README.md) for architecture details.

### Key Features

- 🎨 **Industry Templates** - Ready-to-use templates (starting with hair salon, expandable to all industries)
- 🚀 **Multi-Client Support** - Manage unlimited client projects in one repository
- 🔧 **Highly Customizable** - Configuration-driven architecture with easy branding and feature customization
- 📦 **Shared Components** - Reusable UI primitives, marketing components, and features across templates
- 🏗️ **Modern Architecture** - Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4
- 🔒 **Production-Ready** - Security, performance, and SEO optimized
- 📱 **Responsive** - Mobile-first design approach
- ♿ **Accessible** - WCAG 2.2 AA compliance built-in
- 🎯 **Marketing-First** - Conversion optimization features (planned)
- 🔐 **Privacy-First** - Consent-gated analytics, GDPR/CCPA compliant

## 🚀 Quick Start

### Prerequisites

- **Node.js** `>=22.0.0` (enforced via [package.json engines](package.json))
- **pnpm** `10.29.2` exactly (enforced via [packageManager](package.json))

> **Note:** pnpm version is strictly enforced. Install with `npm install -g pnpm@10.29.2` or use [Corepack](https://nodejs.org/api/corepack.html).

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd marketing-websites

# Install all dependencies
pnpm install
```

### Development

```bash
# Start the starter template development server
cd clients/starter-template
pnpm dev

# Or use workspace filter (runs on port 3101)
pnpm --filter @clients/starter-template dev

# Build all packages and projects
pnpm build

# Run quality checks
pnpm lint          # ESLint across workspace
pnpm type-check    # TypeScript type checking
pnpm test          # Jest tests
pnpm format        # Format with Prettier
```

### Creating a New Client Project

**Step 1: Copy the template**

```bash
# Copy starter template to create a new client
cp -r clients/starter-template clients/my-client-name
```

**Step 2: Configure the client**

```bash
cd clients/my-client-name

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Update site.config.ts with client-specific settings
```

**Step 3: Add to workspace**

The `clients/` directory is already included in `pnpm-workspace.yaml`, so new clients are automatically part of the workspace.

**Step 4: Install and run**

```bash
# Install dependencies (from root)
pnpm install

# Start development server (use unique port)
pnpm --filter @clients/my-client-name dev --port 3001
```

For detailed instructions, see:

- **[Developer Onboarding](docs/getting-started/onboarding.md)** - Complete setup guide
- **[Build First Client](docs/tutorials/build-first-client.md)** - Step-by-step tutorial

## 📁 Project Structure

```
marketing-websites/
├── clients/                      # Client implementations
│   ├── starter-template/        # Golden-path template (@clients/starter-template, port 3101)
│   ├── luxe-salon/              # Salon industry
│   ├── bistro-central/          # Restaurant industry
│   ├── chen-law/                # Law firm
│   ├── sunrise-dental/          # Dental practice
│   ├── urban-outfitters/        # Retail
│   └── [client-name]/           # Your client projects
│
├── packages/                     # Shared packages (Layer 0-2)
│   ├── ui/                      # @repo/ui - UI primitives (Button, Input, Dialog, Toast, etc.)
│   ├── features/                 # @repo/features - Feature modules (booking, contact, blog)
│   ├── marketing-components/    # @repo/marketing-components - Hero, services, testimonials
│   ├── page-templates/          # @repo/page-templates - 7 templates wired via section registry
│   ├── types/                   # @repo/types - Shared TypeScript types
│   ├── utils/                   # @repo/utils - Utility functions (cn, etc.)
│   ├── infra/                   # @repo/infra - Security, middleware, logging, env schemas
│   ├── industry-schemas/        # @repo/industry-schemas - JSON-LD per industry
│   ├── integrations/            # 20+ integration packages
│   │   ├── analytics/           # @repo/integrations-analytics
│   │   ├── hubspot/             # @repo/integrations-hubspot
│   │   ├── supabase/            # @repo/integrations-supabase
│   │   ├── scheduling/          # @repo/integrations-scheduling (Calendly, Acuity, Cal.com)
│   │   ├── chat/                # @repo/integrations-chat (Intercom, Crisp, Tidio)
│   │   ├── reviews/             # @repo/integrations-reviews (Google, Yelp, Trustpilot)
│   │   ├── maps/                # @repo/integrations-maps
│   │   └── ...                  # acuity, calendly, convertkit, mailchimp, sendgrid, etc.
│   ├── ai-platform/             # @repo/ai-platform-* (agent-orchestration, llm-gateway, content-engine)
│   ├── content-platform/       # dam-core, visual-editor
│   ├── marketing-ops/           # campaign-orchestration
│   ├── infrastructure/          # tenant-core, theme, layout, ui
│   └── config/                  # eslint-config, typescript-config
│
├── tooling/                     # Dev tooling
│   ├── create-client/           # @repo/create-client
│   ├── generate-component/     # @repo/generate-component
│   └── validation/              # @repo/validation
│
├── docs/                        # Documentation hub
│   ├── getting-started/         # Onboarding guides
│   ├── tutorials/               # Step-by-step tutorials
│   ├── architecture/            # Architecture documentation
│   ├── ci/                      # CI/CD (required-checks.md)
│   └── ...
│
├── tasks/                       # Task specifications (e.g. 0-4-fix-toast-sonner-api.md)
├── scripts/                     # validate-documentation, validate-exports, validate-workspaces
├── docker-compose.yml           # Docker Compose configuration
├── turbo.json                   # Turborepo pipeline config
├── pnpm-workspace.yaml          # Workspace globs + version catalog
└── package.json                 # Root package.json
```

### Architecture Layers

- **Layer 0 (Infrastructure):** `@repo/infra`, `@repo/integrations-*` - Security, middleware, logging, env schemas
- **Layer 2 (Components):** `@repo/ui`, `@repo/marketing-components`, `@repo/features`, `@repo/infrastructure-*` - Reusable components
- **Layer 3 (Experience):** `@repo/page-templates`, `clients/` - Composed sites

See [Architecture Overview](docs/architecture/README.md) for detailed architecture documentation.

## 🛠️ Technology Stack

All versions verified against [package.json](package.json) and [pnpm-workspace.yaml](pnpm-workspace.yaml):

| Category               | Technology   | Version  | Source                                                                         |
| ---------------------- | ------------ | -------- | ------------------------------------------------------------------------------ |
| **Runtime**            | Node.js      | >=22.0.0 | [package.json](package.json)                                                   |
| **Package Manager**    | pnpm         | 10.29.2  | [package.json](package.json)                                                   |
| **Frontend Framework** | Next.js      | 16.1.5   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **UI Library**         | React        | 19.0.0   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Styling**            | Tailwind CSS | 4.1.0    | [clients/starter-template/package.json](clients/starter-template/package.json) |
| **Type Safety**        | TypeScript   | 5.9.3    | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Linting**            | ESLint       | 9.18.0   | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Code Formatting**    | Prettier     | 3.8.1    | [package.json](package.json)                                                   |
| **Monorepo Tool**      | Turbo        | 2.8.10   | [package.json](package.json)                                                   |
| **Testing**            | Jest         | 30.2.0   | [package.json](package.json)                                                   |
| **Database**           | Supabase     | -        | PostgreSQL with RLS                                                            |
| **Error Tracking**     | Sentry       | 10.38.0  | [pnpm-workspace.yaml catalog](pnpm-workspace.yaml)                             |
| **Container**          | Docker       | -        | [docker-compose.yml](docker-compose.yml)                                       |

### Key Dependencies

- **UI Components:** Radix UI primitives, Lucide React icons, Sonner toast notifications
- **Forms:** React Hook Form with Zod validation
- **Content:** MDX support with next-mdx-remote
- **Analytics:** Consent-gated analytics integration
- **CRM:** HubSpot integration for contact forms

## 📚 Documentation

### Getting Started

- **[📚 Documentation Hub](docs/README.md)** - Central navigation for all documentation
- **[Developer Onboarding](docs/getting-started/onboarding.md)** - Complete setup guide (2-4 hours)
- **[Troubleshooting Guide](docs/getting-started/troubleshooting.md)** - Common issues and solutions
- **[Learning Paths](docs/resources/learning-paths.md)** - Role-based learning guides

### Tutorials

- **[Build Your First Client](docs/tutorials/build-first-client.md)** - Step-by-step client creation
- **[Create a Custom Component](docs/tutorials/create-component.md)** - Component development guide
- **[Set Up Integrations](docs/tutorials/setup-integrations.md)** - Third-party service integration

### Architecture & Development

- **[Architecture Overview](docs/architecture/README.md)** - System architecture with visual diagrams
- **[Visual Architecture Guide](docs/architecture/visual-guide.md)** - Visual representations and flows
- **[Module Boundaries](docs/architecture/module-boundaries.md)** - Dependency rules and constraints
- **[Dependency Graph](docs/architecture/dependency-graph.md)** - Visual dependency mapping

### Reference Materials

- **[Glossary](docs/resources/glossary.md)** - Technical terms and concepts
- **[FAQ](docs/resources/faq.md)** - Frequently asked questions
- **[Component Library](docs/components/ui-library.md)** - UI component documentation

### Operations & Security

- **[Documentation Maintenance](docs/operations/maintenance.md)** - Documentation maintenance processes
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability reporting
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes

### Standards & Guidelines

- **[Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)** - Writing and formatting standards
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards

### Planning & Roadmap

- **[tasks/](tasks/)** - Task specifications (e.g. 0-4-fix-toast-sonner-api.md), implementation backlog

## 🧪 Available Scripts

### Workspace Commands

| Command                     | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `pnpm install`              | Install all dependencies                          |
| `pnpm build`                | Build all packages and projects                   |
| `pnpm dev`                  | Start development servers (via Turbo)             |
| `pnpm lint`                 | Run ESLint across workspace                       |
| `pnpm type-check`           | Run TypeScript type checking                      |
| `pnpm test`                 | Run Jest tests                                    |
| `pnpm test:watch`           | Run tests in watch mode                           |
| `pnpm test:coverage`        | Generate test coverage report                     |
| `pnpm format`               | Format code with Prettier                         |
| `pnpm format:check`         | Check formatting without changes                  |
| `pnpm validate-docs`        | Validate documentation                            |
| `pnpm validate-docs:strict` | Validate documentation (strict mode)              |
| `pnpm validate-exports`     | Validate package exports                          |
| `pnpm validate:workspaces`  | Validate package.json vs pnpm-workspace.yaml sync |
| `pnpm knip`                 | Find unused dependencies and exports              |
| `pnpm syncpack:check`       | Check for dependency version mismatches           |
| `pnpm syncpack:fix`         | Fix dependency version mismatches                 |

### Client Commands

```bash
# Work on starter template (golden path)
pnpm --filter @clients/starter-template dev
pnpm --filter @clients/starter-template build

# Work on specific client (when created)
pnpm --filter @clients/my-client dev
pnpm --filter @clients/my-client build

# Run command in all clients
pnpm --filter "@clients/*" build
pnpm --filter "@clients/*" lint
```

## 🐳 Docker

Build and run locally with Docker Compose:

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The Docker Compose configuration includes:

- **Starter Template** - Available on `http://localhost:3101`

See [docker-compose.yml](docker-compose.yml) for configuration details and [docs/deployment/docker.md](docs/deployment/docker.md) for deployment documentation.

## 🤝 Contributing

We welcome contributions! Before contributing, please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
2. Review [Code of Conduct](CODE_OF_CONDUCT.md) for community standards
3. Check [Documentation Standards](docs/DOCUMENTATION_STANDARDS.md) for writing guidelines

### Development Workflow

1. **Fork and clone** the repository
2. **Create a branch** for your changes (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the code standards
4. **Run quality checks** (`pnpm lint`, `pnpm type-check`, `pnpm test`)
5. **Commit** with clear messages
6. **Push** and create a pull request

### Quality Gates

All pull requests must pass:

- Linting (`pnpm lint`) — _many packages lack eslint.config.mjs_
- Type checking (`pnpm type-check`) — _all packages pass_
- Export validation (`pnpm validate-exports`)
- Marketing exports (`pnpm validate-marketing-exports`)
- Client validation (`pnpm validate-all-clients`)
- Circular deps (`pnpm madge:circular`)
- Dependency consistency (`pnpm syncpack:check`)
- Build (`pnpm build`)
- Tests (`pnpm test`) — _all 646 tests pass_

Workspace validation (`pnpm validate:workspaces`) passes; CI runs full pipeline on push, affected packages only on PRs.

See [docs/ci/required-checks.md](docs/ci/required-checks.md) for CI/CD details.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🆘 Support

For issues, questions, or suggestions:

1. **Check [FAQ](docs/resources/faq.md)** - Common questions and answers
2. **Review [Troubleshooting Guide](docs/getting-started/troubleshooting.md)** - Solutions to common issues
3. **Read [Documentation Hub](docs/README.md)** - Comprehensive documentation
4. **Open a GitHub Issue** - Report bugs or request features

## 🌟 Community

- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and expectations
- **[Contributors](docs/CONTRIBUTORS.md)** - Recognition for contributors
- **[Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)** - How we write documentation

## 📊 Project Status

**Last Updated:** 2026-02-19  
**Current Phase:** Wave 0 Complete → Wave 1 In Progress  
**Next Milestone:** Continue Wave 1 implementation; all CI quality gates passing

For task specifications, see [tasks/](tasks/).

---

**Quick Links:**

- [🚀 Quick Start](#-quick-start)
- [📚 Documentation Hub](docs/README.md)
- [🏗️ Architecture](docs/architecture/README.md)
- [📁 Archived docs](docs/archive/)
- [🤝 Contributing](CONTRIBUTING.md)
- [📋 Task specs](tasks/)
