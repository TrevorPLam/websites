import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchPage from '@/features/search/components/SearchPage';
import { getSearchIndex } from '@/lib/search';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search blog posts, services, and hair care resources across the site.',
};

export default async function SearchRoute() {
  const items = await getSearchIndex();

  return (
    <Suspense>
      <SearchPage items={items} />
    </Suspense>
  );
}
