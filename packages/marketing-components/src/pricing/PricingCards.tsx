'use client';

/**
 * @file packages/marketing-components/src/pricing/PricingCards.tsx
 * @role component
 * @summary Tiered pricing plan cards
 */

import { Card } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { PricingPlan } from './types';

export interface PricingCardsProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Pricing plans */
  plans: PricingPlan[];
  /** Custom CSS class name */
  className?: string;
}

export function PricingCards({ title, description, plans, className }: PricingCardsProps) {
  return (
    <Section className={className}>
      <Container>
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              variant={plan.popular ? 'service' : 'default'}
              className={cn('flex flex-col p-6', plan.popular && 'ring-2 ring-primary')}
            >
              {plan.popular && (
                <span className="mb-4 inline-block text-sm font-medium text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
              </div>
              {plan.description && (
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              )}
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    {f.included === true ? '✓' : f.included === false ? '✗' : f.included} {f.name}
                  </li>
                ))}
              </ul>
              {plan.cta && (
                <a
                  href={plan.cta.href}
                  className={cn(
                    'mt-6 flex min-h-[44px] w-full items-center justify-center rounded-md px-8 text-lg font-semibold transition-all',
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border bg-transparent hover:bg-accent'
                  )}
                >
                  {plan.cta.label}
                </a>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
