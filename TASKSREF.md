# Master Documentation Strategy & Implementation Guide

**Version:** 5.0 (Repository-Calibrated)  
**Date:** February 26, 2026  
**Repository:** marketing-websites monorepo  
**Status:** Implementation-Ready  
**Audience:** Technical Leads, Architects, AI/ML Engineers, Documentation Team

---

## Executive Summary

This master guide consolidates research-validated documentation engineering patterns with your repository's actual structure to create an actionable implementation plan. Key findings:

**What's Already Strong:**

- Diátaxis framework implemented in two locations (`docs/` and `mcp/docs/`)
- MCP infrastructure operational with 15 custom servers
- Zod 3.25.76 installed and actively used
- FSD v2.1 architecture enforced via Steiger
- AI agent context system (`AGENTS.md`, `CLAUDE.md`, per-package guidance)

**Critical Gaps to Address:**

- Four parallel documentation trees causing confusion
- JSON schema without runtime enforcement
- Manual processes claiming to be automated
- Legacy content without migration strategy
- No freshness monitoring or staleness detection

---

## Part 1: Architecture Foundation

### 1.1 Current State Analysis

Your repository has **four overlapping documentation systems**:

```
docs/
├── guides/              ← LEGACY (200+ files, migration incomplete)
├── guides-new/          ← NEW consolidated guides (partial migration)
├── tutorials/           ← Diátaxis (active)
├── how-to/             ← Diátaxis (active)
├── reference/          ← Diátaxis (active)
├── explanation/        ← Diátaxis (active)
└── frontmatter-schema.json  ← JSON (no runtime enforcement)

mcp/docs/               ← SEPARATE Diátaxis tree
├── tutorials/
├── how-to/
├── reference/
└── explanation/
```

**Problem:** Multiple sources of truth create confusion for developers and AI agents.

### 1.2 Target Architecture (Single Source of Truth)

```
docs/                              ← UNIFIED AUTHORITATIVE ROOT
├── .config/
│   ├── frontmatter.schema.ts     # Zod schema (source of truth)
│   ├── vale.ini                  # Prose linting rules
│   └── controlled-vocabulary.json # Domain terms
│
├── tutorials/                     # Learning-oriented (Diátaxis)
│   ├── getting-started/
│   └── advanced-workflows/
│
├── how-to/                       # Task-oriented (Diátaxis)
│   ├── setup-configuration/
│   ├── troubleshooting/
│   └── production-deployment/
│
├── reference/                    # Information-oriented (Diátaxis)
│   ├── api/
│   ├── configuration/
│   ├── environment/
│   └── mcp/                     # ← MCP reference moved here
│
├── explanation/                  # Understanding-oriented (Diátaxis)
│   ├── architecture/
│   │   ├── adr/                 # Architecture Decision Records
│   │   └── system-design/
│   ├── mcp/                     # ← MCP explanations moved here
│   └── multi-tenant/
│
├── guides/                       # ← ARCHIVED (frozen, redirects only)
│   └── _ARCHIVED.md             # "Content migrated to docs/explanation/"
│
└── .output/
    └── manifest.json            # Auto-generated AI-consumable index

mcp/docs/ → SYMLINK to ../docs/  # ← Eliminate duplicate tree
```

**Migration Strategy:**

1. Freeze `docs/guides/` - no new files accepted
2. Move `mcp/docs/` content under `docs/explanation/mcp/` and `docs/reference/mcp/`
3. Create redirects/aliases for legacy paths
4. Update all internal links

---

## Part 2: Validated Frontmatter Schema

### 2.1 Schema Migration: JSON → Zod

Replace `docs/frontmatter-schema.json` with TypeScript Zod schema for runtime enforcement.

**File:** `docs/.config/frontmatter.schema.ts`

```typescript
/**
 * Documentation Frontmatter Schema
 *
 * Source of truth for all documentation metadata validation.
 * Used by CI/CD pipeline for enforcement before merge.
 *
 * @see https://github.com/HiDeoo/zod-matter for zod-matter integration
 */

import { z } from 'zod';

/**
 * Domain categories specific to marketing-websites monorepo
 */
const domains = [
  'security',
  'performance',
  'architecture',
  'development',
  'operations',
  'ai',
  'business',
  'mcp', // Model Context Protocol
  'multi-tenant', // Multi-tenancy patterns
  'payments', // Payment processing
  'email', // Email delivery
  'seo', // SEO optimization
  'testing', // Testing strategies
  'accessibility', // WCAG compliance
  'infrastructure', // DevOps/Infrastructure
] as const;

/**
 * Audience types including non-technical stakeholders
 */
const audiences = [
  'architect',
  'developer',
  'devops',
  'business',
  'qa',
  'ai',
  'non-technical', // Business stakeholders, project managers
] as const;

/**
 * FSD v2.1 layers for package-level documentation
 */
const fsdLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] as const;

/**
 * Main documentation frontmatter schema
 *
 * Every .md file in docs/ and packages/*\/docs/ must validate against this.
 */
export const docSchema = z.object({
  // Core metadata
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(120, 'Title must be under 120 characters for SEO'),

  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(300, 'Description must be under 300 characters for AI snippets'),

  // Categorization
  domain: z.enum(domains, {
    errorMap: () => ({ message: `Domain must be one of: ${domains.join(', ')}` }),
  }),

  type: z.enum(['tutorial', 'how-to', 'reference', 'explanation'], {
    errorMap: () => ({ message: 'Type must follow Diátaxis framework' }),
  }),

  layer: z.enum(['global', 'app', 'package', 'slice', 'mcp'], {
    errorMap: () => ({ message: 'Layer indicates doc scope and location' }),
  }),

  // Optional package-specific metadata
  package: z.string().optional(),

  fsd_layer: z.enum(fsdLayers).optional(),

  // Audience targeting (minimum one required)
  audience: z.array(z.enum(audiences)).min(1, 'At least one audience required'),

  // Phased rollout tracking (0-3)
  phase: z.number().int().min(0).max(3),

  complexity: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),

  // Freshness monitoring (ISO date string for Zod 3.x compatibility)
  freshness_review: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be ISO date format YYYY-MM-DD')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Must be a valid date'),

  // Code example validation status
  validation_status: z.enum(['tested', 'stale', 'unverified']).default('unverified'),

  // Cross-linking
  related: z.array(z.string()).optional(),

  last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be ISO date format YYYY-MM-DD'),

  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Must be semver format')
    .optional(),

  // Repository-specific extensions
  task_id: z
    .string()
    .regex(/^[A-Z]+-\d+(-\d+(-\d+)?)?$/, 'Must match DOMAIN-XX-X-X pattern')
    .optional(),

  legacy_path: z.string().optional().describe('Original path for migrated docs from guides/ tree'),

  // Technical specifications
  tech_stack: z.array(z.string()).optional(),

  prerequisites: z.array(z.string()).optional(),
});

/**
 * Type inference for TypeScript usage
 */
export type DocFrontmatter = z.infer<typeof docSchema>;

/**
 * Validation helper for use in scripts
 */
export function validateFrontmatter(data: unknown): DocFrontmatter {
  return docSchema.parse(data);
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeParseFrontmatter(data: unknown) {
  return docSchema.safeParse(data);
}
```

### 2.2 Validation Script

**File:** `scripts/validate-frontmatter.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Frontmatter Validation Script
 *
 * Validates all markdown frontmatter against Zod schema.
 * Used in CI/CD pipeline and pre-commit hooks.
 *
 * Usage:
 *   pnpm tsx scripts/validate-frontmatter.ts
 *   pnpm tsx scripts/validate-frontmatter.ts --glob "docs/**\/*.md"
 *   pnpm tsx scripts/validate-frontmatter.ts --fix
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import { readFile, writeFile } from 'fs/promises';
import { docSchema, type DocFrontmatter } from '../docs/.config/frontmatter.schema';
import chalk from 'chalk';

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

async function validateFile(filePath: string): Promise<ValidationResult> {
  const content = await readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  const result = docSchema.safeParse(data);

  if (result.success) {
    // Check for warnings (valid but could be improved)
    const warnings: string[] = [];

    // Warn if freshness_review is in the past
    const reviewDate = new Date(result.data.freshness_review);
    if (reviewDate < new Date()) {
      warnings.push(`Freshness review date is past due: ${result.data.freshness_review}`);
    }

    // Warn if validation_status is unverified
    if (result.data.validation_status === 'unverified') {
      warnings.push('Code examples not validated - set validation_status to "tested"');
    }

    return {
      file: filePath,
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  // Parse Zod errors
  const errors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);

  return {
    file: filePath,
    valid: false,
    errors,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const pattern = args.find((arg) => arg.startsWith('--glob='))?.split('=')[1] || 'docs/**/*.md';

  const fix = args.includes('--fix');

  console.log(chalk.blue(`\n🔍 Validating documentation frontmatter...\n`));
  console.log(chalk.gray(`Pattern: ${pattern}\n`));

  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/.output/**', '**/guides/**'],
  });

  console.log(chalk.gray(`Found ${files.length} files\n`));

  const results: ValidationResult[] = [];

  for (const file of files) {
    const result = await validateFile(file);
    results.push(result);

    if (!result.valid) {
      console.log(chalk.red(`✗ ${file}`));
      result.errors?.forEach((err) => console.log(chalk.red(`  ${err}`)));
    } else if (result.warnings) {
      console.log(chalk.yellow(`⚠ ${file}`));
      result.warnings?.forEach((warn) => console.log(chalk.yellow(`  ${warn}`)));
    } else {
      console.log(chalk.green(`✓ ${file}`));
    }
  }

  // Summary
  const valid = results.filter((r) => r.valid).length;
  const invalid = results.filter((r) => !r.valid).length;
  const warnings = results.filter((r) => r.warnings).length;

  console.log(chalk.blue(`\n📊 Summary:`));
  console.log(chalk.green(`  Valid: ${valid}`));
  console.log(chalk.yellow(`  Warnings: ${warnings}`));
  console.log(chalk.red(`  Invalid: ${invalid}`));

  if (invalid > 0) {
    console.log(chalk.red(`\n❌ Validation failed. Fix errors before committing.\n`));
    process.exit(1);
  }

  if (warnings > 0) {
    console.log(chalk.yellow(`\n⚠️  Validation passed with warnings.\n`));
  } else {
    console.log(chalk.green(`\n✅ All documentation is valid!\n`));
  }
}

main().catch(console.error);
```

---

## Part 3: Documentation Templates

### 3.1 Tutorial Template (Learning-Oriented)

**Optimized for:** Progressive disclosure, AI parsing, hands-on learning

````markdown
---
title: 'Build Your First Multi-Tenant Dashboard'
description: 'Step-by-step tutorial for creating a tenant-isolated analytics dashboard with Row-Level Security and real-time updates'
domain: 'multi-tenant'
type: 'tutorial'
layer: 'global'
audience: ['developer', 'architect']
phase: 1
complexity: 'intermediate'
freshness_review: '2026-05-26'
validation_status: 'tested'
related: ['ADR-003', 'packages/features/analytics/README.md']
last_updated: '2026-02-26'
task_id: 'DOMAIN-7-3-2'
tech_stack: ['Next.js 16', 'React 19', 'Supabase', 'TypeScript']
prerequisites: ['Basic Next.js knowledge', 'PostgreSQL fundamentals']
---

# Build Your First Multi-Tenant Dashboard

**Time Required:** 45 minutes  
**Difficulty:** Intermediate  
**What You'll Build:** A real-time analytics dashboard with tenant isolation

## What You'll Learn

By the end of this tutorial, you'll understand:

- **Multi-tenant architecture** patterns with database-level isolation
- **Row-Level Security (RLS)** implementation in PostgreSQL
- **Real-time subscriptions** with tenant context
- **Performance optimization** for dashboard queries

## Prerequisites

Before starting, ensure you have:

- [ ] Development environment setup ([Quick Start Guide](../getting-started/quick-start.md))
- [ ] Basic understanding of SQL and database concepts
- [ ] Familiarity with React hooks and Next.js App Router

## Step 1: Create the Database Schema

First, we'll set up the analytics tables with proper tenant isolation.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+
-- File: database/migrations/003_analytics_tables.sql

-- Enable Row Level Security
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Tenants can only access their own analytics"
  ON analytics_events
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Performance: Create indexes
CREATE INDEX idx_analytics_tenant_created
  ON analytics_events(tenant_id, created_at DESC);
```
````

**Key Concept:** Row-Level Security (RLS) enforces tenant isolation at the database layer, preventing accidental data leakage even if application code has bugs.

## Step 2: Set Up Tenant Context Middleware

Create middleware to inject tenant context into every request.

```typescript
// Tested: 2026-02-26 | Framework: Next.js 16
// File: apps/web/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantFromRequest } from '@repo/multi-tenant';

export async function middleware(request: NextRequest) {
  const tenant = await getTenantFromRequest(request);

  if (!tenant) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Clone response and add tenant header
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);

  return response;
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

## Step 3: Create the Dashboard Component

Build the UI component with real-time updates.

```typescript
// Tested: 2026-02-26 | Framework: React 19
// File: packages/features/src/analytics/AnalyticsDashboard.tsx

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/integrations/supabase';
import { Card, Chart } from '@repo/ui';

interface AnalyticsData {
  date: string;
  views: number;
  conversions: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial data
    async function fetchData() {
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data for chart
      const aggregated = aggregateByDate(events);
      setData(aggregated);
      setLoading(false);
    }

    fetchData();

    // Subscribe to real-time updates (tenant-filtered automatically via RLS)
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        (payload) => {
          setData(prev => updateWithNewEvent(prev, payload.new));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) return <Card>Loading analytics...</Card>;

  return (
    <div className="grid gap-4">
      <Card>
        <h2 className="text-2xl font-bold mb-4">7-Day Overview</h2>
        <Chart data={data} type="line" />
      </Card>
    </div>
  );
}

function aggregateByDate(events: any[]): AnalyticsData[] {
  // Implementation details...
  return [];
}

function updateWithNewEvent(prev: AnalyticsData[], newEvent: any): AnalyticsData[] {
  // Implementation details...
  return prev;
}
```

## Step 4: Test Tenant Isolation

Verify that RLS policies work correctly.

```bash
# Run automated test suite
pnpm test:integration --filter=@repo/features -- analytics

# Expected output:
# ✓ Dashboard shows only tenant-specific data
# ✓ Real-time updates filtered by tenant
# ✓ Cross-tenant data access blocked
```

## Validation

Run these checks to ensure everything works:

```bash
# 1. Type check
pnpm type-check

# 2. Run tests
pnpm test:docs --pattern=multi-tenant-dashboard

# 3. Start development server
pnpm dev

# 4. Open http://localhost:3000/dashboard
```

## Troubleshooting

### Issue: 403 Forbidden Errors

**Cause:** Tenant context middleware not injecting tenant_id  
**Solution:** Check middleware configuration and verify tenant cookie/header

```typescript
// Debug tenant context
console.log('Tenant ID:', request.headers.get('x-tenant-id'));
```

### Issue: Real-time Updates Not Working

**Cause:** RLS policy blocking subscription channel  
**Solution:** Ensure tenant_id is set in session context before subscribing

## Next Steps

- [ ] Add filtering and date range controls ([How-to Guide](../../how-to/dashboard-filters.md))
- [ ] Implement data export ([How-to Guide](../../how-to/export-analytics.md))
- [ ] Optimize query performance ([Reference](../../reference/performance-optimization.md))
- [ ] Add custom metrics ([Tutorial](./custom-analytics-metrics.md))

## Related Resources

- [Multi-Tenancy Architecture](../../explanation/multi-tenant/architecture.md)
- [RLS Best Practices](../../how-to/rls-best-practices.md)
- [Real-time Subscriptions](../../reference/supabase-realtime.md)

````

### 3.2 How-To Guide Template (Task-Oriented)

**Optimized for:** Goal-focused problem-solving, action verbs, quick reference

```markdown
---
title: "Implement Row-Level Security Policies"
description: "Production-ready guide for implementing RLS policies with tenant isolation, performance optimization, and security best practices"
domain: "security"
type: "how-to"
layer: "global"
audience: ["developer", "devops", "architect"]
phase: 1
complexity: "advanced"
freshness_review: "2026-05-26"
validation_status: "tested"
related: ["ADR-003", "docs/explanation/multi-tenant/rls-architecture.md"]
last_updated: "2026-02-26"
task_id: "DOMAIN-4-2-1"
tech_stack: ["PostgreSQL 15+", "Supabase"]
prerequisites: ["Admin database access", "Understanding of SQL"]
---

# Implement Row-Level Security Policies

**Goal:** Secure multi-tenant data at the database level
**Time Required:** 30 minutes
**Impact:** High - Prevents data leakage between tenants

## Prerequisites

- [ ] PostgreSQL 15+ database with Supabase
- [ ] Admin access to run migrations
- [ ] Tenant table structure in place

## Implementation

### 1. Enable RLS on Target Tables

**Enable Row-Level Security** on all multi-tenant tables.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
````

**Note:** Use **SVO sentence structure** for AI parsing: "The system enables RLS" not "RLS is enabled by the system".

### 2. Create Policy Function

The **policy function checks tenant context**. It returns true only for matching tenant_ids.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;
```

### 3. Create RLS Policies

Apply policies for all CRUD operations.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

-- SELECT policy
CREATE POLICY "Users can view their tenant's data"
  ON leads
  FOR SELECT
  USING (tenant_id = current_tenant_id());

-- INSERT policy
CREATE POLICY "Users can insert into their tenant"
  ON leads
  FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

-- UPDATE policy
CREATE POLICY "Users can update their tenant's data"
  ON leads
  FOR UPDATE
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());

-- DELETE policy
CREATE POLICY "Users can delete their tenant's data"
  ON leads
  FOR DELETE
  USING (tenant_id = current_tenant_id());
```

### 4. Set Tenant Context in Application

**Middleware sets tenant context** for every request.

```typescript
// Tested: 2026-02-26 | Framework: Next.js 16
// File: packages/infrastructure/src/database/tenant-context.ts

import { createClient } from '@supabase/supabase-js';

export async function setTenantContext(tenantId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Set tenant context for session
  await supabase.rpc('set_config', {
    setting: 'app.current_tenant_id',
    value: tenantId,
    is_local: true,
  });
}
```

### 5. Performance Optimization

**Create indexes** to avoid sequential scans when filtering by tenant_id.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

-- Composite index for tenant + commonly queried columns
CREATE INDEX idx_leads_tenant_created
  ON leads(tenant_id, created_at DESC);

CREATE INDEX idx_contacts_tenant_email
  ON contacts(tenant_id, email);

-- Verify index usage
EXPLAIN ANALYZE
SELECT * FROM leads
WHERE tenant_id = 'uuid-here'
ORDER BY created_at DESC
LIMIT 10;

-- Expected: Index Scan using idx_leads_tenant_created
```

## Validation

### Automated Testing

```bash
# Run RLS policy tests
pnpm test:integration --filter=@repo/infrastructure -- rls

# Expected output:
# ✓ RLS blocks cross-tenant SELECT queries
# ✓ RLS blocks cross-tenant INSERT attempts
# ✓ RLS allows same-tenant operations
# ✓ Performance: Queries use tenant_id index
```

### Manual Verification

```sql
-- Test RLS enforcement
SET app.current_tenant_id = 'tenant-a-uuid';

-- This should return only tenant-a data
SELECT count(*) FROM leads;

-- Attempt to access tenant-b data (should return 0)
SELECT count(*) FROM leads WHERE tenant_id = 'tenant-b-uuid';
```

## Troubleshooting

| Symptom              | Cause                      | Solution                                            |
| -------------------- | -------------------------- | --------------------------------------------------- |
| 403 Forbidden errors | Missing tenant context     | Verify `setTenantContext()` called in middleware    |
| Slow queries         | Missing indexes            | Create composite index on `(tenant_id, created_at)` |
| Empty result sets    | Incorrect tenant_id format | Ensure UUID format, not string                      |
| Policy not applied   | RLS disabled               | Verify `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`  |

## Security Checklist

- [ ] RLS enabled on all multi-tenant tables
- [ ] Policies cover all operations (SELECT, INSERT, UPDATE, DELETE)
- [ ] Tenant context set before every database operation
- [ ] Service role key never exposed to client
- [ ] Indexes created for tenant_id filtering
- [ ] Automated tests verify isolation

## Performance Impact

- **Query Overhead:** < 1ms per query for policy evaluation
- **Index Requirement:** Composite indexes on `(tenant_id, frequently_filtered_column)`
- **Connection Pooling:** Use PgBouncer with tenant-aware routing for >1000 tenants

## Related Resources

- [Multi-Tenancy Architecture](../../explanation/multi-tenant/architecture.md)
- [Database Performance Guide](../../reference/database-performance.md)
- [Security Best Practices](../../explanation/security/defense-in-depth.md)

````

### 3.3 Reference Template (Information-Oriented)

**Optimized for:** Quick lookup, tables over lists, version tags, API contracts

```markdown
---
title: "Environment Variables Reference"
description: "Complete reference for all environment variables used across the marketing-websites monorepo with types, defaults, and validation rules"
domain: "operations"
type: "reference"
layer: "global"
audience: ["developer", "devops"]
phase: 0
complexity: "beginner"
freshness_review: "2026-05-26"
validation_status: "tested"
related: ["docs/how-to/setup-configuration.md"]
last_updated: "2026-02-26"
version: "1.0.0"
---

# Environment Variables Reference

Complete specification of all environment variables used in the monorepo.

## Core Application

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `NODE_ENV` | `'development' \| 'production' \| 'test'` | Yes | `'development'` | Node environment | 1.0.0+ |
| `NEXT_PUBLIC_SITE_URL` | `string` (URL) | Yes | `http://localhost:3000` | Public-facing site URL | 1.0.0+ |
| `SITE_NAME` | `string` | No | `'Marketing Website'` | Site display name | 1.0.0+ |
| `PORT` | `number` | No | `3000` | Server port | 1.0.0+ |

## Database (Supabase)

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `DATABASE_URL` | `string` (PostgreSQL URL) | Yes | - | Database connection string | 1.0.0+ |
| `NEXT_PUBLIC_SUPABASE_URL` | `string` (URL) | Yes | - | Supabase project URL | 1.0.0+ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `string` | Yes | - | Supabase anonymous key (client-safe) | 1.0.0+ |
| `SUPABASE_SERVICE_ROLE_KEY` | `string` | Yes | - | Supabase service role key (server-only) | 1.0.0+ |

**Security Note:** `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. **Never expose to client.**

## Authentication

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `NEXTAUTH_SECRET` | `string` (32+ chars) | Yes | - | NextAuth.js encryption secret | 1.0.0+ |
| `NEXTAUTH_URL` | `string` (URL) | Yes | `http://localhost:3000` | NextAuth.js callback URL | 1.0.0+ |
| `GITHUB_CLIENT_ID` | `string` | No | - | GitHub OAuth client ID | 1.2.0+ |
| `GITHUB_CLIENT_SECRET` | `string` | No | - | GitHub OAuth client secret | 1.2.0+ |

## Payment Processing (Stripe)

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `STRIPE_SECRET_KEY` | `string` (starts with `sk_`) | Yes* | - | Stripe secret key | 1.0.0+ |
| `STRIPE_PUBLISHABLE_KEY` | `string` (starts with `pk_`) | Yes* | - | Stripe publishable key | 1.0.0+ |
| `STRIPE_WEBHOOK_SECRET` | `string` (starts with `whsec_`) | Yes* | - | Stripe webhook signing secret | 1.0.0+ |

*Required if payments feature enabled

## Email Services

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `RESEND_API_KEY` | `string` | Yes* | - | Resend email API key | 1.0.0+ |
| `SENDGRID_API_KEY` | `string` | Yes* | - | SendGrid API key | 1.0.0+ |
| `EMAIL_FROM` | `string` (email) | Yes* | - | Default "from" email address | 1.0.0+ |

*At least one email provider required

## Analytics & Monitoring

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `NEXT_PUBLIC_ANALYTICS_ID` | `string` | No | - | Analytics tracking ID (client-safe) | 1.0.0+ |
| `ANALYTICS_ID` | `string` | No | - | Analytics server-side ID | 1.0.0+ |
| `SENTRY_DSN` | `string` (URL) | No | - | Sentry error tracking DSN | 1.0.0+ |
| `SENTRY_AUTH_TOKEN` | `string` | No | - | Sentry auth token for source maps | 1.0.0+ |

## Third-Party Integrations

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `HUBSPOT_API_KEY` | `string` | No | - | HubSpot CRM API key | 1.1.0+ |
| `CALCOM_API_KEY` | `string` | No | - | Cal.com scheduling API key | 1.3.0+ |
| `CONVERTKIT_API_KEY` | `string` | No | - | ConvertKit email marketing key | 1.2.0+ |

## Feature Flags

| Variable | Type | Required | Default | Description | Version |
|----------|------|----------|---------|-------------|---------|
| `ENABLE_ANALYTICS` | `'true' \| 'false'` | No | `'true'` | Enable analytics tracking | 1.0.0+ |
| `ENABLE_ERROR_REPORTING` | `'true' \| 'false'` | No | `'true'` | Enable Sentry error reporting | 1.0.0+ |
| `ENABLE_PAYMENTS` | `'true' \| 'false'` | No | `'false'` | Enable payment processing | 1.0.0+ |

## Validation Schema

Environment variables are validated at runtime using Zod:

```typescript
// Tested: 2026-02-26 | Framework: Next.js 16
// File: packages/config/src/env.ts

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(32),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
````

## Example Configuration

### Development (.env.local)

```bash
# Core
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME="Dev Marketing Site"

# Database
DATABASE_URL=postgresql://user:pass@localhost:54322/postgres
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Auth
NEXTAUTH_SECRET=your-32-character-secret-here
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_PAYMENTS=false
```

### Production (.env.production)

```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yoursite.com
SITE_NAME="Your Marketing Platform"

# Database (Supabase Production)
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Auth
NEXTAUTH_SECRET=production-secret-min-32-chars
NEXTAUTH_URL=https://yoursite.com

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yoursite.com

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
ENABLE_PAYMENTS=true
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use `.env.local`** for local development (gitignored)
3. **Rotate keys** after suspected exposure
4. **Service role keys** are server-only (never `NEXT_PUBLIC_*`)
5. **Validate environment** on application startup

## Deployment

### Vercel

Set environment variables in Vercel dashboard:

- Settings → Environment Variables
- Separate values for Production, Preview, Development

### Docker

Pass via `docker run` or `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_SITE_URL=https://yoursite.com
  - DATABASE_URL=${DATABASE_URL}
```

## Troubleshooting

| Issue                     | Cause                  | Solution                             |
| ------------------------- | ---------------------- | ------------------------------------ |
| `NEXTAUTH_SECRET` missing | Not set in environment | Generate: `openssl rand -base64 32`  |
| Supabase 401 errors       | Wrong API keys         | Verify keys match Supabase dashboard |
| Stripe webhook failures   | Wrong webhook secret   | Copy from Stripe dashboard webhooks  |
| Build fails validation    | Missing required vars  | Check console for Zod errors         |

## Related Resources

- [Configuration Guide](../../how-to/setup-configuration.md)
- [Deployment Guide](../../how-to/production-deployment.md)
- [Security Best Practices](../../explanation/security/environment-security.md)

````

### 3.4 Explanation Template (Understanding-Oriented)

**Optimized for:** Conceptual understanding, diagrams, SVO structure, architectural decisions

```markdown
---
title: "Multi-Tenancy Architecture"
description: "Deep dive into tenant isolation strategies using Row-Level Security, application-layer security, and performance optimization patterns for 1000+ tenant scale"
domain: "architecture"
type: "explanation"
layer: "global"
audience: ["architect", "developer"]
phase: 0
complexity: "advanced"
freshness_review: "2026-08-26"
validation_status: "tested"
related: ["ADR-003", "ADR-007", "docs/how-to/implement-rls.md"]
last_updated: "2026-02-26"
task_id: "DOMAIN-7-1-1"
tech_stack: ["PostgreSQL", "Next.js 16", "Supabase"]
---

# Multi-Tenancy Architecture

## Core Concept

**Multi-tenancy** is an architecture where a single application instance serves multiple tenants (customers). Our implementation uses **Row-Level Security (RLS)** for data isolation combined with **application-layer security** for defense-in-depth.

## Architecture Overview

```mermaid
graph TB
    Client[Client Request] --> Middleware[Tenant Resolution Middleware]
    Middleware --> Auth[Authentication Layer]
    Auth --> AppLayer[Application Layer]
    AppLayer --> DB[(Database with RLS)]

    Middleware -->|Set Tenant Context| TenantCtx[Tenant Context]
    TenantCtx --> AppLayer
    TenantCtx --> DB

    DB -->|tenant_id filter| RLS[RLS Policies]
    RLS -->|Enforce Isolation| Data[Tenant Data]
````

## Isolation Layers

Our architecture uses **three layers of isolation** for defense-in-depth:

### 1. Network Layer

**Edge functions resolve tenant** before requests reach the application.

```typescript
// Tested: 2026-02-26 | Platform: Vercel Edge
// File: apps/web/middleware.ts

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const tenant = await resolveTenant(hostname);

  if (!tenant) {
    return NextResponse.redirect('/404');
  }

  // Inject tenant context
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenant.id);
  return response;
}
```

### 2. Application Layer

**Application code validates tenant context** before operations.

```typescript
// Tested: 2026-02-26 | Framework: Next.js 16
// File: packages/infrastructure/src/tenant/validate.ts

export function validateTenantAccess(requestedTenantId: string, userTenantId: string): void {
  if (requestedTenantId !== userTenantId) {
    throw new TenantAccessError('Access denied: tenant mismatch', {
      requested: requestedTenantId,
      actual: userTenantId,
    });
  }
}
```

### 3. Database Layer (RLS)

**PostgreSQL RLS policies enforce isolation** at the data layer.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

CREATE POLICY "Tenant isolation policy"
  ON leads
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

## Tenant Resolution Strategies

### Strategy 1: Subdomain-Based

Each tenant gets a subdomain: `tenant-a.yoursite.com`

**Pros:**

- Clear branding separation
- Simple DNS configuration
- SEO-friendly

**Cons:**

- Requires wildcard SSL certificate
- DNS propagation delays

### Strategy 2: Path-Based

Tenants accessed via path: `yoursite.com/tenant-a`

**Pros:**

- Single domain
- No SSL complexity

**Cons:**

- URL structure may confuse users
- Harder to brand

### Strategy 3: Custom Domain

Each tenant uses custom domain: `tenant-a-company.com`

**Pros:**

- Full branding control
- Best SEO

**Cons:**

- Complex DNS setup
- Higher maintenance

**Our Choice:** **Subdomain-based** for balance of simplicity and branding (ADR-003).

## Enterprise Considerations

### Scaling to 1000+ Tenants

Bold critical metrics for AI extraction:

- **Connection Pooling:** PgBouncer with tenant-aware routing
- **Query Performance:** Sub-50ms latency per tenant with proper indexing
- **Storage Isolation:** Schema-per-tenant for enterprise customers (>100GB data)
- **Cache Strategy:** Redis with tenant-prefixed keys

### Performance Optimization

**Indexes are critical** for RLS performance at scale.

```sql
-- Tested: 2026-02-26 | Database: PostgreSQL 15+

-- Composite index for tenant + common filters
CREATE INDEX idx_leads_tenant_created
  ON leads(tenant_id, created_at DESC);

-- Partial index for active records
CREATE INDEX idx_leads_tenant_active
  ON leads(tenant_id, status)
  WHERE status = 'active';

-- Query plan should show "Index Scan" not "Seq Scan"
EXPLAIN ANALYZE
SELECT * FROM leads
WHERE tenant_id = 'uuid'
AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

### Cost Analysis

| Tenant Count | Approach          | DB Connections | Cost/Month\* |
| ------------ | ----------------- | -------------- | ------------ |
| 1-100        | RLS only          | 10-20          | $50          |
| 100-1000     | RLS + pooling     | 50-100         | $200         |
| 1000+        | Schema-per-tenant | 200+           | $1000+       |

\*Estimated for Supabase Pro tier

## Anti-Patterns Index

❌ **Do not** store tenant credentials in application memory (CVE-2025-29927 risk)  
✅ **Do** use short-lived JWTs with tenant claims

❌ **Do not** bypass RLS in service role contexts without explicit checks  
✅ **Do** validate tenant context even with service role

❌ **Do not** use `SELECT *` queries without tenant_id filter  
✅ **Do** always include tenant_id in WHERE clause

❌ **Do not** cache data across tenant boundaries  
✅ **Do** prefix cache keys with tenant_id

## API Contract Reference

### Tenant Context Header

| Parameter       | Type                              | Required | Description              | Version |
| --------------- | --------------------------------- | -------- | ------------------------ | ------- |
| `x-tenant-id`   | `UUID`                            | Yes      | Unique tenant identifier | 1.0.0+  |
| `x-tenant-plan` | `'free' \| 'pro' \| 'enterprise'` | No       | Tenant subscription tier | 1.2.0+  |

### Tenant Resolution Response

```typescript
interface TenantResolution {
  id: string; // UUID
  slug: string; // URL-safe identifier
  name: string; // Display name
  plan: 'free' | 'pro' | 'enterprise';
  settings: {
    customDomain?: string;
    features: string[];
  };
}
```

## Security Considerations

### 1. Tenant Enumeration Prevention

**Generic error messages** prevent tenant discovery attacks.

```typescript
// ❌ BAD: Exposes tenant existence
if (!tenant) {
  throw new Error(`Tenant '${slug}' not found`);
}

// ✅ GOOD: Generic message
if (!tenant) {
  throw new Error('Resource not found');
}
```

### 2. Cross-Tenant Attack Surface

**Attack vectors** to guard against:

1. **Insecure Direct Object Reference (IDOR):** Validate tenant_id in every request
2. **Session Fixation:** Regenerate sessions on tenant switch
3. **Cache Poisoning:** Never cache cross-tenant data
4. **SQL Injection:** Use parameterized queries with tenant_id

### 3. Audit Logging

**Every database operation logs tenant context** for compliance.

```typescript
// Tested: 2026-02-26 | Framework: Next.js 16
// File: packages/infrastructure/src/audit/logger.ts

export function logDatabaseOperation(
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
  table: string,
  tenantId: string,
  userId: string
) {
  auditLog.info({
    type: 'database_operation',
    operation,
    table,
    tenant_id: tenantId,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}
```

## Testing Strategy

### Unit Tests

```typescript
// Test tenant isolation
describe('TenantMiddleware', () => {
  it('blocks requests without tenant context', async () => {
    const response = await GET('/api/leads', {
      headers: {}, // No x-tenant-id
    });

    expect(response.status).toBe(401);
  });

  it('allows requests with valid tenant context', async () => {
    const response = await GET('/api/leads', {
      headers: { 'x-tenant-id': 'valid-uuid' },
    });

    expect(response.status).toBe(200);
  });
});
```

### Integration Tests

```bash
# Run multi-tenancy integration tests
pnpm test:integration --filter=@repo/infrastructure -- multi-tenant

# Expected output:
# ✓ RLS blocks cross-tenant SELECT
# ✓ RLS blocks cross-tenant INSERT
# ✓ Application layer validates tenant context
# ✓ Cache isolation prevents data leakage
```

## Migration Path

For existing single-tenant applications:

1. **Phase 1:** Add tenant_id column to all tables
2. **Phase 2:** Backfill tenant_id (single tenant UUID for now)
3. **Phase 3:** Enable RLS policies
4. **Phase 4:** Add tenant resolution middleware
5. **Phase 5:** Update application code to use tenant context

See [Migration Guide](../../how-to/migrate-to-multi-tenant.md) for detailed steps.

## Related Architecture Decisions

- [ADR-003: Row-Level Security for Tenant Isolation](../architecture/adr/adr-003-rls-tenant-isolation.md)
- [ADR-007: Subdomain-Based Tenant Resolution](../architecture/adr/adr-007-subdomain-resolution.md)
- [ADR-012: Connection Pooling Strategy](../architecture/adr/adr-012-connection-pooling.md)

## Further Reading

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-Tenant Data Architecture Patterns (Microsoft)](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)
- [Supabase RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)

````

***

## Part 4: MCP Integration

### 4.1 Relocate Documentation Server

**Current Location:** `mcp/scripts/documentation-server.ts`
**Target Location:** `mcp/servers/src/documentation-server.ts`

This aligns with your existing MCP server architecture pattern.

**File:** `mcp/servers/src/documentation-server.ts`

```typescript
#!/usr/bin/env node
/**
 * Documentation MCP Server
 *
 * Provides AI agents with semantic search and retrieval over documentation.
 * Implements Google Developer Knowledge API standard tool names.
 *
 * Tools:
 *   - search_document: Semantic search across docs
 *   - get_document: Retrieve specific document with validated frontmatter
 *   - find_examples: Locate tested code examples
 *   - check_freshness: Report documentation staleness
 *   - get_agent_context: Bridge AGENTS.md files to MCP
 *
 * @see https://ai.google.dev/api/context-protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import matter from 'gray-matter';
import { docSchema, type DocFrontmatter } from '../../docs/.config/frontmatter.schema.js';

interface DocumentManifest {
  files: {
    path: string;
    frontmatter: DocFrontmatter;
    size: number;
    lastModified: string;
  }[];
  generated: string;
}

class DocumentationServer {
  private server: Server;
  private manifest: DocumentManifest | null = null;
  private docsRoot: string;
  private manifestPath: string;

  constructor() {
    this.docsRoot = process.env.DOCS_ROOT || './docs';
    this.manifestPath = process.env.MANIFEST_PATH || './docs/.output/manifest.json';

    this.server = new Server(
      {
        name: 'documentation-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private async loadManifest(): Promise<DocumentManifest> {
    if (this.manifest) return this.manifest;

    try {
      const content = await readFile(this.manifestPath, 'utf-8');
      this.manifest = JSON.parse(content);
      return this.manifest!;
    } catch (error) {
      // Generate manifest if not found
      console.error('Manifest not found, generating...');
      return await this.generateManifest();
    }
  }

  private async generateManifest(): Promise<DocumentManifest> {
    const files = await glob(`${this.docsRoot}/**/*.md`, {
      ignore: ['**/node_modules/**', '**/.output/**', '**/guides/**'],
    });

    const manifest: DocumentManifest = {
      files: [],
      generated: new Date().toISOString(),
    };

    for (const filePath of files) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const { data } = matter(content);
        const parsed = docSchema.safeParse(data);

        if (parsed.success) {
          const stats = await readFile(filePath).then(buf => ({
            size: buf.length,
            lastModified: new Date().toISOString(),
          }));

          manifest.files.push({
            path: filePath.replace(this.docsRoot + '/', ''),
            frontmatter: parsed.data,
            size: stats.size,
            lastModified: stats.lastModified,
          });
        }
      } catch (error) {
        console.error(`Failed to process ${filePath}:`, error);
      }
    }

    this.manifest = manifest;
    return manifest;
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    // Execute tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search_document':
          return await this.searchDocument(args);
        case 'get_document':
          return await this.getDocument(args);
        case 'find_examples':
          return await this.findExamples(args);
        case 'check_freshness':
          return await this.checkFreshness(args);
        case 'get_agent_context':
          return await this.getAgentContext(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'search_document',
        description: 'Search documentation using semantic query across all documents. Returns relevant documents ranked by relevance.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query string',
            },
            domain: {
              type: 'string',
              enum: ['security', 'performance', 'architecture', 'development', 'operations', 'ai', 'business', 'mcp', 'multi-tenant', 'payments', 'email', 'seo', 'testing', 'accessibility'],
              description: 'Filter by domain',
            },
            type: {
              type: 'string',
              enum: ['tutorial', 'how-to', 'reference', 'explanation'],
              description: 'Filter by Diátaxis type',
            },
            audience: {
              type: 'string',
              enum: ['architect', 'developer', 'devops', 'business', 'qa', 'ai', 'non-technical'],
              description: 'Filter by target audience',
            },
            limit: {
              type: 'number',
              description: 'Maximum results to return',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_document',
        description: 'Retrieve a specific document by path with validated frontmatter and full content.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Document path relative to docs/ root',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'find_examples',
        description: 'Locate tested code examples by technology, FSD layer, or phase.',
        inputSchema: {
          type: 'object',
          properties: {
            technology: {
              type: 'string',
              description: 'Technology to search for (e.g., "Next.js", "PostgreSQL", "React")',
            },
            fsd_layer: {
              type: 'string',
              enum: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
              description: 'Filter by FSD layer',
            },
            phase: {
              type: 'number',
              description: 'Filter by implementation phase (0-3)',
            },
          },
          required: ['technology'],
        },
      },
      {
        name: 'check_freshness',
        description: 'Report documentation staleness metrics and identify documents needing review.',
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Check specific domain only',
            },
            threshold_days: {
              type: 'number',
              description: 'Days threshold for staleness warning',
              default: 90,
            },
          },
        },
      },
      {
        name: 'get_agent_context',
        description: 'Retrieve AGENTS.md content for a package, providing AI agent context and rules.',
        inputSchema: {
          type: 'object',
          properties: {
            package: {
              type: 'string',
              description: 'Package name (e.g., "@repo/ui", "features", "infrastructure")',
            },
          },
          required: ['package'],
        },
      },
    ];
  }

  private async searchDocument(args: any) {
    const manifest = await this.loadManifest();
    const { query, domain, type, audience, limit = 10 } = args;

    let results = manifest.files;

    // Apply filters
    if (domain) {
      results = results.filter(f => f.frontmatter.domain === domain);
    }
    if (type) {
      results = results.filter(f => f.frontmatter.type === type);
    }
    if (audience) {
      results = results.filter(f => f.frontmatter.audience.includes(audience));
    }

    // Simple relevance scoring (in production, use vector embeddings)
    const scored = results.map(doc => {
      const titleMatch = doc.frontmatter.title.toLowerCase().includes(query.toLowerCase());
      const descMatch = doc.frontmatter.description.toLowerCase().includes(query.toLowerCase());
      const score = (titleMatch ? 10 : 0) + (descMatch ? 5 : 0);
      return { doc, score };
    });

    // Sort by score and limit
    const sorted = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query,
            results: sorted.map(s => ({
              path: s.doc.path,
              title: s.doc.frontmatter.title,
              description: s.doc.frontmatter.description,
              domain: s.doc.frontmatter.domain,
              type: s.doc.frontmatter.type,
              relevance: s.score,
            })),
            total: sorted.length,
          }, null, 2),
        },
      ],
    };
  }

  private async getDocument(args: any) {
    const { path } = args;
    const fullPath = `${this.docsRoot}/${path}`;

    try {
      const content = await readFile(fullPath, 'utf-8');
      const { data, content: body } = matter(content);
      const parsed = docSchema.parse(data);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              path,
              frontmatter: parsed,
              content: body,
              size: content.length,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Document not found or invalid: ${path}`);
    }
  }

  private async findExamples(args: any) {
    const manifest = await this.loadManifest();
    const { technology, fsd_layer, phase } = args;

    let results = manifest.files.filter(f =>
      f.frontmatter.validation_status === 'tested'
    );

    // Filter by tech stack
    if (technology) {
      results = results.filter(f =>
        f.frontmatter.tech_stack?.some(tech =>
          tech.toLowerCase().includes(technology.toLowerCase())
        )
      );
    }

    // Filter by FSD layer
    if (fsd_layer) {
      results = results.filter(f => f.frontmatter.fsd_layer === fsd_layer);
    }

    // Filter by phase
    if (phase !== undefined) {
      results = results.filter(f => f.frontmatter.phase === phase);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            technology,
            examples: results.map(doc => ({
              path: doc.path,
              title: doc.frontmatter.title,
              tech_stack: doc.frontmatter.tech_stack,
              fsd_layer: doc.frontmatter.fsd_layer,
              phase: doc.frontmatter.phase,
            })),
            total: results.length,
          }, null, 2),
        },
      ],
    };
  }

  private async checkFreshness(args: any) {
    const manifest = await this.loadManifest();
    const { domain, threshold_days = 90 } = args;

    let results = manifest.files;

    if (domain) {
      results = results.filter(f => f.frontmatter.domain === domain);
    }

    const now = new Date();
    const thresholdMs = threshold_days * 24 * 60 * 60 * 1000;

    const stale = results.filter(f => {
      const reviewDate = new Date(f.frontmatter.freshness_review);
      return (now.getTime() - reviewDate.getTime()) > thresholdMs;
    });

    const unverified = results.filter(f =>
      f.frontmatter.validation_status === 'unverified'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            total_docs: results.length,
            stale_docs: stale.length,
            unverified_docs: unverified.length,
            staleness_rate: (stale.length / results.length * 100).toFixed(1) + '%',
            stale_list: stale.map(doc => ({
              path: doc.path,
              title: doc.frontmatter.title,
              freshness_review: doc.frontmatter.freshness_review,
              days_overdue: Math.floor(
                (now.getTime() - new Date(doc.frontmatter.freshness_review).getTime()) / (24 * 60 * 60 * 1000)
              ),
            })),
          }, null, 2),
        },
      ],
    };
  }

  private async getAgentContext(args: any) {
    const { package: pkgName } = args;

    // Map package names to paths
    const pathMap: Record<string, string> = {
      'ui': 'packages/ui/AGENTS.md',
      '@repo/ui': 'packages/ui/AGENTS.md',
      'features': 'packages/features/AGENTS.md',
      '@repo/features': 'packages/features/AGENTS.md',
      'infrastructure': 'packages/infrastructure/AGENTS.md',
      '@repo/infrastructure': 'packages/infrastructure/AGENTS.md',
      // Add more mappings as needed
    };

    const agentPath = pathMap[pkgName] || `packages/${pkgName}/AGENTS.md`;

    try {
      const content = await readFile(agentPath, 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              package: pkgName,
              path: agentPath,
              context: content,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Agent context not found for package: ${pkgName}`);
    }
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Documentation MCP server running on stdio');
  }
}

const server = new DocumentationServer();
server.run().catch(console.error);
````

### 4.2 Update MCP Configuration

**File:** `mcp/config/config.json`

Add documentation server to the existing configuration:

```json
{
  "mcpServers": {
    "documentation": {
      "command": "npx",
      "args": ["tsx", "mcp/servers/src/documentation-server.ts"],
      "env": {
        "DOCS_ROOT": "./docs",
        "SCHEMA_PATH": "./docs/.config/frontmatter.schema.ts",
        "MANIFEST_PATH": "./docs/.output/manifest.json"
      }
    },
    "enterprise-registry": {
      "command": "npx",
      "args": ["tsx", "mcp/servers/src/enterprise-registry.ts"]
    }
    // ... rest of existing servers
  }
}
```

---

## Part 5: CI/CD Pipeline

### 5.1 Documentation Validation Workflow

**File:** `.github/workflows/docs-validation.yml`

```yaml
name: Documentation Validation

on:
  push:
    paths:
      - 'docs/**/*.md'
      - 'packages/**/docs/**/*.md'
      - 'packages/**/README.md'
      - 'docs/.config/**'
  pull_request:
    paths:
      - 'docs/**/*.md'
      - 'packages/**/docs/**/*.md'
      - 'packages/**/README.md'
  schedule:
    - cron: '0 9 * * 1' # Monday 9 AM for freshness audit

jobs:
  validate-frontmatter:
    name: Validate Frontmatter Schema
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.29.2

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate Frontmatter
        run: npx tsx scripts/validate-frontmatter.ts --glob "docs/**/*.md"

      - name: Validate Package Docs
        run: npx tsx scripts/validate-frontmatter.ts --glob "packages/**/docs/**/*.md"

  check-freshness:
    name: Check Documentation Freshness
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.29.2

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check Freshness and Create Issues
        run: npx tsx scripts/check-freshness.ts --threshold=90 --create-issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  lint-prose:
    name: Lint Prose with Vale
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Vale
        uses: errata-ai/vale-action@v2
        with:
          files: '["docs/**/*.md", "packages/**/README.md"]'
          fail_on_error: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  check-links:
    name: Check Internal Links
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Lychee
        run: |
          wget https://github.com/lycheeverse/lychee/releases/download/v0.14.3/lychee-v0.14.3-x86_64-unknown-linux-gnu.tar.gz
          tar -xzf lychee-v0.14.3-x86_64-unknown-linux-gnu.tar.gz
          chmod +x lychee
          sudo mv lychee /usr/local/bin/

      - name: Check Links
        run: lychee docs/**/*.md packages/**/README.md --fail

  block-legacy-changes:
    name: Block New Files in Legacy Guides
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for New Legacy Files
        run: |
          # Get files changed in this PR
          CHANGED_FILES=$(git diff --name-only --diff-filter=A origin/${{ github.base_ref }}...HEAD)

          # Check if any new files added to docs/guides/
          if echo "$CHANGED_FILES" | grep -q "^docs/guides/" | grep -v "_ARCHIVED"; then
            echo "❌ Error: New files added to legacy docs/guides/ directory"
            echo "Please use docs/explanation/ or docs/tutorials/ instead"
            exit 1
          fi

          echo "✅ No new files in legacy guides directory"

  generate-manifest:
    name: Generate Documentation Manifest
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.29.2

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate Manifest
        run: npx tsx scripts/generate-doc-manifest.ts --output docs/.output/manifest.json

      - name: Commit Manifest
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore(docs): update documentation manifest [skip ci]'
          file_pattern: 'docs/.output/manifest.json'
```

### 5.2 Freshness Check Script

**File:** `scripts/check-freshness.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Documentation Freshness Check
 *
 * Monitors documentation staleness and optionally creates GitHub Issues
 * for documents past their freshness_review date.
 *
 * Usage:
 *   pnpm tsx scripts/check-freshness.ts
 *   pnpm tsx scripts/check-freshness.ts --threshold=60
 *   pnpm tsx scripts/check-freshness.ts --create-issues
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import { readFile } from 'fs/promises';
import { docSchema } from '../docs/.config/frontmatter.schema';
import chalk from 'chalk';
import { Octokit } from '@octokit/rest';

interface StaleDoc {
  path: string;
  title: string;
  freshness_review: string;
  days_overdue: number;
  domain: string;
}

async function checkFreshness() {
  const args = process.argv.slice(2);
  const thresholdDays = parseInt(
    args.find((arg) => arg.startsWith('--threshold='))?.split('=')[1] || '90'
  );
  const createIssues = args.includes('--create-issues');

  console.log(chalk.blue('\n🔍 Checking documentation freshness...\n'));
  console.log(chalk.gray(`Threshold: ${thresholdDays} days\n`));

  const files = await glob('docs/**/*.md', {
    ignore: ['**/node_modules/**', '**/.output/**', '**/guides/**'],
  });

  const staleNow = new Date();
  const staleDocs: StaleDoc[] = [];

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const { data } = matter(content);
      const parsed = docSchema.safeParse(data);

      if (parsed.success) {
        const reviewDate = new Date(parsed.data.freshness_review);
        const daysOverdue = Math.floor(
          (staleNow.getTime() - reviewDate.getTime()) / (24 * 60 * 60 * 1000)
        );

        if (daysOverdue > thresholdDays) {
          staleDocs.push({
            path: file,
            title: parsed.data.title,
            freshness_review: parsed.data.freshness_review,
            days_overdue: daysOverdue,
            domain: parsed.data.domain,
          });
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error processing ${file}:`), error);
    }
  }

  // Report results
  console.log(chalk.blue('\n📊 Freshness Report:\n'));
  console.log(chalk.gray(`Total documents: ${files.length}`));
  console.log(chalk.yellow(`Stale documents: ${staleDocs.length}`));
  console.log(
    chalk.yellow(`Staleness rate: ${((staleDocs.length / files.length) * 100).toFixed(1)}%\n`)
  );

  if (staleDocs.length > 0) {
    console.log(chalk.yellow('Stale Documents:\n'));

    // Group by domain
    const byDomain = staleDocs.reduce(
      (acc, doc) => {
        if (!acc[doc.domain]) acc[doc.domain] = [];
        acc[doc.domain].push(doc);
        return acc;
      },
      {} as Record<string, StaleDoc[]>
    );

    for (const [domain, docs] of Object.entries(byDomain)) {
      console.log(chalk.cyan(`\n${domain}:`));
      docs.forEach((doc) => {
        console.log(chalk.yellow(`  • ${doc.title}`));
        console.log(chalk.gray(`    ${doc.path}`));
        console.log(chalk.gray(`    ${doc.days_overdue} days overdue\n`));
      });
    }
  }

  // Create GitHub Issues if requested
  if (createIssues && staleDocs.length > 0) {
    await createGitHubIssues(staleDocs);
  }

  // Exit with error if staleness exceeds 5%
  const stalenessRate = (staleDocs.length / files.length) * 100;
  if (stalenessRate > 5) {
    console.log(
      chalk.red(`\n❌ Staleness rate ${stalenessRate.toFixed(1)}% exceeds 5% threshold\n`)
    );
    process.exit(1);
  }

  console.log(chalk.green('\n✅ Documentation freshness check passed\n'));
}

async function createGitHubIssues(staleDocs: StaleDoc[]) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log(chalk.yellow('\n⚠️  GITHUB_TOKEN not set, skipping issue creation\n'));
    return;
  }

  const octokit = new Octokit({ auth: token });
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');

  if (!owner || !repo) {
    console.log(chalk.yellow('\n⚠️  GITHUB_REPOSITORY not set\n'));
    return;
  }

  console.log(chalk.blue('\n📝 Creating GitHub Issues for stale documents...\n'));

  for (const doc of staleDocs) {
    try {
      const issueTitle = `[Docs] Update stale documentation: ${doc.title}`;
      const issueBody = `
## Documentation Update Required

This document is **${doc.days_overdue} days past** its freshness review date.

**Document:** \`${doc.path}\`  
**Review Date:** ${doc.freshness_review}  
**Domain:** ${doc.domain}

### Action Items

- [ ] Review document accuracy
- [ ] Update content if needed
- [ ] Update \`freshness_review\` date
- [ ] Verify code examples still work
- [ ] Update \`last_updated\` date

### Guidance

See [Documentation Maintenance Guide](docs/how-to/maintain-documentation.md) for detailed steps.

---
*This issue was automatically created by the freshness monitoring system.*
`;

      const { data } = await octokit.issues.create({
        owner,
        repo,
        title: issueTitle,
        body: issueBody,
        labels: ['documentation', 'maintenance', doc.domain],
      });

      console.log(chalk.green(`✓ Created issue #${data.number}: ${doc.title}`));
    } catch (error) {
      console.error(chalk.red(`✗ Failed to create issue for ${doc.title}:`), error);
    }
  }
}

checkFreshness().catch(console.error);
```

### 5.3 INDEX.md Regeneration Workflow

**File:** `.github/workflows/index-regen.yml`

```yaml
name: Regenerate Repository Index

on:
  schedule:
    - cron: '0 6 * * 1' # Monday 6 AM (before freshness audit)
  workflow_dispatch:

jobs:
  regenerate-index:
    name: Regenerate INDEX.md
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.29.2

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate INDEX.md
        run: npx tsx scripts/regen-index.ts --output INDEX.md

      - name: Commit Changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore(docs): auto-regenerate INDEX.md [skip ci]'
          file_pattern: 'INDEX.md'
```

---

## Part 6: Implementation Roadmap

### Phase 0: Foundation (Week 1) — DO FIRST

**Goal:** Unify documentation trees and establish single source of truth

- [ ] **Freeze `docs/guides/`**
  - Add `docs/guides/_ARCHIVED.md` explaining migration
  - Add CI gate in `docs-validation.yml` blocking new files
  - Document redirection strategy in `CONTRIBUTING.md`

- [ ] **Merge `mcp/docs/` into `docs/`**
  - Move `mcp/docs/explanation/` → `docs/explanation/mcp/`
  - Move `mcp/docs/reference/` → `docs/reference/mcp/`
  - Move `mcp/docs/tutorials/` → `docs/tutorials/mcp/`
  - Move `mcp/docs/how-to/` → `docs/how-to/mcp/`
  - Update all internal links
  - Create symlink: `mcp/docs` → `../docs` (for backward compatibility)

- [ ] **Create Zod Schema**
  - Create `docs/.config/frontmatter.schema.ts` (using Zod 3.25.76)
  - Add repository-specific domains: `mcp`, `multi-tenant`, `payments`, `email`, `seo`, `testing`, `accessibility`
  - Add `non-technical` audience type
  - Add `task_id` field for `DOMAIN-XX-X-X` tracking
  - Add `legacy_path` field for migration traceability

- [ ] **Document Strategy**
  - Update `docs/README.md` with single-tree architecture
  - Update `CONTRIBUTING.md` with documentation rules
  - Create `docs/how-to/write-documentation.md` guide

**Success Criteria:** Zero new files in `docs/guides/`, `mcp/docs/` content accessible via `docs/`, Zod schema compiles

---

### Phase 1: Validation Infrastructure (Week 2-3)

**Goal:** Automated validation in CI/CD pipeline

- [ ] **Schema Validation**
  - Deprecate `docs/frontmatter-schema.json`
  - Create `scripts/validate-frontmatter.ts` using `zod-matter`
  - Add `docs:validate` script to root `package.json`
  - Test locally: `pnpm docs:validate`

- [ ] **Freshness Monitoring**
  - Create `scripts/check-freshness.ts` with GitHub Issue creation
  - Test locally with `--threshold=60` flag
  - Verify GitHub Issue creation works

- [ ] **CI/CD Pipeline**
  - Create `.github/workflows/docs-validation.yml`
  - Add Vale prose linting job
  - Add Lychee link checking job
  - Add legacy directory blocking job
  - Test pipeline on feature branch

- [ ] **Quality Gates**
  - Configure branch protection: require docs-validation pass
  - Set staleness threshold to 5% (fail if exceeded)
  - Document CI failure resolution in `docs/how-to/troubleshoot-ci.md`

**Success Criteria:** CI blocks PRs with invalid frontmatter, broken links, or new legacy files; 100% frontmatter valid on `docs/guides-new/`

---

### Phase 2: MCP Integration (Week 4)

**Goal:** Production-ready MCP documentation server

- [ ] **Server Relocation**
  - Move `mcp/scripts/documentation-server.ts` → `mcp/servers/src/documentation-server.ts`
  - Update imports and paths
  - Implement all five tools: `search_document`, `get_document`, `find_examples`, `check_freshness`, `get_agent_context`

- [ ] **Configuration Update**
  - Add documentation server to `mcp/config/config.json`
  - Set environment variables: `DOCS_ROOT`, `SCHEMA_PATH`, `MANIFEST_PATH`
  - Test server: `npx tsx mcp/servers/src/documentation-server.ts`

- [ ] **Tool Implementation**
  - Implement `get_agent_context` tool with package→path mapping
  - Add support for package aliases (`@repo/ui` → `packages/ui/AGENTS.md`)
  - Test all five tools with sample queries

- [ ] **Manifest Generation**
  - Create `scripts/generate-doc-manifest.ts`
  - Add to CI pipeline in `docs-validation.yml`
  - Generate `docs/.output/manifest.json` on every merge to main

**Success Criteria:** `search_document` returns relevant results in eval; `get_agent_context` successfully retrieves `AGENTS.md` files; manifest auto-updates

---

### Phase 3: Full Automation (Week 5-6)

**Goal:** Zero-maintenance documentation health

- [ ] **Scheduled Workflows**
  - Deploy `freshness-audit.yml` (Monday 9 AM)
  - Deploy `index-regen.yml` (Monday 6 AM)
  - Test scheduled runs with `workflow_dispatch`

- [ ] **CODEOWNERS Integration**
  - Create/update `.github/CODEOWNERS`
  - Map documentation paths to GitHub teams
  - Enforce via branch protection: "Require review from Code Owners"
  - Document ownership assignments

- [ ] **MCP_INDEX.md Automation**
  - Create `scripts/regen-mcp-index.ts` (currently claims auto-gen but isn't)
  - Add to weekly CI schedule
  - Update `MCP_INDEX.md` footer with generator info

- [ ] **Migration Completion**
  - Migrate remaining `docs/guides/` content to appropriate Diátaxis quadrants
  - Update all internal links
  - Archive `docs/guides/` directory (keep `_ARCHIVED.md` only)
  - Celebrate migration completion 🎉

**Success Criteria:** Stale docs <5%; `docs/guides/` fully archived; weekly freshness audit issues = 0; `INDEX.md` and `MCP_INDEX.md` auto-update

---

## Part 7: Quality Gates & Success Metrics

### Quality Gates by Phase

| Phase   | Gate                                | Enforcement        | Failure Action      |
| ------- | ----------------------------------- | ------------------ | ------------------- |
| Phase 0 | Zero new files in `docs/guides/`    | CI check           | Block PR merge      |
| Phase 1 | 100% frontmatter valid              | Zod CI validation  | Block PR merge      |
| Phase 1 | Zero broken internal links          | Lychee CI check    | Block PR merge      |
| Phase 2 | MCP search returns relevant results | Manual eval        | Fix server logic    |
| Phase 3 | Staleness rate <5%                  | Freshness CI check | Create issues, warn |
| Phase 3 | All docs have CODEOWNER             | CI ownership check | Block PR merge      |

### Success Metrics Dashboard

Track these metrics weekly:

```typescript
// scripts/docs-metrics.ts
interface DocsMetrics {
  total_docs: number;
  stale_docs: number;
  staleness_rate: number;
  unverified_examples: number;
  broken_links: number;
  missing_frontmatter: number;
  coverage_by_domain: Record<string, number>;
  avg_freshness_days: number;
}
```

**Target Metrics:**

- **Staleness Rate:** <5%
- **Unverified Examples:** <10%
- **Broken Links:** 0
- **Missing Frontmatter:** 0
- **Coverage:** >90% of packages documented
- **Average Freshness:** <60 days

### Monitoring Dashboard (Future)

Build a simple web dashboard at `docs.your-domain.com/health`:

- Real-time staleness visualization
- Domain coverage heatmap
- Recent updates timeline
- MCP server query analytics
- CODEOWNERS coverage map

---

## Part 8: Repository-Specific Details

### 8.1 Controlled Vocabulary

Based on your actual repository structure:

**Domains (14 total):**

- Core: `security`, `performance`, `architecture`, `development`, `operations`
- Platform: `ai`, `business`, `mcp`, `multi-tenant`
- Services: `payments`, `email`, `seo`, `testing`, `accessibility`, `infrastructure`

**FSD Layers:**

- `app`, `pages`, `widgets`, `features`, `entities`, `shared`

**Audience Types:**

- Technical: `architect`, `developer`, `devops`, `qa`, `ai`
- Non-technical: `business`, `non-technical`

### 8.2 Task ID Integration

Your repository uses `DOMAIN-XX-X-X` pattern for task tracking. Integrate this:

```markdown
---
task_id: 'DOMAIN-37-2-3' # create-docs-folder-structure
related: ['DOMAIN-4-2-1', 'DOMAIN-7-3-2']
---
```

Link tasks to documentation in your task management system:

- `TODO.md` can reference docs via task_id
- CI can validate task_id format
- Documentation coverage reports can show which tasks are documented

### 8.3 Agent Context Bridge

Your `AGENTS.md`, `CLAUDE.md`, and per-package guidance are critical. The `get_agent_context` MCP tool bridges this:

```typescript
// AI agent workflow
1. Agent receives task: "Implement RLS for leads table"
2. Agent calls MCP tool: get_agent_context(package: "@repo/infrastructure")
3. Receives: packages/infrastructure/AGENTS.md content
4. Agent has context-specific rules before generating code
5. Agent calls: search_document(query: "RLS implementation")
6. Receives: docs/how-to/implement-rls.md
7. Agent implements with full context
```

This prevents agents from generating code that violates FSD boundaries or repository conventions.

---

## Part 9: Migration Checklist

### Pre-Migration Audit

- [ ] Inventory all documentation locations:
  - `docs/guides/` (200+ files)
  - `docs/guides-new/` (partial)
  - `mcp/docs/` (full Diátaxis)
  - `packages/*/docs/` (varies)
  - Package `README.md` files

- [ ] Identify duplicate content across trees
- [ ] Map legacy paths to new structure
- [ ] Identify broken internal links
- [ ] List documents without frontmatter

### Migration Execution

**Week 1: Foundation**

- [ ] Day 1: Freeze `docs/guides/`, add CI gate
- [ ] Day 2-3: Move `mcp/docs/` to `docs/`
- [ ] Day 4: Create Zod schema with repo-specific extensions
- [ ] Day 5: Update `CONTRIBUTING.md` and `docs/README.md`

**Week 2: Validation**

- [ ] Day 1-2: Build `validate-frontmatter.ts`
- [ ] Day 3: Build `check-freshness.ts`
- [ ] Day 4: Create `docs-validation.yml` workflow
- [ ] Day 5: Test CI pipeline on feature branch

**Week 3: Content Migration**

- [ ] Day 1: Migrate high-priority `docs/guides/` content
- [ ] Day 2: Update internal links
- [ ] Day 3: Add frontmatter to migrated docs
- [ ] Day 4: Validate with CI
- [ ] Day 5: Merge to main

**Week 4: MCP Integration**

- [ ] Day 1: Move documentation server to `mcp/servers/src/`
- [ ] Day 2: Implement all five MCP tools
- [ ] Day 3: Test tools manually
- [ ] Day 4: Add to `mcp/config/config.json`
- [ ] Day 5: Generate initial manifest

**Week 5: Automation**

- [ ] Day 1: Create scheduled workflows
- [ ] Day 2: Set up CODEOWNERS
- [ ] Day 3: Build `regen-mcp-index.ts`
- [ ] Day 4: Test all automation
- [ ] Day 5: Monitor first scheduled run

**Week 6: Completion**

- [ ] Day 1: Finish remaining content migration
- [ ] Day 2: Archive `docs/guides/`
- [ ] Day 3: Update all documentation references
- [ ] Day 4: Final CI/CD testing
- [ ] Day 5: Announce completion, celebrate 🎉

### Post-Migration Validation

- [ ] All CI checks pass on main branch
- [ ] Zero broken links
- [ ] 100% frontmatter valid
- [ ] MCP server operational
- [ ] Staleness rate <5%
- [ ] CODEOWNERS enforced
- [ ] Documentation searchable via MCP
- [ ] Team trained on new system

---

## Part 10: Training & Adoption

### Developer Training

Create onboarding materials:

1. **Quick Start Guide** (`docs/tutorials/contributing-to-docs.md`)
   - How to add frontmatter
   - How to choose the right Diátaxis type
   - How to validate locally before pushing

2. **VSCode Snippets** (`.vscode/docs.code-snippets`)

   ```json
   {
     "Doc Frontmatter": {
       "prefix": "docfront",
       "body": [
         "---",
         "title: \"$1\"",
         "description: \"$2\"",
         "domain: \"$3\"",
         "type: \"$4\"",
         "layer: \"global\"",
         "audience: [\"developer\"]",
         "phase: 1",
         "complexity: \"intermediate\"",
         "freshness_review: \"${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}\"",
         "validation_status: \"unverified\"",
         "last_updated: \"${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}\"",
         "---",
         "",
         "# $1",
         "",
         "$0"
       ]
     }
   }
   ```

3. **Pre-commit Hook** (optional, via Husky)

   ```bash
   # .husky/pre-commit
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"

   # Validate docs if markdown files changed
   if git diff --cached --name-only | grep -q "\.md$"; then
     pnpm docs:validate --staged
   fi
   ```

### AI Agent Training

Update agent context files to reference the new system:

**File:** `AGENTS.md` (root)

```markdown
## Documentation System

This repository uses a unified Diátaxis documentation system with strict validation.

**Before generating documentation:**

1. **Check MCP documentation server:**
   - Call `search_document` to find similar docs
   - Call `get_agent_context` for package-specific rules

2. **Use correct frontmatter schema:**
   - See `docs/.config/frontmatter.schema.ts`
   - All fields validated by CI

3. **Choose correct Diátaxis type:**
   - Tutorial: Learning-oriented, step-by-step
   - How-to: Task-oriented, goal-focused
   - Reference: Information-oriented, lookup
   - Explanation: Understanding-oriented, conceptual

4. **Validate before committing:**
   - Run `pnpm docs:validate`
   - Fix any schema errors
   - Ensure internal links work

**Never:**

- Add files to `docs/guides/` (archived)
- Omit frontmatter
- Use placeholder content
- Create docs without code example validation
```

---

## Appendix A: Complete File Checklist

**Configuration Files:**

- [ ] `docs/.config/frontmatter.schema.ts` (new)
- [ ] `docs/.config/vale.ini` (new, for prose linting)
- [ ] `docs/frontmatter-schema.json` (deprecate after Zod migration)

**Script Files:**

- [ ] `scripts/validate-frontmatter.ts` (new)
- [ ] `scripts/check-freshness.ts` (new)
- [ ] `scripts/generate-doc-manifest.ts` (new)
- [ ] `scripts/regen-index.ts` (new)
- [ ] `scripts/regen-mcp-index.ts` (new)

**MCP Files:**

- [ ] `mcp/servers/src/documentation-server.ts` (relocate from scripts/)
- [ ] `mcp/config/config.json` (update with documentation server)

**CI/CD Files:**

- [ ] `.github/workflows/docs-validation.yml` (new)
- [ ] `.github/workflows/index-regen.yml` (new)
- [ ] `.github/CODEOWNERS` (update)

**Documentation Files:**

- [ ] `docs/README.md` (update with single-tree architecture)
- [ ] `docs/guides/_ARCHIVED.md` (new)
- [ ] `docs/tutorials/contributing-to-docs.md` (new)
- [ ] `docs/how-to/write-documentation.md` (new)
- [ ] `docs/how-to/troubleshoot-ci.md` (new)
- [ ] `CONTRIBUTING.md` (update)

**Output Files:**

- [ ] `docs/.output/manifest.json` (auto-generated)
- [ ] `INDEX.md` (auto-regenerated)
- [ ] `MCP_INDEX.md` (auto-regenerated)

---

## Appendix B: Quick Reference

### Common Commands

```bash
# Validate all documentation
pnpm docs:validate

# Check freshness locally
pnpm tsx scripts/check-freshness.ts --threshold=90

# Generate manifest
pnpm tsx scripts/generate-doc-manifest.ts --output docs/.output/manifest.json

# Test MCP documentation server
npx tsx mcp/servers/src/documentation-server.ts

# Regenerate INDEX.md
pnpm tsx scripts/regen-index.ts --output INDEX.md
```

### CI Trigger Paths

```yaml
# Documentation validation triggers on:
- 'docs/**/*.md'
- 'packages/**/docs/**/*.md'
- 'packages/**/README.md'
- 'docs/.config/**'

# Freshness audit runs:
- Every Monday at 9 AM CST

# Index regeneration runs:
- Every Monday at 6 AM CST
```

### MCP Tool Quick Reference

```typescript
// Search documentation
search_document({
  query: "Row-Level Security",
  domain: "security",
  type: "how-to"
})

// Get specific document
get_document({
  path: "how-to/implement-rls.md"
})

// Find code examples
find_examples({
  technology: "Postgre
```
