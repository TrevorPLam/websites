'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { SearchItem } from '@/lib/search'

interface SearchDialogProps {
  items: SearchItem[]
  variant?: 'desktop' | 'mobile'
}

const shortcutHint = '⌘K'

export default function SearchDialog({ items, variant = 'desktop' }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Case-insensitive substring match across title/description/tags; default to a small sample when empty to avoid overwhelming the dialog
  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return items.slice(0, 6)
    }

    return items.filter((item) => {
      const tagText = Array.isArray(item.tags)
        ? item.tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0).join(' ')
        : ''
      const haystack = [item.title, item.description, tagText]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalized)
    })
  }, [items, query])

  useEffect(() => {
    // Allow Cmd/Ctrl+K to open and Escape to close so the dialog matches site-wide shortcut expectations
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(true)
        return
      }

      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // WHY: focus immediately after the dialog renders to keep keyboard search deterministic.
      inputRef.current?.focus()
    } else {
      setQuery('')
    }
  }, [isOpen])

  const buttonClasses =
    variant === 'mobile'
      ? 'text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      : 'inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-2 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

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

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-20"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Search className="h-5 w-5" aria-hidden="true" />
                <span className="font-semibold">Search the site</span>
              </div>
              <Button
                variant="text"
                size="small"
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>

            <div className="px-6 py-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blog posts, services, and pages"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
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
                        className="block rounded-lg border border-gray-200 px-4 py-3 transition hover:border-purple-200 hover:bg-purple-50"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{item.title}</span>
                          <span className="text-xs uppercase tracking-wide text-purple-600">{item.type}</span>
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
          </div>
        </div>
      )}
    </>
  )
}
