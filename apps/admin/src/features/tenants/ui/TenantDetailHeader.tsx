/**
 * @file admin/src/features/tenants/ui/TenantDetailHeader.tsx
 * @summary tenants feature implementation for admin interface.
 * @description Provides tenants management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
interface Tenant {
  id: string;
  config: any;
  subdomain: string;
  custom_domain?: string;
  status: string;
  billing_tier: string;
  created_at: string;
  onboarding_completed_at?: string;
}

interface TenantDetailHeaderProps {
  tenant: Tenant;
}

export function TenantDetailHeader({ tenant }: TenantDetailHeaderProps) {
  const siteName = tenant.config?.identity?.siteName || tenant.subdomain;
  const domain = tenant.custom_domain || `${tenant.subdomain}.youragency.com`;

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    trial: 'bg-blue-100 text-blue-800',
    suspended: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{siteName}</h1>
          <p className="text-gray-500 font-mono text-sm mb-4">{domain}</p>

          <div className="flex items-center gap-4 text-sm">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[tenant.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {tenant.status}
            </span>
            <span className="text-gray-600">
              Plan: <span className="font-medium capitalize">{tenant.billing_tier}</span>
            </span>
            <span className="text-gray-400">
              Created: {new Date(tenant.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
}
