// File: packages/marketing-components/src/services/ServiceTabs.tsx
// Purpose: Services grouped by category using Tabs
// Task: 2.2
// Status: Scaffolded - TODO: Implement

import { Tabs } from '@repo/ui';
import type { Service } from './types';

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

export interface ServiceTabsProps {
  categories: ServiceCategory[];
  className?: string;
}

export function ServiceTabs({ categories, className }: ServiceTabsProps) {
  // TODO: Implement tabs-based service grouping
  return (
    <div className={className}>
      <Tabs defaultValue={categories[0]?.id}>
        {/* TODO: Implement tabs UI */}
      </Tabs>
    </div>
  );
}
