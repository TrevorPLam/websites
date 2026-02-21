'use client';

// File: packages/ui/src/components/DatePicker.tsx  [TRACE:FILE=packages.ui.components.DatePicker]
// Purpose: Date picker combining Calendar and Popover for date selection.
//          Combines Calendar component with Popover for accessible date selection.
//
// Relationship: Depends on Calendar, Popover, @repo/utils (cn), lucide-react.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for date selection in forms. Date only, no time selection.
//
// Exports / Entry: DatePicker, DatePickerProps
// Used by: Forms requiring date selection
//
// Invariants:
// - Combines Calendar and Popover components
// - Date only (no time selection)
// - Proper date formatting
//
// Status: @public
// Features:
// - [FEAT:UI] Date picker with calendar popover
// - [FEAT:UI] Date formatting support
// - [FEAT:ACCESSIBILITY] Full keyboard navigation

import * as React from 'react';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  /** Selected date */
  date?: Date;
  /** Callback when date changes */
  onDateChange?: (date: Date | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Date format function */
  formatDate?: (date: Date) => string;
  /** Locale for date formatting */
  locale?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

// [TRACE:FUNC=packages.ui.components.DatePicker]
// [FEAT:UI] [FEAT:ACCESSIBILITY]
export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled,
  formatDate = (d) => d.toLocaleDateString(),
  locale,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    onDateChange?.(newDate);
    if (newDate) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          _variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDate(selectedDate) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar value={selectedDate} onValueChange={handleDateSelect} locale={locale} />
      </PopoverContent>
    </Popover>
  );
}
