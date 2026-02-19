/**
 * @file packages/page-templates/src/sections/services.tsx
 * Task: [3.3] Services page section adapters and registration
 *
 * Purpose: Register section components for services page (grid, list, tabs, accordion).
 * Content derived from conversionFlow.serviceCategories. Optional URL-synced
 * filtering via searchParams (category, tag).
 */

import type { SiteConfig } from '@repo/types';
import {
  ServiceGrid,
  ServiceList,
  ServiceTabs,
  ServiceAccordion,
} from '@repo/marketing-components';
import { registerSection } from '../registry';
import type { SectionProps } from '../types';

/** Minimal service shape for config-derived services. */
interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

function getServicesFromConfig(config: SiteConfig): ServiceItem[] {
  const flow = config.conversionFlow;
  if (flow.type === 'booking' && flow.serviceCategories?.length) {
    return flow.serviceCategories.map((name, i) => ({
      id: `svc-${i}`,
      name,
      description: '',
      category: name,
    }));
  }
  if (flow.type === 'quote' && flow.serviceCategories?.length) {
    return flow.serviceCategories.map((name, i) => ({
      id: `svc-${i}`,
      name,
      description: '',
      category: name,
    }));
  }
  return [];
}

type SearchParams = Record<string, string | string[] | undefined>;

/** Filter services by searchParams.category and searchParams.tag (single string or first of array). */
function filterServices(services: ServiceItem[], searchParams?: SearchParams): ServiceItem[] {
  if (!searchParams) return services;
  const category =
    typeof searchParams.category === 'string' ? searchParams.category : searchParams.category?.[0];
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : searchParams.tag?.[0];
  return services.filter((s) => {
    if (category && s.category !== category) return false;
    if (tag && s.category !== tag) return false;
    return true;
  });
}

function getSearchParams(props: SectionProps): SearchParams | undefined {
  const p = props.searchParams;
  if (p == null) return undefined;
  return p as SearchParams;
}

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

function ServicesListAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const searchParams = getSearchParams(props);
  const services = filterServices(getServicesFromConfig(config), searchParams);
  if (services.length === 0) return null;
  return <ServiceList services={services} />;
}

function ServicesTabsAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const services = getServicesFromConfig(config);
  if (services.length === 0) return null;
  const categoryNames = [...new Set(services.map((s) => s.category).filter(Boolean))] as string[];
  return <ServiceTabs services={services} categories={categoryNames} />;
}

function ServicesAccordionAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const searchParams = getSearchParams(props);
  const services = filterServices(getServicesFromConfig(config), searchParams);
  if (services.length === 0) return null;
  return <ServiceAccordion services={services} />;
}

/** Register all services page sections. Call once when module loads. */
export function registerServicesSections(): void {
  registerSection('services-grid', ServicesGridAdapter);
  registerSection('services-list', ServicesListAdapter);
  registerSection('services-tabs', ServicesTabsAdapter);
  registerSection('services-accordion', ServicesAccordionAdapter);
}

registerServicesSections();
