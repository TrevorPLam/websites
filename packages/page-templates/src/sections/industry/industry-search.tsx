import * as React from 'react';
import { SearchBar } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function SearchAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.search) return null;
  return React.createElement(SearchBar, {});
}
registerSection('industry-search', SearchAdapter);
