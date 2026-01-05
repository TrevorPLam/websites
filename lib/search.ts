import { getAllPosts } from '@/lib/blog'

export type SearchItem = {
  id: string
  title: string
  description: string
  href: string
  type: 'Page' | 'Blog'
  tags?: string[]
}

const staticPages: SearchItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Overview of our marketing services, results, and client success stories.',
    href: '/',
    type: 'Page',
    tags: ['marketing', 'services', 'agency'],
  },
  {
    id: 'page-services',
    title: 'Services',
    description: 'Explore SEO, content, social media, and email marketing services.',
    href: '/services',
    type: 'Page',
    tags: ['seo', 'content', 'social', 'email'],
  },
  {
    id: 'page-pricing',
    title: 'Pricing',
    description: 'Review marketing packages, deliverables, and pricing tiers.',
    href: '/pricing',
    type: 'Page',
    tags: ['pricing', 'packages'],
  },
  {
    id: 'page-case-studies',
    title: 'Case Studies',
    description: 'See how we deliver measurable growth for clients.',
    href: '/case-studies',
    type: 'Page',
    tags: ['results', 'growth'],
  },
  {
    id: 'page-blog',
    title: 'Blog',
    description: 'Marketing insights, trends, and strategies from our team.',
    href: '/blog',
    type: 'Page',
    tags: ['blog', 'insights'],
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
    description: 'Learn about the team, mission, and marketing approach.',
    href: '/about',
    type: 'Page',
    tags: ['team', 'mission'],
  },
]

export function getSearchIndex(): SearchItem[] {
  const posts = getAllPosts().map((post) => ({
    id: `post-${post.slug}`,
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    type: 'Blog' as const,
    tags: [post.category, post.author],
  }))

  return [...staticPages, ...posts]
}
