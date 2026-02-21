/**
 * @file packages/marketing-components/src/hero/hero/composition.tsx
 * @role component
 * @summary Composition helpers for hero components
 *
 * Provides composition slot components for hero sections.
 */

import * as React from 'react';
import { cn } from '@repo/utils';

/**
 * Hero header slot component
 */
export function HeroHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hero content slot component
 */
export function HeroContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hero footer slot component
 */
export function HeroFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-8', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hero background slot component
 */
export function HeroBackground({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hero overlay slot component
 */
export function HeroOverlaySlot({
  className,
  opacity = 0.5,
  color = 'black',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  opacity?: number;
  color?: string;
}) {
  return (
    <div
      className={cn('absolute inset-0 -z-10', className)}
      style={{
        backgroundColor: color,
        opacity,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Hero CTA area slot component
 */
export function HeroCTAArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}
