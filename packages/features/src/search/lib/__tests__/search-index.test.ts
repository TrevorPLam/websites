/**
 * getSearchIndex unit tests. Verifies config merging and async blog provider.
 */
import { getSearchIndex } from '../search-index';
import type { SearchItem, SearchIndexConfig } from '../../types';

const staticItems: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Home page',
    href: '/',
    type: 'Page',
  },
];

const blogItems: SearchItem[] = [
  {
    id: 'blog-post-1',
    title: 'Blog Post',
    description: 'A blog post',
    href: '/blog/post-1',
    type: 'Blog',
  },
];

describe('getSearchIndex', () => {
  it('returns static items when no blog items', async () => {
    const config: SearchIndexConfig = { staticItems };
    const result = await getSearchIndex(config);
    expect(result).toEqual(staticItems);
    expect(result).toHaveLength(1);
  });

  it('merges static and blog items (array)', async () => {
    const config: SearchIndexConfig = { staticItems, blogItems };
    const result = await getSearchIndex(config);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(staticItems[0]);
    expect(result[1]).toEqual(blogItems[0]);
  });

  it('merges static and blog items (async provider)', async () => {
    const config: SearchIndexConfig = {
      staticItems,
      blogItems: async () => blogItems,
    };
    const result = await getSearchIndex(config);
    expect(result).toHaveLength(2);
    expect(result[1].type).toBe('Blog');
  });

  it('returns static only when blogItems is empty array', async () => {
    const config: SearchIndexConfig = { staticItems, blogItems: [] };
    const result = await getSearchIndex(config);
    expect(result).toEqual(staticItems);
  });
});
