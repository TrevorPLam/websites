import type { Metadata } from 'next'
import SearchPage from '@/components/SearchPage'
import { getSearchIndex } from '@/lib/search'

export const metadata: Metadata = {
  title: 'Search | Your Dedicated Marketer',
  description: 'Search blog posts, services, and marketing resources across the site.',
}

export default function SearchRoute({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : ''
  const items = getSearchIndex()

  return <SearchPage items={items} initialQuery={query} />
}
