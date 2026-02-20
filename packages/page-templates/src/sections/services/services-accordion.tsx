/**
 * @file packages/page-templates/src/sections/services/services-accordion.tsx
 * Purpose: Services accordion section adapter and registration.
 */
import { ServiceAccordion } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { filterServices, getSearchParams, getServicesFromConfig, getSiteConfig } from './shared';

function ServicesAccordionAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const searchParams = getSearchParams(props);
  const services = filterServices(getServicesFromConfig(config), searchParams);
  if (services.length === 0) return null;
  return <ServiceAccordion services={services} />;
}

registerSection('services-accordion', ServicesAccordionAdapter);
