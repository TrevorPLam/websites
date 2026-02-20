import * as React from 'react';
import { MenuList } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function MenuAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.menu) return null;
  return React.createElement(MenuList, { items: [] });
}
registerSection('industry-menu', MenuAdapter);
