import 'server-only';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

// ============================================================================
// TYPES
// ============================================================================

type SuspendedTenantInfo = {
  siteName: string;
  contactEmail: string | null;
  tenantId: string;
};

// ============================================================================
// DATABASE INTERFACE (placeholder - implement with actual DB client)
// ============================================================================

async function getSuspendedTenantInfo(tenantId: string): Promise<SuspendedTenantInfo> {
  // This should be implemented with your actual database client
  // Example with Supabase:
  // const { data, error } = await supabase
  //   .from('tenants')
  //   .select('id, config')
  //   .eq('id', tenantId)
  //   .single();
  //
  // const config = data?.config as {
  //   identity?: {
  //     siteName?: string;
  //     contact?: { email?: string };
  //   };
  // };
  //
  // return {
  //   tenantId: data?.id ?? '',
  //   siteName: config?.identity?.siteName ?? 'This website',
  //   contactEmail: config?.identity?.contact?.email ?? null,
  // };

  // Default fallback
  return {
    tenantId,
    siteName: 'This website',
    contactEmail: null,
  };
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Account Suspended — Maintenance',
    description: 'This account has been temporarily suspended due to a billing issue.',
    robots: { index: false, follow: false }, // Never index suspended pages
  };
}

// ============================================================================
// SUSPENDED PAGE COMPONENT
// ============================================================================

export default async function SuspendedPage() {
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? '';

  const { siteName, contactEmail } = await getSuspendedTenantInfo(tenantId);

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      aria-labelledby="suspended-heading"
    >
      <div className="max-w-md w-full text-center">
        {/* Logo placeholder — tenant branding preserved */}
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-2xl" aria-hidden="true">
            ⚠️
          </span>
        </div>

        <h1 id="suspended-heading" className="text-2xl font-bold text-gray-900 mb-3">
          {siteName} is Temporarily Suspended
        </h1>

        <p className="text-gray-600 mb-6">
          This account has been temporarily suspended due to a billing issue. Please contact support
          to resolve this and restore service.
        </p>

        {/* Contact information */}
        {contactEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">Contact us at:</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 font-medium hover:text-blue-700 underline"
            >
              {contactEmail}
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In to Manage Billing
          </a>

          <a
            href="mailto:support@youragency.com"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Additional information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact our support team with your account
            information.
          </p>
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// CANCELLED PAGE COMPONENT
// ============================================================================

export async function CancelledPage() {
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? '';

  const { siteName, contactEmail } = await getSuspendedTenantInfo(tenantId);

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      aria-labelledby="cancelled-heading"
    >
      <div className="max-w-md w-full text-center">
        {/* Logo placeholder */}
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-2xl" aria-hidden="true">
            👋
          </span>
        </div>

        <h1 id="cancelled-heading" className="text-2xl font-bold text-gray-900 mb-3">
          {siteName} has been Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          This account has been cancelled. If you believe this is an error or would like to
          reactivate your account, please contact our support team.
        </p>

        {/* Contact information */}
        {contactEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">Contact us at:</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 font-medium hover:text-blue-700 underline"
            >
              {contactEmail}
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <a
            href="mailto:support@youragency.com"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>

          <a
            href="https://youragency.com"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Visit Our Website
          </a>
        </div>

        {/* Additional information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Thank you for using our services. We hope to work with you again in the future.</p>
        </div>
      </div>
    </main>
  );
}

// ============================================================================
// TRIAL EXPIRED PAGE COMPONENT
// ============================================================================

export async function TrialExpiredPage() {
  const headersList = await headers();
  const tenantId = headersList.get('X-Tenant-Id') ?? '';

  const { siteName, contactEmail } = await getSuspendedTenantInfo(tenantId);

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      aria-labelledby="trial-expired-heading"
    >
      <div className="max-w-md w-full text-center">
        {/* Logo placeholder */}
        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-2xl" aria-hidden="true">
            ⏰
          </span>
        </div>

        <h1 id="trial-expired-heading" className="text-2xl font-bold text-gray-900 mb-3">
          Your Trial Has Expired
        </h1>

        <p className="text-gray-600 mb-6">
          Your trial period for {siteName} has ended. Upgrade to a paid plan to continue using all
          features and keep your site live.
        </p>

        {/* Contact information */}
        {contactEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">Questions? Contact us at:</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 font-medium hover:text-blue-700 underline"
            >
              {contactEmail}
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <a
            href="/billing/upgrade"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upgrade Now
          </a>

          <a
            href="/login"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Log In
          </a>
        </div>

        {/* Additional information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need more time? Contact our sales team to extend your trial.</p>
        </div>
      </div>
    </main>
  );
}
