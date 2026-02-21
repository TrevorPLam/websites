'use client';

/**
 * @file packages/marketing-components/src/location/LocationCard.tsx
 * @role component
 * @summary Single location card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Location } from './types';

export interface LocationCardProps {
  location: Location;
  className?: string;
}

export function LocationCard({ location, className }: LocationCardProps) {
  const address = [location.address, location.city, location.state, location.zip]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{location.name}</h3>
        {address && <p className="mt-1 text-sm text-muted-foreground">{address}</p>}
        {location.phone && (
          <p className="mt-1 text-sm text-muted-foreground">
            <a href={`tel:${location.phone}`} className="hover:underline">
              {location.phone}
            </a>
          </p>
        )}
        {location.directionsUrl && (
          <a
            href={location.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Get directions
          </a>
        )}
      </div>
    </Card>
  );
}
