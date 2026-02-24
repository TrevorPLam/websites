import 'server-only';
import { Vercel } from '@vercel/sdk';
import { Redis } from '@upstash/redis';

// Vercel SDK client
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_API_TOKEN!,
});

const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TEAM_ID = process.env.VERCEL_TEAM_ID!;

// Redis instance for caching
const redis = Redis.fromEnv();

// ============================================================================
// TYPES
// ============================================================================

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
  addedAt?: string;
  lastChecked?: string;
};

export type DomainConfig = {
  name: string;
  tenantId: string;
  status: 'pending' | 'verified' | 'error';
  verificationRecords?: DomainVerificationRecord[];
  sslStatus: DomainStatus['sslStatus'];
  createdAt: string;
  updatedAt: string;
};

export type DomainEvent = {
  type: 'domain_added' | 'domain_verified' | 'domain_verification_failed' | 'domain_removed';
  domain: string;
  data: Record<string, unknown>;
  timestamp: string;
};

export type DomainAnalytics = {
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
};

export type DomainHealth = {
  vercelConnected: boolean;
  totalDomains: number;
  issues: Array<{
    domain: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }>;
};

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

async function storeDomainConfig(
  customDomain: string,
  status: DomainStatus,
  tenantId: string
): Promise<void> {
  // This should be implemented with your actual database client
  // Example with Supabase:
  // await supabase.from('tenant_domains').upsert({
  //   domain: customDomain,
  //   tenant_id: tenantId,
  //   status: status.verified ? 'verified' : 'pending',
  //   verification_records: status.verificationRecords,
  //   ssl_status: status.sslStatus,
  //   created_at: new Date().toISOString(),
  //   updated_at: new Date().toISOString(),
  // });

  console.log(`Storing domain config for ${customDomain}`);
}

async function updateDomainConfigInDB(customDomain: string, status: DomainStatus): Promise<void> {
  // await supabase
  //   .from('tenant_domains')
  //   .update({
  //     status: status.verified ? 'verified' : 'pending',
  //     verification_records: status.verificationRecords,
  //     ssl_status: status.sslStatus,
  //     updated_at: new Date().toISOString(),
  //     last_checked: status.lastChecked,
  //   })
  //   .eq('domain', customDomain);

  console.log(`Updating domain config for ${customDomain}`);
}

async function removeDomainConfigFromDB(customDomain: string): Promise<void> {
  // await supabase.from('tenant_domains').delete().eq('domain', customDomain);
  console.log(`Removing domain config for ${customDomain}`);
}

async function getTenantIdByDomain(customDomain: string): Promise<string | null> {
  // const { data } = await supabase
  //   .from('tenant_domains')
  //   .select('tenant_id')
  //   .eq('domain', customDomain)
  //   .single();
  // return data?.tenant_id ?? null;
  return null;
}

// ============================================================================
// ADD CUSTOM DOMAIN FOR TENANT
// Called during client onboarding (Domain 15 §15.1)
// ============================================================================

export async function addTenantDomain(
  customDomain: string,
  tenantId: string
): Promise<DomainStatus> {
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
      addedAt: new Date().toISOString(),
    };

    // Store domain configuration in database
    await storeDomainConfig(customDomain, status, tenantId);

    // Track domain event
    await trackDomainEvent(customDomain, tenantId, {
      type: 'domain_added',
      data: { sslStatus: status.sslStatus },
    });

    return status;
  } catch (err: any) {
    // Domain already exists in project — not an error, check status
    if (err?.code === 'domain_already_in_use' || err?.message?.includes('already exists')) {
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
    await updateDomainConfigInDB(customDomain, status);

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
  const tenantId = await getTenantIdByDomain(customDomain);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const status = await checkDomainStatus(customDomain);

    if (status.verified && status.sslStatus === 'issued') {
      // Domain is fully verified and SSL is issued
      await notifyDomainVerified(customDomain, status, tenantId);
      return status;
    }

    if (attempt < maxAttempts) {
      // Wait before next poll with exponential backoff
      const backoffMs = intervalMs * Math.pow(1.5, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, Math.min(backoffMs, 24 * 60 * 60 * 1000))); // Max 24 hours
    }
  }

  // Max attempts reached, return final status
  const finalStatus = await checkDomainStatus(customDomain);
  await notifyDomainVerificationFailed(customDomain, finalStatus, tenantId);

  return finalStatus;
}

// ============================================================================
// REMOVE DOMAIN (offboarding — Domain 15 §15.2)
// ============================================================================

export async function removeTenantDomain(customDomain: string): Promise<void> {
  try {
    const tenantId = await getTenantIdByDomain(customDomain);

    await vercel.projects.removeProjectDomain({
      idOrName: PROJECT_ID,
      domain: customDomain,
      teamId: TEAM_ID,
    });

    // Remove from database
    await removeDomainConfigFromDB(customDomain);

    // Notify domain removal
    if (tenantId) {
      await notifyDomainRemoved(customDomain, tenantId);
    }
  } catch (error) {
    console.error(`Failed to remove domain ${customDomain}:`, error);
    throw error;
  }
}

// ============================================================================
// DOMAIN NOTIFICATIONS
// ============================================================================

async function notifyDomainVerified(
  customDomain: string,
  status: DomainStatus,
  tenantId: string | null
): Promise<void> {
  if (!tenantId) return;

  // Send notification to tenant admin
  // const { data: tenant } = await supabase
  //   .from('tenants')
  //   .select('config')
  //   .eq('id', tenantId)
  //   .single();
  //
  // const config = tenant?.config as {
  //   identity?: {
  //     contact?: { email?: string };
  //   };
  // };
  //
  // const adminEmail = config?.identity?.contact?.email;
  //
  // if (adminEmail) {
  //   await sendEmail({
  //     to: adminEmail,
  //     subject: `Domain Verified: ${customDomain}`,
  //     body: `Your domain ${customDomain} has been successfully verified and SSL certificate has been issued.`,
  //   });
  // }

  // Track domain event
  await trackDomainEvent(customDomain, tenantId, {
    type: 'domain_verified',
    data: { sslStatus: status.sslStatus, verifiedAt: new Date().toISOString() },
  });

  console.log(`Domain verified notification sent for ${customDomain}`);
}

async function notifyDomainVerificationFailed(
  customDomain: string,
  status: DomainStatus,
  tenantId: string | null
): Promise<void> {
  if (!tenantId) return;

  // Track domain event
  await trackDomainEvent(customDomain, tenantId, {
    type: 'domain_verification_failed',
    data: { sslStatus: status.sslStatus, attempts: 24 },
  });

  console.log(`Domain verification failed notification sent for ${customDomain}`);
}

async function notifyDomainRemoved(customDomain: string, tenantId: string): Promise<void> {
  // Track domain event
  await trackDomainEvent(customDomain, tenantId, {
    type: 'domain_removed',
    data: { removedAt: new Date().toISOString() },
  });

  console.log(`Domain removal notification sent for ${customDomain}`);
}

// ============================================================================
// DOMAIN EVENT TRACKING
// ============================================================================

async function trackDomainEvent(
  customDomain: string,
  tenantId: string,
  event: Omit<DomainEvent, 'domain' | 'timestamp'>
): Promise<void> {
  const eventKey = `tenant:domains:events:${tenantId}`;
  const eventData: DomainEvent = {
    ...event,
    domain: customDomain,
    timestamp: new Date().toISOString(),
  };

  // Store recent domain events (keep last 20)
  await redis.lpush(eventKey, JSON.stringify(eventData));
  await redis.ltrim(eventKey, 0, 19);
  await redis.expire(eventKey, 86400); // 24 hours
}

export async function getDomainEvents(tenantId: string): Promise<DomainEvent[]> {
  const eventKey = `tenant:domains:events:${tenantId}`;
  const events = await redis.lrange(eventKey, 0, -1);

  return events.map((event) => JSON.parse(event) as DomainEvent);
}

// ============================================================================
// DOMAIN ANALYTICS
// ============================================================================

export async function getDomainAnalytics(): Promise<DomainAnalytics> {
  // This should be implemented with your actual database client
  // const { data: domains } = await supabase
  //   .from('tenant_domains')
  //   .select('domain, status, ssl_status, updated_at')
  //   .order('updated_at', { ascending: false });

  // Placeholder implementation
  return {
    totalDomains: 0,
    verifiedDomains: 0,
    pendingDomains: 0,
    errorDomains: 0,
    domainsByStatus: {},
    recentActivity: [],
  };
}

// ============================================================================
// DOMAIN HEALTH CHECK
// ============================================================================

export async function getDomainHealth(): Promise<DomainHealth> {
  const issues: Array<{ domain: string; issue: string; severity: 'low' | 'medium' | 'high' }> = [];

  try {
    // Test Vercel API connection
    await vercel.projects.get({ teamId: TEAM_ID });

    // Check for domains with SSL issues
    // const { data: domains } = await supabase
    //   .from('tenant_domains')
    //   .select('domain, ssl_status, status, updated_at')
    //   .or('ssl_status.eq.error,status.eq.error');
    //
    // if (domains) {
    //   domains.forEach((domain) => {
    //     if (domain.ssl_status === 'error') {
    //       issues.push({
    //         domain: domain.domain,
    //         issue: 'SSL certificate error',
    //         severity: 'high',
    //       });
    //     }
    //
    //     if (domain.status === 'error') {
    //       issues.push({
    //         domain: domain.domain,
    //         issue: 'Domain verification error',
    //         severity: 'medium',
    //       });
    //     }
    //
    //     // Check for domains not updated recently (stale)
    //     const lastUpdate = new Date(domain.updated_at);
    //     const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    //
    //     if (daysSinceUpdate > 7 && domain.status === 'pending') {
    //       issues.push({
    //         domain: domain.domain,
    //         issue: 'Domain verification pending for over 7 days',
    //         severity: 'low',
    //       });
    //     }
    //   });
    // }

    const analytics = await getDomainAnalytics();

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function validateDomainFormat(domain: string): boolean {
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
}

export function extractRootDomain(domain: string): string {
  // Extract root domain from subdomain (e.g., "www.example.com" -> "example.com")
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return domain;
}

export async function getDomainDNSRecords(
  customDomain: string
): Promise<DomainVerificationRecord[]> {
  try {
    const domainInfo = await vercel.domains.getDomain({
      domain: customDomain,
      teamId: TEAM_ID,
    });

    return (
      domainInfo.verification?.map((v: any) => ({
        type: v.type as 'TXT' | 'CNAME' | 'A',
        name: v.domain,
        value: v.value,
      })) ?? []
    );
  } catch (error) {
    console.error(`Failed to get DNS records for ${customDomain}:`, error);
    return [];
  }
}
