/**
 * @file clients/starter-template/app/[locale]/layout.tsx
 * Purpose: Locale-specific layout — provider composition (NextIntlClientProvider, ThemeInjector), skip link.
 * Pattern: LocaleProviders (client) uses ProviderComposer from @repo/infra/composition; add more providers there as needed (e.g. TooltipProvider).
 */
import type { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { LocaleProviders } from './LocaleProviders';
import { resolveThemeColors } from '@repo/types';
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
    <LocaleProviders messages={messages} theme={resolveThemeColors(siteConfig.theme)}>
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:w-auto focus:h-auto focus:p-4 focus:m-0 focus:overflow-visible focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {(await getTranslations('common'))('skipToContent')}
      </a>
      <main id="main-content">{children}</main>
    </LocaleProviders>
  );
}
