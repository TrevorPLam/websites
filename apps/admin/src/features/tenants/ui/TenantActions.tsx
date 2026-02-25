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

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-sm hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Confirmation dialog component
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Input dialog component
function InputDialog({
  isOpen,
  title,
  placeholder,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  title: string;
  placeholder: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [inputDialog, setInputDialog] = useState<{
    isOpen: boolean;
    title: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (newStatus: 'active' | 'suspended' | 'cancelled') => {
    setIsUpdating(true);
    try {
      await adminUpdateTenantStatus(tenant.id, newStatus);
      showToast(`Tenant status updated to ${newStatus}`, 'success');
      // Note: Data revalidation should be handled in the server action
    } catch (error) {
      showToast('Error updating tenant status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBillingTierChange = async (newTier: 'starter' | 'professional' | 'enterprise') => {
    setIsUpdating(true);
    try {
      await adminOverrideBillingTier(tenant.id, newTier);
      showToast(`Billing tier updated to ${newTier}`, 'success');
      // Note: Data revalidation should be handled in the server action
    } catch (error) {
      showToast('Error updating billing tier', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImpersonate = async () => {
    setIsImpersonating(true);
    try {
      const impersonateUrl = await adminImpersonateTenant(tenant.id);
      window.open(impersonateUrl, '_blank', 'noopener,noreferrer');
      showToast('Impersonation session started', 'success');
    } catch (error) {
      showToast('Error starting impersonation', 'error');
    } finally {
      setIsImpersonating(false);
    }
  };

  const handleDeleteTenant = () => {
    setInputDialog({
      isOpen: true,
      title: 'Delete Tenant',
      placeholder: 'Please provide a reason for deletion...',
      onConfirm: (reason) => {
        setConfirmDialog({
          isOpen: true,
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete this tenant? This action cannot be undone.\n\nReason: ${reason}`,
          onConfirm: async () => {
            setIsUpdating(true);
            try {
              await adminDeleteTenant(tenant.id, reason);
              showToast('Tenant deletion queued', 'success');
              // Note: Data revalidation and redirect should be handled in the server action
            } catch (error) {
              showToast('Error queuing tenant deletion', 'error');
            } finally {
              setIsUpdating(false);
            }
          },
        });
      },
    });
  };

  const handleResendWelcome = async () => {
    setIsUpdating(true);
    try {
      await adminResendWelcomeEmail(tenant.id);
      showToast('Welcome email resent', 'success');
    } catch (error) {
      showToast('Error resending welcome email', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Input Dialog */}
      {inputDialog && (
        <InputDialog
          isOpen={inputDialog.isOpen}
          title={inputDialog.title}
          placeholder={inputDialog.placeholder}
          confirmText="Next"
          cancelText="Cancel"
          onConfirm={inputDialog.onConfirm}
          onCancel={() => setInputDialog(null)}
        />
      )}
    </>
  );
}
