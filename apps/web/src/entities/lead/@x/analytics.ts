/**
 * @file apps/web/src/entities/lead/@x/analytics.ts
 * @summary Lead entity API for analytics features.
 * @description Exports lead data for analytics and reporting.
 */

import type { Lead } from '../model/lead.schema';

// Export lead data shape for analytics
export interface LeadAnalytics {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  source?: string;
  createdAt: Date;
  tenantId: string;
}

// Export analytics transformation utilities
export const transformLeadForAnalytics = (lead: Lead): LeadAnalytics => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  company: lead.company,
  status: lead.status,
  source: lead.source,
  createdAt: lead.createdAt,
  tenantId: lead.tenantId,
});

// Export lead metrics calculation utilities
export const calculateLeadMetrics = (leads: Lead[]) => {
  const total = leads.length;
  const byStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byStatus,
    conversionRate: total > 0 ? (byStatus.converted || 0) / total : 0,
  };
};
