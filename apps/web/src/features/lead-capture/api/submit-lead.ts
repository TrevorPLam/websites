/**
 * @file apps/web/src/features/lead-capture/api/submit-lead.ts
 * @summary Lead submission API.
 * @description API function for submitting lead data with proper error handling.
 */

import { createLead, type Lead } from '@/entities/lead/@x/lead-capture';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export async function submitLead(data: LeadData, tenantId: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Validate required fields
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters long' };
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Create lead entity
    const lead: Lead = createLead({
      ...data,
      tenantId,
      status: 'new',
      source: 'web-form'
    });

    // Send to API endpoint
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit lead');
    }

    const result = await response.json();
    return { success: true, id: result.id || lead.id };
  } catch (error) {
    console.error('Lead submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
