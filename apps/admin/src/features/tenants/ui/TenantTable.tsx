import { adminImpersonateTenant } from '../model/admin-actions';

interface Tenant {
  id: string;
  'config->identity->siteName'?: string;
  subdomain: string;
  custom_domain?: string;
  status: string;
  billing_tier: string;
  created_at: string;
  onboarding_completed_at?: string;
}

interface TenantTableProps {
  tenants: Tenant[];
}

export function TenantTable({ tenants }: TenantTableProps) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    trial: 'bg-blue-100 text-blue-800',
    suspended: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Tenant
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Domain
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Plan
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Joined
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {tenant['config->identity->siteName'] ?? tenant.subdomain ?? tenant.id.slice(0, 8)}
              </td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                {tenant.custom_domain ?? `${tenant.subdomain}.youragency.com`}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[tenant.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {tenant.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 capitalize">{tenant.billing_tier}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(tenant.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/tenants/${tenant.id}`}
                    className="text-primary underline text-xs hover:no-underline"
                  >
                    Manage
                  </a>
                  <ImpersonateButton tenantId={tenant.id} />
                </div>
              </td>
            </tr>
          ))}

          {tenants.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                No tenants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface ImpersonateButtonProps {
  tenantId: string;
}

function ImpersonateButton({ tenantId }: ImpersonateButtonProps) {
  const [isImpersonating, setIsImpersonating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleImpersonate = async () => {
    try {
      setIsImpersonating(true);
      setError(null);
      setSuccess(null);

      const impersonationUrl = await adminImpersonateTenant(tenantId);

      // Open impersonation URL in new window
      window.open(impersonationUrl, '_blank', 'noopener,noreferrer');

      setSuccess('Impersonation initiated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to impersonate tenant');
    } finally {
      setIsImpersonating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleImpersonate}
        disabled={isImpersonating}
        className="text-blue-600 underline text-xs hover:no-underline disabled:opacity-50 disabled:no-underline"
      >
        {isImpersonating ? 'Impersonating...' : 'Impersonate'}
      </button>

      {error && (
        <span className="text-red-600 text-xs">{error}</span>
      )}

      {success && (
        <span className="text-green-600 text-xs">{success}</span>
      )}
    </div>
  );
}
