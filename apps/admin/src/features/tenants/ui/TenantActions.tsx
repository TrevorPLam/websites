'use client';

import { useState } from 'react';
import {
  adminUpdateTenantStatus,
  adminOverrideBillingTier,
  adminImpersonateTenant,
  adminDeleteTenant,
  adminResendWelcomeEmail,
} from '../model/admin-actions';

interface Tenant {
  id: string;
  status: string;
  billing_tier: string;
  custom_domain?: string;
  subdomain: string;
}

interface TenantActionsProps {
  tenant: Tenant;
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleStatusChange = async (newStatus: 'active' | 'suspended' | 'cancelled') => {
    setIsUpdating(true);
    try {
      await adminUpdateTenantStatus(tenant.id, newStatus);
      // In a real app, you'd refresh the data or show a success message
      alert(`Tenant status updated to ${newStatus}`);
    } catch (error) {
      alert('Error updating tenant status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBillingTierChange = async (newTier: 'starter' | 'professional' | 'enterprise') => {
    setIsUpdating(true);
    try {
      await adminOverrideBillingTier(tenant.id, newTier);
      alert(`Billing tier updated to ${newTier}`);
    } catch (error) {
      alert('Error updating billing tier');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImpersonate = async () => {
    setIsImpersonating(true);
    try {
      const impersonateUrl = await adminImpersonateTenant(tenant.id);
      window.open(impersonateUrl, '_blank');
    } catch (error) {
      alert('Error starting impersonation');
    } finally {
      setIsImpersonating(false);
    }
  };

  const handleDeleteTenant = async () => {
    const reason = prompt('Please provide a reason for deletion:');
    if (!reason) return;

    if (confirm(`Are you sure you want to delete this tenant? This action cannot be undone.`)) {
      setIsUpdating(true);
      try {
        await adminDeleteTenant(tenant.id, reason);
        alert('Tenant deletion queued');
        // In a real app, you'd redirect back to the dashboard
      } catch (error) {
        alert('Error queuing tenant deletion');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleResendWelcome = async () => {
    setIsUpdating(true);
    try {
      await adminResendWelcomeEmail(tenant.id);
      alert('Welcome email resent');
    } catch (error) {
      alert('Error resending welcome email');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section aria-labelledby="tenant-actions-heading">
      <h2 id="tenant-actions-heading" className="text-lg font-semibold mb-4">
        Admin Actions
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Status Management */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Management</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('active')}
              disabled={isUpdating || tenant.status === 'active'}
              className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activate
            </button>
            <button
              onClick={() => handleStatusChange('suspended')}
              disabled={isUpdating || tenant.status === 'suspended'}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suspend
            </button>
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={isUpdating || tenant.status === 'cancelled'}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Billing Tier */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Billing Tier</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBillingTierChange('starter')}
              disabled={isUpdating || tenant.billing_tier === 'starter'}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Starter
            </button>
            <button
              onClick={() => handleBillingTierChange('professional')}
              disabled={isUpdating || tenant.billing_tier === 'professional'}
              className="px-3 py-1.5 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Professional
            </button>
            <button
              onClick={() => handleBillingTierChange('enterprise')}
              disabled={isUpdating || tenant.billing_tier === 'enterprise'}
              className="px-3 py-1.5 text-sm bg-orange-100 text-orange-800 rounded hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enterprise
            </button>
          </div>
        </div>

        {/* Administrative Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Administrative Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleImpersonate}
              disabled={isImpersonating}
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImpersonating ? 'Starting...' : 'Impersonate'}
            </button>
            <button
              onClick={handleResendWelcome}
              disabled={isUpdating}
              className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Welcome Email
            </button>
            <button
              onClick={handleDeleteTenant}
              disabled={isUpdating}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Tenant
            </button>
          </div>
        </div>

        {/* Current Status Display */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Current Status: <span className="font-medium">{tenant.status}</span> | Current Plan:{' '}
            <span className="font-medium capitalize">{tenant.billing_tier}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
