// File: features/blog/lib/blog.ts  [TRACE:FILE=features.blog.blog]
// Purpose: Blog content management system providing MDX parsing, frontmatter validation,
//          and content indexing for hair salon blog. Handles blog post discovery, metadata
//          extraction, and search integration with caching for performance.
//
// Exports / Entry: getAllPosts, getPostBySlug, getPostSlugs, BlogPost type
// Used by: Blog pages, search functionality, and any blog-related features
//
// Invariants:
// - All blog posts must have valid frontmatter with required fields
// - Date parsing must be consistent and handle timezone issues
// - Content directory must exist and be readable
// - MDX parsing must handle syntax errors gracefully
// - Search index must include all published posts
//
// Status: @public
// Features:
// - [FEAT:BLOG] MDX blog post parsing and management
// - [FEAT:SEARCH] Blog content integration with site search
// - [FEAT:PERFORMANCE] Cached content parsing and indexing
// - [FEAT:CONTENT] Frontmatter validation and type safety
// - [FEAT:SEO] Automatic reading time and metadata extraction

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { cache } from 'react';
import { z } from 'zod';
import siteConfig from '@/site.config';

// [TRACE:CONST=features.blog.postsDirectory]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Content directory path - resolves to content/blog from project root for MDX files.
const postsDirectory = path.join(process.cwd(), 'content/blog');

// [TRACE:CONST=features.blog.datePattern]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Date validation regex - ensures YYYY-MM-DD format for consistent frontmatter dates.
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

// [TRACE:FUNC=features.blog.isNonEmptyString]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: String validation - ensures non-empty strings for frontmatter field validation.
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

// [TRACE:FUNC=features.blog.normalizeBlogDate]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEO]
// NOTE: Date normalization - validates and normalizes dates while preventing timezone rollovers.
const normalizeBlogDate = (value: unknown): { value: string; date: Date } | null => {
  if (value instanceof Date) {
    const isoDate = value.toISOString().slice(0, 10);
    return { value: isoDate, date: value };
  }

  if (!isNonEmptyString(value) || !datePattern.test(value)) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  // WHY: Validate that the parsed date matches the frontmatter string to avoid rollover dates.
  if (parsed.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return { value, date: parsed };
};

// [TRACE:SCHEMA=features.blog.blogFrontmatterSchema]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:SEO]
// NOTE: Frontmatter validation schema - enforces required fields and content standards for blog posts.
const blogFrontmatterSchema = z.object({
  title: z.string().min(2).max(200).trim(),
  description: z.string().min(10).max(300).trim(),
  date: z.union([z.string(), z.date()]),
  author: z.string().min(2).max(80).trim().optional(),
  category: z.string().min(2).max(40).trim().optional(),
  featured: z.boolean().optional(),
});

// [TRACE:FUNC=features.blog.formatFrontmatterErrors]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Error formatting - converts Zod errors to JSON for logging and debugging.
const formatFrontmatterErrors = (error: z.ZodError) => JSON.stringify(error.flatten().fieldErrors);

// [TRACE:FUNC=features.blog.reportFrontmatterError]
// [FEAT:BLOG] [FEAT:CONTENT]
// NOTE: Error reporting - logs frontmatter validation errors with context for debugging.
const reportFrontmatterError = (slug: string, details: string) => {
  const message = `Invalid frontmatter for blog post "${slug}": ${details}`;

  if (process.env.NODE_ENV === 'production') {
    console.warn(message);
    return;
  }

  throw new Error(message);
};

const buildPost = (
  slug: string,
  data: Record<string, unknown>,
  content: string
): BlogPost | null => {
  const parsed = blogFrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    reportFrontmatterError(slug, formatFrontmatterErrors(parsed.error));
    return null;
  }

  const normalizedDate = normalizeBlogDate(parsed.data.date);

  if (!normalizedDate) {
    reportFrontmatterError(slug, 'date must be YYYY-MM-DD and a valid calendar date');
    return null;
  }

  return {
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    date: normalizedDate.value,
    author: parsed.data.author ?? `${siteConfig.name} Team`,
    category: parsed.data.category ?? 'Hair Care',
    readingTime: readingTime(content).text,
    content,
    featured: parsed.data.featured ?? false,
  };
};

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
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readingTime: string;
  content: string;
  featured?: boolean;
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
const readAllPosts = cache((): BlogPost[] => {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return buildPost(slug, data, content);
    })
    .filter((post): post is BlogPost => post !== null);

  // Sort posts by date
  return allPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
});

export function getAllPosts(): BlogPost[] {
  return readAllPosts();
}

/**
 * Get a single blog post by its slug.
 *
 * @param slug - URL slug (filename without .mdx extension)
 * @returns BlogPost object or undefined if not found
 *
 * @example
 * const post = getPostBySlug('hair-care-tips-summer')
 * if (!post) {
 *   notFound() // Next.js 404
 * }
 */
const readPostBySlug = cache((slug: string): BlogPost | undefined =>
  readAllPosts().find((post) => post.slug === slug)
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return readPostBySlug(slug);
}

/**
 * Get posts marked as featured.
 * Used for homepage highlights.
 *
 * @returns Array of posts where featured === true
 */
export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

/**
 * Get posts by category.
 *
 * @param category - Category name to filter by (case-sensitive)
 * @returns Array of posts in the specified category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

/**
 * Get all unique categories.
 * Categories are extracted from post frontmatter.
 *
 * @returns Sorted array of unique category names
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map((post) => post.category);
  return Array.from(new Set(categories)).sort();
}
