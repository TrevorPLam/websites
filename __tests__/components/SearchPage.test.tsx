import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchPage from '@/components/SearchPage'
import type { SearchItem } from '@/lib/search'

let searchParamsState = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsState,
}))

const makeSearchItem = (overrides: Partial<SearchItem>): SearchItem => ({
  id: overrides.id ?? 'item-1',
  title: overrides.title ?? 'Default Title',
  description: overrides.description ?? 'Default description',
  href: overrides.href ?? '/default',
  type: overrides.type ?? 'Page',
  tags: overrides.tags,
})

describe('SearchPage', () => {
  it('renders matching results for the query (happy path)', () => {
    // Happy path: ensure substring search returns relevant results without extra noise.
    searchParamsState = new URLSearchParams('q=seo')

    render(
      <SearchPage
        items={[
          makeSearchItem({ id: 'seo', title: 'SEO Services', description: 'Grow organic traffic.' }),
          makeSearchItem({ id: 'content', title: 'Content Services', description: 'Build authority.' }),
        ]}
      />,
    )

    expect(screen.getByText('SEO Services')).toBeInTheDocument()
    expect(screen.queryByText('Content Services')).not.toBeInTheDocument()
  })

  it('limits results to the first 10 when query is empty (edge case)', () => {
    // Edge case: empty query should avoid overwhelming the UI with too many results.
    searchParamsState = new URLSearchParams()

    const items = Array.from({ length: 12 }, (_, index) =>
      makeSearchItem({
        id: `item-${index}`,
        title: `Result ${index}`,
        description: `Description ${index}`,
        href: `/result-${index}`,
      }),
    )

    render(<SearchPage items={items} />)

    expect(screen.getByText('Result 0')).toBeInTheDocument()
    expect(screen.getByText('Result 9')).toBeInTheDocument()
    expect(screen.queryByText('Result 10')).not.toBeInTheDocument()
    expect(screen.queryByText('No results found. Try a different keyword.')).not.toBeInTheDocument()
  })

  it('shows the empty state when no results match (error state)', () => {
    // Error state: when nothing matches (including missing tags), show a clear fallback message.
    searchParamsState = new URLSearchParams('q=nonexistent')

    render(
      <SearchPage
        items={[
          makeSearchItem({ id: 'page-1', title: 'Home', tags: undefined }),
          makeSearchItem({ id: 'page-2', title: 'About', tags: undefined }),
        ]}
      />,
    )

    expect(screen.getByText('No results found. Try a different keyword.')).toBeInTheDocument()
  })
})
