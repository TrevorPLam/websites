/**
 * @file packages/page-templates/src/sections/home/shared.ts
 * Purpose: Shared helpers for home section adapters (getSiteConfig, getServicesFromConfig).
 */
import type { SiteConfig } from '@repo/types';
import type { SectionProps } from '../../types';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

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
