import { setRequestLocale } from 'next-intl/server';
import { ContactPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageTemplate config={siteConfig} />;
}
