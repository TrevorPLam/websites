/**
 * @file packages/page-templates/src/registry.ts
 * Task: [3.1] Section registry — Map<string, Component>, composePage, registerSection
 *
 * Purpose: Registry-based page composition. No switch-based section selection.
 * Sections are registered by template modules (3.2, 3.3). composePage resolves
 * section IDs from config.sections or getSectionsForPage(page, features).
 */
import * as React from 'react';
import type { SiteConfig } from '@repo/types';
import type { SectionProps, TemplateConfig } from './types';

export const sectionRegistry = new Map<string, React.ComponentType<SectionProps>>();

/**
 * Register a section component by ID. Use kebab-case (e.g. hero-split, services-grid).
 * Called by template modules (HomePageTemplate, ServicesPageTemplate) to register adapters.
 */
export function registerSection(
  id: string,
  component: React.ComponentType<SectionProps>
): void {
  sectionRegistry.set(id, component);
}

/**
 * Derive section IDs for a page from features. Used when config.sections is not provided.
 */
export function getSectionsForPage(
  page: string,
  features: SiteConfig['features']
): string[] {
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
    config.sections ??
    (config.page ? getSectionsForPage(config.page, siteConfig.features) : []);

  if (sections.length === 0) {
    return null;
  }

  const nodes = sections
    .map((id) => {
      const Section = sectionRegistry.get(id);
      if (!Section) {
        return null;
      }
      return React.createElement(Section, {
        key: id,
        id,
        siteConfig,
        searchParams: config.searchParams,
      } as SectionProps);
    })
    .filter((n) => n !== null) as React.ReactElement[];

  if (nodes.length === 0) {
    return null;
  }

  return React.createElement(React.Fragment, {}, ...nodes);
}
