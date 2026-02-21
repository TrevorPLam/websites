// File: packages/features/src/blog/lib/blog-mdx-source.ts  [TRACE:FILE=packages.features.blog.blogMdxSource]
// Purpose: MDX file-based content source adapter providing blog post discovery, parsing,
//          and indexing from local MDX files. Implements BlogContentSource interface
//          for MDX content management with frontmatter validation and caching.
//
// Exports / Entry: createMdxContentSource function
// Used by: Blog feature when configured with MDX source type
//
// Invariants:
// - All MDX files must have valid frontmatter with required fields
// - Date parsing must be consistent and handle timezone issues
// - Content directory must exist and be readable
// - MDX parsing must handle syntax errors gracefully
// - Slug generation must be collision-safe
//
// Status: @public
// Features:
// - [FEAT:BLOG] MDX blog post parsing and management
// - [FEAT:CONTENT] File-based content discovery
// - [FEAT:PERFORMANCE] Cached content parsing and indexing
// - [FEAT:VALIDATION] Frontmatter validation and type safety
// - [FEAT:SEO] Automatic reading time and metadata extraction

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { cache } from 'react';
import { z } from 'zod';
import type {
  BlogContentSource,
  BlogContentSourceConfig,
  MdxSourceOptions,
} from './blog-content-source';
import type { BlogPost } from './blog-types';
import { createCanonicalSlug, normalizeSlug } from './blog-content-source';

/**
 * Date validation regex (YYYY-MM-DD format)
 */
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates non-empty string
 */
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Normalizes blog date to YYYY-MM-DD format
 * Prevents timezone rollovers and validates date format
 */
function normalizeBlogDate(value: unknown): { value: string; date: Date } | null {
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

  // Validate that parsed date matches frontmatter string to avoid rollover dates
  if (parsed.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return { value, date: parsed };
}

/**
 * Frontmatter validation schema
 */
const blogFrontmatterSchema = z.object({
  title: z.string().min(2).max(200).trim(),
  description: z.string().min(10).max(300).trim(),
  date: z.union([z.string(), z.date()]),
  author: z.string().min(2).max(80).trim().optional(),
  category: z.string().min(2).max(40).trim().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Formats Zod errors for logging
 */
function formatFrontmatterErrors(error: z.ZodError): string {
  return JSON.stringify(error.flatten().fieldErrors);
}

/**
 * Reports frontmatter validation errors
 */
function reportFrontmatterError(slug: string, details: string): void {
  const message = `Invalid frontmatter for blog post "${slug}": ${details}`;

  if (process.env.NODE_ENV === 'production') {
    console.warn(message);
    return;
  }

  throw new Error(message);
}

/**
 * Builds BlogPost from parsed frontmatter and content
 */
function buildPost(
  slug: string,
  data: Record<string, unknown>,
  content: string,
  defaultAuthor: string,
  defaultCategory: string
): BlogPost | null {
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
    author: parsed.data.author ?? defaultAuthor,
    category: parsed.data.category ?? defaultCategory,
    readingTime: readingTime(content).text,
    content,
    featured: parsed.data.featured ?? false,
    tags: parsed.data.tags,
  };
}

/**
 * Creates MDX file-based content source adapter
 */
// [TRACE:FUNC=packages.features.blog.createMdxContentSource]
// [FEAT:BLOG] [FEAT:CONTENT] [FEAT:PERFORMANCE]
// NOTE: MDX source factory - creates content source adapter for MDX file-based blogs with caching.
export function createMdxContentSource(config: BlogContentSourceConfig): BlogContentSource {
  const options = config.options as MdxSourceOptions;
  const contentDirectory = path.join(process.cwd(), options.contentDirectory);
  const extension = options.extension || '.mdx';
  const defaultAuthor = config.defaultAuthor || 'Author';
  const defaultCategory = config.defaultCategory || 'General';

  // Cached post reading function
  const readAllPosts = cache((): BlogPost[] => {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPosts: BlogPost[] = [];
    const existingSlugs: string[] = [];

    for (const fileName of fileNames) {
      if (!fileName.endsWith(extension)) {
        continue;
      }

      // Generate slug from filename or use filename as base
      const baseSlug = fileName.replace(new RegExp(`\\${extension}$`), '');
      const slug = normalizeSlug(baseSlug);

      // Handle slug collisions
      const finalSlug = createCanonicalSlug(slug, existingSlugs);
      existingSlugs.push(finalSlug);

      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const post = buildPost(finalSlug, data, content, defaultAuthor, defaultCategory);
      if (post) {
        allPosts.push(post);
      }
    }

    // Sort posts by date (newest first)
    return allPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  });

  return {
    async getAllPosts(): Promise<BlogPost[]> {
      return readAllPosts();
    },

    async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
      const normalizedSlug = normalizeSlug(slug);
      const posts = await this.getAllPosts();
      return posts.find((post) => post.slug === normalizedSlug);
    },

    async getPostSlugs(): Promise<string[]> {
      const posts = await this.getAllPosts();
      return posts.map((post) => post.slug);
    },

    async getPostsByCategory(category: string): Promise<BlogPost[]> {
      const posts = await this.getAllPosts();
      return posts.filter((post) => post.category === category);
    },

    async getAllCategories(): Promise<string[]> {
      const posts = await this.getAllPosts();
      const categories = posts.map((post) => post.category);
      return Array.from(new Set(categories)).sort();
    },

    async getFeaturedPosts(): Promise<BlogPost[]> {
      const posts = await this.getAllPosts();
      return posts.filter((post) => post.featured);
    },
  };
}
