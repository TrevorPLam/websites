import React from 'react'

/**
 * @file apps/web/src/widgets/testimonial-card/ui/TestimonialCard.tsx
 * @summary Testimonial card component.
 * @description Individual customer testimonial card.
 */

export interface TestimonialCardProps {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating?: number
}

export function TestimonialCard({ name, role, company, content, avatar, rating = 5 }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">★</span>
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-6 leading-relaxed">
        "{content}"
      </blockquote>
      
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
          ) : (
            name.charAt(0)
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
      </div>
    </div>
  )
}
