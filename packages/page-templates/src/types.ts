/**
 * @file packages/page-templates/src/types.ts
 * Task: [3.1] SectionProps, TemplateConfig, PageTemplateProps
 *
 * Purpose: Types for section registry and page composition. No CMS section definitions;
 * config from siteConfig only.
 */

import type React from 'react';
import type { SiteConfig } from '@repo/types';

export interface SectionProps {
  id?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/** Config for composing a page: explicit section IDs or derived from features. */
export interface TemplateConfig {
  /** Explicit section IDs (e.g. hero-split, services-grid). When omitted, derive from siteConfig.features + page key. */
  sections?: string[];
  /** Page key for derivation (e.g. 'home', 'services'). Used when sections not provided. */
  page?: string;
  /** Optional URL search params (e.g. for services page filters). Passed to section components. */
  searchParams?: Record<string, string | string[] | undefined>;
  [key: string]: unknown;
}

/** Props passed to page template components. */
export interface PageTemplateProps {
  config: SiteConfig;
  /** Optional URL search params (e.g. for services filters). */
  searchParams?: Record<string, string | string[] | undefined>;
}
