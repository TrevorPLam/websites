/**
 * @file packages/page-templates/src/sections/blog/blog-cta.tsx
 * Purpose: Blog CTA section adapter and registration.
 */
import * as React from 'react';
import { CTASection } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function BlogCTAAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  return React.createElement(CTASection, {
    title: `Stay updated with ${config.name}`,
    description: 'Subscribe to our newsletter for the latest updates.',
    primaryCta: { label: 'Contact Us', href: '/contact' },
  });
}

registerSection('blog-cta', BlogCTAAdapter);
