# Marketing Websites Monorepo Documentation

> Enterprise-grade multi-tenant SaaS platform for marketing websites with 2026 documentation standards

## 📖 For Non-Technical Team Members

### What is a Monorepo?

Think of a monorepo as a single, organized warehouse that contains all the code for our marketing websites.
Instead of having separate storage units for each client, we keep everything in one well-organized building.
This makes it easier to share tools, maintain quality, and ensure consistency across all client sites.

### How to Navigate This Documentation

- **Start with the sections below** to find what interests you
- **Look for 🌟 icons** indicating business-focused content
- **Technical terms are explained** in simple language
- **Ask your development team** for help finding specific information

## Documentation Structure (Diátaxis Framework)

This documentation follows the [Diátaxis framework](https://diataxis.fr/) with four distinct content types:

### � [Getting Started](./getting-started/)

_Beginner-friendly setup and onboarding guides_

- **[Quick Start](./getting-started/quick-start.md)**: Get running in 10 minutes
- **[Development Setup](./getting-started/development-setup.md)**: Complete environment setup
- **[Your First Project](./getting-started/first-project.md)**: Create your first marketing site

### 📚 [Tutorials](./tutorials/)

_Learning-oriented, hands-on guides for skill development_

- **[Frontend Development](./tutorials/frontend-development.md)**: React 19 & Next.js 16
- **Backend Integration**: Database and API development
- **Testing Strategies**: Comprehensive testing approaches

### 🔧 [How-To Guides](./how-to/)

_Task-oriented, goal-focused problem-solving steps_

- **[Common Tasks](./how-to/common-tasks/daily-workflow.md)**: Daily development workflow
- **[Troubleshooting](./how-to/troubleshooting/)**: Common issues and solutions
- **Integration Guides**: Connect third-party services

### 📖 [Reference](./reference/)

_Information-oriented technical descriptions and specifications_

- **[API Reference](./reference/api-reference.md)**: Complete API documentation
- **Configuration Reference**: All configuration options
- **Error Codes**: Comprehensive error reference

### 💡 [Explanations](./explanation/)

_Understanding-oriented conceptual background and architecture decisions_

- **Architecture Decisions**: ADRs and system design rationale
- **Design Principles**: Core development philosophy
- **Business Context**: Business model and compliance requirements

## Comprehensive Guides (Domain-Specific)

The `guides-new/` directory contains the primary consolidated domain guides for deep technical implementation:

### 🏗️ [Architecture](./guides-new/architecture/)

_System design patterns and architectural decisions_

- **[System Architecture Guide](./guides-new/architecture/system-architecture-guide.md)**: Complete FSD 2.1 implementation
- **Architecture Decisions**: ADRs and design rationale
- **Multi-tenant SaaS**: Scalable architecture patterns

### 🔧 [Development](./guides-new/development/)

_Modern development patterns and best practices_

- **[Modern Development Stack](./guides-new/development/modern-development-stack.md)**: React 19 & Next.js 16
- **[Documentation Validation](./guides-new/development/docs-validation.md)**: Quality assurance
- **TypeScript Patterns**: Type-safe development practices

### ⚙️ [Infrastructure](./guides-new/infrastructure/)

_Deployment, monitoring, and operational patterns_

- **[Infrastructure DevOps Guide](./guides-new/infrastructure/infrastructure-devops-guide.md)**: Complete CI/CD patterns
- **Monitoring & Observability**: Performance and error tracking
- **Cloud Architecture**: Scalable infrastructure patterns

### 🔒 [Security](./guides-new/security/)

_Enterprise security implementation and compliance_

- **[Security Implementation Guide](./guides-new/security/security-implementation-guide.md)**: Complete security patterns
- **[Security Patterns Guide](./guides-new/security/security-patterns-guide.md)**: Multi-layer defense
- **Authentication & Authorization**: OAuth 2.1 with PKCE
- **Post-Quantum Ready**: NIST FIPS 203/204/205 preparation

### 🔗 [Integrations](./guides-new/integrations/)

_Third-party service integrations and APIs_

- **[Third-Party Integrations Guide](./guides-new/integrations/third-party-integrations.md)**: Complete integration patterns
- **Payment Processing**: Stripe integration with 2026 standards
- **Email Services**: Multi-provider email delivery

### 💳 [Payments](./guides-new/payments/)

_Payment processing and billing systems_

- **[Payment Processing Guide](./guides-new/payments/payment-processing-guide.md)**: Complete Stripe integration
- **Checkout Sessions**: Modern payment flows
- **Customer Portal**: Self-service billing management
- **Webhook Handling**: Secure event processing

### 📧 [Email](./guides-new/email/)

_Email delivery and notification systems_

- **[Email Architecture Guide](./guides-new/email/email-architecture-guide.md)**: Complete email system
- **Multi-tenant Routing**: Tenant-aware email delivery
- **Template Management**: React Email integration
- **Delivery Analytics**: Performance monitoring

### 🤖 [AI & Automation](./guides-new/ai/)

_AI agents and automation patterns_

- **[AI Integration Patterns](./guides-new/ai/ai-integration-patterns.md)**: Complete AI agent patterns
- **Context Management**: Hierarchical AI context systems
- **Multi-Agent Coordination**: Agent orchestration patterns

### 🔍 [SEO & Marketing](./guides-new/seo/)

_Search optimization and digital marketing_

- **[SEO Optimization Guide](./guides-new/seo/seo-optimization-guide.md)**: Complete SEO strategy
- **Metadata Generation**: Dynamic metadata systems
- **Structured Data**: JSON-LD and Schema.org implementation
- **Core Web Vitals**: Performance optimization

### 🧪 [Testing](./guides-new/testing/)

_Comprehensive testing strategies_

- **[Testing Guide](./guides-new/testing/testing-guide.md)**: Complete testing patterns
- **E2E Testing**: Playwright best practices
- **Unit Testing**: Vitest and React Testing Library
- **Accessibility Testing**: axe-core integration

---

## Legacy Documentation

The `guides/` directory contains legacy documentation that is being migrated to the consolidated `guides-new/` structure. Key categories still available in legacy format:

### 🏗️ Core Architecture

- `architecture/` — system architecture and design patterns
- `best-practices/` — development practices and coding standards
- `build-monorepo/` — build system and monorepo management

### 🎨 Frontend & UI

- `frontend/` — frontend frameworks and UI development
- `accessibility-legal/` — WCAG compliance and legal requirements 🌟

### 🗄️ Backend & Data

- `backend-data/` — database, caching, and backend services
- `multi-tenant/` — multi-tenant architecture patterns 🌟

### ⚙️ Infrastructure & DevOps

- `infrastructure-devops/` — deployment, CI/CD, and infrastructure
- `monitoring/` — observability and performance monitoring

### 🔗 Integration & Services

- `scheduling/` — appointment booking and calendar integration 🌟

### ✅ Quality & Standards

- `linting/` — code quality and linting configurations
- `standards-specs/` — industry standards and specifications

### 🚀 Advanced Features

- `seo-metadata/` — SEO optimization and metadata management 🌟
- `security/` — security implementation and best practices

## Top-level layout

- `guides/` — comprehensive domain and technology guides (25+ categories, 200+ documents)
- `plan/` — program/domain planning artifacts and task specifications
- `standards/` — governance, policy, and compliance documentation
- `quality/` — quality assurance processes and checklists
- `research/` — research findings and analysis reports
- `security/` — security documentation and vulnerability reports
- `testing/` — testing strategies and self-healing test documentation

## Guides structure

The `guides/` directory contains 25+ categories covering both technical implementation and business concepts:

### 🏗️ Core Architecture

**What this means for our business:** How we build and organize our website platform to be reliable and scalable.

- `architecture/` — system architecture and design patterns
- `best-practices/` — development practices and coding standards
- `build-monorepo/` — build system and monorepo management

### 🎨 Frontend & UI

**What this means for our business:** How our websites look, feel, and work for visitors on all devices.

- `frontend/` — frontend frameworks and UI development
- `accessibility-legal/` — WCAG compliance and legal requirements 🌟

### 🗄️ Backend & Data

**What this means for our business:** The engine room that powers our websites, handles data, and keeps everything secure.

- `backend-data/` — database, caching, and backend services
- `multi-tenant/` — multi-tenant architecture patterns 🌟

### ⚙️ Infrastructure & DevOps

**What this means for our business:** The technical foundation that keeps our websites running 24/7 and performing well.

- `infrastructure-devops/` — deployment, CI/CD, and infrastructure
- `monitoring/` — observability and performance monitoring

### 🔗 Integration & Services

**What this means for our business:** How our websites connect with other services like payment processors and email systems.

- `payments-billing/` — payment processing and billing systems 🌟
- `scheduling/` — appointment booking and calendar integration 🌟
- `email/` — email delivery and notification systems

### ✅ Quality & Standards

**What this means for our business:** How we ensure our websites are reliable, secure, and meet industry standards.

- `testing/` — testing frameworks and strategies
- `linting/` — code quality and linting configurations
- `standards-specs/` — industry standards and specifications

### 🚀 Advanced Features

**What this means for our business:** Cutting-edge capabilities that give our websites competitive advantages.

- `ai-automation/` — AI agents and automation patterns 🌟
- `seo-metadata/` — SEO optimization and metadata management 🌟
- `security/` — security implementation and best practices

## 📚 Business Glossary

### Key Terms Explained Simply

**🌟 Multi-tenant Architecture**

- _What it is:_ One platform serving multiple clients, like an apartment building where each tenant has their own secure apartment.
- _Why it matters:_ Cost-effective, easier maintenance, consistent updates across all clients.

**🌟 WCAG Compliance**

- _What it is:_ Web Content Accessibility Guidelines - rules that make websites usable for people with disabilities.
- _Why it matters:_ Legal requirement, better user experience, larger audience reach.

**🌟 SEO Optimization**

- _What it is:_ Making websites easy for Google and other search engines to find and understand.
- _Why it matters:_ Higher search rankings = more visitors = more business opportunities.

**🌟 Payment Processing**

- _What it is:_ Systems that handle credit card payments and billing securely.
- _Why it matters:_ Enables e-commerce, subscription services, and revenue generation.

**🌟 API Integration**

- _What it is:_ Connecting our websites to other services (like calendars, email, CRM systems).
- _Why it matters:_ Automates workflows, reduces manual data entry, improves efficiency.

**🌟 Performance Monitoring**

- _What it is:_ Watching how fast and reliably our websites work.
- _Why it matters:_ Slow websites lose visitors and sales; monitoring prevents problems.

## Authoring rules

- Use markdown (`.md`) for prose
- Prefer one concept per document
- Cross-link related docs and task IDs
- Keep titles task/domain searchable
- Follow 2026 standards compliance
- Include authoritative sources and references

## Documentation standards

All documentation follows the comprehensive specification in `docs/guides/GUIDESINDEX.md`,
which includes:

- Quality standards with authoritative sources
- 2026 technical requirements (WCAG 2.2, OAuth 2.1, Core Web Vitals)
- Complete roadmap with 47 categories and 300+ documents
- Security considerations and performance optimization patterns

## 💼 For Business & Project Management

### How to Use This Documentation

**🎯 Planning New Features**

- Look at `plan/` directory for current development roadmap
- Check `guides/` for technical capabilities and limitations
- Review `quality/` for testing and deployment requirements

**📊 Understanding Progress**

- `TODO.md` shows current development status
- Task documents in `tasks/` provide detailed progress tracking
- `research/` contains analysis for strategic decisions

**🔧 Requesting Changes**

- Discuss with development team using specific task IDs
- Reference relevant documentation sections
- Consider impact on existing features and clients

**⚡ Quick Reference**

- **Payment issues:** `guides-new/payments/`
- **SEO questions:** `guides-new/seo/`
- **Accessibility concerns:** `guides/accessibility-legal/`
- **Performance problems:** `guides/infrastructure-devops/monitoring/`
- **Security matters:** `guides/security/`

## Related tasks

- DOMAIN-37-2-3 create-docs-folder-structure
- Ongoing documentation enhancement and maintenance
