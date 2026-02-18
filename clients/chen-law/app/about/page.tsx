import { AboutPageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function AboutPage() {
  return <AboutPageTemplate config={siteConfig} />;
}
