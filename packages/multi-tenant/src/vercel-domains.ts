import { Redis } from '@upstash/redis';
import { Vercel } from '@vercel/sdk';

import { db } from '@repo/db';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API_TOKEN!,
});

const redis = Redis.fromEnv();
const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TEAM_ID = process.env.VERCEL_TEAM_ID!;

export type DomainVerificationRecord = {
  type: 'TXT' | 'CNAME' | 'A';
  name: string;
  value: string;
};

export type DomainStatus = {
  name: string;
  verified: boolean;
  sslStatus: 'pending' | 'issued' | 'error';
  verificationRecords?: DomainVerificationRecord[];
};

export type DomainConfig = {
  name: string;
  verified: boolean;
  verification?: Array<{
    type: 'TXT';
    domain: string;
    value: string;
    reason: string;
  }>;
};

export type DomainEvent = {
  tenantId: string;
  domain: string;
  status: DomainAddResult['status'];
  createdAt: string;
};

export type DomainAnalytics = {
  totalConfigured: number;
  verified: number;
  pending: number;
};

export type DomainHealth = {
  hasApiToken: boolean;
  hasProjectId: boolean;
  hasTeamId: boolean;
};

export type DNSInstruction = {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  ttl?: number;
  note?: string;
};

export type DomainAddResult = {
  status: 'added' | 'already_exists' | 'conflict' | 'error';
  domain?: DomainConfig;
  dnsInstructions?: DNSInstruction[];
  error?: string;
};

function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function getVerificationRecords(domain: string, verification?: DomainConfig['verification']): DNSInstruction[] {
  if (!verification?.length) {
    return [];
  }

  return verification.map((record) => ({
    type: 'TXT',
    name: record.domain.replace(`.${domain}`, '') || '@',
    value: record.value,
    note: `Required for domain verification: ${record.reason}`,
  }));
}

function getBaseDnsRecords(domain: string): DNSInstruction[] {
  const domainSegments = domain.split('.');
  const isApex = domainSegments.length <= 2;

  if (isApex) {
    return [
      {
        type: 'A',
        name: '@',
        value: '76.76.21.21',
        ttl: 3600,
        note: 'Add at your DNS provider for the root domain',
      },
      {
        type: 'CNAME',
        name: 'www',
        value: 'cname.vercel-dns.com.',
        ttl: 3600,
        note: 'Optional: redirects www to root domain',
      },
    ];
  }

  return [
    {
      type: 'CNAME',
      name: domainSegments[0] ?? '@',
      value: 'cname.vercel-dns.com.',
      ttl: 3600,
      note: 'Add at your DNS provider',
    },
  ];
}

export async function addDomainToVercel(domain: string): Promise<DomainAddResult> {
  const normalized = normalizeDomain(domain);

  try {
    const result = await vercel.projects.addProjectDomain({
      idOrName: PROJECT_ID,
      teamId: TEAM_ID,
      requestBody: { name: normalized },
    });

    const domainConfig: DomainConfig = {
      name: normalized,
      verified: result.verified ?? false,
      verification: result.verification,
    };

    const dnsInstructions = [
      ...getBaseDnsRecords(normalized),
      ...getVerificationRecords(normalized, result.verification),
    ];

    return { status: 'added', domain: domainConfig, dnsInstructions };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('forbidden') || message.includes('not authorized')) {
      return {
        status: 'conflict',
        error:
          'This domain is currently associated with another project. Please remove it from its current location first.',
      };
    }

    if (message.includes('already') || message.includes('in_use')) {
      return { status: 'already_exists' };
    }

    return { status: 'error', error: message };
  }
}

export async function removeDomainFromVercel(domain: string): Promise<void> {
  await vercel.projects.removeProjectDomain({
    idOrName: PROJECT_ID,
    domain: normalizeDomain(domain),
    teamId: TEAM_ID,
  });
}

export async function checkDomainVerification(
  domain: string
): Promise<{ verified: boolean; config?: DomainConfig }> {
  const normalized = normalizeDomain(domain);

  try {
    const config = await vercel.projects.getProjectDomain({
      idOrName: PROJECT_ID,
      domain: normalized,
      teamId: TEAM_ID,
    });

    return {
      verified: config.verified ?? false,
      config: {
        name: normalized,
        verified: config.verified ?? false,
        verification: config.verification,
      },
    };
  } catch {
    return { verified: false };
  }
}

export async function addCustomDomainForTenant(
  tenantId: string,
  domain: string
): Promise<DomainAddResult> {
  const normalized = normalizeDomain(domain);

  const { data: existing } = await db
    .from('tenants')
    .select('id')
    .eq('custom_domain', normalized)
    .neq('id', tenantId)
    .maybeSingle();

  if (existing) {
    return {
      status: 'conflict',
      error: 'This domain is already registered to another account.',
    };
  }

  const result = await addDomainToVercel(normalized);

  if (result.status === 'added' || result.status === 'already_exists') {
    await db
      .from('tenants')
      .update({
        custom_domain: normalized,
        custom_domain_verified: false,
        custom_domain_added_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    if (result.dnsInstructions?.length) {
      await redis.setex(`domain-dns:${tenantId}`, 7 * 24 * 3600, JSON.stringify(result.dnsInstructions));
    }

    const { enqueue } = await import('@repo/jobs/client');
    await enqueue(
      'domain.verify',
      { tenantId, domain: normalized },
      {
        notBefore: new Date(Date.now() + 5 * 60 * 1000),
      }
    );
  }

  return result;
}

export async function verifyAndActivateDomain(
  tenantId: string,
  domain: string
): Promise<{ activated: boolean; retryIn?: number }> {
  const normalized = normalizeDomain(domain);
  const { verified } = await checkDomainVerification(normalized);

  if (verified) {
    await db
      .from('tenants')
      .update({
        custom_domain_verified: true,
        custom_domain_verified_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    await redis.del(`tenant-domain:${normalized}`);

    const { checkTenantEmailDomainVerification } = await import('@repo/email/client');
    await checkTenantEmailDomainVerification(tenantId);

    return { activated: true };
  }

  return { activated: false, retryIn: 300 };
}

export async function removeCustomDomainForTenant(tenantId: string): Promise<void> {
  const { data: tenant } = await db
    .from('tenants')
    .select('custom_domain')
    .eq('id', tenantId)
    .single<{ custom_domain: string | null }>();

  if (!tenant?.custom_domain) {
    return;
  }

  await removeDomainFromVercel(tenant.custom_domain);

  await db
    .from('tenants')
    .update({
      custom_domain: null,
      custom_domain_verified: false,
      custom_domain_added_at: null,
      custom_domain_verified_at: null,
    })
    .eq('id', tenantId);

  await redis.del(`tenant-domain:${tenant.custom_domain}`);
  await redis.del(`domain-dns:${tenantId}`);
}

export async function addTenantDomain(customDomain: string): Promise<DomainStatus> {
  const result = await addDomainToVercel(customDomain);

  if (result.status === 'error' || result.status === 'conflict') {
    throw new Error(result.error ?? 'Failed to add domain to Vercel');
  }

  return {
    name: normalizeDomain(customDomain),
    verified: result.domain?.verified ?? false,
    sslStatus: result.domain?.verified ? 'issued' : 'pending',
    verificationRecords: result.dnsInstructions?.map((instruction) => ({
      type: instruction.type,
      name: instruction.name,
      value: instruction.value,
    })),
  };
}

export async function checkDomainStatus(customDomain: string): Promise<DomainStatus> {
  const { verified, config } = await checkDomainVerification(customDomain);

  return {
    name: normalizeDomain(customDomain),
    verified,
    sslStatus: verified ? 'issued' : 'pending',
    verificationRecords: getVerificationRecords(normalizeDomain(customDomain), config?.verification).map(
      (record) => ({
        type: record.type,
        name: record.name,
        value: record.value,
      })
    ),
  };
}

export async function pollDomainVerification(
  tenantId: string,
  customDomain: string
): Promise<{ verified: boolean; retryIn?: number }> {
  const result = await verifyAndActivateDomain(tenantId, customDomain);
  return { verified: result.activated, retryIn: result.retryIn };
}

export async function removeTenantDomain(customDomain: string): Promise<void> {
  await removeDomainFromVercel(customDomain);
}

export async function getDomainDNSRecords(tenantId: string): Promise<DNSInstruction[]> {
  const cached = await redis.get<string>(`domain-dns:${tenantId}`);
  if (!cached) {
    return [];
  }

  try {
    const parsed = JSON.parse(cached) as DNSInstruction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function validateDomainFormat(domain: string): boolean {
  const normalized = normalizeDomain(domain);
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(
    normalized
  );
}

export function extractRootDomain(domain: string): string {
  const normalized = normalizeDomain(domain);
  const parts = normalized.split('.');

  if (parts.length <= 2) {
    return normalized;
  }

  return parts.slice(-2).join('.');
}

export async function getDomainEvents(tenantId: string): Promise<DomainEvent[]> {
  const { data } = await db
    .from('tenants')
    .select('custom_domain, custom_domain_verified, custom_domain_added_at')
    .eq('id', tenantId)
    .single<{ custom_domain: string | null; custom_domain_verified: boolean | null; custom_domain_added_at: string | null }>();

  if (!data?.custom_domain) {
    return [];
  }

  return [
    {
      tenantId,
      domain: data.custom_domain,
      status: data.custom_domain_verified ? 'added' : 'already_exists',
      createdAt: data.custom_domain_added_at ?? new Date().toISOString(),
    },
  ];
}

export async function getDomainAnalytics(): Promise<DomainAnalytics> {
  const { data } = await db
    .from('tenants')
    .select('custom_domain, custom_domain_verified')
    .not('custom_domain', 'is', null);

  const totalConfigured = data?.length ?? 0;
  const verified = data?.filter((tenant) => tenant.custom_domain_verified).length ?? 0;

  return {
    totalConfigured,
    verified,
    pending: totalConfigured - verified,
  };
}

export function getDomainHealth(): DomainHealth {
  return {
    hasApiToken: Boolean(process.env.VERCEL_API_TOKEN),
    hasProjectId: Boolean(process.env.VERCEL_PROJECT_ID),
    hasTeamId: Boolean(process.env.VERCEL_TEAM_ID),
  };
}

export async function handleVercelDomainWebhook(payload: {
  type: string;
  payload: { domain: string; projectId: string };
}): Promise<void> {
  const { domain } = payload.payload;

  if (payload.type === 'domain.verified') {
    // Only update status if tenant is currently pending_domain verification
    // Don't override suspended or other statuses
    await db
      .from('tenants')
      .update({
        status: 'active',
        custom_domain_verified: true,
        custom_domain_verified_at: new Date().toISOString()
      })
      .eq('custom_domain', domain)
      .eq('status', 'pending_domain');

    const { invalidateTenantCache } = await import('./resolve-tenant');
    const { data: tenant } = await db.from('tenants').select('id').eq('custom_domain', domain).single();

    if (tenant) {
      await invalidateTenantCache(tenant.id);
    }
  }
}

export async function setupWildcardDomain(apexDomain: string): Promise<void> {
  await vercel.projects.addProjectDomain({
    idOrName: PROJECT_ID,
    teamId: TEAM_ID,
    requestBody: { name: apexDomain },
  });

  await vercel.projects.addProjectDomain({
    idOrName: PROJECT_ID,
    teamId: TEAM_ID,
    requestBody: { name: `*.${apexDomain}` },
  });
}
