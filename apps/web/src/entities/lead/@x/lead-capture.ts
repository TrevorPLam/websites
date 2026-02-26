/**
 * @file apps/web/src/entities/lead/@x/lead-capture.ts
 * @summary Lead entity API for lead-capture feature.
 * @description Exports lead functionality specifically for lead capture.
 */

// Export lead schema for validation
export { LeadSchema } from '../model/lead.schema';
export type { Lead } from '../model/lead.schema';

// Export lead creation function
export { createLead } from '../model/lead.schema';

// Export validation utilities
export const validateLeadData = (data: unknown) => {
  return LeadSchema.safeParse(data);
};

// Export lead status options for UI
export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'qualified', label: 'Qualified', color: 'green' },
  { value: 'converted', label: 'Converted', color: 'purple' },
  { value: 'lost', label: 'Lost', color: 'red' },
] as const;

export type LeadStatus = typeof LEAD_STATUSES[number]['value'];
