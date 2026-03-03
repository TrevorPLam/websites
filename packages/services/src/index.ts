/**
 * @file packages/services/src/index.ts
 * @summary Public barrel export for the services package.
 * @requirements TASK-SVC-002-REV
 */

export { createEmailAdapter } from './email/factory';
export type { EmailProvider, CreateEmailAdapterOptions } from './email/factory';

export { ResendAdapter, EmailSendError } from './email/adapters/resend.adapter';
export type { ResendAdapterOptions } from './email/adapters/resend.adapter';

export { NativeAdapter } from './email/adapters/native.adapter';
export type { NativeAdapterOptions } from './email/adapters/native.adapter';
