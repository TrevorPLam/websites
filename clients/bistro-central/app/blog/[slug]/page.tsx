import { BlogPostTemplate } from '@repo/page-templates';
import siteConfig from '@/site.config';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostTemplate config={{ ...siteConfig, slug: params.slug }} />;
}
