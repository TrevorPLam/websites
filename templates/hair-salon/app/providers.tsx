

'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Breadcrumbs from '@/components/Breadcrumbs';

// Client-only shell that wires global ErrorBoundary and breadcrumb trail around all pages
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Breadcrumbs provide global navigation context above page content. */}
        <Breadcrumbs />
        {children}
      </div>
    </ErrorBoundary>
  );
}
