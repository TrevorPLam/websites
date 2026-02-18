import { setRequestLocale } from 'next-intl/server';
import { BookingPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BookingPageTemplate config={siteConfig} />;
}
