/**
 * @file packages/marketing-components/src/services/ServiceGrid.tsx
 * @role component
 * @summary Service card grid layout
 *
 * Responsive grid layout for displaying services in cards.
 */

import { Card } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Service } from './types';

export interface ServiceGridProps {
  /** Services to display */
  services: Service[];
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Service grid component with responsive columns.
 *
 * @param props - ServiceGridProps
 * @returns Service grid component
 */
export function ServiceGrid({
  services,
  columns = 3,
  title,
  description,
  className,
}: ServiceGridProps) {
  const gridClasses = cn(
    'grid gap-6',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className={gridClasses}>
          {services.map((service) => (
            <Card key={service.id} variant="service">
              {service.image && (
                <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {service.icon && <div className="mb-4">{service.icon}</div>}
              <h3 className="text-xl font-semibold">{service.name}</h3>
              {service.description && (
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
              )}
              {service.price && (
                <div className="mt-4 text-lg font-bold">{service.price}</div>
              )}
              {service.cta && (
                <div className="mt-4">
                  <a
                    href={service.cta.href}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {service.cta.label}
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
