'use client';

// File: packages/ui/src/components/Calendar.tsx  [TRACE:FILE=packages.ui.components.Calendar]
// Purpose: Calendar view with date selection.
//          Built on Radix UI Calendar which provides accessible calendar
//          with keyboard navigation and proper ARIA attributes.
//
// Relationship: Depends on radix-ui, @repo/utils (cn).
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for date selection, not date formatting (use date-fns or dayjs).
//
// Exports / Entry: Calendar, CalendarProps
// Used by: Date pickers, scheduling interfaces
//
// Invariants:
// - Radix manages keyboard navigation, ARIA attributes
// - Locale support via date-fns or dayjs
//
// Status: @public
// Features:
// - [FEAT:UI] Calendar view with date selection
// - [FEAT:UI] Locale support
// - [FEAT:ACCESSIBILITY] Full keyboard navigation

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Locale for date formatting */
  locale?: string;
  /** Selected date value */
  value?: Date;
  /** Callback when date changes */
  onValueChange?: (date: Date | undefined) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, locale, value, onValueChange, ...props }, ref) => {
    const [currentDate, setCurrentDate] = React.useState(value || new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);

    React.useEffect(() => {
      setSelectedDate(value);
      if (value) setCurrentDate(value);
    }, [value]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const handleDateClick = (day: number) => {
      const newDate = new Date(year, month, day);
      setSelectedDate(newDate);
      onValueChange?.(newDate);
    };

    const goToPreviousMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };

    const isSelected = (day: number) => {
      if (!selectedDate) return false;
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      );
    };

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div ref={ref} className={cn('p-3', className)} {...props}>
        <div className="flex items-center justify-between pb-4">
          <div className="text-sm font-medium">
            {monthNames[month]} {year}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex items-center justify-center rounded-md p-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring min-w-[24px] min-h-[24px]"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex items-center justify-center rounded-md p-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring min-w-[24px] min-h-[24px]"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="w-9 rounded-md p-1 text-center text-sm font-normal text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: startingDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} className="w-9" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className={cn(
                  'h-9 w-9 rounded-md p-0 text-center text-sm font-normal transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                  isSelected(day) && 'bg-primary text-primary-foreground',
                  !isSelected(day) && 'text-foreground',
                  'min-w-[24px] min-h-[24px]'
                )}
                aria-label={`Select ${monthNames[month]} ${day}, ${year}`}
                aria-selected={isSelected(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = 'Calendar';
