/**
 * @file packages/config/ports/src/analytics.port.ts
 * @summary Hexagonal architecture Port interface for analytics event ingestion.
 * @description Defines the inward-facing contract for tracking user and system
 *   events. Concrete adapters (Tinybird, GA4, native logging, etc.) implement
 *   this interface and live in `packages/services/analytics/adapters/`.
 * @security Events MUST include `tenantId` so that downstream queries can apply
 *   per-tenant filtering without additional join overhead.
 * @requirements TASK-SVC-001, TASK-SaaS-001-REV
 */

// ─── Domain objects ──────────────────────────────────────────────────────────

/** A structured analytics event. */
export interface AnalyticsEvent {
  /** Dot-namespaced event name, e.g. `"page.viewed"` or `"lead.captured"`. */
  name: string;
  /** The tenant that owns this event. Required for multi-tenant fan-out queries. */
  tenantId: string;
  /** Optional user identifier (e.g. visitor ID, customer ID). */
  userId?: string;
  /** Optional session / anonymous ID for unauthenticated visitors. */
  anonymousId?: string;
  /** ISO-8601 timestamp; defaults to `new Date().toISOString()` if omitted. */
  timestamp?: string;
  /** Arbitrary event properties. No PII should be stored here without consent. */
  properties?: Record<string, unknown>;
}

/** Identifies a user with stable traits. */
export interface IdentifyRequest {
  tenantId: string;
  userId: string;
  /** Stable user traits (name, plan, etc.). Avoid PII unless consent is confirmed. */
  traits: Record<string, unknown>;
  /** ISO-8601 timestamp. */
  timestamp?: string;
}

// ─── Port interface ──────────────────────────────────────────────────────────

/**
 * Port interface for analytics event ingestion.
 *
 * All adapter implementations must satisfy this contract so that the analytics
 * provider can be swapped at runtime via the adapter factory.
 */
export interface AnalyticsPort {
  /**
   * Tracks a single named event.
   *
   * @param event - The analytics event payload.
   */
  track(event: AnalyticsEvent): Promise<void>;

  /**
   * Buffers and flushes multiple events in one batch.
   * Adapters that don't support batch ingestion MUST fall back to sequential
   * `track` calls.
   *
   * @param events - An array of event payloads.
   */
  trackBatch(events: AnalyticsEvent[]): Promise<void>;

  /**
   * Associates a user ID with stable profile traits (identity stitching).
   *
   * @param request - The identify payload with user ID and traits.
   */
  identify(request: IdentifyRequest): Promise<void>;

  /**
   * Flushes any in-memory event buffer to the upstream provider.
   * Must be called before a serverless function exits if the adapter uses
   * internal buffering.
   */
  flush(): Promise<void>;
}
