import { ContactPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function ContactPage() {
  return <ContactPageTemplate config={siteConfig} />;
}
