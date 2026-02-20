/**
 * @file packages/page-templates/src/sections/services/services-list.tsx
 * Purpose: Services list section adapter and registration.
 */
import { ServiceList } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { filterServices, getSearchParams, getServicesFromConfig, getSiteConfig } from './shared';

function ServicesListAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const searchParams = getSearchParams(props);
  const services = filterServices(getServicesFromConfig(config), searchParams);
  if (services.length === 0) return null;
  return <ServiceList services={services} />;
}

registerSection('services-list', ServicesListAdapter);
