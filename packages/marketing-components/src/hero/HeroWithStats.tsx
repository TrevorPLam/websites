/**
 * @file packages/marketing-components/src/hero/HeroWithStats.tsx
 * @role component
 * @summary Hero with statistics display
 *
 * Hero variant that includes statistics/metrics display.
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { BaseHeroProps, HeroCTA, HeroDualCTA, HeroStat } from './types';
import { HeroCTAButton } from './hero/cta';

export interface HeroWithStatsProps extends BaseHeroProps {
  /** Statistics to display */
  stats: HeroStat[];
  /** Single CTA button */
  cta?: HeroCTA;
  /** Dual CTA buttons */
  dualCta?: HeroDualCTA;
}

/**
 * Hero section with statistics display.
 *
 * @param props - HeroWithStatsProps
 * @returns Hero section component
 */
export function HeroWithStats({
  title,
  subtitle,
  description,
  stats,
  cta,
  dualCta,
  className,
  children,
}: HeroWithStatsProps) {
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
          {stats.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <div className="text-4xl font-bold sm:text-5xl">{stat.value}</div>
                  <div className="mt-2 text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
