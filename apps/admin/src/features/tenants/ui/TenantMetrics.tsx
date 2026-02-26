/**
 * @file admin/src/features/tenants/ui/TenantMetrics.tsx
 * @summary tenants feature implementation for admin interface.
 * @description Provides tenants management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
interface TenantMetricsProps {
  metrics: {
    totalLeads: number;
    leadsThisMonth: number;
    visitorsThisMonth: number;
    recentLeads: Array<{
      id: string;
      email?: string;
      name?: string;
      score?: number;
      created_at: string;
    }>;
  };
}

export function TenantMetrics({ metrics }: TenantMetricsProps) {
  return (
    <section aria-labelledby="tenant-metrics-heading">
      <h2 id="tenant-metrics-heading" className="text-lg font-semibold mb-4">
        Performance Metrics
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.totalLeads.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Leads This Month</p>
            <p className="text-3xl font-bold text-blue-600">
              {metrics.leadsThisMonth.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-green-600">
              {metrics.visitorsThisMonth > 0
                ? `${((metrics.leadsThisMonth / metrics.visitorsThisMonth) * 100).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {metrics.leadsThisMonth} leads from {metrics.visitorsThisMonth.toLocaleString()} visitors
            </p>
          </div>
        </div>

        {metrics.recentLeads.length > 0 ? (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Leads</h3>
            <div className="space-y-2">
              {metrics.recentLeads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {lead.email || lead.name || 'Anonymous'}
                    </p>
                    <p className="text-gray-500 text-xs">Score: {lead.score || 'N/A'}</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Leads</h3>
            <p className="text-sm text-gray-400 text-center py-4">
              No leads received yet. Start promoting your site to generate leads!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
