'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { SearchItem } from '@/lib/search'

interface SearchPageProps {
  items: SearchItem[]
  initialQuery?: string
}

export default function SearchPage({ items, initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return items.slice(0, 10)
    }

    return items.filter((item) => {
      const haystack = [item.title, item.description, item.tags?.join(' ') ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalized)
    })
  }, [items, query])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Search the site</h1>
            <p className="mt-4 text-lg text-white/90">
              Find blog posts, service pages, and helpful resources in seconds.
            </p>
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blog posts, services, and pages"
                className="w-full text-base text-gray-900 focus:outline-none"
              />
            </div>

            <div className="mt-6">
              {filteredItems.length === 0 ? (
                <p className="text-sm text-gray-500">No results found. Try a different keyword.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredItems.map((item) => (
                    <li key={item.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <Link href={item.href} className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </Link>
                        <span className="text-xs uppercase tracking-wide text-purple-600">
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
  )
}
