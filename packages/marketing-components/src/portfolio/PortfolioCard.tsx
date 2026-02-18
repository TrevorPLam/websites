/**
 * @file packages/marketing-components/src/portfolio/PortfolioCard.tsx
 * @role component
 * @summary Single portfolio item card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { PortfolioItem } from './types';

export interface PortfolioCardProps {
  item: PortfolioItem;
  href?: string;
  className?: string;
}

export function PortfolioCard({ item, href, className }: PortfolioCardProps) {
  const link = href ?? item.href ?? `/portfolio/${item.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block">
        {item.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={item.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          {item.category && (
            <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
          )}
          {item.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </a>
    </Card>
  );
}
