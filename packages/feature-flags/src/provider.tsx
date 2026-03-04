/**
 * @file packages/feature-flags/src/provider.tsx
 * @summary React context provider for tenant feature flags.
 * @description Reads the `x-feature-flags` header injected by the Edge
 *   middleware and makes the resolved flag map available throughout the
 *   React component tree via a context.
 *
 *   **Server Components** should call {@link readFeatureFlagsFromHeaders}
 *   directly with the `headers()` value from `next/headers` and pass the
 *   result to `<FeatureFlagProvider>`.
 *
 *   **Client Components** receive the flags from the nearest
 *   `<FeatureFlagProvider>` ancestor rendered by a Server Component.
 *
 * @example
 * ```tsx
 * // app/layout.tsx (Server Component)
 * import { headers } from 'next/headers';
 * import { FeatureFlagProvider, readFeatureFlagsFromHeaders } from '@repo/feature-flags/provider';
 *
 * export default async function RootLayout({ children }) {
 *   const flags = readFeatureFlagsFromHeaders(await headers());
 *   return (
 *     <html>
 *       <body>
 *         <FeatureFlagProvider flags={flags}>{children}</FeatureFlagProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @security Flag values are read from `x-feature-flags` header injected by middleware; never accept raw flag state from untrusted client input.
 * @adr none
 * @requirements TASK-011
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { FeatureFlag } from './feature-flags';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Resolved flag map: flag name → boolean. */
export type ResolvedFlags = Partial<Record<FeatureFlag, boolean>>;

interface FeatureFlagContextValue {
  flags: ResolvedFlags;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FeatureFlagContext = createContext<FeatureFlagContextValue>({ flags: {} });

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface FeatureFlagProviderProps {
  /** Resolved flags from the server (injected by Edge middleware). */
  flags: ResolvedFlags;
  children: ReactNode;
}

/**
 * Provides the resolved feature-flag map to the component subtree.
 * Render this once near the root layout (Server Component side) and pass
 * the `flags` object returned by {@link readFeatureFlagsFromHeaders}.
 */
export function FeatureFlagProvider({ flags, children }: FeatureFlagProviderProps): ReactNode {
  return <FeatureFlagContext.Provider value={{ flags }}>{children}</FeatureFlagContext.Provider>;
}

// ─── Consumer hooks ───────────────────────────────────────────────────────────

/**
 * Returns the entire resolved flag map for the current tenant.
 * Must be used inside a `<FeatureFlagProvider>`.
 */
export function useFeatureFlags(): ResolvedFlags {
  return useContext(FeatureFlagContext).flags;
}

/**
 * Returns `true` if the specified feature flag is enabled for the current tenant.
 * Falls back to `false` when the flag is absent from the resolved map.
 *
 * @example
 * ```tsx
 * function BookingButton() {
 *   const enabled = useFlag('booking_calendar');
 *   if (!enabled) return null;
 *   return <Button>Book Now</Button>;
 * }
 * ```
 */
export function useFlag(flag: FeatureFlag): boolean {
  const { flags } = useContext(FeatureFlagContext);
  return flags[flag] ?? false;
}

// ─── Server-side helpers ──────────────────────────────────────────────────────

/**
 * Parse the `x-feature-flags` header injected by Edge middleware into a
 * typed {@link ResolvedFlags} map.
 *
 * This function is safe to call in Server Components and Server Actions.
 * Returns an empty object when the header is absent (e.g. local dev without
 * the full middleware stack).
 *
 * @param headersList - The `ReadonlyHeaders` object from `next/headers`.
 */
export function readFeatureFlagsFromHeaders(headersList: {
  get(name: string): string | null;
}): ResolvedFlags {
  const raw = headersList.get('x-feature-flags');
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as ResolvedFlags;
    }
    return {};
  } catch {
    return {};
  }
}
