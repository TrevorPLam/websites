/**
 * @file packages/integrations/chat/index.ts
 * Task: [4.3] Export chat integration adapters
 */
export * from './contract';
export { getChatConsent, hasChatConsent, setChatConsent } from './consent';
export type { ChatConsentState } from './consent';
export { IntercomAdapter } from '../intercom/src';
export { CrispAdapter } from '../crisp/src';
export { TidioAdapter } from '../tidio/src';
