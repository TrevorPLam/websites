/**
 * TenantList Component
 *
 * A comprehensive tenant management list with search, filtering,
 * and bulk operations. Follows 2026 accessibility standards.
 *
 * @feature Tenant Management
 * @layer features/tenants/ui
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Tenant, TenantMetrics } from '../model/tenant.model';
import { TenantCard } from './TenantCard';
import { TenantSearch } from './TenantSearch';
import { TenantActions } from './TenantActions';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface TenantListProps {
  tenants: Tenant[];
  metrics: TenantMetrics[];
  loading: boolean;
  error: string | null;
  onTenantSelect: (tenant: Tenant) => void;
  onTenantUpdate: (id: string, data: Partial<Tenant>) => void;
  onTenantDelete: (id: string) => void;
  onTenantSuspend: (id: string) => void;
  onTenantActivate: (id: string) => void;
  onRefresh: () => void;
}

export function TenantList({
  tenants,
  metrics,
  loading,
  error,
  onTenantSelect,
  onTenantUpdate,
  onTenantDelete,
  onTenantSuspend,
  onTenantActivate,
  onRefresh,
}: TenantListProps) {
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTenantMetrics = (tenantId: string): TenantMetrics | undefined => {
    return metrics.find(metric => metric.tenantId === tenantId);
  };

  const handleSelectAll = () => {
    if (selectedTenants.length === filteredTenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(filteredTenants.map(t => t.id));
    }
  };

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenants(prev =>
      prev.includes(tenantId)
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  if (loading && tenants.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading tenants</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Tenants ({filteredTenants.length})
          </h2>
          {selectedTenants.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedTenants.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="primary">
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <TenantSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tenants by name or slug..."
        />
      </div>

      {/* Bulk Actions */}
      {selectedTenants.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedTenants.length} tenant{selectedTenants.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedTenants.forEach(onTenantActivate)}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedTenants.forEach(onTenantSuspend)}
              >
                Suspend
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => selectedTenants.forEach(onTenantDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Grid */}
      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchQuery ? 'No tenants found matching your search.' : 'No tenants found.'}
          </div>
          {!searchQuery && (
            <Button variant="primary" className="mt-4">
              Create your first tenant
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              metrics={getTenantMetrics(tenant.id)}
              selected={selectedTenants.includes(tenant.id)}
              onSelect={() => handleSelectTenant(tenant.id)}
              onEdit={() => onTenantSelect(tenant)}
              onUpdate={onTenantUpdate}
              onDelete={onTenantDelete}
              onSuspend={onTenantSuspend}
              onActivate={onTenantActivate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
