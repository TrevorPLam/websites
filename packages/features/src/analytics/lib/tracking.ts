/**
 * @file packages/features/src/analytics/lib/tracking.ts
 * Purpose: Analytics tracking helpers — pluggable by provider
 */

export type TrackEvent = 'page_view' | 'click' | 'form_submit' | 'signup' | string;

export interface TrackOptions {
  /** Event name */
  event: TrackEvent;
  /** Event properties */
  properties?: Record<string, unknown>;
  /** Optional page path */
  page?: string;
}

export type AnalyticsTracker = (options: TrackOptions) => void | Promise<void>;

/** No-op tracker when analytics disabled */
export const noopTracker: AnalyticsTracker = () => {};
