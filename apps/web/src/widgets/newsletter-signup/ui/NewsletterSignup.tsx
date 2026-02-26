import React from 'react'

/**
 * @file apps/web/src/widgets/newsletter-signup/ui/NewsletterSignup.tsx
 * @summary Newsletter signup component.
 * @description Email newsletter subscription form.
 */

import { useState } from 'react'

export interface NewsletterSignupProps {
  title?: string
  description?: string
  onSubmit?: (email: string) => void
}

export function NewsletterSignup({ 
  title = "Stay Updated", 
  description = "Get the latest updates and exclusive content delivered to your inbox.",
  onSubmit 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit?.(email)
      setEmail('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
