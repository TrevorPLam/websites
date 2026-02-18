/**
 * @file packages/marketing-components/src/hero/HeroContained.tsx
 * @role component
 * @summary Contained hero variant
 *
 * Hero variant with constrained width container.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroContainedProps extends BaseHeroProps {
  /** Container size */
  containerSize?: 'default' | 'narrow' | 'wide';
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Contained hero section with constrained width.
 *
 * @param props - HeroContainedProps
 * @returns Hero section component
 */
export function HeroContained({
  title,
  subtitle,
  description,
  containerSize = 'narrow',
  cta,
  dualCta,
  className,
  children,
}: HeroContainedProps) {
  return (
    <Section className={cn('relative', className)}>
      <Container size={containerSize} className="py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            {dualCta ? (
              <>
                <HeroCTAButton {...dualCta.primary} variant={dualCta.primary.variant || 'primary'} size={dualCta.primary.size || 'large'} />
                <HeroCTAButton {...dualCta.secondary} variant={dualCta.secondary.variant || 'outline'} size={dualCta.secondary.size || 'large'} />
              </>
            ) : cta ? (
              <HeroCTAButton {...cta} variant={cta.variant || 'primary'} size={cta.size || 'large'} />
            ) : null}
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}
