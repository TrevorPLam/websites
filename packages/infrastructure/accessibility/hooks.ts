// File: packages/infra/accessibility/hooks.ts  [TRACE:FILE=packages.infra.accessibility.hooks]
// Purpose: React hooks wrapping the accessibility utilities in this module.
//          Provides useAria, useKeyboard, useScreenReader, usePrefersReducedMotion,
//          useFocusTrap, and useRovingTabIndex.
//
// System role: Client-safe — React hooks for use in 'use client' components.
// Assumptions: React 19 (hooks API stable). No 'use server' — hooks are always client-only.
//
// Exports: useAria, useKeyboard, useScreenReader, usePrefersReducedMotion,
//          useFocusTrap, useRovingTabIndex
//
// Invariants:
// - Hooks must not be called in Server Components (React will throw)
// - useFocusTrap calls cleanup on unmount via useEffect return
// - useRovingTabIndex is effect-free — it returns pure update functions
//
// Status: @public
// Features:
// - [FEAT:ACCESSIBILITY] React hooks for keyboard, ARIA, and screen-reader patterns

'use client';

import * as React from 'react';
import { generateAriaId, labelledBy, describedBy } from './aria';
import {
  trapFocus,
  createRovingTabIndex,
  getArrowKeyIndex,
  type ArrowKeyOptions,
} from './keyboard';
import { announce, prefersReducedMotion } from './screen-reader';

// ─── useAria ─────────────────────────────────────────────────────────────────

export interface UseAriaReturn {
  /** Stable ID for the labelled element */
  labelId: string;
  /** Stable ID for the description element */
  descriptionId: string;
  /** aria-labelledby attr object pointing to labelId */
  labelledByProps: ReturnType<typeof labelledBy>;
  /** aria-describedby attr object pointing to descriptionId */
  describedByProps: ReturnType<typeof describedBy>;
}

/**
 * Generate stable ARIA ID pair for label + description and return the
 * corresponding attribute objects for spreading onto JSX.
 *
 * @example
 * const { labelId, labelledByProps, describedByProps } = useAria('dialog');
 * <dialog {...labelledByProps} {...describedByProps}>
 *   <h2 id={labelId}>Title</h2>
 * </dialog>
 */
export function useAria(prefix = 'aria'): UseAriaReturn {
  const id = React.useId();
  const labelId = `${prefix}-label-${id}`;
  const descriptionId = `${prefix}-desc-${id}`;

  return React.useMemo(
    () => ({
      labelId,
      descriptionId,
      labelledByProps: labelledBy(labelId),
      describedByProps: describedBy(descriptionId),
    }),
    [labelId, descriptionId]
  );
}

// ─── useKeyboard ─────────────────────────────────────────────────────────────

export interface UseKeyboardOptions {
  /** Map of key names to handlers */
  keyHandlers: Partial<Record<string, (event: KeyboardEvent) => void>>;
  /** Whether to call preventDefault for handled keys (default: true) */
  preventDefault?: boolean;
}

/**
 * Attach a key-to-handler map to a DOM element via ref.
 * Automatically cleans up on unmount.
 *
 * @example
 * const ref = useKeyboard({
 *   keyHandlers: {
 *     Escape: () => setOpen(false),
 *     Enter: () => handleSubmit(),
 *   },
 * });
 * <div ref={ref} tabIndex={-1}>…</div>
 */
export function useKeyboard<T extends HTMLElement = HTMLElement>(
  opts: UseKeyboardOptions
): React.RefCallback<T> {
  const { keyHandlers, preventDefault = true } = opts;
  const handlersRef = React.useRef(keyHandlers);
  handlersRef.current = keyHandlers;

  return React.useCallback(
    (el: T | null) => {
      if (!el) return;

      function onKeyDown(event: KeyboardEvent) {
        const handler = handlersRef.current[event.key];
        if (handler) {
          if (preventDefault) event.preventDefault();
          handler(event);
        }
      }

      el.addEventListener('keydown', onKeyDown);
      return () => el.removeEventListener('keydown', onKeyDown);
    },
    [preventDefault]
  );
}

// ─── useScreenReader ─────────────────────────────────────────────────────────

/**
 * Returns a typed `announce` function bound to 'polite' or 'assertive'.
 * Useful for announcing status changes without managing live-region DOM directly.
 *
 * @example
 * const { announcePolite, announceAssertive } = useScreenReader();
 * announcePolite('Item saved');
 * announceAssertive('Error: Session expired');
 */
export function useScreenReader() {
  const announcePolite = React.useCallback(
    (message: string, clearAfter?: number) => announce(message, 'polite', clearAfter),
    []
  );
  const announceAssertive = React.useCallback(
    (message: string, clearAfter?: number) => announce(message, 'assertive', clearAfter),
    []
  );
  return { announcePolite, announceAssertive };
}

// ─── usePrefersReducedMotion ─────────────────────────────────────────────────

/**
 * Reactively returns whether the user prefers reduced motion.
 * Subscribes to the matchMedia change event so the value updates without reload.
 *
 * @example
 * const reduced = usePrefersReducedMotion();
 * <div style={{ transition: reduced ? 'none' : 'opacity 200ms' }}>…</div>
 */
export function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = React.useState(prefersReducedMotion);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return matches;
}

// ─── useFocusTrap ────────────────────────────────────────────────────────────

/**
 * Trap focus inside a container when `active` is true.
 * Restores focus to the previously focused element when deactivated.
 *
 * @example
 * const trapRef = useFocusTrap(isDialogOpen);
 * <div ref={trapRef}>…</div>
 */
export function useFocusTrap(active: boolean): React.RefCallback<HTMLElement> {
  const cleanupRef = React.useRef<(() => void) | null>(null);

  return React.useCallback(
    (el: HTMLElement | null) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (el && active) {
        cleanupRef.current = trapFocus(el);
      }
    },
    [active]
  );
}

// ─── useRovingTabIndex ───────────────────────────────────────────────────────

export interface UseRovingTabIndexReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  /** Call on arrow key events inside the composite widget */
  handleArrowKey: (
    event: KeyboardEvent,
    opts: Omit<ArrowKeyOptions, 'elements' | 'currentIndex'>
  ) => void;
  /** Ref callback — attach to the container to gather child elements */
  containerRef: React.RefCallback<HTMLElement>;
}

/**
 * Manage roving tabindex for a composite widget (listbox, toolbar, menu).
 * Tracks active index in state and applies tabIndex to children matching `itemSelector`.
 *
 * @param itemSelector - CSS selector for interactive items within the container
 * @param initialIndex - Which item starts active
 *
 * @example
 * const { activeIndex, containerRef, handleArrowKey } = useRovingTabIndex('[role="option"]');
 * <ul ref={containerRef} role="listbox">…</ul>
 */
export function useRovingTabIndex(
  itemSelector = '[role="option"],[role="menuitem"],[role="tab"]',
  initialIndex = 0
): UseRovingTabIndexReturn {
  const [activeIndex, setActiveIndexState] = React.useState(initialIndex);
  const elementsRef = React.useRef<HTMLElement[]>([]);
  const setIndexFnRef = React.useRef<((i: number) => void) | null>(null);

  const containerRef = React.useCallback(
    (container: HTMLElement | null) => {
      if (!container) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      elementsRef.current = items;
      setIndexFnRef.current = createRovingTabIndex(items, activeIndex);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemSelector]
  );

  const setActiveIndex = React.useCallback((index: number) => {
    setActiveIndexState(index);
    setIndexFnRef.current?.(index);
  }, []);

  const handleArrowKey = React.useCallback(
    (event: KeyboardEvent, opts: Omit<ArrowKeyOptions, 'elements' | 'currentIndex'>) => {
      const next = getArrowKeyIndex(event, {
        elements: elementsRef.current,
        currentIndex: activeIndex,
        ...opts,
      });
      if (next !== null) {
        event.preventDefault();
        setActiveIndex(next);
      }
    },
    [activeIndex, setActiveIndex]
  );

  return { activeIndex, setActiveIndex, handleArrowKey, containerRef };
}

// ─── Re-export stable ID generator for convenience ────────────────────────────
export { generateAriaId };
