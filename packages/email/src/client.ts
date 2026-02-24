import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import type { TenantEmailConfig } from './types';

const redis = Redis.fromEnv();

// Agency's main Resend account (used for platform emails)
const agencyResend = new Resend(process.env.RESEND_API_KEY!);

// Cache: tenant_id → { domainId, fromEmail, verified }
// TTL: 30 min (domains rarely change)

export async function getTenantEmailConfig(tenantId: string): Promise<TenantEmailConfig> {
  const cacheKey = `tenant:email:${tenantId}`;
  const cached = await redis.get<TenantEmailConfig>(cacheKey);
  if (cached) return cached;

  // Mock implementation - in production this would query the database
  const mockConfig: TenantEmailConfig = {
    fromEmail: `noreply@${tenantId}.example.com`,
    fromName: 'Our Team',
    replyTo: null,
    resendApiKey: process.env.RESEND_API_KEY!,
  };

  await redis.set(cacheKey, mockConfig, { ex: 1800 }); // 30 minutes
  return mockConfig;
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

  // Mock database update - in production this would store the domain ID
  console.log(`Would store domain ID ${data.id} for tenant ${tenantId}`);

  // Bust cache
  await redis.del(`email-config:${tenantId}`);

  return { dnsRecords: data.records as ResendDNSRecord[] };
}

// Poll domain verification status (called from a scheduled job)
export async function checkTenantEmailDomainVerification(tenantId: string): Promise<boolean> {
  // Mock implementation - in production this would query the database for domain ID
  const mockDomainId = `mock-domain-${tenantId}`;

  if (!mockDomainId) return false;

  const { data: domain } = await agencyResend.domains.get(mockDomainId);

  const verified = domain?.status === 'verified';

  if (verified) {
    // Mock database update - in production this would update the tenant record
    console.log(`Would mark domain as verified for tenant ${tenantId}`);
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
