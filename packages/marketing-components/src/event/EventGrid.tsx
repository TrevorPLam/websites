'use client';

/**
 * @file packages/marketing-components/src/event/EventGrid.tsx
 * @role component
 * @summary Event grid layout
 */

import { Container, Section } from '@repo/ui';
import { EventCard } from './EventCard';
import type { Event } from './types';

export interface EventGridProps {
  events: Event[];
  title?: string;
  eventHref?: (event: Event) => string;
  onRegister?: (event: Event) => void;
  className?: string;
}

export function EventGrid({ events, title, eventHref, onRegister, className }: EventGridProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={eventHref?.(event)}
              onRegister={onRegister}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
