/**
 * @file apps/web/src/widgets/ab-test-wrapper/ui/ABTestWrapper.tsx
 * @summary Client component that renders a child slot based on the visitor's
 *   assigned A/B experiment variant.
 * @description Reads the `X-AB-Assignments` header injected by edge middleware
 *   (`packages/infrastructure/experiments/ab-testing.ts`) to determine which
 *   variant the current visitor is assigned to, then renders the matching
 *   child slot. Falls back to the `control` slot when no assignment exists.
 *
 *   Usage pattern — the parent page passes one React node per variant:
 *
 *   ```tsx
 *   <ABTestWrapper
 *     experimentId="hero-layout-test-v1"
 *     slots={{
 *       control: <HeroBanner headline="Original headline" />,
 *       variant_b: <HeroBanner headline="New shorter headline" />,
 *     }}
 *   />
 *   ```
 *
 *   The component also fires an impression event via a lightweight
 *   beacon (`navigator.sendBeacon`) so the experiment can track exposure
 *   without blocking the render.
 *
 * @security The experiment ID and variant ID are client-visible but contain
 *   no tenant-sensitive data. The impression endpoint validates tenant context
 *   server-side via the session cookie.
 * @requirements TASK-AI-004-REV
 */

'use client';

import React, { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ABTestWrapperProps {
  /** Matches the experiment `id` stored in Supabase / Edge Config. */
  experimentId: string;
  /**
   * Map of variantId → React node.
   * Must include a `control` key as the fallback.
   */
  slots: Record<string, React.ReactNode>;
  /**
   * Override the assigned variant. Useful for visual regression tests or
   * admin previews that want to force a specific variant.
   */
  forceVariant?: string;
  /**
   * Disable impression tracking. Set to `true` in unit tests or admin preview
   * contexts where impressions should not pollute experiment data.
   */
  trackImpressions?: boolean;
  /** Optional CSS class applied to the wrapper `<div>`. */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ABTestWrapper renders the correct variant for the current visitor and fires
 * an impression tracking beacon.
 */
export function ABTestWrapper({
  experimentId,
  slots,
  forceVariant,
  trackImpressions = true,
  className,
}: ABTestWrapperProps): React.ReactElement {
  const trackedRef = useRef(false);

  // Resolve the assigned variant from the meta tag injected by middleware,
  // or fall back to 'control'.
  const assignedVariant = resolveVariant(experimentId, forceVariant);
  const content = slots[assignedVariant] ?? slots['control'] ?? null;

  // Fire impression beacon once per mount
  useEffect(() => {
    if (!trackImpressions || trackedRef.current) return;
    trackedRef.current = true;

    fireImpression(experimentId, assignedVariant);
  }, [experimentId, assignedVariant, trackImpressions]);

  return (
    <div
      data-experiment-id={experimentId}
      data-variant-id={assignedVariant}
      className={className}
    >
      {content}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve the variant for this visitor from a `<meta>` tag injected by the
 * edge middleware, or return `forceVariant` / `'control'` as fallback.
 *
 * The middleware injects:
 * `<meta name="ab-assignments" content='{"exp123":"variant_b"}' />`
 *
 * We read from a meta tag (rather than cookies or headers) so that this client
 * component doesn't need any server-side context — SSR renders the correct
 * variant, and hydration picks up the same assignment.
 */
function resolveVariant(experimentId: string, forceVariant?: string): string {
  if (forceVariant) return forceVariant;

  if (typeof document === 'undefined') return 'control';

  try {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="ab-assignments"]');
    if (!meta?.content) return 'control';

    const assignments = JSON.parse(meta.content) as Record<string, unknown>;
    const variant = assignments[experimentId];
    return typeof variant === 'string' ? variant : 'control';
  } catch (err) {
    // Log parse errors in development to aid debugging assignment resolution issues
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ABTestWrapper] Failed to parse ab-assignments meta tag:', err);
    }
    return 'control';
  }
}

/**
 * Send a non-blocking impression beacon to `/api/experiments/impression`.
 * Falls back silently if `sendBeacon` is unavailable.
 */
function fireImpression(experimentId: string, variantId: string): void {
  try {
    const payload = JSON.stringify({ experimentId, variantId });
    const blob = new Blob([payload], { type: 'application/json' });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/experiments/impression', blob);
    } else {
      // Graceful degradation: fire-and-forget fetch
      fetch('/api/experiments/impression', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Never throw from impression tracking
  }
}
