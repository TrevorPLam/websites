/**
 * @file packages/marketing-components/src/event/EventTimeline.tsx
 * @role component
 * @summary Event timeline layout
 */

import { Container, Section } from '@repo/ui';
import { EventCard } from './EventCard';
import type { Event } from './types';

export interface EventTimelineProps {
  events: Event[];
  title?: string;
  eventHref?: (event: Event) => string;
  onRegister?: (event: Event) => void;
  className?: string;
}

export function EventTimeline({
  events,
  title,
  eventHref,
  onRegister,
  className,
}: EventTimelineProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="relative space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-border md:before:left-8">
          {events.map((event, i) => (
            <div key={event.id} className="relative flex gap-6 pl-12 md:pl-16">
              <div className="absolute left-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:left-4">
                {i + 1}
              </div>
              <div className="flex-1">
                <EventCard
                  event={event}
                  href={eventHref?.(event)}
                  onRegister={onRegister}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
