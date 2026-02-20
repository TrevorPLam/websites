'use client';

/**
 * @file packages/marketing-components/src/hero/HeroCentered.tsx
 * @role component
 * @summary Full-width centered hero section
 *
 * Centered hero variant with title, subtitle, and optional CTA.
 * Supports composition slots and responsive design.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroCenteredProps extends BaseHeroProps {
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
  /** Layout variant */
  layout?: 'full-width' | 'contained';
}

/**
 * Centered hero section with title, subtitle, and CTA.
 * Supports single or dual CTAs and composition slots.
 *
 * @param props - HeroCenteredProps
 * @returns Hero section component
 */
export function HeroCentered({
  title,
  subtitle,
  description,
  cta,
  dualCta,
  slots,
  layout = 'contained',
  className,
  children,
}: HeroCenteredProps) {
  const content = (
    <div className="flex flex-col items-center text-center">
      {slots?.header}
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
      {slots?.content}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        {slots?.ctaArea ? (
          slots.ctaArea
        ) : dualCta ? (
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
      {slots?.footer}
      {children}
    </div>
  );

  if (layout === 'full-width') {
    return (
      <Section className={cn('relative', className)}>
        {slots?.background}
        {slots?.overlay && <div className="absolute inset-0 bg-black/50" aria-hidden="true" />}
        <div className="relative z-10">{content}</div>
      </Section>
    );
  }

  return (
    <Section className={cn('relative', className)}>
      {slots?.background}
      {slots?.overlay && <div className="absolute inset-0 bg-black/50" aria-hidden="true" />}
      <Container className="relative z-10">{content}</Container>
    </Section>
  );
}
