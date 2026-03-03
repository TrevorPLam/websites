/**
 * @file packages/infrastructure/edge/tenant-resolver.ts
 * @summary Tenant resolution service for Vercel Edge Runtime
 * @description Sub-millisecond tenant lookup supporting wildcard domains, custom domains, and path-based routing
 * @security Tenant isolation with secure lookups
 * @requirements TASK-EDGE-001: Global Edge Middleware with Vercel Platforms
 * @performance <10ms resolution with Edge Config caching
 */

import { get } from '@vercel/edge-config';

export interface Tenant {
  id: string;
  slug: string;
  domain?: string;
  customDomain?: string;
  rewritePath?: string;
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * Resolve tenant from hostname and pathname
 * Supports wildcard domains (*.marketing-platform.com) and custom domains
 */
export async function resolveTenant(hostname: string, pathname: string): Promise<Tenant | null> {
  try {
    // 1. Check for custom domain mapping first (highest priority)
    const customDomainTenant = await resolveCustomDomain(hostname);
    if (customDomainTenant) {
      return customDomainTenant;
    }

    // 2. Check for wildcard subdomain routing
    const subdomainTenant = await resolveWildcardDomain(hostname);
    if (subdomainTenant) {
      return subdomainTenant;
    }

    // 3. Check for path-based routing (fallback)
    const pathTenant = await resolvePathBasedTenant(pathname);
    if (pathTenant) {
      return pathTenant;
    }

    // 4. No tenant found
    return null;
  } catch (error) {
    console.error('Tenant resolution error:', error);
    return null;
  }
}

/**
 * Resolve tenant from custom domain
 * Uses Edge Config for sub-millisecond lookups
 */
async function resolveCustomDomain(hostname: string): Promise<Tenant | null> {
  try {
    // Query Edge Config for custom domain mapping
    // Format: custom-domains.{hostname} = tenantId
    const tenantId = await get(`custom-domains.${hostname}`);

    if (!tenantId || typeof tenantId !== 'string') {
      return null;
    }

    // Get tenant details from Edge Config
    const tenant = await get(`tenants.${tenantId}`);
    if (!tenant || typeof tenant !== 'object') {
      return null;
    }

    return {
      id: tenantId,
      slug: tenant.slug,
      domain: hostname,
      customDomain: hostname,
      status: tenant.status || 'active',
    };
  } catch (error) {
    console.error('Custom domain resolution error:', error);
    return null;
  }
}

/**
 * Resolve tenant from wildcard subdomain
 * Format: {tenantSlug}.marketing-platform.com
 */
async function resolveWildcardDomain(hostname: string): Promise<Tenant | null> {
  try {
    // Extract subdomain from hostname
    const subdomain = extractSubdomain(hostname);
    if (!subdomain) {
      return null;
    }

    // Check if subdomain matches a tenant slug
    const tenant = await get(`tenants.${subdomain}`);
    if (!tenant || typeof tenant !== 'object') {
      return null;
    }

    return {
      id: tenant.id,
      slug: subdomain,
      domain: hostname,
      status: tenant.status || 'active',
    };
  } catch (error) {
    console.error('Wildcard domain resolution error:', error);
    return null;
  }
}

/**
 * Resolve tenant from URL path
 * Format: /t/{tenantSlug} or /tenant/{tenantSlug}
 */
async function resolvePathBasedTenant(pathname: string): Promise<Tenant | null> {
  try {
    // Check for tenant prefix in path
    const tenantPathMatch = pathname.match(/^\/(?:t|tenant)\/([^\/]+)/);
    if (!tenantPathMatch) {
      return null;
    }

    const tenantSlug = tenantPathMatch[1];
    if (!tenantSlug) {
      return null;
    }

    // Get tenant details
    const tenant = await get(`tenants.${tenantSlug}`);
    if (!tenant || typeof tenant !== 'object') {
      return null;
    }

    return {
      id: tenant.id,
      slug: tenantSlug,
      rewritePath: pathname.replace(/^\/(?:t|tenant)\/[^\/]+/, ''),
      status: tenant.status || 'active',
    };
  } catch (error) {
    console.error('Path-based tenant resolution error:', error);
    return null;
  }
}

/**
 * Extract subdomain from hostname
 * Handles wildcard domains like *.marketing-platform.com
 */
function extractSubdomain(hostname: string): string | null {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];

  // For wildcard domains, extract the subdomain part
  // e.g., "tenant1.marketing-platform.com" -> "tenant1"
  const parts = cleanHostname.split('.');

  // Must have at least 3 parts for subdomain routing
  if (parts.length < 3) {
    return null;
  }

  // Check if this is a wildcard domain (not localhost or IP)
  const tld = parts[parts.length - 1];
  const domain = parts[parts.length - 2];

  // Skip if it's an IP address or localhost
  if (/^\d+$/.test(tld) || tld === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(cleanHostname)) {
    return null;
  }

  // Return the first subdomain part
  return parts[0];
}

/**
 * Validate tenant data structure
 */
function isValidTenant(data: any): data is Omit<Tenant, 'domain' | 'customDomain' | 'rewritePath'> {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.slug === 'string' &&
    (data.status === 'active' || data.status === 'inactive' || data.status === 'suspended')
  );
}
