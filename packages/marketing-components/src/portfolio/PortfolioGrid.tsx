/**
 * @file packages/marketing-components/src/portfolio/PortfolioGrid.tsx
 * @role component
 * @summary Grid of portfolio items
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { PortfolioCard } from './PortfolioCard';
import type { PortfolioItem } from './types';

export interface PortfolioGridProps {
  title?: string;
  items: PortfolioItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function PortfolioGrid({
  title,
  items,
  columns = 3,
  className,
}: PortfolioGridProps) {
  const gridClasses = cn(
    'grid gap-4',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className={gridClasses}>
          {items.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
