// File: packages/marketing-components/src/pricing/PricingTable.tsx
// Purpose: Feature comparison pricing table
// Task: 2.5
// Status: Scaffolded - TODO: Implement

export interface PricingFeature {
  name: string;
  included: boolean | string; // true/false or feature value
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: 'month' | 'year';
  features: PricingFeature[];
  cta?: {
    label: string;
    href: string;
  };
  popular?: boolean;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  className?: string;
}

export function PricingTable({ plans, className }: PricingTableProps) {
  // TODO: Implement comparison table
  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Feature</th>
          {plans.map((plan) => (
            <th key={plan.id}>{plan.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* TODO: Implement feature rows */}
      </tbody>
    </table>
  );
}
