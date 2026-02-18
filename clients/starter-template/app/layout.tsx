/**
 * @file clients/starter-template/app/layout.tsx
 * Purpose: Root layout — html/body with locale-aware lang and dir attributes.
 */
import { headers } from 'next/headers';
import { getLocaleDir } from '@repo/features/localization';

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? 'en';
  const dir = getLocaleDir(locale);

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
