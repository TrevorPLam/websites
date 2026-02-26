# apps/portal

Client portal application for multi-tenant SaaS platform.

## Overview

This is the client portal application that provides tenants with a comprehensive dashboard to manage their marketing websites, view analytics, configure settings, and access billing information. Built with Next.js 16 and React 19, it offers a white-labelable interface that can be customized per tenant.

## Key Features

- **Dashboard**: Real-time analytics and performance metrics
- **Content Management**: Blog posts, pages, and media management
- **Lead Management**: Contact form submissions and lead tracking
- **Settings Management**: Site configuration and branding options
- **Billing Portal**: Subscription management and payment history
- **White-label Interface**: Customizable branding per tenant

## Technology Stack

- **Framework**: Next.js 16.1.5 with App Router
- **UI**: React 19.0.0 with Server Components
- **Styling**: Tailwind CSS v4 with dynamic theming
- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **Database**: Supabase with Row Level Security (RLS)
- **Analytics**: Tinybird for real-time metrics
- **Email**: Resend for transactional emails

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
apps/portal/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── features/            # Business logic features
│   ├── analytics/       # Analytics dashboard
│   ├── leads/          # Lead management
│   ├── settings/       # Site configuration
│   └── billing/        # Billing portal
├── lib/                # Utility functions
└── public/             # Static assets
```

## Multi-tenant Features

- **Tenant Isolation**: Complete data separation via RLS policies
- **Dynamic Theming**: Per-tenant branding and styling
- **Custom Domains**: Support for custom domain mapping
- **Role-based Access**: Tenant-specific user permissions
- **Real-time Updates**: WebSocket integration for live data

## Security

- Row Level Security (RLS) for data isolation
- JWT-based authentication with tenant context
- Secure file uploads with virus scanning
- Audit logging for all tenant actions
- GDPR compliance tools for data management

## White-label Capabilities

- Custom logo and color schemes
- Domain-specific branding
- Custom CSS injection for advanced styling
- Email template customization
- Custom domain support with SSL

## Related Documentation

- [Multi-tenant Architecture](../../docs/guides/multi-tenant/)
- [White-label Portal Architecture](../../docs/guides/architecture/white-label-portal-architecture.md)
- [Client Portal Configuration](../../docs/guides/architecture/client-portal-configuration.md)
- [Platform Documentation](../../README.md)
