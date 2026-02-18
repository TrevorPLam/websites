import { setRequestLocale } from 'next-intl/server';
import { BlogPostTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <BlogPostTemplate config={{ ...siteConfig, slug }} />;
}
