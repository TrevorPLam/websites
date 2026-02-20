'use client';

/**
 * @file packages/marketing-components/src/hero/HeroSplit.tsx
 * @role component
 * @summary Split hero with image and content side-by-side
 *
 * Split hero variant with image on one side and content on the other.
 * Supports left/right image positioning and responsive stacking.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroImage, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroSplitProps extends BaseHeroProps {
  /** Image configuration */
  image?: HeroImage;
  /** Image position */
  imagePosition?: 'left' | 'right';
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
}

/**
 * Split hero section with image and content side-by-side.
 * Stacks vertically on mobile, side-by-side on desktop.
 *
 * @param props - HeroSplitProps
 * @returns Hero section component
 */
export function HeroSplit({
  title,
  subtitle,
  description,
  image,
  imagePosition = 'right',
  cta,
  dualCta,
  slots,
  className,
  children,
}: HeroSplitProps) {
  const imageContent = image && (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover"
        width={image.width}
        height={image.height}
        loading={image.priority ? 'eager' : 'lazy'}
      />
    </div>
  );

  const textContent = (
    <div className="flex flex-col justify-center">
      {slots?.header}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{title}</h1>
      {subtitle && (
        <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">{subtitle}</p>
      )}
      {description && (
        <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
      )}
      {slots?.content}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
    <Section className={cn('relative', className)}>
      {slots?.background}
      {slots?.overlay && <div className="absolute inset-0 bg-black/50" aria-hidden="true" />}
      <Container className="relative z-10">
        <div
          className={cn(
            'grid gap-12 lg:grid-cols-2 lg:gap-16',
            imagePosition === 'left' && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
          )}
        >
          {imagePosition === 'left' ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
