'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/db';
import { updateBillingStatus } from '@repo/multi-tenant/check-billing';
import { invalidateTenantCache } from '@repo/multi-tenant/resolve-tenant';
import { setTenantFeatureOverride } from '@repo/feature-flags';
import { enqueue } from '@repo/jobs/client';
import type { FeatureFlag } from '@repo/feature-flags';

// ── Guards ────────────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== 'super_admin') {
    throw new Error('Unauthorized: Super admin role required');
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function adminUpdateTenantStatus(
  tenantId: string,
  status: 'active' | 'suspended' | 'cancelled'
) {
  await requireSuperAdmin();

  await updateBillingStatus(tenantId, status);
  await invalidateTenantCache(tenantId);

  await db.from('audit_logs').insert({
    tenant_id: tenantId,
    action: `admin.status_changed.${status}`,
    table_name: 'tenants',
    record_id: tenantId,
    new_data: { status, changedBy: 'super_admin' },
  });
}

export async function adminOverrideFeatureFlag(
  tenantId: string,
  flag: FeatureFlag,
  enabled: boolean
) {
  await requireSuperAdmin();
  await setTenantFeatureOverride(tenantId, flag, enabled);
}

export async function adminOverrideBillingTier(
  tenantId: string,
  tier: 'starter' | 'professional' | 'enterprise'
) {
  await requireSuperAdmin();

  await db
    .from('tenants')
    .update({
      billing_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenantId);

  await invalidateTenantCache(tenantId);

  await db.from('audit_logs').insert({
    tenant_id: tenantId,
    action: 'admin.billing_tier_override',
    table_name: 'tenants',
    record_id: tenantId,
    new_data: { billing_tier: tier },
  });
}

export async function adminDeleteTenant(tenantId: string, reason: string) {
  await requireSuperAdmin();

  // Queue immediate deletion (no 30-day grace for admin-initiated)
  await enqueue(
    'gdpr.delete_tenant',
    { tenantId, reason },
    {
      deduplicationId: `gdpr-delete-${tenantId}`,
    }
  );

  await db.from('audit_logs').insert({
    tenant_id: tenantId,
    action: 'admin.tenant_deletion_queued',
    table_name: 'tenants',
    record_id: tenantId,
    new_data: { reason, queuedBy: 'super_admin' },
  });
}

export async function adminResendWelcomeEmail(tenantId: string) {
  await requireSuperAdmin();

  // Re-queue welcome email via QStash
  const { data: tenant } = await db.from('tenants').select('config').eq('id', tenantId).single();

  if (!tenant) throw new Error('Tenant not found');

  await enqueue('email.lead_digest', {
    tenantId,
    date: new Date().toISOString().split('T')[0],
  });
}

export async function adminImpersonateTenant(tenantId: string) {
  await requireSuperAdmin();

  // Generate impersonation token
  const { data: tenant } = await db
    .from('tenants')
    .select('subdomain, custom_domain')
    .eq('id', tenantId)
    .single();

  if (!tenant) throw new Error('Tenant not found');

  // Log impersonation start
  await db.from('audit_logs').insert({
    tenant_id: tenantId,
    action: 'admin.impersonation_started',
    table_name: 'tenants',
    record_id: tenantId,
    new_data: { impersonatedBy: 'super_admin' },
  });

  // Return impersonation URL (in production, this would be a signed token)
  const domain = tenant.custom_domain || `${tenant.subdomain}.youragency.com`;
  return `https://${domain}?impersonate=true&admin_session=${Date.now()}`;
}
