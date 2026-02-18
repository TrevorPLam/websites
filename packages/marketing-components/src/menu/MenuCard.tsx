/**
 * @file packages/marketing-components/src/menu/MenuCard.tsx
 * @role component
 * @summary Single menu category card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { MenuCategory } from './types';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export interface MenuCardProps {
  category: MenuCategory;
  className?: string;
}

export function MenuCard({ category, className }: MenuCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        )}
        <ul className="mt-4 space-y-3">
          {category.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 border-b border-border pb-3 last:border-0">
              <div>
                <span className="font-medium">{item.name}</span>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
                {item.dietaryTags && item.dietaryTags.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.dietaryTags.join(', ')}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-medium">
                {formatPrice(item.price)}
                {item.priceUnit ? ` / ${item.priceUnit}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
