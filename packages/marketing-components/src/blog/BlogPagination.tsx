/**
 * @file packages/marketing-components/src/blog/BlogPagination.tsx
 * @role component
 * @summary Blog pagination using @repo/ui Pagination
 */

import { Pagination } from '@repo/ui';
import type { PaginationConfig } from './types';

export function BlogPagination({ currentPage, totalPages, onPageChange }: PaginationConfig) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
