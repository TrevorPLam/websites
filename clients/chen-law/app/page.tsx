import { HomePageTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function HomePage() {
  return <HomePageTemplate config={siteConfig} />;
}
