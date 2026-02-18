/**
 * @file packages/marketing-components/src/stats/StatsCounter.tsx
 * @role component
 * @summary Statistics counter section
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';

export interface StatItem {
  value: string | number;
  label: string;
  description?: string;
}

export interface StatsCounterProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Stat items */
  stats: StatItem[];
  /** Layout */
  layout?: 'horizontal' | 'centered';
  /** Custom CSS class name */
  className?: string;
}

export function StatsCounter({
  title,
  description,
  stats,
  layout = 'horizontal',
  className,
}: StatsCounterProps) {
  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <div
          className={cn(
            'grid gap-8',
            layout === 'horizontal' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            layout === 'centered' && 'grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {stats.map((stat, i) => (
            <div key={i} className={layout === 'centered' ? 'text-center' : ''}>
              <div className="text-4xl font-bold sm:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</div>
              {stat.description && (
                <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
