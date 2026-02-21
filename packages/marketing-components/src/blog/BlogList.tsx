'use client';

/**
 * @file packages/marketing-components/src/blog/BlogList.tsx
 * @role component
 * @summary Blog posts in list layout
 */

import { Container, Section } from '@repo/ui';
import { BlogPostCard } from './BlogPostCard';
import { BlogPagination } from './BlogPagination';
import { cn } from '@repo/utils';
import type { BlogPostDisplay, PaginationConfig } from './types';

export interface BlogListProps {
  posts: BlogPostDisplay[];
  title?: string;
  postHref?: (post: BlogPostDisplay) => string;
  pagination?: PaginationConfig;
  className?: string;
}

export function BlogList({ posts, title, postHref, pagination, className }: BlogListProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className={cn('flex flex-col gap-6')}>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} href={postHref?.(post)} variant="list" />
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
