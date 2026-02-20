/**
 * @file packages/page-templates/src/sections/services/services-grid.tsx
 * Purpose: Services grid section adapter and registration.
 */
import { ServiceGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { filterServices, getSearchParams, getServicesFromConfig, getSiteConfig } from './shared';

function ServicesGridAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const searchParams = getSearchParams(props);
  const services = filterServices(getServicesFromConfig(config), searchParams);
  if (services.length === 0) return null;
  return (
    <ServiceGrid
      services={services}
      title="Our Services"
      description={config.description}
      columns={3}
    />
  );
}

registerSection('services-grid', ServicesGridAdapter);
