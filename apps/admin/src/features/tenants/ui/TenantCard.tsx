/**
 * @file apps/admin/src/features/tenants/ui/TenantCard.tsx
 * @summary React component displaying tenant information with actions.
 * @description Card component showing tenant details, metrics, and management actions for admin interface.
 * @security Tenant data access restricted to admin users with proper authorization.
 * @requirements DOMAIN-7-001, multi-tenant-admin-interface
 */
'use client';

import React from 'react';
import { Tenant, TenantMetrics } from '../model/tenant.model';
import { TenantAvatar } from '@/entities/tenant';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface TenantCardProps {
  tenant: Tenant;
  metrics?: TenantMetrics;
  selected?: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onUpdate: (id: string, data: Partial<Tenant>) => void;
  onDelete: (id: string) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

export function TenantCard({
  tenant,
  metrics,
  selected,
  onSelect,
  onEdit,
  onUpdate,
  onDelete,
  onSuspend,
  onActivate,
}: TenantCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'pro':
        return 'bg-indigo-100 text-indigo-800';
      case 'free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer ${
        selected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <TenantAvatar tenant={tenant} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
            <p className="text-sm text-gray-500">@{tenant.slug}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(tenant.status)}>
            {tenant.status}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Plan</span>
          <Badge className={getPlanColor(tenant.plan)}>
            {tenant.plan}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Billing</span>
          <Badge className={getBillingStatusColor(tenant.billingStatus)}>
            {tenant.billingStatus.replace('_', ' ')}
          </Badge>
        </div>

        {tenant.customDomain && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Domain</span>
            <span className="text-sm font-medium text-gray-900 truncate">
              {tenant.customDomain}
            </span>
          </div>
        )}

        {/* Metrics */}
        {metrics && (
          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {metrics.activeUsers}
                </div>
                <div className="text-xs text-gray-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {metrics.totalLeads}
                </div>
                <div className="text-xs text-gray-500">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {metrics.totalSites}
                </div>
                <div className="text-xs text-gray-500">Sites</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round(metrics.storageUsage / 1024)}MB
                </div>
                <div className="text-xs text-gray-500">Storage</div>
              </div>
            </div>
          </div>
        )}

        {/* Limits */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Limits</span>
          <span className="text-gray-900">
            {tenant.maxUsers} users, {tenant.maxSites} sites
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </Button>

          {tenant.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSuspend(tenant.id);
              }}
            >
              Suspend
            </Button>
          ) : tenant.status === 'suspended' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onActivate(tenant.id);
              }}
            >
              Activate
            </Button>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tenant.id);
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
