// File: components/Navigation.tsx  [TRACE:FILE=components.navigation]
// Purpose: Main navigation component providing site-wide navigation with mobile responsiveness,
//          search integration, and accessibility features. Handles active state detection,
//          mobile menu toggle, and focus management for keyboard navigation.
//
// Exports / Entry: Navigation component (default export)
// Used by: Root layout (app/layout.tsx) - appears on all pages
//
// Invariants:
// - Must be fully client-side rendered for pathname detection and mobile state
// - Mobile menu must trap focus and restore it on close for accessibility
// - Active path detection must handle trailing slashes and query parameters
// - Search integration must be optional (graceful degradation when disabled)
// - All interactive elements must be keyboard accessible
//
// Status: @public
// Features:
// - [FEAT:NAVIGATION] Site-wide navigation with active state
// - [FEAT:SEARCH] Integrated search dialog
// - [FEAT:ACCESSIBILITY] Focus management and keyboard navigation
// - [FEAT:UX] Mobile-responsive hamburger menu
// - [FEAT:PERFORMANCE] Memoized path normalization

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@repo/ui';
import { SearchDialog } from '@/features/search';
import type { SearchItem } from '@/lib/search';
import { cn } from '@/lib/utils';
import siteConfig from '@/site.config';

const { navLinks } = siteConfig;

/**
 * Navigation component props.
 *
 * @property searchItems - Search index from lib/search.ts (optional)
 */
interface NavigationProps {
  searchItems?: SearchItem[];
}

/**
 * Main navigation component.
 * Renders in root layout - appears on all pages.
 */
// [TRACE:FUNC=components.Navigation]
// [FEAT:NAVIGATION] [FEAT:SEARCH] [FEAT:ACCESSIBILITY] [FEAT:UX] [FEAT:PERFORMANCE]
// NOTE: Critical navigation component - handles all site navigation with accessibility and mobile support.
export default function Navigation({ searchItems }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const mobileToggleButtonRef = useRef<HTMLButtonElement | null>(null);

  // [TRACE:FUNC=components.normalizePath]
  // [FEAT:NAVIGATION]
  // NOTE: Critical for active state detection - handles trailing slashes and query parameters consistently.
  const normalizePath = (path: string) => {
    const [cleanPath] = path.split(/[?#]/);
    if (!cleanPath || cleanPath === '/') {
      return '/';
    }

    return cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
  };

  const activePath = useMemo(() => normalizePath(pathname ?? '/'), [pathname]);

  const isFileLink = (href: string) => {
    const lastSegment = href.split('/').pop();
    return Boolean(lastSegment && lastSegment.includes('.'));
  };

  const isActiveLink = (href: string) => {
    const normalizedHref = normalizePath(href);
    if (isFileLink(normalizedHref)) {
      return activePath === normalizedHref;
    }

    return activePath === normalizedHref || activePath.startsWith(`${normalizedHref}/`);
  };

  const getFocusableElements = () => {
    if (!mobileMenuRef.current) {
      return [];
    }

    return Array.from(
      mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      const focusTarget = mobileToggleButtonRef.current ?? lastFocusedElementRef.current;
      focusTarget?.focus();
      return;
    }

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();
  }, [isMobileMenuOpen]);

  return (
    <nav
      className="bg-secondary shadow-sm sticky top-0 z-50"
      role="navigation"
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-white/90 transition-colors"
          >
            {siteConfig.name.replace(' Template', '')}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-white/80 hover:text-white font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white border-b-2 border-transparent pb-1',
                  isActiveLink(link.href) && 'text-white border-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <SearchDialog items={searchItems} />
            <Link href="/book">
              <Button variant="primary" size="small">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchDialog items={searchItems} variant="mobile" />
            <button
              onClick={toggleMobileMenu}
              ref={mobileToggleButtonRef}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden bg-secondary border-t border-white/10"
          role="menu"
          aria-label="Mobile navigation"
          onKeyDown={(event) => {
            if (event.key !== 'Tab') {
              return;
            }

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) {
              return;
            }

            const firstElement = focusableElements[0];
            const lastElement =
              focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
            const activeElement = document.activeElement as HTMLElement | null;

            if (!firstElement || !lastElement) {
              return;
            }

            if (event.shiftKey && activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            } else if (!event.shiftKey && activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }}
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block text-white/80 hover:text-white font-semibold py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md px-2 -mx-2',
                  isActiveLink(link.href) && 'text-white bg-white/10'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} role="menuitem">
              <Button variant="primary" size="medium" className="w-full">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
