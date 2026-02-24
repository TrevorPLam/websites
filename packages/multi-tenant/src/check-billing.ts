import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Redis instance for caching
const redis = Redis.fromEnv();
const BILLING_CACHE_TTL = 60; // 1 minute — billing status must be near-real-time

// ============================================================================
// TYPES
// ============================================================================

export type BillingStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

export type BillingEvent = {
  type: 'status_change' | 'payment_succeeded' | 'payment_failed' | 'subscription_created';
  data: Record<string, unknown>;
  timestamp: string;
};

export type BillingHealthStats = {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  cancelledTenants: number;
};

// ============================================================================
// DATABASE INTERFACE (placeholder - implement with actual DB client)
// ============================================================================

interface TenantBillingRecord {
  id: string;
  status: BillingStatus;
  tier: 'starter' | 'professional' | 'enterprise';
  config?: {
    identity?: {
      siteName?: string;
      contact?: { email?: string };
    };
  };
}

async function lookupTenantBilling(tenantId: string): Promise<TenantBillingRecord | null> {
  // This should be implemented with your actual database client
  // Example with Supabase:
  // const { data, error } = await supabase
  //   .from('tenants')
  //   .select('id, status, tier, config')
  //   .eq('id', tenantId)
  //   .single();
  // return data;

  // For now, return null to indicate implementation needed
  return null;
}

// ============================================================================
// BILLING STATUS CHECK (with Redis cache)
// ============================================================================

export async function checkBillingStatus(tenantId: string): Promise<BillingStatus> {
  const cacheKey = `tenant:billing:${tenantId}`;

  try {
    // --- Check Redis cache first ---
    const cached = await redis.get<BillingStatus>(cacheKey);
    if (cached) return cached;

    // --- Database lookup ---
    const tenant = await lookupTenantBilling(tenantId);

    if (!tenant) {
      // Fail safe: unknown tenant = suspended
      return 'suspended';
    }

    const status = tenant.status;

    // --- Cache the result ---
    await redis.set(cacheKey, status, { ex: BILLING_CACHE_TTL });

    return status;
  } catch (error) {
    console.error('Billing status check error:', error);
    // Fail safe on error
    return 'suspended';
  }
}

// ============================================================================
// BILLING STATUS UPDATE (called by Stripe webhook)
// ============================================================================

export async function updateBillingStatus(
  tenantId: string,
  newStatus: BillingStatus
): Promise<void> {
  try {
    // Update database
    // This should be implemented with your actual database client
    // await supabase
    //   .from('tenants')
    //   .update({ status: newStatus, updated_at: new Date().toISOString() })
    //   .eq('id', tenantId);

    // Bust cache immediately
    await redis.del(`tenant:billing:${tenantId}`);

    // Track the event
    await trackBillingEvent(tenantId, {
      type: 'status_change',
      data: { newStatus },
    });

    // Notify of status change
    const oldStatus = await checkBillingStatus(tenantId);
    if (oldStatus !== newStatus) {
      await notifyBillingStatusChange(tenantId, oldStatus, newStatus);
    }
  } catch (error) {
    console.error('Billing status update error:', error);
    throw error;
  }
}

// ============================================================================
// BILLING STATUS VALIDATION
// ============================================================================

export function isValidBillingStatus(status: string): status is BillingStatus {
  return ['active', 'trial', 'suspended', 'cancelled'].includes(status);
}

export function canAccessSite(status: BillingStatus): boolean {
  return status === 'active' || status === 'trial';
}

export function isBillingActive(status: BillingStatus): boolean {
  return status === 'active';
}

export function isInTrial(status: BillingStatus): boolean {
  return status === 'trial';
}

// ============================================================================
// BILLING EVENT TRACKING
// ============================================================================

export async function trackBillingEvent(
  tenantId: string,
  event: Omit<BillingEvent, 'timestamp'>
): Promise<void> {
  const eventKey = `tenant:billing:events:${tenantId}`;
  const eventData: BillingEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  try {
    // Store recent billing events (keep last 10)
    await redis.lpush(eventKey, JSON.stringify(eventData));
    await redis.ltrim(eventKey, 0, 9);
    await redis.expire(eventKey, 86400); // 24 hours
  } catch (error) {
    console.error('Billing event tracking error:', error);
  }
}

export async function getBillingEvents(tenantId: string): Promise<BillingEvent[]> {
  const eventKey = `tenant:billing:events:${tenantId}`;

  try {
    const events = await redis.lrange(eventKey, 0, -1);
    return events.map((event) => JSON.parse(event) as BillingEvent);
  } catch (error) {
    console.error('Billing events retrieval error:', error);
    return [];
  }
}

// ============================================================================
// BILLING MIDDLEWARE INTEGRATION
// ============================================================================

export function createBillingMiddleware(
  options: {
    suspendedPath?: string;
    cancelledPath?: string;
    allowPaths?: string[]; // Paths that are always allowed (e.g., /suspended, /billing)
  } = {}
) {
  const { suspendedPath = '/suspended', cancelledPath = '/cancelled', allowPaths = [] } = options;

  return async function billingMiddleware(request: NextRequest) {
    // Get tenant ID from headers (set by tenant resolution middleware)
    const tenantId = request.headers.get('X-Tenant-Id');
    const pathname = request.nextUrl.pathname;

    if (!tenantId) {
      return NextResponse.next(); // No tenant context, skip billing check
    }

    // Check if current path is in allow list
    if (allowPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Check if already on a billing-related page
    if (pathname === suspendedPath || pathname === cancelledPath) {
      return NextResponse.next();
    }

    const billingStatus = await checkBillingStatus(tenantId);

    // If tenant is suspended, rewrite to suspended page
    if (billingStatus === 'suspended') {
      const url = request.nextUrl.clone();
      url.pathname = suspendedPath;
      return NextResponse.rewrite(url);
    }

    // If tenant is cancelled, show cancellation page
    if (billingStatus === 'cancelled') {
      const url = request.nextUrl.clone();
      url.pathname = cancelledPath;
      return NextResponse.rewrite(url);
    }

    // Add billing status to headers for downstream components
    const response = NextResponse.next();
    response.headers.set('X-Billing-Status', billingStatus);

    return response;
  };
}

// ============================================================================
// BILLING STATUS NOTIFICATIONS
// ============================================================================

export async function notifyBillingStatusChange(
  tenantId: string,
  oldStatus: BillingStatus,
  newStatus: BillingStatus
): Promise<void> {
  try {
    // Get tenant information for notifications
    const tenant = await lookupTenantBilling(tenantId);

    if (!tenant) return;

    const adminEmail = tenant.config?.identity?.contact?.email;

    if (adminEmail) {
      // Send email notification (implementation depends on email system)
      // Example:
      // await sendEmail({
      //   to: adminEmail,
      //   subject: `Billing Status Change: ${newStatus}`,
      //   body: `Your account status has changed from ${oldStatus} to ${newStatus}.`,
      // });
      console.log(`Billing status change notification sent to ${adminEmail}`);
    }

    // Track the event
    await trackBillingEvent(tenantId, {
      type: 'status_change',
      data: { oldStatus, newStatus, adminEmail },
    });
  } catch (error) {
    console.error('Billing status notification error:', error);
  }
}

// ============================================================================
// BILLING HEALTH CHECK
// ============================================================================

export async function getBillingHealthStats(): Promise<BillingHealthStats> {
  try {
    // This should be implemented with your actual database client
    // Example with Supabase:
    // const { data } = await supabase.from('tenants').select('status');

    // Placeholder implementation
    return {
      totalTenants: 0,
      activeTenants: 0,
      trialTenants: 0,
      suspendedTenants: 0,
      cancelledTenants: 0,
    };
  } catch (error) {
    console.error('Billing health stats error:', error);
    return {
      totalTenants: 0,
      activeTenants: 0,
      trialTenants: 0,
      suspendedTenants: 0,
      cancelledTenants: 0,
    };
  }
}

// ============================================================================
// TENANT TIER MANAGEMENT
// ============================================================================

export async function getTenantTier(
  tenantId: string
): Promise<'starter' | 'professional' | 'enterprise'> {
  const cacheKey = `tenant:tier:${tenantId}`;

  try {
    // Check cache
    const cached = await redis.get<'starter' | 'professional' | 'enterprise'>(cacheKey);
    if (cached) return cached;

    // Lookup from database
    const tenant = await lookupTenantBilling(tenantId);
    const tier = tenant?.tier ?? 'starter';

    // Cache for 1 hour
    await redis.set(cacheKey, tier, { ex: 3600 });

    return tier;
  } catch (error) {
    console.error('Tenant tier lookup error:', error);
    return 'starter';
  }
}

export async function updateTenantTier(
  tenantId: string,
  tier: 'starter' | 'professional' | 'enterprise'
): Promise<void> {
  try {
    // Update database
    // await supabase.from('tenants').update({ tier }).eq('id', tenantId);

    // Clear tier cache
    await redis.del(`tenant:tier:${tenantId}`);

    // Track event
    await trackBillingEvent(tenantId, {
      type: 'status_change',
      data: { tier },
    });
  } catch (error) {
    console.error('Tenant tier update error:', error);
    throw error;
  }
}

// ============================================================================
// BILLING STATUS HOOKS (Server-side)
// ============================================================================

export async function getBillingStatusFromHeaders(headers: Headers): Promise<BillingStatus | null> {
  const status = headers.get('X-Billing-Status');
  if (status && isValidBillingStatus(status)) {
    return status;
  }
  return null;
}

export function getBillingStatusHeader(billingStatus: BillingStatus): string {
  return billingStatus;
}
