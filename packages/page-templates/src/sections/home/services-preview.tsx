/**
 * @file packages/page-templates/src/sections/home/services-preview.tsx
 * Purpose: Services preview section adapter and registration.
 */
import { ServiceGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig, getServicesFromConfig } from './shared';

function ServicesPreviewAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const services = getServicesFromConfig(config);
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

registerSection('services-preview', ServicesPreviewAdapter);
