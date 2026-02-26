/**
 * @file apps/web/src/entities/lead/@x/dashboard.ts
 * @summary Lead entity API for dashboard widgets.
 * @description Exports lead data for dashboard components.
 */

import type { Lead } from '../model/lead.schema';

// Export lead summary for dashboard cards
export interface LeadSummary {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

// Export recent leads for dashboard widgets
export const getRecentLeads = (leads: Lead[], limit: number = 5): Lead[] => {
  return leads
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

// Export lead summary calculation
export const calculateLeadSummary = (leads: Lead[]): LeadSummary => {
  const summary = leads.reduce(
    (acc, lead) => {
      acc.total++;
      acc[lead.status]++;
      return acc;
    },
    {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    } as LeadSummary
  );

  return summary;
};
