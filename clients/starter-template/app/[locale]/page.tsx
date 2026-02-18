import { setRequestLocale } from 'next-intl/server';
import { HomePageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePageTemplate config={siteConfig} />;
}
