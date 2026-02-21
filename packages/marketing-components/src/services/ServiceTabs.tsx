'use client';

// File: packages/marketing-components/src/services/ServiceTabs.tsx
// Purpose: Services grouped by category using Tabs
// Task: 2.2
// Status: Implemented

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui';
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
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');

  if (!categories.length) {
    return (
      <div className={className}>
        <p className="text-center text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services?.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
