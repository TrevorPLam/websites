/**
 * @file clients/starter-template/app/layout.tsx
 * Purpose: Root layout — html/body with locale-aware lang and dir attributes, JSON-LD schema, consent provider.
 */
import { headers } from 'next/headers';
import { getLocaleDir } from '@repo/features/localization';
import { generateOrganizationJsonLd } from '@repo/industry-schemas';
import { ConsentProvider } from '@repo/ui';
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body>
        <ConsentProvider cmpProvider={siteConfig.consent?.cmpProvider ?? 'custom'}>
          {children}
        </ConsentProvider>
      </body>
    </html>
  );
}
