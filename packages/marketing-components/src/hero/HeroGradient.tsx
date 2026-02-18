/**
 * @file packages/marketing-components/src/hero/HeroGradient.tsx
 * @role component
 * @summary Hero with gradient background
 *
 * Hero variant with CSS gradient background.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroSlots } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroGradientProps extends BaseHeroProps {
  /** Gradient colors (from, via, to) */
  gradient?: {
    from: string;
    via?: string;
    to: string;
  };
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
  /** Composition slots */
  slots?: HeroSlots;
}

/**
 * Hero section with gradient background.
 *
 * @param props - HeroGradientProps
 * @returns Hero section component
 */
export function HeroGradient({
  title,
  subtitle,
  description,
  gradient = {
    from: 'from-blue-600',
    via: 'via-purple-600',
    to: 'to-pink-600',
  },
  cta,
  dualCta,
  slots,
  className,
  children,
}: HeroGradientProps) {
  const gradientClasses = `bg-gradient-to-br ${gradient.from} ${gradient.via || ''} ${gradient.to}`;

  const content = (
    <div className="flex flex-col items-center text-center">
      {slots?.header}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl md:text-2xl">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">
          {description}
        </p>
      )}
      {slots?.content}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        {slots?.ctaArea ? (
          slots.ctaArea
        ) : dualCta ? (
          <>
            <HeroCTAButton {...dualCta.primary} variant={dualCta.primary.variant || 'primary'} size={dualCta.primary.size || 'large'} />
            <HeroCTAButton {...dualCta.secondary} variant={dualCta.secondary.variant || 'outline'} size={dualCta.secondary.size || 'large'} />
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
    <Section className={cn('relative', gradientClasses, className)}>
      {slots?.background}
      {slots?.overlay}
      <Container className="relative z-10 py-24 md:py-32">{content}</Container>
    </Section>
  );
}
