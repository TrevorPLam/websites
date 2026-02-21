/**
 * @file packages/page-templates/src/templates/HomePageTemplate.tsx
 * Task: [3.2] Config-driven section composition for home page
 * Task: [3.4] Slot-based content injection (header, aboveFold, footer)
 *
 * Purpose: Renders home page via composePage. Sections derived from
 * siteConfig.features (hero, services-preview, team, testimonials, pricing, cta).
 * Registration of section adapters happens via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function HomePageTemplate({ config, slots }: PageTemplateProps): React.ReactElement {
  // Dynamically load home sections only when this template is used
  React.useEffect(() => {
    import('../sections/home/index').then((mod) => mod.registerHomeSections());
  }, []);

  const content = composePage({ page: 'home', sections: config.pageSections?.home }, config);

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? (
        <div data-template="HomePageTemplate" className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Home Page</h1>
          <p className="text-muted-foreground">
            Configure sections in site.config.ts features to see content here.
          </p>
        </div>
      )}
      {slots?.footer}
    </>
  );
}
