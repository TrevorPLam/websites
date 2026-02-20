/**
 * @file packages/page-templates/src/sections/booking/shared.ts
 * Purpose: Shared helpers for booking section adapters.
 */
import type { SiteConfig } from '@repo/types';
import type { SectionProps } from '../../types';

export function getSiteConfig(props: SectionProps): SiteConfig {
  const config = props.siteConfig;
  if (!config || typeof config !== 'object') {
    throw new Error('Section adapter requires siteConfig in props');
  }
  return config as SiteConfig;
}
