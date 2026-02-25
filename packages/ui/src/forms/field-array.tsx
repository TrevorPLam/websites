/**
 * @file packages/ui/src/forms/field-array.tsx
 * @summary Dynamic field array component for form management.
 * @description Provides reusable field array with add/remove functionality and validation.
 * @security none
 * @adr none
 * @requirements DOMAIN-3-1
 */

/**
 * Simple field array components for dynamic form management
 */

import * as React from 'react';
import { UseFormReturn, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { Button } from '../components/Button';

// ─── Field Array Item Component ───────────────────────────────────────────────────────

export interface FieldArrayItemProps {
  index: number;
  children: React.ReactNode;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canRemove?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function FieldArrayItem({
  index,
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove = true,
  canMoveUp = false,
  canMoveDown = false,
}: FieldArrayItemProps) {
  return (
    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-white">
      <div className="flex-1">{children}</div>
      <div className="flex items-center space-x-1">
        {canMoveUp && (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={onMoveUp}
            className="px-2"
          >
            ↑
          </Button>
        )}
        {canMoveDown && (
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={onMoveDown}
            className="px-2"
          >
            ↓
          </Button>
        )}
        {canRemove && (
          <Button
            type="button"
            variant="destructive"
            size="small"
            onClick={onRemove}
            className="px-2"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Dynamic Form Field Array Component ─────────────────────────────────────────────────--

export interface DynamicFieldArrayProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  renderItem: (index: number) => React.ReactNode;
  defaultItemValue?: any;
  addLabel?: string;
  clearLabel?: string;
  maxItems?: number;
}

export function DynamicFieldArray<T extends FieldValues>({
  form,
  name,
  renderItem,
  defaultItemValue = {},
  addLabel = 'Add Item',
  clearLabel = 'Clear All',
  maxItems,
}: DynamicFieldArrayProps<T>) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name,
  });

  const canAdd = !maxItems || fields.length < maxItems;

  const handleAdd = () => {
    append(defaultItemValue);
  };

  const handleClear = () => {
    remove();
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <FieldArrayItem
          key={field.id}
          index={index}
          onRemove={() => handleRemove(index)}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
          canRemove={fields.length > 1}
          canMoveUp={index > 0}
          canMoveDown={index < fields.length - 1}
        >
          {renderItem(index)}
        </FieldArrayItem>
      ))}
      <div className="flex items-center space-x-2">
        {fields.length > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700"
          >
            {clearLabel}
          </Button>
        )}
        {canAdd && (
          <Button
            type="button"
            onClick={handleAdd}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
