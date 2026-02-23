# blog-content-architecture.md

## Overview

The blog/content system uses **Sanity v3** as the headless CMS, **GROQ** for queries, **on-demand ISR** via Sanity webhooks, and **Portable Text** for rich body rendering. All tenants share one Sanity project with content isolated by a `tenantId` field on every document. [buttercups](https://www.buttercups.tech/blog/react/sanity-integration-guide-for-nextjs-app-router-users)

---

## Why Sanity for Multi-Tenant Blogs

| Requirement            | Sanity Approach                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| Multi-tenant isolation | `tenantId` field on all documents; all GROQ queries include `&& tenantId == $tenantId`       |
| Real-time preview      | Sanity Visual Editing + stega encoding for in-context editing                                |
| On-demand ISR          | GROQ-powered webhook → `revalidateTag()` on publish                                          |
| Custom blocks          | Portable Text supports inline CTAs, video embeds, FAQ accordions                             |
| Shared Studio          | One Sanity project; agency editors see all tenants; client editors scoped by `tenantId` role |

---

## GROQ Query Patterns

```typescript
// ALWAYS include tenantId — never query without it
const POST_LIST = groq`
  *[
    _type == "post"
    && tenantId == $tenantId
    && !(_id in path("drafts.**"))
    && !coalesce(seo.noIndex, false)
  ]
  | order(publishedAt desc)
  [$from...$to] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    estimatedReadingTime,
    categories,
    mainImage { asset->, alt }
  }
`;

const POST_BY_SLUG = groq`
  *[
    _type == "post"
    && tenantId == $tenantId
    && slug.current == $slug
    && !(_id in path("drafts.**"))
  ][0] {
    ...,
    body[] {
      ...,
      _type == "image" => { asset->, alt, caption }
    }
  }
`;
```

**Rule:** The `&& tenantId == $tenantId` predicate in every GROQ query is a data isolation requirement — not an optimization. Omitting it returns all tenants' content. [github](https://github.com/sanity-io/next-sanity)

---

## On-Demand ISR Webhook

Sanity fires a GROQ-powered webhook when any `post` document is published, updated, or deleted. The webhook hits `/api/webhooks/sanity` which calls `revalidateTag()` to bust the specific post and blog index caches: [sanity](https://www.sanity.io/learn/course/controlling-cached-content-in-next-js/tag-based-revalidation)

```typescript
// apps/*/src/app/api/webhooks/sanity/route.ts
import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const { body, isValidSignature } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET!);

  if (!isValidSignature) return new Response('Unauthorized', { status: 401 });

  const { _type, slug, tenantId } = body;

  if (_type === 'post' && tenantId) {
    // Bust the specific post page
    if (slug?.current) revalidateTag(`tenant:${tenantId}:blog:${slug.current}`);
    // Bust the blog index (post count / order changed)
    revalidateTag(`tenant:${tenantId}:blog`);
    // Bust sitemap.xml
    revalidateTag(`tenant:${tenantId}:sitemap`);
  }

  return Response.json({ revalidated: true, now: Date.now() });
}
```

**Configure in Sanity webhook settings:**

- Filter: `_type == "post"`
- HTTP Method: `POST`
- URL: `https://[tenant-domain]/api/webhooks/sanity`
- Secret: stored in `SANITY_REVALIDATE_SECRET`

---

## Portable Text Rendering

```typescript
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@repo/content/sanity-client';

const components = {
  types: {
    image: ({ value }) => (
      <figure>
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt ?? ''}
          width={800} height={450}
          className="w-full h-auto rounded-xl"
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    cta: ({ value }) => (
      <a href={value.href} className="inline-flex px-6 py-3 bg-primary text-white rounded-xl">
        {value.text}
      </a>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href}
         target={value.href?.startsWith('http') ? '_blank' : undefined}
         rel={value.href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    ),
  },
};

export function BlogBody({ body }) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={body} components={components} />
    </div>
  );
}
```

---

## `BlogPosting` JSON-LD Schema

```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  author: { '@type': 'Person', name: post.author?.name },
  publisher: {
    '@type': 'Organization',
    name: config.identity.siteName,
    logo: { '@type': 'ImageObject', url: config.assets?.logo },
  },
  image: post.mainImage?.asset?.url,
  url: `${siteUrl}/blog/${post.slug}`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
  ...(post.estimatedReadingTime ? { timeRequired: `PT${post.estimatedReadingTime}M` } : {}),
};
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Sanity Next.js Toolkit — https://github.com/sanity-io/next-sanity
- Sanity Next.js App Router Guide — https://www.buttercups.tech/blog/react/sanity-integration-guide-for-nextjs-app-router-users
- Tag-based Revalidation (Sanity + Next.js) — https://www.sanity.io/learn/course/controlling-cached-content-in-next-js/tag-based-revalidation
- On-demand ISR by Sanity Webhooks — https://dev.to/valse/nextjs-on-demand-isr-by-sanity-groq-powered-webhooks-221n
- Sanity Toolkit for Next.js Enhancements — https://www.sanity.io/blog/sanity-nextjs-enhancements

## Implementation

[Add content here]

## Best Practices

[Add content here]

## Testing

[Add content here]
