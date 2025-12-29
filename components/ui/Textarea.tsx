import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  isValid?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isValid, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-slate font-semibold mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-off-white text-charcoal transition-all placeholder:text-slate resize-y',
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
              className="absolute right-3 top-3 w-5 h-5 text-success"
              aria-hidden="true"
            />
          )}
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
