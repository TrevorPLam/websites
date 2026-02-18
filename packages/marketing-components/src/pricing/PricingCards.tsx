// File: packages/marketing-components/src/pricing/PricingCards.tsx
// Purpose: Tiered plan cards
// Task: 2.5
// Status: Scaffolded - TODO: Implement

import * as React from 'react';
import type { PricingPlan } from './PricingTable';

export interface PricingCardsProps {
  plans: PricingPlan[];
  className?: string;
}

export function PricingCards({ plans, className }: PricingCardsProps) {
  // TODO: Implement card layout
  return (
    <div className={className}>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <div>{plan.price}</div>
          {plan.cta && <a href={plan.cta.href}>{plan.cta.label}</a>}
        </div>
      ))}
    </div>
  );
}
