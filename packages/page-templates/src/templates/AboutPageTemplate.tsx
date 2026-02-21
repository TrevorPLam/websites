/**
 * @file packages/page-templates/src/templates/AboutPageTemplate.tsx
 * Task: [3.4] Story, Team, Mission, Values, Timeline + slot-based content injection
 *
 * Purpose: Renders about page via composePage. Sections derived from
 * siteConfig (story, team, testimonials, cta). Registration via import side-effect.
 * Slots allow injecting nav/banner/footer without modifying the section registry.
 */

import * as React from 'react';
import type { PageTemplateProps } from '../types';
import { composePage } from '../registry';

export function AboutPageTemplate({
  config,
  searchParams,
  slots,
}: PageTemplateProps): React.ReactElement {
  // Dynamically load about sections only when this template is used
  React.useEffect(() => {
    import('../sections/about/index').then((mod) => mod.registerAboutSections());
  }, []);
  const content = composePage(
    { page: 'about', sections: config.pageSections?.about, searchParams },
    config
  );

  return (
    <>
      {slots?.header}
      {slots?.aboveFold}
      {content ?? <div data-template="AboutPageTemplate" />}
      {slots?.footer}
    </>
  );
}
