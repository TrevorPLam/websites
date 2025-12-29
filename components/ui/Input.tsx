import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  isValid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, isValid, type = 'text', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-slate font-semibold mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-off-white text-charcoal transition-all placeholder:text-slate',
              'focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none',
              error && 'border-error focus:border-error focus:ring-error/20',
              !error && isValid && 'border-success focus:border-success focus:ring-success/20',
              !error && !isValid && 'border-gray-300',
              isValid && 'pr-10',
              className
            )}
            {...props}
          />
          {isValid && !error && (
            <CheckCircle2
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success"
              aria-hidden="true"
            />
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
