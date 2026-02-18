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
    return React.createElement('div', { 'data-template': 'HomePageTemplate' }, null);
  }
  return result;
}
