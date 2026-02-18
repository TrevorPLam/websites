/**
 * @file packages/marketing-components/src/hero/HeroMinimal.tsx
 * @role component
 * @summary Minimal hero with clean design
 *
 * Minimal hero variant with reduced visual elements.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroMinimalProps extends BaseHeroProps {
  /** Single CTA button */
  cta?: HeroCTA;
}

/**
 * Minimal hero section with clean, simple design.
 *
 * @param props - HeroMinimalProps
 * @returns Hero section component
 */
export function HeroMinimal({
  title,
  subtitle,
  description,
  cta,
  className,
  children,
}: HeroMinimalProps) {
  return (
    <Section className={cn('relative', className)}>
      <Container className="py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
          {cta && (
            <div className="mt-8">
              <HeroCTAButton {...cta} variant={cta.variant || 'primary'} size={cta.size || 'medium'} />
            </div>
          )}
          {children}
        </div>
      </Container>
    </Section>
  );
}
