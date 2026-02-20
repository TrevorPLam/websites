/**
 * @file packages/page-templates/src/sections/services/shared.ts
 * Purpose: Shared helpers for services section adapters.
 */
import type { SiteConfig } from '@repo/types';
import type { SectionProps } from '../../types';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export type SearchParams = Record<string, string | string[] | undefined>;

export function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}

export function getServicesFromConfig(config: SiteConfig): ServiceItem[] {
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

export function filterServices(
  services: ServiceItem[],
  searchParams?: SearchParams
): ServiceItem[] {
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

export function getSearchParams(props: SectionProps): SearchParams | undefined {
  const p = props.searchParams;
  if (p == null) return undefined;
  return p as SearchParams;
}
