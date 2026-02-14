const searchTestPath = require('path');

// blog.ts computes postsDirectory at module load via process.cwd()
const searchTemplateRoot = searchTestPath.resolve(__dirname, '../..');
const originalSearchCwdFunction = process.cwd;
process.cwd = () => searchTemplateRoot;

const { getSearchIndex } = require('../search');
const { getAllPosts: getAllSearchPosts } = require('../../features/blog/lib/blog');

afterAll(() => {
  process.cwd = originalSearchCwdFunction;
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
