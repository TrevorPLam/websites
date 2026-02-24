import { Suspense, useState, useEffect } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { useAlertManager, Alert } from '@repo/analytics';

// ============================================================================
// TINYBIRD JWT — Per-tenant token (restricts data access to own tenant)
// Reference: https://clerk.com/blog/tinybird-and-clerk
// ============================================================================

async function getTinybirdToken(tenantId: string): Promise<string> {
  'use cache';
  cacheTag(`tenant:${tenantId}:tinybird-token`);
  cacheLife('hours'); // Re-generate JWT hourly

  const response = await fetch('https://api.tinybird.co/v0/pipes/generate_token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scopes: [
        { type: 'PIPES:READ', resource: 'leads_over_time' },
        { type: 'PIPES:READ', resource: 'top_sources' },
        { type: 'PIPES:READ', resource: 'funnel' },
        { type: 'PIPES:READ', resource: 'cwv_p75_per_tenant' },
        { type: 'PIPES:READ', resource: 'performance_metrics' },
        { type: 'PIPES:READ', resource: 'error_metrics' },
      ],
      // Row-level restriction via token fixed parameter
      fixed_params: { tenant_id: tenantId },
    }),
  });

  const { token } = await response.json();
  return token;
}

// ============================================================================
// METRIC FETCHERS (server-side, token-protected)
// ============================================================================

async function fetchLeadsOverTime(tenantId: string, token: string) {
  const res = await fetch(
    `https://api.tinybird.co/v0/pipes/leads_over_time.json?tenant_id=${tenantId}&token=${token}`,
    { next: { revalidate: 300, tags: [`tenant:${tenantId}:analytics`] } }
  );
  const { data } = await res.json();
  return data as Array<{
    date: string;
    total_leads: number;
    qualified_leads: number;
    warm_leads: number;
    cold_leads: number;
    avg_score: number;
  }>;
}

async function fetchTopSources(tenantId: string, token: string) {
  const res = await fetch(
    `https://api.tinybird.co/v0/pipes/top_sources.json?tenant_id=${tenantId}&token=${token}`,
    { next: { revalidate: 300 } }
  );
  const { data } = await res.json();
  return data as Array<{
    utm_source: string;
    lead_count: number;
    qualified: number;
    avg_score: number;
    conversion_rate: number;
  }>;
}

async function fetchFunnel(tenantId: string, token: string) {
  const res = await fetch(
    `https://api.tinybird.co/v0/pipes/funnel.json?tenant_id=${tenantId}&token=${token}`,
    { next: { revalidate: 300 } }
  );
  const { data } = await res.json();
  return (data?.[0] ?? null) as {
    total_visitors: number;
    phone_clickers: number;
    form_starters: number;
    phone_click_rate: number;
    form_start_rate: number;
  } | null;
}

async function fetchPerformanceMetrics(tenantId: string, token: string) {
  const res = await fetch(
    `https://api.tinybird.co/v0/pipes/performance_metrics.json?tenant_id=${tenantId}&token=${token}`,
    { next: { revalidate: 60 } }
  );
  const { data } = await res.json();
  return (data?.[0] ?? null) as {
    lcp_p75: number;
    inp_p75: number;
    cls_p75: number;
    ttfb_p75: number;
    avg_response_time: number;
    error_rate: number;
    uptime_percentage: number;
  } | null;
}

async function fetchErrorMetrics(tenantId: string, token: string) {
  const res = await fetch(
    `https://api.tinybird.co/v0/pipes/error_metrics.json?tenant_id=${tenantId}&token=${token}`,
    { next: { revalidate: 300 } }
  );
  const { data } = await res.json();
  return data as Array<{
    error_type: string;
    count: number;
    last_occurrence: string;
    affected_users: number;
  }>;
}

// ============================================================================
// ENHANCED DASHBOARD COMPONENTS
// ============================================================================

function MetricCard({
  label,
  value,
  sublabel,
  highlight = false,
  trend,
  'aria-label': ariaLabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  'aria-label'?: string;
}) {
  const trendColor =
    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div
      className={`p-4 rounded-xl border ${highlight ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {trend && (
          <span className={`text-xs ${trendColor}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <p
        className={`text-3xl font-extrabold mt-1 ${highlight ? 'text-green-700' : 'text-gray-900'}`}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
}

function AlertPanel({
  alerts,
  onResolveAlert,
}: {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
}) {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Active Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${
              alert.severity === 'critical'
                ? 'border-red-500 bg-red-50'
                : alert.severity === 'high'
                  ? 'border-orange-500 bg-orange-50'
                  : alert.severity === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                {alert.tenantId && (
                  <p className="text-xs text-gray-500 mt-2">Tenant: {alert.tenantId}</p>
                )}
              </div>
              <button
                onClick={() => onResolveAlert(alert.id)}
                className="ml-4 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceMetrics({ metrics }: { metrics: any }) {
  if (!metrics) return null;

  const getPerformanceScore = (value: number, threshold: number, inverse = false) => {
    const score = inverse
      ? Math.max(0, 100 - (value / threshold) * 100)
      : Math.max(0, 100 - (threshold / value) * 100);
    return Math.round(score);
  };

  const lcpScore = getPerformanceScore(metrics.lcp_p75, 2500);
  const inpScore = getPerformanceScore(metrics.inp_p75, 200);
  const clsScore = getPerformanceScore(metrics.cls_p75, 0.1, true);
  const ttfbScore = getPerformanceScore(metrics.ttfb_p75, 800);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="LCP P75"
        value={`${metrics.lcp_p75}ms`}
        sublabel={`Score: ${lcpScore}/100`}
        trend={lcpScore >= 90 ? 'up' : lcpScore >= 70 ? 'neutral' : 'down'}
      />
      <MetricCard
        label="INP P75"
        value={`${metrics.inp_p75}ms`}
        sublabel={`Score: ${inpScore}/100`}
        trend={inpScore >= 90 ? 'up' : inpScore >= 70 ? 'neutral' : 'down'}
      />
      <MetricCard
        label="CLS P75"
        value={metrics.cls_p75.toFixed(3)}
        sublabel={`Score: ${clsScore}/100`}
        trend={clsScore >= 90 ? 'up' : clsScore >= 70 ? 'neutral' : 'down'}
      />
      <MetricCard
        label="Error Rate"
        value={`${(metrics.error_rate * 100).toFixed(2)}%`}
        sublabel={`Uptime: ${metrics.uptime_percentage.toFixed(1)}%`}
        trend={metrics.error_rate < 0.01 ? 'up' : metrics.error_rate < 0.05 ? 'neutral' : 'down'}
      />
    </div>
  );
}

function ErrorMetrics({ errors }: { errors: any[] }) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Error Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Affected Users
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Occurrence
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {errors.map((error, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {error.error_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.count}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {error.affected_users}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(error.last_occurrence).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Enhanced chart placeholder with better styling
function LeadsChart({ data }: { data: any[] }) {
  return (
    <div
      className="h-64 bg-white rounded-xl border border-gray-200 p-4"
      role="img"
      aria-label="Leads over time chart"
    >
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">Interactive chart implementation pending</p>
          <p className="text-xs text-gray-400 mt-1">Last 30 days of lead data</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

async function EnhancedMetricsSection({ tenantId }: { tenantId: string }) {
  const token = await getTinybirdToken(tenantId);
  const [leadsData, sources, funnel, performance, errors] = await Promise.all([
    fetchLeadsOverTime(tenantId, token),
    fetchTopSources(tenantId, token),
    fetchFunnel(tenantId, token),
    fetchPerformanceMetrics(tenantId, token),
    fetchErrorMetrics(tenantId, token),
  ]);

  const totalLeads = leadsData.reduce((sum, d) => sum + d.total_leads, 0);
  const qualifiedLeads = leadsData.reduce((sum, d) => sum + d.qualified_leads, 0);
  const avgScore = leadsData.length
    ? Math.round(leadsData.reduce((sum, d) => sum + d.avg_score, 0) / leadsData.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <section aria-labelledby="performance-heading">
        <h2 id="performance-heading" className="text-lg font-semibold mb-3">
          Performance Metrics
        </h2>
        <PerformanceMetrics metrics={performance} />
      </section>

      {/* Business KPIs */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="text-lg font-semibold mb-3">
          Business Metrics
        </h2>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          role="region"
          aria-label="Key metrics"
        >
          <MetricCard
            label="Total Leads (30d)"
            value={totalLeads}
            aria-label={`Total leads last 30 days: ${totalLeads}`}
          />
          <MetricCard
            label="Qualified Leads"
            value={qualifiedLeads}
            sublabel={
              totalLeads > 0 ? `${Math.round((qualifiedLeads / totalLeads) * 100)}% of total` : '—'
            }
            highlight
          />
          <MetricCard label="Avg Lead Score" value={`${avgScore}/100`} />
          <MetricCard
            label="Phone Click Rate"
            value={`${funnel?.phone_click_rate?.toFixed(1) ?? '0'}%`}
          />
        </div>
      </section>

      {/* Leads over time (last 30 days) */}
      <section aria-labelledby="leads-chart-heading">
        <h2 id="leads-chart-heading" className="text-lg font-semibold mb-3">
          Leads Over Time
        </h2>
        <LeadsChart data={leadsData} />
      </section>

      {/* Top traffic sources */}
      <section aria-labelledby="sources-heading">
        <h2 id="sources-heading" className="text-lg font-semibold mb-3">
          Top Lead Sources
        </h2>
        <SourcesTable sources={sources} />
      </section>

      {/* Conversion funnel */}
      {funnel && (
        <section aria-labelledby="funnel-heading">
          <h2 id="funnel-heading" className="text-lg font-semibold mb-3">
            Visitor Funnel (30 days)
          </h2>
          <FunnelVis funnel={funnel} />
        </section>
      )}

      {/* Error metrics */}
      <section aria-labelledby="errors-heading">
        <h2 id="errors-heading" className="text-lg font-semibold mb-3">
          Error Analysis
        </h2>
        <ErrorMetrics errors={errors} />
      </section>
    </div>
  );
}

// Client-side wrapper for alerts
function DashboardWrapper({ tenantId }: { tenantId: string }) {
  const { activeAlerts, resolveAlert } = useAlertManager();

  return (
    <div>
      <AlertPanel alerts={activeAlerts} onResolveAlert={resolveAlert} />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <EnhancedMetricsSection tenantId={tenantId} />
      </Suspense>
    </div>
  );
}

export default function EnhancedAnalyticsDashboard({ tenantId }: { tenantId: string }) {
  return <DashboardWrapper tenantId={tenantId} />;
}

// Re-export existing components for compatibility
function SourcesTable({ sources }: { sources: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leads
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qualified
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sources.map((source, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {source.utm_source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {source.lead_count}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {source.qualified}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {source.conversion_rate.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FunnelVis({ funnel }: { funnel: any }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-700">{funnel.total_visitors}</div>
        <div className="text-sm text-blue-600">Visitors</div>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-2xl font-bold text-orange-700">{funnel.phone_clickers}</div>
        <div className="text-sm text-orange-600">Phone Clicks</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-700">{funnel.form_starters}</div>
        <div className="text-sm text-green-600">Form Starts</div>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading analytics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
      <div className="h-48 bg-gray-100 rounded-xl" />
    </div>
  );
}
