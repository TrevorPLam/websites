// Pricing components - placeholder implementations
import React from 'react';
import { cn } from '@repo/utils';
import type { PricingPlan } from '../types';

interface PricingTableProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export const PricingTable: React.FC<PricingTableProps> = ({ plans, title, description }) => {
  return (
    <div className="overflow-x-auto">
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 border-b">Features</th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className={cn('text-center p-4 border-b', plan.highlighted && 'bg-blue-50')}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans[0]?.features.map((feature, idx) => (
            <tr key={idx}>
              <td className="p-4 border-b">{feature}</td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={cn('text-center p-4 border-b', plan.highlighted && 'bg-blue-50')}
                >
                  ✓
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4 border-b font-semibold">Price</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={cn(
                  'text-center p-4 border-b font-bold',
                  plan.highlighted && 'bg-blue-50'
                )}
              >
                {plan.price}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface PricingCardsProps {
  plans: PricingPlan[];
  columns?: 1 | 2 | 3 | 4;
  title?: string;
  description?: string;
}

export const PricingCards: React.FC<PricingCardsProps> = ({
  plans,
  columns = 3,
  title,
  description,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 lg:grid-cols-4',
        'gap-6'
      )}
    >
      {title && <h2 className="text-2xl font-semibold col-span-full">{title}</h2>}
      {description && <p className="text-gray-600 col-span-full">{description}</p>}
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            'bg-white rounded-lg shadow-sm p-6 border-2',
            plan.highlighted ? 'border-blue-500 relative' : 'border-gray-200'
          )}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold mb-4">{plan.price}</p>
          <p className="text-gray-600 mb-6">{plan.description}</p>
          <ul className="space-y-2 mb-6">
            {(plan.features || []).map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          {plan.cta && (
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              {plan.cta.text}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
