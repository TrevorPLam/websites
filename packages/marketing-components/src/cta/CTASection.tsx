/**
 * @file packages/marketing-components/src/cta/CTASection.tsx
 * @role component
 * @summary Call-to-action section component
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';

export interface CTASectionProps {
  /** Heading text */
  title: string;
  /** Supporting text */
  description?: string;
  /** Primary CTA */
  primaryCta: { label: string; href: string };
  /** Secondary CTA */
  secondaryCta?: { label: string; href: string };
  /** Variant */
  variant?: 'default' | 'subtle' | 'bold';
  /** Custom CSS class name */
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = 'default',
  className,
}: CTASectionProps) {
  const bgClass =
    variant === 'bold'
      ? 'bg-foreground text-background'
      : variant === 'subtle'
        ? 'bg-muted/50'
        : 'bg-muted';

  return (
    <Section className={cn(bgClass, className)}>
      <Container>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href={primaryCta.href}
              className={cn(
                'inline-flex min-h-[44px] items-center justify-center rounded-md px-8 text-lg font-semibold transition-all',
                variant === 'bold'
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {primaryCta.label}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border px-8 text-lg font-semibold transition-all hover:bg-accent"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
