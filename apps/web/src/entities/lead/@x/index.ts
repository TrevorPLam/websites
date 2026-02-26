/**
 * @file apps/web/src/entities/lead/@x/index.ts
 * @summary Lead entity cross-slice public API.
 * @description Exports lead entity functionality for other slices.
 */

// Export for lead-capture feature
export * from './lead-capture';

// Export for other features that need lead data
export * from './analytics';

// Export for dashboard widgets
export * from './dashboard';

// Master exports
export type { Lead } from '../model/lead.schema';
export { LeadSchema, createLead } from '../model/lead.schema';
