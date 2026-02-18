import { setRequestLocale } from 'next-intl/server';
import { AboutPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPageTemplate config={siteConfig} />;
}
