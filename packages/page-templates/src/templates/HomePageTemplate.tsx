/**
 * @file packages/page-templates/src/templates/HomePageTemplate.tsx
 * Task: [3.2] Config-driven section composition for home page
 *
 * Purpose: Renders home page via composePage. Sections derived from
 * siteConfig.features (hero, services-preview, team, testimonials, pricing, cta).
 * Registration of section adapters happens via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/home'; // side-effect: register home sections

export function HomePageTemplate({ config }: PageTemplateProps): React.ReactElement | null {
  const result = composePage({ page: 'home' }, config);
  if (result === null) {
    // Return helpful message instead of empty div
    return (
      <div data-template="HomePageTemplate" className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Home Page</h1>
        <p className="text-muted-foreground">
          Configure sections in site.config.ts features to see content here.
        </p>
      </div>
    );
  }
  return result;
}
