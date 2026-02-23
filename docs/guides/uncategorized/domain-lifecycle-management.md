# domain-lifecycle-management.md

> **2026 Standards Compliance** | Vercel for Platforms SDK · Next.js 16 Server Actions

## Table of Contents

1. [Overview](#overview)
2. [Domain States](#domain-states)
3. [Vercel SDK Setup](#vercel-sdk-setup)
4. [Domain Provisioning Flow](#domain-provisioning-flow)
5. [DNS Verification Polling](#dns-verification-polling)
6. [SSL Certificate Management](#ssl-certificate-management)
7. [Domain Removal & Cleanup](#domain-removal--cleanup)
8. [UI Components](#ui-components)
9. [Security Considerations](#security-considerations)
10. [References](#references)

---

## Overview

Programmatic domain lifecycle management enables tenants to bring their own custom
domains to your SaaS platform. The Vercel for Platforms SDK (`@vercel/platforms`) handles
the heavy lifting: adding domains to your Vercel project, verifying DNS ownership, and
auto-provisioning SSL certificates via Let's Encrypt.

The full lifecycle is:

```
PENDING → VERIFYING → VERIFIED → ACTIVE → (REMOVING → REMOVED)
```

---

## Domain States

```typescript
// packages/types/src/domain.ts
export type DomainStatus =
  | 'pending' // Added to DB, not yet submitted to Vercel
  | 'verifying' // Added to Vercel, awaiting DNS propagation
  | 'verified' // DNS confirmed, SSL cert provisioned
  | 'active' // Serving tenant traffic
  | 'failed' // Verification failed (bad DNS, ownership dispute)
  | 'removing' // Deletion in progress
  | 'removed'; // Fully removed from Vercel + DB

export interface TenantDomain {
  id: string;
  tenantId: string;
  domain: string; // e.g., "app.acme.com"
  status: DomainStatus;
  vercelDomainId?: string;
  dnsRecords?: DnsRecord[];
  sslStatus?: 'pending' | 'issued' | 'expired';
  addedAt: Date;
  verifiedAt?: Date;
  lastCheckedAt?: Date;
  errorMessage?: string;
}

export interface DnsRecord {
  type: 'CNAME' | 'A' | 'TXT';
  name: string; // e.g., "@" or "app"
  value: string; // e.g., "cname.vercel-dns.com"
}
```

---

## Vercel SDK Setup

```typescript
// packages/domains/src/vercel-client.ts
import { Vercel } from '@vercel/sdk';

export const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API_TOKEN!,
});

export const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
export const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional for personal accounts
```

---

## Domain Provisioning Flow

### Step 1 — Validate & Add Domain

```typescript
// packages/domains/src/domain-service.ts
import { vercel, PROJECT_ID, TEAM_ID } from './vercel-client';
import { createServiceClient } from '@repo/db/supabase-server';
import { redis } from '@repo/cache';

const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

export async function addTenantDomain(tenantId: string, domain: string): Promise<TenantDomain> {
  // Validate domain format
  if (!DOMAIN_REGEX.test(domain)) {
    throw new Error('INVALID_DOMAIN_FORMAT');
  }

  // Normalize to lowercase
  const normalizedDomain = domain.toLowerCase().trim();

  // Check domain not already claimed by another tenant
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from('tenant_domains')
    .select('tenant_id')
    .eq('domain', normalizedDomain)
    .neq('status', 'removed')
    .single();

  if (existing && existing.tenant_id !== tenantId) {
    throw new Error('DOMAIN_ALREADY_CLAIMED');
  }

  // Add to Vercel project
  let vercelResponse: Awaited<ReturnType<typeof vercel.projects.addProjectDomain>>;
  try {
    vercelResponse = await vercel.projects.addProjectDomain({
      idOrName: PROJECT_ID,
      teamId: TEAM_ID,
      requestBody: {
        name: normalizedDomain,
        redirect: null,
        gitBranch: null,
      },
    });
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === 'domain_already_in_use') {
      throw new Error('DOMAIN_IN_USE_BY_OTHER_PROJECT');
    }
    throw err;
  }

  // Store in DB
  const { data: domainRecord, error: dbError } = await supabase
    .from('tenant_domains')
    .upsert({
      tenant_id: tenantId,
      domain: normalizedDomain,
      status: 'verifying',
      vercel_domain_id: vercelResponse.name,
      added_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (dbError || !domainRecord) {
    throw new Error(`DB insert failed: ${dbError?.message}`);
  }

  // Get DNS records to display to user
  const dnsRecords = extractDnsRecords(vercelResponse);

  return {
    ...domainRecord,
    dnsRecords,
    status: 'verifying',
  };
}

function extractDnsRecords(vercelDomain: unknown): DnsRecord[] {
  const d = vercelDomain as {
    verification?: Array<{ type: string; domain: string; value: string }>;
    apexName?: string;
    name?: string;
  };
  const records: DnsRecord[] = [];

  // TXT record for ownership verification
  if (d.verification?.length) {
    for (const v of d.verification) {
      records.push({
        type: v.type as 'TXT',
        name: v.domain,
        value: v.value,
      });
    }
  }

  // CNAME record for traffic routing
  records.push({
    type: 'CNAME',
    name: d.name === d.apexName ? '@' : (d.name?.replace(`.${d.apexName}`, '') ?? '@'),
    value: 'cname.vercel-dns.com',
  });

  return records;
}
```

### Step 2 — Server Action (Next.js 16)

```typescript
// apps/portal/src/app/settings/domains/actions.ts
'use server';
import { addTenantDomain, removeTenantDomain } from '@repo/domains';
import { verifyTenantSession } from '@repo/auth';
import { revalidatePath } from 'next/cache';

export async function addDomainAction(_: unknown, formData: FormData) {
  const session = await verifyTenantSession();
  const domain = formData.get('domain') as string;

  if (!domain) return { error: 'Domain is required' };

  try {
    const result = await addTenantDomain(session.tenantId, domain);
    revalidatePath('/settings/domains');
    return { success: true, domain: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      error:
        message === 'DOMAIN_ALREADY_CLAIMED'
          ? 'This domain is already in use by another account.'
          : `Failed to add domain: ${message}`,
    };
  }
}
```

---

## DNS Verification Polling

Verify domain ownership by polling Vercel's API every 20 seconds (matching the
Vercel for Platforms block recommendation):

```typescript
// packages/domains/src/verification-poller.ts
import { vercel, PROJECT_ID, TEAM_ID } from './vercel-client';
import { createServiceClient } from '@repo/db/supabase-server';

export async function pollDomainVerification(domain: string): Promise<{
  verified: boolean;
  sslStatus: string;
  configuredCorrectly: boolean;
}> {
  const supabase = createServiceClient();

  try {
    const domainConfig = await vercel.projects.getProjectDomain({
      idOrName: PROJECT_ID,
      domain,
      teamId: TEAM_ID,
    });

    const verified =
      domainConfig.verified === true &&
      domainConfig.verification?.every((v) => v.type !== undefined) !== false;

    const sslStatus = domainConfig.ssl ?? 'pending';

    if (verified) {
      // Update DB status
      await supabase
        .from('tenant_domains')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          ssl_status: sslStatus,
          last_checked_at: new Date().toISOString(),
          error_message: null,
        })
        .eq('domain', domain);

      // Warm the resolution cache
      const tenant = await getTenantByDomain(domain);
      if (tenant) {
        await redis.set(`domain:${domain}`, tenant, { ex: 300 });
      }
    } else {
      await supabase
        .from('tenant_domains')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('domain', domain);
    }

    return { verified, sslStatus, configuredCorrectly: verified };
  } catch {
    return { verified: false, sslStatus: 'unknown', configuredCorrectly: false };
  }
}

// QStash scheduled job — polls all 'verifying' domains every 20s
export async function pollAllPendingDomains() {
  const supabase = createServiceClient();

  // Only poll domains added in last 72h (abandon stale ones)
  const { data: domains } = await supabase
    .from('tenant_domains')
    .select('domain, tenant_id, added_at')
    .eq('status', 'verifying')
    .gt('added_at', new Date(Date.now() - 72 * 3_600_000).toISOString());

  if (!domains?.length) return { checked: 0 };

  const results = await Promise.allSettled(domains.map((d) => pollDomainVerification(d.domain)));

  return {
    checked: results.length,
    verified: results.filter((r) => r.status === 'fulfilled' && r.value.verified).length,
  };
}
```

---

## SSL Certificate Management

Vercel auto-provisions SSL via Let's Encrypt once DNS is verified. Monitor cert status:

```typescript
// packages/domains/src/ssl-monitor.ts
export async function checkSslStatus(domain: string): Promise<{
  status: 'pending' | 'issued' | 'expiring' | 'expired';
  expiresAt?: Date;
}> {
  const domainConfig = await vercel.projects.getProjectDomain({
    idOrName: PROJECT_ID,
    domain,
  });

  const ssl = domainConfig.ssl as {
    state?: string;
    expiresAt?: string;
  } | null;

  if (!ssl || ssl.state === 'pending') {
    return { status: 'pending' };
  }

  const expiresAt = ssl.expiresAt ? new Date(ssl.expiresAt) : undefined;
  const daysUntilExpiry = expiresAt ? (expiresAt.getTime() - Date.now()) / 86_400_000 : null;

  if (daysUntilExpiry !== null && daysUntilExpiry < 0) return { status: 'expired', expiresAt };
  if (daysUntilExpiry !== null && daysUntilExpiry < 30) return { status: 'expiring', expiresAt };
  return { status: 'issued', expiresAt };
}
```

---

## Domain Removal & Cleanup

```typescript
// packages/domains/src/domain-service.ts (continued)
export async function removeTenantDomain(tenantId: string, domain: string): Promise<void> {
  const supabase = createServiceClient();

  // Verify ownership
  const { data } = await supabase
    .from('tenant_domains')
    .select('id, status')
    .eq('tenant_id', tenantId)
    .eq('domain', domain)
    .single();

  if (!data) throw new Error('DOMAIN_NOT_FOUND');
  if (data.status === 'removing' || data.status === 'removed') return;

  // Mark as removing
  await supabase.from('tenant_domains').update({ status: 'removing' }).eq('id', data.id);

  // Remove from Vercel
  try {
    await vercel.projects.removeProjectDomain({
      idOrName: PROJECT_ID,
      domain,
      teamId: TEAM_ID,
    });
  } catch (err) {
    // Domain may already be removed from Vercel; continue to DB cleanup
    console.warn(`Vercel domain removal failed for ${domain}:`, err);
  }

  // Remove from DB
  await supabase
    .from('tenant_domains')
    .update({ status: 'removed', removed_at: new Date().toISOString() })
    .eq('id', data.id);

  // Invalidate cache
  await redis.del(`domain:${domain}`);

  // Set 301 redirect from custom domain back to subdomain
  // (Handled automatically once domain is removed from Vercel)
}
```

---

## UI Components

```tsx
// apps/portal/src/features/manage-domains/ui/DomainManager.tsx
'use client';
import { useActionState } from 'react';
import { addDomainAction } from '../actions';

export function DomainManager({ domains }: { domains: TenantDomain[] }) {
  const [state, action, isPending] = useActionState(addDomainAction, null);

  return (
    <div className="space-y-6">
      <form action={action} className="flex gap-3">
        <input
          type="text"
          name="domain"
          placeholder="app.yourdomain.com"
          pattern="^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$"
          aria-label="Custom domain"
          aria-describedby="domain-hint"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Adding…' : 'Add Domain'}
        </button>
      </form>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <DomainList domains={domains} />
    </div>
  );
}

function DomainStatusBadge({ status }: { status: DomainStatus }) {
  const config = {
    pending: { label: 'Pending', class: 'bg-gray-100 text-gray-600' },
    verifying: { label: 'Verifying', class: 'bg-yellow-100 text-yellow-700' },
    verified: { label: 'Verified', class: 'bg-green-100 text-green-700' },
    active: { label: 'Active', class: 'bg-green-100 text-green-700' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-700' },
    removing: { label: 'Removing', class: 'bg-gray-100 text-gray-500' },
    removed: { label: 'Removed', class: 'bg-gray-100 text-gray-400' },
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${config.class}`}
    >
      {config.label}
    </span>
  );
}
```

### DNS Records Display Component

```tsx
// Shown while status === 'verifying'
function DnsInstructions({ records }: { records: DnsRecord[] }) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="text-sm font-semibold text-yellow-800 mb-2">
        Add these DNS records at your registrar:
      </h3>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-left text-yellow-700">
            <th className="pr-4">Type</th>
            <th className="pr-4">Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className="border-t border-yellow-200">
              <td className="py-1 pr-4">{r.type}</td>
              <td className="py-1 pr-4">{r.name}</td>
              <td className="py-1 flex items-center gap-2">
                <code className="break-all">{r.value}</code>
                <CopyButton value={r.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Security Considerations

### Domain Ownership Validation

- **DNS Verification**: Only domains with proper DNS records are activated
- **Tenant Isolation**: Each tenant can only manage their own domains
- **Rate Limiting**: Prevent domain spam with per-tenant limits
- **Audit Logging**: Track all domain operations for compliance

### SSL Certificate Security

- **Automatic Renewal**: Let's Encrypt handles cert renewal automatically
- **Certificate Monitoring**: Alert on expiring certificates (30 days)
- **Fallback Handling**: Graceful degradation if SSL fails
- **Security Headers**: HSTS and other headers applied automatically

### Database Schema

```sql
-- supabase/migrations/20260223_tenant_domains.sql
CREATE TABLE tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  vercel_domain_id TEXT,
  dns_records JSONB,
  ssl_status TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,
  error_message TEXT,

  UNIQUE(tenant_id, domain),
  UNIQUE(domain) WHERE status NOT IN ('removed', 'failed')
);

-- RLS policies
CREATE POLICY "Tenants can view own domains" ON tenant_domains
  FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Tenants can insert own domains" ON tenant_domains
  FOR INSERT WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Tenants can update own domains" ON tenant_domains
  FOR UPDATE USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Tenants can delete own domains" ON tenant_domains
  FOR DELETE USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Indexes for performance
CREATE INDEX idx_tenant_domains_tenant_id ON tenant_domains(tenant_id);
CREATE INDEX idx_tenant_domains_status ON tenant_domains(status);
CREATE INDEX idx_tenant_domains_domain ON tenant_domains(domain);
CREATE INDEX idx_tenant_domains_last_checked ON tenant_domains(last_checked_at);
```

---

## References

- [Vercel for Platforms SDK](https://vercel.com/docs/platforms/sdk) - Programmatic domain management
- [Vercel Projects API](https://vercel.com/docs/rest-api#endpoints/projects) - Domain operations
- [Next.js 16 Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) - Form handling
- [Let's Encrypt SSL](https://letsencrypt.org/docs/) - Certificate provisioning
- [DNS Propagation Times](https://vercel.com/docs/concepts/domains/dns-records) - DNS verification timing
- [Domain Security Best Practices](https://vercel.com/docs/concepts/domains/security) - Domain security guidelines

---
