/**
 * @file packages/page-templates/src/templates/ServicesPageTemplate.tsx
 * Task: [3.3] Config-driven section composition for services page
 *
 * Purpose: Renders services page via composePage. Section variant from
 * siteConfig.features.services (grid | list | tabs | accordion).
 * Optional URL-synced filters via searchParams. Registration via import side-effect.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';
import '../sections/services'; // side-effect: register services sections

export function ServicesPageTemplate({
  config,
  searchParams,
}: PageTemplateProps): React.ReactElement | null {
  const result = composePage(
    { page: 'services', searchParams },
    config
  );
  if (result === null) {
    return React.createElement('div', { 'data-template': 'ServicesPageTemplate' }, null);
  }
  return result;
}
