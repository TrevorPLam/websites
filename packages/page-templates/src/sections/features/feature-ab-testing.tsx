/**
 * @file packages/page-templates/src/sections/features/feature-ab-testing.tsx
 * Purpose: A/B testing feature section adapter and registration.
 */
import * as React from 'react';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

const ABTestBanner = () => null;

function ABTestingAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  const abTesting = config.integrations?.abTesting;
  if (!abTesting || abTesting.provider === 'none') return null;
  return React.createElement(ABTestBanner, { config: abTesting.config });
}
registerSection('feature-ab-testing', ABTestingAdapter);
