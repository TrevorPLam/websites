/**
 * @file packages/marketing-components/src/navigation/hooks.ts
 * @role hooks
 * @summary useMobileNavigation for responsive nav
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/** Breakpoint (px) below which mobile nav is shown. Default 768. */
const DEFAULT_BREAKPOINT = 768;

export function useMobileNavigation(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
      if (window.innerWidth >= breakpoint) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return { isMobile, isOpen, toggle, close, open };
}
