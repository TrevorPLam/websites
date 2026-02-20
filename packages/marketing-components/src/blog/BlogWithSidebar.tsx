'use client';

/**
 * @file packages/marketing-components/src/blog/BlogWithSidebar.tsx
 * @role component
 * @summary Blog layout with sidebar (categories, tags, etc.)
 */

import { Container, Section } from '@repo/ui';
import { BlogPostCard } from './BlogPostCard';
import { BlogPagination } from './BlogPagination';
import { cn } from '@repo/utils';
import type { BlogPostDisplay, PaginationConfig } from './types';

export interface BlogWithSidebarProps {
  posts: BlogPostDisplay[];
  title?: string;
  postHref?: (post: BlogPostDisplay) => string;
  pagination?: PaginationConfig;
  /** Sidebar content (categories, tags, newsletter, etc.) */
  sidebar?: React.ReactNode;
  className?: string;
}

export function BlogWithSidebar({
  posts,
  title,
  postHref,
  pagination,
  sidebar,
  className,
}: BlogWithSidebarProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} href={postHref?.(post)} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <BlogPagination {...pagination} />
              </div>
            )}
          </div>
          {sidebar && (
            <aside className={cn('space-y-6 lg:sticky lg:top-8 lg:self-start')}>{sidebar}</aside>
          )}
        </div>
      </Container>
    </Section>
  );
}
