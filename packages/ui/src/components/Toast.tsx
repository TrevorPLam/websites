// File: packages/ui/src/components/Toast.tsx  [TRACE:FILE=packages.ui.components.Toast]
// Purpose: Re-export and extend Sonner's toast API for use across the monorepo.
//          Provides typed helper functions (toast.success, toast.error, toast.warning,
//          toast.info, toast.loading, toast.custom, toast.promise, toast.dismiss) and
//          a lightweight wrapper that matches the design system's color tokens.
//
// Relationship: Wraps `sonner` (catalog peer). Consumed by any package/template that
//              needs non-blocking notifications. Pairs with Toaster.tsx for rendering.
// System role: Notification primitive (Layer L2 @repo/ui).
// Assumptions: Toaster component is mounted once at the app root (layout.tsx).
//              Tailwind CSS custom properties for colors are available in the host app.
//
// Exports / Entry: toast (typed API), useToast hook
// Used by: @repo/features (BookingForm), client layouts
//
// Invariants:
// - toast.* calls are no-ops when Toaster is not mounted (Sonner handles gracefully)
// - All variants map to the design-system semantic color tokens
// - Must not introduce its own global state beyond Sonner's internal store
//
// Status: @public
// Features:
// - [FEAT:UI] Toast notification API with 6 variants
// - [FEAT:ACCESSIBILITY] ARIA live regions via Sonner
// - [FEAT:DESIGN] Design-system color token integration

import type * as React from 'react';
import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';

// [TRACE:TYPE=packages.ui.components.Toast.ToastOptions]
// Extends Sonner's ExternalToast to keep the API forward-compatible.
export type ToastOptions = ExternalToast;

// [TRACE:TYPE=packages.ui.components.Toast.ToastVariant]
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';

// [TRACE:TYPE=packages.ui.components.Toast.PromiseOptions]
// Sonner v2: PromiseData = Omit<ExternalToast, 'description'> & { loading?, success?, error? }.
// We model this explicitly so callers get accurate types and cannot accidentally
// pass `description` (which PromiseData omits) via the options bag.
export type PromiseToastOptions = Omit<ExternalToast, 'description'>;

// [TRACE:CONST=packages.ui.components.toast]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
// NOTE: Typed wrapper around Sonner. Each method maps to a semantic color variant.
// toast.promise is included for async operation feedback patterns.
export const toast = {
  /** Show a success notification (green). */
  success: (message: string, options?: ToastOptions) => sonnerToast.success(message, options),

  /** Show an error notification (red). */
  error: (message: string, options?: ToastOptions) => sonnerToast.error(message, options),

  /** Show a warning notification (amber). Maps to Sonner's warning if available, else info. */
  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning
      ? sonnerToast.warning(message, options)
      : sonnerToast(message, { ...options, className: 'toast-warning' }),

  /** Show an info notification (blue). */
  info: (message: string, options?: ToastOptions) => sonnerToast.info(message, options),

  /** Show a loading spinner notification. Returns the toast id for later dismissal. */
  loading: (message: string, options?: ToastOptions) => sonnerToast.loading(message, options),

  /** Show a custom JSX notification. */
  custom: (jsx: (id: string | number) => React.ReactElement, options?: ToastOptions) =>
    sonnerToast.custom(jsx, options),

  /**
   * Show a promise-driven notification that transitions between loading -> success | error.
   *
   * Sonner v2 API: `.promise(promise, data)` where `data` is a single object of shape
   * `PromiseData<T> = Omit<ExternalToast, 'description'> & { loading?, success?, error? }`.
   *
   * FIX (was: `sonnerToast.promise(promise, { ...messages, ...options })` which spread
   * `ExternalToast` — including the disallowed `description` field — directly into `data`,
   * causing a TypeScript type error and silently passing unknown keys to Sonner's internals).
   *
   * Correct form: spread messages and the narrowed `PromiseToastOptions` together so the
   * merged object satisfies `PromiseData<T>` exactly, with `description` excluded.
   *
   * @param promise  - The async operation to track
   * @param messages - Labels for each state: loading, success, error
   * @param options  - Additional Sonner toast options (description excluded per PromiseData)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    options?: PromiseToastOptions
  ) =>
    sonnerToast.promise(promise, {
      ...messages,
      ...options,
    }),

  /** Dismiss a specific toast by id, or all toasts when called without arguments. */
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),

  /** Dismiss all active toasts. */
  dismissAll: () => sonnerToast.dismiss(),
} as const;

// [TRACE:FUNC=packages.ui.components.useToast]
// [FEAT:UI]
// NOTE: Thin convenience hook — returns the typed toast API so callers don't need a
//       separate import from sonner. Use when the component is deeply nested.
export function useToast() {
  return { toast };
}
