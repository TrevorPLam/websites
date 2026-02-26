'use client';

import React, { useState } from 'react';
import { TenantFormData } from '../model/tenant.model';
import { Button } from '@/shared/ui/Button';

interface TenantFormProps {
  tenant?: Partial<TenantFormData>;
  onSubmit: (data: TenantFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TenantForm({
  tenant = {},
  onSubmit,
  onCancel,
  loading = false,
}: TenantFormProps) {
  const [formData, setFormData] = useState<TenantFormData>({
    name: tenant.name || '',
    slug: tenant.slug || '',
    plan: tenant.plan || 'free',
    customDomain: tenant.customDomain || '',
    features: tenant.features || [],
    maxUsers: tenant.maxUsers || 5,
    maxSites: tenant.maxSites || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (formData.slug.length < 3 || formData.slug.length > 63) {
      newErrors.slug = 'Slug must be between 3 and 63 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.customDomain && !isValidUrl(formData.customDomain)) {
      newErrors.customDomain = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const availableFeatures = [
    'custom_domains',
    'advanced_analytics',
    'api_access',
    'priority_support',
    'white_label',
    'custom_integrations',
    'advanced_security',
    'dedicated_resources',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tenant Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter tenant name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="tenant-slug"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
        </div>
      </div>

      {/* Plan Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Plan
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['free', 'pro', 'enterprise'] as const).map((plan) => (
            <label key={plan} className="relative">
              <input
                type="radio"
                name="plan"
                value={plan}
                checked={formData.plan === plan}
                onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value as any }))}
                className="sr-only"
              />
              <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                formData.plan === plan
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="font-medium capitalize">{plan}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {plan === 'free' && 'Basic features for small teams'}
                  {plan === 'pro' && 'Advanced features for growing businesses'}
                  {plan === 'enterprise' && 'Custom solutions for large organizations'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Domain */}
      <div>
        <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700">
          Custom Domain (optional)
        </label>
        <input
          type="url"
          id="customDomain"
          value={formData.customDomain}
          onChange={(e) => setFormData(prev => ({ ...prev, customDomain: e.target.value }))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="https://example.com"
        />
        {errors.customDomain && (
          <p className="mt-1 text-sm text-red-600">{errors.customDomain}</p>
        )}
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableFeatures.map((feature) => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700 capitalize">
                {feature.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700">
            Max Users
          </label>
          <input
            type="number"
            id="maxUsers"
            min="1"
            max="1000"
            value={formData.maxUsers}
            onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) || 1 }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="maxSites" className="block text-sm font-medium text-gray-700">
            Max Sites
          </label>
          <input
            type="number"
            id="maxSites"
            min="1"
            max="100"
            value={formData.maxSites}
            onChange={(e) => setFormData(prev => ({ ...prev, maxSites: parseInt(e.target.value) || 1 }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {tenant.name ? 'Update Tenant' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}
