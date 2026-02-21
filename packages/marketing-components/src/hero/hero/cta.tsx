'use client';

/**
 * @file packages/marketing-components/src/hero/hero/cta.tsx
 * @role component
 * @summary CTA button/link component for hero sections
 *
 * Provides a unified CTA component that can render as button or link.
 */

import { Button } from '@repo/ui';
import { cn } from '@repo/utils';
import type { HeroCTA } from '../types';

export interface HeroCTAButtonProps extends HeroCTA {
  /** Render as button instead of link */
  asButton?: boolean;
  /** onClick handler (for button) */
  onClick?: () => void;
}

/**
 * CTA component that renders as link or button.
 *
 * @param props - HeroCTAButtonProps
 * @returns CTA component
 */
export function HeroCTAButton({
  label,
  href,
  variant = 'primary',
  size = 'large',
  asButton = false,
  onClick,
  ...props
}: HeroCTAButtonProps) {
  if (asButton || !href) {
    return (
      <Button variant={variant} size={size} onClick={onClick} {...props}>
        {label}
      </Button>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
        variant === 'secondary' &&
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs',
        variant === 'outline' &&
          'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        size === 'small' && 'min-h-[44px] h-10 px-4 text-sm',
        size === 'medium' && 'min-h-[44px] h-10 px-5 text-base',
        size === 'large' && 'min-h-[44px] h-12 px-8 text-lg'
      )}
      {...props}
    >
      {label}
    </a>
  );
}
