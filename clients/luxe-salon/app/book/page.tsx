import { BookingPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function BookPage() {
  return <BookingPageTemplate config={siteConfig} />;
}
