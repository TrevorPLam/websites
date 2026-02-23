# sanity-documentation.md

## Overview

Sanity is a headless CMS that provides a flexible content platform with real-time collaboration, structured content management, and powerful querying capabilities through GROQ (Graph-Relational Object Queries). It offers "Content as Data" architecture that enables developers to build sophisticated content experiences.

## Core Concepts

### Content as Data Architecture

Sanity treats content as structured data rather than traditional CMS content, enabling:

- **Structured Content**: Type-safe content schemas
- **Real-time Collaboration**: Multiple editors working simultaneously
- **Version Control**: Full content history and branching
- **API-First**: Content accessible via REST and GraphQL APIs
- **Portable Content**: Export and import content easily

### GROQ Query Language

GROQ (Graph-Relational Object Queries) is Sanity's powerful query language designed to:

- Extract precisely what you need from documents
- Join related content by following references
- Filter and sort content with powerful expressions
- Transform data at the query level
- Create modular, reusable queries

## Installation and Setup

### Project Creation

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create new Sanity project
sanity init

# Choose template options:
# - Blank project (custom schema)
# - Blog schema
# - E-commerce schema
# - Next.js blog starter
```

### Project Structure

```
my-sanity-project/
├── sanity.json/          # Project configuration
├── schemas/
│   ├── index.js          # Schema definitions
│   ├── blogPost.js       # Blog post schema
│   └── author.js         # Author schema
├── lib/
│   └── client.js         # Sanity client configuration
├── pages/
│   └── manage.tsx        # Studio pages
├── styles/
│   └── style.css         # Studio styling
└── package.json
```

### Basic Configuration

```javascript
// sanity.json
{
  "project": {
    "name": "my-project"
  },
  "dataset": "production",
  "plugins": [
    "@sanity/vision"
  ],
  "parts": [
    {
      "name": "part:@sanity/base/schema",
      "path": "./schemas/index.js"
    }
  ]
}
```

## Schema Development

### Document Schemas

```javascript
// schemas/blogPost.js
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }],
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: `by ${selection.author}`,
      };
    },
  },
};
```

### Object Schemas

```javascript
// schemas/author.js
export default {
  name: 'author',
  title: 'Author',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'string',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string',
        },
      ],
    },
  ],
  preview: {
    select: {
      name: 'name',
      media: 'avatar',
    },
  },
};
```

### Portable Text

```javascript
// schemas/blockContent.js
export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'numbered' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessiblity.',
        },
      ],
    },
    {
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: ['html', 'css', 'json', 'python'],
      },
    },
  ],
};
```

## GROQ Query Language

### Basic Queries

```javascript
// Simple query to get all blog posts
const query = `
  *[_type == "blogPost"] {
    title,
    slug,
    excerpt,
    publishedAt
  }
`;

// Query with filtering and sorting
const query = `
  *[_type == "blogPost" && publishedAt < now()] | order(publishedAt desc) {
    title,
    slug,
    excerpt,
    publishedAt
  }
`;

// Query with references
const query = `
  *[_type == "blogPost" && featured == true] {
    title,
    slug,
    excerpt,
    author-> {
      name,
      avatar
    },
    publishedAt
  }
`;
```

### Advanced Queries

```javascript
// Query with projections and computed fields
const query = `
  *[_type == "blogPost"] {
    title,
    slug,
    "readingTime": round(length(pt::text(content)) / 5 / 180) + " min read",
    author-> {
      name,
      "avatarUrl": avatar.asset->url
    },
    tags,
    publishedAt
  }
`;

// Query with joins and coalesce
const query = `
  *[_type == "blogPost"] {
    title,
    slug,
    "authorName": coalesce(author->name, "Anonymous"),
    "categories": *[_type == "category" && _id in ^.categories[].ref] {
      title,
      slug
    }
  }
`;

// Query with conditional logic
const query = `
  *[_type == "blogPost"] {
    title,
    slug,
    "status": select(
      publishedAt < now() => "published",
      publishedAt > now() => "scheduled",
      "draft"
    ),
    "displayDate": select(
      publishedAt < now() => publishedAt,
      "Scheduled for " + dateTime(publishedAt).format("YYYY-MM-DD")
    )
  }
`;
```

### Query Functions

```javascript
// Custom GROQ functions
const query = `
  *[_type == "blogPost"] {
    title,
    slug,
    "wordCount": length(pt::text(content)),
    "estimatedReadTime": round(length(pt::text(content)) / 200),
    "hasImages": count(*[references(^._id) && _type == "image"]) > 0,
    "relatedPosts": *[_type == "blogPost" && _id != ^._id && count(tags[@ in ^.tags]) > 0][0..2] {
      title,
      slug
    }
  }
`;

// Date and time functions
const query = `
  *[_type == "blogPost"] {
    title,
    publishedAt,
    "year": dateTime(publishedAt).year,
    "month": dateTime(publishedAt).format("MMMM"),
    "dayOfWeek": dateTime(publishedAt).format("dddd"),
    "isRecent": dateTime(publishedAt) > dateTime(now()) - duration(7, "days")
  }
`;
```

## Client Integration

### JavaScript Client

```javascript
// lib/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: true, // Set to false for drafts/previews
  apiVersion: '2024-02-01', // Use current API version
});

// Query function
export async function getBlogPosts() {
  const query = `
    *[_type == "blogPost" && publishedAt < now()] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      author-> {
        name,
        avatar
      },
      publishedAt,
      tags
    }
  `;

  const posts = await client.fetch(query);
  return posts;
}

// Get single post
export async function getBlogPost(slug) {
  const query = `
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      slug,
      content,
      author-> {
        name,
        bio,
        avatar
      },
      publishedAt,
      tags,
      "relatedPosts": *[_type == "blogPost" && _id != ^._id && count(tags[@ in ^.tags]) > 0][0..2] {
        title,
        slug,
        excerpt
      }
    }
  `;

  const post = await client.fetch(query, { slug });
  return post;
}
```

### React Integration

```tsx
// components/BlogPost.tsx
import { useState, useEffect } from 'react';
import { client } from '../lib/client';
import { PortableText } from '@portabletext/react';

interface BlogPost {
  title: string;
  content: any[];
  author: {
    name: string;
    avatar: any;
  };
  publishedAt: string;
}

export function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const query = `
          *[_type == "blogPost" && slug.current == $slug][0] {
            title,
            content,
            author-> {
              name,
              avatar
            },
            publishedAt
          }
        `;

        const data = await client.fetch(query, { slug });
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <div className="author">
          <img src={post.author.avatar?.url} alt={post.author.name} />
          <span>{post.author.name}</span>
        </div>
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString()}</time>
      </header>

      <div className="content">
        <PortableText value={post.content} />
      </div>
    </article>
  );
}
```

### Next.js Integration

```tsx
// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { client } from '../../lib/client';
import { BlogPost } from '../../components/BlogPost';

interface PostPageProps {
  post: any;
}

export default function PostPage({ post }: PostPageProps) {
  return <BlogPost post={post} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `
    *[_type == "blogPost" && publishedAt < now()] {
      slug {
        current
      }
    }
  `;

  const posts = await client.fetch(query);
  const paths = posts.map((post: any) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      content,
      author-> {
        name,
        bio,
        avatar
      },
      publishedAt,
      tags
    }
  `;

  const post = await client.fetch(query, { slug: params?.slug });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
```

## Real-time Collaboration

### Webhook Configuration

```javascript
// pages/api/sanity-webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { revalidateTag } from 'next/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify webhook signature
  const signature = req.headers['sanity-signature'];
  const body = JSON.stringify(req.body);

  if (!verifySignature(body, signature)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Handle different webhook events
  const { _type, slug } = req.body;

  try {
    switch (_type) {
      case 'blogPost':
        // Revalidate blog post page
        await revalidateTag('blog-posts');
        await revalidateTag(`blog-post-${slug.current}`);
        break;

      case 'author':
        // Revalidate pages that reference this author
        await revalidateTag('authors');
        break;

      default:
        // Revalidate all content
        await revalidateTag('all-content');
    }

    res.status(200).json({ revalidated: true });
  } catch (error) {
    console.error('Revalidation error:', error);
    res.status(500).json({ message: 'Revalidation failed' });
  }
}

function verifySignature(body: string, signature: string): boolean {
  // Implement signature verification logic
  // Use your webhook secret to verify the signature
  return true; // Placeholder
}
```

### Real-time Updates

```tsx
// hooks/useRealtimeContent.ts
import { useEffect, useState } from 'react';
import { client } from '../lib/client';

export function useRealtimeContent(query: string, params?: any) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription: any;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await client.fetch(query, params);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchData();

    // Set up real-time subscription
    subscription = client.listen(query, params).subscribe((update: any) => {
      setData(update.result);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}
```

## Image Optimization

### Image Hotspots

```javascript
// schemas/heroImage.js
export default {
  name: 'heroImage',
  title: 'Hero Image',
  type: 'image',
  options: {
    hotspot: true,
    accept: 'image/*',
  },
  fields: [
    {
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for SEO and accessibility',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'text',
    },
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'alt',
    },
    prepare(selection) {
      return {
        title: selection.title,
        media: <img src={selection.imageUrl} alt="" />,
      };
    },
  },
};
```

### Image Transformation

```javascript
// Image component with Sanity CDN
import Image from 'next/image';
import { urlFor } from '../lib/sanity';

interface SanityImageProps {
  image: any;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
}

export function SanityImage({
  image,
  width = 800,
  height = 600,
  alt,
  priority = false
}: SanityImageProps) {
  const imageUrl = urlFor(image)
    .width(width)
    .height(height)
    .format('webp')
    .quality(80)
    .url();

  return (
    <Image
      src={imageUrl}
      alt={alt || image.alt || ''}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL={urlFor(image)
        .width(width)
        .height(height)
        .format('webp')
        .quality(10)
        .blur(20)
        .url()}
    />
  );
}
```

## Performance Optimization

### CDN Configuration

```javascript
// lib/sanity.js
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

export const urlFor = (source: any) =>
  imageUrlBuilder(client)
    .image(source)
    .auto('format')
    .fit('max');

// Optimized image queries
const optimizedImageQuery = `
  *[_type == "blogPost"] {
    title,
    "mainImage": mainImage {
      asset-> {
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
`;
```

### Caching Strategy

```javascript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

// Cache blog posts for 1 hour
export const getCachedBlogPosts = unstable_cache(
  async () => {
    const query = `
      *[_type == "blogPost" && publishedAt < now()] | order(publishedAt desc) {
        title,
        slug,
        excerpt,
        publishedAt
      }
    `;
    return client.fetch(query);
  },
  ['blog-posts'],
  { revalidate: 3600 }
);

// Cache single post for 30 minutes
export const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    const query = `
      *[_type == "blogPost" && slug.current == $slug][0] {
        title,
        content,
        publishedAt
      }
    `;
    return client.fetch(query, { slug });
  },
  ['blog-post'],
  { revalidate: 1800 }
);
```

## Security Best Practices

### Environment Variables

```javascript
// lib/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // For write operations
  apiVersion: '2024-02-01',
});
```

### Content Validation

```javascript
// schemas/validation.js
export const validationRules = {
  title: {
    required: true,
    min: 10,
    max: 100
  },
  slug: {
    required: true,
    custom: (value: string) => {
      // Custom validation logic
      return /^[a-z0-9-]+$/.test(value);
    }
  },
  email: {
    required: true,
    custom: (value: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  }
};

// Usage in schema
{
  name: 'email',
  title: 'Email',
  type: 'email',
  validation: Rule => Rule.required().custom(validationRules.email.custom)
}
```

## Migration and Deployment

### Environment Management

```javascript
// sanity.config.js
import { defineConfig } from '@sanity/cli';

export default defineConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  plugins: ['@sanity/vision', '@sanity/dashboard', '@sanity/production-list'],
  env: {
    development: {
      dataset: 'development',
    },
    staging: {
      dataset: 'staging',
    },
    production: {
      dataset: 'production',
    },
  },
});
```

### Content Migration

```javascript
// scripts/migrate-content.js
import { client } from '../lib/client';

async function migrateContent() {
  const oldPosts = await client.fetch('*[_type == "oldPost"]');

  for (const oldPost of oldPosts) {
    const newPost = {
      _type: 'blogPost',
      title: oldPost.title,
      slug: {
        _type: 'slug',
        current: oldPost.slug,
      },
      content: convertOldContent(oldPost.content),
      publishedAt: oldPost.date,
    };

    await client.create(newPost);
    console.log(`Migrated: ${oldPost.title}`);
  }
}

function convertOldContent(oldContent) {
  // Convert old content format to PortableText
  return oldContent.map((block) => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: block.text,
      },
    ],
  }));
}
```

## References

- [Sanity Official Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/content-lake/groq-introduction)
- [Sanity Learn Platform](https://www.sanity.io/learn)
- [Portable Text Documentation](https://portabletext.org/)
- [Sanity Community](https://www.sanity.io/community)
- [Sanity GitHub](https://github.com/sanity-io/sanity)
