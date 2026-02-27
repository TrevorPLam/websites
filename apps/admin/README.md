---
doc_id: "ADMIN-2026-APP-README"
doc_version: "2.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "admin-team@marketing-websites.com"

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
- [Security Guide](../../SECURITY.md)
- [Contributing Guide](../../CONTRIBUTING.md)
