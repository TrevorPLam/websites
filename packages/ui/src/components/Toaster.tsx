'use client';

// File: packages/ui/src/components/Toaster.tsx  [TRACE:FILE=packages.ui.components.Toaster]
// Purpose: App-root toast container that renders the Sonner toast stack. Mount once inside
//          the root layout (e.g. app/layout.tsx) to enable toast notifications site-wide.
//
// Relationship: Wraps `sonner`'s <Toaster> with design-system defaults. Pairs with Toast.tsx.
// System role: Notification render target (Layer L2 @repo/ui); must be a single instance per app.
// Assumptions: tailwindcss with CSS custom properties (--primary, etc.) available in host.
//              `next-themes` or equivalent theme provider is optional for dark-mode support.
//
// Exports / Entry: Toaster component, ToasterProps
// Used by: Client root layouts (app/layout.tsx)
//
// Invariants:
// - Exactly one Toaster instance per application
// - Position defaults to bottom-right; consumers override via `position` prop
// - richColors uses design-system semantic tokens (Tailwind CSS variables)
//
// Status: @public
// Features:
// - [FEAT:UI] Toast container with 6 positions and rich color support
// - [FEAT:DESIGN] Design-system color integration via richColors + toastOptions
// - [FEAT:ACCESSIBILITY] ARIA live regions managed by Sonner
// - [FEAT:ANIMATION] Slide/fade animations with prefers-reduced-motion support

import { Toaster as SonnerToaster } from 'sonner';
import type { ToasterProps as SonnerToasterProps } from 'sonner';

// [TRACE:TYPE=packages.ui.components.Toaster.ToasterProps]
// [FEAT:UI]
// Extends Sonner's own props — consumers can pass all Sonner options directly.
export type ToasterProps = SonnerToasterProps;

// [TRACE:FUNC=packages.ui.components.Toaster]
// [FEAT:UI] [FEAT:DESIGN] [FEAT:ACCESSIBILITY]
// NOTE: Thin wrapper that applies project defaults:
//       - position: bottom-right (override via prop)
//       - richColors: true (maps success/error/warning/info to design-system tokens)
//       - closeButton: true (visible dismiss affordance for keyboard users)
//       - expand: true (show all queued toasts, not just the top one)
export const Toaster = ({
  position = 'bottom-right',
  richColors = true,
  closeButton = true,
  expand = true,
  ...props
}: ToasterProps) => {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      expand={expand}
      toastOptions={{
        classNames: {
          toast:
            'font-sans text-sm rounded-lg border shadow-lg bg-background text-foreground border-border',
          title: 'font-semibold',
          description: 'text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium',
          cancelButton: 'bg-muted text-muted-foreground rounded-md px-3 py-1 text-xs font-medium',
          closeButton: 'text-muted-foreground hover:text-foreground',
        },
      }}
      {...props}
    />
  );
};

Toaster.displayName = 'Toaster';
