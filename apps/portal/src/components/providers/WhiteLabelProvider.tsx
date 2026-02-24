import { headers } from 'next/headers';

import { db } from '@repo/db';
import { getTenantFromHeaders } from '@repo/multi-tenant';

function toHexWithAlpha(hex: string, alpha: string): string {
  return `${hex}${alpha}`;
}

export async function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const tenantId = getTenantFromHeaders(headerStore);

  let whiteLabelConfig: { portalPrimaryColor?: string; portalName?: string; enabled?: boolean } | null = null;

  if (tenantId) {
    const { data: tenant } = await db.from('tenants').select('config, plan').eq('id', tenantId).single();
    const wl = (tenant?.config as { whiteLabel?: { enabled?: boolean; portalPrimaryColor?: string; portalName?: string } })
      ?.whiteLabel;

    if (tenant?.plan === 'enterprise' && wl?.enabled) {
      whiteLabelConfig = wl;
    }
  }

  const primaryColor = whiteLabelConfig?.portalPrimaryColor ?? '#2563eb';
  const portalName = whiteLabelConfig?.portalName ?? process.env.NEXT_PUBLIC_AGENCY_NAME ?? 'Client Portal';

  const cssVars = `
    :root {
      --color-primary: ${primaryColor};
      --color-primary-50: ${toHexWithAlpha(primaryColor, '14')};
      --color-primary-100: ${toHexWithAlpha(primaryColor, '29')};
      --color-primary-500: ${primaryColor};
      --color-primary-600: ${toHexWithAlpha(primaryColor, 'e6')};
      --color-primary-700: ${toHexWithAlpha(primaryColor, 'cc')};
      --portal-name: "${portalName}";
    }
  `.trim();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} id="white-label-vars" />
      {children}
    </>
  );
}
