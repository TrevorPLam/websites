# 🚀 Marketing Websites Monorepo

> **Multi-tenant, multi-site Next.js 16 marketing platform with Feature-Sliced Design v2.1**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.9.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![PNPM](https://img.shields.io/badge/pnpm-9.0+-red)](https://pnpm.io/)
[![Turbo](https://img.shields.io/badge/Turbo-2.0-orange)](https://turbo.build/)

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
│   ├── infra/              # Infrastructure code
│   ├── shared/             # Shared utilities
│   └── integrations/       # Third-party integrations
├── clients/                # Tenant-specific sites
├── sites/                  # Site configurations
├── docs/                   # Documentation
├── scripts/                # Automation scripts
├── tooling/                # Development tools
└── tasks/                  # Domain tasks
```

### Technology Stack

| Category            | Technology    | Version | Purpose                         |
| ------------------- | ------------- | ------- | ------------------------------- |
| **Framework**       | Next.js       | 16.1    | React framework with App Router |
| **UI Library**      | React         | 19.2    | User interface library          |
| **Language**        | TypeScript    | 5.1+    | Type-safe development           |
| **Styling**         | Tailwind CSS  | v4      | Utility-first CSS framework     |
| **Package Manager** | pnpm          | 9.0+    | Efficient package management    |
| **Build System**    | Turbo         | 2.0     | Monorepo build orchestration    |
| **Database**        | Supabase      | Latest  | PostgreSQL + real-time features |
| **Authentication**  | Supabase Auth | Latest  | OAuth 2.1 + multi-tenant auth   |
| **Deployment**      | Vercel        | Latest  | Edge deployment platform        |

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.9.0
- **pnpm** ≥ 9.0
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
cp .env.example .env.local
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific application
pnpm dev:web          # Marketing site
pnpm dev:portal       # Client portal
pnpm dev:admin        # Admin dashboard

# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Building

```bash
# Build all packages
pnpm build

# Build specific application
pnpm build:web
pnpm build:portal
pnpm build:admin
```

## 🎨 Feature-Sliced Design (FSD) v2.1

This monorepo follows **Feature-Sliced Design v2.1** architecture with strict layer separation:

```
packages/ui/src/
├── app/                 # App layer (pages, layouts)
├── pages/               # Pages layer (route components)
├── widgets/             # Widgets layer (composed features)
├── features/            # Features layer (business logic)
├── entities/            # Entities layer (business entities)
└── shared/              # Shared layer (utilities, types)
```

### Cross-Slice Imports

Use **@x notation** for cross-slice imports:

```typescript
// Import from another slice
import { Button } from '@x/ui/shared';
import { UserEntity } from '@x/entities/user';
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
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
  - 'clients/*'
```

### Key Packages

| Package              | Purpose           | Exports                   |
| -------------------- | ----------------- | ------------------------- |
| `@repo/ui`           | UI components     | FSD-structured components |
| `@repo/features`     | Business features | Tenant-aware features     |
| `@repo/infra`        | Infrastructure    | Auth, database, security  |
| `@repo/shared`       | Shared utilities  | Types, helpers, constants |
| `@repo/integrations` | Third-party       | Stripe, HubSpot, Cal.com  |

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Third-party
STRIPE_SECRET_KEY=sk_...
HUBSPOT_API_KEY=...
CALCOM_API_KEY=...
```

## 📚 Documentation

### Documentation Structure

```
docs/
├── guides/              # How-to guides
│   ├── accessibility/  # Accessibility compliance
│   ├── ai-automation/   # AI integration patterns
│   ├── architecture/    # System architecture
│   └── security/        # Security guidelines
├── plan/               # Domain planning
├── research/           # Research findings
└── lessons-learned/    # Project insights
```

### Key Documentation

- **[Architecture Decision Records](docs/plan/)**
- **[Security Guidelines](docs/guides/security/)**
- **[Performance Optimization](docs/guides/performance/)**
- **[AI Integration](docs/guides/ai-automation/)**
- **[Multi-Tenant Patterns](docs/guides/multi-tenant/)**

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

- **Status**: ✅ Production Ready
- **Version**: 1.0.0
- **Last Updated**: 2026-02-23
- **Maintainers**: Active development team
- **Contributors**: [View contributors](https://github.com/your-org/marketing-websites/graphs/contributors)

---

<div align="center">

**Built with ❤️ by the Marketing Websites Team**

[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js-black)](https://nextjs.org/)
[![Powered by TypeScript](https://img.shields.io/badge/Powered_by-TypeScript-blue)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://vercel.com/)

</div>
