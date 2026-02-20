'use client';

/**
 * @file packages/marketing-components/src/hero/HeroFullscreen.tsx
 * @role component
 * @summary Fullscreen hero variant
 *
 * Hero variant that takes full viewport height.
 */

import { Container } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroImage, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroFullscreenProps extends BaseHeroProps {
  /** Background image */
  backgroundImage?: HeroImage;
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
}

/**
 * Fullscreen hero section (100vh).
 *
 * @param props - HeroFullscreenProps
 * @returns Hero section component
 */
export function HeroFullscreen({
  title,
  subtitle,
  description,
  backgroundImage,
  cta,
  dualCta,
  slots,
  className,
  children,
}: HeroFullscreenProps) {
  const content = (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
      {slots?.header}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl md:text-2xl">{subtitle}</p>
      )}
      {description && (
        <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{description}</p>
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

  return (
    <section className={cn('relative overflow-hidden', className)}>
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            className="h-full w-full object-cover"
            width={backgroundImage.width}
            height={backgroundImage.height}
            loading={backgroundImage.priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        </div>
      )}
      {slots?.background}
      {slots?.overlay}
      <Container className="relative z-10">{content}</Container>
    </section>
  );
}
