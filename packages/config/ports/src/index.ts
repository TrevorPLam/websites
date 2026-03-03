/**
 * @file packages/config/ports/src/index.ts
 * @summary Public barrel export for all hexagonal Port interfaces.
 * @description Single import surface for application code that depends on
 *   service contracts. Import the concrete adapter from `@repo/services`
 *   only in composition-root modules (factories, dependency-injection
 *   containers, Server Action boundaries).
 * @requirements TASK-SVC-001
 */

export type {
  EmailPort,
  SendEmailRequest,
  SendEmailResult,
  EmailAttachment,
} from './email.port';

export type {
  CrmPort,
  CrmContact,
  CreateContactRequest,
  UpdateContactRequest,
} from './crm.port';

export type {
  AnalyticsPort,
  AnalyticsEvent,
  IdentifyRequest,
} from './analytics.port';

export type {
  PaymentsPort,
  Subscription,
  SubscriptionStatus,
  CreateSubscriptionRequest,
  UsageRecord,
  ReportUsageRequest,
} from './payments.port';
