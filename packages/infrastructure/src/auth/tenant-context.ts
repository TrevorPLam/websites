/**
 * @file packages/infra/src/auth/tenant-context.ts
 * @summary Tenant context utilities for multi-tenant RLS (Task 0-3)
 * @see tasks/0-3-fix-tenant-context-security.md
 *
 * Purpose: Provides request-scoped tenant context using AsyncLocalStorage.
 * Tenant ID comes ONLY from verified JWT app_metadata — never from client-
 * controlled headers or query params (security invariant).
 *
 * Exports / Entry: resolveTenantId, runWithTenantId, getRequestTenantId,
 *                  extractTenantIdFromJwt, isValidTenantId, getTenantIdFromSiteId,
 *                  createTenantScopedClient
 * Used by: Middleware, database queries, server actions, RLS policies
 *
 * Invariants:
 * - Tenant ID must be validated (UUID format)
 * - Tenant ID is NEVER read from request headers in production paths
 * - JWT app_metadata.tenant_id is the source of truth for multi-tenant deployments
 * - Single-tenant deployments fall back to siteId (any string)
 * - AsyncLocalStorage scope is per-request (set in middleware/server action entry)
 * - Use same "not found" error for missing and invalid tenant (prevent enumeration)
 *
 * Status: @public
 */

import 'server-only';
import { AsyncLocalStorage } from 'node:async_hooks';

// ─── Request-scoped tenant store ──────────────────────────────────────────────

/** Per-request tenant context. Set via runWithTenantId() in middleware / server actions. */
interface TenantStore {
  readonly tenantId: string;
}

const tenantStore = new AsyncLocalStorage<TenantStore>();

/**
 * Runs callback with a tenant context in scope.
 * Call this in Next.js middleware or at the top of a Server Action entry point
 * AFTER verifying the user's JWT and extracting app_metadata.tenant_id.
 *
 * @param tenantId - Validated tenant ID (UUID from JWT, or siteId for single-tenant)
 * @param fn       - Callback to run within the tenant scope
 * @returns The return value of fn
 *
 * @example
 * // In a Next.js middleware or Server Action:
 * const tenantId = extractTenantIdFromJwt(verifiedJwt) ?? siteId;
 * return runWithTenantId(tenantId, () => processRequest());
 */
export function runWithTenantId<T>(tenantId: string, fn: () => T): T {
  return tenantStore.run({ tenantId }, fn);
}

/**
 * Returns the tenant ID for the current request scope.
 * Must be called within a runWithTenantId() scope.
 *
 * @returns Tenant ID string, or null if no scope is active
 */
export function getRequestTenantId(): string | null {
  return tenantStore.getStore()?.tenantId ?? null;
}

/**
 * Resolves the tenant ID for the current request.
 *
 * Priority:
 *  1. AsyncLocalStorage request scope (set via runWithTenantId)
 *  2. siteId fallback for single-tenant / pre-0-3 clients
 *
 * NEVER reads from request headers or query params — those are client-controlled
 * and must not be trusted for tenant isolation.
 *
 * @param siteId - Optional site identifier for single-tenant fallback (any string)
 * @returns Tenant identifier (never throws; returns siteId or 'default' as fallback)
 *
 * @example
 * // In a repository or server action:
 * const tenantId = resolveTenantId(siteConfig.id);
 * const bookings = await repository.getByTenant(tenantId);
 */
export function resolveTenantId(siteId?: string): string {
  const contextTenantId = getRequestTenantId();
  if (contextTenantId) {
    return contextTenantId;
  }
  // Single-tenant fallback: use site ID as tenant identifier.
  // In multi-tenant deployments, runWithTenantId() must be called before any
  // repository access. The fallback prevents breaking pre-0-3 clients.
  return siteId ?? 'default';
}

// ─── JWT extraction ───────────────────────────────────────────────────────────

/**
 * Extracts tenant ID from verified JWT app_metadata.
 * Used in middleware/auth callbacks AFTER the JWT has been cryptographically verified.
 *
 * @param jwt - Verified JWT token payload (from Supabase auth.jwt() or equivalent)
 * @returns Validated tenant UUID, or null if not present / invalid format
 */
export function extractTenantIdFromJwt(jwt: {
  app_metadata?: { tenant_id?: string };
}): string | null {
  const tenantId = jwt.app_metadata?.tenant_id;
  if (!tenantId || typeof tenantId !== 'string') {
    return null;
  }
  if (!isValidTenantId(tenantId)) {
    return null;
  }
  return tenantId;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates that a string is a well-formed UUID v1–v5.
 *
 * @param tenantId - Value to validate
 * @returns True if the value is a valid UUID string
 */
export function isValidTenantId(tenantId: string | null | undefined): boolean {
  if (!tenantId || typeof tenantId !== 'string') {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(tenantId);
}

// ─── Single-tenant fallback (legacy) ─────────────────────────────────────────

/**
 * Maps a site ID to a tenant identifier for single-tenant deployments.
 * Prefer resolveTenantId() in new code.
 *
 * @param siteId - Site ID from site.config.ts
 * @returns Tenant identifier (site ID as tenant)
 */
export function getTenantIdFromSiteId(siteId: string): string {
  return siteId;
}

// ─── Supabase client factory ──────────────────────────────────────────────────

/**
 * Creates a tenant-scoped Supabase client configuration.
 * Uses anon key with RLS policies (not service role).
 *
 * @param tenantId  - Validated tenant UUID (from extractTenantIdFromJwt)
 * @param supabaseUrl - Supabase project URL
 * @param anonKey   - Supabase anon key for RLS
 * @returns Client config with tenant context headers
 * @throws Error using a generic message to prevent tenant enumeration
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
  // Generic error message to prevent tenant enumeration (task 0-3 invariant)
  if (!isValidTenantId(tenantId)) {
    throw new Error('Resource not found');
  }

  return {
    url: supabaseUrl,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    tenantId,
  };
}

// ─── Deprecated ───────────────────────────────────────────────────────────────

/**
 * @deprecated Use resolveTenantId() with runWithTenantId() in middleware instead.
 *
 * Security: The x-tenant-id header is client-controllable and MUST NOT be used
 * for tenant isolation. This function always returns null to enforce the security
 * invariant. Kept for API compatibility only.
 *
 * @param _headers - Ignored
 * @returns Always returns null
 */
export function getTenantIdFromHeaders(): string | null {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[tenant-context] getTenantIdFromHeaders() is deprecated. ' +
        'Use resolveTenantId() with runWithTenantId() in middleware. See task 0-3.'
    );
  }
  return null;
}
