import * as React from 'react';
import { AccordionContent } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function InteractiveAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.interactive) return null;
  return React.createElement(AccordionContent, { items: [] });
}
registerSection('industry-interactive', InteractiveAdapter);
