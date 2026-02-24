import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogSlugsByTenant } from '@repo/content';
import siteConfig from '../../../site.config';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugsByTenant(siteConfig.id);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(siteConfig.id, slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt ?? siteConfig.description;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteConfig.url}/blog/${slug}`,
      publishedTime: post.publishedAt,
      images: post.mainImage?.asset?.url ? [{ url: post.mainImage.asset.url }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(siteConfig.id, slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-2 text-sm text-gray-500">Blog</p>
      <h1 className="mb-4 text-4xl font-extrabold text-gray-900">{post.title}</h1>
      <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
        {post.author?.name ? <span>{post.author.name}</span> : null}
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString()}</time>
        {post.estimatedReadingTime ? <span>{post.estimatedReadingTime} min read</span> : null}
      </div>
      {post.excerpt ? <p className="mb-8 text-lg text-gray-700">{post.excerpt}</p> : null}
      {post.mainImage?.asset?.url ? (
        <img
          src={post.mainImage.asset.url}
          alt={post.mainImage.alt ?? post.title}
          className="mb-8 w-full rounded-xl object-cover"
        />
      ) : null}
      <section aria-label="Post content" className="prose prose-gray max-w-none">
        {Array.isArray(post.body) && post.body.length > 0 ? (
          <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs">
            {JSON.stringify(post.body, null, 2)}
          </pre>
        ) : (
          <p>Content will render from Portable Text blocks when published in Sanity.</p>
        )}
      </section>
    </main>
  );
}
