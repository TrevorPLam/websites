'use client';

/**
 * @file packages/marketing-components/src/testimonials/TestimonialMarquee.tsx
 * @role component
 * @summary Infinite scroll testimonial marquee
 */

import { Section } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Testimonial } from './types';

export interface TestimonialMarqueeProps {
  /** Testimonials */
  testimonials: Testimonial[];
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
  /** Custom CSS class name */
  className?: string;
}

function getContent(t: Testimonial): string {
  return t.quote ?? t.content ?? '';
}

export function TestimonialMarquee({
  testimonials,
  speed = 'normal',
  className,
}: TestimonialMarqueeProps) {
  const speedClass =
    speed === 'slow'
      ? 'animate-[marquee_30s_linear_infinite]'
      : speed === 'fast'
        ? 'animate-[marquee_15s_linear_infinite]'
        : 'animate-[marquee_20s_linear_infinite]';

  return (
    <Section className={cn('overflow-hidden', className)}>
      <div className={cn('flex gap-8', speedClass)}>
        {[...testimonials, ...testimonials].map((t, i) => (
          <div key={`${t.id}-${i}`} className="flex shrink-0 items-center gap-4">
            <blockquote className="max-w-sm text-sm italic">"{getContent(t)}"</blockquote>
            <cite className="text-xs not-italic text-muted-foreground">— {t.author.name}</cite>
          </div>
        ))}
      </div>
    </Section>
  );
}
