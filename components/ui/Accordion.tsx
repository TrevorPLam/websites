'use client'

import React, { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Simple accessible accordion; single-item open state keyed for FAQ blocks
export interface AccordionItem {
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const accordionId = useId()

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => {
        // Use question as stable key (unique identifier)
        const itemKey = item.question.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '-')
        
        return (
        <div
          key={itemKey}
          className="bg-off-white rounded-lg border border-gray-200 overflow-hidden"
        >
          {(() => {
            const buttonId = `${accordionId}-button-${index}`
            const panelId = `${accordionId}-panel-${index}`

            return (
              <>
          <button
            id={buttonId}
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={panelId}
          >
            <span className="font-semibold text-charcoal pr-4">{item.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-slate transition-transform flex-shrink-0',
                openIndex === index && 'transform rotate-180'
              )}
            />
          </button>
          {openIndex === index && (
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="px-6 pb-4"
            >
              <p className="text-slate leading-relaxed">{item.answer}</p>
            </div>
          )}
              </>
            )
          })()}
        </div>
      )})}
    </div>
  )
}
