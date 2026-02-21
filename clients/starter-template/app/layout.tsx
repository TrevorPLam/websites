/**
 * @file clients/starter-template/app/layout.tsx
 * Purpose: Root layout — html/body with locale-aware lang and dir attributes, JSON-LD schema,
 *          consent provider, and theme flicker-prevention init script (Task 4.3).
 * Pattern: ThemeProvider is in LocaleProviders (client); init script runs before hydration
 *          so dark/light preference is applied before first paint (no flash of wrong theme).
 */
import { headers } from 'next/headers';
import { getLocaleDir } from '@repo/features/localization';
import { generateOrganizationJsonLd } from '@repo/industry-schemas';
import { getThemeInitScript } from '@repo/infrastructure-ui/theme/server';
import { Providers } from './providers';
import siteConfig from '../site.config';

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? 'en';
  const dir = getLocaleDir(locale);
  const jsonLd = generateOrganizationJsonLd(siteConfig);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {/*
         * Flicker-prevention init script (Task 4.3): reads the persisted color mode
         * preference from localStorage and applies data-color-mode="light|dark" on
         * <html> BEFORE React hydrates, preventing the flash-of-incorrect-theme (FOIT).
         * Must run synchronously in <head> before first paint.
         */}
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body>
        <Providers cmpProvider={siteConfig.consent?.cmpProvider ?? 'custom'}>{children}</Providers>
      </body>
    </html>
  );
}
