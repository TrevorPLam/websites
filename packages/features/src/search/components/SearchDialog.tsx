'use client';

// File: packages/features/src/search/components/SearchDialog.tsx  [TRACE:FILE=packages.features.search.SearchDialog]
// Purpose: Search dialog overlay providing site-wide search via Cmd/Ctrl+K shortcut.
//          Uses @repo/ui Dialog for accessibility (focus trap, ARIA, Escape). Renders
//          filtered search results with consistent semantics as SearchPage.
//
// Exports / Entry: SearchDialog component (default export)
// Used by: Navigation component, layout providers
//
// Invariants:
// - Must support Cmd/Ctrl+K and Escape keyboard shortcuts
// - Must use Dialog from @repo/ui for WCAG compliance
// - Filtering must match filterSearchItems semantics
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Site-wide search dialog
// - [FEAT:ACCESSIBILITY] Focus trap, keyboard nav via Dialog
// - [FEAT:UX] Keyboard shortcut (⌘K)

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogTitle, DialogHeader } from '@repo/ui';
import { filterSearchItems } from '../lib/filter-items';
import type { SearchItem } from '../types';

const shortcutHint = '⌘K';

export interface SearchDialogProps {
  items?: SearchItem[];
  variant?: 'desktop' | 'mobile';
  /** Placeholder text for search input */
  placeholder?: string;
}

export default function SearchDialog({
  items = [],
  variant = 'desktop',
  placeholder = 'Search blog posts, services, and pages',
}: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchItems, setSearchItems] = useState<SearchItem[]>(items);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setSearchItems(items);
    }
  }, [items]);

  const filteredItems = useMemo(
    () => filterSearchItems(searchItems, query, 6),
    [searchItems, query]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
        return;
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const buttonClasses =
    variant === 'mobile'
      ? 'text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      : 'inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-2 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClasses}
        aria-label="Open search"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        {variant === 'desktop' && (
          <span className="flex items-center gap-2 text-sm">
            <span>Search</span>
            <span className="hidden lg:inline-flex items-center rounded bg-white/20 px-2 py-0.5 text-xs font-semibold">
              {shortcutHint}
            </span>
          </span>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden" showCloseButton={false}>
          <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Search className="h-5 w-5" aria-hidden="true" />
              <DialogTitle className="font-semibold text-base m-0">Search the site</DialogTitle>
            </div>
            <Button
              variant="text"
              size="small"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogHeader>

          <div className="px-6 py-4">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search"
            />
          </div>

          <div className="px-6 pb-6">
            {filteredItems.length === 0 ? (
              <p className="text-sm text-gray-500">No results found. Try a different keyword.</p>
            ) : (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block rounded-lg border border-gray-200 px-4 py-3 transition hover:border-primary/30 hover:bg-primary/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{item.title}</span>
                        <span className="text-xs uppercase tracking-wide text-primary">
                          {item.type}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-xs text-gray-400">
              Tip: Press {shortcutHint} to open search anytime.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
