/**
 * @file packages/page-templates/src/registry.ts
 * Task: [3.1] Section registry — Map<string, SectionDefinition>, composePage, registerSection
 * Task: evol-3  — Capability metadata: isFeatureEnabled, resolveForSite
 *
 * Purpose: Registry-based page composition with typed SectionType and optional
 * configSchema per section. Unknown section IDs log a console.warn in composePage.
 * Each section is wrapped in Suspense with Skeleton fallback for dynamic loading.
 *
 * Capability metadata (evol-3):
 * - isFeatureEnabled() checks a feature key against siteConfig.features
 * - resolveForSite()   filters sections by requiredFeatures, enabling feature-aware composition
 * - composePage()      skips sections that fail validateConfig (with warning)
 *
 * Invariants:
 * - Sections with requiredFeatures not enabled for a site are silently excluded from resolveForSite()
 * - validateConfig failures emit console.warn and skip the section (never throw)
 * - No breaking change to existing composePage / registerSection API
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
 *
 * @param id          - Unique section identifier (kebab-case)
 * @param component   - React component rendered for this section
 * @param definition  - Optional capability metadata (evol-3): requiredFeatures, estimatedBundleSize, etc.
 */
export function registerSection(
  id: string,
  component: React.ComponentType<SectionProps>,
  definition?: Omit<SectionDefinition, 'component'>
): void {
  sectionRegistry.set(id, { component, ...definition });
}

// ─── Capability helpers (evol-3) ──────────────────────────────────────────────

/**
 * Returns true if a feature key is enabled in the given siteConfig.features object.
 *
 * A feature is considered enabled when its value is truthy (e.g. a non-empty string,
 * true, or any object). Falsy values (false, undefined, null, '') are treated as disabled.
 *
 * @param featureKey - Key from SiteConfig['features']
 * @param features   - The features object from siteConfig
 *
 * @example
 * isFeatureEnabled('booking', siteConfig.features) // true if features.booking is truthy
 */
export function isFeatureEnabled(
  featureKey: keyof SiteConfig['features'],
  features: SiteConfig['features']
): boolean {
  const value = features[featureKey];
  return Boolean(value);
}

/**
 * Returns all registered section definitions that are enabled for a given site.
 *
 * A section is included when:
 * 1. It has no requiredFeatures (unconditionally available), OR
 * 2. All requiredFeatures are enabled in siteConfig.features
 *
 * This enables feature-aware section composition and prepares for the capability
 * registry in Phase 3 (evol-7/evol-8).
 *
 * @param siteConfig - The site configuration to resolve sections against
 * @returns Array of [id, definition] pairs for sections enabled for this site
 *
 * @example
 * const available = resolveForSite(siteConfig);
 * // Only sections whose requiredFeatures are all enabled in siteConfig
 */
export function resolveForSite(siteConfig: SiteConfig): Array<[string, SectionDefinition]> {
  return Array.from(sectionRegistry.entries()).filter(([, definition]) => {
    const { requiredFeatures } = definition;
    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }
    return requiredFeatures.every((feature) => isFeatureEnabled(feature, siteConfig.features));
  });
}

// ─── Page composition ─────────────────────────────────────────────────────────

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
 *
 * evol-3: Sections with a validateConfig function are validated before rendering.
 * If validation fails, the section is skipped with a console.warn.
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

      const { component: Section, configSchema, validateConfig } = definition;

      // evol-3: validateConfig — skip section if custom validation fails
      if (validateConfig) {
        try {
          const configToValidate = config.searchParams ?? config;
          const valid = validateConfig(configToValidate);
          if (!valid) {
            if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
              console.warn(`[composePage] Section "${id}" failed validateConfig — skipped.`);
            }
            return null;
          }
        } catch {
          if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
            console.warn(`[composePage] Section "${id}" validateConfig threw — skipped.`);
          }
          return null;
        }
      }

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
