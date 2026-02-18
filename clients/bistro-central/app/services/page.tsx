import { ServicesPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function ServicesPage() {
  return <ServicesPageTemplate config={siteConfig} />;
}
