/**
 * @file packages/marketing-components/src/hero/HeroBold.tsx
 * @role component
 * @summary Bold hero with strong visual impact
 *
 * Bold hero variant with large typography and strong contrast.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroBoldProps extends BaseHeroProps {
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Bold hero section with large typography and strong visual impact.
 *
 * @param props - HeroBoldProps
 * @returns Hero section component
 */
export function HeroBold({
  title,
  subtitle,
  description,
  cta,
  dualCta,
  className,
  children,
}: HeroBoldProps) {
  return (
    <Section className={cn('relative bg-foreground text-background', className)}>
      <Container className="py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-8 text-xl leading-9 sm:text-2xl md:text-3xl">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-6 text-lg leading-8 sm:text-xl">
              {description}
            </p>
          )}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            {dualCta ? (
              <>
                <HeroCTAButton {...dualCta.primary} variant={dualCta.primary.variant || 'secondary'} size={dualCta.primary.size || 'large'} />
                <HeroCTAButton {...dualCta.secondary} variant={dualCta.secondary.variant || 'outline'} size={dualCta.secondary.size || 'large'} />
              </>
            ) : cta ? (
              <HeroCTAButton {...cta} variant={cta.variant || 'secondary'} size={cta.size || 'large'} />
            ) : null}
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}
