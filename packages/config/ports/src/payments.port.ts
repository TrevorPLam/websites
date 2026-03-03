/**
 * @file packages/config/ports/src/payments.port.ts
 * @summary Hexagonal architecture Port interface for payment / billing operations.
 * @description Defines the inward-facing contract for subscription management,
 *   usage metering, and payment lifecycle events. Concrete adapters (Stripe,
 *   native, etc.) implement this interface and live in
 *   `packages/services/payments/adapters/`.
 * @security All operations require `tenantId` to enforce per-tenant billing
 *   isolation. Adapters must never expose raw provider API keys to application
 *   code.
 * @requirements TASK-SVC-001
 */

// ─── Domain objects ──────────────────────────────────────────────────────────

/** Subscription lifecycle states. */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

/** A tenant's billing subscription. */
export interface Subscription {
  id: string;
  tenantId: string;
  /** Provider-assigned plan/price identifier. */
  planId: string;
  status: SubscriptionStatus;
  /** Usage metering period start (ISO-8601). */
  currentPeriodStart: string;
  /** Usage metering period end (ISO-8601). */
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Input for creating a new subscription. */
export interface CreateSubscriptionRequest {
  tenantId: string;
  /** Provider-assigned plan or price ID. */
  planId: string;
  /** Provider-assigned customer ID (created externally or by the adapter). */
  customerId: string;
  /** ISO-8601 date string for trial end, if applicable. */
  trialEnd?: string;
  /** Optional metadata forwarded to the provider. */
  metadata?: Record<string, string>;
}

/** A single usage record for metered billing. */
export interface UsageRecord {
  subscriptionId: string;
  /** Metered billing dimension (e.g. `"page_views"`, `"ai_tokens"`). */
  metricName: string;
  quantity: number;
  /** ISO-8601 timestamp of the usage event. */
  timestamp: string;
}

/** Input for reporting incremental usage. */
export interface ReportUsageRequest {
  subscriptionId: string;
  metricName: string;
  quantity: number;
  /** ISO-8601 timestamp; defaults to now if omitted. */
  timestamp?: string;
  /** Idempotency key to prevent duplicate reporting on retry. */
  idempotencyKey?: string;
}

// ─── Port interface ──────────────────────────────────────────────────────────

/**
 * Port interface for billing and subscription management.
 *
 * Adapters (Stripe, etc.) must implement all methods to remain interchangeable
 * via the payments adapter factory.
 */
export interface PaymentsPort {
  /**
   * Creates a new subscription for a tenant.
   *
   * @param data - Subscription creation payload.
   * @returns The newly created subscription record.
   */
  createSubscription(data: CreateSubscriptionRequest): Promise<Subscription>;

  /**
   * Retrieves the current subscription for a tenant.
   *
   * @param tenantId - The owning tenant.
   * @returns The active subscription, or `null` if none exists.
   */
  getSubscription(tenantId: string): Promise<Subscription | null>;

  /**
   * Cancels a subscription, optionally at the end of the current period.
   *
   * @param subscriptionId    - The provider-assigned subscription ID.
   * @param cancelAtPeriodEnd - When `true`, the subscription stays active until
   *                           `currentPeriodEnd`; when `false`, it cancels
   *                           immediately.
   */
  cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd?: boolean,
  ): Promise<Subscription>;

  /**
   * Reports incremental usage for a metered billing dimension.
   *
   * @param data - Usage report payload with metric name and quantity.
   */
  reportUsage(data: ReportUsageRequest): Promise<void>;

  /**
   * Retrieves all usage records for a subscription within the current billing
   * period.
   *
   * @param subscriptionId - The subscription to query.
   * @returns An array of usage records ordered by timestamp ascending.
   */
  getUsage(subscriptionId: string): Promise<UsageRecord[]>;
}
