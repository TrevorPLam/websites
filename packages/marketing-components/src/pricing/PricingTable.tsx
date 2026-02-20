'use client';

/**
 * @file packages/marketing-components/src/pricing/PricingTable.tsx
 * @role component
 * @summary Feature comparison pricing table
 */

import { Container, Section } from '@repo/ui';
import type { PricingPlan } from './types';

export interface PricingTableProps {
  /** Section title */
  title?: string;
  /** Pricing plans */
  plans: PricingPlan[];
  /** Custom CSS class name */
  className?: string;
}

export function PricingTable({ title, plans, className }: PricingTableProps) {
  const allFeatures = Array.from(new Set(plans.flatMap((p) => p.features.map((f) => f.name))));

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 pr-4 text-left font-semibold">Feature</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-4 py-4 text-center font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((fName) => (
                <tr key={fName} className="border-b border-border">
                  <td className="py-3 pr-4 text-sm">{fName}</td>
                  {plans.map((p) => {
                    const f = p.features.find((x) => x.name === fName);
                    const val = f?.included;
                    return (
                      <td key={p.id} className="px-4 py-3 text-center text-sm">
                        {val === true ? '✓' : val === false ? '—' : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
