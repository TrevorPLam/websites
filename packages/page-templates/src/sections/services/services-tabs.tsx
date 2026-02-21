/**
 * @file packages/page-templates/src/sections/services/services-tabs.tsx
 * Purpose: Services tabs section adapter and registration.
 */
import { ServiceTabs } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getServicesFromConfig, getSiteConfig, type ServiceItem } from './shared';

interface ServiceCategoryItem {
  id: string;
  name: string;
  services: ServiceItem[];
}

function ServicesTabsAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const rawServices = getServicesFromConfig(config);
  if (rawServices.length === 0) return null;

  const categoryMap = new Map<string, ServiceItem[]>();
  for (const s of rawServices) {
    const cat = s.category ?? 'General';
    const list = categoryMap.get(cat) ?? [];
    list.push(s);
    categoryMap.set(cat, list);
  }

  const categories: ServiceCategoryItem[] = Array.from(categoryMap.entries()).map(
    ([name, services]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      services,
    })
  );

  if (categories.length === 0) return null;

  return (
    <ServiceTabs
      services={categories.flatMap((c) => c.services)}
      categories={categories.map((c) => c.name)}
    />
  );
}

registerSection('services-tabs', ServicesTabsAdapter);
