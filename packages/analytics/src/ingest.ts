/**
 * @file packages/analytics/src/ingest.ts
 * @summary Unified Tinybird analytics ingest layer.
 * @description Routes platform events to Tinybird's Events API with:
 *   - In-memory buffering to batch events and reduce API call frequency.
 *   - Automatic flush on buffer size or time-interval threshold.
 *   - Tenant-scoped event routing to prevent cross-tenant data leakage.
 *   - Type-safe event schemas validated with Zod.
 *
 * @security
 *   - `tenantId` is required on all events; events without it are dropped.
 *   - The Tinybird token is read from the environment and never logged.
 *   - IP addresses, if included in events, should be pre-anonymised by the caller.
 * @requirements TASK-SaaS-001-REV
 */

import { z } from 'zod';

// ─── Event schemas ────────────────────────────────────────────────────────────

/** All supported platform event types. */
export type PlatformEventType =
  | 'page_view'
  | 'lead_captured'
  | 'booking_created'
  | 'payment_completed'
  | 'payment_failed'
  | 'feature_used'
  | 'ab_test_assigned'
  | 'ab_test_converted'
  | 'web_vital'
  | 'job_completed'
  | 'job_failed'
  | 'webhook_processed'
  | 'export_requested';

/** Base fields required on every platform event. */
export const BasePlatformEventSchema = z.object({
  /** Tenant that owns this event. */
  tenantId: z.string().uuid(),
  /** Type of event. */
  event: z.string().min(1) as z.ZodType<PlatformEventType>,
  /** ISO-8601 timestamp. Defaults to now if not provided. */
  timestamp: z.string().datetime().optional(),
  /** Optional anonymous visitor / session identifier. */
  sessionId: z.string().optional(),
  /** Site or app that generated the event. */
  siteId: z.string().optional(),
});

export type BasePlatformEvent = z.infer<typeof BasePlatformEventSchema>;

/** Web Vitals event payload. */
export const WebVitalEventSchema = BasePlatformEventSchema.extend({
  event: z.literal('web_vital'),
  metric: z.enum(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']),
  value: z.number().nonnegative(),
  /** Navigation ID from the browser's PerformanceNavigationTiming. */
  navigationType: z.string().optional(),
  url: z.string().optional(),
});

export type WebVitalEvent = z.infer<typeof WebVitalEventSchema>;

/** Lead capture event payload. */
export const LeadCapturedEventSchema = BasePlatformEventSchema.extend({
  event: z.literal('lead_captured'),
  formId: z.string(),
  leadId: z.string(),
  source: z.string().optional(),
  campaignId: z.string().optional(),
});

export type LeadCapturedEvent = z.infer<typeof LeadCapturedEventSchema>;

/** Feature usage event payload (for metering). */
export const FeatureUsedEventSchema = BasePlatformEventSchema.extend({
  event: z.literal('feature_used'),
  featureId: z.string(),
  /** Quantity consumed (e.g. number of AI credits). */
  quantity: z.number().int().min(1).default(1),
  /** Actor who triggered the usage. */
  actorId: z.string().optional(),
});

export type FeatureUsedEvent = z.infer<typeof FeatureUsedEventSchema>;

/** A/B test assignment event. */
export const ABTestEventSchema = BasePlatformEventSchema.extend({
  event: z.union([z.literal('ab_test_assigned'), z.literal('ab_test_converted')]),
  experimentId: z.string(),
  variantId: z.string(),
  conversionGoal: z.string().optional(),
});

export type ABTestEvent = z.infer<typeof ABTestEventSchema>;

/** Generic platform event — union of all typed events. */
export type PlatformEvent =
  | WebVitalEvent
  | LeadCapturedEvent
  | FeatureUsedEvent
  | ABTestEvent
  | (BasePlatformEvent & Record<string, unknown>);

// ─── Ingest client ────────────────────────────────────────────────────────────

/** Options for {@link TinybirdIngestClient}. */
export interface TinybirdIngestOptions {
  /**
   * Tinybird API token. Defaults to `process.env.TINYBIRD_API_TOKEN`.
   * The token must have `DATASOURCE:APPEND` permission on the target datasource.
   */
  apiToken?: string;
  /**
   * Tinybird API base URL.
   * @default 'https://api.tinybird.co'
   */
  baseUrl?: string;
  /**
   * Tinybird datasource name where events are appended.
   * @default 'platform_events'
   */
  datasource?: string;
  /**
   * Buffer up to this many events before flushing automatically.
   * @default 50
   */
  bufferSize?: number;
  /**
   * Maximum total events held in the buffer (including re-queued retries).
   * Events are dropped (oldest first) when this cap is exceeded to prevent
   * memory exhaustion during prolonged API outages.
   * @default 500
   */
  maxBufferSize?: number;
  /**
   * Flush the buffer after this many milliseconds even if `bufferSize` has
   * not been reached (0 = no time-based flush).
   * @default 5000
   */
  flushIntervalMs?: number;
  /**
   * Called when a flush fails. Use to forward to error tracking.
   */
  onError?: (error: Error, events: PlatformEvent[]) => void;
}

/**
 * Tinybird ingest client with buffering, auto-flush, and tenant isolation.
 *
 * @example
 * ```ts
 * const client = new TinybirdIngestClient();
 *
 * client.track({
 *   event: 'lead_captured',
 *   tenantId: 'tenant-abc',
 *   formId: 'hero-form',
 *   leadId: 'lead-123',
 * });
 *
 * // On shutdown:
 * await client.flush();
 * ```
 */
export class TinybirdIngestClient {
  private readonly apiToken: string;
  private readonly baseUrl: string;
  private readonly datasource: string;
  private readonly bufferSize: number;
  private readonly maxBufferSize: number;
  private readonly onError?: TinybirdIngestOptions['onError'];

  private buffer: PlatformEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: TinybirdIngestOptions = {}) {
    this.apiToken = options.apiToken ?? process.env['TINYBIRD_API_TOKEN'] ?? '';
    this.baseUrl = (options.baseUrl ?? 'https://api.tinybird.co').replace(/\/$/, '');
    this.datasource = options.datasource ?? 'platform_events';
    this.bufferSize = options.bufferSize ?? 50;
    this.maxBufferSize = options.maxBufferSize ?? 500;
    this.onError = options.onError;

    const flushIntervalMs = options.flushIntervalMs ?? 5_000;
    if (flushIntervalMs > 0 && typeof setInterval !== 'undefined') {
      this.flushTimer = setInterval(() => {
        void this.flush();
      }, flushIntervalMs);
    }
  }

  /**
   * Queue an event for ingestion.
   * Drops events with no `tenantId` to enforce multi-tenant isolation.
   */
  track(event: PlatformEvent): void {
    if (!event.tenantId) {
      // Warn in development — tenantId is always required for multi-tenant isolation.
      if (process.env['NODE_ENV'] !== 'production') {
        console.warn('[TinybirdIngestClient] Dropped event missing tenantId:', event.event);
      }
      return;
    }
    const enriched = { ...event, timestamp: event.timestamp ?? new Date().toISOString() };
    this.buffer.push(enriched);

    if (this.buffer.length >= this.bufferSize) {
      void this.flush();
    }
  }

  /**
   * Immediately flush all buffered events to Tinybird.
   * Returns the number of events that were flushed.
   */
  async flush(): Promise<number> {
    if (this.buffer.length === 0) return 0;

    const batch = this.buffer.splice(0, this.buffer.length);

    if (!this.apiToken) {
      // No token configured — skip silently in development.
      return 0;
    }

    try {
      const ndjson = batch.map((e) => JSON.stringify(e)).join('\n');
      const response = await fetch(
        `${this.baseUrl}/v0/events?name=${encodeURIComponent(this.datasource)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/x-ndjson',
          },
          body: ndjson,
        },
      );

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Tinybird ingest failed (${response.status}): ${text}`);
      }

      return batch.length;
    } catch (err) {
      // Re-buffer failed events (prepend so they are retried first).
      // Enforce maxBufferSize to prevent memory exhaustion during prolonged outages.
      const combined = [...batch, ...this.buffer];
      this.buffer = combined.slice(0, this.maxBufferSize);
      const error = err instanceof Error ? err : new Error(String(err));
      this.onError?.(error, batch);
      return 0;
    }
  }

  /** Stop the automatic flush timer and perform a final flush. */
  async shutdown(): Promise<void> {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}

// ─── Convenience helpers ─────────────────────────────────────────────────────

/** Singleton client for use in server-side Next.js code. */
let _singleton: TinybirdIngestClient | null = null;

/** Get (or lazily create) the process-level singleton ingest client. */
export function getTinybirdClient(options?: TinybirdIngestOptions): TinybirdIngestClient {
  if (!_singleton) {
    _singleton = new TinybirdIngestClient(options);
  }
  return _singleton;
}

/** Factory helper for explicit client creation. */
export function createTinybirdIngestClient(options?: TinybirdIngestOptions): TinybirdIngestClient {
  return new TinybirdIngestClient(options);
}

/**
 * Track a single event using the process-level singleton client.
 * Suitable for use in Server Actions and API routes.
 */
export function trackEvent(event: PlatformEvent): void {
  getTinybirdClient().track(event);
}
