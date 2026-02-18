/**
 * @file packages/marketing-components/src/blog/BlogMasonry.tsx
 * @role component
 * @summary Blog posts in masonry layout
 */

import { Container, Section } from '@repo/ui';
import { Masonry } from '@repo/ui';
import { BlogPostCard } from './BlogPostCard';
import { BlogPagination } from './BlogPagination';
import type { BlogPostDisplay, PaginationConfig } from './types';

export interface BlogMasonryProps {
  posts: BlogPostDisplay[];
  title?: string;
  postHref?: (post: BlogPostDisplay) => string;
  pagination?: PaginationConfig;
  columns?: number;
  className?: string;
}

export function BlogMasonry({
  posts,
  title,
  postHref,
  pagination,
  columns = 3,
  className,
}: BlogMasonryProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <Masonry columns={columns} gap={24}>
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              href={postHref?.(post)}
            />
          ))}
        </Masonry>
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <BlogPagination {...pagination} />
          </div>
        )}
      </Container>
    </Section>
  );
}
