import { setRequestLocale } from 'next-intl/server';
import { BlogIndexTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogIndexTemplate config={siteConfig} />;
}
