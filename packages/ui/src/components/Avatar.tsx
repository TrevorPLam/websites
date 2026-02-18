// File: packages/ui/src/components/Avatar.tsx  [TRACE:FILE=packages.ui.components.Avatar]
// Purpose: User avatar with image, text/icon fallback, size variants, shape variants,
//          and an optional online/offline/away/busy status indicator ring. Built on
//          Radix UI Avatar for graceful image fallback (load error → initials → icon).
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Identity display primitive (Layer L2 @repo/ui).
// Assumptions: Radix handles image load/error states; AvatarFallback shows when image
//              fails to load or while loading.
//
// Exports / Entry: Avatar, AvatarImage, AvatarFallback + types
// Used by: User profile sections, team displays, comment threads, nav user menus
//
// Invariants:
// - Status indicator is decorative; screen readers receive status via aria-label on Avatar
// - Shape 'square' uses rounded-md; 'circle' uses rounded-full
//
// Status: @public
// Features:
// - [FEAT:UI] 4 sizes: sm | md | lg | xl
// - [FEAT:UI] 2 shapes: circle | square
// - [FEAT:UI] 4 status indicators: online | offline | away | busy
// - [FEAT:ACCESSIBILITY] Image alt text forwarded; fallback text for screen readers

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
}

export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;
export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

// ─── Style Maps ──────────────────────────────────────────────────────────────

// [TRACE:CONST=packages.ui.components.Avatar.sizeStyles]
const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

// [TRACE:CONST=packages.ui.components.Avatar.shapeStyles]
const shapeStyles: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

// [TRACE:CONST=packages.ui.components.Avatar.statusStyles]
const statusStyles: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

// [TRACE:CONST=packages.ui.components.Avatar.statusSizeStyles]
const statusSizeStyles: Record<AvatarSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
};

// ─── Components ──────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.Avatar]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = 'md', shape = 'circle', status, ...props }, ref) => (
  <span className="relative inline-flex">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex shrink-0 overflow-hidden',
        sizeStyles[size],
        shapeStyles[shape],
        className
      )}
      {...props}
    />
    {status && (
      <span
        aria-hidden="true"
        className={cn(
          'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
          statusStyles[status],
          statusSizeStyles[size]
        )}
      />
    )}
  </span>
));
Avatar.displayName = 'Avatar';

// [TRACE:FUNC=packages.ui.components.AvatarImage]
// [FEAT:UI]
export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

// [TRACE:FUNC=packages.ui.components.AvatarFallback]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
// NOTE: Renders initials or an icon when the image fails to load.
//       delayMs defaults to 600ms so a fast-loading image avoids the fallback flash.
export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, delayMs = 600, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    delayMs={delayMs}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-[inherit]',
      'bg-muted font-medium text-muted-foreground select-none',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';
