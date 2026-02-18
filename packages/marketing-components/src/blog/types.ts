/**
 * @file packages/marketing-components/src/blog/types.ts
 * @role types
 * @summary Blog display types — compatible with @repo/features BlogPost
 */

export interface BlogAuthor {
  name: string;
  slug?: string;
  avatar?: string;
}

export interface BlogCategory {
  slug: string;
  label: string;
}

/** Blog post for display — extends features BlogPost shape */
export interface BlogPostDisplay {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  date: string;
  author: string | BlogAuthor;
  category?: string;
  categories?: BlogCategory[];
  tags?: string[];
  featuredImage?: string;
  readingTime?: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
