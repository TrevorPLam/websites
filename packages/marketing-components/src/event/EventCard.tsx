'use client';

/**
 * @file packages/marketing-components/src/event/EventCard.tsx
 * @role component
 * @summary Single event card
 */

import { Card } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Event } from './types';

export interface EventCardProps {
  event: Event;
  href?: string;
  onRegister?: (event: Event) => void;
  className?: string;
}

export function EventCard({ event, href, onRegister, className }: EventCardProps) {
  const link = href ?? `/events/${event.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block">
        {event.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={event.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{event.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{event.startDate}</p>
          {event.location && <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>}
          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
          )}
        </div>
      </a>
      {onRegister && (
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRegister(event);
            }}
            className="min-h-[44px] w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Register
          </button>
        </div>
      )}
    </Card>
  );
}
