'use client';

/**
 * @file packages/marketing-components/src/hero/HeroAnimated.tsx
 * @role component
 * @summary Hero with animation effects
 *
 * Hero variant with configurable animation effects.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroAnimation } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroAnimatedProps extends BaseHeroProps {
  /** Animation type */
  animation?: HeroAnimation;
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Hero section with animation effects.
 * Respects prefers-reduced-motion.
 *
 * @param props - HeroAnimatedProps
 * @returns Hero section component
 */
export function HeroAnimated({
  title,
  subtitle,
  description,
  animation = 'fade-in',
  cta,
  dualCta,
  className,
  children,
}: HeroAnimatedProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const animationClasses = prefersReducedMotion
    ? ''
    : animation === 'fade-in'
      ? 'animate-in fade-in duration-1000'
      : animation === 'slide-up'
        ? 'animate-in slide-in-from-bottom-4 duration-1000'
        : animation === 'zoom'
          ? 'animate-in zoom-in-95 duration-1000'
          : '';

  const content = (
    <div className={cn('flex flex-col items-center text-center', animationClasses)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      )}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        {dualCta ? (
          <>
            <HeroCTAButton
              {...dualCta.primary}
              variant={dualCta.primary.variant || 'primary'}
              size={dualCta.primary.size || 'large'}
            />
            <HeroCTAButton
              {...dualCta.secondary}
              variant={dualCta.secondary.variant || 'outline'}
              size={dualCta.secondary.size || 'large'}
            />
          </>
        ) : cta ? (
          <HeroCTAButton {...cta} variant={cta.variant || 'primary'} size={cta.size || 'large'} />
        ) : null}
      </div>
      {children}
    </div>
  );

  return (
    <Section className={cn('relative', className)}>
      <Container className="py-24 md:py-32">{content}</Container>
    </Section>
  );
}
