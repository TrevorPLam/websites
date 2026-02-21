// File: packages/ui/src/components/DragAndDrop.tsx  [TRACE:FILE=packages.ui.components.DragAndDrop]
// Purpose: Drag and drop component with sortable lists and reordering.
//          Built on @dnd-kit for accessible drag and drop functionality.
//
// Relationship: Depends on @dnd-kit/core, @dnd-kit/sortable, @repo/utils (cn).
// System role: Interaction primitive (Layer L2 @repo/ui).
// Assumptions: Used for reorderable lists. Keyboard accessible.
//
// Exports / Entry: DragAndDrop, SortableList, DragAndDropProps
// Used by: Reorderable lists, drag-and-drop interfaces
//
// Invariants:
// - No custom drag preview (default preview only)
// - Keyboard accessible
// - Touch support
//
// Status: @public
// Features:
// - [FEAT:UI] Drag and drop functionality
// - [FEAT:UI] Reordering support
// - [FEAT:ACCESSIBILITY] Keyboard navigation and touch support

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DragAndDropProps<T = unknown> {
  /** Items to render */
  items: T[];
  /** Callback when items are reordered */
  onItemsChange: (items: T[]) => void;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Key function to get unique ID for each item */
  getItemId: (item: T) => string;
  /** Class name */
  className?: string;
}

export interface SortableItemProps {
  /** Item ID */
  id: string;
  /** Item content */
  children: React.ReactNode;
  /** Whether to show drag handle */
  showHandle?: boolean;
}

// ─── Components ──────────────────────────────────────────────────────────────

const SortableItem = ({ id, children, showHandle = true }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {showHandle && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring min-w-[24px] min-h-[24px] flex items-center justify-center"
          aria-label="Drag handle"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export function DragAndDrop<T = unknown>({
  items,
  onItemsChange,
  renderItem,
  getItemId,
  className,
}: DragAndDropProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => getItemId(item) === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsChange(newItems);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(getItemId)} strategy={verticalListSortingStrategy}>
        <div className={cn('space-y-2', className)}>
          {items.map((item, index) => (
            <SortableItem key={getItemId(item)} id={getItemId(item)}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
