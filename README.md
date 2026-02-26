# 🚀 Marketing Websites Monorepo

> **Multi-tenant, multi-site Next.js 16 marketing platform with Feature-Sliced Design v2.1**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)](https://nextjs.org/)
[![PNPM](https://img.shields.io/badge/pnpm-10.29.2-red)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/Turbo-2.4.0-orange)](https://turbo.build/)

A **production-ready** monorepo for building and deploying marketing websites at scale. Built with **Next.js 16**, **React 19**, and **TypeScript**, following **Feature-Sliced Design (FSD) v2.1** architecture with enterprise-grade security, performance optimization, and multi-tenant isolation.

## 🎯 Overview

This monorepo provides a complete foundation for managing **1000+ client marketing websites** with:

- **Multi-tenant SaaS architecture** with complete data isolation
- **Feature-Sliced Design v2.1** for scalable development
- **Performance-first** approach with Core Web Vitals optimization
- **Enterprise security** with OAuth 2.1, RLS, and defense-in-depth patterns
- **AI-powered development** with comprehensive agent context management
- **Automated workflows** for deployment, testing, and quality assurance

## 🏗️ Architecture

### Repository Structure

```
marketing-websites/
├── apps/                    # Next.js applications
│   ├── admin/              # Admin dashboard
│   ├── portal/             # Client portal
│   └── web/                # Marketing site template
├── packages/               # Shared libraries
│   ├── ui/                 # UI components (FSD)
│   ├── features/           # Business features
│   ├── entities/           # Data entities
│   ├── infrastructure/     # Infrastructure code
│   ├── shared/             # Shared utilities
│   ├── integrations/       # Third-party integrations
│   ├── config/             # Configuration schemas
│   ├── marketing-components/ # Marketing-specific components
│   └── [40+ specialized packages]
├── clients/                # Tenant-specific sites
├── sites/                  # Site configurations
├── docs/                   # Documentation
├── scripts/                # Automation scripts
├── tooling/                # Development tools
├── database/               # Database migrations
├── agents/                 # AI Agent Framework
│   ├── core/              # Context engineering
│   ├── governance/        # Policy enforcement
│   ├── memory/            # Memory systems
│   ├── orchestration/     # Multi-agent coordination
│   └── tools/             # Tool contracts
├── mcp/                    # Model Context Protocol
│   ├── servers/           # MCP server implementations
│   ├── apps/              # MCP applications with UI
│   ├── config/            # Configuration files
│   ├── docs/              # Documentation
│   └── scripts/           # Automation scripts
├── skills/                 # Agent Skills definitions
│   ├── core/              # Essential workflows
│   ├── integration/       # Third-party integrations
│   ├── domain/            # Business-specific
│   ├── templates/         # Skill templates
│   ├── codex/             # Claude Code skills
│   └── claude/            # Claude skills
└── MCP_INDEX.md            # MCP/Skills workspace index
├── supabase/               # Supabase configuration
├── e2e/                    # E2E tests
└── tests/                  # Integration tests
```

### Technology Stack

| Category            | Technology    | Version | Purpose                         |
| ------------------- | ------------- | ------- | ------------------------------- |
| **Framework**       | Next.js       | 16.1.5  | React framework with App Router |
| **UI Library**      | React         | 19.0.0  | User interface library          |
| **Language**        | TypeScript    | 5.9.3   | Type-safe development           |
| **Styling**         | Tailwind CSS  | v4.1.0  | Utility-first CSS framework     |
| **Package Manager** | pnpm          | 10.29.2 | Efficient package management    |
| **Build System**    | Turbo         | 2.4.0   | Monorepo build orchestration    |
| **Database**        | Supabase      | Latest  | PostgreSQL + real-time features |
| **Authentication**  | Supabase Auth | Latest  | OAuth 2.1 + multi-tenant auth   |
| **Deployment**      | Vercel        | Latest  | Edge deployment platform        |

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 22.0.0
- **pnpm** ≥ 10.29.2
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/marketing-websites.git
cd marketing-websites

# Enable corepack and install dependencies
corepack enable
pnpm install

# Copy environment variables
cp .env.template .env.local
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check

# Build all packages
pnpm build
```

## 🎨 Feature-Sliced Design (FSD) v2.1

This monorepo follows **Feature-Sliced Design v2.1** architecture with strict layer separation across packages:

```
packages/
├── entities/           # Entities layer (business entities)
│   └── src/
│       ├── lead/       # Lead entity
│       └── tenant/     # Tenant entity
├── features/           # Features layer (business logic)
│   └── src/
│       ├── authentication/
│       ├── booking/
│       ├── analytics/
│       ├── blog/
│       └── [20+ feature modules]
├── ui/                 # Shared UI components
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── forms/       # Form components
│       ├── booking/     # Booking-specific UI
│       └── layout/      # Layout components
└── shared/             # Shared layer (utilities, types)
```

### Cross-Slice Imports

Use **@x notation** for cross-slice imports:

```typescript
// Import from another slice
import { Button } from '@x/ui/shared';
import { UserEntity } from '@x/entities/user';
import { BookingFeature } from '@x/features/booking';
```

## 🔒 Security & Multi-Tenancy

### Security Architecture

- **OAuth 2.1 with PKCE** for all authentication flows
- **Row Level Security (RLS)** for database tenant isolation
- **Defense-in-depth** middleware with CVE-2025-29927 mitigation
- **Per-tenant secrets management** with encryption
- **Rate limiting** with sliding window algorithms
- **Post-quantum cryptography** abstraction layer

### Multi-Tenant Isolation

- **Tenant context** propagation via AsyncLocalStorage
- **Database-level isolation** with RLS policies
- **Cache isolation** with tenant-specific keys
- **API rate limiting** per tenant
- **Audit logging** with tenant tracking

## 📊 Performance & Monitoring

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Performance Features

- **Partial Pre-rendering (PPR)** for instant page loads
- **React Compiler** for automatic optimization
- **Edge caching** with Vercel Edge Network
- **Bundle size budgets** with automated enforcement
- **Real-time performance monitoring** with Sentry

### Monitoring Stack

- **OpenTelemetry** for distributed tracing
- **Sentry** for error tracking and performance
- **Tinybird** for real-time analytics
- **Vercel Analytics** for Core Web Vitals
- **Custom dashboard** for business metrics

## 🔧 Development Workflow

### AI Agent Context

This repository includes comprehensive **AI agent context management**:

- **Root AGENTS.md** - Master coordination (60-line limit)
- **Per-package AGENTS.md** - Package-specific guidance
- **CLAUDE.md** - Sub-agent definitions
- **Cold-start checklist** for consistent AI sessions

### Code Quality

- **ESLint 9** with custom rules
- **Prettier** for code formatting
- **Steiger** for FSD architecture validation
- **Husky** for git hooks
- **Lint-staged** for pre-commit checks

### Testing Strategy

- **Vitest** for unit testing
- **Playwright** for E2E testing
- ** axe-core** for accessibility testing
- **Coverage reporting** with >80% target
- **Visual regression testing** with Chromatic

## 📦 Package Management

### Workspace Structure

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'packages/config/*'
  - 'packages/integrations/*'
  - 'packages/features/*'
  - 'packages/ai-platform/*'
  - 'packages/content-platform/*'
  - 'packages/marketing-ops/*'
  - 'packages/infrastructure/*'
  - 'apps/*'
  - 'clients/*'
  - 'tooling/*'
  - 'e2e/*'
```

### Key Packages

| Package                     | Purpose             | Exports                       |
| --------------------------- | ------------------- | ----------------------------- |
| `@repo/ui`                  | UI components       | Reusable components & forms   |
| `@repo/features`            | Business features   | 20+ feature modules           |
| `@repo/infrastructure`      | Infrastructure      | Auth, database, security      |
| `@repo/entities`            | Data entities       | Lead, tenant entities         |
| `@repo/shared`              | Shared utilities    | Types, helpers, constants     |
| `@repo/integrations`        | Third-party         | Stripe, HubSpot, Cal.com      |
| `@repo/multi-tenant`        | Multi-tenancy       | Tenant resolution, billing    |
| `@repo/analytics`           | Analytics           | Performance monitoring        |
| `@repo/agent-core`          | Agent Core          | Context engineering           |
| `@repo/agent-governance`    | Agent Governance    | Enterprise policy enforcement |
| `@repo/agent-memory`        | Agent Memory        | Advanced memory systems       |
| `@repo/agent-orchestration` | Agent Orchestration | Multi-agent coordination      |
| `@repo/agent-tools`         | Agent Tools         | Tool contract system          |

## 🤖 MCP/Skills Workspace

This repository includes a comprehensive **Model Context Protocol (MCP)** and **Agent Skills** workspace for AI agent development:

### MCP (Model Context Protocol)

- **15 custom MCP servers** for enterprise-grade AI agent integration
- **Enterprise security** with OAuth 2.1 and zero-trust architecture
- **Multi-tenant support** with proper isolation and scaling
- **Observability** with distributed tracing and monitoring

### Agent Skills

- **Workflow skills** for deployment, testing, and code review
- **Integration skills** for GitHub, Azure, Slack, and other services
- **Domain skills** for marketing, sales, and analytics workflows
- **Skill templates** for rapid skill development

### Quick Start

- 📖 [MCP Index](MCP_INDEX.md) - Complete workspace navigation
- 🚀 [Getting Started](mcp/docs/tutorials/getting-started.md) - MCP introduction
- 📚 [Documentation](mcp/docs/) - Comprehensive guides and reference
- 🛠️ [Setup Scripts](mcp/scripts/) - Automation and validation tools
- 🤖 [Agent Framework](agents/README.md) - AI agent orchestration
- 🎯 [Skills Guide](skills/README.md) - Agent skills and workflows

## 🚀 Deployment

### Vercel Integration

- **Multi-app deployment** with automatic routing
- **Edge functions** for tenant resolution
- **Environment-specific** configurations
- **Preview deployments** for pull requests
- **Custom domains** for tenant sites

### Environment Variables

```bash
# Core
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME="Marketing Website"
NODE_ENV=development

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=
ANALYTICS_ID=

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Database (Supabase)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Third-party Integrations
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
HUBSPOT_API_KEY=
CALCOM_API_KEY=
```

## 📚 Documentation

### Documentation Structure

```
docs/
├── frontmatter-schema.json # Schema for doc metadata
├── guides/                # How-to guides (165+ files)
│   ├── accessibility/     # Accessibility compliance
│   ├── ai-automation/     # AI integration patterns
│   ├── architecture/      # System architecture
│   └── [15+ categories]
├── observability/         # Monitoring and alerting
├── operations/            # DevOps procedures
├── quality/               # Code quality standards
├── research/              # Research findings
├── standards/             # Industry standards
└── testing/               # Testing strategies
```

### Key Documentation

- **[Security Guidelines](SECURITY.md)**
- **[Contributing Guide](CONTRIBUTING.md)**
- **[Architecture Guides](docs/guides/architecture/)**
- **[AI Integration](docs/guides/ai-automation/)**
- **[Multi-Tenant Patterns](docs/guides/multi-tenant/)**
- **[Quality Standards](docs/quality/)**
- **[Operations](docs/operations/)**

## 🤝 Contributing

We welcome contributions! Please read our **[Contributing Guide](CONTRIBUTING.md)** for details.

### Development Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow **FSD v2.1** architecture
- Use **TypeScript** strict mode
- Write **tests** for new features
- Update **documentation** as needed
- Follow **conventional commits**

## 📋 Tasks & Domains

### Active Domains

- **Domain-0**: Infrastructure fixes
- **Domain-1**: Package management
- **Domain-2**: Configuration schema
- **Domain-3**: FSD architecture
- **Domain-4**: Security implementation
- **Domain-5**: Performance engineering
- **Domain-6**: Data architecture
- **Domain-7**: Multi-tenancy

### Task Management

- **TODO.md** - Comprehensive task tracking
- **Domain-specific** task files
- **Automated** task completion tracking
- **Priority-based** execution

## 🔗 Useful Links

### Project Resources

- **[Website](https://your-marketing-platform.com)** - Live platform
- **[Documentation](https://docs.your-platform.com)** - Full documentation
- **[Dashboard](https://admin.your-platform.com)** - Admin dashboard
- **[Status](https://status.your-platform.com)** - System status

### Development Resources

- **[Repository](https://github.com/your-org/marketing-websites)** - Source code
- **[Issues](https://github.com/your-org/marketing-websites/issues)** - Bug reports
- **[Discussions](https://github.com/your-org/marketing-websites/discussions)** - Community
- **[Releases](https://github.com/your-org/marketing-websites/releases)** - Changelog

### External Resources

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[FSD Documentation](https://feature-sliced.design/)**
- **[Supabase Documentation](https://supabase.com/docs)**
- **[Vercel Documentation](https://vercel.com/docs)**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Feature-Sliced Design** community for architectural guidance
- **Vercel** for the excellent deployment platform
- **Supabase** for the backend infrastructure
- **Open source community** for the amazing tools and libraries

## 📊 Project Status

- **Status**: ✅ Production Ready (95% Complete)
- **Version**: 1.0.0
- **Last Updated**: 2026-02-25
- **Foundation**: All critical infrastructure tasks completed
- **Maintainers**: Active development team
- **Contributors**: [View contributors](https://github.com/your-org/marketing-websites/graphs/contributors)

---

<div align="center">

**Built with ❤️ by the Marketing Websites Team**

[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js-black)](https://nextjs.org/)
[![Powered by TypeScript](https://img.shields.io/badge/Powered_by-TypeScript-blue)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://vercel.com/)

</div>
