/**
 * @file packages/infra/src/auth/tenant-context.ts
 * @summary Tenant context utilities for multi-tenant RLS
 * @see tasks/security-2-rls-multi-tenant.md
 *
 * Purpose: Provides utilities for extracting tenant context from JWT claims,
 *          session data, or request headers for use in RLS policies.
 *
 * Exports / Entry: getTenantId, createTenantScopedClient
 * Used by: Database queries, server actions, RLS policies
 *
 * Invariants:
 * - Tenant ID must be validated (UUID format)
 * - Default tenant ID for single-tenant deployments
 * - JWT app_metadata.tenant_id is the source of truth
 *
 * Status: @public
 */

import 'server-only';

/**
 * Extracts tenant ID from JWT app_metadata
 * Used by Supabase RLS policies via auth.tenant_id() function
 *
 * @param jwt - JWT token object (from auth.jwt() in Supabase)
 * @returns Tenant ID UUID or null if not present
 */
export function extractTenantIdFromJwt(jwt: {
  app_metadata?: { tenant_id?: string };
}): string | null {
  const tenantId = jwt.app_metadata?.tenant_id;
  if (!tenantId || typeof tenantId !== 'string') {
    return null;
  }

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(tenantId)) {
    return null;
  }

  return tenantId;
}

/**
 * Gets tenant ID from request headers or session
 * For use in server actions and API routes
 *
 * @param headers - Request headers (from Next.js headers())
 * @returns Tenant ID or null
 */
export function getTenantIdFromHeaders(headers: Headers): string | null {
  // Check for tenant ID in custom header (for API routes)
  const tenantIdHeader = headers.get('x-tenant-id');
  if (tenantIdHeader) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(tenantIdHeader)) {
      return tenantIdHeader;
    }
  }

  // TODO: Extract from session/JWT when auth is implemented
  return null;
}

/**
 * Gets tenant ID from site config (for single-tenant deployments)
 * Falls back to site config ID as tenant identifier
 *
 * @param siteId - Site ID from site.config.ts
 * @returns Tenant ID (site ID or derived UUID)
 */
export function getTenantIdFromSiteId(siteId: string): string {
  // For now, use site ID as tenant ID
  // In multi-tenant deployments, this would map to actual tenant UUID
  return siteId;
}

/**
 * Validates tenant ID format
 *
 * @param tenantId - Tenant ID to validate
 * @returns True if valid UUID format
 */
export function isValidTenantId(tenantId: string | null | undefined): boolean {
  if (!tenantId || typeof tenantId !== 'string') {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(tenantId);
}

/**
 * Creates a tenant-scoped Supabase client configuration
 * For use with RLS policies (uses anon key, not service role)
 *
 * @param tenantId - Tenant ID for RLS filtering
 * @param supabaseUrl - Supabase project URL
 * @param anonKey - Supabase anon key (for RLS)
 * @returns Client configuration with tenant context
 */
export function createTenantScopedClient(
  tenantId: string,
  supabaseUrl: string,
  anonKey: string
): {
  url: string;
  headers: Record<string, string>;
  tenantId: string;
} {
  if (!isValidTenantId(tenantId)) {
    throw new Error(`Invalid tenant ID: ${tenantId}`);
  }

  return {
    url: supabaseUrl,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      // TODO: Include JWT with tenant_id in app_metadata when auth is implemented
      // For now, tenant filtering happens at application layer
    },
    tenantId,
  };
}
