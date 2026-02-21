import { BlogPostTemplate } from '@repo/page-templates';
import siteConfig from '../../../site.config';

export default function BlogPostPage() {
  return <BlogPostTemplate config={siteConfig} searchParams={{ slug: 'getting-started' }} />;
}
