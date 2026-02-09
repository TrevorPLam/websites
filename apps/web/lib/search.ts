/**
 * Search index generation for site-wide search.
 *
 * Purpose:
 * - Provide a single source of truth for search items
 * - Combine static pages and blog posts in one list
 * - Keep search dialog and search page consistent
 */

import { getAllPosts } from '@/lib/blog';

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
    description: 'Meet the stylists and learn about their specialties.',
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
    description: 'Search blog posts, services, and hair care resources across the site.',
    href: '/search',
    type: 'Page',
    tags: ['search', 'resources'],
  },
];

export function getSearchIndex(): SearchItem[] {
  const posts = getAllPosts().map((post) => ({
    id: `post-${post.slug}`,
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    type: 'Blog' as const,
    tags: [post.category, post.author],
  }));

  return [...staticPages, ...posts];
}
