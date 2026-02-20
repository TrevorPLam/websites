'use client';

/**
 * @file packages/marketing-components/src/social-proof/SocialProofStack.tsx
 * @role component
 * @summary Horizontal stack of social proof badges
 */

import { Container, Section } from '@repo/ui';
import { SocialProofBadge } from './SocialProofBadge';
import type { SocialProofBadgeProps } from './SocialProofBadge';

export interface SocialProofStackProps {
  title?: string;
  items: Omit<SocialProofBadgeProps, 'className'>[];
  className?: string;
}

export function SocialProofStack({ title, items, className }: SocialProofStackProps) {
  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-4 text-center text-xl font-semibold">{title}</h2>}
        <div className="flex flex-wrap justify-center gap-3">
          {items.map((item, i) => (
            <SocialProofBadge key={i} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
