/**
 * @file packages/marketing-components/src/location/LocationList.tsx
 * @role component
 * @summary List of location cards
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { LocationCard } from './LocationCard';
import type { Location } from './types';

export interface LocationListProps {
  title?: string;
  locations: Location[];
  className?: string;
}

export function LocationList({ title, locations, className }: LocationListProps) {
  return (
    <Section className={cn(className)}>
      <Container>
        {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
