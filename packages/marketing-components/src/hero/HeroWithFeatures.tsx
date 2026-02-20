'use client';

/**
 * @file packages/marketing-components/src/hero/HeroWithFeatures.tsx
 * @role component
 * @summary Hero with features display
 *
 * Hero variant that includes feature highlights.
 */

import { Card } from '@repo/ui';
import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroFeature } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroWithFeaturesProps extends BaseHeroProps {
  /** Features to display */
  features: HeroFeature[];
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Hero section with features display.
 *
 * @param props - HeroWithFeaturesProps
 * @returns Hero section component
 */
export function HeroWithFeatures({
  title,
  subtitle,
  description,
  features,
  cta,
  dualCta,
  className,
  children,
}: HeroWithFeaturesProps) {
  return (
    <Section className={cn('relative', className)}>
      <Container className="py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl md:text-2xl">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {features.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} variant="service">
                  {feature.icon && <div className="mb-4">{feature.icon}</div>}
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  {feature.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  )}
                </Card>
              ))}
            </div>
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
              <HeroCTAButton
                {...cta}
                variant={cta.variant || 'primary'}
                size={cta.size || 'large'}
              />
            ) : null}
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}
