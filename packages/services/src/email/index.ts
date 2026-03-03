/**
 * @file packages/services/src/email/index.ts
 * @summary Public barrel export for the email service module.
 * @requirements TASK-SVC-002-REV
 */

export { createEmailAdapter } from './factory';
export type { EmailProvider, CreateEmailAdapterOptions } from './factory';

export { ResendAdapter, EmailSendError } from './adapters/resend.adapter';
export type { ResendAdapterOptions } from './adapters/resend.adapter';

export { NativeAdapter } from './adapters/native.adapter';
export type { NativeAdapterOptions } from './adapters/native.adapter';
