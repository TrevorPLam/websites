import * as React from 'react';
import { SocialProofStack } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function SocialProofAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.socialProof) return null;
  return React.createElement(SocialProofStack, { items: [] });
}
registerSection('industry-social-proof', SocialProofAdapter);
