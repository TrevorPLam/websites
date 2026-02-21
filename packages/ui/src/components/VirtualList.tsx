// File: packages/ui/src/components/VirtualList.tsx  [TRACE:FILE=packages.ui.components.VirtualList]
// Purpose: Virtualized list for large datasets.
//          Built on react-window or @tanstack/react-virtual for efficient rendering.
//
// Relationship: Depends on react-window or @tanstack/react-virtual, @repo/utils (cn).
// System role: Performance primitive (Layer L2 @repo/ui).
// Assumptions: Used for large lists. Supports dynamic heights.
//
// Exports / Entry: VirtualList, VirtualListProps
// Used by: Large data tables, long lists, search results
//
// Invariants:
// - Uses existing virtualization library
// - Supports dynamic heights
//
// Status: @public
// Features:
// - [FEAT:UI] Virtualized rendering
// - [FEAT:UI] Dynamic heights support
// - [FEAT:PERFORMANCE] Efficient rendering of large datasets

import * as React from 'react';
/// <reference path="../shims/react-window.d.ts" />
import { FixedSizeList, VariableSizeList, ListChildComponentProps } from 'react-window';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VirtualListProps<T = unknown> {
  /** Items to render */
  items: T[];
  /** Height of the list container */
  height: number;
  /** Height of each item (for fixed _size) */
  itemHeight?: number;
  /** Function to get item height (for variable _size) */
  getItemHeight?: (index: number) => number;
  /** Render function for each item */
  renderItem: (props: { item: T; index: number; style: React.CSSProperties }) => React.ReactNode;
  /** Width of the list */
  width?: number | string;
  /** Overscan count */
  overscanCount?: number;
  /** Class name */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VirtualList<T = unknown>({
  items,
  height,
  itemHeight,
  getItemHeight,
  renderItem,
  width = '100%',
  overscanCount = 5,
  className,
}: VirtualListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    if (!item) return null;
    return <div style={style}>{renderItem({ item, index, style })}</div>;
  };

  if (itemHeight) {
    return (
      <FixedSizeList
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscanCount}
        className={className}
      >
        {Row}
      </FixedSizeList>
    );
  }

  if (getItemHeight) {
    return (
      <VariableSizeList
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={getItemHeight}
        overscanCount={overscanCount}
        className={className}
      >
        {Row}
      </VariableSizeList>
    );
  }

  // Fallback: render all items if no height specified
  return (
    <div className={cn('overflow-auto', className)} style={{ height, width }}>
      {items.map((item, index) => renderItem({ item, index, style: {} }))}
    </div>
  );
}
