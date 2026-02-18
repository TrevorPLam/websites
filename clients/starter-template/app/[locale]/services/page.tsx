import { setRequestLocale } from 'next-intl/server';
import { ServicesPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageTemplate config={siteConfig} />;
}
