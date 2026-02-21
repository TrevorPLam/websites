import { BlogIndexTemplate } from '@repo/page-templates';
import siteConfig from '../../site.config';

export default function BlogIndexPage() {
  return <BlogIndexTemplate config={siteConfig} />;
}
