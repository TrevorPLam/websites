'use client';

import React, { useState, useTransition, useOptimistic } from 'react';
import { Button } from '@/shared/ui/Button';
import { LeadSchema, validateLeadData, type Lead } from '@/entities/lead/@x/lead-capture';

/**
 * @file apps/web/src/features/lead-capture/ui/LeadCaptureForm.tsx
 * @summary Lead capture form component.
 * @description Optimized lead capture form with Core Web Vitals compliance.
 */

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export interface LeadCaptureFormProps {
  onSubmit?: (data: LeadData) => Promise<void>;
  fields?: {
    name: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
    message: boolean;
  };
  className?: string;
  tenantId: string;
}

export function LeadCaptureForm({
  onSubmit,
  fields = { name: true, email: true, phone: false, company: false, message: false },
  className = '',
  tenantId
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticLeads, addOptimisticLead] = useOptimistic(
    [],
    (state: Lead[], newLead: Lead) => [...state, newLead]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Use startTransition for non-urgent state updates (INP optimization)
    startTransition(() => {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    });
  };

  const validateForm = (): boolean => {
    const validation = validateLeadData({
      ...formData,
      tenantId,
      id: crypto.randomUUID(),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue: any) => {
        if (issue.path.length > 0) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create optimistic lead for immediate UI feedback
      const optimisticLead: Lead = {
        id: crypto.randomUUID(),
        ...formData,
        tenantId,
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      addOptimisticLead(optimisticLead);

      await onSubmit?.(formData);

      // Reset form after successful submission
      startTransition(() => {
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        setErrors({});
      });
    } catch (error) {
      console.error('Failed to submit lead:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      {fields.name && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              errors.name
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            aria-describedby={errors.name ? 'name-error' : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
      )}

      {fields.email && (
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              errors.email
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      )}

      {fields.phone && (
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              errors.phone
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            autoComplete="tel"
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      )}

      {fields.company && (
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              errors.company
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            aria-describedby={errors.company ? 'company-error' : undefined}
            autoComplete="organization"
          />
          {errors.company && (
            <p id="company-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.company}
            </p>
          )}
        </div>
      )}

      {fields.message && (
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 resize-none ${
              errors.message
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.message}
            </p>
          )}
        </div>
      )}

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4" role="alert">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || isPending}
        variant="primary"
        size="md"
        className="w-full"
      >
        {isSubmitting || isPending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
