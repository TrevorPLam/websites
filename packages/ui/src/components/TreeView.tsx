'use client';

// File: packages/ui/src/components/TreeView.tsx  [TRACE:FILE=packages.ui.components.TreeView]
// Purpose: Hierarchical tree view with expand/collapse and selection.
//          Provides accessible tree navigation with keyboard support.
//
// Relationship: Depends on @repo/utils (cn), lucide-react, Collapsible component.
// System role: Navigation primitive (Layer L2 @repo/ui).
// Assumptions: Used for hierarchical data display. No virtual scrolling.
//
// Exports / Entry: TreeView component and sub-components, TreeViewProps
// Used by: File browsers, navigation trees, hierarchical data displays
//
// Invariants:
// - No virtual scrolling (basic tree only)
// - Keyboard accessible navigation
//
// Status: @public
// Features:
// - [FEAT:UI] Expand/collapse functionality
// - [FEAT:UI] Selection support
// - [FEAT:ACCESSIBILITY] Keyboard navigation

import * as React from 'react';
import { ChevronRight, Folder, FolderOpen, File } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: unknown;
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tree data */
  data: TreeNode[];
  /** Selected node IDs */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Whether to allow multiple selection */
  multiple?: boolean;
  /** Expanded node IDs */
  expandedIds?: string[];
  /** Callback when expansion changes */
  onExpansionChange?: (expandedIds: string[]) => void;
}

export interface TreeNodeProps {
  /** Node data */
  node: TreeNode;
  /** Level in tree (for indentation) */
  level?: number;
  /** Whether node is selected */
  isSelected?: boolean;
  /** Whether node is expanded */
  isExpanded?: boolean;
  /** Callback when node is selected */
  onSelect?: (nodeId: string) => void;
  /** Callback when node is expanded/collapsed */
  onToggle?: (nodeId: string) => void;
}

// ─── Components ──────────────────────────────────────────────────────────────

const TreeNodeComponent = ({
  node,
  level = 0,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isSelected && 'bg-accent text-accent-foreground',
          'cursor-pointer min-h-[24px] min-w-[24px]'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(node.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(node.id);
          }
        }}
        tabIndex={0}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(node.id);
            }}
            className="flex items-center justify-center"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronRight
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
            />
          </button>
        ) : (
          <span className="w-4" />
        )}
        {node.icon ||
          (hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )
          ) : (
            <File className="h-4 w-4" />
          ))}
        <span>{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      data,
      selectedIds = [],
      onSelectionChange,
      multiple = false,
      expandedIds = [],
      onExpansionChange,
      ...props
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = React.useState<string[]>(selectedIds);
    const [internalExpanded, setInternalExpanded] = React.useState<string[]>(expandedIds);

    React.useEffect(() => {
      setInternalSelected(selectedIds);
    }, [selectedIds]);

    React.useEffect(() => {
      setInternalExpanded(expandedIds);
    }, [expandedIds]);

    const handleSelect = (nodeId: string) => {
      const newSelected = multiple
        ? internalSelected.includes(nodeId)
          ? internalSelected.filter((id) => id !== nodeId)
          : [...internalSelected, nodeId]
        : [nodeId];
      setInternalSelected(newSelected);
      onSelectionChange?.(newSelected);
    };

    const handleToggle = (nodeId: string) => {
      const newExpanded = internalExpanded.includes(nodeId)
        ? internalExpanded.filter((id) => id !== nodeId)
        : [...internalExpanded, nodeId];
      setInternalExpanded(newExpanded);
      onExpansionChange?.(newExpanded);
    };

    return (
      <div ref={ref} role="tree" className={cn('rounded-md border p-2', className)} {...props}>
        {data.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            isSelected={internalSelected.includes(node.id)}
            isExpanded={internalExpanded.includes(node.id)}
            onSelect={handleSelect}
            onToggle={handleToggle}
          />
        ))}
      </div>
    );
  }
);
TreeView.displayName = 'TreeView';
