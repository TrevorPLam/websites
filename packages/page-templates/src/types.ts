/**
 * @file packages/page-templates/src/types.ts
 * Task: [3.1] SectionProps, TemplateConfig, PageTemplateProps, SectionType, SectionDefinition
 *
 * Purpose: Types for section registry and page composition. SectionType union and
 * SectionDefinition with optional configSchema support validation in composePage.
 */

import type React from 'react';
import type { SiteConfig } from '@repo/types';

/** Known section IDs (kebab-case). Extend when adding new sections. */
export type SectionType =
  | 'hero-split'
  | 'hero-centered'
  | 'hero-video'
  | 'hero-carousel'
  | 'services-preview'
  | 'services-grid'
  | 'services-list'
  | 'services-tabs'
  | 'services-accordion'
  | 'team'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'about-hero'
  | 'about-story'
  | 'about-team'
  | 'about-testimonials'
  | 'about-cta'
  | 'contact-form'
  | 'contact-info'
  | 'blog-grid'
  | 'blog-pagination'
  | 'blog-post-content'
  | 'blog-related-posts'
  | 'blog-cta'
  | 'booking-form'
  | 'industry-location'
  | 'industry-menu'
  | 'industry-portfolio'
  | 'industry-course'
  | 'industry-resource'
  | 'industry-comparison'
  | 'industry-filter'
  | 'industry-search'
  | 'industry-social-proof'
  | 'industry-video'
  | 'industry-audio'
  | 'industry-interactive'
  | 'industry-widget'
  | 'feature-analytics'
  | 'feature-chat'
  | 'feature-ab-testing';

export interface SectionProps {
  id?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Section definition for the registry. Optional configSchema enables validation
 * of section-specific config (e.g. searchParams) in composePage.
 */
export interface SectionDefinition {
  component: React.ComponentType<SectionProps>;
  configSchema?: import('zod').ZodType<unknown>;
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
