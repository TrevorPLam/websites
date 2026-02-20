import * as React from 'react';
import { FilterBar } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function FilterAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.filter) return null;
  return React.createElement(FilterBar, { filters: [] });
}
registerSection('industry-filter', FilterAdapter);
