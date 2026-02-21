'use client';

/**
 * @file packages/marketing-components/src/menu/MenuList.tsx
 * @role component
 * @summary List of menu categories
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { MenuCard } from './MenuCard';
import type { MenuCategory } from './types';

export interface MenuListProps {
  title?: string;
  categories: MenuCategory[];
  className?: string;
}

export function MenuList({ title, categories, className }: MenuListProps) {
  return (
    <Section className={cn(className)}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className="space-y-8">
          {categories.map((cat) => (
            <MenuCard key={cat.id} category={cat} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
