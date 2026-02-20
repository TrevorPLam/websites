'use client';

/**
 * @file packages/marketing-components/src/event/EventRegistration.tsx
 * @role component
 * @summary Event registration form section
 *
 * Form structure only — submission handler passed via props.
 */

import { Container, Section } from '@repo/ui';
import { Input, Label } from '@repo/ui';
import type { Event } from './types';

export interface EventRegistrationProps {
  event: Event;
  onSubmit?: (data: { name: string; email: string }) => void;
  className?: string;
}

export function EventRegistration({ event, onSubmit, className }: EventRegistrationProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    if (name && email && onSubmit) {
      onSubmit({ name, email });
    }
  };

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold">Register for {event.title}</h2>
          <p className="mt-2 text-muted-foreground">{event.startDate}</p>
          {event.location && <p className="mt-1 text-muted-foreground">{event.location}</p>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="reg-name">Name</Label>
              <Input id="reg-name" name="name" type="text" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" name="email" type="email" required className="mt-1" />
            </div>
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Register
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
