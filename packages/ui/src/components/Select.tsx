import React, { useId } from 'react'
import { cn } from '@repo/utils'

// Labeled select with error styling; keeps forms consistent with Input/Textarea
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id || props.name || generatedId

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-slate font-semibold mb-2" htmlFor={selectId}>
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-off-white text-charcoal transition-all',
            'focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none',
            error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
