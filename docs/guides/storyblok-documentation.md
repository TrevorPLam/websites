# storyblok-documentation.md

## Overview

Storyblok is a headless CMS that provides visual editing capabilities with a component-based content structure. It offers real-time collaboration, block-based content creation, and seamless integration with modern web frameworks.

## Core Concepts

### Visual Editor

Storyblok's Visual Editor provides WYSIWYG editing directly in your website's preview:

- **Live Preview**: See changes in real-time as you edit
- **Component-based**: Content is built from reusable blocks
- **Visual Navigation**: Click elements to navigate between blocks
- **Real-time Collaboration**: Multiple users can edit simultaneously
- **Context Menus**: Right-click for quick block operations

### Block-Based Architecture

Content in Storyblok is structured as blocks:

- **Stories**: Content containers (pages, articles, products)
- **Blocks**: Reusable content components
- **Fields**: Data within blocks (text, images, rich text)
- **Nesting**: Blocks can contain other blocks
- **References**: Links between content pieces

## Installation and Setup

### Project Creation

```bash
# Create new Storyblok project
# 1. Sign up at https://www.storyblok.com
# 2. Create new space
# 3. Choose starter template or blank project
# 4. Get your space ID and access token
```

### SDK Installation

```bash
# npm
npm install @storyblok/react @storyblok/js

# yarn
yarn add @storyblok/react @storyblok/js

# pnpm
pnpm add @storyblok/react @storyblok/js
```

### Basic Configuration

```javascript
// storyblok.config.js
export default {
  accessToken: 'your-access-token',
  use: 'api', // or 'cdn'
  cache: {
    clear: 'auto',
    type: 'memory',
  },
  apiOptions: {
    region: 'us', // or 'eu', 'ap'
  },
};
```

## Component Development

### React Integration

```tsx
// components/StoryblokComponent.tsx
import { storyblokEditable, StoryblokComponent as StoryblokComponentType } from '@storyblok/react';

interface StoryblokComponentProps {
  blok: StoryblokComponentType;
}

export function StoryblokComponent({ blok }: StoryblokComponentProps) {
  return (
    <div {...storyblokEditable(blok)}>
      <h2>{blok.headline}</h2>
      <p>{blok.text}</p>
    </div>
  );
}
```

### Block Components

```tsx
// components/blocks/Teaser.tsx
import { storyblokEditable } from '@storyblok/react';

interface TeaserProps {
  blok: {
    headline: string;
    text: string;
    image: {
      id: string;
      filename: string;
      alt: string;
    };
    _uid: string;
    _editable: string;
  };
}

export function Teaser({ blok }: TeaserProps) {
  return (
    <div {...storyblokEditable(blok)} className="teaser">
      <h2>{blok.headline}</h2>
      <img
        src={blok.image?.filename}
        alt={blok.image?.alt || blok.headline}
        className="teaser-image"
      />
      <p>{blok.text}</p>
    </div>
  );
}
```

### Rich Text Component

```tsx
// components/RichText.tsx
import { renderRichText } from '@storyblok/react';

interface RichTextProps {
  content: any;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  const renderedContent = renderRichText(content, {
    markResolvers: {
      bold: (children) => <strong>{children}</strong>,
      italic: (children) => <em>{children}</em>,
      link: (children, props) => (
        <a href={props.href} className="text-blue-600 hover:underline">
          {children}
        </a>
      ),
    },
    nodeResolvers: {
      heading: (children, props) => {
        const Tag = `h${props.level}`;
        return <Tag className="font-bold mb-4">{children}</Tag>;
      },
      paragraph: (children) => <p className="mb-4">{children}</p>,
      list_item: (children) => <li className="ml-4">{children}</li>,
      ordered_list: (children) => <ol className="list-decimal ml-4 mb-4">{children}</ol>,
      unordered_list: (children) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
    },
  });

  return <div className={className}>{renderedContent}</div>;
}
```

### Page Component

```tsx
// components/Page.tsx
import { useStoryblokState, getStoryblokApi } from '@storyblok/react';
import { StoryblokComponent } from './StoryblokComponent';
import { RichText } from './RichText';

interface PageProps {
  story: any;
}

export function Page({ story }: PageProps) {
  story = useStoryblokState(story);

  return (
    <main>
      <h1>{story.content.title}</h1>

      {story.content.body?.map((blok: any) => (
        <StoryblokComponent blok={blok} key={blok._uid} />
      ))}
    </main>
  );
}

// Static generation for Next.js
export async function getStaticProps({ params }) {
  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get('cdn/stories', {
    version: 'draft',
    starts_with: params.slug || 'home',
  });

  return {
    props: {
      story: data.stories[0] || null,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
```

## Block Schema Definition

### Basic Block Schema

```javascript
// storyblok/components/teaser.json
{
  "name": "teaser",
  "display_name": "Teaser",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "headline": {
      "type": "text",
      "required": true,
      "default": "Default Headline"
    },
    "text": {
      "type": "textarea",
      "required": false
    },
    "image": {
      "type": "asset",
      "filetypes": ["images"],
      "required": false
    },
    "link": {
      "type": "multilink",
      "required": false
    },
    "variant": {
      "type": "options",
      "options": [
        {
          "value": "default",
          "label": "Default"
        },
        {
          "value": "featured",
          "label": "Featured"
        }
      ]
    }
  }
}
```

### Complex Block Schema

```javascript
// storyblok/components/card-grid.json
{
  "name": "card-grid",
  "display_name": "Card Grid",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "title": {
      "type": "text",
      "required": true
    },
    "columns": {
      "type": "number",
      "default": 3,
      "min": 1,
      "max": 4
    },
    "cards": {
      "type": "blocks",
      "restrict_components": true,
      "component_whitelist": ["card"],
      "limit": 12
    },
    "background_color": {
      "type": "text",
      "default": "#ffffff"
    },
    "show_borders": {
      "type": "boolean",
      "default": false
    },
    "spacing": {
      "type": "select",
      "options": [
        {
          "value": "compact",
          "label": "Compact"
        },
        {
          "value": "normal",
          "label": "Normal"
        },
        {
          "value": "spacious",
          "label": "Spacious"
        }
      ]
    }
  }
}
```

### Field Types

```javascript
// Common field types examples
{
  "text_field": {
    "type": "text",
    "required": true,
    "default": "Default text"
  },
  "textarea_field": {
    "type": "textarea",
    "rows": 5
  },
  "rich_text_field": {
    "type": "richtext"
  },
  "number_field": {
    "type": "number",
    "min": 0,
    "max": 100
  },
  "boolean_field": {
    "type": "boolean",
    "default": false
  },
  "date_field": {
    "type": "date"
  },
  "datetime_field": {
    "type": "datetime"
  },
  "asset_field": {
    "type": "asset",
    "filetypes": ["images", "videos"]
  },
  "multilink_field": {
    "type": "multilink"
  },
  "select_field": {
    "type": "select",
    "options": [
      { "value": "option1", "label": "Option 1" },
      { "value": "option2", "label": "Option 2" }
    ]
  },
  "multi_options_field": {
    "type": "multioptions",
    "options": [
      { "value": "tag1", "label": "Tag 1" },
      { "value": "tag2", "label": "Tag 2" }
    ]
  }
}
```

## API Integration

### Client Configuration

```javascript
// lib/storyblok.js
import { storyblokInit, apiPlugin } from '@storyblok/react';

const storyblokToken = process.env.STORYBLOK_TOKEN;

export const { storyblokApi } = storyblokInit({
  accessToken: storyblokToken,
  use: [apiPlugin],
  apiOptions: {
    region: 'us',
    cache: {
      clear: 'auto',
      type: 'memory',
    },
  },
});
```

### Content Fetching

```javascript
// lib/content.js
import { storyblokApi } from './storyblok';

// Get all stories
export async function getAllStories() {
  const { data } = await storyblokApi.get('cdn/stories', {
    version: 'published',
    per_page: 100,
  });

  return data.stories;
}

// Get story by slug
export async function getStoryBySlug(slug) {
  const { data } = await storyblokApi.get('cdn/stories/' + slug, {
    version: 'published',
  });

  return data.story;
}

// Get stories by content type
export async function getStoriesByContentType(contentType) {
  const { data } = await storyblokApi.get('cdn/stories', {
    version: 'published',
    starts_with: contentType,
    per_page: 50,
  });

  return data.stories;
}

// Get stories with specific field values
export async function getStoriesByField(field, value) {
  const { data } = await storyblokApi.get('cdn/stories', {
    version: 'published',
    filter_query: {
      [field]: {
        in: value,
      },
    },
  });

  return data.stories;
}
```

### Dynamic Content Loading

```tsx
// hooks/useStoryblokContent.ts
import { useState, useEffect } from 'react';
import { storyblokApi } from '../lib/storyblok';

interface UseStoryblokContentOptions {
  slug?: string;
  contentType?: string;
  version?: 'draft' | 'published';
}

export function useStoryblokContent(options: UseStoryblokContentOptions) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);

        let query = 'cdn/stories';
        const params: any = {
          version: options.version || 'published',
        };

        if (options.slug) {
          query += '/' + options.slug;
        } else if (options.contentType) {
          params.starts_with = options.contentType;
        }

        const { data } = await storyblokApi.get(query, params);

        setContent(options.slug ? data.story : data.stories);
        setError(null);
      } catch (err) {
        setError(err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [options.slug, options.contentType, options.version]);

  return { content, loading, error };
}
```

## Visual Editor Integration

### Editor Bridge Setup

```tsx
// components/StoryblokEditor.tsx
import { storyblokInit, storyblokEditable } from '@storyblok/react';

// Initialize Storyblok bridge for live editing
if (typeof window !== 'undefined') {
  const { StoryblokComponent, storyblokApi } = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
    use: [apiPlugin],
    enableBridge: true,
  });
}

interface StoryblokEditorProps {
  content: any;
  editMode?: boolean;
}

export function StoryblokEditor({ content, editMode = false }: StoryblokEditorProps) {
  if (!content) return null;

  return (
    <div className={editMode ? 'storyblok-editor' : ''}>
      {content.body?.map((blok: any) => (
        <div key={blok._uid} {...storyblokEditable(blok)}>
          <StoryblokComponent blok={blok} />
        </div>
      ))}
    </div>
  );
}
```

### CSS for Visual Editor

```css
/* styles/storyblok-editor.css */
.storyblok-editor {
  /* Add visual indicators for editable areas */
  position: relative;
}

.storyblok-editor [data-storyblok-cms] {
  outline: 2px dashed #007bff;
  outline-offset: 2px;
}

.storyblok-editor [data-storyblok-cms]:hover {
  outline-color: #0056b3;
  background-color: rgba(0, 123, 255, 0.05);
}

/* Visual editor specific styles */
.sb-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sb-preview .teaser {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.sb-preview .card-grid {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.sb-preview .card-grid[data-columns='2'] {
  grid-template-columns: repeat(2, 1fr);
}

.sb-preview .card-grid[data-columns='3'] {
  grid-template-columns: repeat(3, 1fr);
}

.sb-preview .card-grid[data-columns='4'] {
  grid-template-columns: repeat(4, 1fr);
}
```

## Advanced Features

### Content Relationships

```javascript
// Linking content between blocks
{
  "name": "related_posts",
  "display_name": "Related Posts",
  "schema": {
    "title": {
      "type": "text",
      "required": true
    },
    "posts": {
      "type": "multilink",
      "max_items": 3,
      "link_types": ["story"]
    }
  }
}

// Accessing related content
export function RelatedPosts({ blok }: { blok: any }) {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    async function fetchRelatedPosts() {
      const postSlugs = blok.posts
        .filter(link => link.story)
        .map(link => link.story.slug);

      const { data } = await storyblokApi.get('cdn/stories', {
        by_slugs: postSlugs.join(','),
        version: 'published'
      });

      setRelatedPosts(data.stories);
    }

    fetchRelatedPosts();
  }, [blok.posts]);

  return (
    <div {...storyblokEditable(blok)}>
      <h2>{blok.title}</h2>
      <div className="related-posts">
        {relatedPosts.map(post => (
          <div key={post.id}>
            <h3>{post.content.title}</h3>
            <p>{post.content.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dynamic Content Loading

```tsx
// components/DynamicContent.tsx
import { useState, useEffect } from 'react';
import { storyblokApi } from '../lib/storyblok';

interface DynamicContentProps {
  blok: {
    content_type: string;
    limit: number;
    sort_by: string;
  };
}

export function DynamicContent({ blok }: DynamicContentProps) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDynamicContent() {
      try {
        setLoading(true);

        const { data } = await storyblokApi.get('cdn/stories', {
          starts_with: blok.content_type,
          per_page: blok.limit,
          sort_by: blok.sort_by,
          version: 'published',
        });

        setContent(data.stories);
      } catch (error) {
        console.error('Error fetching dynamic content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicContent();
  }, [blok.content_type, blok.limit, blok.sort_by]);

  if (loading) return <div>Loading content...</div>;

  return (
    <div {...storyblokEditable(blok)}>
      {content.map((story: any) => (
        <div key={story.id}>
          <h3>{story.name}</h3>
          <p>{story.content.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

### Custom Field Types

```javascript
// Creating custom field components
// storyblok/components/color-picker.json
{
  "name": "color_picker",
  "display_name": "Color Picker",
  "is_root": false,
  "schema": {
    "color": {
      "type": "text",
      "default": "#000000"
    }
  },
  "template": {
    "type": "custom",
    "source": "custom-fields/color-picker.js"
  }
}

// custom-fields/color-picker.js
export default {
  template: `
    <div class="color-picker-field">
      <input
        type="color"
        v-model="model.color"
        @input="updateModel"
      />
      <input
        type="text"
        v-model="model.color"
        @input="updateModel"
        placeholder="#000000"
      />
    </div>
  `,
  methods: {
    updateModel() {
      this.$emit('changed-model', this.model);
    }
  }
};
```

## Performance Optimization

### Caching Strategy

```javascript
// lib/storyblok-cache.js
import { storyblokApi } from './storyblok';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedStory(slug, version = 'published') {
  const cacheKey = `${slug}-${version}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const { data } = await storyblokApi.get('cdn/stories/' + slug, {
    version,
  });

  cache.set(cacheKey, {
    data: data.story,
    timestamp: Date.now(),
  });

  return data.story;
}

// Clear cache for specific content
export function clearCache(slug) {
  const keysToDelete = Array.from(cache.keys()).filter((key) => key.startsWith(slug));

  keysToDelete.forEach((key) => cache.delete(key));
}
```

### Image Optimization

```tsx
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
}: OptimizedImageProps) {
  // Storyblok image service URL construction
  const optimizedSrc = `${src}/m/${width}x${height}/filters:quality(80)`;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL={`${src}/m/10x10/filters:blur(10)`}
    />
  );
}
```

### Lazy Loading

```tsx
// hooks/useStoryblokLazy.ts
import { useState, useEffect, useRef } from 'react';

export function useStoryblokLazy(slug, options = {}) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const element = document.getElementById(`storyblok-${slug}`);

    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !content) {
            loadContent();
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [slug]);

  async function loadContent() {
    setLoading(true);
    try {
      const { data } = await storyblokApi.get('cdn/stories/' + slug, {
        version: 'published',
        ...options,
      });
      setContent(data.story);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }

  return { content, loading };
}
```

## Security Best Practices

### Environment Variables

```javascript
// .env.local
NEXT_PUBLIC_STORYBLOK_TOKEN = your - public - token;
STORYBLOK_PREVIEW_TOKEN = your - preview - token;
```

### Content Validation

```typescript
// types/storyblok.ts
export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: any;
  published_at: string;
  created_at: string;
}

export interface StoryblokBlock {
  _uid: string;
  component: string;
  [key: string]: any;
}

// Validation function
export function validateStoryblokStory(story: any): story is StoryblokStory {
  return (
    story &&
    typeof story.id === 'number' &&
    typeof story.uuid === 'string' &&
    typeof story.name === 'string' &&
    typeof story.slug === 'string' &&
    typeof story.content === 'object'
  );
}
```

### Access Control

```javascript
// middleware/storyblok-auth.js
export function withStoryblokAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || token !== process.env.STORYBLOK_API_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return handler(req, res);
  };
}
```

## Testing

### Unit Testing

```tsx
// __tests__/Teaser.test.tsx
import { render, screen } from '@testing-library/react';
import { Teaser } from '../components/Teaser';

describe('Teaser Component', () => {
  const mockBlok = {
    _uid: 'test-uid',
    headline: 'Test Headline',
    text: 'Test text content',
    image: {
      id: 'image-id',
      filename: 'https://example.com/image.jpg',
      alt: 'Test image',
    },
  };

  it('renders headline correctly', () => {
    render(<Teaser blok={mockBlok} />);
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it('renders text content', () => {
    render(<Teaser blok={mockBlok} />);
    expect(screen.getByText('Test text content')).toBeInTheDocument();
  });

  it('renders image with correct attributes', () => {
    render(<Teaser blok={mockBlok} />);
    const image = screen.getByAltText('Test Headline');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
```

### Integration Testing

```tsx
// __tests__/StoryblokIntegration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Page } from '../components/Page';

// Mock Storyblok API
jest.mock('@storyblok/react', () => ({
  useStoryblokState: (story) => story,
  getStoryblokApi: () => ({
    get: jest.fn().mockResolvedValue({
      data: {
        stories: [
          {
            id: 1,
            name: 'Home',
            slug: 'home',
            content: {
              title: 'Home Page',
              body: [
                {
                  _uid: 'teaser-1',
                  component: 'teaser',
                  headline: 'Welcome',
                  text: 'Welcome to our site',
                },
              ],
            },
          },
        ],
      },
    }),
  }),
}));

describe('Storyblok Integration', () => {
  it('renders page with Storyblok content', async () => {
    const mockStory = {
      id: 1,
      name: 'Home',
      content: {
        title: 'Home Page',
        body: [
          {
            _uid: 'teaser-1',
            component: 'teaser',
            headline: 'Welcome',
            text: 'Welcome to our site',
          },
        ],
      },
    };

    render(<Page story={mockStory} />);

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });
});
```

## Deployment

### Environment Configuration

```javascript
// storyblok.config.production.js
export default {
  accessToken: process.env.STORYBLOK_TOKEN,
  use: 'api',
  cache: {
    clear: 'auto',
    type: 'redis', // Use Redis for production
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  apiOptions: {
    region: 'us',
    timeout: 5000,
  },
};
```

### CDN Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['a.storyblok.com'],
    formats: ['image/webp', 'image/avif'],
  },
  rewrites: () => [
    {
      source: '/storyblok/:path*',
      destination: 'https://api.storyblok.com/v2/:path*',
    },
  ],
};
```

## References

- [Storyblok Official Documentation](https://www.storyblok.com/docs)
- [Storyblok Visual Editor Guide](https://www.storyblok.com/docs/concepts/visual-editor)
- [Storyblok API Reference](https://www.storyblok.com/docs/api)
- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [Storyblok Community](https://www.storyblok.com/community)
- [Storyblok GitHub](https://github.com/storyblok/storyblok)
