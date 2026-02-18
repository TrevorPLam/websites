/**
 * @file packages/marketing-components/src/blog/RelatedPosts.tsx
 * @role component
 * @summary Related posts block
 */

import { Container, Section } from '@repo/ui';
import { BlogPostCard } from './BlogPostCard';
import type { BlogPostDisplay } from './types';

export interface RelatedPostsProps {
  posts: BlogPostDisplay[];
  title?: string;
  postHref?: (post: BlogPostDisplay) => string;
  className?: string;
}

export function RelatedPosts({
  posts,
  title = 'Related Posts',
  postHref,
  className,
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <Section className={className}>
      <Container>
        <h2 className="mb-6 text-2xl font-bold">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              href={postHref?.(post)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
