'use client';

/**
 * @file packages/marketing-components/src/resource/ResourceGrid.tsx
 * @role component
 * @summary Grid of resource cards
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { ResourceCard } from './ResourceCard';
import type { Resource } from './types';

export interface ResourceGridProps {
  title?: string;
  resources: Resource[];
  columns?: 2 | 3 | 4;
  onDownload?: (resource: Resource) => void;
  className?: string;
}

export function ResourceGrid({
  title,
  resources,
  columns = 3,
  onDownload,
  className,
}: ResourceGridProps) {
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
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onDownload={onDownload} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
