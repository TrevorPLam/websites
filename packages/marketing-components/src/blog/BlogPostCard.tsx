/**
 * @file packages/marketing-components/src/blog/BlogPostCard.tsx
 * @role component
 * @summary Single blog post card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BlogPostDisplay } from './types';

export interface BlogPostCardProps {
  post: BlogPostDisplay;
  href?: string;
  variant?: 'card' | 'list';
  className?: string;
}

export function BlogPostCard({ post, href, variant = 'card', className }: BlogPostCardProps) {
  const link = href ?? `/blog/${post.slug}`;
  const authorName = typeof post.author === 'string' ? post.author : post.author.name;
  const isList = variant === 'list';

  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow hover:shadow-md',
        isList && 'flex flex-row',
        className
      )}
    >
      <a href={link} className={cn('block', isList && 'flex flex-1 gap-4')}>
        {post.featuredImage && (
          <div
            className={cn(
              'overflow-hidden bg-muted',
              isList ? 'aspect-square w-40 shrink-0' : 'aspect-video w-full'
            )}
          >
            <img
              src={post.featuredImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className={cn('p-4', isList && 'flex flex-1 flex-col')}>
          <h3 className="font-semibold text-foreground">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt ?? post.description}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span>{authorName}</span>
            {post.category && <span>{post.category}</span>}
          </div>
        </div>
      </a>
    </Card>
  );
}
