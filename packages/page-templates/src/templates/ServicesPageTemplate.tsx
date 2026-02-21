/**
 * @file packages/page-templates/src/templates/ServicesPageTemplate.tsx
 * Task: [3.3] Config-driven section composition for services page
 * Task: [3.4] Slot-based content injection (header, aboveFold, footer)
 *
 * Purpose: Renders services page via composePage. Section variant from
 * siteConfig.features.services (grid | list | tabs | accordion).
 * Optional URL-synced filters via searchParams. Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function ServicesPageTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  // Dynamically load services sections only when this template is used
  React.useEffect(() => {
    import('../sections/services/index').then((mod) => mod.registerServicesSections());
  }, []);
  const content = composePage(
    { page: 'services', sections: config.pageSections?.services, searchParams },
    config
  );

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="ServicesPageTemplate" />}
      {slots?.footer}
    </>
  );
}
