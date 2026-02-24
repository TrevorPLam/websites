import { headers } from 'next/headers';

import { db } from '@repo/db';
import { getTenantFromHeaders } from '@repo/multi-tenant';

import { WhiteLabelFooter } from '../components/layout/WhiteLabelFooter';
import { WhiteLabelHeader } from '../components/layout/WhiteLabelHeader';
import { WhiteLabelProvider } from '../components/providers/WhiteLabelProvider';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const tenantId = getTenantFromHeaders(headerStore);

  let whiteLabelData: {
    portalName: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    hideAgencyBranding: boolean;
    supportEmail?: string;
    hideSupportLink: boolean;
  } = {
    portalName: process.env.NEXT_PUBLIC_AGENCY_NAME ?? 'Client Portal',
    logoUrl: null,
    faviconUrl: null,
    hideAgencyBranding: false,
    supportEmail: process.env.NEXT_PUBLIC_AGENCY_SUPPORT_EMAIL,
    hideSupportLink: false,
  };

  if (tenantId) {
    const { data: tenant } = await db.from('tenants').select('config, plan').eq('id', tenantId).single();
    const wl = (tenant?.config as {
      whiteLabel?: {
        enabled?: boolean;
        portalName?: string;
        portalLogoUrl?: string;
        portalFaviconUrl?: string;
        hideAgencyBranding?: boolean;
        supportEmail?: string;
        hideSupportLink?: boolean;
      };
    })?.whiteLabel;

    if (tenant?.plan === 'enterprise' && wl?.enabled) {
      whiteLabelData = {
        portalName: wl.portalName ?? whiteLabelData.portalName,
        logoUrl: wl.portalLogoUrl ?? null,
        faviconUrl: wl.portalFaviconUrl ?? null,
        hideAgencyBranding: wl.hideAgencyBranding ?? false,
        supportEmail: wl.supportEmail ?? whiteLabelData.supportEmail,
        hideSupportLink: wl.hideSupportLink ?? false,
      };
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{whiteLabelData.faviconUrl ? <link rel="icon" href={whiteLabelData.faviconUrl} /> : null}</head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <WhiteLabelProvider>
          <div className="flex min-h-screen flex-col">
            <WhiteLabelHeader portalName={whiteLabelData.portalName} logoUrl={whiteLabelData.logoUrl} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
            <WhiteLabelFooter
              hideAgencyBranding={whiteLabelData.hideAgencyBranding}
              supportEmail={whiteLabelData.supportEmail}
              hideSupportLink={whiteLabelData.hideSupportLink}
            />
          </div>
        </WhiteLabelProvider>
      </body>
    </html>
  );
}
