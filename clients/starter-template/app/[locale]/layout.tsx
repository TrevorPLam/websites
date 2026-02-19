/**
 * @file clients/starter-template/app/[locale]/layout.tsx
 * Purpose: Locale-specific layout — NextIntlClientProvider, ThemeInjector, skip link.
 */
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeInjector } from '@repo/ui';
import { getTranslations } from 'next-intl/server';
import siteConfig from '@/site.config';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: siteConfig.seo.titleTemplate },
  description: siteConfig.seo.defaultDescription,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeInjector theme={siteConfig.theme.colors} />
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:w-auto focus:h-auto focus:p-4 focus:m-0 focus:overflow-visible focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {(await getTranslations('common'))('skipToContent')}
      </a>
      <main id="main-content">{children}</main>
    </NextIntlClientProvider>
  );
}
