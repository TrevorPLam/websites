import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { Redis } from '@upstash/redis';
import { db } from '@repo/db';
import type { SiteConfig } from '@repo/config-schema';

// Redis instance for caching
const redis = Redis.fromEnv();
const CACHE_TTL_SECONDS = 300; // 5 minutes — balance freshness vs. DB load

// Base domains that are not client domains
const BASE_DOMAINS = [
  'youragency.com',
  'www.youragency.com',
  'localhost:3000',
  'localhost:3001',
  'marketing-websites.vercel.app', // Specific project Vercel deployment
];

// Reserved subdomains that cannot be tenant identifiers
const RESERVED_SUBDOMAINS = [
  'www',
  'admin',
  'portal',
  'api',
  'mail',
  'cdn',
  'app',
  'staging',
  'prod',
];

// ============================================================================
// TYPES
// ============================================================================

export type TenantIdentifier =
  | { type: 'subdomain'; value: string }
  | { type: 'custom_domain'; value: string }
  | { type: 'path'; value: string };

export type TenantResolutionSuccess = {
  success: true;
  tenantId: string;
  tenantConfig: SiteConfig;
  identifier: TenantIdentifier;
};

export type TenantResolutionFailure = {
  success: false;
  reason: 'not_found' | 'invalid_host' | 'database_error';
  identifier?: TenantIdentifier;
};

export type TenantResolution = TenantResolutionSuccess | TenantResolutionFailure;

// Database interface (to be implemented based on actual DB setup)
interface TenantRecord {
  id: string;
  subdomain: string;
  custom_domain?: string | null;
  config: SiteConfig;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
}

// ============================================================================
// EXTRACT IDENTIFIER FROM REQUEST
// Supports: subdomain, custom domain, path prefix
// Priority: custom domain → subdomain → path prefix
// ============================================================================

export function extractTenantIdentifier(request: NextRequest): TenantIdentifier | null {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  const isBaseDomain = BASE_DOMAINS.some(
    (base) => host === base || host.endsWith('.' + base)
  );

  // --- Custom Domain: Not a base domain and not a subdomain of base ---
  // e.g., host = "acmelaw.com" or "www.acmelaw.com"
  if (!isBaseDomain && !host.endsWith('.youragency.com')) {
    // Strip "www." prefix for canonical lookup
    const cleanHost = host.replace(/^www\./, '').split(':')[0]; // Remove port if present
    return { type: 'custom_domain', value: cleanHost };
  }

  // --- Subdomain: e.g., "acme-law.youragency.com" ---
  if (host.endsWith('.youragency.com')) {
    const subdomain = host.replace('.youragency.com', '').split(':')[0];
    // Exclude reserved subdomains
    if (RESERVED_SUBDOMAINS.includes(subdomain)) return null;
    // Validate subdomain format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(subdomain)) return null;
    return { type: 'subdomain', value: subdomain };
  }

  // --- Path prefix: e.g., "/sites/acme-law/..." ---
  const pathMatch = pathname.match(/^\/sites\/([a-z0-9-]+)(\/.*)?$/);
  if (pathMatch) {
    return { type: 'path', value: pathMatch[1] };
  }

  return null;
}

// ============================================================================
// DATABASE LOOKUP (placeholder - implement with actual DB client)
// ============================================================================

async function lookupTenantBySubdomain(subdomain: string): Promise<TenantRecord | null> {
  try {
    const { data, error } = await db
      .from('tenants')
      .select('id, subdomain, custom_domain, config, status')
      .eq('subdomain', subdomain)
      .eq('status', 'active') // Only return active tenants
      .single();

    if (error) {
      console.error('Database error in lookupTenantBySubdomain:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in lookupTenantBySubdomain:', error);
    return null;
  }
}

async function lookupTenantByCustomDomain(domain: string): Promise<TenantRecord | null> {
  try {
    const { data, error } = await db
      .from('tenants')
      .select('id, subdomain, custom_domain, config, status')
      .eq('custom_domain', domain)
      .eq('status', 'active') // Only return active tenants
      .single();

    if (error) {
      console.error('Database error in lookupTenantByCustomDomain:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in lookupTenantByCustomDomain:', error);
    return null;
  }
}

// ============================================================================
// RESOLVE TENANT (with Redis cache)
// ============================================================================

export async function resolveTenant(request: NextRequest): Promise<TenantResolution> {
  const identifier = extractTenantIdentifier(request);

  if (!identifier) {
    return { success: false, reason: 'invalid_host' };
  }

  // --- Cache key ---
  const cacheKey = `tenant:resolve:${identifier.type}:${identifier.value}`;

  try {
    // --- Check Redis cache first ---
    const cached = await redis.get<{
      tenantId: string;
      tenantConfig: SiteConfig;
      identifier: TenantIdentifier;
    }>(cacheKey);

    if (cached) {
      return {
        success: true,
        tenantId: cached.tenantId,
        tenantConfig: cached.tenantConfig,
        identifier: cached.identifier,
      };
    }

    // --- Database lookup ---
    let tenant: TenantRecord | null = null;

    if (identifier.type === 'subdomain' || identifier.type === 'path') {
      tenant = await lookupTenantBySubdomain(identifier.value);
    } else if (identifier.type === 'custom_domain') {
      tenant = await lookupTenantByCustomDomain(identifier.value);
    }

    if (!tenant) {
      return { success: false, reason: 'not_found', identifier };
    }

    const result = {
      success: true as const,
      tenantId: tenant.id,
      tenantConfig: tenant.config,
      identifier,
    };

    // --- Cache the result ---
    await redis.set(
      cacheKey,
      {
        tenantId: tenant.id,
        tenantConfig: tenant.config,
        identifier,
      },
      { ex: CACHE_TTL_SECONDS }
    );

    return result;
  } catch (error) {
    console.error('Tenant resolution error:', error);
    return { success: false, reason: 'database_error', identifier };
  }
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

export async function invalidateTenantCache(
  identifier: TenantIdentifier | { tenantId: string }
): Promise<void> {
  if ('tenantId' in identifier) {
    // Lookup tenant to get all identifiers for cache invalidation
    try {
      const { data: tenant } = await db
        .from('tenants')
        .select('id, subdomain, custom_domain')
        .eq('id', identifier.tenantId)
        .single();

      if (tenant) {
        const keysToDelete = [
          `tenant:resolve:subdomain:${tenant.subdomain}`,
          tenant.custom_domain ? `tenant:resolve:custom_domain:${tenant.custom_domain}` : null,
          `tenant:resolve:path:${tenant.subdomain}`,
        ].filter(Boolean) as string[];

        if (keysToDelete.length > 0) {
          await redis.del(...keysToDelete);
        }
      }
    } catch (error) {
      console.error('Error in invalidateTenantCache by tenantId:', error);
    }
    return;
  }

  const cacheKey = `tenant:resolve:${identifier.type}:${identifier.value}`;
  await redis.del(cacheKey);
}

export async function invalidateTenantCacheById(tenantId: string): Promise<void> {
  try {
    // Lookup tenant to get all identifiers for cache invalidation
    const { data: tenant } = await db
      .from('tenants')
      .select('id, subdomain, custom_domain')
      .eq('id', tenantId)
      .single();

    if (tenant) {
      const keysToDelete = [
        `tenant:resolve:subdomain:${tenant.subdomain}`,
        tenant.custom_domain ? `tenant:resolve:custom_domain:${tenant.custom_domain}` : null,
        `tenant:resolve:path:${tenant.subdomain}`,
      ].filter(Boolean) as string[];

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete);
      }
    }
  } catch (error) {
    console.error('Error in invalidateTenantCacheById:', error);
  }
}

export async function invalidateTenantServiceAreas(
  tenantId: string,
  changedSlugs?: string[]
): Promise<void> {
  if (changedSlugs?.length) {
    for (const slug of changedSlugs) {
      revalidateTag(`tenant:${tenantId}:service-area:${slug}`);
    }
  } else {
    revalidateTag(`tenant:${tenantId}:service-area`);
  }

  revalidateTag(`tenant:${tenantId}:sitemap`);
}

// ============================================================================
// TENANT CONFIGURATION VALIDATION
// ============================================================================

export function validateTenantConfig(config: SiteConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.identity?.siteName) {
    errors.push('Site name is required');
  }

  if (!config.identity?.contact?.email) {
    errors.push('Contact email is required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.identity?.contact?.email && !emailRegex.test(config.identity.contact.email)) {
    errors.push('Invalid contact email format');
  }

  // Theme validation
  if (config.theme?.brandColor && !/^#[0-9A-Fa-f]{6}$/.test(config.theme.brandColor)) {
    errors.push('Brand color must be a valid hex color');
  }

  // SEO validation
  if (config.seo?.title && config.seo.title.length > 60) {
    errors.push('SEO title should be 60 characters or less');
  }

  if (config.seo?.description && config.seo.description.length > 160) {
    errors.push('SEO description should be 160 characters or less');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MIDDLEWARE INTEGRATION HELPER
// ============================================================================

export function createTenantMiddleware() {
  return async function tenantMiddleware(request: NextRequest) {
    const resolution = await resolveTenant(request);

    if (!resolution.success) {
      // Handle invalid host - could redirect to error page or return 404
      if (resolution.reason === 'invalid_host') {
        return new Response('Invalid host', { status: 400 });
      }

      if (resolution.reason === 'not_found') {
        return new Response('Tenant not found', { status: 404 });
      }

      if (resolution.reason === 'database_error') {
        return new Response('Service temporarily unavailable', { status: 503 });
      }
    }

    // Set tenant context headers for downstream components
    const response = NextResponse.next();
    response.headers.set('X-Tenant-Id', resolution.tenantId);

    // Strip sensitive data from config before adding to headers (only for success case)
    if (resolution.success) {
      const safeConfig = {
        identity: {
          siteName: resolution.tenantConfig.identity?.siteName,
          contact: {
            email: resolution.tenantConfig.identity?.contact?.email,
            phone: resolution.tenantConfig.identity?.contact?.phone,
          },
        },
        theme: {
          brandColor: resolution.tenantConfig.theme?.brandColor,
          logoUrl: resolution.tenantConfig.theme?.logoUrl,
        },
        seo: {
          title: resolution.tenantConfig.seo?.title,
          description: resolution.tenantConfig.seo?.description,
        },
        // Exclude sensitive data like API keys, webhook URLs, integration configs
      };

      response.headers.set('X-Tenant-Config', JSON.stringify(safeConfig));
    }

    response.headers.set('X-Tenant-Identifier-Type', resolution.identifier.type);
    response.headers.set('X-Tenant-Identifier-Value', resolution.identifier.value);

    return response;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTenantFromHeaders(headers: Headers): string | null {
  return headers.get('X-Tenant-Id');
}

export function getTenantConfigFromHeaders(headers: Headers): SiteConfig | null {
  const configHeader = headers.get('X-Tenant-Config');
  if (!configHeader) return null;

  try {
    return JSON.parse(configHeader) as SiteConfig;
  } catch {
    return null;
  }
}

export function buildTenantUrl(
  identifier: Omit<TenantIdentifier, 'type'> & { type: TenantIdentifier['type'] },
  pathname: string = '/'
): string {
  if (identifier.type === 'custom_domain') {
    return `https://${identifier.value}${pathname}`;
  }

  if (identifier.type === 'subdomain') {
    return `https://${identifier.value}.youragency.com${pathname}`;
  }

  // Path-based
  return `https://youragency.com/sites/${identifier.value}${pathname}`;
}

export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

export function validateSubdomainFormat(subdomain: string): boolean {
  return /^[a-z0-9-]+$/.test(subdomain) && subdomain.length >= 2 && subdomain.length <= 63;
}
