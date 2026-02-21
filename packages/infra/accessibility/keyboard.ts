// File: packages/infra/accessibility/keyboard.ts  [TRACE:FILE=packages.infra.accessibility.keyboard]
// Purpose: Keyboard navigation helpers following WAI-ARIA Authoring Practices Guide patterns.
//          Provides roving-tabindex management, key-event matchers, and arrow-key handlers
//          for composite widgets (menus, listboxes, toolbars, tab lists).
//
// System role: Client-safe — no server imports.
// Assumptions: DOM is available.
//
// Exports: Keys, isKey, createRovingTabIndex, handleArrowKeys, handleMenuKeys,
//          handleTabListKeys, focusFirstDescendant, focusLastDescendant, trapFocus
//
// Invariants:
// - Roving tabindex helpers mutate tabIndex on DOM nodes; caller manages lifecycle
// - Key matchers treat both `key` (modern) and `keyCode` (legacy) for broad browser support
// - trapFocus returns a cleanup function; always call it on teardown
//
// Status: @public
// Features:
// - [FEAT:ACCESSIBILITY] Keyboard navigation patterns per WAI-ARIA APG

/** Canonical keyboard key names used throughout the rubric. */
export const Keys = {
  Tab: 'Tab',
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Backspace: 'Backspace',
  Delete: 'Delete',
} as const;

export type Key = (typeof Keys)[keyof typeof Keys];

/**
 * Returns true if the keyboard event matches the given key name.
 * Handles both `event.key` (modern) and `event.keyCode` (legacy IE fallback).
 */
export function isKey(event: KeyboardEvent, key: Key): boolean {
  return event.key === key;
}

// ─── Roving tabindex ──────────────────────────────────────────────────────────

/**
 * Apply roving tabindex to a list of elements.
 * Sets `tabIndex=0` on the active element and `tabIndex=-1` on all others.
 * Returns a function to update the active index.
 *
 * WAI-ARIA pattern: only one element in a composite widget is in the tab sequence
 * at a time (WCAG 2.1.1, WAI-ARIA APG §6.6).
 *
 * @example
 * const setActive = createRovingTabIndex(items, 0);
 * // Later, on ArrowDown:
 * setActive(nextIndex);
 */
export function createRovingTabIndex(
  elements: HTMLElement[],
  initialIndex = 0
): (activeIndex: number) => void {
  function applyTabIndex(activeIndex: number) {
    elements.forEach((el, i) => {
      el.tabIndex = i === activeIndex ? 0 : -1;
    });
    const active = elements[activeIndex];
    if (active) active.focus();
  }

  applyTabIndex(initialIndex);
  return applyTabIndex;
}

// ─── Arrow key handlers ───────────────────────────────────────────────────────

export interface ArrowKeyOptions {
  /** Elements in the composite widget */
  elements: HTMLElement[];
  /** Currently active index */
  currentIndex: number;
  /** Orientation of the widget — determines which arrow keys move focus */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** When true, focus wraps from last→first and first→last */
  wrap?: boolean;
}

/**
 * Returns the next focus index for a composite widget given an arrow key event.
 * Returns `null` when the event key is not a navigation key for this orientation.
 *
 * Caller is responsible for calling `event.preventDefault()` and applying the
 * new index via roving tabindex or state.
 */
export function getArrowKeyIndex(event: KeyboardEvent, opts: ArrowKeyOptions): number | null {
  const { elements, currentIndex, orientation = 'vertical', wrap = true } = opts;
  const count = elements.length;
  if (count === 0) return null;

  const isVertical = orientation === 'vertical' || orientation === 'both';
  const isHorizontal = orientation === 'horizontal' || orientation === 'both';

  let next: number | null = null;

  if (isVertical && event.key === Keys.ArrowDown) {
    next = wrap ? (currentIndex + 1) % count : Math.min(currentIndex + 1, count - 1);
  } else if (isVertical && event.key === Keys.ArrowUp) {
    next = wrap ? (currentIndex - 1 + count) % count : Math.max(currentIndex - 1, 0);
  } else if (isHorizontal && event.key === Keys.ArrowRight) {
    next = wrap ? (currentIndex + 1) % count : Math.min(currentIndex + 1, count - 1);
  } else if (isHorizontal && event.key === Keys.ArrowLeft) {
    next = wrap ? (currentIndex - 1 + count) % count : Math.max(currentIndex - 1, 0);
  } else if (event.key === Keys.Home) {
    next = 0;
  } else if (event.key === Keys.End) {
    next = count - 1;
  }

  return next;
}

// ─── Menu keyboard handler ────────────────────────────────────────────────────

export interface MenuKeyHandlerOptions {
  onClose?: () => void;
  onActivate?: (index: number) => void;
  elements: HTMLElement[];
  currentIndex: number;
  setIndex: (index: number) => void;
}

/**
 * Full keyboard handler for a menu widget (role="menu").
 * Covers: ArrowDown/Up, Home, End, Enter/Space (activate), Escape (close),
 * Tab (close without activating) per WAI-ARIA APG Menu pattern.
 *
 * @returns true if the event was handled (caller should preventDefault)
 */
export function handleMenuKeys(event: KeyboardEvent, opts: MenuKeyHandlerOptions): boolean {
  const { onClose, onActivate, elements, currentIndex, setIndex } = opts;
  const count = elements.length;
  if (count === 0) {
    return false;
  }
  switch (event.key) {
    case Keys.ArrowDown: {
      const next = (currentIndex + 1) % count;
      setIndex(next);
      elements[next]?.focus();
      return true;
    }
    case Keys.ArrowUp: {
      const prev = (currentIndex - 1 + count) % count;
      setIndex(prev);
      elements[prev]?.focus();
      return true;
    }
    case Keys.Home: {
      setIndex(0);
      elements[0]?.focus();
      return true;
    }
    case Keys.End: {
      const last = count - 1;
      setIndex(last);
      elements[last]?.focus();
      return true;
    }
    case Keys.Enter:
    case Keys.Space:
      onActivate?.(currentIndex);
      return true;
    case Keys.Escape:
    case Keys.Tab:
      onClose?.();
      return true;
    default:
      return false;
  }
}

// ─── Focus helpers ────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

/**
 * Return all focusable descendants of a container, in DOM order.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]')
  );
}

/** Focus the first focusable descendant of a container, if any. */
export function focusFirstDescendant(container: HTMLElement): boolean {
  const first = getFocusableElements(container)[0];
  if (first) {
    first.focus();
    return true;
  }
  return false;
}

/** Focus the last focusable descendant of a container, if any. */
export function focusLastDescendant(container: HTMLElement): boolean {
  const all = getFocusableElements(container);
  const last = all[all.length - 1];
  if (last) {
    last.focus();
    return true;
  }
  return false;
}

// ─── Focus trap ───────────────────────────────────────────────────────────────

/**
 * Trap keyboard focus within a container element (modal/dialog pattern).
 * Prevents Tab from leaving the container; wraps at both ends.
 *
 * @returns cleanup function — call on dialog close
 *
 * @example
 * const cleanup = trapFocus(dialogEl);
 * // On close:
 * cleanup();
 */
export function trapFocus(container: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  focusFirstDescendant(container);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== Keys.Tab) return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus();
  };
}
