/**
 * @file packages/services/src/crm/index.ts
 * @summary Public barrel export for the CRM service module.
 * @security No secrets exposed; re-exports public adapter and factory types only.
 * @adr none
 * @requirements TASK-SVC-001
 */

export { createCrmAdapter } from './factory';
export type { CrmProvider, CreateCrmAdapterOptions } from './factory';

export { InMemoryCrmAdapter } from './adapters/in-memory.adapter';
export type { InMemoryCrmAdapterOptions } from './adapters/in-memory.adapter';
