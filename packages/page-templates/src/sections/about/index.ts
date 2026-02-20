/**
 * @file packages/page-templates/src/sections/about/index.ts
 * Purpose: Barrel and side-effect registration for about sections.
 */
import type { SiteConfig } from '@repo/types';
import './about-story';
import './about-team';
import './about-testimonials';
import './about-cta';

export function getSectionsForAboutPage(features: SiteConfig['features']): string[] {
  const sections: string[] = ['about-story'];
  if (features.team) sections.push('about-team');
  if (features.testimonials) sections.push('about-testimonials');
  sections.push('about-cta');
  return sections;
}

export function registerAboutSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
