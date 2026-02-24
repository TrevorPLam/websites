import { Resend } from 'resend';
import { db } from '@repo/db';
import { Redis } from '@upstash/redis';
import type { TenantEmailConfig } from './types';

const redis = Redis.fromEnv();

// Agency's main Resend account (used for platform emails)
const agencyResend = new Resend(process.env.RESEND_API_KEY!);

// Cache: tenant_id → { domainId, fromEmail, verified }
// TTL: 30 min (domains rarely change)

export async function getTenantEmailConfig(tenantId: string): Promise<TenantEmailConfig> {
  const cacheKey = `email-config:${tenantId}`;
  const cached = await redis.get<TenantEmailConfig>(cacheKey);
  if (cached) return cached;

  const { data: tenant } = await db
    .from('tenants')
    .select(
      `
      config->identity->siteName,
      config->identity->contact->email,
      custom_domain,
      resend_domain_id,
      resend_domain_verified
    `
    )
    .eq('id', tenantId)
    .single();

  const siteName = (tenant as any)?.['config->identity->siteName'] ?? 'Our Team';
  const ownerEmail = (tenant as any)?.['config->identity->contact->email'] ?? null;
  const customDomain = (tenant as any)?.custom_domain ?? null;
  const domainVerified = (tenant as any)?.resend_domain_verified ?? false;
  const resendDomainId = (tenant as any)?.resend_domain_id ?? null;

  let fromEmail: string;
  if (customDomain && domainVerified) {
    // Use client's own verified domain
    fromEmail = `notifications@${customDomain}`;
  } else {
    // Fall back to agency subdomain: noreply@agency.com
    fromEmail = `noreply@${process.env.AGENCY_EMAIL_DOMAIN}`;
  }

  const config: TenantEmailConfig = {
    fromEmail,
    fromName: siteName,
    replyTo: ownerEmail ?? undefined,
    domainVerified,
    resendDomainId: resendDomainId ?? undefined,
  };

  await redis.setex(cacheKey, 1800, JSON.stringify(config)); // 30 min cache
  return config;
}

// Provision a Resend sending domain for a tenant (called during onboarding)
export async function provisionTenantEmailDomain(
  tenantId: string,
  domain: string
): Promise<{ dnsRecords: ResendDNSRecord[] }> {
  const { data, error } = await agencyResend.domains.create({
    name: domain,
    region: 'us-east-1',
    // Custom return path improves DMARC alignment
    customReturnPath: 'mail',
  });

  if (error || !data) {
    throw new Error(`Failed to create Resend domain: ${error?.message}`);
  }

  // Store Resend domain ID for future API calls
  await db
    .from('tenants')
    .update({
      resend_domain_id: data.id,
      resend_domain_verified: false,
    })
    .eq('id', tenantId);

  // Bust cache
  await redis.del(`email-config:${tenantId}`);

  return { dnsRecords: data.records as ResendDNSRecord[] };
}

// Poll domain verification status (called from a scheduled job)
export async function checkTenantEmailDomainVerification(tenantId: string): Promise<boolean> {
  const { data: tenant } = await db
    .from('tenants')
    .select('resend_domain_id')
    .eq('id', tenantId)
    .single();

  if (!tenant?.resend_domain_id) return false;

  const { data: domain } = await agencyResend.domains.get(tenant.resend_domain_id);

  const verified = domain?.status === 'verified';

  if (verified) {
    await db
      .from('tenants')
      .update({
        resend_domain_verified: true,
      })
      .eq('id', tenantId);

    await redis.del(`email-config:${tenantId}`);
  }

  return verified;
}

type ResendDNSRecord = {
  type: string;
  name: string;
  value: string;
  ttl: string;
  priority?: number;
};
