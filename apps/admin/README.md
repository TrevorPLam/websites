# apps/admin

Administrative dashboard for multi-tenant SaaS platform management.

## Overview

This is the administrative dashboard application that provides comprehensive management capabilities for the multi-tenant marketing platform. Built with Next.js 16 and React 19, it offers tenant management, analytics, billing oversight, and system administration features.

## Key Features

- **Tenant Management**: Create, configure, and manage client sites
- **Analytics Dashboard**: Real-time metrics and performance insights
- **Billing Administration**: Subscription management and revenue tracking
- **User Management**: Admin role-based access control
- **System Monitoring**: Health checks and operational metrics

## Technology Stack

- **Framework**: Next.js 16.1.5 with App Router
- **UI**: React 19.0.0 with Server Components
- **Styling**: Tailwind CSS v4 with design tokens
- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **Data**: Supabase for backend services
- **Charts**: Real-time analytics visualization

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
apps/admin/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── features/            # Business logic features
│   ├── tenants/         # Tenant management
│   ├── analytics/       # Analytics dashboard
│   └── billing/         # Billing administration
├── lib/                # Utility functions
└── public/             # Static assets
```

## Access Control

The admin dashboard implements role-based access control (RBAC) with the following roles:

- **Super Admin**: Full system access
- **Tenant Admin**: Limited to assigned tenants
- **Billing Admin**: Billing and subscription management
- **Analytics Viewer**: Read-only analytics access

## Security

- Multi-factor authentication (MFA) required
- Session timeout and secure cookie handling
- Audit logging for all administrative actions
- IP whitelisting for enhanced security

## Related Documentation

- [Multi-tenant Architecture](../../docs/guides/multi-tenant/)
- [Authentication System](../../packages/auth/README.md)
- [Analytics Integration](../../packages/analytics/README.md)
- [Billing System](../../packages/billing/README.md)
