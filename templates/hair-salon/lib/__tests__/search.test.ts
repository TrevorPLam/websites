/**
 * Search index tests. Mocks blog feature to avoid pulling in next-mdx-remote (ESM).
 */
const path = require('path');

const searchTemplateRoot = path.resolve(__dirname, '../..');
const originalCwd = process.cwd;
process.cwd = () => searchTemplateRoot;

// Mock blog before loading search (search imports from features/blog)
jest.mock('@/features/blog', () => {
  const mockPosts = [
    {
      slug: 'test-post',
      title: 'Test Post',
      description: 'A test blog post',
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

const { getSearchIndex } = require('../search');
const { getAllPosts: getAllSearchPosts } = require('@/features/blog');

afterAll(() => {
  process.cwd = originalCwd;
});

describe('lib/search', () => {
  test('includes blog posts in the search index', async () => {
    const items = await getSearchIndex();
    const blogItems = items.filter((item: { type: string }) => item.type === 'Blog');

    expect(blogItems.length).toBeGreaterThan(0);
  });

  test('maps blog slugs into search hrefs', async () => {
    const items = await getSearchIndex();
    const posts = getAllSearchPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(items).toEqual(
      expect.arrayContaining([expect.objectContaining({ href: `/blog/${posts[0].slug}` })])
    );
  });
});
