'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { db } from '@repo/db';
import { updateBillingStatus } from '@repo/multi-tenant/check-billing';
import { invalidateTenantCache } from '@repo/multi-tenant/resolve-tenant';
import { setTenantFeatureOverride } from '@repo/feature-flags';
import { enqueue } from '@repo/jobs/client';
import type { FeatureFlag } from '@repo/feature-flags';
import { TokenValidator } from '@repo/infra/auth';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ClerkSessionClaims {
  metadata?: {
    role?: string;
  };
}

// ─── Input Validation Schemas ───────────────────────────────────────────────────

const tenantIdSchema = z.string().uuid('Invalid tenant ID format');
const tenantStatusSchema = z.enum(['active', 'suspended', 'cancelled']);
const billingTierSchema = z.enum(['starter', 'professional', 'enterprise']);
const featureFlagSchema = z.string();
const nonEmptyStringSchema = z.string().min(1, 'Field cannot be empty');

// ─── Guards ────────────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims | null;
  const role = claims?.metadata?.role;
  if (role !== 'super_admin') {
    throw new Error('Unauthorized: Super admin role required');
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function adminUpdateTenantStatus(
  tenantId: string,
  status: 'active' | 'suspended' | 'cancelled'
) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);
  const validatedStatus = tenantStatusSchema.parse(status);

  await requireSuperAdmin();

  try {
    // Update billing status
    await updateBillingStatus(validatedTenantId, validatedStatus);

    // Invalidate cache
    await invalidateTenantCache(validatedTenantId);

    // Log audit trail
    await db.from('audit_logs').insert({
      tenant_id: validatedTenantId,
      action: `admin.status_changed.${validatedStatus}`,
      table_name: 'tenants',
      record_id: validatedTenantId,
      new_data: { status: validatedStatus, changedBy: 'super_admin' },
    });
  } catch (error) {
    // If audit logging fails, we still want to know about it
    console.error('Failed to log audit entry for tenant status change:', {
      tenantId: validatedTenantId,
      status: validatedStatus,
      error: error instanceof Error ? error.message : String(error)
    });
    // Re-throw the original error so the caller knows the operation failed
    throw error;
  }
}

export async function adminOverrideFeatureFlag(
  tenantId: string,
  flag: FeatureFlag,
  enabled: boolean
) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);
  const validatedFlag = featureFlagSchema.parse(flag) as FeatureFlag;

  await requireSuperAdmin();
  await setTenantFeatureOverride(validatedTenantId, validatedFlag, enabled);
}

export async function adminOverrideBillingTier(
  tenantId: string,
  tier: 'starter' | 'professional' | 'enterprise'
) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);
  const validatedTier = billingTierSchema.parse(tier);

  await requireSuperAdmin();

  await db
    .from('tenants')
    .update({
      billing_tier: validatedTier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', validatedTenantId);

  await invalidateTenantCache(validatedTenantId);

  await db.from('audit_logs').insert({
    tenant_id: validatedTenantId,
    action: 'admin.billing_tier_override',
    table_name: 'tenants',
    record_id: validatedTenantId,
    new_data: { billing_tier: validatedTier },
  });
}

export async function adminDeleteTenant(tenantId: string, reason: string) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);
  const validatedReason = nonEmptyStringSchema.parse(reason);

  await requireSuperAdmin();

  // Check if tenant is already queued for deletion
  const { data: existingDeletion } = await db
    .from('audit_logs')
    .select('created_at')
    .eq('tenant_id', validatedTenantId)
    .eq('action', 'admin.tenant_deletion_queued')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingDeletion) {
    throw new Error('Tenant is already queued for deletion');
  }

  // Queue immediate deletion (no 30-day grace for admin-initiated)
  await enqueue(
    'gdpr.delete_tenant',
    { tenantId: validatedTenantId, reason: validatedReason },
    {
      deduplicationId: `gdpr-delete-${validatedTenantId}`,
    }
  );

  await db.from('audit_logs').insert({
    tenant_id: validatedTenantId,
    action: 'admin.tenant_deletion_queued',
    table_name: 'tenants',
    record_id: validatedTenantId,
    new_data: { reason: validatedReason, queuedBy: 'super_admin' },
  });
}

export async function adminResendWelcomeEmail(tenantId: string) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);

  await requireSuperAdmin();

  // Re-queue welcome email via QStash
  const { data: tenant } = await db.from('tenants').select('config').eq('id', validatedTenantId).single();

  if (!tenant) throw new Error('Tenant not found');

  // Enqueue welcome email (fixed: was lead_digest)
  await enqueue('email.welcome', {
    tenantId: validatedTenantId,
    timestamp: new Date().toISOString(),
  });

  // Add missing audit log entry
  await db.from('audit_logs').insert({
    tenant_id: validatedTenantId,
    action: 'admin.welcome_email_resent',
    table_name: 'tenants',
    record_id: validatedTenantId,
    new_data: { resentBy: 'super_admin' },
  });
}

export async function adminImpersonateTenant(tenantId: string) {
  // Validate inputs
  const validatedTenantId = tenantIdSchema.parse(tenantId);

  await requireSuperAdmin();

  // Generate secure impersonation token
  const { data: tenant } = await db
    .from('tenants')
    .select('subdomain, custom_domain')
    .eq('id', validatedTenantId)
    .single();

  if (!tenant) throw new Error('Tenant not found');

  // Create short-lived JWT token for impersonation (5 minutes)
  const tokenValidator = new TokenValidator();
  const impersonationToken = await tokenValidator.generate({
    userId: 'admin-impersonation',
    email: 'admin@system.local',
    roles: ['super_admin'],
    tenantId: validatedTenantId,
    mfaVerified: true,
  });

  // Log impersonation start
  await db.from('audit_logs').insert({
    tenant_id: validatedTenantId,
    action: 'admin.impersonation_started',
    table_name: 'tenants',
    record_id: validatedTenantId,
    new_data: { impersonatedBy: 'super_admin', tokenExpiry: new Date(Date.now() + 5 * 60 * 1000).toISOString() },
  });

  // Return impersonation URL with signed JWT token
  const domain = tenant.custom_domain || `${tenant.subdomain}.youragency.com`;
  return `https://${domain}?impersonate=true&admin_session=${impersonationToken}`;
}
