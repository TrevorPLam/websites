/**
 * @file admin/src/app/dashboard/page.tsx
 * @summary 
 * @description 
 * @security none
 * @requirements none
 */
import { db } from '@repo/db';
import { headers } from 'next/headers';
import { MetricCard } from '@/shared/ui/MetricCard';
import { TenantTable } from '@/features/tenants/ui/TenantTable';
import { TenantFilters } from '@/features/tenants/ui/TenantFilters';

async function getPlatformMetrics() {
  const [
    { count: totalTenants },
    { count: activeTenants },
    { count: trialTenants },
    { count: suspendedTenants },
    { data: recentLeads },
  ] = await Promise.all([
    db.from('tenants').select('*', { count: 'exact', head: true }),
    db.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    db.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'trial'),
    db.from('tenants').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
    db
      .from('leads')
      .select('id, created_at, tenant_id, score')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    totalTenants: totalTenants ?? 0,
    activeTenants: activeTenants ?? 0,
    trialTenants: trialTenants ?? 0,
    suspendedTenants: suspendedTenants ?? 0,
    recentLeads: recentLeads ?? [],
  };
}

async function getTenantList(search?: string, status?: string) {
  let query = db
    .from('tenants')
    .select(
      'id, config->identity->siteName, subdomain, custom_domain, status, billing_tier, created_at, onboarding_completed_at'
    )
    .order('created_at', { ascending: false })
    .limit(50);

  if (search) {
    query = query.or(`subdomain.ilike.%${search}%,custom_domain.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq('status', status as any);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search, status } = await searchParams;
  const [metrics, tenants] = await Promise.all([
    getPlatformMetrics(),
    getTenantList(search, status),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Admin</h1>

      {/* Platform KPIs */}
      <section
        aria-labelledby="platform-metrics"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        <h2 id="platform-metrics" className="sr-only">
          Platform metrics
        </h2>
        <MetricCard label="Total Tenants" value={metrics.totalTenants} />
        <MetricCard label="Active" value={metrics.activeTenants} color="green" />
        <MetricCard label="Trial" value={metrics.trialTenants} color="blue" />
        <MetricCard label="Suspended" value={metrics.suspendedTenants} color="red" />
      </section>

      {/* Tenant search and filter */}
      <section aria-labelledby="tenant-list-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="tenant-list-heading" className="text-xl font-semibold">
            Tenants
          </h2>
          <TenantFilters initialSearch={search} initialStatus={status} />
        </div>

        {/* Tenant table */}
        <TenantTable tenants={tenants} />
      </section>
    </main>
  );
}
