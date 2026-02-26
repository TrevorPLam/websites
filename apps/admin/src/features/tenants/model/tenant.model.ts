/**
 * @file admin/src/features/tenants/model/tenant.model.ts
 * @summary tenants feature implementation for admin interface.
 * @description Provides tenants management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
import { Tenant, TenantMetrics } from '@/entities/tenant';

export interface TenantListState {
  tenants: Tenant[];
  metrics: TenantMetrics[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTenant: Tenant | null;
  filters: {
    status: string[];
    plan: string[];
    billingStatus: string[];
  };
}

export interface TenantFormData {
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  customDomain?: string;
  features: string[];
  maxUsers: number;
  maxSites: number;
}

export interface TenantActions {
  fetchTenants: () => Promise<void>;
  fetchTenantMetrics: (tenantId: string) => Promise<void>;
  createTenant: (data: TenantFormData) => Promise<Tenant>;
  updateTenant: (id: string, data: Partial<TenantFormData>) => Promise<Tenant>;
  deleteTenant: (id: string) => Promise<void>;
  suspendTenant: (id: string) => Promise<void>;
  activateTenant: (id: string) => Promise<void>;
  searchTenants: (query: string) => Promise<void>;
  setFilters: (filters: Partial<TenantListState['filters']>) => void;
  selectTenant: (tenant: Tenant | null) => void;
}

// Re-export entity types for convenience
export type { Tenant, TenantMetrics } from '@/entities/tenant';
