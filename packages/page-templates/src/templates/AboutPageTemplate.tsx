/**
 * @file packages/page-templates/src/templates/AboutPageTemplate.tsx
 * Task: [3.4] Story, Team, Mission, Values, Timeline
 *
 * Purpose: Renders about page via composePage. Sections derived from
 * siteConfig (story, team, testimonials, cta). Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/about/index'; // side-effect: register about sections

export function AboutPageTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage({ page: 'about', searchParams }, config);
  if (result === null) {
    return React.createElement('div', { 'data-template': 'AboutPageTemplate' }, null);
  }
  return result;
}
