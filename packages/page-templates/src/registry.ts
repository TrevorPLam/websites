/**
 * @file packages/page-templates/src/registry.ts
 * Task: [3.1] Section registry — Map<string, SectionDefinition>, composePage, registerSection
 *
 * Purpose: Registry-based page composition with typed SectionType and optional
 * configSchema per section. Unknown section IDs log a console.warn in composePage.
 * Each section is wrapped in Suspense with Skeleton fallback for dynamic loading.
 */
import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import type { SectionDefinition, SectionProps, TemplateConfig } from './types';

/**
 * Lightweight server-safe Suspense fallback — avoids importing from the @repo/ui barrel
 * (which contains 'use client' modules) in this server-side registry module.
 * Matches Skeleton's visual output: animated pulse placeholder.
 */
const SectionFallback = (): React.ReactElement =>
  React.createElement('div', {
    role: 'status',
    'aria-busy': 'true',
    'aria-label': 'Loading…',
    className: 'h-32 w-full motion-safe:animate-pulse rounded-md bg-muted',
  });

export const sectionRegistry = new Map<string, SectionDefinition>();

/**
 * Register a section component by ID. Use kebab-case (e.g. hero-split, services-grid).
 * Optional configSchema enables validation of section-specific config in composePage.
 */
export function registerSection(
  id: string,
  component: React.ComponentType<SectionProps>,
  configSchema?: SectionDefinition['configSchema']
): void {
  sectionRegistry.set(id, { component, configSchema });
}

/**
 * Derive section IDs for a page from features. Used when config.sections is not provided.
 */
export function getSectionsForPage(page: string, features: SiteConfig['features']): string[] {
  if (page === 'home') {
    const sections: string[] = [];
    if (features.hero) sections.push(`hero-${features.hero}`);
    if (features.services) sections.push('services-preview');
    if (features.team) sections.push('team');
    if (features.testimonials) sections.push('testimonials');
    if (features.pricing) sections.push('pricing');
    sections.push('cta');
    return sections;
  }
  if (page === 'services') {
    if (features.services) return [`services-${features.services}`];
    return [];
  }
  if (page === 'about') {
    const sections: string[] = ['about-hero'];
    if (features.team) sections.push('about-team');
    if (features.testimonials) sections.push('about-testimonials');
    sections.push('about-cta');
    return sections;
  }
  if (page === 'contact') {
    return ['contact-form', 'contact-info'];
  }
  if (page === 'blog-index') {
    const sections: string[] = ['blog-grid'];
    if (features.blog) sections.push('blog-pagination');
    return sections;
  }
  if (page === 'blog-post') {
    return ['blog-post-content', 'blog-related-posts', 'blog-cta'];
  }
  if (page === 'booking') {
    return ['booking-form'];
  }
  return [];
}

/**
 * Compose a page from section IDs. Resolves sections from config.sections or
 * getSectionsForPage(config.page, siteConfig.features). Renders each registered
 * section with siteConfig; unknown IDs are skipped.
 */
export function composePage(
  config: TemplateConfig,
  siteConfig: SiteConfig
): React.ReactElement | null {
  const sections =
    config.sections ?? (config.page ? getSectionsForPage(config.page, siteConfig.features) : []);

  if (sections.length === 0) {
    return null;
  }

  const nodes = sections
    .map((id) => {
      const definition = sectionRegistry.get(id);
      if (!definition) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn('[composePage] Unknown section ID:', id);
        }
        return null;
      }
      const { component: Section, configSchema } = definition;
      let sectionProps: SectionProps = {
        key: id,
        id,
        siteConfig,
        searchParams: config.searchParams,
      };
      if (configSchema && config.searchParams) {
        const parsed = configSchema.safeParse(config.searchParams);
        if (parsed.success && parsed.data && typeof parsed.data === 'object') {
          sectionProps = {
            ...sectionProps,
            ...(parsed.data as Record<string, unknown>),
          } as SectionProps;
        }
      }
      const sectionElement = React.createElement(Section, sectionProps as SectionProps);
      return React.createElement(
        React.Suspense,
        {
          key: id,
          fallback: React.createElement(SectionFallback, null),
        },
        sectionElement
      );
    })
    .filter((n) => n !== null) as React.ReactElement[];

  if (nodes.length === 0) {
    return null;
  }

  return React.createElement(React.Fragment, {}, ...nodes);
}
