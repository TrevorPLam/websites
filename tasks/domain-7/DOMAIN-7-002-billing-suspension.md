---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-7-002
title: 'Billing status check with suspension pattern'
status: done # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-7-002-billing-suspension
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-7-002 · Billing status check with suspension pattern

## Objective

Implement billing status checking system following sections 7.3 and 7.4 specifications with Redis caching, real-time status updates, tenant suspension patterns, and graceful suspended pages for multi-tenant billing management.

---

## Context

**Documentation Reference:**

- Tenant Resolution Implementation: `docs/guides/multi-tenant/tenant-resolution-implementation.md` ✅ COMPLETED
- Billing Status Validation: `docs/guides/multi-tenant/billing-status-validation.md` ✅ COMPLETED
- Tenant Suspension Patterns: `docs/guides/multi-tenant/tenant-suspension-patterns.md` ✅ COMPLETED
- Noisy Neighbor Prevention: `docs/guides/multi-tenant/noisy-neighbor-prevention.md` ✅ COMPLETED
- Domain Lifecycle Management: `docs/guides/multi-tenant/domain-lifecycle-management.md` ✅ COMPLETED
- Enterprise Sso Integration: `docs/guides/multi-tenant/enterprise-sso-integration.md` ✅ COMPLETED
- Routing Strategy Comparison: `docs/guides/multi-tenant/routing-strategy-comparison.md` ✅ COMPLETED
- Tenant Metadata Factory: `docs/guides/multi-tenant/tenant-metadata-factory.md` ✅ COMPLETED
- Tenant Resolution Sequence Diagram: `docs/guides/multi-tenant/tenant-resolution-sequence-diagram.md` ❌ MISSING (P0)
- Tenant Data Flow Patterns: `docs/guides/multi-tenant/tenant-data-flow-patterns.md` ❌ MISSING (P0)

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** Multi-tenant billing management — Status checking and suspension

**Related files:** Billing status checker, suspension pages, middleware integration

**Dependencies:** Redis for caching, Supabase for billing data, Stripe webhook integration

**Prior work:** Basic billing awareness exists but lacks comprehensive status checking and suspension patterns

**Constraints:** Must follow sections 7.3 and 7.4 specifications with proper caching and graceful suspension handling

---

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Caching    | Redis for billing status cache |
| Database   | Supabase for billing data      |
| Status     | Real-time status updates       |
| Suspension | Graceful suspended pages       |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement billing status check following section 7.3 specification
- [ ] **[Agent]** Create Redis caching for billing status
- [ ] **[Agent]** Implement tenant suspension pattern following section 7.4
- [ ] **[Agent]** Add graceful suspended pages
- [ ] **[Agent]** Create status update integration
- [ ] **[Agent]** Add middleware integration for billing checks
- [ ] **[Agent]** Test suspension and reactivation flows
- [ ] **[Human]** Verify patterns follow sections 7.3 and 7.4 specifications exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze sections 7.3 and 7.4 specifications** — Extract billing and suspension requirements
- [ ] **[Agent]** **Create billing status checker** — Implement Redis-cached status checking
- [ ] **[Agent]** **Add status update system** — Implement real-time status updates
- [ ] **[Agent]** **Create suspension pages** — Build graceful suspended page components
- [ ] **[Agent]** **Add middleware integration** — Integrate billing checks with middleware
- [ ] **[Agent]** **Test suspension flows** — Verify suspension and reactivation work
- [ ] **[Agent]** **Add webhook integration** — Connect with Stripe webhook updates

> ⚠️ **Agent Question**: Ask human before proceeding if any existing billing logic needs migration to new status system.

---

## Commands

```bash
# Test billing status check
pnpm test --filter="@repo/multi-tenant"

# Test billing status caching
node -e "
import { checkBillingStatus, updateBillingStatus } from '@repo/multi-tenant/check-billing';
const status = await checkBillingStatus('tenant-123');
console.log('Billing status:', status);
await updateBillingStatus('tenant-123', 'suspended');
const updated = await checkBillingStatus('tenant-123');
console.log('Updated status:', updated);
"

# Test suspension page rendering
node -e "
import { SuspendedPage } from '@repo/multi-tenant/suspended-page';
// Test with mock tenant context
const page = await SuspendedPage();
console.log('Suspension page rendered');
"

# Test middleware billing integration
node -e "
import { createBillingMiddleware } from '@repo/multi-tenant/billing-middleware';
const middleware = createBillingMiddleware();
const request = new Request('https://acme-law.youragency.com');
const response = await middleware(request);
console.log('Billing middleware response:', response.status);
"
```

---

## Code Style

```typescript
// ✅ Correct — Billing status check following section 7.3
import { Redis } from '@upstash/redis';
import { db } from '@repo/db';

const redis = Redis.fromEnv();
const BILLING_CACHE_TTL = 60; // 1 minute — billing status must be near-real-time

export type BillingStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

// ============================================================================
// BILLING STATUS CHECK (with Redis cache)
// ============================================================================

export async function checkBillingStatus(tenantId: string): Promise<BillingStatus> {
  const cacheKey = `tenant:billing:${tenantId}`;

  // Redis cache (prevents DB query on every request)
  const cached = await redis.get<BillingStatus>(cacheKey);
  if (cached) return cached;

  const { data: tenant, error } = await db
    .from('tenants')
    .select('status')
    .eq('id', tenantId)
    .single();

  if (error || !tenant) return 'suspended'; // Fail safe: unknown tenant = suspended

  const status = tenant.status as BillingStatus;
  await redis.set(cacheKey, status, { ex: BILLING_CACHE_TTL });

  return status;
}

// ============================================================================
// BILLING STATUS UPDATE (called by Stripe webhook)
// ============================================================================

export async function updateBillingStatus(
  tenantId: string,
  newStatus: BillingStatus
): Promise<void> {
  await db
    .from('tenants')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', tenantId);

  // Bust cache immediately
  await redis.del(`tenant:billing:${tenantId}`);
}

// ============================================================================
// BILLING STATUS VALIDATION
// ============================================================================

export function isValidBillingStatus(status: string): status is BillingStatus {
  return ['active', 'trial', 'suspended', 'cancelled'].includes(status);
}

// ============================================================================
// BILLING EVENT TRACKING
// ============================================================================

export async function trackBillingEvent(
  tenantId: string,
  event: {
    type: 'status_change' | 'payment_succeeded' | 'payment_failed' | 'subscription_created';
    data: Record<string, unknown>;
  }
): Promise<void> {
  const eventKey = `tenant:billing:events:${tenantId}`;
  const eventData = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Store recent billing events (keep last 10)
  await redis.lpush(eventKey, JSON.stringify(eventData));
  await redis.ltrim(eventKey, 0, 9);
  await redis.expire(eventKey, 86400); // 24 hours
}

export async function getBillingEvents(tenantId: string): Promise<
  Array<{
    type: string;
    data: Record<string, unknown>;
    timestamp: string;
  }>
> {
  const eventKey = `tenant:billing:events:${tenantId}`;
  const events = await redis.lrange(eventKey, 0, -1);

  return events.map((event) => JSON.parse(event));
}

// ============================================================================
// BILLING MIDDLEWARE INTEGRATION
// ============================================================================

export function createBillingMiddleware() {
  return async function billingMiddleware(request: NextRequest) {
    // Get tenant ID from headers (set by tenant resolution middleware)
    const tenantId = request.headers.get('X-Tenant-Id');

    if (!tenantId) {
      return NextResponse.next(); // No tenant context, skip billing check
    }

    const billingStatus = await checkBillingStatus(tenantId);

    // If tenant is suspended, rewrite to suspended page
    if (billingStatus === 'suspended') {
      const url = request.nextUrl.clone();
      url.pathname = '/suspended';
      return NextResponse.rewrite(url);
    }

    // If tenant is cancelled, show cancellation page
    if (billingStatus === 'cancelled') {
      const url = request.nextUrl.clone();
      url.pathname = '/cancelled';
      return NextResponse.rewrite(url);
    }

    // Add billing status to headers for downstream components
    const response = NextResponse.next();
    response.headers.set('X-Billing-Status', billingStatus);

    return response;
  };
}

// ============================================================================
// BILLING STATUS HOOKS
// ============================================================================

export function useBillingStatus(): BillingStatus | null {
  // Client-side hook to read billing status from headers
  // This would be used in client components
  return null; // Implementation depends on client-side context
}

export function useBillingStatusServer(): BillingStatus | null {
  // Server-side hook to read billing status from headers
  const headers = useHeaders();
  return headers.get('X-Billing-Status') as BillingStatus | null;
}

// ============================================================================
// BILLING STATUS NOTIFICATIONS
// ============================================================================

export async function notifyBillingStatusChange(
  tenantId: string,
  oldStatus: BillingStatus,
  newStatus: BillingStatus
): Promise<void> {
  // Send notification to tenant admin
  const { data: tenant } = await db.from('tenants').select('config').eq('id', tenantId).single();

  const config = tenant?.config as { identity?: { contact?: { email?: string } } };
  const adminEmail = config?.identity?.contact?.email;

  if (adminEmail) {
    // Send email notification (implementation depends on email system)
    console.log(`Billing status change notification sent to ${adminEmail}`);
  }

  // Track the event
  await trackBillingEvent(tenantId, {
    type: 'status_change',
    data: { oldStatus, newStatus, adminEmail },
  });
}

// ============================================================================
// BILLING HEALTH CHECK
// ============================================================================

export async function getBillingHealthStats(): Promise<{
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  cancelledTenants: number;
}> {
  const { data: stats } = await db
    .from('tenants')
    .select('status')
    .then(({ data }) => {
      if (!data) return { active: 0, trial: 0, suspended: 0, cancelled: 0 };

      return data.reduce(
        (acc, tenant) => {
          acc[tenant.status as BillingStatus] = (acc[tenant.status as BillingStatus] || 0) + 1;
          return acc;
        },
        {} as Record<BillingStatus, number>
      );
    });

  return {
    totalTenants: Object.values(stats).reduce((sum, count) => sum + count, 0),
    activeTenants: stats.active || 0,
    trialTenants: stats.trial || 0,
    suspendedTenants: stats.suspended || 0,
    cancelledTenants: stats.cancelled || 0,
  };
}
```

```typescript
// ✅ Correct — Tenant suspension pattern following section 7.4
// sites/[base-app]/src/app/suspended/page.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { db } from '@repo/db';

export const metadata: Metadata = {
  title: 'Account Suspended — Maintenance',
  robots: { index: false, follow: false }, // Never index suspended pages
};

async function getSuspendedTenantInfo(tenantId: string) {
  const { data } = await db
    .from('tenants')
    .select('config')
    .eq('id', tenantId)
    .single();

  const config = data?.config as {
    identity?: {
      siteName?: string;
      contact?: { email?: string }
    }
  };

  return {
    siteName: config?.identity?.siteName ?? 'This website',
    contactEmail: config?.identity?.contact?.email ?? null,
  };
}

export default async function SuspendedPage() {
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? '';

  const { siteName, contactEmail } = await getSuspendedTenantInfo(tenantId);

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      aria-labelledby="suspended-heading"
    >
      <div className="max-w-md w-full text-center">
        {/* Logo placeholder — tenant branding preserved */}
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-2xl" aria-hidden="true">⚠️</span>
        </div>

        <h1 id="suspended-heading" className="text-2xl font-bold text-gray-900 mb-3">
          {siteName} is Temporarily Suspended
        </h1>

        <p className="text-gray-600 mb-6">
          This account has been temporarily suspended due to a billing issue.
          Please contact support to resolve this and restore service.
        </p>

        {/* Contact information */}
        {contactEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              Contact us at:
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 font-medium hover:text-blue-700 underline"
            >
              {contactEmail}
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In to Manage Billing
          </a>

          <a
            href="mailto:support@youragency.com"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Additional information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact our support team
            with your account information.
          </p>
        </div>
      </div>
    </main>
  );
}
```

**Billing status principles:**

- **Real-time caching**: 1-minute TTL for near-real-time status updates
- **Fail-safe defaults**: Unknown tenants are treated as suspended
- **Graceful suspension**: Preserved branding with clear messaging
- **Event tracking**: Track all billing status changes for audit
- **Middleware integration**: Automatic routing based on billing status
- **Notification system**: Notify admins of status changes
- **Health monitoring**: Track overall billing health statistics

---

## Boundaries

| Tier             | Scope                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow sections 7.3 and 7.4 specifications; implement Redis caching; add graceful suspension; track billing events; integrate with middleware |
| ⚠️ **Ask first** | Changing existing billing logic; modifying suspension patterns; updating webhook integration                                                  |
| 🚫 **Never**     | Skip caching for billing status; expose sensitive billing data; break suspension page branding; ignore status updates                         |

---

## Success Verification

- [ ] **[Agent]** Test billing status checking — Status cached and retrieved correctly
- [ ] **[Agent]** Verify status updates — Changes reflected immediately
- [ ] **[Agent]** Test suspension pages — Graceful suspension pages displayed
- [ ] **[Agent]** Verify middleware integration — Routing works based on status
- [ ] **[Agent]** Test event tracking — Billing events logged correctly
- [ ] **[Agent]** Test notification system — Admins notified of changes
- [ ] **[Agent]** Test webhook integration — Stripe updates processed correctly
- [ ] **[Human]** Test with real billing scenarios — Production suspension works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Cache invalidation**: Ensure cache is busted immediately on status changes
- **Race conditions**: Handle concurrent status updates gracefully
- **Suspension branding**: Preserve tenant branding even when suspended
- **SEO considerations**: Prevent indexing of suspended pages
- **Notification reliability**: Ensure email notifications are sent reliably
- **Status consistency**: Maintain consistency across all systems

---

## Out of Scope

- Tenant resolution system (handled in separate task)
- Rate limiting implementation (handled in separate task)
- SAML/SSO integration (handled in separate task)
- Vercel domain management (handled in separate task)

---

## References

- [Section 7.3 Billing Status Check](docs/plan/domain-7/7.3-billing-status-check-packagesmulti-tenantsrccheck-billingts.md)
- [Section 7.4 Tenant Suspension Pattern](docs/plan/domain-7/7.4-tenant-suspension-pattern.md)
- [Section 7.1 Philosophy](docs/plan/domain-7/7.1-philosophy.md)
- [Section 7.8 Complete Tenant Resolution Sequence Diagram](docs/plan/domain-7/7.8-complete-tenant-resolution-sequence-diagram.md)
- [Stripe Webhook Documentation](https://stripe.com/docs/webhooks)
- [Redis Caching Best Practices](https://redis.io/docs/data-types/)
