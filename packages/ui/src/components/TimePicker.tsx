// File: packages/ui/src/components/TimePicker.tsx  [TRACE:FILE=packages.ui.components.TimePicker]
// Purpose: Time picker with hour/minute/second selection.
//          Provides accessible time selection with 12h/24h format support.
//
// Relationship: Depends on @repo/utils (cn), Popover, Button components.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for time selection. Local time only, no timezone support.
//
// Exports / Entry: TimePicker, TimePickerProps
// Used by: Forms requiring time selection
//
// Invariants:
// - Local time only (no timezone support)
// - Keyboard accessible
//
// Status: @public
// Features:
// - [FEAT:UI] Hour/minute/second selection
// - [FEAT:UI] 12h/24h format support
// - [FEAT:ACCESSIBILITY] Keyboard navigation

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@repo/utils';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimePickerProps {
  /** Selected time value (Date object, time portion used) */
  value?: Date;
  /** Callback when time changes */
  onValueChange?: (time: Date | undefined) => void;
  /** Time format */
  format?: '12h' | '24h';
  /** Whether to show seconds */
  showSeconds?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TimePicker({
  value,
  onValueChange,
  format = '12h',
  showSeconds = false,
  placeholder = 'Select time',
  disabled,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  const formatTime = (date: Date | undefined): string => {
    if (!date) return '';
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return showSeconds
        ? `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`
        : `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    return showSeconds
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeSelect = (hours: number, minutes: number, seconds: number) => {
    const newTime = new Date();
    newTime.setHours(hours, minutes, seconds, 0);
    setSelectedTime(newTime);
    onValueChange?.(newTime);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selectedTime && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? formatTime(selectedTime) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex gap-2">
          {/* Hours */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Hour</label>
            <select
              className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm"
              value={selectedTime?.getHours() || 0}
              onChange={(e) => {
                const hours = parseInt(e.target.value);
                const minutes = selectedTime?.getMinutes() || 0;
                const seconds = selectedTime?.getSeconds() || 0;
                handleTimeSelect(hours, minutes, seconds);
              }}
            >
              {Array.from({ length: format === '12h' ? 12 : 24 }, (_, i) => {
                const hour = format === '12h' ? (i === 0 ? 12 : i) : i;
                return (
                  <option key={i} value={format === '12h' ? (i === 0 ? 0 : i) : i}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Minutes */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Minute</label>
            <select
              className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm"
              value={selectedTime?.getMinutes() || 0}
              onChange={(e) => {
                const hours = selectedTime?.getHours() || 0;
                const minutes = parseInt(e.target.value);
                const seconds = selectedTime?.getSeconds() || 0;
                handleTimeSelect(hours, minutes, seconds);
              }}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          {showSeconds && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Second</label>
              <select
                className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm"
                value={selectedTime?.getSeconds() || 0}
                onChange={(e) => {
                  const hours = selectedTime?.getHours() || 0;
                  const minutes = selectedTime?.getMinutes() || 0;
                  const seconds = parseInt(e.target.value);
                  handleTimeSelect(hours, minutes, seconds);
                }}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          )}
          {format === '12h' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Period</label>
              <select
                className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm"
                value={selectedTime && selectedTime.getHours() >= 12 ? 'PM' : 'AM'}
                onChange={(e) => {
                  const hours = selectedTime?.getHours() || 0;
                  const minutes = selectedTime?.getMinutes() || 0;
                  const seconds = selectedTime?.getSeconds() || 0;
                  const currentHours = hours % 12;
                  const newHours = e.target.value === 'PM' ? currentHours + 12 : currentHours;
                  handleTimeSelect(newHours, minutes, seconds);
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
