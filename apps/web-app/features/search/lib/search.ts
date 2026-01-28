/**
 * Search index generation for site-wide search.
 *
 * @module lib/search
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Build-time search index generation. Combines static pages
 * and blog posts into a searchable array for client-side filtering.
 *
 * **ARCHITECTURE**:
 * - Static pages: HARDCODED in `staticPages` array (manual update required!)
 * - Blog posts: Dynamic from lib/blog.ts
 * - Consumed by: SearchDialog, SearchPage components
 *
 * **MAINTENANCE CRITICAL**: When adding new pages:
 * 1. Add entry to `staticPages` array in this file
 * 2. Update app/sitemap.ts
 * 3. Test search functionality
 *
 * **AI ITERATION HINTS**:
 * - Adding a page? Add to staticPages array with id, title, description, href, type, tags
 * - Tags improve search relevance (include keywords users might search for)
 * - type: 'Page' for static pages, 'Blog' for posts
 * - Blog posts auto-included via getAllPosts()
 *
 * **SEARCH ALGORITHM** (client-side in SearchDialog):
 * - Searches: title + description + tags (case-insensitive)
 * - No fuzzy matching (exact substring only)
 * - Results limited to 6 when no query, unlimited with query
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [ ] Generate staticPages from app/ filesystem scan
 * - [ ] Add fuzzy search (Fuse.js or similar)
 * - [ ] Add search analytics tracking
 * - [ ] Add case studies to search index
 *
 * **EDGE RUNTIME**: Uses fs via lib/blog.ts.
 * Routes consuming this MUST be force-static.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Combine static pages and blog posts into searchable index
 * - Provide structured data for SearchDialog component
 * - Enable client-side filtering by title, description, tags
 *
 * **Architecture:**
 * - Static pages: Hardcoded in this file (update when adding pages)
 * - Blog posts: Dynamically loaded from lib/blog.ts
 * - Generated at: Build time (SSG)
 *
 * **Usage:**
 * ```typescript
 * import { getSearchIndex } from '@/lib/search'
 *
 * const items = getSearchIndex()
 * // Pass to SearchDialog component
 * ```
 *
 * **When to Update:**
 * - Add to `staticPages` array when creating new static pages
 * - Blog posts are automatically included
 */

import { getAllPosts } from '@/lib/blog'

/**
 * Search index item structure.
 * 
 * @property id - Unique identifier (prefixed with 'page-' or 'post-')
 * @property title - Display title
 * @property description - Search snippet / meta description
 * @property href - URL path
 * @property type - 'Page' for static pages, 'Blog' for posts
 * @property tags - Optional keywords for search matching
 */
export type SearchItem = {
  id: string
  title: string
  description: string
  href: string
  type: 'Page' | 'Blog'
  tags?: string[]
}

/**
 * Static pages registry.
 * 
 * **Maintenance:**
 * When adding a new static page to the site:
 * 1. Create the page in app/
 * 2. Add an entry here with appropriate metadata
 * 3. Update sitemap.ts if needed
 * 
 * @internal
 */
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
