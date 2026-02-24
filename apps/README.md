# 🚀 Applications

> **Next.js 16 applications for the marketing websites platform**

This directory contains the three core applications that make up the marketing websites platform. Each application is built with Next.js 16, React 19, and TypeScript, following the Feature-Sliced Design (FSD) v2.1 architecture.

---

## 📁 Application Structure

```
apps/
├── admin/           # Administrative dashboard
├── portal/          # Client portal for site management
└── web/             # Marketing site template
```

---

## 🎯 Applications Overview

### **Admin Dashboard** (`apps/admin/`)

**Purpose**: Internal administrative interface for platform management

**Key Features**:

- Client management and onboarding
- Billing oversight and subscription management
- Platform analytics and reporting
- System configuration and settings
- User access control and permissions

**Technology Stack**:

- Next.js 16 with App Router
- React 19 Server Components
- TypeScript strict mode
- Tailwind CSS v4
- Multi-tenant security

**Access**: Internal use only - platform administrators

---

### **Client Portal** (`apps/portal/`)

**Purpose**: Client-facing portal for managing marketing websites

**Key Features**:

- Site configuration and content management
- Lead management and analytics
- Booking and scheduling management
- Billing and subscription management
- Real-time notifications and updates

**Technology Stack**:

- Next.js 16 with App Router
- React 19 Server Components
- Real-time features with Supabase
- Multi-tenant data isolation
- Progressive Web App features

**Access**: Authenticated clients only

---

### **Marketing Web** (`apps/web/`)

**Purpose**: Template and demonstration for marketing websites

**Key Features**:

- Marketing site template
- Feature-Sliced Design implementation
- Performance optimization examples
- Accessibility compliance (WCAG 2.2 AA)
- SEO optimization patterns

**Technology Stack**:

- Next.js 16 with App Router
- React 19 Server Components
- Tailwind CSS v4
- Core Web Vitals optimization
- Multi-tenant ready

**Access**: Public demonstration

---

## 🏗️ Architecture Patterns

### **Shared Architecture**

All applications follow the same architectural patterns:

#### **Feature-Sliced Design (FSD) v2.1**

```
src/
├── app/             # App layer (layouts, pages)
├── pages/           # Pages layer (route components)
├── widgets/         # Widgets layer (composed features)
├── features/        # Features layer (business logic)
├── entities/        # Entities layer (domain models)
└── shared/          # Shared layer (utilities, types)
```

#### **Multi-Tenant Security**

- OAuth 2.1 with PKCE authentication
- Row Level Security (RLS) for data isolation
- Tenant context propagation
- Rate limiting per tenant
- Audit logging

#### **Performance Optimization**

- Core Web Vitals targets (LCP <2.5s, INP <200ms, CLS <0.1)
- Edge caching and optimization
- Bundle size discipline
- Progressive enhancement

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js ≥ 22.0.0
- pnpm ≥ 9.0
- Environment variables configured

### **Development Commands**

```bash
# Start all applications
pnpm dev

# Start specific application
pnpm dev:admin          # Admin dashboard
pnpm dev:portal         # Client portal
pnpm dev:web            # Marketing site

# Build all applications
pnpm build

# Build specific application
pnpm build:admin
pnpm build:portal
pnpm build:web
```

### **Environment Setup**

Each application requires specific environment variables:

```bash
# Copy environment template
cp .env.example .env.local

# Required variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🔧 Development Guidelines

### **Code Standards**

- **TypeScript**: Strict mode enabled
- **ESLint**: Custom rules for FSD compliance
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality

### **FSD Compliance**

- Follow unidirectional dependencies
- Use @x notation for cross-slice imports
- Maintain layer separation
- Validate with `pnpm lint:fsd`

### **Security Requirements**

- All Server Actions must use `secureAction`
- Tenant context required for data operations
- Input validation with Zod schemas
- No sensitive data in client code

### **Performance Standards**

- Core Web Vitals compliance
- Bundle size budgets enforced
- Image optimization required
- Loading states for all async operations

---

## 📊 Application Metrics

### **Performance Targets**

- **LCP**: <2.5s (75th percentile)
- **INP**: <200ms (75th percentile)
- **CLS**: <0.1 (75th percentile)
- **FCP**: <1.8s (75th percentile)

### **Quality Metrics**

- **TypeScript**: 100% type coverage
- **Test Coverage**: >80% target
- **Accessibility**: WCAG 2.2 AA compliance
- **Security**: Zero high vulnerabilities

### **Bundle Sizes**

- **Admin**: <500KB (gzipped)
- **Portal**: <400KB (gzipped)
- **Web**: <300KB (gzipped)

---

## 🔗 Integration Points

### **Shared Packages**

All applications integrate with shared packages:

```typescript
// UI Components
import { Button, Card } from '@repo/ui';

// Business Features
import { BookingWidget, LeadForm } from '@repo/features';

// Infrastructure
import { secureAction, authMiddleware } from '@repo/infra';

// Shared Utilities
import { formatDate, validateEmail } from '@repo/shared';
```

### **External Services**

- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **HubSpot**: CRM integration
- **Cal.com**: Scheduling system
- **Resend**: Email delivery
- **Sentry**: Error tracking

---

## 🧪 Testing Strategy

### **Test Types**

- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: axe-core compliance

### **Testing Commands**

```bash
# Run all tests
pnpm test

# Run specific app tests
pnpm test:admin
pnpm test:portal
pnpm test:web

# E2E testing
pnpm test:e2e

# Accessibility testing
pnpm test:a11y
```

### **Coverage Requirements**

- **Statements**: >80%
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%

---

## 🚀 Deployment

### **Vercel Deployment**

All applications deploy to Vercel with automatic previews:

```bash
# Deploy to production
pnpm deploy

# Deploy preview for PR
# Automatic on PR creation
```

### **Environment Configuration**

- **Development**: localhost with hot reload
- **Staging**: Vercel preview deployments
- **Production**: Vercel production with edge optimization

### **Domain Configuration**

- **Admin**: admin.your-platform.com
- **Portal**: portal.your-platform.com
- **Web**: web.your-platform.com

---

## 📚 Documentation

### **Application-Specific Documentation**

- **[Admin Guide](apps/admin/README.md)** - Admin dashboard documentation
- **[Portal Guide](apps/portal/README.md)** - Client portal documentation
- **[Web Guide](apps/web/README.md)** - Marketing site documentation

### **Platform Documentation**

- **[README.md](../README.md)** - Platform overview
- **[DESIGN.md](../DESIGN.md)** - Architecture and design
- **[CODEMAP.md](../CODEMAP.md)** - Code navigation
- **[INDEX.md](../INDEX.md)** - Repository index

---

## 🤝 Contributing

### **Development Workflow**

1. Create feature branch from main
2. Implement changes following FSD patterns
3. Add tests for new functionality
4. Run quality checks (`pnpm lint`, `pnpm test`)
5. Submit pull request with description

### **Code Review Requirements**

- FSD compliance validation
- Security review for data operations
- Performance impact assessment
- Accessibility compliance check
- Test coverage verification

---

## 📞 Support

### **Getting Help**

- **Documentation**: Check application-specific README files
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Slack**: Internal team channel for real-time help

### **Troubleshooting**

- **Build Issues**: Check environment variables and dependencies
- **Runtime Issues**: Check logs and Sentry errors
- **Performance Issues**: Check Core Web Vitals and bundle analysis
- **Security Issues**: Follow security reporting guidelines

---

_Each application is designed to be independently deployable while sharing common packages and patterns for consistency and maintainability._
