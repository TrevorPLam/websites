/**
 * @file admin/src/app/tenants/[id]/page.tsx
 * @summary 
 * @description 
 * @security none
 * @requirements none
 */
import { db } from '@repo/db';
import { notFound } from 'next/navigation';
import { TenantDetailHeader } from '@/features/tenants/ui/TenantDetailHeader';
import { TenantActions } from '@/features/tenants/ui/TenantActions';
import { TenantMetrics } from '@/features/tenants/ui/TenantMetrics';

async function getTenantDetails(tenantId: string) {
  const { data: tenant } = await db.from('tenants').select('*').eq('id', tenantId).single();

  if (!tenant) {
    notFound();
  }

  return tenant;
}

async function getTenantMetrics(tenantId: string) {
  const [
    { count: totalLeads },
    { count: leadsThisMonth },
    { data: recentLeads },
    { data: auditLogs },
  ] = await Promise.all([
    db.from('leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    db
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte(
        'created_at',
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      ),
    db
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(10),
    db
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  return {
    totalLeads: totalLeads ?? 0,
    leadsThisMonth: leadsThisMonth ?? 0,
    recentLeads: recentLeads ?? [],
    auditLogs: auditLogs ?? [],
  };
}

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tenant, metrics] = await Promise.all([getTenantDetails(id), getTenantMetrics(id)]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <TenantDetailHeader tenant={tenant} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <TenantMetrics metrics={metrics} />
          <TenantActions tenant={tenant} />
        </div>

        <div className="space-y-8">
          <section aria-labelledby="recent-activity-heading">
            <h2 id="recent-activity-heading" className="text-lg font-semibold mb-4">
              Recent Activity
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                {metrics.auditLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                {metrics.auditLogs.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
