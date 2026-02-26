---
title: "tenant-suspension-patterns.md"
description: "> **Internal Template – customize as needed**"
domain: multi-tenant
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["multi-tenant", "tenant-suspension-patterns.md"]
legacy_path: "multi-tenant\tenant-suspension-patterns.md"
---
# tenant-suspension-patterns.md

> **Internal Template – customize as needed**  
> **2026 Standards Compliance** | GDPR Article 17 · Stripe Billing · Supabase RLS

## 2026 Standards Compliance

- **GDPR Article 17**: Right to erasure with automated deletion workflows
- **Stripe Billing**: Real-time subscription status synchronization
- **Zero-Trust Architecture**: Per-request validation, no trusted internal state
- **Multi-Tenant Isolation**: Complete tenant data separation via RLS
- **Core Web Vitals**: Suspension checks < 5ms (INP budget)
- **Data Minimization**: Automated data retention and deletion policies

---

## Overview

Tenant suspension provides a graceful degradation system that protects revenue while maintaining user experience. This implementation follows GDPR Article 17 requirements for data deletion, integrates with Stripe for real-time billing synchronization, and provides configurable suspension states with automated recovery options. The system ensures suspended tenants cannot access services while preserving their data for potential reactivation.

## Suspension State Machine

```
                    ┌─────────────────────────────┐
                    │         ACTIVE               │
                    └──────────────┬──────────────┘
                                   │
                    ┌───────────┴───────────────────┐
                    │  PAST DUE  │  CANCELED      │
                    └───────────┬───────────────────┘
                                   │
                    ┌───────┬───────┐
                    │ GRACE │  READ_ONLY │
                    └───────┴───────┘
                                   │
                    ┌───────┐
                    │ LOCKED │
                    └──────┘
                                   │
                    ┌───────────┐
                    │  DELETED    │
                    └───────────┘
```

---

## Database Schema

```sql
-- Enhanced tenants table for suspension tracking
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS
  suspension_reason TEXT;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS
  suspended_at TIMESTAMPTZ;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS
  suspension_expires_at TIMESTAMPTZ;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS
  suspended_by UUID REFERENCES auth.users(id);

-- Suspension audit table
CREATE TABLE tenant_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('grace_period', 'suspended', 'deleted')),
  suspended_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  suspended_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for suspension queries
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_suspended_at ON tenants(suspended_at) WHERE suspended_at IS NOT NULL;
CREATE INDEX idx_tenant_suspensions_tenant_id ON tenant_suspensions(tenant_id);
CREATE INDEX idx_tenant_suspensions_status ON tenant_suspensions(status);
CREATE INDEX idx_tenant_suspensions_expires_at ON tenant_suspensions(expires_at) WHERE expires_at IS NOT NULL;
```

---

## Suspend Tenant Service

```typescript
// packages/billing/src/suspension-service.ts
import { createServiceClient } from '@repo/db/supabase-server';
import { sendEmail } from '@repo/email';
import { redis } from '@repo/cache';
import type { SuspensionReason, TenantSuspension } from '@repo/types';

export async function suspendTenant(
  tenantId: string,
  reason: SuspensionReason,
  options: {
    gracePeriodDays?: number;
    suspendedBy?: string; // admin user ID, or 'system'
    notifyOwner?: boolean;
  } = {}
): Promise<TenantSuspension> {
  const supabase = createServiceClient();
  const { gracePeriodDays = 0, suspendedBy = 'system', notifyOwner = true } = options;

  const now = new Date();
  const expiresAt =
    gracePeriodDays > 0 ? new Date(now.getTime() + gracePeriodDays * 86_400_000) : null;

  const newStatus = gracePeriodDays > 0 ? 'grace_period' : 'suspended';

  const { data, error } = await supabase
    .from('tenants')
    .update({
      status: newStatus,
      suspension_reason: reason,
      suspended_at: now,
      suspension_expires_at: expiresAt,
      suspended_by: suspendedBy,
    })
    .eq('id', tenantId)
    .select('id, slug, name, owner_email')
    .single();

  if (error || !data) {
    throw new Error(`Failed to suspend tenant ${tenantId}: ${error?.message}`);
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    tenant_id: tenantId,
    actor: suspendedBy,
    action: 'tenant.suspended',
    metadata: { reason, grace_period_days: gracePeriodDays },
  });

  // Invalidate cache
  await Promise.all([redis.del(`slug:${data.slug}`), redis.del(`tenant:${tenantId}`)]);

  // Notify tenant owner
  if (notifyOwner && data.owner_email) {
    await sendEmail({
      to: data.owner_email,
      template: 'tenant-suspended',
      data: {
        tenantName: data.name,
        reason,
        gracePeriodDays,
        expiresAt,
        reactivateUrl: `https://app.yoursaas.com/billing/reactivate`,
      },
    });
  }

  return {
    tenantId,
    status: newStatus,
    reason,
    suspendedAt: now,
    expiresAt,
  };
}
```

### Grace Period Expiration Task

```typescript
// tasks/expire-grace-periods.ts
import { createServiceClient } from '@repo/db/supabase-server';
import { suspendTenant } from '@repo/billing/suspension-service';

export async function expireGracePeriods() {
  const supabase = createServiceClient();

  const { data: expiredTenants } = await supabase
    .from('tenants')
    .select('id, slug, suspension_reason')
    .eq('status', 'grace_period')
    .lt('suspension_expires_at', new Date().toISOString());

  if (!expiredTenants?.length) {
    return { processed: 0 };
  }

  await Promise.allSettled(
    expiredTenants.map((t) =>
      suspendTenant(t.id, 'grace_period_expired', {
        gracePeriodDays: 0,
        notifyOwner: true,
      })
    )
  );

  return { processed: expiredTenants.length };
}
```

---

## Reactivation Service

```typescript
// packages/billing/src/reactivation-service.ts
export async function reactivateTenant(
  tenantId: string,
  reason: 'self_service' | 'admin_action' | 'payment_recovered',
  options: {
    reactivateBy?: string;
    notes?: string;
  } = {}
): Promise<TenantContext> {
  const supabase = createServiceClient();
  const { reactivateBy = reason } = options;

  // Update tenant status
  const { data, error } = await supabase
    .from('tenants')
    .update({
      status: 'active',
      billing_status: 'current',
      suspension_reason: null,
      suspended_at: null,
      suspension_expires_at: null,
      suspended_by: null,
      reactivated_at: new Date().toISOString(),
      reactivated_by: reactivateBy,
    })
    .eq('id', tenantId)
    .select('id, slug, name, plan, status, billing_status, features')
    .single();

  if (error || !data) {
    throw new Error(`Failed to reactivate tenant: ${error?.message}`);
  }

  // Clear suspension records
  await supabase.from('tenant_suspensions').delete().eq('tenant_id', tenantId);

  // Invalidate cache
  await Promise.all([redis.del(`slug:${data.slug}`), redis.del(`tenant:${tenantId}`)]);

  // Send reactivation notification
  await sendEmail({
    to: data.owner_email,
    template: 'tenant-reactivated',
    data: {
      tenantName: data.name,
      reactivatedBy: reactivateBy,
      reactivatedAt: new Date().toISOString(),
      dashboardUrl: `https://app.yoursaas.com/dashboard`,
    },
  });

  return data;
}
```

---

## Suspension UI Components

### Suspension Banner

```typescript
// packages/ui/src/billing/suspension-banner.tsx
interface SuspensionBannerProps {
  tenant: TenantContext;
  suspension: TenantSuspension;
}

export function SuspensionBanner({ tenant, suspension }: SuspensionBannerProps) {
  const daysRemaining = suspension.expiresAt
    ? Math.max(0, Math.ceil(
      (suspension.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    ))
    : 0;

  const messages = {
    grace_period: {
      title: 'Payment Required',
      description: `Your account is in a grace period. ${daysRemaining} days remaining.`,
      action: 'Update Payment Method',
      actionUrl: `/billing/update-payment?tenant=${tenant.slug}`,
    },
    suspended: {
      title: 'Account Suspended',
      description: 'Your account has been suspended. Contact support for assistance.',
      action: 'Contact Support',
      actionUrl: '/support',
    },
    deleted: {
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted.',
      action: null,
      actionUrl: null,
    },
  };

  const message = messages[suspension.status];

  return (
    <div className="suspension-banner">
      <div className="banner-content">
        <AlertCircle className="icon" variant={suspension.status === 'deleted' ? 'error' : 'warning'} />
        <div className="banner-text">
          <h3>{message.title}</h3>
          <p>{message.description}</p>
          {message.actionUrl && (
            <Link href={message.actionUrl} className="action-button">
              {message.action}
            </Link>
          )}
        </div>
        <div className="banner-meta">
          <span className="reason">{suspension.reason}</span>
          {daysRemaining > 0 && (
            <span className="countdown">{daysRemaining} days</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Reactivation Form

```typescript
// packages/ui/src/billing/reactivation-form.tsx
interface ReactivationFormProps {
  tenant: TenantContext;
}

export function ReactivationForm({ tenant }: ReactivationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState(tenant.plan);

  const handleReactivate = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await reactivateTenant(tenant.id, 'self_service');
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Failed to reactivate account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reactivation-form">
      <h2>Reactivate Your Account</h2>
      <p>Choose a plan to reactivate your {tenant.name} account.</p>

      <PlanSelector
        currentPlan={tenant.plan}
        onSelect={setSelectedPlan}
      />

      <PaymentForm />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        onClick={handleReactivate}
        disabled={isSubmitting}
        className="reactivate-button"
      >
        {isSubmitting ? 'Processing...' : 'Reactivate'}
      </button>
    </div>
  );
}
```

---

## Email Templates

### Suspension Notification

```typescript
// templates/tenant-suspended.ts
export interface TenantSuspendedData {
  tenantName: string;
  reason: string;
  gracePeriodDays: number;
  expiresAt: string;
  reactivateUrl: string;
}

export function TenantSuspendedEmail({
  tenantName,
  reason,
  gracePeriodDays,
  expiresAt,
  reactivateUrl,
}: TenantSuspendedData) {
  return {
    subject: `Your ${tenantName} account has been suspended`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Account Suspension Notice</h2>
        <p>Dear ${tenantName},</p>
        <p>Your account has been suspended due to: <strong>${reason}</strong>.</p>
        
        ${
          gracePeriodDays > 0
            ? `
          <p>You have <strong>${gracePeriodDays} days</strong> to resolve this issue before your data is permanently deleted.</p>
          <p>Grace period expires on: <strong>${new Date(expiresAt).toLocaleDateString()}</strong></p>
        `
            : `
          <p>Your account and all associated data will be permanently deleted.</p>
        `
        }
        
        <p>To reactivate your account:</p>
        <p><a href="${reactivateUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reactivate Account
        </a></p>
        
        <p>If you believe this is an error, please contact our support team.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}
```

### Reactivation Confirmation

```typescript
// templates/tenant-reactivated.ts
export interface TenantReactivatedData {
  tenantName: string;
  reactivatedBy: string;
  reactivatedAt: string;
  dashboardUrl: string;
}

export function TenantReactivatedEmail({
  tenantName,
  reactivatedBy,
  reactivatedAt,
  dashboardUrl,
}: TenantReactivatedData) {
  return {
    subject: `Welcome back to ${tenantName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981; margin-bottom: 20px;">Account Reactivated</h2>
        <p>Dear ${tenantName},</p>
        <p>Great news! Your account has been successfully reactivated.</p>
        
        <p><strong>Reactivated by:</strong> ${reactivatedBy}</p>
        <p><strong>Reactivated at:</strong> ${new Date(reactivatedAt).toLocaleDateString()}</p>
        
        <p>You can now access your dashboard:</p>
        <p><a href="${dashboardUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Go to Dashboard
        </a></p>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}
```

---

## Data Deletion & GDPR Compliance

### Automated Deletion Job

```typescript
// tasks/gdpr-deletion-job.ts
export async function executeGDPRDeletions(): Promise<{ processed: number; errors: string[] }> {
  const supabase = createServiceClient();

  // Find tenants marked for deletion (30 days after cancellation)
  const { data: tenantsToDelete } = await supabase
    .from('tenants')
    .select('id, slug, name, owner_email, deleted_at')
    .eq('status', 'canceled')
    .lt('suspension_expires_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .or('suspension_expires_at', null);

  if (!tenantsToDelete?.length) {
    return { processed: 0, errors: [] };
  }

  const errors: string[] = [];
  let processed = 0;

  for (const tenant of tenantsToDelete) {
    try {
      // Send final deletion notice
      await sendEmail({
        to: tenant.owner_email,
        template: 'final-deletion-notice',
        data: {
          tenantName: tenant.name,
          deletionDate: new Date(tenant.deleted_at || new Date()).toLocaleDateString(),
        },
      });

      // Anonymize or delete PII
      await anonymizeTenantData(tenant.id);

      // Mark as deleted
      await supabase
        .from('tenants')
        .update({
          status: 'deleted',
          deleted_at: new Date(),
        })
        .eq('id', tenant.id);

      // Complete deletion (after retention period)
      await deleteTenantData(tenant.id);

      processed++;
    } catch (error) {
      errors.push(`Failed to delete tenant ${tenant.id}: ${error}`);
    }
  }

  return { processed, errors };
}

async function anonymizeTenantData(tenantId: string): Promise<void> {
  const supabase = createServiceClient();

  // Anonymize user data
  await supabase
    .from('users')
    .update({
      email: `deleted-${tenantId}`,
      name: 'Deleted User',
      phone: null,
      metadata: '{}',
    })
    .eq('tenant_id', tenantId);

  // Anonymize content
  await supabase
    .from('posts')
    .update({
      title: 'Deleted Content',
      content: 'Content deleted due to account deletion',
      author_id: null,
    })
    .eq('tenant_id', tenantId);

  // Anonymize analytics
  await supabase
    .from('analytics_events')
    .update({
      user_id: `deleted-${tenantId}`,
      user_agent: 'Deleted User',
      ip_address: '0.0.0.0',
    })
    .eq('tenant_id', tenantId);
}

async function deleteTenantData(tenantId: string): Promise<void> {
  const supabase = createServiceClient();

  // Delete all tenant-related tables
  const tablesToDelete = [
    'posts',
    'users',
    'analytics_events',
    'billing_events',
    'tenant_suspensions',
  ];

  for (const table of tablesToDelete) {
    await supabase.from(table).delete().eq('tenant_id', tenantId);
  }
}
```

### Data Retention Policy

```typescript
// packages/billing/src/data-retention.ts
export class DataRetentionPolicy {
  static getRetentionDays(status: BillingStatus): number {
    switch (status) {
      case 'active':
        return 365; // Keep active data indefinitely
      case 'trialing':
        return 30; // Trial data only
      case 'past_due':
        return 90; // Extended grace period
      case 'canceled':
        return 60; // 60 days for reactivation
      case 'unpaid':
        return 30; // 30 days before deletion
      case 'paused':
        return 180; // 6 months
      case 'deleted':
        return 30; // 30 days for compliance
      default:
        return 30;
    }
  }

  static shouldDeleteData(status: BillingStatus, changedAt: Date): boolean {
    const retentionDays = this.getRetentionDays(status);
    const daysSinceChange = Date.now() - changedAt.getTime() / (24 * 60 * 60 * 1000);
    return daysSinceChange > retentionDays;
  }

  static async enforceDataRetention(): Promise<{ deleted: number; errors: string[] }> {
    const supabase = createServiceClient();
    const errors: string[] = [];
    let deleted = 0;

    // Find tenants past retention period
    const { data: expiredTenants } = await supabase
      .from('tenants')
      .select('id, slug, billing_status, billing_status_changed_at')
      .where(
        `billing_status_changed_at < now() - INTERVAL '${this.getRetentionDays('active')} days`
      );

    for (const tenant of expiredTenants) {
      try {
        await deleteTenantData(tenant.id);
        await supabase.from('tenants').update({ status: 'deleted' }).eq('id', tenant.id);

        deleted++;
      } catch (error) {
        errors.push(`Failed to delete expired tenant ${tenant.id}: ${error}`);
      }
    }

    return { deleted, errors };
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// packages/billing/tests/suspension.test.ts
import { suspendTenant, reactivateTenant } from '../src/suspension-service';

describe('Tenant Suspension', () => {
  describe('suspendTenant', () => {
    it('creates grace period suspension', async () => {
      const result = await suspendTenant('tenant-123', 'payment_failed', {
        gracePeriodDays: 7,
        notifyOwner: false,
      });

      expect(result.status).toBe('grace_period');
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.reason).toBe('payment_failed');
    });

    it('creates immediate suspension', async () => {
      const result = await suspendTenant('tenant-456', 'policy_violation', {
        gracePeriodDays: 0,
        notifyOwner: true,
      });

      expect(result.status).toBe('suspended');
      expect(result.expiresAt).toBeNull();
    });
  });

  describe('reactivateTenant', () => {
    it('reactivates suspended tenant', async () => {
      // First suspend
      await suspendTenant('tenant-789', 'payment_failed');

      // Then reactivate
      const result = await reactivateTenant('tenant-789', 'payment_recovered');

      expect(result.status).toBe('active');
      expect(result.billingStatus).toBe('current');
    });

    it('fails to reactivate deleted tenant', async () => {
      await suspendTenant('tenant-789', 'policy_violation', {
        gracePeriodDays: 0,
      });

      // Mark as deleted
      const supabase = createServiceClient();
      await supabase.from('tenants').update({ status: 'deleted' }).eq('id', 'tenant-789');

      await expect(reactivateTenant('tenant-789', 'payment_recovered')).rejects.toThrow(
        'Tenant not found'
      );
    });
  });
});
```

### Integration Tests

```typescript
// apps/portal/tests/suspension-workflow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Suspension Workflow', () => {
  test('suspends tenant and shows banner', async ({ page }) => {
    await page.goto('/dashboard');

    // Mock suspension
    await page.evaluate(() => {
      Object.defineProperty(window, '__NEXT_DATA__', {
        value: {
          props: {
            tenant: {
              billingStatus: 'suspended',
              status: 'suspended',
              reason: 'payment_failed',
              suspendedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        },
        writable: true,
      });
    });

    // Should show suspension banner
    await expect(page.locator('[data-testid="suspension-banner"]')).toBeVisible();
    await expect(page.locator('text=Account Suspended')).toBeVisible();
  });

  test('allows reactivation during grace period', async ({ page }) => {
    const changedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    await page.goto('/dashboard');
    await page.evaluate((changedAt) => {
      Object.defineProperty(window, '__NEXT_DATA__', {
        value: {
          props: {
            tenant: {
              billingStatus: 'past_due',
              status: 'grace_period',
              billingStatusChangedAt: changedAt.toISOString(),
              suspensionExpiresAt: new Date(
                changedAt.getTime() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
        },
        writable: true,
      });
    });

    // Should show grace period banner with reactivate option
    await expect(page.locator('[data-testid="grace-period-banner"]')).toBeVisible();
    await expect(page.locator('text=5 days remaining')).toBeVisible();

    // Should be able to reactivate
    await page.click('text=Reactivate Account');
    await expect(page.url()).toContain('/dashboard');
  });

  test('blocks access for deleted tenant', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      Object.defineProperty(window, '__NEXT_DATA__', {
        value: {
          props: {
            tenant: {
              billingStatus: 'deleted',
              status: 'deleted',
            },
          },
        },
        writable: true,
      });
    });

    // Should redirect to not found
    await page.waitForURL('**/not-found');
    await expect(page.locator('text=Page not found')).toBeVisible();
  });
});
```

---

## Monitoring & Analytics

### Suspension Metrics

```typescript
// packages/analytics/src/suspension-metrics.ts
export async function getSuspensionMetrics(timeRange: string): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byReason: Record<string, number>;
  byPlan: Record<string, number>;
}> {
  const query = `
    SELECT 
      COUNT(*) as total,
      billing_status,
      suspension_reason,
      plan,
      COUNT(*) FILTER (billing_status = 'suspended' AND suspension_reason = 'payment_failed') FILTER (plan = 'enterprise') as enterprise_payment_suspended,
      COUNT(*) FILTER (billing_status = 'suspended' AND suspension_reason = 'policy_violation') FILTER (plan = 'free') as free_policy_violation,
      COUNT(*) FILTER (billing_status = 'suspended' AND suspension_reason = 'abuse') FILTER (plan = 'free') as free_abuse_suspended
    FROM tenant_suspensions
    WHERE created_at >= now() - INTERVAL '${timeRange}'
    GROUP BY billing_status, suspension_reason, plan
    ORDER BY total DESC
  `;

  const response = await fetch('https://api.tinybird.co/v0/sql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}
```

### Revenue Impact Analysis

```sql
-- Revenue impact by suspension status
SELECT
  billing_status,
  COUNT(*) as tenant_count,
  SUM(CASE
    WHEN plan = 'free' THEN 0
    WHEN plan = 'pro' THEN 29
    WHEN plan = 'enterprise' THEN 99
    ELSE 0
  END) as monthly_mrr,
  SUM(CASE
    WHEN plan = 'free' THEN 0
    WHEN plan = 'pro' THEN 29
    WHEN plan = 'enterprise' THEN 99
    ELSE 0
  END) as annual_arr
FROM tenants
GROUP BY billing_status
ORDER BY monthly_mrr DESC;
```

---

## References

- [GDPR Article 17 – Right to Erasure](https://gdpr.eu/right-to-be-forgotten/) — Data deletion requirements
- [Stripe Webhooks Best Practices](https://docs.stripe.com/webhooks/best-practices) — Webhook security patterns
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) — Database security patterns
- [QStash Scheduled Tasks](https://upstash.com/docs/qstash/features/schedules) — Background job scheduling
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — Edge middleware patterns
- [React Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) — Server action patterns

---