/**
 * @file packages/compliance/gdpr/index.ts
 * @summary Public barrel for GDPR compliance utilities.
 * @security Re-exports GDPR utilities — tenantId must always be resolved server-side before calling.
 * @adr none
 * @requirements TASK-COMP-001
 */

export * from './right-to-erasure';
export * from './data-export';
export * from './consent-manager';
