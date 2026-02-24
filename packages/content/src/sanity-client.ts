import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient, type QueryParams } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01';

export const sanityClient = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? 'production',
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  categories?: string[];
  publishedAt: string;
  estimatedReadingTime?: number;
  author?: {
    name?: string;
    role?: string;
    avatarUrl?: string;
  };
  mainImage?: {
    alt?: string;
    caption?: string;
    asset?: {
      url?: string;
    };
  };
  body?: unknown[];
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
  };
}

const POST_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  categories,
  publishedAt,
  estimatedReadingTime,
  "author": {
    "name": author.name,
    "role": author.role,
    "avatarUrl": author.avatar.asset->url
  },
  "mainImage": {
    "alt": mainImage.alt,
    "caption": mainImage.caption,
    "asset": {"url": mainImage.asset->url}
  },
  body,
  seo
}`;

export async function getBlogPostsByTenant(tenantId: string, limit = 12): Promise<SanityPost[]> {
  const query = `*[_type == "post" && tenantId == $tenantId]|order(publishedAt desc)[0...$limit]${POST_PROJECTION}`;
  const params: QueryParams = { tenantId, limit };
  return sanityClient.fetch<SanityPost[]>(query, params, {
    next: { revalidate: 300, tags: [`tenant:${tenantId}:blog`] },
  });
}

export async function getBlogPostBySlug(
  tenantId: string,
  slug: string
): Promise<SanityPost | null> {
  const query = `*[_type == "post" && tenantId == $tenantId && slug.current == $slug][0]${POST_PROJECTION}`;
  const params: QueryParams = { tenantId, slug };
  return sanityClient.fetch<SanityPost | null>(query, params, {
    next: { revalidate: 300, tags: [`tenant:${tenantId}:blog:${slug}`] },
  });
}

export async function getBlogSlugsByTenant(tenantId: string): Promise<string[]> {
  const query = `*[_type == "post" && tenantId == $tenantId && defined(slug.current)][]{"slug": slug.current}`;
  const data = await sanityClient.fetch<Array<{ slug?: string }>>(
    query,
    { tenantId },
    {
      next: { revalidate: 300, tags: [`tenant:${tenantId}:blog`] },
    }
  );

  return data.map((item) => item.slug).filter((slug): slug is string => Boolean(slug));
}
