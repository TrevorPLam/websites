interface TenantMetricsProps {
  metrics: {
    totalLeads: number;
    leadsThisMonth: number;
    recentLeads: any[];
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
              {metrics.totalLeads > 0
                ? `${((metrics.leadsThisMonth / metrics.totalLeads) * 100).toFixed(1)}%`
                : '0%'}
            </p>
          </div>
        </div>

        {metrics.recentLeads.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Leads</h3>
            <div className="space-y-2">
              {metrics.recentLeads.slice(0, 5).map((lead: any) => (
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
        )}
      </div>
    </section>
  );
}
