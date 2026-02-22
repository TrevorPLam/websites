# Getting Started Guide

**Created:** 2026-02-21  
**Role:** Learning Documentation  
**Audience:** New Developers, Contributors, System Administrators  
**Last Reviewed:** 2026-02-21  
**Review Interval:** 60 days

---

## 🚀 Quick Start

This guide will get you up and running with the marketing-websites platform in approximately 2-4 hours. Follow these steps sequentially for a smooth onboarding experience.

### Prerequisites

Before you begin, ensure you have:

- **Node.js** `>=22.0.0` (enforced via package.json engines)
- **pnpm** `10.29.2` exactly (enforced via packageManager)
- **Git** for version control
- **Code Editor** with TypeScript support (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd marketing-websites

# Install all dependencies
pnpm install
```

### Verification

```bash
# Verify installation
pnpm --version  # Should show 10.29.2
pnpm type-check    # Should pass without errors
pnpm lint         # Should pass with minimal warnings
pnpm test         # Should pass all tests
```

---

## 🏗️ Repository Overview

The marketing-websites platform is a **multi-industry template system** built on a **layered monorepo architecture**. It enables rapid deployment of client websites through reusable templates, shared components, and configuration-as-code patterns.

### Key Concepts

- **Configuration-as-Code (CaCA):** Every aspect driven by `site.config.ts`
- **Layered Architecture:** 7 layers from infrastructure to client experience
- **Template-Based Composition:** Industry-specific templates with shared components
- **Multi-Tenancy:** Single codebase serving multiple clients securely

### Repository Structure

```
marketing-websites/
├── clients/                      # Client implementations
│   └── testing-not-a-client/     # Single working template
├── packages/                     # Shared libraries
│   ├── ui/                      # 68+ UI primitives
│   ├── features/                 # 20+ feature modules
│   ├── infra/                   # Security, middleware
│   └── integrations/            # 21 integration packages
├── docs/                        # Comprehensive documentation
├── tasks/                       # Task specifications
└── tooling/                     # Development tools
```

---

## 🛠️ Development Environment Setup

### IDE Configuration

#### **VS Code (Recommended)**

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

#### **ESLint Configuration**

```json
// .vscode/settings.json
{
  "eslint.validate": ["javascript", "typescript", "typescriptreact", "typescriptreact"]
}
```

### Git Configuration

```bash
# Configure Git user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure Git editor
git config --global core.editor "code --wait"
```

### Environment Variables

Create `.env.local` in the repository root:

```bash
# Development Environment
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3101
NEXT_PUBLIC_SITE_NAME="Marketing Websites Platform"

# Business Information
NEXT_PUBLIC_BUSINESS_NAME="Your Business"
NEXT_PUBLIC_BUSINESS_PHONE="(555) 123-4567"
NEXT_PUBLIC_BUSINESS_EMAIL="contact@example.com"

# API Keys (add as needed)
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# HUBSPOT_API_KEY=your-hubspot-key
# SUPABASE_URL=your-supabase-url
# SUPABASE_ANON_KEY=your-supabase-key
```

---

## 🧪 Development Workflow

### Daily Development Commands

```bash
# Start development server
pnpm --filter @clients/testing-not-a-client dev

# Build all packages
pnpm build

# Run quality checks
pnpm lint          # ESLint across workspace
pnpm type-check    # TypeScript type checking
pnpm test          # Jest tests
pnpm format        # Format code with Prettier
```

### Package Development Commands

```bash
# Work on UI components
cd packages/ui
pnpm dev
pnpm test
pnpm type-check

# Work on features
cd packages/features
pnpm dev
pnpm test
pnpm type-check

# Work on integrations
cd packages/integrations/hubspot
pnpm dev
pnpm test
pnpm type-check
```

### Testing Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

---

## 📚 Understanding the Architecture

### System Layers

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 7: Client Experience Layer      (White-labeled client portals)      │ ← Future
│  LAYER 6: AI & Intelligence Layer      (Agentic workflows, predictive)    │ ← Future
│  LAYER 5:  Orchestration Layer          (Campaign management, MRM, CDP)    │ ← Future
│  LAYER 4: Content & Asset Layer        (DAM, Headless CMS, Visual Edit)   │ ← Future
│  LAYER 3: Experience Layer             (Composed sites, apps, PWA)        │ ← CURRENT
│  LAYER 2: Component Library            (Atomic design system)             │ ← CURRENT
│  LAYER 1: Data & Analytics Layer       (Real-time CDP, attribution)       │ ← Future
│  LAYER 0: Infrastructure Layer         (Multi-tenant SaaS, edge, security)│ ← CURRENT
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Packages

#### **Layer 0: Infrastructure**

- **@repo/infra**: Security, middleware, logging, environment schemas
- **@repo/integrations-\***: 21 integration packages
- **@repo/config**: Build and development configuration

#### **Layer 2: Components**

- **@repo/ui**: 68+ UI primitives (Button, Input, Dialog, Toast, etc.)
- **@repo/marketing-components**: Marketing component families
- **@repo/features**: 20+ feature modules (booking, contact, blog, etc.)

#### **Layer 3: Experience**

- **@repo/page-templates**: Template system with section registry
- **clients/\***: Client implementations

### Configuration-Driven Architecture

Every client website is driven by a single `site.config.ts` file:

```typescript
export default {
  // Branding and theming
  brand: {
    name: 'Client Name',
    colors: { primary: '#3b82f6', secondary: '#64748b' },
    typography: { fontFamily: 'Inter, sans-serif' },
  },

  // Feature activation
  features: {
    booking: { enabled: true, provider: 'calendly' },
    blog: { enabled: true, postsPerPage: 10 },
    contact: { enabled: true, provider: 'hubspot' },
  },

  // Integrations
  integrations: {
    analytics: { provider: 'google', trackingId: 'G-XXXXXXXXXX' },
    crm: { provider: 'hubspot', apiKey: 'hubspot-key' },
  },
} satisfies SiteConfig;
```

---

## 🔧 Common Development Tasks

### Creating a New Client Project

#### **Step 1: Copy the Template**

```bash
# Copy testing template
cp -r clients/testing-not-a-client clients/my-client-name

# Windows alternative
xcopy /E /I clients\testing-not-a-client clients\my-client-name
# Or using PowerShell:
Copy-Item -Recurse -Force clients\testing-not-a-client clients\my-client-name
```

#### **Step 2: Configure the Client**

```bash
cd clients/my-client-name

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Update site.config.ts with client-specific settings
```

#### **Step 3: Add to Workspace**

The `clients/` directory is already included in `pnpm-workspace.yaml`, so new clients are automatically part of the workspace.

#### **Step 4: Install and Run**

```bash
# Install dependencies (from root)
pnpm install

# Start development server
cd clients/my-client-name
pnpm dev --port 3001
```

### Adding a New UI Component

#### **Step 1: Create Component File**

```typescript
// packages/ui/src/components/my-component.tsx
'use client';

import { Button } from './button';
import { cn } from '@repo/utils';

interface MyComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function MyComponent({
  title,
  variant = 'primary',
  className
}: MyComponentProps) {
  return (
    <div className={cn('my-component', className)}>
      <h2>{title}</h2>
      <Button variant={variant}>
        Click Me
      </Button>
    </div>
  );
}
```

#### **Step 2: Add to Exports**

```typescript
// packages/ui/src/index.ts
export { MyComponent } from './components/my-component';
```

#### **Step 3: Add Tests**

```typescript
// packages/ui/src/components/__tests__/my-component.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

#### **Step 4: Test and Build**

```bash
cd packages/ui
pnpm test
pnpm type-check
pnpm build
```

### Adding a New Feature Module

#### **Step 1: Create Feature Directory**

```bash
cd packages/features/src
mkdir my-feature
```

#### **Step 2: Create Feature Implementation**

```typescript
// packages/features/src/my-feature/index.ts
export interface MyFeatureConfig {
  enabled: boolean;
  provider?: string;
  options?: Record<string, any>;
}

export async function createMyFeature(config: MyFeatureConfig) {
  // Feature implementation
  return {
    id: 'my-feature-id',
    config,
    status: 'created',
  };
}
```

#### **Step 3: Add to Feature Exports**

```typescript
// packages/features/src/index.ts
export * from './my-feature';
```

#### **Step 4: Add Tests**

```typescript
// packages/features/src/my-feature/__tests__/index.test.ts
import { createMyFeature } from '../index';

describe('MyFeature', () => {
  it('creates feature correctly', () => {
    const result = createMyFeature({ enabled: true });
    expect(result.id).toBe('my-feature-id');
  });
});
```

---

## 🔍️ Troubleshooting

### Common Issues and Solutions

#### **Node.js Version Issues**

**Problem:** Node.js version too old

```
Error: Node.js version >=22.0.0 required
```

**Solution:**

```bash
# Install Node.js 22+
# Using nvm (recommended)
nvm install 22
nvm use 22

# Using Homebrew (macOS)
brew install node@22
```

#### **pnpm Workspace Issues**

**Problem:** pnpm commands fail with workspace errors

```
Error: pnpm can't find package in workspace
```

**Solution:**

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
pnpm install
```

#### **TypeScript Compilation Errors**

**Problem:** Type errors in package dependencies

```
Error: Cannot find module '@repo/ui' or its type declarations
```

**Solution:**

```bash
# Rebuild TypeScript
pnpm type-check

# Check package exports
pnpm validate-exports
```

#### **Build Failures**

**Problem:** Build fails with server-only module imports

```
Error: Server-only modules cannot be imported in client code
```

**Solution:**

- Use client-safe exports: `import { Component } from '@repo/ui/client'`
- Add 'use client' directive to client components
- Check package.json exports configuration

#### **Port Conflicts**

**Problem:** Port already in use

```
Error: listen EADDRINUSE :::3000
```

**Solution:**

```bash
# Use different port
pnpm --filter @clients/my-client dev --port 3002
```

### Getting Help

#### **Documentation Resources**

- [**Architecture Overview**](../architecture/system-overview.md) - System understanding
- [**Troubleshooting Guide**](troubleshooting.md) - Common issues and solutions
- [**FAQ**](../resources/faq.md) - Frequently asked questions

#### **Community Support**

- **GitHub Discussions:** Ask questions and share knowledge
- **GitHub Issues:** Report bugs or request features
- **Slack:** Real-time help and discussion

#### **Team Support**

- **Senior Developers:** Complex technical issues
- **Security Team:** Security-related concerns
- **DevOps Team:** Deployment and infrastructure issues

---

## 📚 Development Best Practices

### Code Quality

#### **TypeScript Best Practices**

- **Strict Mode:** Enable all TypeScript strict options
- **No Any Types:** Avoid `any` type usage
- **Interface Definitions:** Use interfaces for all data structures
- **Type Guards:** Implement runtime type checking

#### **React Best Practices**

- **Functional Components:** Prefer functional components over classes
- **Hooks Usage:** Use hooks for state management
- **Server Components:** Use server components by default
- **Client Components:** Only for interactivity

#### **Security Best Practices**

- **Input Validation:** Validate all user inputs
- **SQL Injection Prevention:** Use parameterized queries
- **XSS Prevention:** Sanitize all user-generated content
- **Authentication:** Never expose secrets in client code

### Workflow Best Practices

#### **Git Workflow**

- **Branch Strategy:** Feature branches, main for integration
- **Commit Messages:** Follow conventional commit format
- **Pull Requests:** Create PRs for all changes
- **Code Reviews:** Require peer review for all changes

#### **Testing Strategy**

- **Unit Tests:** Test individual functions and components
- **Integration Tests:** Test component interactions
- **E2E Tests:** Test user workflows
- **Security Tests:** Test authentication and authorization

#### **Documentation**

- **Code Comments:** Add comments for complex logic
- **README Files:** Document package purpose and usage
- **API Documentation:** Document all public APIs
- **Architecture Docs:** Document design decisions

---

## 🎯 Next Steps

### **After Completing This Guide**

1. **Explore Architecture:** Read [System Architecture Overview](../architecture/system-overview.md)
2. **Review Standards:** Review [Documentation Standards](../DOCUMENTATION_STANDARDS.md)
3. **Practice Development:** Create a simple feature or component
4. **Join Community:** Participate in discussions and contributions

### **Recommended Learning Path**

1. **Week 1:** Complete basic onboarding, explore existing codebase
2. **Week 2:** Implement a small feature or component
3. **Week 3:** Contribute to a task or fix
4. **Week 4:** Participate in code review process

### **Advanced Topics**

- [**Security Architecture**](../security/overview.md) - Security implementation
- [**Performance Optimization**](../performance-baseline.md) - Performance guidelines
- [**Testing Strategy**](../testing-strategy.md) - Testing approach
- [**Deployment**](../deployment/docker.md) - Deployment procedures

---

## 📞 Resources

### **Essential Reading**

- [**Repository README**](../../README.md) - Project overview
- [**Contributing Guide**](../../CONTRIBUTING.md) - Contribution guidelines
- [**Architecture Overview**](../architecture/system-overview.md) - System understanding
- [**Troubleshooting Guide**](troubleshooting.md) - Common issues

### **Reference Materials**

- [**Glossary**](../resources/glossary.md) - Technical terms
- [**FAQ**](../resources/faq.md) - Frequently asked questions
- [**Component Library**](../components/ui-library.md) - UI components
- **API Documentation**](../api/) - API reference

### **Community Support**

- **GitHub Discussions:** [github.com/your-org/marketing-websites/discussions](https://github.com/your-org/marketing-websites/discussions)
- **GitHub Issues:** [github.com/your-org/marketing-websites/issues](https://github.com/your-org/marketing-websites/issues)
- **Slack:** Internal team communication channel

---

**Document Last Updated:** 2026-02-21  
**Next Review:** 2026-04-21  
**Maintainers:** Development Team  
**Classification:** Public  
**Questions:** Create GitHub issue with `getting-started` label
