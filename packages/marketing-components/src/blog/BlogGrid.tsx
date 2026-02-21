'use client';

/**
 * @file packages/marketing-components/src/blog/BlogGrid.tsx
 * @role component
 * @summary Blog posts in responsive grid
 */

import { Container, Section } from '@repo/ui';
import { BlogPostCard } from './BlogPostCard';
import { BlogPagination } from './BlogPagination';
import type { BlogPostDisplay, PaginationConfig } from './types';

export interface BlogGridProps {
  posts: BlogPostDisplay[];
  title?: string;
  postHref?: (post: BlogPostDisplay) => string;
  pagination?: PaginationConfig;
  className?: string;
}

export function BlogGrid({ posts, title, postHref, pagination, className }: BlogGridProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} href={postHref?.(post)} />
          ))}
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <BlogPagination {...pagination} />
          </div>
        )}
      </Container>
    </Section>
  );
}
