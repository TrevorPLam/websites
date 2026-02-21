'use client';

/**
 * @file packages/marketing-components/src/hero/HeroOverlay.tsx
 * @role component
 * @summary Hero with customizable overlay
 *
 * Hero variant with configurable overlay and background.
 */

import { Container, Section } from '@repo/ui';
import Image from 'next/image';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroImage, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroOverlayProps extends BaseHeroProps {
  /** Background image */
  backgroundImage?: HeroImage;
  /** Overlay color */
  overlayColor?: string;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
}

/**
 * Hero section with customizable overlay.
 *
 * @param props - HeroOverlayProps
 * @returns Hero section component
 */
export function HeroOverlay({
  title,
  subtitle,
  description,
  backgroundImage,
  overlayColor = 'black',
  overlayOpacity = 0.5,
  cta,
  dualCta,
  slots,
  className,
  children,
}: HeroOverlayProps) {
  const content = (
    <div className="relative z-10 flex flex-col items-center text-center">
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
    <Section className={cn('relative overflow-hidden', className)}>
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            className="h-full w-full object-cover"
            fill
            sizes="100vw"
            priority={backgroundImage.priority}
            quality={85}
          />
        </div>
      )}
      {slots?.background}
      {!slots?.overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
          aria-hidden="true"
        />
      )}
      {slots?.overlay}
      <Container className="relative z-10 py-24 md:py-32">{content}</Container>
    </Section>
  );
}
