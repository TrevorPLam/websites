import React from 'react'
import { cn } from '@repo/utils'

// Section shell that standardizes vertical rhythm across pages
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

export default Section
