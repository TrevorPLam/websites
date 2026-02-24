import { Redis } from '@upstash/redis';
import { db } from '@repo/db';

const redis = Redis.fromEnv();
const BILLING_CACHE_TTL = 60; // 1 minute — billing status must be near-real-time

export type BillingStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

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

// Called by Stripe webhook handler (Domain 11) when subscription status changes
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
