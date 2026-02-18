// File: packages/infra/accessibility/screen-reader.ts  [TRACE:FILE=packages.infra.accessibility.screen-reader]
// Purpose: Screen reader utilities for announcing dynamic content and managing
//          visually-hidden text in WCAG-conformant ways.
//
// System role: Client-safe — no server imports.
// Assumptions: DOM is available (browser environment).
//
// Exports: announce, clearAnnouncements, visuallyHiddenStyles, VisuallyHiddenProps,
//          prefersReducedMotion, getMotionSafeTransition
//
// Invariants:
// - announce() creates a live region in <body> on first call; it is reused thereafter
// - Live regions must be present in the DOM before content is injected for AT to detect them
// - visuallyHiddenStyles clips content without display:none so AT can still read it
//
// Status: @public
// Features:
// - [FEAT:ACCESSIBILITY] AT announcement utilities and visually-hidden patterns

// ─── Live region announcer ────────────────────────────────────────────────────

let _politeRegion: HTMLElement | null = null;
let _assertiveRegion: HTMLElement | null = null;

function ensureRegion(politeness: 'polite' | 'assertive'): HTMLElement {
  if (politeness === 'assertive') {
    if (!_assertiveRegion) {
      _assertiveRegion = document.createElement('div');
      _assertiveRegion.setAttribute('aria-live', 'assertive');
      _assertiveRegion.setAttribute('aria-atomic', 'true');
      _assertiveRegion.setAttribute('aria-relevant', 'additions text');
      Object.assign(_assertiveRegion.style, visuallyHiddenStyles);
      document.body.appendChild(_assertiveRegion);
    }
    return _assertiveRegion;
  }

  if (!_politeRegion) {
    _politeRegion = document.createElement('div');
    _politeRegion.setAttribute('aria-live', 'polite');
    _politeRegion.setAttribute('aria-atomic', 'true');
    _politeRegion.setAttribute('aria-relevant', 'additions text');
    Object.assign(_politeRegion.style, visuallyHiddenStyles);
    document.body.appendChild(_politeRegion);
  }
  return _politeRegion;
}

/**
 * Announce a message to screen readers via a live region.
 *
 * @param message     - Text to announce
 * @param politeness  - 'polite' for status updates; 'assertive' for errors (WCAG 4.1.3)
 * @param clearAfter  - ms after which to clear the region (default: 5000; 0 = never)
 *
 * @example
 * announce('Form submitted successfully');
 * announce('Session expired. Please log in.', 'assertive');
 */
export function announce(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite',
  clearAfter = 5000
): void {
  if (typeof document === 'undefined') return;

  const region = ensureRegion(politeness);

  // Clear then set to ensure AT fires even for identical messages
  region.textContent = '';

  // Defer injection so AT registers the cleared state first
  requestAnimationFrame(() => {
    region.textContent = message;
    if (clearAfter > 0) {
      setTimeout(() => {
        region.textContent = '';
      }, clearAfter);
    }
  });
}

/**
 * Clear all live region announcements immediately.
 * Useful on route change to stop lingering announcements.
 */
export function clearAnnouncements(): void {
  if (_politeRegion) _politeRegion.textContent = '';
  if (_assertiveRegion) _assertiveRegion.textContent = '';
}

// ─── Visually hidden ─────────────────────────────────────────────────────────

/**
 * CSS property set that hides content visually while keeping it accessible to AT.
 * Apply via `Object.assign(el.style, visuallyHiddenStyles)` or spread into a style prop.
 *
 * Per WCAG Technique C7 — do NOT use `display:none` or `visibility:hidden`
 * as those also hide from AT.
 */
export const visuallyHiddenStyles: Readonly<Partial<CSSStyleDeclaration>> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

/**
 * Tailwind CSS class string for visually-hidden elements.
 * Use when you cannot directly set inline styles.
 */
export const VISUALLY_HIDDEN_CLASS =
  'absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0';

// ─── Props helper for React ───────────────────────────────────────────────────

/**
 * Props type for a visually-hidden span/div in React.
 * Spread onto the element to keep content accessible but invisible.
 *
 * @example
 * <span {...visuallyHiddenProps}>Submit form</span>
 */
export interface VisuallyHiddenProps {
  style: Readonly<Partial<CSSStyleDeclaration>>;
}

export const visuallyHiddenProps: VisuallyHiddenProps = {
  style: visuallyHiddenStyles,
};

// ─── Motion preferences ───────────────────────────────────────────────────────

/**
 * Returns true if the user has requested reduced motion (WCAG 2.3.3).
 * Safe to call on the server — returns `false` when `window` is unavailable.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns a CSS transition string that is empty when reduced motion is preferred.
 *
 * @example
 * el.style.transition = getMotionSafeTransition('opacity 200ms ease');
 */
export function getMotionSafeTransition(transition: string): string {
  return prefersReducedMotion() ? '' : transition;
}
