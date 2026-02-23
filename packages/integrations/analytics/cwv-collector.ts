/**
 * @file packages/integrations/analytics/cwv-collector.ts
 * @summary Collects Core Web Vitals and posts them to a Tinybird ingest endpoint.
 */

export type CoreWebVitalName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';

export interface CoreWebVitalMetric {
  name: CoreWebVitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  navigationType?: string;
}

export interface CwvCollectorOptions {
  endpoint: string;
  tenantId: string;
  pathname?: string;
  sessionId?: string;
}

interface CwvPayload {
  tenant_id: string;
  session_id: string;
  pathname: string;
  metric_name: CoreWebVitalName;
  metric_value: number;
  metric_rating: CoreWebVitalMetric['rating'];
  user_agent: string;
  connection_type: string | null;
  timestamp: string;
}

function readSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createCwvCollector(options: CwvCollectorOptions) {
  const sessionId = options.sessionId ?? readSessionId();

  return async function collect(metric: CoreWebVitalMetric): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const payload: CwvPayload = {
      tenant_id: options.tenantId,
      session_id: sessionId,
      pathname: options.pathname ?? window.location.pathname,
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      user_agent: navigator.userAgent,
      connection_type:
        (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
          ?.effectiveType ?? null,
      timestamp: new Date().toISOString(),
    };

    await fetch(options.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  };
}
