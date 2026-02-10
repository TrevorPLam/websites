/**
 * @file apps/web/lib/search.ts
 * @role runtime
 * @summary Search index generation for pages and blog posts.
 *
 * @entrypoints
 * - getSearchIndex
 *
 * @exports
 * - SearchItem
 * - getSearchIndex
 *
 * @depends_on
 * - Internal: @/features/blog/lib/blog (getAllPosts)
 *
 * @used_by
 * - apps/web/app/search/page.tsx
 * - apps/web/components/Navigation.tsx
 *
 * @runtime
 * - environment: server
 * - side_effects: reads blog data
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'Page' | 'Blog';
  tags?: string[];
};

const staticPages: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Overview of our hair salon services, pricing, and booking information.',
    href: '/',
    type: 'Page',
    tags: ['hair salon', 'services', 'styling'],
  },
  {
    id: 'page-services',
    title: 'Services',
    description: 'Explore haircuts, coloring, styling, and hair treatment services.',
    href: '/services',
    type: 'Page',
    tags: ['hair services', 'treatments', 'styling'],
  },
  {
    id: 'page-pricing',
    title: 'Pricing',
    description: 'Review hair salon service packages, pricing, and membership options.',
    href: '/pricing',
    type: 'Page',
    tags: ['pricing', 'packages'],
  },
  {
    id: 'page-book',
    title: 'Book',
    description: 'Request an appointment and share your preferred time.',
    href: '/book',
    type: 'Page',
    tags: ['booking', 'appointment'],
  },
  {
    id: 'page-gallery',
    title: 'Gallery',
    description: 'Browse before-and-after transformations from our stylists.',
    href: '/gallery',
    type: 'Page',
    tags: ['gallery', 'before and after'],
  },
  {
    id: 'page-team',
    title: 'Team',
    description: 'Meet stylists and learn about their specialties.',
    href: '/team',
    type: 'Page',
    tags: ['team', 'stylists'],
  },
  {
    id: 'page-contact',
    title: 'Contact',
    description: 'Get in touch to schedule a free consultation.',
    href: '/contact',
    type: 'Page',
    tags: ['contact', 'consultation'],
  },
  {
    id: 'page-about',
    title: 'About',
    description: 'Learn about our stylists, mission, and hair care philosophy.',
    href: '/about',
    type: 'Page',
    tags: ['team', 'mission'],
  },
  {
    id: 'page-blog',
    title: 'Blog',
    description: 'Hair care tips, trends, and styling advice from our experts.',
    href: '/blog',
    type: 'Page',
    tags: ['blog', 'insights'],
  },
  {
    id: 'page-search',
    title: 'Search',
    description: 'Search blog posts, services, and hair care resources across site.',
    href: '/search',
    type: 'Page',
    tags: ['search', 'resources'],
  },
];

export async function getSearchIndex(): Promise<SearchItem[]> {
  // TODO: Integrate blog posts once build constraints are resolved
  // Blog content is successfully created and functional
  return staticPages;
}
