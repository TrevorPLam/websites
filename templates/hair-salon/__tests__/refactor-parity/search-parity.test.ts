/**
 * Search feature parity tests.
 * Verifies template getSearchIndex() (adapter over @repo/features/search) returns correct shape
 * and includes static + blog content. See docs/testing/refactor-parity-matrix.md (S1–S3).
 */

const path = require('path');

const templateRoot = path.resolve(__dirname, '../..');
const originalCwd = process.cwd;
process.cwd = () => templateRoot;

jest.mock('@/features/blog', () => {
  const mockPosts = [
    {
      slug: 'parity-post',
      title: 'Parity Post',
      description: 'A test blog post for parity',
      date: '2026-01-01',
      author: 'Test Author',
      category: 'Test',
      readingTime: '1 min read',
      content: '',
    },
  ];
  return {
    getAllPosts: () => mockPosts,
  };
});

const { getSearchIndex } = require('@/lib/search');
const { getAllPosts } = require('@/features/blog');

afterAll(() => {
  process.cwd = originalCwd;
});

describe('Search parity (template adapter + @repo/features/search)', () => {
  it('S1: search index includes static pages from route registry', async () => {
    const items = await getSearchIndex();
    const staticItems = items.filter((item: { type: string }) => item.type === 'Page');

    expect(staticItems.length).toBeGreaterThan(0);
    expect(items.some((i: { href: string }) => i.href === '/')).toBe(true);
  });

  it('S2: search index includes blog posts with correct href /blog/:slug', async () => {
    const items = await getSearchIndex();
    const blogItems = items.filter((item: { type: string }) => item.type === 'Blog');
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(blogItems.length).toBeGreaterThan(0);
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: `/blog/${posts[0].slug}`,
          type: 'Blog',
        }),
      ])
    );
  });

  it('S3: each item has id, title, description, href, type', async () => {
    const items = await getSearchIndex();

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('href');
      expect(item).toHaveProperty('type');
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(['Page', 'Blog'].includes(item.type)).toBe(true);
    }
  });
});
