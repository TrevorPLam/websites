/**
 * @file packages/marketing-components/src/event/EventCalendar.tsx
 * @role component
 * @summary Basic event calendar (month view stub)
 *
 * Full calendar integration would use @repo/ui Calendar if available.
 * This provides a simple list-by-date view.
 */

import { Container, Section } from '@repo/ui';
import type { Event } from './types';

export interface EventCalendarProps {
  events: Event[];
  title?: string;
  eventHref?: (event: Event) => string;
  onRegister?: (event: Event) => void;
  className?: string;
}

function groupByDate(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const key = e.startDate;
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return map;
}

export function EventCalendar({
  events,
  title,
  eventHref,
  onRegister,
  className,
}: EventCalendarProps) {
  const byDate = groupByDate(events);
  const dates = Array.from(byDate.keys()).sort();

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div className="space-y-8">
          {dates.map((date) => (
            <div key={date}>
              <h3 className="mb-4 text-lg font-semibold text-muted-foreground">{date}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(byDate.get(date) ?? []).map((event) => (
                  <a
                    key={event.id}
                    href={eventHref?.(event) ?? `/events/${event.slug}`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <h4 className="font-semibold">{event.title}</h4>
                    {event.location && (
                      <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
                    )}
                    {onRegister && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRegister(event);
                        }}
                        className="mt-4 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                      >
                        Register
                      </button>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
