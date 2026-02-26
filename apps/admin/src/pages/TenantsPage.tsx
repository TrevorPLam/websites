/**
 * @file admin/src/pages/TenantsPage.tsx
 * @summary TenantsPage page component.
 * @description Main page component for TenantsPage functionality.
 * @security none
 * @requirements none
 */
'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';
import { TenantList } from '@/features/tenants/ui/TenantList';
import { TenantForm } from '@/features/tenants/ui/TenantForm';
import { Tenant, TenantMetrics, TenantFormData } from '@/features/tenants/model/tenant.model';
import { Button } from '@/shared/ui/Button';

export function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [metrics, setMetrics] = useState<TenantMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockTenants: Tenant[] = [
      {
        id: '1',
        slug: 'acme-corp',
        name: 'Acme Corporation',
        plan: 'enterprise',
        status: 'active',
        customDomain: 'https://marketing.acme.com',
        features: ['custom_domains', 'advanced_analytics', 'api_access'],
        billingStatus: 'current',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20'),
        maxUsers: 50,
        maxSites: 10,
      },
      {
        id: '2',
        slug: 'startup-inc',
        name: 'Startup Inc',
        plan: 'pro',
        status: 'active',
        features: ['custom_domains', 'advanced_analytics'],
        billingStatus: 'current',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-18'),
        maxUsers: 10,
        maxSites: 3,
      },
      {
        id: '3',
        slug: 'local-business',
        name: 'Local Business LLC',
        plan: 'free',
        status: 'trial',
        features: [],
        billingStatus: 'current',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-15'),
        maxUsers: 5,
        maxSites: 1,
      },
    ];

    const mockMetrics: TenantMetrics[] = [
      {
        id: '1',
        tenantId: '1',
        activeUsers: 45,
        totalLeads: 1250,
        totalSites: 8,
        bandwidthUsage: 1024000,
        storageUsage: 512000,
        lastActivity: new Date(),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: '2',
        tenantId: '2',
        activeUsers: 12,
        totalLeads: 340,
        totalSites: 2,
        bandwidthUsage: 256000,
        storageUsage: 128000,
        lastActivity: new Date(Date.now() - 86400000),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        id: '3',
        tenantId: '3',
        activeUsers: 3,
        totalLeads: 45,
        totalSites: 1,
        bandwidthUsage: 64000,
        storageUsage: 32000,
        lastActivity: new Date(Date.now() - 172800000),
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date(Date.now() - 172800000),
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setTenants(mockTenants);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowForm(true);
  };

  const handleTenantCreate = () => {
    setSelectedTenant(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: TenantFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTenant: Tenant = {
        id: Date.now().toString(),
        ...data,
        status: 'trial',
        billingStatus: 'current',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (selectedTenant) {
        // Update existing tenant
        setTenants(prev => prev.map(t =>
          t.id === selectedTenant.id ? { ...t, ...data } : t
        ));
      } else {
        // Create new tenant
        setTenants(prev => [...prev, newTenant]);
      }

      setShowForm(false);
      setSelectedTenant(null);
    } catch (err) {
      setError('Failed to save tenant');
    }
  };

  const handleTenantUpdate = async (id: string, data: Partial<Tenant>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTenants(prev => prev.map(t =>
        t.id === id ? { ...t, ...data, updatedAt: new Date() } : t
      ));
    } catch (err) {
      setError('Failed to update tenant');
    }
  };

  const handleTenantDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setTenants(prev => prev.filter(t => t.id !== id));
        setMetrics(prev => prev.filter(m => m.tenantId !== id));
      } catch (err) {
        setError('Failed to delete tenant');
      }
    }
  };

  const handleTenantSuspend = async (id: string) => {
    await handleTenantUpdate(id, { status: 'suspended' });
  };

  const handleTenantActivate = async (id: string) => {
    await handleTenantUpdate(id, { status: 'active' });
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader
              title={selectedTenant ? 'Edit Tenant' : 'Create Tenant'}
              subtitle={selectedTenant ? 'Update tenant information' : 'Add a new tenant to the platform'}
            />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <TenantForm
                    tenant={selectedTenant}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setShowForm(false);
                      setSelectedTenant(null);
                    }}
                  />
                </div>
              </div>
            </main>
            <AdminFooter />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title="Tenants"
            subtitle="Manage your multi-tenant platform"
          />
          <main className="flex-1 p-6">
            <TenantList
              tenants={tenants}
              metrics={metrics}
              loading={loading}
              error={error}
              onTenantSelect={handleTenantSelect}
              onTenantUpdate={handleTenantUpdate}
              onTenantDelete={handleTenantDelete}
              onTenantSuspend={handleTenantSuspend}
              onTenantActivate={handleTenantActivate}
              onRefresh={handleRefresh}
            />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
