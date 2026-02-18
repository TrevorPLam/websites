// File: packages/features/src/search/components/SearchPage.tsx  [TRACE:FILE=packages.features.search.SearchPage]
// Purpose: Full-page search view with URL-synced query (?q=). Uses semantic
//          tokens (primary) instead of hardcoded colors. Consistent filtering
//          with SearchDialog.
//
// Exports / Entry: SearchPage component (default export)
// Used by: /search page route
//
// Invariants:
// - Must sync with ?q= search param for shareable URLs
// - Filtering must match SearchDialog (filterSearchItems)
// - Must use semantic theme tokens per Task 0.22
//
// Status: @public
// Features:
// - [FEAT:SEARCH] Full-page search results
// - [FEAT:SEO] Searchable page with metadata
// - [FEAT:UX] URL-synced query state

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { filterSearchItems } from '../lib/filter-items';
import type { SearchItem } from '../types';

export interface SearchPageProps {
  items: SearchItem[];
  /** Heading text for the search section */
  heading?: string;
  /** Subheading/description text */
  subheading?: string;
  /** Placeholder for search input */
  placeholder?: string;
}

export default function SearchPage({
  items,
  heading = 'Search the site',
  subheading = 'Find blog posts, service pages, and helpful resources in seconds.',
  placeholder = 'Search blog posts, services, and pages',
}: SearchPageProps) {
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(defaultQuery);

  const filteredItems = useMemo(
    () => filterSearchItems(items, query, 10),
    [items, query]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">{heading}</h1>
            <p className="mt-4 text-lg text-white/90">{subheading}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
            <label htmlFor="site-search" className="sr-only">
              Search
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
              <input
                id="site-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Search"
              />
            </div>

            <div className="mt-6">
              {filteredItems.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No results found. Try a different keyword.
                </p>
              ) : (
                <ul className="space-y-4">
                  {filteredItems.map((item) => (
                    <li key={item.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className="text-lg font-semibold text-gray-900 hover:text-primary"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs uppercase tracking-wide text-primary">
                          {item.type}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
