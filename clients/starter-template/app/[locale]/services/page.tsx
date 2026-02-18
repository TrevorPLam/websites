import { setRequestLocale } from 'next-intl/server';
import { ServicesPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ServicesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolvedSearchParams = await searchParams;
  return (
    <ServicesPageTemplate config={siteConfig} searchParams={resolvedSearchParams} />
  );
}
