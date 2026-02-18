import { BlogIndexTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function BlogPage() {
  return <BlogIndexTemplate config={siteConfig} />;
}
