/**
 * @file packages/services/src/index.ts
 * @summary Public barrel export for the services package.
 * @security No secrets exposed; re-exports public adapter classes and factory types only.
 * @adr none
 * @requirements TASK-SVC-001, TASK-SVC-002-REV
 */

export { createEmailAdapter } from './email/factory';
export type { EmailProvider, CreateEmailAdapterOptions } from './email/factory';

export { ResendAdapter, EmailSendError } from './email/adapters/resend.adapter';
export type { ResendAdapterOptions } from './email/adapters/resend.adapter';

export { NativeAdapter } from './email/adapters/native.adapter';
export type { NativeAdapterOptions } from './email/adapters/native.adapter';

export { createCrmAdapter } from './crm/factory';
export type { CrmProvider, CreateCrmAdapterOptions } from './crm/factory';

export { InMemoryCrmAdapter } from './crm/adapters/in-memory.adapter';
export type { InMemoryCrmAdapterOptions } from './crm/adapters/in-memory.adapter';
