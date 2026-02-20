'use client';

/**
 * @file packages/features/src/social-media/components/SocialMediaSection.tsx
 * Purpose: Social media follow links section
 */

import { Container, Section } from '@repo/ui';
import type { SocialLink } from '@repo/types';
import type { SocialMediaFeatureConfig } from '../lib/social-media-config';

export interface SocialMediaSectionProps extends SocialMediaFeatureConfig {
  /** Pre-loaded links (overrides config when provided) */
  links?: SocialLink[];
}

const platformLabels: Record<SocialLink['platform'], string> = {
  facebook: 'Facebook',
  twitter: 'X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

export function SocialMediaSection({
  title = 'Follow us',
  links: propsLinks,
  ...rest
}: SocialMediaSectionProps) {
  const config = rest as SocialMediaFeatureConfig;
  const links = propsLinks ?? config.links ?? [];

  if (links.length === 0) return null;

  return (
    <Section>
      <Container>
        {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              aria-label={`${platformLabels[link.platform]} profile`}
            >
              {platformLabels[link.platform]}
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}
