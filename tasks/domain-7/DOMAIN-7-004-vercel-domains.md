---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-7-004
title: 'Vercel for Platforms programmatic domain lifecycle'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-7-004-vercel-domains
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-7-004 · Vercel for Platforms programmatic domain lifecycle

## Objective

Implement Vercel for Platforms programmatic domain lifecycle management following section 7.6 specification with automated custom domain assignment, SSL certificate provisioning, domain verification, and lifecycle management for multi-tenant custom domains.

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

**Codebase area:** Multi-tenant domain management — Custom domain automation

**Related files:** Vercel SDK integration, domain lifecycle management, SSL provisioning

**Dependencies:** Vercel SDK, Vercel API tokens, tenant management system

**Prior work**: Basic domain awareness exists but lacks comprehensive programmatic domain management

**Constraints:** Must follow section 7.6 specification with proper domain lifecycle automation and SSL provisioning

---

## Tech Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Platform  | Vercel for Platforms SDK                  |
| Domains   | Custom domain assignment and verification |
| SSL       | Automated certificate provisioning        |
| Lifecycle | Domain addition, verification, removal    |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement Vercel SDK integration following section 7.6 specification
- [ ] **[Agent]** Create custom domain assignment automation
- [ ] **[Agent]** Add SSL certificate provisioning
- [ ] **[Agent]** Implement domain verification and status checking
- [ ] **[Agent]** Create domain lifecycle management (add, verify, remove)
- [ ] **[Agent]** Add domain status monitoring and notifications
- [ ] **[Agent]** Test domain lifecycle flows
- [ ] **[Human]** Verify domain management follows section 7.6 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 7.6 specification** — Extract domain lifecycle requirements
- [ ] **[Agent]** **Create Vercel SDK integration** — Set up API client and authentication
- [ ] **[Agent]** **Implement domain assignment** — Add custom domains to projects
- [ ] **[Agent]** **Add SSL provisioning** — Automate certificate management
- [ ] **[Agent]** **Create verification system** — Poll domain verification status
- [ ] **[Agent]** **Add lifecycle management** — Handle domain addition, verification, removal
- [ ] **[Agent]** **Test domain flows** — Verify complete lifecycle works

> ⚠️ **Agent Question**: Ask human before proceeding if any existing domain management needs migration to new programmatic system.

---

## Commands

```bash
# Test Vercel domain management
pnpm test --filter="@repo/multi-tenant"

# Test domain addition
node -e "
import { addTenantDomain } from '@repo/multi-tenant/vercel-domains';
const result = await addTenantDomain('acmelaw.com');
console.log('Domain addition result:', result);
"

# Test domain verification
node -e "
import { checkDomainStatus } from '@repo/multi-tenant/vercel-domains';
const status = await checkDomainStatus('acmelaw.com');
console.log('Domain verification status:', status);
"

# Test domain removal
node -e "
import { removeTenantDomain } from '@repo/multi-tenant/vercel-domains';
await removeTenantDomain('acmelaw.com');
console.log('Domain removal completed');
"

# Test domain status monitoring
node -e "
import { getDomainAnalytics } from '@repo/multi-tenant/vercel-domains';
const analytics = await getDomainAnalytics();
console.log('Domain analytics:', analytics);
"
```

---

## Code Style

```typescript
// ✅ Correct — Vercel for Platforms integration following section 7.6
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API_TOKEN!,
});

const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TEAM_ID = process.env.VERCEL_TEAM_ID!;

// ============================================================================
// TYPES
// ============================================================================

export type DomainStatus = {
  name: string;
  verified: boolean;
  sslStatus: 'pending' | 'issued' | 'error';
  verificationRecords?: Array<{
    type: 'TXT' | 'CNAME' | 'A';
    name: string;
    value: string;
  }>;
  addedAt?: string;
  lastChecked?: string;
};

export type DomainConfig = {
  name: string;
  tenantId: string;
  status: 'pending' | 'verified' | 'error';
  verificationRecords?: DomainStatus['verificationRecords'];
  sslStatus: DomainStatus['sslStatus'];
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// ADD CUSTOM DOMAIN FOR TENANT
// Called during client onboarding (Domain 15 §15.1)
// ============================================================================

export async function addTenantDomain(customDomain: string): Promise<DomainStatus> {
  try {
    // Step 1: Add domain to Vercel project
    const result = await vercel.projects.addProjectDomain({
      idOrName: PROJECT_ID,
      teamId: TEAM_ID,
      requestBody: {
        name: customDomain,
      },
    });

    // Step 2: Get verification records (for client's DNS setup instructions)
    const domainInfo = await vercel.domains.getDomain({
      domain: customDomain,
      teamId: TEAM_ID,
    });

    const status: DomainStatus = {
      name: customDomain,
      verified: result.verified ?? false,
      sslStatus: result.verified ? 'issued' : 'pending',
      verificationRecords: domainInfo.verification?.map((v: any) => ({
        type: v.type,
        name: v.domain,
        value: v.value,
      })),
    };

    // Store domain configuration in database
    await storeDomainConfig(customDomain, status);

    return status;
  } catch (err: any) {
    // Domain already exists in project — not an error, check status
    if (err?.code === 'domain_already_in_use') {
      return await checkDomainStatus(customDomain);
    }
    throw err;
  }
}

// ============================================================================
// POLL DOMAIN VERIFICATION STATUS
// DNS propagation takes 0–48 hours — poll with exponential backoff
// ============================================================================

export async function checkDomainStatus(customDomain: string): Promise<DomainStatus> {
  try {
    const config = await vercel.projects.getProjectDomain({
      idOrName: PROJECT_ID,
      domain: customDomain,
      teamId: TEAM_ID,
    });

    const status: DomainStatus = {
      name: customDomain,
      verified: config.verified ?? false,
      sslStatus: config.verified ? 'issued' : 'pending',
      lastChecked: new Date().toISOString(),
    };

    // Update database with latest status
    await updateDomainConfig(customDomain, status);

    return status;
  } catch (error) {
    console.error(`Failed to check domain status for ${customDomain}:`, error);
    throw error;
  }
}

// ============================================================================
// AUTOMATED VERIFICATION POLLING
// ============================================================================

export async function pollDomainVerification(
  customDomain: string,
  maxAttempts: number = 24, // Poll for up to 48 hours (every 2 hours)
  intervalMs: number = 2 * 60 * 60 * 1000 // 2 hours
): Promise<DomainStatus> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await checkDomainStatus(customDomain);

    if (status.verified && status.sslStatus === 'issued') {
      // Domain is fully verified and SSL is issued
      await notifyDomainVerified(customDomain, status);
      return status;
    }

    if (attempt < maxAttempts) {
      // Wait before next poll with exponential backoff
      const backoffMs = intervalMs * Math.pow(1.5, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  // Max attempts reached, return final status
  const finalStatus = await checkDomainStatus(customDomain);
  await notifyDomainVerificationFailed(customDomain, finalStatus);

  return finalStatus;
}

// ============================================================================
// REMOVE DOMAIN (offboarding — Domain 15 §15.2)
// ============================================================================

export async function removeTenantDomain(customDomain: string): Promise<void> {
  try {
    await vercel.projects.removeProjectDomain({
      idOrName: PROJECT_ID,
      domain: customDomain,
      teamId: TEAM_ID,
    });

    // Remove from database
    await removeDomainConfig(customDomain);

    // Notify domain removal
    await notifyDomainRemoved(customDomain);
  } catch (error) {
    console.error(`Failed to remove domain ${customDomain}:`, error);
    throw error;
  }
}

// ============================================================================
// DOMAIN CONFIGURATION MANAGEMENT
// ============================================================================

async function storeDomainConfig(customDomain: string, status: DomainStatus): Promise<void> {
  const config: DomainConfig = {
    name: customDomain,
    tenantId: '', // Will be filled by calling code
    status: status.verified ? 'verified' : 'pending',
    verificationRecords: status.verificationRecords,
    sslStatus: status.sslStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db
    .from('tenant_domains')
    .upsert({
      domain: customDomain,
      config: config,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
    })
    .eq('domain', customDomain);
}

async function updateDomainConfig(customDomain: string, status: DomainStatus): Promise<void> {
  await db
    .from('tenant_domains')
    .update({
      status: status.verified ? 'verified' : 'pending',
      verification_records: status.verificationRecords,
      ssl_status: status.sslStatus,
      updated_at: new Date().toISOString(),
      last_checked: status.lastChecked,
    })
    .eq('domain', customDomain);
}

async function removeDomainConfig(customDomain: string): Promise<void> {
  await db.from('tenant_domains').delete().eq('domain', customDomain);
}

// ============================================================================
// DOMAIN NOTIFICATIONS
// ============================================================================

async function notifyDomainVerified(customDomain: string, status: DomainStatus): Promise<void> {
  // Get tenant information for notifications
  const { data: domain } = await db
    .from('tenant_domains')
    .select('tenant_id')
    .eq('domain', customDomain)
    .single();

  if (!domain?.tenant_id) return;

  // Send notification to tenant admin
  const { data: tenant } = await db
    .from('tenants')
    .select('config')
    .eq('id', domain.tenant_id)
    .single();

  const config = tenant?.config as {
    identity?: {
      contact?: { email?: string };
    };
  };

  const adminEmail = config?.identity?.contact?.email;

  if (adminEmail) {
    // Send email notification (implementation depends on email system)
    console.log(`Domain verified notification sent to ${adminEmail} for ${customDomain}`);
  }

  // Track domain event
  await trackDomainEvent(customDomain, domain.tenant_id, {
    type: 'domain_verified',
    data: { sslStatus: status.sslStatus, verifiedAt: new Date().toISOString() },
  });
}

async function notifyDomainVerificationFailed(
  customDomain: string,
  status: DomainStatus
): Promise<void> {
  // Similar to above but for failed verification
  const { data: domain } = await db
    .from('tenant_domains')
    .select('tenant_id')
    .eq('domain', customDomain)
    .single();

  if (!domain?.tenant_id) return;

  await trackDomainEvent(customDomain, domain.tenant_id, {
    type: 'domain_verification_failed',
    data: { sslStatus: status.sslStatus, attempts: 24 },
  });
}

async function notifyDomainRemoved(customDomain: string): Promise<void> {
  const { data: domain } = await db
    .from('tenant_domains')
    .select('tenant_id')
    .eq('domain', customDomain)
    .single();

  if (!domain?.tenant_id) return;

  await trackDomainEvent(customDomain, domain.tenant_id, {
    type: 'domain_removed',
    data: { removedAt: new Date().toISOString() },
  });
}

// ============================================================================
// DOMAIN EVENT TRACKING
// ============================================================================

async function trackDomainEvent(
  customDomain: string,
  tenantId: string,
  event: {
    type: 'domain_added' | 'domain_verified' | 'domain_verification_failed' | 'domain_removed';
    data: Record<string, unknown>;
  }
): Promise<void> {
  const eventKey = `tenant:domains:events:${tenantId}`;
  const eventData = {
    ...event,
    domain: customDomain,
    timestamp: new Date().toISOString(),
  };

  // Store recent domain events (keep last 20)
  await redis.lpush(eventKey, JSON.stringify(eventData));
  await redis.ltrim(eventKey, 0, 19);
  await redis.expire(eventKey, 86400); // 24 hours
}

export async function getDomainEvents(tenantId: string): Promise<
  Array<{
    type: string;
    domain: string;
    data: Record<string, unknown>;
    timestamp: string;
  }>
> {
  const eventKey = `tenant:domains:events:${tenantId}`;
  const events = await redis.lrange(eventKey, 0, -1);

  return events.map((event) => JSON.parse(event));
}

// ============================================================================
// DOMAIN ANALYTICS
// ============================================================================

export async function getDomainAnalytics(): Promise<{
  totalDomains: number;
  verifiedDomains: number;
  pendingDomains: number;
  errorDomains: number;
  domainsByStatus: Record<string, number>;
  recentActivity: Array<{
    domain: string;
    action: string;
    timestamp: string;
  }>;
}> {
  const { data: domains } = await db
    .from('tenant_domains')
    .select('domain, status, ssl_status, updated_at')
    .order('updated_at', { descending: true });

  if (!domains) {
    return {
      totalDomains: 0,
      verifiedDomains: 0,
      pendingDomains: 0,
      errorDomains: 0,
      domainsByStatus: {},
      recentActivity: [],
    };
  }

  const statusCounts = domains.reduce(
    (acc, domain) => {
      const status = `${domain.status}_${domain.ssl_status}`;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalDomains: domains.length,
    verifiedDomains: domains.filter((d) => d.status === 'verified').length,
    pendingDomains: domains.filter((d) => d.status === 'pending').length,
    errorDomains: domains.filter((d) => d.status === 'error').length,
    domainsByStatus: statusCounts,
    recentActivity: domains.slice(0, 10).map((d) => ({
      domain: d.domain,
      action: `${d.status}_${d.ssl_status}`,
      timestamp: d.updated_at,
    })),
  };
}

// ============================================================================
// DOMAIN HEALTH CHECK
// ============================================================================

export async function getDomainHealth(): Promise<{
  vercelConnected: boolean;
  totalDomains: number;
  issues: Array<{
    domain: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}> {
  const issues: Array<{ domain: string; issue: string; severity: 'low' | 'medium' | 'high' }> = [];

  try {
    // Test Vercel API connection
    await vercel.projects.get({ teamId: TEAM_ID });

    const analytics = await getDomainHealth();

    // Check for domains with SSL issues
    const { data: domains } = await db
      .from('tenant_domains')
      .select('domain, ssl_status, status, updated_at')
      .or('ssl_status', 'eq', 'error')
      .or('status', 'eq', 'error');

    if (domains) {
      domains.forEach((domain) => {
        if (domain.ssl_status === 'error') {
          issues.push({
            domain: domain.domain,
            issue: 'SSL certificate error',
            severity: 'high',
          });
        }

        if (domain.status === 'error') {
          issues.push({
            domain: domain.domain,
            issue: 'Domain verification error',
            severity: 'medium',
          });
        }

        // Check for domains not updated recently (stale)
        const lastUpdate = new Date(domain.updated_at);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceUpdate > 7 && domain.status === 'pending') {
          issues.push({
            domain: domain.domain,
            issue: 'Domain verification pending for over 7 days',
            severity: 'low',
          });
        }
      });
    }

    return {
      vercelConnected: true,
      totalDomains: analytics.totalDomains,
      issues,
    };
  } catch (error) {
    return {
      vercelConnected: false,
      totalDomains: 0,
      issues: [
        {
          domain: 'system',
          issue: 'Vercel API connection failed',
          severity: 'high',
        },
      ],
    };
  }
}
```

**Vercel domain management principles:**

- **Programmatic automation**: Complete domain lifecycle via SDK
- **SSL provisioning**: Automatic certificate management
- **Verification polling**: Handle DNS propagation delays
- **Status tracking**: Monitor domain and SSL status
- **Event logging**: Track all domain events for audit
- **Health monitoring**: Monitor domain health and issues
- **Graceful handling**: Handle domain conflicts and errors

---

## Boundaries

| Tier             | Scope                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 7.6 specification; implement complete lifecycle; add SSL provisioning; handle verification polling; track events |
| ⚠️ **Ask first** | Changing existing domain management; modifying Vercel project configuration; updating DNS settings                              |
| 🚫 **Never**     | Skip SSL provisioning; ignore verification status; bypass event tracking; expose sensitive API keys                             |

---

## Success Verification

- [ ] **[Agent]** Test domain addition — Custom domains added successfully
- [ ] **[Agent]** Verify SSL provisioning — Certificates issued automatically
- [ ] **[Agent]** Test verification polling — Status updates correctly
- [ ] **[Agent]** Verify domain removal — Domains removed cleanly
- [ ] **[Agent]** Test event tracking — All domain events logged
- [ ] **[Agent]** Test health monitoring — Domain health tracked
- [ ] **[Agent]** Test notification system — Stakeholders notified correctly
- [ ] **[Human]** Test with real domains — Production domain management works
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **DNS propagation**: Handle 0-48 hour verification delays with polling
- **Domain conflicts**: Handle domains already in use gracefully
- **SSL issues**: Handle certificate provisioning failures
- **API rate limits**: Handle Vercel API rate limiting gracefully
- **Concurrent operations**: Handle simultaneous domain operations
- **Verification records**: Provide clear DNS setup instructions

---

## Out of Scope

- Tenant resolution system (handled in separate task)
- Billing status checking (handled in separate task)
- Rate limiting implementation (handled in separate task)
- SAML/SSO integration (handled in separate task)

---

## References

- [Section 7.6 Vercel for Platforms](docs/plan/domain-7/7.6-vercel-for-platforms-programmatic-domain-lifecycle.md)
- [Section 7.1 Philosophy](docs/plan/domain-7/7.1-philosophy.md)
- [Section 7.8 Complete Tenant Resolution Sequence Diagram](docs/plan/domain-7/7.8-complete-tenant-resolution-sequence-diagram.md)
- [Vercel SDK Documentation](https://vercel.com/docs/rest-api#endpoints/domains)
- [Vercel for Platforms](https://vercel.com/docs/platforms/overview)
- [Domain Management Best Practices](https://www.oreateai.com/blog/unlocking-custom-domains-and-dynamic-deployments-a-look-at-vercels-domain-apis)
