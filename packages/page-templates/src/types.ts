/**
 * @file packages/page-templates/src/types.ts
 * Task: [3.1] SectionProps, TemplateConfig, PageTemplateProps, SectionType, SectionDefinition
 * Task: [3.4] PageTemplateSlots — named slot overrides for header/footer/aboveFold injection
 *
 * Purpose: Types for section registry and page composition. SectionType union and
 * SectionDefinition with optional configSchema support validation in composePage.
 * PageTemplateSlots enables per-template slot injection without modifying registry logic.
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

/**
 * Named content slots for page templates (Task 3.4).
 *
 * Slots inject arbitrary React content into specific positions in any template
 * without modifying the section registry or composePage logic. Each slot is optional
 * and renders only when provided.
 *
 * Pattern: Slot content is ReactNode — no asChild/Slot primitive needed. The Slot
 * primitive from @repo/infra/composition/slots is for asChild prop composition;
 * these named slots are content-injection points.
 *
 * @example
 * // Inject a sticky nav above the fold and a custom footer:
 * <HomePageTemplate
 *   config={siteConfig}
 *   slots={{
 *     header: <StickyNav />,
 *     aboveFold: <AnnouncementBanner />,
 *     footer: <SiteFooter />,
 *   }}
 * />
 */
export interface PageTemplateSlots {
  /**
   * Rendered at the very top of the page, before all sections.
   * Use for persistent site navigation or promotional banners.
   */
  header?: React.ReactNode;
  /**
   * Rendered between the header and the first section (before the fold).
   * Use for announcements, breadcrumbs, or hero-level overrides.
   */
  aboveFold?: React.ReactNode;
  /**
   * Rendered at the very bottom of the page, after all sections.
   * Use for footers, legal disclaimers, or persistent CTAs.
   */
  footer?: React.ReactNode;
}

/** Props passed to page template components. */
export interface PageTemplateProps {
  config: SiteConfig;
  /** Optional URL search params (e.g. for services filters). */
  searchParams?: Record<string, string | string[] | undefined>;
  /**
   * Optional named content slots for injecting custom content at header, aboveFold,
   * or footer positions without modifying the section registry. See PageTemplateSlots.
   */
  slots?: PageTemplateSlots;
}
