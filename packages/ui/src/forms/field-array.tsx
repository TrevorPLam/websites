/**
 * @file packages/ui/src/forms/field-array.tsx
 * @summary Form field array utilities for dynamic form management.
 * @description Provides enhanced field array controls with validation and accessibility.
 * @security None - UI form utilities only.
 * @adr none
 * @requirements none
 */

import * as React from 'react';
import { UseFormReturn, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { Button } from '../components/Button';
import { cn } from '@repo/utils';

// ─── Field Array Item Component ───────────────────────────────────────────────────────

export interface FieldArrayItemProps {
  index: number;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canRemove?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

/**
 * Renders a single field array item with controls for removal and reordering.
 *
 * @param index - The index of the item in the field array.
 * @param children - The form fields to render for this item.
 * @param onRemove - Callback function called when the item is removed.
 * @param onMoveUp - Callback function called when the item is moved up.
 * @param onMoveDown - Callback function called when the item is moved down.
 * @param canRemove - Whether the remove button should be enabled.
 * @param canMoveUp - Whether the move up button should be enabled.
 * @param canMoveDown - Whether the move down button should be enabled.
 * @returns A React component rendering the field array item.
 */
export function FieldArrayItem({
  index,
  children,
  className,
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove = true,
  canMoveUp = false,
  canMoveDown = false,
}: FieldArrayItemProps) {
  return (
    <div className={cn('flex items-center space-x-2 p-4 border rounded-lg bg-white', className)}>
      <div className="flex-1">{children}</div>
      <div className="flex items-center space-x-1">
        {canMoveUp && (
          <Button type="button" variant="outline" size="small" onClick={onMoveUp} className="px-2">
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

// ─── Field Array Controls Component ─────────────────────────────────────────────────--

export interface FieldArrayControlsProps {
  canAdd?: boolean;
  canClear?: boolean;
  addLabel?: string;
  clearLabel?: string;
  className?: string;
  onAdd?: () => void;
  onClear?: () => void;
  itemCount?: number;
}

/**
 * Renders control buttons for adding and clearing field array items.
 *
 * @param canAdd - Whether the add button should be enabled.
 * @param canClear - Whether the clear button should be enabled.
 * @param addLabel - Text label for the add button.
 * @param clearLabel - Text label for the clear button.
 * @param onAdd - Callback function called when add is clicked.
 * @param onClear - Callback function called when clear is clicked.
 * @param itemCount - Current number of items in the array.
 * @returns A React component rendering the control buttons.
 */
export function FieldArrayControls({
  canAdd = true,
  canClear = false,
  addLabel = 'Add Item',
  clearLabel = 'Clear All',
  className,
  onAdd,
  onClear,
  itemCount = 0,
}: FieldArrayControlsProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {canClear && itemCount > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className="text-red-600 hover:text-red-700"
        >
          {clearLabel}
        </Button>
      )}
      {canAdd && (
        <Button type="button" onClick={onAdd} className="bg-blue-600 text-white hover:bg-blue-700">
          {addLabel}
        </Button>
      )}
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
  className?: string;
  maxItems?: number;
}

/**
 * Renders a dynamic field array with automatic state management and controls.
 *
 * @param form - React Hook Form instance for managing the field array state.
 * @param name - Field name path in the form.
 * @param renderItem - Function that renders the form fields for each item.
 * @param defaultItemValue - Default value for new items.
 * @param addLabel - Text label for the add button.
 * @param clearLabel - Text label for the clear button.
 * @param maxItems - Maximum number of items allowed.
 * @returns A React component rendering the dynamic field array.
 */
export function DynamicFieldArray<T extends FieldValues>({
  form,
  name,
  renderItem,
  defaultItemValue = {},
  addLabel = 'Add Item',
  clearLabel = 'Clear All',
  className,
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
    <div className={cn('space-y-4', className)}>
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
      <FieldArrayControls
        canAdd={canAdd}
        canClear={fields.length > 1}
        onAdd={handleAdd}
        onClear={handleClear}
        addLabel={addLabel}
        clearLabel={clearLabel}
        itemCount={fields.length}
      />
    </div>
  );
}

// ─── Form Field Helper Component ─────────────────────────────────────────────────────

export interface FormFieldHelperProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Renders a form field with label, description, error states, and helper text.
 *
 * @param form - React Hook Form instance for managing the field state.
 * @param name - Field name path in the form.
 * @param label - Display label for the field.
 * @param description - Optional description text shown below the label.
 * @param required - Whether the field is required.
 * @param placeholder - Placeholder text for input fields.
 * @param type - Input type for text-based fields.
 * @param disabled - Whether the field should be disabled.
 * @param children - The form field component to render.
 * @returns A React component rendering the complete form field.
 */
export function FormFieldHelper<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required,
  placeholder,
  type = 'text',
  disabled = false,
  className,
}: FormFieldHelperProps<T>) {
  const error = form.formState.errors[name];
  const touched = form.formState.touchedFields[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={name as string}
          className={cn(
            'text-sm font-medium',
            required && 'after:content-["*"] after:ml-1 after:text-red-500'
          )}
        >
          {label}
        </label>
      )}
      <input
        id={name as string}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          touched && error && 'border-red-500 focus:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...form.register(name)}
      />
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {error && touched && <p className="text-sm text-red-600">{error.message as string}</p>}
    </div>
  );
}
