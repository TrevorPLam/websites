import * as React from 'react';
import { ComparisonTable } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function ComparisonAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.comparison) return null;
  return React.createElement(ComparisonTable, { items: [] });
}
registerSection('industry-comparison', ComparisonAdapter);
