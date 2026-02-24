import { Suspense } from 'react';
import { cacheTag, cacheLife } from 'next/cache';

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

// ============================================================================
// DASHBOARD
// ============================================================================

async function MetricsSection({ tenantId }: { tenantId: string }) {
  const token = await getTinybirdToken(tenantId);
  const [leadsData, sources, funnel] = await Promise.all([
    fetchLeadsOverTime(tenantId, token),
    fetchTopSources(tenantId, token),
    fetchFunnel(tenantId, token),
  ]);

  const totalLeads = leadsData.reduce((sum, d) => sum + d.total_leads, 0);
  const qualifiedLeads = leadsData.reduce((sum, d) => sum + d.qualified_leads, 0);
  const avgScore = leadsData.length
    ? Math.round(leadsData.reduce((sum, d) => sum + d.avg_score, 0) / leadsData.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="region" aria-label="Key metrics">
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
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  highlight = false,
  'aria-label': ariaLabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
  'aria-label'?: string;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${highlight ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
      aria-label={ariaLabel}
    >
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p
        className={`text-3xl font-extrabold mt-1 ${highlight ? 'text-green-700' : 'text-gray-900'}`}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
}

// Placeholder components for charts and tables
function LeadsChart({ data }: { data: any[] }) {
  return (
    <div
      className="h-64 bg-gray-100 rounded-xl flex items-center justify-center"
      role="img"
      aria-label="Leads over time chart"
    >
      <p className="text-gray-500">Chart implementation pending</p>
    </div>
  );
}

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

export default async function AnalyticsDashboard({ tenantId }: { tenantId: string }) {
  return (
    <div>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <MetricsSection tenantId={tenantId} />
      </Suspense>
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
