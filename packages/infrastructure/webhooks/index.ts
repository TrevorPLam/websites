/**
 * @file packages/infrastructure/webhooks/index.ts
 * @summary Public barrel for the webhooks sub-package.
 * @security Signature verification is required before processing any webhook payload; see stripe-handler.ts.
 * @adr none
 * @requirements PROD-002
 */

export {
  WebhookIdempotency,
  InMemoryIdempotencyStore,
  createWebhookIdempotency,
} from './idempotency';
export type {
  IdempotencyRecord,
  IdempotencyStore,
  IdempotencyCheckResult,
  WebhookIdempotencyOptions,
  WebhookSource,
} from './idempotency';

export {
  StripeWebhookHandler,
  verifyStripeSignature,
  createStripeWebhookHandler,
} from './stripe-handler';
export type {
  StripeEvent,
  StripeEventHandler,
  StripeHandlerMap,
  StripeWebhookHandlerOptions,
  WebhookHandleResult,
} from './stripe-handler';
