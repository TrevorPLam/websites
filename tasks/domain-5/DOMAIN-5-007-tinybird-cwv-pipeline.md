---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-5-007
title: 'Core Web Vitals → Tinybird analytics pipeline'
status: done # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-5-007-tinybird-cwv-pipeline
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-5-007 · Core Web Vitals → Tinybird analytics pipeline

## Objective

Implement Core Web Vitals analytics pipeline following section 5.7 specification with web-vitals library, Tinybird data source, real-time collection, and per-tenant performance monitoring.

---

## Context

**Codebase area:** Analytics pipeline — Core Web Vitals monitoring

**Related files:** Analytics package, Tinybird configuration, monitoring dashboard

**Dependencies:** web-vitals library, Tinybird API, existing analytics infrastructure

**Prior work:** Basic monitoring may exist but lacks comprehensive Core Web Vitals pipeline

**Constraints:** Must follow section 5.7 specification with real-time analytics and per-tenant isolation

---

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Analytics  | web-vitals library for metric collection |
| Pipeline   | Tinybird for real-time analytics         |
| Storage    | Time-series data with 90-day retention   |
| Monitoring | Per-tenant performance dashboards        |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement Core Web Vitals pipeline following section 5.7 specification
- [ ] **[Agent]** Create web-vitals collector with sendBeacon for reliability
- [ ] **[Agent]** Set up Tinybird data source with proper schema
- [ ] **[Agent]** Implement per-tenant performance monitoring
- [ ] **[Agent]** Create Tinybird API endpoints for analytics queries
- [ ] **[Agent]** Add real-time performance dashboards
- [ ] **[Agent]** Test pipeline with various performance scenarios
- [ ] **[Human]** Verify pipeline follows section 5.7 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 5.7 specification** — Extract pipeline requirements
- [ ] **[Agent]** **Create web-vitals collector** — Implement client-side metric collection
- [ ] **[Agent]** **Set up Tinybird data source** — Create schema and endpoints
- [ ] **[Agent]** **Implement per-tenant isolation** — Add tenant-specific monitoring
- [ ] **[Agent]** **Create API endpoints** — Add Tinybird query endpoints
- [ ] **[Agent]** **Add performance dashboards** — Create real-time monitoring
- [ ] **[Agent]** **Test data collection** — Verify metrics flow correctly
- [ ] **[Agent]** **Add error handling** — Ensure pipeline reliability

> ⚠️ **Agent Question**: Ask human before proceeding if any existing analytics need migration to new pipeline.

---

## Commands

```bash
# Test web-vitals collection
pnpm build --filter="@repo/analytics"
pnpm dev --filter="@repo/analytics"

# Test Tinybird pipeline
curl -X POST http://localhost:3000/api/cwv \
  -H "Content-Type: application/json" \
  -d '{"tenant_id": "test", "metrics": [...]}' \
  http://localhost:3000/api/cwv

# Test Tinybird queries
curl "https://api.tinybird.co/v0/pipes/cwv_p75_per_tenant.json?token=$TINYBIRD_TOKEN&tenant_id=test"

# Test performance dashboard
curl http://localhost:3000/api/analytics/performance?tenant_id=test
```

---

## Code Style

```typescript
// ✅ Correct — Core Web Vitals pipeline following section 5.7
// packages/analytics/src/cwv-collector.ts
'use client';

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN!;
const TINYBIRD_HOST = 'https://api.tinybird.co';

interface CWVEvent {
  tenant_id: string;
  session_id: string;
  pathname: string;
  metric_name: string;
  metric_value: number;
  metric_rating: 'good' | 'needs-improvement' | 'poor';
  user_agent: string;
  connection_type: string | null;
  timestamp: string;
}

function sendToTinybird(event: CWVEvent): void {
  // Use sendBeacon for reliability (doesn't block page unload)
  const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
  navigator.sendBeacon(`${TINYBIRD_HOST}/v0/events?name=cwv_events&token=${TINYBIRD_TOKEN}`, blob);
}

export function initCWVCollection(tenantId: string, sessionId: string): void {
  if (typeof window === 'undefined') return;

  const baseEvent = {
    tenant_id: tenantId,
    session_id: sessionId,
    pathname: window.location.pathname,
    user_agent: navigator.userAgent,
    connection_type: (navigator as any).connection?.effectiveType ?? null,
    timestamp: new Date().toISOString(),
  };

  function report(metric: Metric): void {
    sendToTinybird({
      ...baseEvent,
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
    });
  }

  onCLS(report);
  onINP(report);
  onLCP(report);
  onFCP(report);
  onTTFB(report);
}

// ============================================================================
// TINYBIRD DATA SOURCE SCHEMA
// ============================================================================

// cwv_events.datasource (Tinybird schema file)
/*
SCHEMA >
  `tenant_id` String `json:$.tenant_id`,
  `session_id` String `json:$.session_id`,
  `pathname` String `json:$.pathname`,
  `metric_name` String `json:$.metric_name`,
  `metric_value` Float64 `json:$.metric_value`,
  `metric_rating` String `json:$.metric_rating`,
  `user_agent` String `json:$.user_agent`,
  `connection_type` Nullable(String) `json:$.connection_type`,
  `timestamp` DateTime64(3) `json:$.timestamp`

ENGINE "MergeTree"
ENGINE_SORTING_KEY "tenant_id, metric_name, timestamp"
ENGINE_TTL "timestamp + interval 90 day"
*/

// ============================================================================
// TINYBIRD API ENDPOINTS
// ============================================================================

// cwv_p75_per_tenant.pipe (Tinybird endpoint)
/*
%
SELECT
  tenant_id,
  metric_name,
  quantile(0.75)(metric_value) as p75_value,
  countIf(metric_rating = 'good') / count() * 100 as good_pct,
  countIf(metric_rating = 'needs-improvement') / count() * 100 as needs_improvement_pct,
  countIf(metric_rating = 'poor') / count() * 100 as poor_pct,
  count() as total_samples
FROM cwv_events
WHERE
  timestamp >= now() - INTERVAL 30 DAY
  {% if defined(tenant_id) %}
    AND tenant_id = {{ String(tenant_id, '') }}
  {% end %}
  {% if defined(metric_name) %}
    AND metric_name = {{ String(metric_name, '') }}
  {% end %}
GROUP BY tenant_id, metric_name
ORDER BY tenant_id, metric_name
*/

// ============================================================================
// API ENDPOINTS FOR ANALYTICS
// ============================================================================

// pages/api/analytics/performance.ts
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenant_id');
  const metricName = searchParams.get('metric_name');

  if (!tenantId) {
    return Response.json({ error: 'tenant_id required' }, { status: 400 });
  }

  const response = await fetch(
    `${TINYBIRD_HOST}/v0/pipes/cwv_p75_per_tenant.json?token=${TINYBIRD_TOKEN}&tenant_id=${tenantId}&metric_name=${metricName || ''}`
  );

  const data = await response.json();

  return Response.json(data);
}

// ============================================================================
// PERFORMANCE DASHBOARD
// ============================================================================

// components/PerformanceDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { initCWVCollection } from '@/analytics/cwv-collector';

interface PerformanceMetrics {
  lcp: { p75: number; good_pct: number };
  inp: { p75: number; good_pct: number };
  cls: { p75: number; good_pct: number };
}

export function PerformanceDashboard({ tenantId }: { tenantId: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize CWV collection
    const sessionId = crypto.randomUUID();
    initCWVCollection(tenantId, sessionId);

    // Fetch performance data
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/analytics/performance?tenant_id=${tenantId}`);
        const data = await response.json();

        // Process data into dashboard format
        const processed = data.data.reduce((acc: PerformanceMetrics, item: any) => {
          if (item.metric_name === 'LCP') {
            acc.lcp = { p75: item.p75_value, good_pct: item.good_pct };
          } else if (item.metric_name === 'INP') {
            acc.inp = { p75: item.p75_value, good_pct: item.good_pct };
          } else if (item.metric_name === 'CLS') {
            acc.cls = { p75: item.p75_value, good_pct: item.good_pct };
          }
          return acc;
        }, { lcp: { p75: 0, good_pct: 0 }, inp: { p75: 0, good_pct: 0 }, cls: { p75: 0, good_pct: 0 } });

        setMetrics(processed);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tenantId]);

  if (loading) {
    return <div>Loading performance data...</div>;
  }

  if (!metrics) {
    return <div>No performance data available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Largest Contentful Paint"
        value={`${metrics.lcp.p75}ms`}
        good_pct={metrics.lcp.good_pct}
        target={2500}
      />
      <MetricCard
        title="Interaction to Next Paint"
        value={`${metrics.inp.p75}ms`}
        good_pct={metrics.inp.good_pct}
        target={200}
      />
      <MetricCard
        title="Cumulative Layout Shift"
        value={metrics.cls.p75.toFixed(3)}
        good_pct={metrics.cls.good_pct}
        target={0.1}
      />
    </div>
  );
}

function MetricCard({ title, value, good_pct, target }: {
  title: string;
  value: string;
  good_pct: number;
  target: number;
}) {
  const isGood = good_pct >= 75;

  return (
    <div className={`p-4 rounded-lg border ${isGood ? 'border-green-500' : 'border-red-500'}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">Target: {target}</p>
      <p className={`text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        {good_pct}% good
      </p>
    </div>
  );
}
```

**Core Web Vitals pipeline principles:**

- **Reliable collection**: Use sendBeacon for non-blocking metric transmission
- **Per-tenant isolation**: Separate metrics by tenant_id for multi-tenant analysis
- **Real-time analytics**: Use Tinybird for fast time-series queries
- **90-day retention**: Balance storage costs with analytical value
- **Performance monitoring**: Real-time dashboards for performance insights
- **Error handling**: Graceful degradation if analytics pipeline fails

---

## Boundaries

| Tier             | Scope                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Always**    | Follow section 5.7 specification; implement reliable collection; add per-tenant isolation; create real-time dashboards; handle errors gracefully |
| ⚠️ **Ask first** | Changing existing analytics infrastructure; modifying Tinybird configuration; updating monitoring dashboards                                     |
| 🚫 **Never**     | Skip error handling; ignore per-tenant isolation; block page load with analytics; store sensitive user data in analytics                         |

---

## Success Verification

- [ ] **[Agent]** Test metric collection — Core Web Vitals metrics are collected correctly
- [ ] **[Agent]** Verify Tinybird pipeline — Data flows to Tinybird successfully
- [ ] **[Agent]** Test per-tenant isolation — Metrics are separated by tenant
- [ ] **[Agent]** Verify API endpoints — Analytics queries work correctly
- [ ] **[Agent]** Test performance dashboards — Real-time monitoring works
- [ ] **[Agent]** Test error handling — Pipeline degrades gracefully
- [ ] **[Human]** Test with real traffic — Analytics work in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Network connectivity**: Handle cases where sendBeacon fails
- **Privacy compliance**: Ensure no sensitive user data is collected
- **High traffic**: Monitor Tinybird costs and performance
- **Data retention**: Implement proper TTL for time-series data
- **Cross-browser compatibility**: Test web-vitals library across browsers
- **Page unload timing**: Ensure metrics are sent before page unload

---

## Out of Scope

- Bundle size optimization (handled in separate task)
- Lighthouse CI configuration (handled in separate task)
- React Compiler optimization (handled in separate task)
- PPR optimization (handled in separate tasks)

---

## References

- [Section 5.7 Core Web Vitals → Tinybird Pipeline](docs/plan/domain-5/5.7-core-web-vitals-tinybird-pipeline.md)
- [Section 5.6 LCP, INP, CLS Optimization](docs/plan/domain-5/5.6-lcp-inp-cls-optimization.md)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Tinybird Documentation](https://www.tinybird.co/docs)
- [Core Web Vitals Documentation](https://web.dev/vitals/)
