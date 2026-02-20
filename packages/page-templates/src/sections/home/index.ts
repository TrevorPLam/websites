/**
 * @file packages/page-templates/src/sections/home/index.ts
 * Purpose: Barrel and side-effect registration for home sections.
 * Import this module to register all home section adapters (used by HomePageTemplate).
 */
import './hero-split';
import './hero-centered';
import './hero-video';
import './hero-carousel';
import './services-preview';
import './team';
import './testimonials';
import './pricing';
import './cta';

export function registerHomeSections(): void {
  // Registration is done via side-effects when the adapter modules above are imported.
}
