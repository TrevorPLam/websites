# Search Feature Usage

**Last Updated:** 2026-02-17

## Overview

The search feature provides site-wide search via a dialog (⌘K) and full-page search. It uses configurable content sources: static routes and blog posts.

## Components

### SearchDialog

Modal search triggered by button or Cmd/Ctrl+K. Uses `@repo/ui` Dialog for accessibility.

```tsx
import { SearchDialog } from '@repo/features/search';

<SearchDialog items={searchItems} variant="desktop" />
```

**Props:**

- `items` — SearchItem[] (from getSearchIndex)
- `variant` — `'desktop' | 'mobile'` (default: `'desktop'`)
- `placeholder` — Optional input placeholder text

### SearchPage

Full-page search with URL-synced query (`?q=`).

```tsx
import { SearchPage } from '@repo/features/search';

<SearchPage items={searchItems} />
```

**Props:**

- `items` — SearchItem[] (required)
- `heading` — Optional page heading
- `subheading` — Optional description
- `placeholder` — Optional input placeholder

## Building the Search Index

```typescript
import { getSearchIndex } from '@repo/features/search';
import type { SearchItem, SearchIndexConfig } from '@repo/features/search';

// Template provides static items (from route registry) and blog items
const config: SearchIndexConfig = {
  staticItems: getSearchEntries(), // from lib/routes
  blogItems: posts.map((p) => ({
    id: `blog-${p.slug}`,
    title: p.title,
    description: p.description,
    href: `/blog/${p.slug}`,
    type: 'Blog',
    tags: ['blog', p.category].filter(Boolean),
  })),
};

const items = await getSearchIndex(config);
```

## Filtering

Both components use `filterSearchItems` for substring matching across title, description, and tags. Case-insensitive.

## Template Integration

See `templates/hair-salon/lib/search.ts` for the adapter pattern: template wires route registry + blog content into the feature's `getSearchIndex`.
