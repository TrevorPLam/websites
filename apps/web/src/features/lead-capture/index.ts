/**
 * @file apps/web/src/features/lead-capture/index.ts
 * @summary lead-capture feature public API.
 */

export { LeadCaptureForm } from './ui/LeadCaptureForm';
export type { LeadCaptureFormProps } from './ui/LeadCaptureForm';
export { submitLead } from './api/submit-lead';
export type { LeadData } from './api/submit-lead';
export { validateLeadData } from './lib/validation';
export type { ValidationResult } from './lib/validation';
