/**
 * @file packages/page-templates/src/sections/blog/blog-pagination.tsx
 * Purpose: Blog pagination section adapter and registration.
 */
import * as React from 'react';
import { BlogPagination } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';

function BlogPaginationAdapter(props: SectionProps) {
  const searchParams = (props.searchParams ?? {}) as Record<string, string | string[] | undefined>;
  const page = Number(searchParams['page'] ?? 1);
  return React.createElement(BlogPagination, {
    currentPage: page,
    totalPages: 1,
    onPageChange: () => {},
  });
}

registerSection('blog-pagination', BlogPaginationAdapter);
