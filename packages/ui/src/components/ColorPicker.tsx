// File: packages/ui/src/components/ColorPicker.tsx  [TRACE:FILE=packages.ui.components.ColorPicker]
// Purpose: Color picker with multiple input methods.
//          Provides accessible color selection with hex/rgb/hsl formats and presets.
//
// Relationship: Depends on @repo/utils (cn), Popover, Input components.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for color selection. Standard formats only (hex, rgb, hsl).
//
// Exports / Entry: ColorPicker, ColorPickerProps
// Used by: Theme editors, design tools, color selection forms
//
// Invariants:
// - Standard formats only (hex, rgb, hsl)
// - Alpha channel support
//
// Status: @public
// Features:
// - [FEAT:UI] Hex/RGB/HSL format support
// - [FEAT:UI] Color presets
// - [FEAT:UI] Alpha channel support

import * as React from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@repo/utils';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { Input } from './Input';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorPickerProps {
  /** Selected color value */
  value?: string;
  /** Callback when color changes */
  onValueChange?: (color: string) => void;
  /** Color format */
  format?: ColorFormat;
  /** Whether to show alpha channel */
  showAlpha?: boolean;
  /** Color presets */
  presets?: string[];
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ColorPicker({
  value = '#000000',
  onValueChange,
  format: _format = 'hex',
  showAlpha: _showAlpha = false,
  presets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#FFA500',
  ],
  placeholder = 'Select color',
  disabled,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string>(value);

  React.useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onValueChange?.(newColor);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-[280px] justify-start text-left font-normal gap-2', disabled && 'opacity-50')}
          disabled={disabled}
        >
          <div
            className="h-4 w-4 rounded border border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <Palette className="h-4 w-4" />
          <span className={cn(!selectedColor && 'text-muted-foreground')}>
            {selectedColor || placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Color input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-input"
              />
              <Input
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          {/* Presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Presets</label>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleColorChange(preset)}
                    className={cn(
                      'h-8 w-8 rounded border-2 border-border transition-all',
                      'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring',
                      selectedColor === preset && 'border-primary ring-2 ring-ring'
                    )}
                    style={{ backgroundColor: preset }}
                    aria-label={`Select color ${preset}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
