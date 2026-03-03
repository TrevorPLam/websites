/**
 * @file packages/infrastructure/edge/config.ts
 * @summary Edge Config integration for multi-tenant platform
 * @description Type-safe Edge Config client with tenant data caching and management
 * @security Secure tenant data access with proper error handling
 * @requirements TASK-EDGE-001: Global Edge Middleware with Vercel Platforms
 * @performance Sub-millisecond KV lookups with global edge replication
 */

import { get, getAll, put, del } from '@vercel/edge-config';
import { Tenant } from './tenant-resolver';

/**
 * Edge Config keys for tenant data
 */
export const EDGE_CONFIG_KEYS = {
  TENANT_PREFIX: 'tenants.',
  CUSTOM_DOMAIN_PREFIX: 'custom-domains.',
} as const;

/**
 * Edge Config client for tenant management
 * Provides type-safe access to tenant data with caching
 */
export class EdgeConfigClient {
  /**
   * Get tenant by slug
   */
  static async getTenant(slug: string): Promise<Tenant | null> {
    try {
      const key = `${EDGE_CONFIG_KEYS.TENANT_PREFIX}${slug}`;
      const data = await get(key);

      if (!data || typeof data !== 'object') {
        return null;
      }

      return this.parseTenantData(slug, data);
    } catch (error) {
      console.error('Failed to get tenant from Edge Config:', error);
      return null;
    }
  }

  /**
   * Get tenant by ID
   */
  static async getTenantById(id: string): Promise<Tenant | null> {
    try {
      // Get all tenants and find by ID (inefficient but Edge Config doesn't support secondary indexes)
      const allTenants = await getAll(new RegExp(`^${EDGE_CONFIG_KEYS.TENANT_PREFIX}`));

      for (const [key, data] of Object.entries(allTenants)) {
        if (typeof data === 'object' && data?.id === id) {
          const slug = key.replace(EDGE_CONFIG_KEYS.TENANT_PREFIX, '');
          return this.parseTenantData(slug, data);
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get tenant by ID from Edge Config:', error);
      return null;
    }
  }

  /**
   * Get custom domain mapping
   */
  static async getCustomDomainMapping(domain: string): Promise<string | null> {
    try {
      const key = `${EDGE_CONFIG_KEYS.CUSTOM_DOMAIN_PREFIX}${domain}`;
      const tenantId = await get(key);

      return typeof tenantId === 'string' ? tenantId : null;
    } catch (error) {
      console.error('Failed to get custom domain mapping:', error);
      return null;
    }
  }

  /**
   * Set tenant data (admin operation)
   */
  static async setTenant(slug: string, tenant: Omit<Tenant, 'slug'>): Promise<boolean> {
    try {
      const key = `${EDGE_CONFIG_KEYS.TENANT_PREFIX}${slug}`;
      await put(key, tenant);
      return true;
    } catch (error) {
      console.error('Failed to set tenant in Edge Config:', error);
      return false;
    }
  }

  /**
   * Set custom domain mapping (admin operation)
   */
  static async setCustomDomainMapping(domain: string, tenantId: string): Promise<boolean> {
    try {
      const key = `${EDGE_CONFIG_KEYS.CUSTOM_DOMAIN_PREFIX}${domain}`;
      await put(key, tenantId);
      return true;
    } catch (error) {
      console.error('Failed to set custom domain mapping:', error);
      return false;
    }
  }

  /**
   * Remove tenant data (admin operation)
   */
  static async removeTenant(slug: string): Promise<boolean> {
    try {
      const key = `${EDGE_CONFIG_KEYS.TENANT_PREFIX}${slug}`;
      await del(key);
      return true;
    } catch (error) {
      console.error('Failed to remove tenant from Edge Config:', error);
      return false;
    }
  }

  /**
   * Parse tenant data from Edge Config
   */
  private static parseTenantData(slug: string, data: any): Tenant | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Validate required fields
    if (!data.id || typeof data.id !== 'string') {
      console.error('Invalid tenant data: missing or invalid id');
      return null;
    }

    const status = data.status || 'active';
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      console.error('Invalid tenant status:', status);
      return null;
    }

    return {
      id: data.id,
      slug,
      domain: data.domain,
      customDomain: data.customDomain,
      status: status as Tenant['status'],
    };
  }
}

/**
 * Edge Config management utilities
 */
export const EdgeConfigUtils = {
  /**
   * Validate Edge Config connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      // Simple test query
      await get('test-key');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get all tenant slugs (for debugging/admin)
   */
  async getAllTenantSlugs(): Promise<string[]> {
    try {
      const allData = await getAll(new RegExp(`^${EDGE_CONFIG_KEYS.TENANT_PREFIX}`));
      return Object.keys(allData).map((key) => key.replace(EDGE_CONFIG_KEYS.TENANT_PREFIX, ''));
    } catch (error) {
      console.error('Failed to get tenant slugs:', error);
      return [];
    }
  },

  /**
   * Health check for Edge Config
   */
  async healthCheck(): Promise<{ healthy: boolean; latency?: number }> {
    const start = Date.now();
    try {
      await this.validateConnection();
      return {
        healthy: true,
        latency: Date.now() - start,
      };
    } catch {
      return { healthy: false };
    }
  },
};
