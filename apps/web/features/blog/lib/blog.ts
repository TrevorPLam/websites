/**
 * Blog post management module.
 *
 * @module lib/blog
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: File-based blog CMS. Reads MDX files from content/blog/
 * at build time (SSG). No runtime filesystem access in production.
 *
 * **EDGE RUNTIME WARNING**: This file uses Node.js `fs` module.
 * Routes using this MUST set `export const dynamic = 'force-static'`
 * or will fail on Cloudflare Pages edge runtime.
 *
 * **DATA FLOW**:
 * ```
 * content/blog/*.mdx → getAllPosts() → BlogPost[]
 *                   → getPostBySlug(slug) → BlogPost | undefined
 * ```
 *
 * **FRONTMATTER SCHEMA** (see content/AGENTS.md for details):
 * ```yaml
 * title: string        # Required
 * description: string  # Required, used for SEO meta
 * date: YYYY-MM-DD     # Required, used for sorting
 * author: string       # Optional, defaults to team name
 * category: string     # Optional, defaults to "Marketing"
 * featured: boolean    # Optional, shows on homepage
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding frontmatter field? Update BlogPost interface AND content/AGENTS.md
 * - Posts sorted by date descending (newest first)
 * - Featured posts: filter with `posts.filter(p => p.featured)`
 * - Empty blog/ folder returns [] (doesn't throw)
 *
 * **CONSUMERS**:
 * - app/blog/page.tsx — listing page
 * - app/blog/[slug]/page.tsx — individual post
 * - app/sitemap.ts — sitemap generation
 * - lib/search.ts — search index
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [ ] Add caching layer for dev mode (re-reads on every request)
 * - [ ] Expand frontmatter validation with Zod
 * - [ ] Add prev/next post navigation helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Parse MDX blog posts from the filesystem
 * - Extract frontmatter metadata
 * - Calculate reading time
 * - Provide sorted, filtered access to posts
 *
 * **Data Source:**
 * - Location: `content/blog/*.mdx`
 * - Format: MDX files with YAML frontmatter
 * - Parsed at: Build time (SSG)
 *
 * **Frontmatter Schema:**
 * ```yaml
 * ---
 * title: string        # Required: Post title
 * description: string  # Required: SEO description
 * date: string         # Required: YYYY-MM-DD format
 * author: string       # Optional: Defaults to "Your Dedicated Marketer Team"
 * category: string     # Optional: Defaults to "Marketing"
 * featured: boolean    # Optional: Defaults to false
 * ---
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { getAllPosts, getPostBySlug } from '@/lib/blog'
 *
 * // Get all posts sorted by date
 * const posts = getAllPosts()
 *
 * // Get single post
 * const post = getPostBySlug('my-post-slug')
 * ```
 *
 * @see content/AGENTS.md for content authoring guidelines
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

/** Absolute path to blog content directory */
const postsDirectory = path.join(process.cwd(), 'content/blog')
const datePattern = /^\d{4}-\d{2}-\d{2}$/

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const normalizeBlogDate = (value: unknown): { value: string; date: Date } | null => {
  if (value instanceof Date) {
    const isoDate = value.toISOString().slice(0, 10)
    return { value: isoDate, date: value }
  }

  if (!isNonEmptyString(value) || !datePattern.test(value)) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  // WHY: Validate that the parsed date matches the frontmatter string to avoid rollover dates.
  if (parsed.toISOString().slice(0, 10) !== value) {
    return null
  }

  return { value, date: parsed }
}

const buildPost = (
  slug: string,
  data: Record<string, unknown>,
  content: string
): BlogPost | null => {
  const hasRequiredFields =
    Object.hasOwn(data, 'title') &&
    Object.hasOwn(data, 'description') &&
    Object.hasOwn(data, 'date')

  if (!hasRequiredFields) {
    // WHY: Require explicit frontmatter fields to avoid silently accepting malformed posts.
    return null
  }

  const title = isNonEmptyString(data.title) ? data.title : null
  const description = isNonEmptyString(data.description) ? data.description : null
  const normalizedDate = normalizeBlogDate(data.date)

  if (!title || !description || !normalizedDate) {
    // WHY: Skip invalid frontmatter to keep blog rendering stable.
    return null
  }

  return {
    slug,
    title,
    description,
    date: normalizedDate.value,
    author: isNonEmptyString(data.author) ? data.author : 'Your Dedicated Marketer Team',
    category: isNonEmptyString(data.category) ? data.category : 'Marketing',
    readingTime: readingTime(content).text,
    content,
    featured: typeof data.featured === 'boolean' ? data.featured : false,
  }
}

/**
 * Blog post data structure.
 * 
 * @property slug - URL-safe identifier (derived from filename)
 * @property title - Post title from frontmatter
 * @property description - SEO description from frontmatter
 * @property date - Publication date (YYYY-MM-DD)
 * @property author - Author name (defaults to team name)
 * @property category - Post category for filtering
 * @property readingTime - Calculated reading time (e.g., "5 min read")
 * @property content - Raw MDX content (without frontmatter)
 * @property featured - Whether to show on homepage
 */
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  readingTime: string
  content: string
  featured?: boolean
}

/**
 * Get all blog posts sorted by date (newest first).
 * 
 * **Behavior:**
 * - Reads all .mdx files from content/blog/
 * - Parses frontmatter with gray-matter
 * - Calculates reading time
 * - Returns empty array if directory doesn't exist
 * 
 * **Performance:**
 * - Called at build time for SSG
 * - Results are cached by Next.js during build
 * 
 * @returns Array of blog posts sorted by date descending
 * 
 * @example
 * const posts = getAllPosts()
 * // Use in getStaticProps or generateStaticParams
 */
export function getAllPosts(): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return buildPost(slug, data, content)
    })
    .filter((post): post is BlogPost => post !== null)

  // Sort posts by date
  return allPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

/**
 * Get a single blog post by its slug.
 * 
 * @param slug - URL slug (filename without .mdx extension)
 * @returns BlogPost object or undefined if not found
 * 
 * @example
 * const post = getPostBySlug('seo-basics-small-business')
 * if (!post) {
 *   notFound() // Next.js 404
 * }
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return buildPost(slug, data, content) ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Get posts marked as featured.
 * Used for homepage highlights.
 * 
 * @returns Array of posts where featured === true
 */
export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured)
}

/**
 * Get posts by category.
 * 
 * @param category - Category name to filter by (case-sensitive)
 * @returns Array of posts in the specified category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category)
}

/**
 * Get all unique categories.
 * Categories are extracted from post frontmatter.
 * 
 * @returns Sorted array of unique category names
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts.map((post) => post.category)
  return Array.from(new Set(categories)).sort()
}
